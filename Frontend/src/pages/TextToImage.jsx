import React from 'react';
import { Link } from 'react-router-dom';
import useStudioTool from '../hooks/useStudioTool';
import ComparisonSlider from '../Components/ComparisonSlider';
import { Image as ImageIcon, Sparkles, Download, Share2, FolderPlus, Loader2, ArrowLeft } from 'lucide-react';

const STYLES = ['normal', 'cinematic', 'anime', '3d', 'cyberpunk', 'watercolor'];
const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3'];

const TextToImage = () => {
    const {
        prompt, setPrompt,
        style, setStyle,
        aspectRatio, setAspectRatio,
        status, result, isPublic, setIsPublic,
        handleGenerate, downloadImage
    } = useStudioTool('text-to-image');

    return (
        <div className="max-w-[1400px] mx-auto py-8 sm:py-12 px-4 sm:px-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/studio" className="p-2 rounded-full hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3 text-[var(--text-primary)] tracking-tight">
                    <ImageIcon className="text-orange-500 w-8 h-8 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"/> Text to Image
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                {/* Control Panel (Left) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="glass p-6 sm:p-8 rounded-3xl shadow-2xl border-[var(--border-subtle)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] -z-10"></div>
                        
                        <div className="mb-8 relative z-10">
                            <label className="flex justify-between items-center text-sm font-bold text-[var(--text-primary)] mb-3 tracking-wide">
                                Prompt
                            </label>
                            <textarea 
                                rows="4" 
                                placeholder="Describe what you want to see... (e.g., A futuristic cyberpunk city at night with neon lights)"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full p-4 rounded-2xl glass-input text-sm resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-primary)] mb-3 tracking-wide">Style</label>
                                <div className="relative">
                                    <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-3.5 rounded-xl glass-input text-sm appearance-none cursor-pointer">
                                        {STYLES.map(s => <option key={s} value={s} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-primary)] mb-3 tracking-wide">Aspect Ratio</label>
                                <div className="relative">
                                    <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-3.5 rounded-xl glass-input text-sm appearance-none cursor-pointer">
                                        {ASPECT_RATIOS.map(s => <option key={s} value={s} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">{s}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[var(--border-subtle)] relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${isPublic ? 'bg-orange-500' : 'bg-slate-700 group-hover:bg-slate-600'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublic ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                    <div className="text-sm">
                                        <span className={`font-semibold ${isPublic ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>Public Gallery</span>
                                    </div>
                                </label>
                                <div className="text-sm px-1 flex items-center gap-2">
                                    <span className="text-[var(--text-secondary)] font-medium">Cost:</span>
                                    <span className="font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 shadow-sm">1 Credit</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleGenerate}
                                disabled={status === 'processing'}
                                className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {status === 'processing' ? <><Loader2 className="w-5 h-5 animate-spin"/> Processing...</> : <>Generate Image</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result Area (Right) */}
                <div className="lg:col-span-8 flex flex-col relative z-0">
                    <div className="glass rounded-3xl p-4 sm:p-6 flex-1 flex flex-col items-center justify-center border-[var(--border-subtle)] shadow-2xl min-h-[400px] lg:min-h-[550px] overflow-hidden relative group">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/40 via-slate-900/10 to-transparent -z-10 pointer-events-none"></div>

                        {status === 'idle' && !result && (
                            <div className="text-[var(--text-muted)] text-center flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border-subtle)] shadow-inner mb-2 group-hover:scale-110 group-hover:border-orange-500/50 transition-all duration-500">
                                    <ImageIcon className="w-10 h-10 opacity-30 text-[var(--text-primary)] group-hover:text-orange-500 transition-colors"/>
                                </div>
                                <p className="text-lg font-light tracking-wide text-[var(--text-secondary)]">Your AI creation will appear here</p>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 absolute inset-0 bg-orange-600 rounded-full blur-xl animate-pulse opacity-50"></div>
                                    <div className="w-24 h-24 relative bg-[var(--bg-secondary)]/50 backdrop-blur-sm rounded-full border-2 border-orange-500/30 flex items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-orange-400 animate-pulse"/>
                                    </div>
                                    <svg className="absolute -inset-4 w-32 h-32 animate-[spin_4s_linear_infinite]" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" className="text-orange-500/30 stroke-dasharray-[20,10]"></circle>
                                    </svg>
                                </div>
                                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse">Generating...</p>
                                <p className="text-sm text-[var(--text-muted)] mt-2">This usually takes about 5-10 seconds</p>
                            </div>
                        )}

                        {status === 'completed' && result && (
                            <div className="w-full h-full flex flex-col animate-[fadeIn_0.5s_ease-out]">
                                <div className="flex-1 w-full h-full flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
                                    <img src={result.imageUrl} alt="Result" className="w-full h-full object-contain drop-shadow-2xl" />
                                </div>
                                
                                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 glass rounded-2xl shadow-xl">
                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <select 
                                                onChange={(e) => {if(e.target.value) { downloadImage(result.imageUrl, 'enhanced', e.target.value); e.target.value = ''; }}}
                                                className="bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-xl px-5 py-2.5 text-sm font-bold outline-none hover:bg-[var(--bg-card-hover)] hover:border-orange-500/50 transition-all cursor-pointer appearance-none pl-4 pr-10 shadow-sm"
                                                defaultValue=""
                                            >
                                                <option value="" disabled className="bg-[var(--bg-secondary)] text-[var(--text-muted)]">Download...</option>
                                                <option value="png" className="bg-[var(--bg-secondary)]">High-Res PNG</option>
                                                <option value="jpeg" className="bg-[var(--bg-secondary)]">Standard JPEG</option>
                                                <option value="webp" className="bg-[var(--bg-secondary)]">Optimized WEBP</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[var(--text-primary)]">
                                                <Download className="w-4 h-4"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="p-2.5 bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white hover:bg-orange-600 hover:border-orange-500 border border-[var(--border-subtle)] rounded-xl transition-all shadow-sm" title="Add to Favorites">
                                            <FolderPlus className="w-5 h-5"/>
                                        </button>
                                        <button className="p-2.5 bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white hover:bg-blue-600 hover:border-blue-500 border border-[var(--border-subtle)] rounded-xl transition-all shadow-sm" title="Share Creation">
                                            <Share2 className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextToImage;
