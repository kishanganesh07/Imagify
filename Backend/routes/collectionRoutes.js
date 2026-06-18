import express from "express";
import userAuth from "../middlewares/auth.js";
import { createCollection, getUserCollections, updateCollection, deleteCollection } from "../controllers/collectionController.js";

const collectionRouter = express.Router();

collectionRouter.post('/', userAuth, createCollection);
collectionRouter.get('/', userAuth, getUserCollections);
collectionRouter.put('/:id', userAuth, updateCollection);
collectionRouter.delete('/:id', userAuth, deleteCollection);

export default collectionRouter;
