import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, text = "Loading" }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <motion.span 
          className="absolute w-full h-full border-[1.5px] border-transparent border-t-orange-500 border-r-orange-500 rounded-full opacity-80"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.span 
          className="absolute w-8 h-8 border-[1.5px] border-transparent border-b-orange-400 border-l-orange-400 rounded-full opacity-60"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {text && (
        <p className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm transition-all duration-300">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-10 w-full h-full">
      {loaderContent}
    </div>
  );
};

export default Loader;
