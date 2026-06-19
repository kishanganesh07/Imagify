import React from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Scissors, Expand, ArrowRight } from 'lucide-react';

const TOOLS = [
    { 
        id: 'text-to-image', 
        label: 'Text to Image', 
        description: 'Turn your words into stunning visuals instantly using advanced AI.',
        icon: <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mb-4" />,
        path: '/studio/text-to-image'
    },
    { 
        id: 'image-to-image', 
        label: 'Image to Image', 
        description: 'Transform an existing image or blend multiple faces seamlessly.',
        icon: <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mb-4" />,
        path: '/studio/image-to-image'
    },
    { 
        id: 'bg-removal', 
        label: 'Background Removal', 
        description: 'Instantly remove backgrounds from any image with perfect precision.',
        icon: <Scissors className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mb-4" />,
        path: '/studio/remove-bg'
    },
    { 
        id: 'upscale', 
        label: 'Upscaling', 
        description: 'Enhance and upscale your low-resolution images without losing detail.',
        icon: <Expand className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mb-4" />,
        path: '/studio/upscale'
    }
];

const StudioMenu = () => {
    return (
        <div className="max-w-[1400px] mx-auto py-8 sm:py-16 px-4 sm:px-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-12 sm:mb-16">
                <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 flex items-center justify-center gap-4 text-[var(--text-primary)] tracking-tight">
                    <ImageIcon className="text-orange-500 w-10 h-10 sm:w-14 sm:h-14 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"/> 
                    Creative Studio
                </h1>
                <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                    Unleash your creativity with our suite of AI-powered design tools. Choose a feature below to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {TOOLS.map((tool) => (
                    <Link 
                        key={tool.id} 
                        to={tool.path}
                        className="glass p-8 rounded-3xl shadow-lg border border-[var(--border-subtle)] hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 group relative overflow-hidden bg-[var(--bg-card)]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[50px] group-hover:bg-orange-500/20 transition-all duration-500"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            {tool.icon}
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">{tool.label}</h2>
                            <p className="text-[var(--text-secondary)] mb-8 flex-grow">{tool.description}</p>
                            
                            <div className="flex items-center text-orange-500 font-semibold group-hover:translate-x-2 transition-transform duration-300 w-fit">
                                Try Now <ArrowRight className="w-5 h-5 ml-2" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default StudioMenu;
