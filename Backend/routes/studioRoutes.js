import express from "express";
import userAuth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import { textToImage, imageToImage, removeBackground, upscaleImage, enhancePrompt } from "../controllers/studioController.js";

const studioRouter = express.Router();

studioRouter.post('/text-to-image', upload.none(), userAuth, textToImage);
studioRouter.post('/image-to-image', upload.array('image', 5), userAuth, imageToImage);
studioRouter.post('/remove-bg', upload.single('image'), userAuth, removeBackground);
studioRouter.post('/upscale', upload.single('image'), userAuth, upscaleImage);
studioRouter.post('/enhance-prompt', userAuth, enhancePrompt);

export default studioRouter;
