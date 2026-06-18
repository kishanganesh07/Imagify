import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import util from 'util';
const execFileAsync = util.promisify(execFile);

async function testRembg() {
    console.log("Testing rembg-node...");
    try {
        const { Rembg } = await import('rembg-node');
        const sharp = (await import('sharp')).default;
        
        // Create a simple dummy image
        const buffer = await sharp({
            create: { width: 100, height: 100, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } }
        }).png().toBuffer();
        
        const input = sharp(buffer);
        const rembg = new Rembg({ logging: false });
        const output = await rembg.remove(input);
        const resultBuffer = await output.png().toBuffer();
        console.log("rembg-node works! Output buffer size:", resultBuffer.length);
    } catch (err) {
        console.error("rembg-node error:", err);
    }
}

async function testRealESRGAN() {
    console.log("Testing Real-ESRGAN...");
    try {
        const sharp = (await import('sharp')).default;
        const buffer = await sharp({
            create: { width: 100, height: 100, channels: 4, background: { r: 0, g: 255, b: 0, alpha: 1 } }
        }).png().toBuffer();
        
        const tempId = Date.now();
        const inputPath = path.join(process.cwd(), `temp_in_${tempId}.png`);
        const outputPath = path.join(process.cwd(), `temp_out_${tempId}.png`);
        
        await fs.promises.writeFile(inputPath, buffer);
        const exePath = path.join(process.cwd(), 'bin', 'realesrgan', 'realesrgan-ncnn-vulkan.exe');
        
        await execFileAsync(exePath, ['-i', inputPath, '-o', outputPath]);
        const resultBuffer = await fs.promises.readFile(outputPath);
        console.log("Real-ESRGAN works! Output buffer size:", resultBuffer.length);
        
        await fs.promises.unlink(inputPath).catch(()=>null);
        await fs.promises.unlink(outputPath).catch(()=>null);
    } catch (err) {
        console.error("Real-ESRGAN error:", err);
    }
}

async function runTests() {
    await testRembg();
    await testRealESRGAN();
}

runTests();
