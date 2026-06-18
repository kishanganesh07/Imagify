import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Settings, Save, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader';

const Profile = () => {
    const { user, setUser, backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    const [myCreations, setMyCreations] = useState([]);
    const [loadingCreations, setLoadingCreations] = useState(true);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            setAvatar(user.avatar || '');
        }
    }, [user]);

    useEffect(() => {
        const fetchMyCreations = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/creations/my`, { headers: { token } });
                if (data.success) {
                    setMyCreations(data.creations);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingCreations(false);
            }
        };
        if (token) fetchMyCreations();
    }, [backendUrl, token]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data } = await axios.put(`${backendUrl}/api/user/profile`, { name, bio, avatar }, { headers: { token } });
            if (data.success) {
                setUser({ ...user, name: data.user.name, bio: data.user.bio, avatar: data.user.avatar });
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-[1400px] mx-auto py-8 sm:py-12 px-4 sm:px-6">
            <motion.div 
                className="mb-10 text-center sm:text-left"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center justify-center sm:justify-start gap-3 mb-3">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 dark:text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"/> 
                    My Profile
                </h1>
                <p className="text-[var(--text-secondary)] font-light text-lg">Manage your identity and workspace.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                
                {/* Profile Editor (Left) */}
                <motion.div 
                    className="lg:col-span-4 flex flex-col gap-6"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="glass p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] -z-10"></div>

                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" /> Profile Settings
                        </h2>

                        <div className="flex justify-center mb-8 relative">
                            <div className="w-32 h-32 rounded-full border-4 border-[var(--border-subtle)] overflow-hidden bg-black/5 dark:bg-black/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10 relative">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-[var(--text-muted)]" />
                                )}
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500 rounded-full blur-2xl opacity-20 z-0"></div>
                        </div>

                        <div className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 tracking-wide">Display Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 rounded-xl glass-input text-sm text-white font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 tracking-wide">Bio</label>
                                <textarea 
                                    rows="3" 
                                    value={bio} 
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell the community about your artistic vision..."
                                    className="w-full p-4 rounded-xl glass-input text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 tracking-wide">Avatar Image URL</label>
                                <input 
                                    type="text" 
                                    value={avatar} 
                                    onChange={(e) => setAvatar(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full p-4 rounded-xl glass-input text-sm mb-1"
                                />
                                <p className="text-xs text-orange-600 dark:text-orange-400/80 font-medium ml-2 flex items-center gap-1">Hint: Use one of your generated images!</p>
                            </div>

                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* My Creations (Right) */}
                <motion.div 
                    className="lg:col-span-8 flex flex-col"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="glass p-6 sm:p-8 rounded-3xl flex-1 shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] -z-10"></div>

                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                            <ImageIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" /> My Workspace
                        </h2>

                        {loadingCreations ? (
                            <div className="flex justify-center py-20"><Loader text="Loading Workspace..." /></div>
                        ) : myCreations.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {myCreations.map((creation, i) => (
                                    <motion.div 
                                        key={creation._id} 
                                        onClick={() => setSelectedHistoryItem(creation)}
                                        className="relative group rounded-2xl overflow-hidden aspect-square shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[var(--border-subtle)] cursor-pointer"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.4 + (i * 0.05) }}
                                    >
                                        <img src={creation.imageUrl} alt="creation" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <p className="text-white text-xs font-semibold truncate tracking-wide">{creation.prompt || creation.toolType}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 text-[var(--text-secondary)] flex flex-col items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border-subtle)] shadow-inner mb-6">
                                    <ImageIcon className="w-10 h-10 opacity-30 text-[var(--text-primary)]" />
                                </div>
                                <p className="text-2xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">Workspace Empty</p>
                                <p className="text-sm font-light">Head to the Creative Studio to create your first image.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>

            {/* History Detail Modal */}
            <AnimatePresence>
                {selectedHistoryItem && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedHistoryItem(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                        >
                            <button 
                                onClick={() => setSelectedHistoryItem(null)}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                            >
                                &times;
                            </button>
                            <div className="md:w-1/2 bg-black/50 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-700">
                                <img src={selectedHistoryItem.imageUrl} className="max-h-[60vh] object-contain rounded-xl" />
                            </div>
                            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center gap-4">
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Sparkles className="text-orange-500 w-5 h-5"/> Generation Details
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                        <p className="text-slate-400 text-xs mb-1 uppercase tracking-wide font-bold">Prompt / Request</p>
                                        <p className="text-slate-200">{selectedHistoryItem.prompt || 'No prompt provided'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wide font-bold">Tool Used</p>
                                            <p className="text-orange-400 font-medium capitalize">{selectedHistoryItem.toolType.replace(/-/g, ' ')}</p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wide font-bold">Style</p>
                                            <p className="text-slate-200 capitalize">{selectedHistoryItem.style || 'Normal'}</p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wide font-bold">Date</p>
                                            <p className="text-slate-200">{new Date(selectedHistoryItem.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                            <p className="text-slate-400 text-xs mb-1 uppercase tracking-wide font-bold">Credits Used</p>
                                            <p className="text-slate-200">1 Credit</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/studio', { state: { creation: selectedHistoryItem } })}
                                        className="w-full mt-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                                    >
                                        Open in Studio to Remix
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
