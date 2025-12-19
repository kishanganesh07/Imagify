import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name||!email||!password){
            return res.status(400).json({success:false,message:"Please provide all required fields."})
        }

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, message: "User with this email already exists." });
        }
        console.log(password)
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const userData={
            name,email,password:hashedPassword
        };
        const newUser= new userModel(userData);
        const user=await newUser.save();
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET );
        res.status(201).json({success:true,user:{name:user.name},token});
        }catch(error){
            console.log(error);
            res.status(500).json({success:false,message:"Server error. Please try again later."});
    }
}
const loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({success:false,message:"Please provide email and password."});
        }
        const user=await userModel.findOne({email});
                console.log(user)
        
        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(401).json({success:false,message:"Invalid credentials."});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET ,{expiresIn:'10d'});
        res.status(200).json({success:true,user:{name:user.name},token});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,message:error.message});
    }
}
const userCredits=async (req,res)=>{
    try{
        const { userId } = req.body;
        const user=await userModel.findById(userId);
        res.json({success:true,credits:user.creditBalance, user:{name: user.name}})
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})

    }
}
export {registerUser,loginUser,userCredits}
