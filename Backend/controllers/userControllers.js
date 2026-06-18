import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields." });
        }

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, message: "User with this email already exists." });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const role = email === "kishan328125@gmail.com" ? "admin" : "user";
        
        const userData = {
            name, email, password: hashedPassword, role
        };
        const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ success: true, user: { name: user.name }, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password." });
        }
        const user = await userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.status(200).json({ success: true, user: { name: user.name }, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        
        let displayCredits = user.creditBalance;
        if (user.role === "admin") {
            displayCredits = "Unlimited";
        }

        res.json({ success: true, credits: displayCredits, user: { name: user.name, email: user.email } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        
        let user = await userModel.findOne({ email });
        
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);
            
            const role = email === "kishan328125@gmail.com" ? "admin" : "user";
            
            const newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                avatar: picture,
                role,
                creditBalance: 10
            });
            user = await newUser.save();
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.status(200).json({ success: true, user: { name: user.name, email: user.email, avatar: user.avatar }, token });
    } catch (error) {
        console.log("Google Login Error:", error);
        res.status(500).json({ success: false, message: "Google Authentication failed" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, bio, avatar } = req.body;
        const user = await userModel.findByIdAndUpdate(
            userId,
            { name, bio, avatar },
            { new: true }
        ).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser };
