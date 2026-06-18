import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { X, Zap, Star, Crown, Check, Loader2 } from 'lucide-react';

const PLAN_META = {
    basic:   { icon: <Zap className="w-5 h-5" />,   color: '#3b82f6', glow: 'rgba(59,130,246,0.25)' },
    pro:     { icon: <Star className="w-5 h-5" />,   color: '#f97316', glow: 'rgba(249,115,22,0.25)' },
    premium: { icon: <Crown className="w-5 h-5" />, color: '#a855f7', glow: 'rgba(168,85,247,0.25)' },
};

const PLANS = [
    {
        id: 'basic', name: 'Basic', credits: 25, price: 49,
        popular: false, desc: 'Perfect to get started',
        features: ['25 AI image generations', 'Background removal', 'Image upscaling', 'Standard queue'],
    },
    {
        id: 'pro', name: 'Pro', credits: 75, price: 99,
        popular: true, desc: 'Most popular choice',
        features: ['75 AI image generations', 'Background removal', 'Image upscaling', 'Priority queue', 'All art styles'],
    },
    {
        id: 'premium', name: 'Premium', credits: 200, price: 249,
        popular: false, desc: 'For power creators',
        features: ['200 AI image generations', 'Background removal', 'Image upscaling', 'Priority queue', 'All art styles', 'Prompt enhancer'],
    },
];

const PricingModal = ({ onClose }) => {
    const { backendUrl, token, loadCredits, theme, user } = useContext(AppContext);
    const [loadingPlan, setLoadingPlan] = useState(null);
    const isDark = theme === 'dark';

    const handleBuyPlan = async (plan) => {
        if (!user) { toast.error('Please sign in first'); return; }
        setLoadingPlan(plan.id);
        try {
            // 1. Create order
            const { data } = await axios.post(
                `${backendUrl}/api/payment/create-order`,
                { planId: plan.id },
                { headers: { token } }
            );
            if (!data.success) { toast.error(data.message); return; }

            // 2. Open Razorpay checkout
            const options = {
                key: data.key,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'Imagify',
                description: `${plan.name} Plan — ${plan.credits} Credits`,
                order_id: data.order.id,
                image: '/logo.png',
                handler: async (response) => {
                    try {
                        const verify = await axios.post(
                            `${backendUrl}/api/payment/verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planId: plan.id,
                            },
                            { headers: { token } }
                        );
                        if (verify.data.success) {
                            toast.success(`🎉 ${plan.credits} credits added to your account!`);
                            await loadCredits();
                            onClose();
                            // Reload after short delay so the toast is visible
                            setTimeout(() => window.location.reload(), 1500);
                        } else {
                            toast.error(verify.data.message);
                        }
                    } catch (err) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: '#f97316' },
                modal: { ondismiss: () => setLoadingPlan(null) },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{
                background: isDark ? 'rgba(3,5,14,0.92)' : 'rgba(240,242,255,0.88)',
                backdropFilter: 'blur(28px)',
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <style>{`
                @keyframes pricingFadeUp {
                    from { opacity:0; transform:translateY(28px) scale(0.96); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }
                .pricing-modal { animation: pricingFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
                .plan-card { transition: transform 0.2s, box-shadow 0.2s; }
                .plan-card:hover { transform: translateY(-4px); }
            `}</style>

            <div className="pricing-modal w-full" style={{ maxWidth: 900 }}>
                {/* Header */}
                <div className="text-center mb-8 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-0 top-0 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase"
                        style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
                        <Zap className="w-3 h-3" /> Top Up Credits
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: isDark ? '#f8fafc' : '#0f172a', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.5px' }}>
                        Choose your plan
                    </h2>
                    <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.5)', fontSize: 15 }}>
                        One-time purchase. Credits never expire.
                    </p>
                </div>

                {/* Plans grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {PLANS.map((plan) => {
                        const meta = PLAN_META[plan.id];
                        const isLoading = loadingPlan === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className="plan-card relative rounded-3xl overflow-hidden"
                                style={{
                                    background: isDark
                                        ? plan.popular ? 'linear-gradient(160deg, #160e04 0%, #0d1226 100%)' : 'rgba(13,18,38,0.9)'
                                        : '#ffffff',
                                    border: `1.5px solid ${plan.popular ? meta.color : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
                                    boxShadow: plan.popular
                                        ? `0 20px 60px ${meta.glow}, 0 0 0 1px ${meta.color}22`
                                        : isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
                                    padding: '28px 24px',
                                }}
                            >
                                {/* Popular badge */}
                                {plan.popular && (
                                    <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
                                        style={{ background: meta.color, color: '#fff', letterSpacing: '0.5px' }}>
                                        POPULAR
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                                    style={{ background: `${meta.glow}`, color: meta.color, border: `1px solid ${meta.color}33` }}>
                                    {meta.icon}
                                </div>

                                {/* Plan name & desc */}
                                <div className="mb-5">
                                    <h3 className="text-xl font-black mb-0.5" style={{ color: isDark ? '#f8fafc' : '#0f172a', fontFamily: 'Space Grotesk, sans-serif' }}>
                                        {plan.name}
                                    </h3>
                                    <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                                        {plan.desc}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="mb-5 pb-5" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
                                    <div className="flex items-end gap-1.5">
                                        <span className="text-4xl font-black" style={{ color: meta.color, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-1px' }}>
                                            ₹{plan.price}
                                        </span>
                                        <span className="text-sm mb-1.5 font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                                            one-time
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold mt-1" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)' }}>
                                        {plan.credits} Credits
                                    </p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2.5 mb-6">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                                            <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: meta.color }} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <button
                                    onClick={() => handleBuyPlan(plan)}
                                    disabled={!!loadingPlan}
                                    className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    style={{
                                        background: plan.popular
                                            ? `linear-gradient(135deg, ${meta.color}, #d97706)`
                                            : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                                        color: plan.popular ? '#fff' : meta.color,
                                        border: plan.popular ? 'none' : `1.5px solid ${meta.color}44`,
                                    }}
                                >
                                    {isLoading
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                                        : `Get ${plan.credits} Credits`
                                    }
                                </button>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-xs mt-6" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)' }}>
                    Secured by Razorpay · 100% safe transactions · Instant credit delivery
                </p>
            </div>
        </div>
    );
};

export default PricingModal;
