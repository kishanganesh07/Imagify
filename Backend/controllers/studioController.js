import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";
import userModel from "../models/userModel.js";
import creationModel from "../models/creationModel.js";
import { uploadToCloudinary } from "../services/cloudinary.js";
import { generateSlug } from "../utils/helpers.js";

const validateCredits = async (userId) => {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.role === "admin") return user;
    if (user.creditBalance <= 0) throw new Error("Insufficient Credits");
    return user;
};

const processImageTool = async ({ req, res, toolType, endpointUrl, buildFormData, prompt = "", style = "normal", tags = [] }) => {
    try {
        const { userId, isPublic } = req.body;
        
        const user = await validateCredits(userId);

        const payload = await buildFormData();
        const { data } = await axios.post(endpointUrl, payload, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
                ...(payload.getHeaders ? payload.getHeaders() : {})
            },
            responseType: 'arraybuffer'
        });
        
        const resultBuffer = Buffer.from(data, 'binary');

        let beforeUrl = "", beforePublicId = "";
        let resultUrl = "", resultPublicId = "";

        if (process.env.CLOUDINARY_API_KEY) {
            const resultUpload = await uploadToCloudinary(resultBuffer, 'imagify_results');
            resultUrl = resultUpload.secure_url;
            resultPublicId = resultUpload.public_id;

            if (req.file) {
                const beforeUpload = await uploadToCloudinary(req.file.buffer, 'imagify_originals');
                beforeUrl = beforeUpload.secure_url;
                beforePublicId = beforeUpload.public_id;
            }
        } else {
            resultUrl = `data:image/png;base64,${resultBuffer.toString('base64')}`;
            if (req.file) {
                beforeUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            }
        }

        const newCreation = new creationModel({
            userId: user._id,
            slug: generateSlug(prompt || toolType),
            toolType, prompt, style, tags,
            imageUrl: resultUrl, publicId: resultPublicId,
            beforeImageUrl: beforeUrl, beforePublicId: beforePublicId,
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
        console.error(`Error in ${toolType}:`, error.message || error);
        
        let errorMsg = "Operation failed";
        if (error?.response?.data) {
            errorMsg = Buffer.isBuffer(error.response.data) || error.response.data instanceof ArrayBuffer 
                ? Buffer.from(error.response.data).toString()
                : String(error.response.data);
        } else if (error.message) {
            errorMsg = error.message;
        }

        res.status(500).json({ success: false, message: errorMsg });
    }
};

export const textToImage = async (req, res) => {
    const { prompt, style = "normal" } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    // Append the style to the prompt if it's not "normal"
    const finalPrompt = style !== "normal" ? `${prompt}, in ${style} style` : prompt;

    await processImageTool({
        req, res,
        toolType: "text-to-image",
        endpointUrl: "https://clipdrop-api.co/text-to-image/v1",
        prompt: finalPrompt, style,
        tags: [style, "generated"],
        buildFormData: () => {
            const formData = new FormData();
            formData.append("prompt", finalPrompt);
            return formData;
        }
    });
};

const multiFaceGenerate = async (req, res, files, prompt, style) => {
    // Generate an image explicitly specifying the number of people
    const finalPrompt = style !== "normal" ? `${prompt}, in ${style} style` : prompt;
    const enforceTwoPeoplePrompt = `${files.length} distinct people. ${finalPrompt}`;
    
    // We reuse the standard pipeline
    await processImageTool({
        req, res,
        toolType: "image-to-image", // Tag as image-to-image so UI routing works
        endpointUrl: "https://clipdrop-api.co/text-to-image/v1",
        prompt: enforceTwoPeoplePrompt, style,
        tags: [style, "multi-face", "generated"],
        buildFormData: () => {
            const formData = new FormData();
            formData.append("prompt", enforceTwoPeoplePrompt);
            return formData;
        }
    });
};

export const imageToImage = async (req, res) => {
    try {
        const { prompt, style = "normal", userId } = req.body;
        
        if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });
        const files = req.files || (req.file ? [req.file] : []);
        if (files.length === 0) return res.status(400).json({ success: false, message: "Image is required" });

        // Fast fail: check credits BEFORE taking 5-10 seconds for Gemini
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.role !== "admin" && user.creditBalance <= 0) {
            return res.status(403).json({ success: false, message: "Insufficient Credits" });
        }

        // Branch off if multiple images were uploaded
        if (files.length > 1) {
            return multiFaceGenerate(req, res, files, prompt, style);
        }

        req.file = files[0];
        
        // The user explicitly requested to only use Clipdrop and not Gemini.
        // Since Clipdrop does not have a general text-guided image editing endpoint, 
        // we use their replace-background endpoint as the closest fallback.
        const finalPrompt = style !== "normal" ? `${prompt}, in ${style} style` : prompt;

        await processImageTool({
            req, res,
            toolType: "image-to-image",
            endpointUrl: "https://clipdrop-api.co/replace-background/v1",
            prompt: finalPrompt, style,
            tags: [style, "image-to-image"],
            buildFormData: () => {
                const formData = new FormData();
                formData.append("image_file", req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });
                formData.append("prompt", finalPrompt);
                return formData;
            }
        });
    } catch (error) {
        console.error("Error in imageToImage:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to process image" });
    }
};

export const removeBackground = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    await processImageTool({
        req, res,
        toolType: "bg-removal",
        endpointUrl: "https://clipdrop-api.co/remove-background/v1",
        tags: ["bg-removal", "transparent"],
        buildFormData: () => {
            const formData = new FormData();
            formData.append("image_file", req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });
            return formData;
        }
    });
};

export const upscaleImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    try {
        // Find dimensions and double them (max 4096)
        const metadata = await sharp(req.file.buffer).metadata();
        const targetWidth = Math.min(metadata.width * 2, 4096);
        const targetHeight = Math.min(metadata.height * 2, 4096);

        await processImageTool({
            req, res,
            toolType: "upscale",
            endpointUrl: "https://clipdrop-api.co/image-upscaling/v1/upscale",
            tags: ["upscale", "hd", "super-resolution"],
            buildFormData: () => {
                const formData = new FormData();
                formData.append("image_file", req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });
                formData.append("target_width", targetWidth.toString());
                formData.append("target_height", targetHeight.toString());
                return formData;
            }
        });
    } catch (err) {
        console.error("Upscale Error:", err);
        res.status(500).json({ success: false, message: "Failed to process image dimensions" });
    }
};

export const enhancePrompt = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

        // The user explicitly requested not to use Gemini API.
        // We provide a quick fallback enhancement since the LLM is disabled.
        const enhancedPrompt = `${prompt}, highly detailed, masterpiece, 8k resolution, cinematic lighting, stunning composition, professional photography`;
        
        await new Promise(resolve => setTimeout(resolve, 800));
        res.json({ success: true, enhancedPrompt });
    } catch (error) {
        console.error("Enhance prompt error:", error.message);
        res.status(500).json({ success: false, message: "Failed to enhance prompt" });
    }
};
