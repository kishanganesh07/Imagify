import express from "express";
import userAuth from "../middlewares/auth.js";
import { 
    getPublicCreations, 
    getMyCreations, 
    toggleFavorite, 
    incrementView, 
    incrementDownload, 
    getSimilarCreations, 
    getAnalytics, 
    getSharedCreation,
    getFavorites
} from "../controllers/creationController.js";

const creationRouter = express.Router();

creationRouter.get('/public', getPublicCreations);
creationRouter.get('/shared/:slug', getSharedCreation);
creationRouter.post('/:id/view', incrementView);
creationRouter.post('/:id/download', incrementDownload);
creationRouter.get('/:id/similar', getSimilarCreations);

// Protected routes
creationRouter.get('/my', userAuth, getMyCreations);
creationRouter.get('/favorites', userAuth, getFavorites);
creationRouter.post('/:id/favorite', userAuth, toggleFavorite);
creationRouter.get('/analytics', userAuth, getAnalytics);

export default creationRouter;
