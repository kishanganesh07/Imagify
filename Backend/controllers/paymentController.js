import Razorpay from 'razorpay';
import crypto from 'crypto';
import userModel from '../models/userModel.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Credit plans
export const PLANS = [
    { id: 'basic',   name: 'Basic',   credits: 25,  price: 49,  currency: 'INR', popular: false, desc: 'Perfect to get started' },
    { id: 'pro',     name: 'Pro',     credits: 75,  price: 99,  currency: 'INR', popular: true,  desc: 'Most popular choice' },
    { id: 'premium', name: 'Premium', credits: 200, price: 249, currency: 'INR', popular: false, desc: 'For power creators' },
];

// GET /api/payment/plans
export const getPlans = (req, res) => {
    res.json({ success: true, plans: PLANS });
};

// POST /api/payment/create-order
export const createOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const { planId } = req.body;

        const plan = PLANS.find(p => p.id === planId);
        if (!plan) return res.status(400).json({ success: false, message: 'Invalid plan' });

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Admins have unlimited credits' });

        const order = await razorpay.orders.create({
            amount: plan.price * 100, // paise
            currency: plan.currency,
            receipt: `rcpt_${planId}_${Date.now().toString().slice(-8)}`,
            notes: { userId: userId.toString(), planId, credits: plan.credits },
        });

        res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID, plan });
    } catch (error) {
        console.error('Razorpay create order error:', error?.error || error?.message || error);
        const clientMsg = error?.error?.description
            || error?.message
            || 'Payment service error. Please try again.';
        res.status(500).json({ success: false, message: clientMsg });
    }
};

// POST /api/payment/verify
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
        const { userId } = req.body;

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        const plan = PLANS.find(p => p.id === planId);
        if (!plan) return res.status(400).json({ success: false, message: 'Invalid plan' });

        // Add credits to user
        const user = await userModel.findByIdAndUpdate(
            userId,
            { $inc: { creditBalance: plan.credits } },
            { new: true }
        );

        res.json({
            success: true,
            message: `${plan.credits} credits added successfully!`,
            credits: user.creditBalance,
        });
    } catch (error) {
        console.error('Razorpay verify error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
