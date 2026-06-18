import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Wand2, ImageIcon, Zap } from 'lucide-react'

const FEATURES = [
    { icon: <ImageIcon className="w-4 h-4" />, label: 'Text to Image' },
    { icon: <ImageIcon className="w-4 h-4" />, label: 'Style Transfer' },
    { icon: <Zap className="w-4 h-4" />, label: 'HD Upscaling' },
]

const Header = () => {
    const { user, setShowLogin } = useContext(AppContext)
    const navigate = useNavigate()

    const onClickHandler = () => {
        if (user) navigate('/studio')
        else setShowLogin(true)
    }

    return (
        <div className='relative flex flex-col justify-center items-center text-center pt-16 pb-24 px-4 overflow-hidden min-h-[92vh]'>

            {/* Background orbs */}
            <div className='absolute inset-0 -z-10 overflow-hidden'>
                <div className='orb w-[600px] h-[600px] top-[-200px] left-[-150px] bg-orange-600'/>
                <div className='orb w-[500px] h-[500px] bottom-[-150px] right-[-100px] bg-amber-600'/>
                <div className='orb w-[300px] h-[300px] top-[40%] left-[40%] bg-purple-500'/>
                <div className='noise-overlay' />
            </div>

            {/* Badge */}
            <motion.div
                className='inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-semibold mb-8'
                style={{
                    background: 'rgba(249,115,22,0.08)',
                    borderColor: 'rgba(249,115,22,0.3)',
                    color: '#fb923c'
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <ImageIcon className="w-4 h-4" />
                Powered by Advanced AI • Next-Gen Creative Studio
            </motion.div>

            {/* Headline */}
            <motion.h1
                className='text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6 max-w-5xl text-[var(--text-primary)]'
                style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
            >
                Turn Words Into{' '}
                <span className='gradient-text'>
                    Stunning Art
                </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                className='text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed text-[var(--text-secondary)]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
            >
                Describe anything. Imagify's AI engine transforms your words into breathtaking, photorealistic visuals in seconds — no design skills required.
            </motion.p>

            {/* Feature pills */}
            <motion.div
                className='flex flex-wrap justify-center gap-3 mb-10'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
            >
                {FEATURES.map((f, i) => (
                    <div
                        key={i}
                        className='flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    >
                        <span className='text-orange-500'>{f.icon}</span>
                        {f.label}
                    </div>
                ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
                className='flex flex-col sm:flex-row gap-4 items-center'
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.55 }}
            >
                <motion.button
                    className='group flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base shadow-xl transition-all duration-300'
                    style={{
                        background: 'linear-gradient(135deg, #ea580c, #d97706)',
                        boxShadow: '0 8px 32px rgba(124,58,237,0.4)'
                    }}
                    onClick={onClickHandler}
                    whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(124,58,237,0.6)' }}
                    whileTap={{ scale: 0.97 }}
                >
                    <ImageIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Start Creating for Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                    className='flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold border transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/5'
                    style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}
                    onClick={() => navigate('/gallery')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <ImageIcon className="w-4 h-4 text-orange-500" />
                    View Gallery
                </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div
                className='mt-16 flex items-center gap-6 flex-wrap justify-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                <div className='flex -space-x-2'>
                    {['🎨','🚀','✨','🎯'].map((emoji, i) => (
                        <div
                            key={i}
                            className='w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg'
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-primary)' }}
                        >
                            {emoji}
                        </div>
                    ))}
                </div>
                <div className='text-left'>
                    <p className='text-sm font-bold' style={{ color: 'var(--text-primary)' }}>Loved by 50,000+ creators</p>
                    <div className='flex items-center gap-1 mt-0.5'>
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className='text-amber-400 text-xs'>★</span>
                        ))}
                        <span className='text-xs ml-1' style={{ color: 'var(--text-muted)' }}>4.9 / 5</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Header
