import express from "express";
import { generateImage, optimizeImage } from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const imageRouter = express.Router();

imageRouter.post('/generate-image', userAuth, generateImage);
imageRouter.post('/optimize', userAuth, upload.single('image'), optimizeImage);

export default imageRouter;