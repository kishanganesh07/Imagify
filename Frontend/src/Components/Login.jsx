import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import { X, Eye, EyeOff, User, Mail, Lock } from 'lucide-react'

const Login = () => {
    const [state, setState] = useState('Login')
    const { setShowLogin, backendUrl, setUser, theme } = useContext(AppContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const isDark = theme === 'dark'

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const endpoint = state === 'Login' ? '/api/user/login' : '/api/user/register'
            const body = state === 'Login' ? { email, password } : { name, email, password }
            const res = await fetch(backendUrl + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const data = await res.json()
            if (data.success) {
                setUser(data.user)
                localStorage.setItem('token', data.token)
                setShowLogin(false)
                toast.success(state === 'Login' ? 'Welcome back! 🎉' : 'Account created! 🎨')
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true)
            const res = await fetch(backendUrl + '/api/user/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            })
            const data = await res.json()
            if (data.success) {
                setUser(data.user)
                localStorage.setItem('token', data.token)
                setShowLogin(false)
                toast.success('Signed in with Google! 🚀')
            } else {
                toast.error(data.message)
            }
        } catch {
            toast.error('Google authentication failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'auto' }
    })

    return (
        <div
            className='fixed inset-0 z-[200] flex justify-center items-center'
            style={{
                background: isDark
                    ? 'rgba(3, 5, 14, 0.92)'
                    : 'rgba(240, 242, 255, 0.85)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
            }}
            onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}
        >
            <style>{`
                @keyframes loginFadeUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1); }
                }
                .login-modal { animation: loginFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
                
                .lf-input { transition: border-color 0.2s, box-shadow 0.2s; }
                .lf-input:focus-within {
                    border-color: #f97316 !important;
                    box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
                }
                .lf-input input { outline: none; background: transparent; width: 100%; }
                .lf-input input::placeholder { color: ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)'}; }

                .lf-btn {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.15s, box-shadow 0.2s;
                }
                .lf-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
                    transform: translateX(-100%);
                    transition: transform 0.5s;
                }
                .lf-btn:hover::before { transform: translateX(100%); }
                .lf-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(249,115,22,0.4); }
                .lf-btn:active { transform: translateY(0) scale(0.98); }
            `}</style>

            <div
                className='login-modal relative w-full mx-4'
                style={{
                    maxWidth: 420,
                    borderRadius: 24,
                    background: isDark
                        ? 'linear-gradient(160deg, #0d1226 0%, #09101f 100%)'
                        : '#ffffff',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                    boxShadow: isDark
                        ? '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(249,115,22,0.08)'
                        : '0 24px 72px rgba(0,0,0,0.14)',
                    padding: '40px 40px 36px',
                }}
            >
                {/* ambient glow — top right */}
                <div
                    style={{
                        position: 'absolute', top: -60, right: -40,
                        width: 200, height: 200,
                        background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
                        pointerEvents: 'none', borderRadius: '50%',
                    }}
                />

                {/* Close */}
                <button
                    onClick={() => setShowLogin(false)}
                    className='absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110'
                    style={{
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                    }}
                >
                    <X className='w-3.5 h-3.5' />
                </button>

                {/* ── Header ── */}
                <div className='mb-8'>
                    {/* logo mark */}
                    <div className='mb-5 w-fit'>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 20px rgba(234,88,12,0.38)',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                <path d="M2 17l10 5 10-5"/>
                                <path d="M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                    </div>

                    <h1
                        style={{
                            fontSize: 26, fontWeight: 800, letterSpacing: '-0.6px',
                            lineHeight: 1.2, marginBottom: 6,
                            color: isDark ? '#f8fafc' : '#0f172a',
                            fontFamily: 'Space Grotesk, Inter, sans-serif',
                        }}
                    >
                        {state === 'Login' ? 'Welcome back' : 'Create your account'}
                    </h1>
                    <p style={{ fontSize: 14, color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.48)', fontWeight: 400 }}>
                        {state === 'Login'
                            ? 'Sign in to your creative studio'
                            : 'Start creating AI art — free forever'}
                    </p>
                </div>

                {/* ── Form ── */}
                <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {state !== 'Login' && (
                        <div className='lf-input' style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '0 14px', height: 48, borderRadius: 12,
                            border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)'}`,
                            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,1)',
                        }}>
                            <User style={{ width: 16, height: 16, flexShrink: 0, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }} />
                            <input
                                type="text" placeholder='Full name' value={name}
                                onChange={e => setName(e.target.value)} required
                                style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#f1f5f9' : '#0f172a' }}
                            />
                        </div>
                    )}

                    <div className='lf-input' style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '0 14px', height: 48, borderRadius: 12,
                        border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)'}`,
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,1)',
                    }}>
                        <Mail style={{ width: 16, height: 16, flexShrink: 0, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }} />
                        <input
                            type="email" placeholder='Email address' value={email}
                            onChange={e => setEmail(e.target.value)} required
                            style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#f1f5f9' : '#0f172a' }}
                        />
                    </div>

                    <div className='lf-input' style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '0 14px', height: 48, borderRadius: 12,
                        border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)'}`,
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,1)',
                    }}>
                        <Lock style={{ width: 16, height: 16, flexShrink: 0, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }} />
                        <input
                            type={showPw ? 'text' : 'password'} placeholder='Password' value={password}
                            onChange={e => setPassword(e.target.value)} required
                            style={{ flex: 1, fontSize: 14, fontWeight: 500, color: isDark ? '#f1f5f9' : '#0f172a' }}
                        />
                        <button type='button' onClick={() => setShowPw(v => !v)} tabIndex={-1}
                            style={{ color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.3)', flexShrink: 0, display:'flex' }}>
                            {showPw ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                        </button>
                    </div>

                    <button
                        type='submit' disabled={loading}
                        className='lf-btn'
                        style={{
                            marginTop: 4, height: 48, borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                            background: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
                            color: '#ffffff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.2px',
                            opacity: loading ? 0.65 : 1,
                        }}
                    >
                        {loading
                            ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                                <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                    <path d="M12 2a10 10 0 0 1 10 10" />
                                </svg>
                                Please wait…
                              </span>
                            : state === 'Login' ? 'Sign in' : 'Create account'
                        }
                    </button>
                </form>

                {/* ── Divider ── */}
                <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
                    <div style={{ flex:1, height:1, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
                    <span style={{ fontSize:12, fontWeight:500, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }}>or</span>
                    <div style={{ flex:1, height:1, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
                </div>

                {/* ── Google ── */}
                <div style={{ display:'flex', justifyContent:'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error('Google Login Failed')}
                        theme={isDark ? 'filled_black' : 'outline'}
                        shape="pill"
                        size="large"
                        text={state === 'Login' ? 'signin_with' : 'signup_with'}
                    />
                </div>

                {/* ── Toggle ── */}
                <p style={{
                    textAlign:'center', fontSize:13, marginTop:20,
                    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(15,23,42,0.45)',
                }}>
                    {state === 'Login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')}
                        style={{
                            fontWeight: 700, color: '#f97316', background:'none',
                            border:'none', cursor:'pointer', fontSize:13, padding:0,
                        }}
                    >
                        {state === 'Login' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
