import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LayoutDashboard, Image as ImageIcon, Heart, User, LogOut, Wand2, Sun, Moon, Menu, X, Zap } from 'lucide-react';
import Loader from './Loader';

const Navbar = () => {
    const { user, setShowLogin, logout, credit, theme, toggleTheme, setShowPricing } = useContext(AppContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const isDark = theme === 'dark';

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            logout();
            setIsLoggingOut(false);
        }, 1000); // 1-second animation delay before clearing session
    };

    return (
        <>
        {isLoggingOut && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
                <Loader text="Signing out securely..." fullScreen={false} />
            </div>
        )}
        <div
            className='sticky top-0 z-50 w-full border-b transition-all duration-300'
            style={{
                background: 'var(--navbar-bg)',
                borderColor: 'var(--border-subtle)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
            }}
        >
            <div className='max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4'>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">

                    <img
                        src={assets.logo}
                        alt="Imagify"
                        className={`w-20 sm:w-24 relative z-10 transition-opacity group-hover:opacity-100 ${isDark ? 'invert opacity-90' : 'opacity-80'}`}
                    />
                </Link>

                {/* Desktop Nav */}
                <div className='hidden md:flex items-center gap-3'>
                    {user ? (
                        <div className='flex items-center gap-3'>
                            <Link
                                to="/gallery"
                                className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-orange-500/10 hover:text-orange-500'
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <ImageIcon className="w-4 h-4" /> Gallery
                            </Link>

                            <Link
                                to="/studio"
                                className='flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all text-white font-bold text-sm hover:scale-[1.02] active:scale-95'
                            >
                                <ImageIcon className="w-4 h-4" /> Studio
                            </Link>

                            {/* Credits Badge */}
                            {credit === 'Unlimited' || credit === -1 ? (
                                <div
                                    className='flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold'
                                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                                >
                                    <img className='w-4 h-4' src={assets.credit_star} alt="credits" />
                                    <span>∞</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowPricing(true)}
                                    className='flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all hover:border-orange-500/60 hover:shadow-[0_0_12px_rgba(249,115,22,0.2)] group'
                                    style={{ background: 'var(--bg-card)', borderColor: credit <= 3 ? 'rgba(249,115,22,0.5)' : 'var(--border-subtle)', color: credit <= 3 ? '#f97316' : 'var(--text-primary)' }}
                                    title="Buy more credits"
                                >
                                    <img className='w-4 h-4' src={assets.credit_star} alt="credits" />
                                    <span>{credit}</span>
                                    <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
                                </button>
                            )}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className='w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-105 hover:border-orange-500/50 cursor-pointer'
                                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-500" />}
                            </button>

                            {/* Profile Dropdown */}
                            <div className='relative group'>
                                <div
                                    className="w-10 h-10 rounded-xl border-2 flex items-center justify-center cursor-pointer overflow-hidden hover:border-orange-500 transition-colors"
                                    style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
                                >
                                    {user.avatar
                                        ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        : <User className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                    }
                                </div>

                                <div className='absolute hidden group-hover:flex flex-col top-full right-0 pt-3 w-56 z-[100]'>
                                    <div
                                        className='rounded-2xl shadow-2xl overflow-hidden border py-2'
                                        style={{
                                            background: isDark ? '#0d1120' : '#ffffff',
                                            borderColor: 'var(--border-subtle)',
                                            boxShadow: 'var(--shadow-lg)'
                                        }}
                                    >
                                        <div className="px-4 py-3 border-b mb-1" style={{ borderColor: 'var(--border-subtle)' }}>
                                            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                                            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                                        </div>
                                        {[
                                            { to: "/profile", Icon: User, label: "My Profile" },
                                            { to: "/favorites", Icon: Heart, label: "Favorites" },
                                            { to: "/dashboard", Icon: LayoutDashboard, label: "Dashboard" },
                                        ].map(({ to, Icon, label }) => (
                                            <Link
                                                key={to}
                                                to={to}
                                                className='flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-orange-500/10 hover:text-orange-500'
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                <Icon className="w-4 h-4" /> {label}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={handleLogout}
                                            className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left mt-1 border-t'
                                            style={{ borderColor: 'var(--border-subtle)' }}
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-3'>
                            <button onClick={() => setShowLogin(true)} className='text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:bg-orange-500/10 hover:text-orange-500' style={{ color: 'var(--text-secondary)' }}>
                                Gallery
                            </button>
                            <button onClick={() => setShowLogin(true)} className='text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:bg-orange-500/10 hover:text-orange-500' style={{ color: 'var(--text-secondary)' }}>
                                Studio
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className='w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-105 hover:border-orange-500/50'
                                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                            >
                                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-500" />}
                            </button>

                            <button
                                className='px-5 py-2.5 text-sm font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40'
                                onClick={() => setShowLogin(true)}
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile controls */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className='w-9 h-9 rounded-xl border flex items-center justify-center transition-all'
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                    >
                        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-500" />}
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(o => !o)}
                        className='w-9 h-9 rounded-xl border flex items-center justify-center transition-all'
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                    >
                        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden border-t px-4 py-4 flex flex-col gap-2"
                    style={{ background: 'var(--navbar-bg)', borderColor: 'var(--border-subtle)' }}
                >
                    {user ? (
                        <Link to="/gallery" className="px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-orange-500/10" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
                    ) : (
                        <button onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-orange-500/10" style={{ color: 'var(--text-primary)' }}>Gallery</button>
                    )}
                    {user ? (
                        <Link to="/studio" className="px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-orange-500/10" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)}>Studio</Link>
                    ) : (
                        <button onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-orange-500/10" style={{ color: 'var(--text-primary)' }}>Studio</button>
                    )}
                    {user ? (
                        <>
                            <Link to="/profile"   className="px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-orange-500/10" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                            <Link to="/favorites" className="px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-orange-500/10" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileMenuOpen(false)}>Favorites</Link>
                            <Link to="/dashboard" className="px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-orange-500/10" style={{ color: 'var(--text-primary)' }} onClick={() => { setMobileMenuOpen(false); }}>Dashboard</Link>
                            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-semibold text-left text-red-400 hover:bg-red-500/10 transition-all">Sign Out</button>
                        </>
                    ) : (
                        <button
                            className='px-5 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                            onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}
                        >
                            Get Started
                        </button>
                    )}
                </div>
            )}
        </div>
        </>
    );
};

export default Navbar;
