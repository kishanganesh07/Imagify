import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" }, // Cloudinary URL
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const collectionModel = mongoose.models.collection || mongoose.model("collection", collectionSchema);
export default collectionModel;
