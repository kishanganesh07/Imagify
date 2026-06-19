import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

const ComparisonSlider = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = (clientX) => {
        if (!containerRef.current || !isDragging) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', () => setIsDragging(false));
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', () => setIsDragging(false));
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', () => setIsDragging(false));
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', () => setIsDragging(false));
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none bg-slate-900 group"
            onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
            onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
        >
            {/* After Image (Background) */}
            <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            
            {/* Before Image (Clipped overlay) */}
            <div 
                className="absolute inset-0 right-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur pointer-events-none flex items-center justify-center transition-opacity"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className={`w-8 h-8 bg-white text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-transform ${isDragging ? 'scale-110 shadow-orange-500/50' : 'group-hover:scale-110'}`}>
                    <GripVertical className="w-5 h-5" />
                </div>
            </div>
            
            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
                BEFORE
            </div>
            <div className="absolute top-4 right-4 bg-orange-600/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">
                AFTER
            </div>
        </div>
    );
};

export default ComparisonSlider;
