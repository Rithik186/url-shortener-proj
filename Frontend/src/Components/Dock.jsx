'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dock({ items, className = '' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`}>
      <div 
        className="flex items-center gap-4 rounded-3xl border px-6 py-3 backdrop-blur-lg bg-white/80 dark:bg-[#0d091a]/85 border-slate-200/50 dark:border-[#231c3d]/60 shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="relative"
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
              className={`w-12 h-12 rounded-full flex items-center justify-center border bg-white dark:bg-[#18132e] border-slate-200 dark:border-[#2b224d] text-slate-700 dark:text-purple-200 hover:text-indigo-650 dark:hover:text-purple-100 hover:scale-108 active:scale-95 transition-all duration-150 ease-out cursor-pointer shadow-sm hover:shadow-md ${item.className || ''}`}
              aria-haspopup="true"
            >
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
