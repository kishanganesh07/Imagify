import React from 'react'
import { assets } from '../assets/assets'
import { GitFork, Globe, ExternalLink } from 'lucide-react'

const LINKS = {
    Product: ['Studio', 'Gallery', 'Pricing', 'Changelog'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy', 'Terms', 'Cookies'],
}

const Footer = () => {
    return (
        <footer
            className='mt-8 border-t'
            style={{ background: 'var(--footer-bg)', borderColor: 'var(--border-subtle)' }}
        >
            <div className='max-w-7xl mx-auto px-6 py-12'>
                <div className='flex flex-col lg:flex-row justify-between gap-10 mb-10'>
                    {/* Brand */}
                    <div className='max-w-xs'>
                        <img
                            src={assets.logo}
                            alt="Imagify"
                            width={120}
                            className='mb-4 opacity-90 hover:opacity-100 transition-opacity'
                            style={{ filter: 'var(--logo-filter, none)' }}
                        />
                        <p className='text-sm leading-relaxed' style={{ color: 'var(--text-secondary)' }}>
                            The most powerful AI image generation studio. Turn your imagination into stunning visual art in seconds.
                        </p>
                        {/* Social icons */}
                        <div className='flex gap-3 mt-5'>
                            {[
                                { icon: <Globe className='w-4 h-4' />, href: '#' },
                                { icon: <ExternalLink className='w-4 h-4' />, href: '#' },
                                { icon: <GitFork className='w-4 h-4' />, href: '#' },
                            ].map(({ icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className='w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-110 hover:border-orange-500/50 hover:text-orange-500'
                                    style={{
                                        background: 'var(--bg-card)',
                                        borderColor: 'var(--border-subtle)',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className='grid grid-cols-3 gap-8'>
                        {Object.entries(LINKS).map(([group, links]) => (
                            <div key={group}>
                                <h4 className='text-xs font-bold uppercase tracking-widest mb-4' style={{ color: 'var(--text-muted)' }}>{group}</h4>
                                <ul className='space-y-3'>
                                    {links.map(link => (
                                        <li key={link}>
                                            <a
                                                href='#'
                                                className='text-sm font-medium transition-colors hover:text-orange-500'
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className='flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t text-xs'
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                >
                    <p>© {new Date().getFullYear()} Imagify. All rights reserved.</p>
                    <p className='flex items-center gap-1'>
                        Made with <span className='text-red-400 mx-1'>♥</span> for creators worldwide
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
