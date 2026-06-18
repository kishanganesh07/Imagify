import { registerUser, loginUser, getUserProfile, updateUserProfile, getMe, userCredits, googleLogin } from "../controllers/userControllers.js";
import express from "express";
import userAuth from "../middlewares/auth.js";

const userrouter = express.Router()

userrouter.post("/register", registerUser)
userrouter.post("/login", loginUser)
userrouter.post("/google-login", googleLogin)
userrouter.get('/me', userAuth, getMe)
userrouter.get('/credits', userAuth, userCredits)

// Profile routes
userrouter.get('/profile/:id', getUserProfile)
userrouter.put('/profile', userAuth, updateUserProfile)

export default userrouter;