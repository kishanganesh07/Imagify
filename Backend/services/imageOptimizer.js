import sharp from 'sharp';

export const processImage = async (buffer, mode) => {
  let sharpInstance = sharp(buffer);
  
  // Get original metadata to calculate metrics
  const metadata = await sharpInstance.metadata();
  
  switch (mode) {
    case 'instagram':
      // Instagram ideally wants 1080x1080
      sharpInstance = sharpInstance
        .resize(1080, 1080, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85, chromaSubsampling: '4:4:4' });
      break;
      
    case 'whatsapp':
      // WhatsApp compresses heavily, let's aggressively scale it down so it stays clean
      sharpInstance = sharpInstance
        .resize(800, null, { withoutEnlargement: true }) // max width 800
        .jpeg({ quality: 60 });
      break;
      
    case 'auto':
    default:
      // Auto: Smart compression to webp
      sharpInstance = sharpInstance
        .webp({ quality: 75, effort: 4 }); // Effort 4 means high CPU compression effort
      break;
  }
  
  const outputBuffer = await sharpInstance.toBuffer();
  
  return {
    buffer: outputBuffer,
    originalSize: buffer.length,
    newSize: outputBuffer.length,
    reductionRatio: ((buffer.length - outputBuffer.length) / buffer.length * 100).toFixed(2),
    format: mode === 'auto' ? 'webp' : 'jpeg'
  };
};
