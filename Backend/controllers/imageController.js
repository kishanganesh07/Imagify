import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"
import { processImage } from '../services/imageOptimizer.js';
import { uploadToCloudinary } from '../services/cloudinary.js';
export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }
        
        // Admin bypass
        const isAdmin = user.role === "admin";
        if (!isAdmin && (user.creditBalance === 0 || user.creditBalance < 0)) {
            return res.json({ success: false, creditBalance: user.creditBalance, message: "Insufficient Credits" });
        }
        
        const { data } = await axios.post(
            "https://api.openai.com/v1/images/generations",
            {
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: "b64_json"
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const base64Image = data.data[0].b64_json;
        const resultImage = `data:image/png;base64,${base64Image}`;
        
        let newBalance = user.creditBalance;
        if (!isAdmin) {
            newBalance -= 1;
            await userModel.findByIdAndUpdate(user._id, { creditBalance: newBalance });
        }
        
        res.json({ success: true, message: "Image Generated", creditBalance: newBalance, resultImage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Image generation failed. Please try again." });
    }
};

export const optimizeImage = async (req, res) => {
    try {
        const { mode } = req.body;
        // req.file is provided by multer
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        // 1. Process image with sharp
        const processedData = await processImage(req.file.buffer, mode);

        // 2. Upload to Cloudinary (if keys are missing, we skip and return base64 instead to prevent crashes locally)
        let resultUrl = '';
        if (process.env.CLOUDINARY_API_KEY) {
            const uploadResult = await uploadToCloudinary(processedData.buffer);
            resultUrl = uploadResult.secure_url;
        } else {
            // Fallback for local testing without cloudinary
            const base64 = processedData.buffer.toString('base64');
            resultUrl = `data:image/${processedData.format};base64,${base64}`;
        }

        res.json({
            success: true,
            message: "Image Optimized!",
            originalSizeKB: (processedData.originalSize / 1024).toFixed(2),
            newSizeKB: (processedData.newSize / 1024).toFixed(2),
            reductionRatio: processedData.reductionRatio + '%',
            resultUrl
        });

    } catch (error) {
        console.error("Optimization Error:", error);
        res.status(500).json({ success: false, message: "Image optimization failed." });
    }
};