import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Heart, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Favorites = () => {
    const { backendUrl, token, user } = useContext(AppContext);
    
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/creations/favorites`, { headers: { token } });
                if (data.success) {
                    setFavorites(data.creations);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch favorites");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchFavorites();
    }, [backendUrl, token]);

    const handleRemoveFavorite = async (id) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/creations/${id}/favorite`, {}, { headers: { token } });
            if (data.success) {
                // If it successfully toggled (removed), filter it out
                setFavorites(prev => prev.filter(c => c._id !== id));
                toast.info("Removed from favorites");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return (
        <div className="text-center py-32 text-[var(--text-secondary)] flex flex-col items-center justify-center max-w-2xl mx-auto glass rounded-3xl mt-20">
            <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border-subtle)] shadow-inner mb-6">
                <Heart className="w-10 h-10 opacity-30 text-pink-500" />
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">Login Required</p>
            <p className="text-sm font-light mb-6">Please login to view your favorite creations.</p>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto py-8 sm:py-12 px-4 sm:px-6 min-h-[70vh]">
            <motion.div 
                className="mb-10 text-center sm:text-left"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center justify-center sm:justify-start gap-3 mb-3">
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500 fill-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"/> 
                    My Favorites
                </h1>
                <p className="text-[var(--text-secondary)] font-light text-lg">Your curated collection of inspiration.</p>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" /></div>
            ) : favorites.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    <AnimatePresence>
                        {favorites.map((creation, i) => (
                            <motion.div 
                                key={creation._id} 
                                className="break-inside-avoid relative group rounded-3xl overflow-hidden glass shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.4, delay: i < 12 ? i * 0.05 : 0 }}
                                layout
                            >
                                <img src={creation.imageUrl} alt={creation.prompt} className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" loading="lazy" />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                    <p className="text-white text-sm font-semibold leading-relaxed line-clamp-3 mb-4 drop-shadow-md">{creation.prompt || creation.toolType}</p>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-white/80 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 tracking-wide">
                                            by {creation.userId?.name || 'Anonymous'}
                                        </span>
                                        <button onClick={() => handleRemoveFavorite(creation._id)} className="bg-pink-500/80 backdrop-blur-md hover:bg-pink-600 text-white p-2.5 rounded-full transition-all border border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:scale-110">
                                            <Heart className="w-4 h-4 fill-white" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div 
                    className="text-center py-32 text-[var(--text-secondary)] flex flex-col items-center justify-center glass rounded-3xl max-w-2xl mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-24 h-24 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/20 shadow-inner mb-6 relative">
                        <div className="absolute inset-0 bg-pink-500 rounded-full blur-xl opacity-20"></div>
                        <Heart className="w-10 h-10 text-pink-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">No favorites yet</h2>
                    <p className="text-[var(--text-secondary)] font-light mb-8">Start exploring the gallery and save the creations you love.</p>
                    <Link to="/gallery" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-105 flex items-center gap-2">
                        <Sparkles className="w-5 h-5"/> Explore Gallery
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default Favorites;
