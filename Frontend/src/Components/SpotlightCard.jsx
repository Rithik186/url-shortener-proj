import { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const SpotlightCard = ({ children, className = '', spotlightColor }) => {
  const { isDark } = useTheme();
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = e => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.9);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.95);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  // Determine spotlight color dynamically based on theme if not explicitly provided
  const activeSpotlightColor = spotlightColor || (isDark 
    ? 'rgba(37, 99, 235, 0.15)' 
    : 'rgba(37, 99, 235, 0.12)'
  );

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl overflow-hidden p-8 border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDark 
          ? 'border-white/[0.06] bg-[#0c1324]/40 hover:border-primary-500/30' 
          : 'border-slate-200/95 bg-white hover:border-primary-500/40 hover:shadow-[0_16px_36px_rgba(37,99,235,0.08)]'
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(250px circle at ${position.x}px ${position.y}px, ${activeSpotlightColor}, transparent 100%)`
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
