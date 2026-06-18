import mongoose from "mongoose";

const creationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    slug: { type: String, unique: true, required: true },
    imageUrl: { type: String, required: true }, // Cloudinary secure URL
    publicId: { type: String, required: true }, // Cloudinary asset ID
    beforeImageUrl: { type: String, default: "" }, // For comparison slider
    beforePublicId: { type: String, default: "" },
    prompt: { type: String, default: "" },
    enhancedPrompt: { type: String, default: "" },
    tags: [{ type: String }],
    toolType: { 
        type: String, 
        required: true,
        enum: ["text-to-image", "image-to-image", "bg-removal", "upscale"]
    },
    style: { type: String, default: "normal" }, // e.g. cinematic, anime, cyberpunk, etc.
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending"
    },
    isDeleted: { type: Boolean, default: false }, // Soft delete
    downloadCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    parentCreationId: { type: mongoose.Schema.Types.ObjectId, ref: 'creation', default: null }, // For variations
    variationIndex: { type: Number, default: null },
    isPublic: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'collection', default: null },
    metadata: {
        width: { type: Number },
        height: { type: Number },
        format: { type: String },
        originalSize: { type: Number },
        generatedSize: { type: Number },
        aspectRatio: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

// Add Indexes for Search Performance
creationSchema.index({ userId: 1 });
creationSchema.index({ createdAt: -1 });
creationSchema.index({ tags: 1 });
creationSchema.index({ toolType: 1 });
creationSchema.index({ isPublic: 1 });
creationSchema.index({ style: 1 });
creationSchema.index({ slug: 1 });

const creationModel = mongoose.models.creation || mongoose.model("creation", creationSchema);
export default creationModel;
