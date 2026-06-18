import creationModel from "../models/creationModel.js";
import userModel from "../models/userModel.js";

// GET /api/creations/public?page=1&limit=20&search=cyberpunk&tag=anime&style=cinematic
export const getPublicCreations = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, tag, style, toolType } = req.query;
        
        let query = { isPublic: true, isDeleted: false, status: "completed" };

        if (search) {
            query.prompt = { $regex: search, $options: "i" };
        }
        if (tag) {
            query.tags = tag;
        }
        if (style) {
            query.style = style;
        }
        if (toolType) {
            query.toolType = toolType;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const creations = await creationModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'name avatar');
            
        const total = await creationModel.countDocuments(query);

        res.json({ success: true, creations, total, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyCreations = async (req, res) => {
    try {
        const { userId } = req.body;
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const creations = await creationModel.find({ userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({ success: true, creations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const creation = await creationModel.findById(id);
        if (!creation) return res.status(404).json({ success: false, message: "Creation not found" });

        const index = creation.favorites.indexOf(userId);
        if (index > -1) {
            creation.favorites.splice(index, 1); // Remove
        } else {
            creation.favorites.push(userId); // Add
        }

        await creation.save();
        res.json({ success: true, favoritesCount: creation.favorites.length, isFavorited: index === -1 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const incrementView = async (req, res) => {
    try {
        const { id } = req.params;
        await creationModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const incrementDownload = async (req, res) => {
    try {
        const { id } = req.params;
        await creationModel.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSimilarCreations = async (req, res) => {
    try {
        const { id } = req.params;
        const creation = await creationModel.findById(id);
        if (!creation) return res.status(404).json({ success: false, message: "Creation not found" });

        const similar = await creationModel.find({
            _id: { $ne: id },
            isPublic: true,
            isDeleted: false,
            $or: [
                { style: creation.style },
                { tags: { $in: creation.tags } }
            ]
        }).limit(8).populate('userId', 'name avatar');

        res.json({ success: true, similar });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Count total creations
        const totalCreations = await creationModel.countDocuments({ userId, isDeleted: false });
        
        // Total views and downloads on user's public creations
        const stats = await creationModel.aggregate([
            { $match: { userId: userId, isDeleted: false } },
            { $group: { _id: null, totalViews: { $sum: "$viewCount" }, totalDownloads: { $sum: "$downloadCount" }, totalFavorites: { $sum: { $size: "$favorites" } } } }
        ]);

        const totals = stats[0] || { totalViews: 0, totalDownloads: 0, totalFavorites: 0 };

        // Creations by toolType
        const toolStats = await creationModel.aggregate([
            { $match: { userId: userId, isDeleted: false } },
            { $group: { _id: "$toolType", count: { $sum: 1 } } }
        ]);

        res.json({ success: true, analytics: { totalCreations, totals, toolStats } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.body;
        const favorites = await creationModel.find({ favorites: userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar');
        
        res.json({ success: true, creations: favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSharedCreation = async (req, res) => {
    try {
        const { slug } = req.params;
        const creation = await creationModel.findOne({ slug, isDeleted: false }).populate('userId', 'name avatar bio');
        if (!creation) return res.status(404).json({ success: false, message: "Creation not found" });
        
        res.json({ success: true, creation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
