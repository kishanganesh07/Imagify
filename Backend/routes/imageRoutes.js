import express from "express";
import { generateImage, optimizeImage } from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const imageRouter = express.Router();

imageRouter.post('/generate-image', userAuth, generateImage);
imageRouter.post('/optimize', upload.single('image'), userAuth, optimizeImage);

export default imageRouter;