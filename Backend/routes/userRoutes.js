import {registerUser,loginUser, userCredits} from "../controllers/userControllers.js";
import express from "express";
import userAuth from "../middlewares/auth.js";
const userrouter=express.Router()
userrouter.post("/register",registerUser)
userrouter.post("/login",loginUser)
userrouter.post('/credits',userAuth,userCredits)
userrouter.get('/credits',userAuth,userCredits)
export default userrouter;