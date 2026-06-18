import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LayoutDashboard, Image as ImageIcon, Eye, Download, Heart, Activity, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div 
        className="glass p-6 sm:p-8 rounded-3xl shadow-xl flex items-center gap-5 relative overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        {/* Glow effect */}
        <div className={`absolute -right-10 -top-10 w-32 h-32 ${color.replace('from-', 'bg-').split(' ')[0]} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity`}></div>
        
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} shadow-lg shrink-0`}>
            <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="z-10">
            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { backendUrl, token, user } = useContext(AppContext);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/creations/analytics`, { headers: { token } });
                if (data.success) {
                    setAnalytics(data.analytics);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchAnalytics();
    }, [backendUrl, token]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"/></div>;
    }

    const { totalCreations = 0, totals = {}, toolStats = [] } = analytics || {};

    return (
        <div className="max-w-[1400px] mx-auto py-8 sm:py-12 px-4 sm:px-6">
            <motion.div 
                className="mb-12"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] flex items-center gap-4 tracking-tight mb-3">
                    <LayoutDashboard className="w-10 h-10 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"/> 
                    Creator Dashboard
                </h1>
                <p className="text-[var(--text-secondary)] text-lg font-light">Welcome back, <span className="font-semibold text-orange-600 dark:text-orange-300">{user?.name}</span>. Here's your activity.</p>
            </motion.div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
                <StatCard delay={0.1} title="Generations" value={totalCreations} icon={ImageIcon} color="bg-gradient-to-br from-orange-500 to-amber-600" />
                <StatCard delay={0.2} title="Total Views" value={totals.totalViews || 0} icon={Eye} color="bg-gradient-to-br from-blue-500 to-cyan-600" />
                <StatCard delay={0.3} title="Downloads" value={totals.totalDownloads || 0} icon={Download} color="bg-gradient-to-br from-emerald-500 to-teal-600" />
                <StatCard delay={0.4} title="Favorites" value={totals.totalFavorites || 0} icon={Heart} color="bg-gradient-to-br from-pink-500 to-rose-600" />
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                {/* Tool Usage Distribution */}
                <motion.div 
                    className="glass p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-orange-500 dark:text-orange-400"/> Tool Usage Breakdown
                    </h3>
                    <div className="space-y-5">
                        {toolStats.length > 0 ? toolStats.map((stat, i) => (
                            <div key={stat._id} className="flex items-center justify-between p-5 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] transition-colors">
                                <span className="font-semibold text-[var(--text-secondary)] capitalize">{stat._id.replace(/-/g, ' ')}</span>
                                <div className="flex items-center gap-5 w-1/2 justify-end">
                                    <div className="w-full max-w-[200px] h-2.5 bg-black/20 dark:bg-black/40 rounded-full overflow-hidden hidden sm:block shadow-inner">
                                        <motion.div 
                                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(stat.count / totalCreations) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                        />
                                    </div>
                                    <span className="font-bold text-[var(--text-primary)] text-lg w-10 text-right">{stat.count}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-[var(--text-muted)] text-center py-10 font-light">No data available yet.</p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity placeholder */}
                <motion.div 
                    className="glass p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] shadow-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-inner">
                        <Activity className="w-10 h-10 text-[var(--text-muted)]"/>
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Deep Insights</h3>
                    <p className="text-[var(--text-secondary)] text-center font-light max-w-sm">We're building advanced analytics to help you understand your audience's preferences better.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
