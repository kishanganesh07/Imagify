import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    creditBalance: { type: Number, default: 10 },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxLength: 160 },
    createdAt: { type: Date, default: Date.now }
});
const useModel=mongoose.models.user ||mongoose.model("user",userSchema)
export default useModel;
