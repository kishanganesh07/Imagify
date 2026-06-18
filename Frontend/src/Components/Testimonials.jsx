import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const Testimonials = () => {
    return (
        <section className='py-24 px-4 relative overflow-hidden'>
            {/* Background */}
            <div className='absolute inset-0 -z-10'>
                <div className='orb w-96 h-96 bottom-0 left-0 bg-amber-600 opacity-10' />
            </div>

            <div className='max-w-6xl mx-auto'>
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
                        Testimonials
                    </div>
                    <h2 className='text-4xl sm:text-5xl font-black tracking-tight mb-4' style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Loved by creators
                    </h2>
                    <p className='text-base sm:text-lg font-light max-w-xl mx-auto' style={{ color: 'var(--text-secondary)' }}>
                        Join thousands of artists, designers, and dreamers who create with Imagify every day.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {testimonialsData.map((t, i) => (
                        <motion.div
                            key={i}
                            className='relative p-7 rounded-3xl border flex flex-col gap-5 group transition-all duration-300'
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.1 }}
                            whileHover={{
                                borderColor: 'rgba(249,115,22,0.4)',
                                boxShadow: '0 8px 40px rgba(249,115,22,0.12)',
                                y: -3
                            }}
                        >
                            {/* Quote icon */}
                            <div className='absolute top-5 right-5 text-orange-500/15'>
                                <Quote className='w-12 h-12' fill='currentColor' />
                            </div>

                            {/* Stars */}
                            <div className='flex gap-1'>
                                {Array(t.stars).fill('').map((_, si) => (
                                    <span key={si} className='text-amber-400 text-base'>★</span>
                                ))}
                            </div>

                            {/* Quote text */}
                            <p className='text-sm sm:text-base leading-relaxed flex-1 italic' style={{ color: 'var(--text-secondary)' }}>
                                "{t.text}"
                            </p>

                            {/* Author */}
                            <div className='flex items-center gap-3 pt-4 border-t' style={{ borderColor: 'var(--border-subtle)' }}>
                                <div className='relative'>
                                    <div className='absolute inset-0 bg-orange-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity' />
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        className='w-10 h-10 rounded-full object-cover border-2 relative z-10'
                                        style={{ borderColor: 'rgba(249,115,22,0.3)' }}
                                    />
                                </div>
                                <div>
                                    <p className='text-sm font-bold' style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                                    <p className='text-xs font-medium' style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
