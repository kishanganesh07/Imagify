import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const FEATURES = [
    'Photorealistic image generation',
    'Multiple art styles & modes',
    'Instant background removal',
    'HD upscaling to 4K quality',
    'Commercial usage rights',
    'Save & share your creations',
]

const Description = () => {
    return (
        <section className='py-24 px-4 relative overflow-hidden'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex flex-col lg:flex-row items-center gap-16 lg:gap-20'>

                    {/* Image side */}
                    <motion.div
                        className='relative shrink-0'
                        initial={{ opacity: 0, scale: 0.92, x: -30 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Glow behind image */}
                        <div className='absolute inset-0 bg-gradient-to-br from-orange-600/30 to-amber-600/30 blur-3xl rounded-3xl scale-110 -z-10' />

                        <div className='relative rounded-3xl overflow-hidden shadow-2xl border' style={{ borderColor: 'var(--border-subtle)' }}>
                           
                        </div>
                    </motion.div>

                    {/* Text side */}
                    <motion.div
                        className='flex-1'
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        <div
                            className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border bg-[rgba(249,115,22,0.08)] border-[rgba(249,115,22,0.25)] text-[#fb923c]'
                        >
                            AI-Powered Studio
                        </div>

                        <h2
                            className='text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6 text-[var(--text-primary)]'
                            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                            Intelligent AI Generation
                        </h2>

                        <p className='text-base sm:text-lg leading-relaxed mb-8 font-light text-[var(--text-secondary)]'>
                            Imagify combines cutting-edge AI models with an intuitive studio experience. Whether you need product visuals, concept art, social media graphics, or anything else — describe it and watch it come to life.
                        </p>

                        {/* Feature checklist */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10'>
                            {FEATURES.map((f, i) => (
                                <motion.div
                                    key={i}
                                    className='flex items-center gap-3 text-sm font-medium'
                                    style={{ color: 'var(--text-secondary)' }}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                                >
                                    <CheckCircle2 className='w-4 h-4 text-orange-500 shrink-0' />
                                    {f}
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats row */}
                        <div className='flex flex-wrap gap-8'>
                            {[
                                { val: '50K+', label: 'Active Creators' },
                                { val: '2M+', label: 'Images Generated' },
                                { val: '4.9★', label: 'User Rating' },
                            ].map(({ val, label }, i) => (
                                <div key={i}>
                                    <p
                                        className='text-2xl font-black gradient-text'
                                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                    >
                                        {val}
                                    </p>
                                    <p className='text-xs font-medium mt-0.5' style={{ color: 'var(--text-muted)' }}>{label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Description
