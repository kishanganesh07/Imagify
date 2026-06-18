import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './models/userModel.js';

dotenv.config();

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        
        const result = await userModel.updateOne(
            { email: "kishan328125@gmail.com" },
            { $set: { role: "admin" } }
        );
        
        console.log("Update result:", result);
    } catch (error) {
        console.error("Error updating admin:", error);
    } finally {
        await mongoose.disconnect();
    }
};

updateAdmin();
