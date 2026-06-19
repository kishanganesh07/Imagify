import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Loader2, Heart, Eye, Download, User, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../Components/Loader';

const Gallery = () => {
    const { backendUrl, token } = useContext(AppContext);
    
    const [creations, setCreations] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Filters
    const [search, setSearch] = useState('');
    const [style, setStyle] = useState('');
    const [toolType, setToolType] = useState('');

    const fetchCreations = useCallback(async (reset = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            let url = `${backendUrl}/api/creations/public?page=${currentPage}&limit=12`;
            if (search) url += `&search=${search}`;
            if (style) url += `&style=${style}`;
            if (toolType) url += `&toolType=${toolType}`;

            const { data } = await axios.get(url);
            if (data.success) {
                setCreations(prev => reset ? data.creations : [...prev, ...data.creations]);
                setHasMore(currentPage < data.totalPages);
                if (!reset) setPage(currentPage + 1);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch gallery");
        } finally {
            setLoading(false);
        }
    }, [backendUrl, page, search, style, toolType, loading]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchCreations(true);
        // eslint-disable-next-line
    }, [search, style, toolType]);

    // Simple Infinite Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
                if (hasMore && !loading) fetchCreations(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading, fetchCreations]);

    const handleFavorite = async (id) => {
        if (!token) return toast.info("Please login to favorite!");
        try {
            const { data } = await axios.post(`${backendUrl}/api/creations/${id}/favorite`, {}, { headers: { token } });
            if (data.success) {
                setCreations(creations.map(c => c._id === id ? { ...c, favorites: data.isFavorited ? [...c.favorites, 'me'] : c.favorites.filter(f => f !== 'me') } : c));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto py-8 sm:py-12 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <motion.h1 
                    className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Community Gallery 
                </motion.h1>
                

            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                <AnimatePresence>
                    {creations.map((creation, i) => (
                        <motion.div 
                            key={creation._id} 
                            className="break-inside-avoid relative group rounded-3xl overflow-hidden glass shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i < 12 ? i * 0.05 : 0 }}
                            layout
                        >
                            <img src={creation.imageUrl} alt={creation.prompt} className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" loading="lazy" />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                <p className="text-white text-sm font-semibold leading-relaxed line-clamp-3 mb-4 drop-shadow-md">{creation.prompt || creation.toolType}</p>
                                
                                <div className="flex items-center justify-between text-white/90 text-xs">
                                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                        {creation.userId?.avatar ? (
                                            <img src={creation.userId.avatar} alt="User" className="w-5 h-5 rounded-full border border-white/20" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center"><User className="w-3 h-3"/></div>
                                        )}
                                        <span className="font-medium tracking-wide">{creation.userId?.name || 'Anonymous'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleFavorite(creation._id)} className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-white/10 transition border border-white/10">
                                            <Heart className={`w-3.5 h-3.5 ${creation.favorites.includes('me') ? 'fill-pink-500 text-pink-500' : 'text-white/70'}`} /> 
                                            <span className="font-medium">{creation.favorites.length}</span>
                                        </button>
                                        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white/70">
                                            <Eye className="w-3.5 h-3.5"/> 
                                            <span className="font-medium">{creation.viewCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute top-4 left-4 bg-orange-600/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-orange-400/50 shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                                {creation.toolType.replace(/-/g, ' ')}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {loading && (
                <div className="flex justify-center py-12">
                    <Loader text="Loading More..." />
                </div>
            )}
            
            {!hasMore && creations.length > 0 && (
                <p className="text-center py-12 text-[var(--text-secondary)] text-sm font-medium tracking-wide">You've reached the end</p>
            )}

            {!loading && creations.length === 0 && (
                <motion.div 
                    className="text-center py-32 text-[var(--text-secondary)] flex flex-col items-center justify-center glass rounded-3xl max-w-2xl mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border-subtle)] shadow-inner mb-6">
                        <ImageIcon className="w-10 h-10 opacity-30 text-[var(--text-primary)]" />
                    </div>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">No creations found</p>
                    <p className="text-sm font-light">Try adjusting your search filters.</p>
                </motion.div>
            )}
        </div>
    );
};

export default Gallery;
