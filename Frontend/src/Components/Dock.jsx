'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dock({ items, className = '' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`}>
      <div 
        className="flex items-center gap-4.5 rounded-3xl border px-6 py-3.5 backdrop-blur-xl bg-white/70 dark:bg-[#090714]/80 border-slate-200/50 dark:border-[#221a3b]/50 shadow-[0_15px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.35)] relative overflow-hidden"
        role="toolbar"
        aria-label="Application dock"
      >
        {/* Background ambient top divider glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-[1px]" />
        
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
                  className="absolute -top-12 left-1/2 w-fit whitespace-pre rounded-lg border px-2.5 py-1.5 text-[11px] font-bold shadow-md bg-white dark:bg-[#120f22] text-slate-800 dark:text-purple-200 border-slate-200 dark:border-[#2b224d] z-[1001]"
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
                  ? 'bg-gradient-to-br from-indigo-50/70 to-violet-50/70 border-indigo-200/80 text-indigo-650 dark:from-indigo-950/40 dark:to-violet-950/40 dark:border-indigo-500/50 dark:text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)] dark:shadow-[0_0_15px_rgba(124,58,237,0.25)]'
                  : 'bg-white dark:bg-[#151128] border-slate-200 dark:border-[#261f44]/80 text-slate-600 dark:text-purple-300 hover:text-indigo-650 dark:hover:text-purple-100 hover:bg-slate-50 dark:hover:bg-[#1c1735]'
              } ${item.className || ''}`}
              aria-haspopup="true"
            >
              <div className="flex items-center justify-center z-10">
                {item.icon}
              </div>

              {/* Glowing active indicator dot */}
              {item.isActive && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-md shadow-violet-500/50 z-20" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
