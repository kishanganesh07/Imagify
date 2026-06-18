import collectionModel from "../models/collectionModel.js";

export const createCollection = async (req, res) => {
    try {
        const { userId, name, description, coverImage, isPublic } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Collection name is required" });

        const newCollection = new collectionModel({
            userId,
            name,
            description,
            coverImage,
            isPublic
        });

        await newCollection.save();
        res.status(201).json({ success: true, collection: newCollection });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserCollections = async (req, res) => {
    try {
        const { userId } = req.body;
        const collections = await collectionModel.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, collections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, name, description, coverImage, isPublic } = req.body;
        
        const collection = await collectionModel.findOneAndUpdate(
            { _id: id, userId },
            { name, description, coverImage, isPublic },
            { new: true }
        );

        if (!collection) return res.status(404).json({ success: false, message: "Collection not found" });

        res.json({ success: true, collection });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        
        const deleted = await collectionModel.findOneAndDelete({ _id: id, userId });
        if (!deleted) return res.status(404).json({ success: false, message: "Collection not found" });

        res.json({ success: true, message: "Collection deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
