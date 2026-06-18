import axios from "axios";
import FormData from "form-data";
import userModel from "../models/userModel.js";
import creationModel from "../models/creationModel.js";
import { uploadToCloudinary } from "../services/cloudinary.js";
import { generateSlug } from "../utils/helpers.js";
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import util from 'util';

const execFileAsync = util.promisify(execFile);

const CLIPDROP_API = process.env.CLIPDROP_API;

const validateCredits = async (userId) => {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");
    
    // Admin bypass
    if (user.role === "admin") {
        return user;
    }
    
    if (user.creditBalance <= 0) throw new Error("Insufficient Credits");
    return user;
};

const processImageTool = async ({ req, res, toolType, endpointUrl, buildFormData, apiProvider = 'clipdrop', prompt, style = "normal", tags = [] }) => {
    try {
        const { userId, isPublic } = req.body;
        const user = await validateCredits(userId);

        let bufferToUpload;
        
        const payload = await buildFormData();
        
        if (apiProvider === 'realesrgan') {
            const tempId = Date.now() + Math.floor(Math.random() * 1000);
            const inputPath = path.join(process.cwd(), `temp_in_${tempId}.png`);
            const outputPath = path.join(process.cwd(), `temp_out_${tempId}.png`);
            
            await fs.promises.writeFile(inputPath, req.file.buffer);
            
            const exePath = path.join(process.cwd(), 'bin', 'realesrgan', 'realesrgan-ncnn-vulkan.exe');
            
            await execFileAsync(exePath, ['-i', inputPath, '-o', outputPath]);
            
            bufferToUpload = await fs.promises.readFile(outputPath);
            
            await fs.promises.unlink(inputPath).catch(()=>null);
            await fs.promises.unlink(outputPath).catch(()=>null);
        } else if (apiProvider === 'openai') {
            const headers = {
                'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
                ...(payload.getHeaders ? payload.getHeaders() : { 'Content-Type': 'application/json' })
            };
            const { data } = await axios.post(endpointUrl, payload, { headers });
            bufferToUpload = Buffer.from(data.data[0].b64_json, 'base64');
        } else if (apiProvider === 'removebg') {
            const { data } = await axios.post(endpointUrl, payload, {
                headers: {
                    'X-Api-Key': 'fF51ktX2HM5VBKS2MNDTZYaZ',
                    ...(payload.getHeaders ? payload.getHeaders() : {})
                },
                responseType: 'arraybuffer'
            });
            bufferToUpload = Buffer.from(data, 'binary');
        } else {
            const { data } = await axios.post(endpointUrl, payload, {
                headers: {
                    'x-api-key': CLIPDROP_API,
                    ...(payload.getHeaders ? payload.getHeaders() : {})
                },
                responseType: 'arraybuffer'
            });
            bufferToUpload = Buffer.from(data, 'binary');
        }
        
        let beforeUrl = "";
        let beforePublicId = "";
        let resultUrl = "";
        let resultPublicId = "";

        if (process.env.CLOUDINARY_API_KEY) {
            if (req.file) {
                const [beforeUpload, resultUpload] = await Promise.all([
                    uploadToCloudinary(req.file.buffer, 'imagify_originals'),
                    uploadToCloudinary(bufferToUpload, 'imagify_results')
                ]);
                beforeUrl = beforeUpload.secure_url;
                beforePublicId = beforeUpload.public_id;
                resultUrl = resultUpload.secure_url;
                resultPublicId = resultUpload.public_id;
            } else {
                const resultUpload = await uploadToCloudinary(bufferToUpload, 'imagify_results');
                resultUrl = resultUpload.secure_url;
                resultPublicId = resultUpload.public_id;
            }
        } else {
            // Fallback to base64 for local testing without Cloudinary
            const base64Result = bufferToUpload.toString('base64');
            resultUrl = `data:image/png;base64,${base64Result}`;
            resultPublicId = `local_result_${Date.now()}`;
            
            if (req.file) {
                const base64Before = req.file.buffer.toString('base64');
                beforeUrl = `data:${req.file.mimetype};base64,${base64Before}`;
                beforePublicId = `local_before_${Date.now()}`;
            }
        }

        const slug = generateSlug(prompt || toolType);

        const newCreation = new creationModel({
            userId: user._id,
            slug,
            imageUrl: resultUrl,
            publicId: resultPublicId,
            beforeImageUrl: beforeUrl,
            beforePublicId: beforePublicId,
            prompt: prompt || "",
            style,
            tags,
            toolType,
            status: "completed",
            isPublic: isPublic === 'true' || isPublic === true
        });

        await newCreation.save();
        
        let newBalance = user.creditBalance;
        if (user.role !== "admin") {
            newBalance -= 1;
            await userModel.findByIdAndUpdate(user._id, { creditBalance: newBalance });
        }

        res.json({ success: true, message: `${toolType} completed`, creation: newCreation, creditBalance: newBalance });

    } catch (error) {
        let errorMsg = error.message;
        if (error?.response?.data) {
            if (Buffer.isBuffer(error.response.data) || error.response.data instanceof ArrayBuffer) {
                errorMsg = Buffer.from(error.response.data).toString();
            } else if (typeof error.response.data === 'object') {
                errorMsg = JSON.stringify(error.response.data);
            } else {
                errorMsg = String(error.response.data);
            }
        }
        console.error(`Error in ${toolType}:`, errorMsg);
        res.status(500).json({ success: false, message: errorMsg || "Operation failed" });
    }
};

export const textToImage = async (req, res) => {
    const { prompt, style = "normal", aspectRatio = "1:1" } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const finalPrompt = style !== "normal" ? `${prompt}, in ${style} style` : prompt;

    await processImageTool({
        req, res,
        toolType: "text-to-image",
        apiProvider: "clipdrop",
        endpointUrl: "https://clipdrop-api.co/text-to-image/v1",
        prompt: finalPrompt,
        style,
        tags: [style, "generated"],
        buildFormData: () => {
            const formData = new FormData();
            formData.append('prompt', finalPrompt);
            return formData;
        }
    });
};

export const imageToImage = async (req, res) => {
    const { prompt, style = "normal" } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    await processImageTool({
        req, res,
        toolType: "image-to-image",
        apiProvider: "clipdrop",
        endpointUrl: "https://clipdrop-api.co/reimagine/v1/reimagine",
        prompt,
        style,
        tags: [style, "image-to-image", "style-transfer"],
        buildFormData: () => {
            const formData = new FormData();
            formData.append("image_file", req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });
            return formData;
        }
    });
};

export const removeBackground = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    await processImageTool({
        req, res,
        toolType: "bg-removal",
        apiProvider: "removebg",
        endpointUrl: "https://api.remove.bg/v1.0/removebg",
        tags: ["bg-removal", "transparent"],
        buildFormData: () => {
            const formData = new FormData();
            formData.append("image_file", req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });
            formData.append("size", "auto");
            return formData;
        }
    });
};

export const upscaleImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    await processImageTool({
        req, res,
        toolType: "upscale",
        apiProvider: "realesrgan",
        tags: ["upscale", "hd", "super-resolution"],
        buildFormData: () => null
    });
};

export const enhancePrompt = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

        const payload = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert AI image prompt engineer. Take the user's short idea and expand it into a highly detailed, evocative, cinematic, and ultra-realistic prompt suitable for Midjourney or Stable Diffusion. Include lighting, camera details, and mood. Return ONLY the enhanced prompt string, without quotes or conversational filler."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 150
        };

        const { data } = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
            headers: {
                'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const enhancedPrompt = data.choices[0].message.content.trim();
        res.json({ success: true, enhancedPrompt });
    } catch (error) {
        console.error("Enhance prompt error:", error?.response?.data || error.message);
        res.status(500).json({ success: false, message: "Failed to enhance prompt" });
    }
};
