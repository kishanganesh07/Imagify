import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'

const GenerateBtn = () => {
    const { user, setShowLogin } = useContext(AppContext)
    const navigate = useNavigate()

    const onClickHandler = () => {
        if (user) navigate('/studio')
        else setShowLogin(true)
    }

    return (
        <section className='py-24 px-4 relative overflow-hidden'>
            {/* Background */}
            <div className='absolute inset-0 -z-10'>
                <div className='orb w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600' />
                <div className='noise-overlay' />
            </div>

            <motion.div
                className='max-w-4xl mx-auto text-center relative'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                {/* Glass card */}
                <div
                    className='relative p-12 sm:p-16 rounded-3xl border overflow-hidden'
                    style={{
                        background: 'var(--bg-card)',
                        borderColor: 'rgba(249,115,22,0.25)',
                        boxShadow: '0 0 80px rgba(249,115,22,0.12)'
                    }}
                >
                    {/* Decorative corner glows */}
                    <div className='absolute top-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none' />
                    <div className='absolute bottom-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none' />

                    <div className='relative z-10'>
                        <motion.div
                            className='w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30'
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <ImageIcon className='w-8 h-8 text-white' />
                        </motion.div>

                        <h2
                            className='text-4xl sm:text-5xl font-black tracking-tight mb-4'
                            style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            Ready to create?
                        </h2>
                        <p className='text-base sm:text-lg font-light mb-10 max-w-xl mx-auto' style={{ color: 'var(--text-secondary)' }}>
                            Join 50,000+ creators. Start generating stunning AI art for free — no credit card needed.
                        </p>

                        <motion.button
                            onClick={onClickHandler}
                            className='group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300'
                            style={{
                                background: 'linear-gradient(135deg, #ea580c, #d97706)',
                                boxShadow: '0 8px 32px rgba(124,58,237,0.4)'
                            }}
                            whileHover={{ scale: 1.05, boxShadow: '0 12px 44px rgba(124,58,237,0.65)' }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <ImageIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Generate Images Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <p className='text-xs mt-5 font-medium' style={{ color: 'var(--text-muted)' }}>
                            Free tier includes 10 credits • No signup required to browse
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default GenerateBtn
