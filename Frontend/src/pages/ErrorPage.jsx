import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, Compass } from 'lucide-react';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background ambient lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] -z-10"></div>
            
            <div className="text-center relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="relative inline-block"
                >
                    <h1 className="text-[12rem] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-orange-600 to-amber-900 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)] tracking-tighter">
                        404
                    </h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 w-full h-full flex items-center justify-center pointer-events-none -z-10">
                        <AlertTriangle className="w-[12rem] h-[12rem]" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-4"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4 flex items-center justify-center gap-3">
                        <Compass className="w-8 h-8 text-orange-500" />
                        Lost in the Creative Void
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-lg mx-auto font-light leading-relaxed">
                        The canvas you are looking for doesn't exist, has been deleted, or perhaps hasn't been imagined yet. Let's get you back to creating.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 mx-auto shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:scale-[1.05] transition-all duration-300"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </button>
                </motion.div>
            </div>

            {/* Floating decorative elements */}
            <motion.div 
                className="absolute top-20 left-20 w-16 h-16 rounded-full border border-orange-500/20 bg-orange-500/5 -z-10"
                animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
                className="absolute bottom-20 right-20 w-32 h-32 rounded-full border border-amber-500/20 bg-amber-500/5 -z-10"
                animate={{ y: [0, 30, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
        </div>
    );
};

export default ErrorPage;
