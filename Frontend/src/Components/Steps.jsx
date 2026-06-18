import React from 'react'
import { stepsData } from '../assets/assets'
import { motion } from 'framer-motion'

const STEP_COLORS = [
    { glow: 'rgba(249,115,22,0.15)', icon: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', text: '#fb923c', num: '01' },
    { glow: 'rgba(79,70,229,0.15)',  icon: 'rgba(79,70,229,0.15)',  border: 'rgba(79,70,229,0.3)',  text: '#fbbf24', num: '02' },
    { glow: 'rgba(168,85,247,0.15)', icon: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#c084fc', num: '03' },
]

const Steps = () => {
    return (
        <section className='py-24 px-4 relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute inset-0 -z-10'>
                <div className='orb w-96 h-96 top-0 right-0 bg-orange-600 opacity-10' />
            </div>

            <div className='max-w-5xl mx-auto'>
                {/* Heading */}
                <motion.div
                    className='text-center mb-16'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div
                        className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border'
                        style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.25)', color: '#fb923c' }}
                    >
                        Simple Process
                    </div>
                    <h2 className='text-4xl sm:text-5xl font-black tracking-tight mb-4' style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        How It Works
                    </h2>
                    <p className='text-base sm:text-lg font-light max-w-xl mx-auto' style={{ color: 'var(--text-secondary)' }}>
                        From idea to image in three simple steps — no experience needed.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className='flex flex-col gap-5'>
                    {stepsData.map((item, index) => {
                        const c = STEP_COLORS[index] || STEP_COLORS[0]
                        return (
                            <motion.div
                                key={index}
                                className='relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-7 sm:p-8 rounded-3xl border transition-all duration-300 group cursor-default'
                                style={{
                                    background: 'var(--bg-card)',
                                    borderColor: 'var(--border-subtle)',
                                }}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: index * 0.12 }}
                                whileHover={{
                                    borderColor: c.border,
                                    boxShadow: `0 8px 40px ${c.glow}`,
                                    y: -2
                                }}
                            >
                                {/* Step number */}
                                <div
                                    className='absolute top-5 right-6 text-7xl font-black leading-none select-none'
                                    style={{ color: c.text, opacity: 0.08 }}
                                >
                                    {c.num}
                                </div>

                                {/* Icon */}
                                <div
                                    className='w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 border'
                                    style={{ background: c.icon, borderColor: c.border }}
                                >
                                    <img className='w-7 h-7 invert opacity-90' src={item.icon} alt={item.title} />
                                </div>

                                {/* Content */}
                                <div className='flex-1 relative z-10'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <span className='text-xs font-bold uppercase tracking-widest' style={{ color: c.text }}>Step {c.num}</span>
                                    </div>
                                    <h3
                                        className='text-xl sm:text-2xl font-bold mb-1.5 transition-colors'
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className='text-sm sm:text-base leading-relaxed' style={{ color: 'var(--text-secondary)' }}>
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Steps
