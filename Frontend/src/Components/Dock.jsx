'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dock({ items, className = '' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`}>
      <div 
        className="flex items-center gap-4.5 rounded-3xl border px-6 py-3.5 backdrop-blur-xl bg-white/10 dark:bg-[#070512]/40 border-white/25 dark:border-white/5 shadow-[0_15px_35px_rgba(139,0,224,0.06)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.5)] relative"
        role="toolbar"
        aria-label="Application dock"
      >
        {/* Background ambient top divider glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/25 to-transparent blur-[1px]" />
        
        {items.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Tooltip Label */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                  exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.95 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="absolute -top-12 left-1/2 w-fit whitespace-pre rounded-lg border px-2.5 py-1.5 text-[11px] font-bold shadow-md bg-white/90 dark:bg-[#120f22]/90 text-slate-800 dark:text-purple-200 border-white/30 dark:border-[#2b224d] z-[1001] backdrop-blur-md"
                  role="tooltip"
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dock Item Button */}
            <button
              onClick={item.onClick}
              className={`w-12 h-12 rounded-full flex flex-col items-center justify-center relative cursor-pointer transition-all duration-250 ease-out border shadow-sm hover:shadow-md hover:scale-108 active:scale-95 ${
                item.isActive
                  ? 'bg-gradient-to-br from-violet-500/15 to-violet-600/10 border-violet-500/30 text-violet-600 dark:border-violet-500/50 dark:text-violet-300 shadow-[0_0_12px_rgba(139,0,224,0.2)]'
                  : 'bg-white/20 dark:bg-[#120f26]/40 border-white/20 dark:border-[#261f44]/60 text-slate-650 dark:text-purple-300 hover:text-violet-600 dark:hover:text-purple-100 hover:bg-white/40 dark:hover:bg-[#1c1735]'
              } ${item.className || ''}`}
              aria-haspopup="true"
            >
              <div className="flex items-center justify-center z-10">
                {item.icon}
              </div>

              {/* Glowing active indicator dot */}
              {item.isActive && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-violet-500 shadow-md shadow-violet-500/50 z-20" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
