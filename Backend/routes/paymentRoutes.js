import express from 'express';
import userAuth from '../middlewares/auth.js';
import { getPlans, createOrder, verifyPayment } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.get('/plans', getPlans);
paymentRouter.post('/create-order', userAuth, createOrder);
paymentRouter.post('/verify', userAuth, verifyPayment);

export default paymentRouter;
