import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { 
  Link as LinkIcon, Clock, Eye, Laptop, Globe, MessageSquare, 
  ArrowLeft, ExternalLink, Calendar, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255'; // Vibrant Purple
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = e => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = e => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          card.style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => {
        card.style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-4 w-full select-none relative"
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento = ({
  textAutoHide = false,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  isDark = true,
  
  // URL Analytics Data Props
  urls = [],
  totalCreated = 0,
  activeLinksCount = 0,
  expiredLinksCount = 0,
  totalClicks = 0,
  globalClicksByDay = [],
  globalMaxClickVal = 1,
  globalDevices = {},
  globalBrowsers = {},
  globalCountries = {},
  allVisits = [],
  onSelectUrl = () => {}
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  // Sorting links by performance
  const topUrls = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  const cardStyle = {
    backgroundColor: isDark ? '#120F17' : '#ffffff',
    borderColor: isDark ? '#2F293A' : '#e5e7eb',
    color: isDark ? 'hsl(0, 0%, 100%)' : 'hsl(240, 10%, 10%)',
    '--glow-x': '50%',
    '--glow-y': '50%',
    '--glow-intensity': '0',
    '--glow-radius': '200px'
  };

  const baseClassName = (index) => `card card-${index + 1} flex flex-col relative w-full p-6 rounded-[24px] border border-solid transition-all duration-300 ease-in-out hover:-translate-y-0.5 ${
    enableBorderGlow ? 'card--border-glow' : ''
  } ${isDark ? 'text-white' : 'text-surface-900 shadow-md'}`;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 250px;
            --glow-color: ${glowColor};
            --border-color: ${isDark ? '#2F293A' : '#e2e8f0'};
            --background-dark: ${isDark ? '#120F17' : '#ffffff'};
            --white: ${isDark ? 'hsl(0, 0%, 100%)' : 'hsl(240, 10%, 10%)'};
          }
          
          .card-responsive {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            width: 100%;
          }
          
          @media (min-width: 640px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
              grid-auto-rows: minmax(180px, auto);
            }
            
            .card-responsive .card-1 {
              grid-column: span 1;
              grid-row: span 1;
            }
            .card-responsive .card-2 {
              grid-column: span 1;
              grid-row: span 1;
            }
            .card-responsive .card-3 {
              grid-column: span 2;
              grid-row: span 2;
            }
            .card-responsive .card-4 {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            .card-responsive .card-5 {
              grid-column: 3;
              grid-row: 3;
            }
            .card-responsive .card-6 {
              grid-column: 4;
              grid-row: 3;
            }
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2.5px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.85)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 35%,
                transparent 65%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .card--border-glow:hover {
            box-shadow: 0 10px 30px rgba(${glowColor}, ${isDark ? '0.12' : '0.06'});
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? '#2F293A' : '#cbd5e1'};
            border-radius: 9999px;
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive">
          
          {/* CARD 1: INSIGHTS - Total Created */}
          <ParticleCard
            className={baseClassName(0)}
            style={cardStyle}
            disableAnimations={shouldDisableAnimations}
            particleCount={particleCount}
            glowColor={glowColor}
            enableTilt={enableTilt}
            clickEffect={clickEffect}
            enableMagnetism={enableMagnetism}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-primary-500">Insights</span>
              <span className="p-1.5 rounded-xl bg-primary-500/10 text-primary-500"><LinkIcon size={16} /></span>
            </div>
            <div className="mt-auto">
              <h3 className="text-4xl font-black font-[family-name:var(--font-display)]">{totalCreated}</h3>
              <p className="text-xs opacity-70 mt-1 font-semibold">Total Shortlinks Created</p>
              <p className="text-[10px] opacity-50 mt-0.5">Shortened links hosted in library</p>
            </div>
          </ParticleCard>

          {/* CARD 2: OVERVIEW - Health Summary */}
          <ParticleCard
            className={baseClassName(1)}
            style={cardStyle}
            disableAnimations={shouldDisableAnimations}
            particleCount={particleCount}
            glowColor={glowColor}
            enableTilt={enableTilt}
            clickEffect={clickEffect}
            enableMagnetism={enableMagnetism}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-primary-500">Overview</span>
              <span className="p-1.5 rounded-xl bg-accent-500/10 text-primary-500"><Eye size={16} /></span>
            </div>
            <div className="mt-auto space-y-3">
              <div>
                <h3 className="text-3xl font-black text-primary-500 font-[family-name:var(--font-display)]">{totalClicks}</h3>
                <p className="text-[10px] opacity-70 font-bold">Total Redirection Clicks</p>
              </div>
              <div className="flex gap-4 pt-1 border-t border-surface-200 dark:border-surface-850">
                <div>
                  <span className="text-xs font-black text-emerald-500">{activeLinksCount}</span>
                  <span className="text-[9px] opacity-60 block">Active</span>
                </div>
                <div>
                  <span className="text-xs font-black text-red-500">{expiredLinksCount}</span>
                  <span className="text-[9px] opacity-60 block">Expired</span>
                </div>
              </div>
            </div>
          </ParticleCard>

          {/* CARD 3: TEAMWORK/PERFORMANCE - Top Shortlinks List */}
          <ParticleCard
            className={baseClassName(2)}
            style={cardStyle}
            disableAnimations={shouldDisableAnimations}
            particleCount={particleCount}
            glowColor={glowColor}
            enableTilt={enableTilt}
            clickEffect={clickEffect}
            enableMagnetism={enableMagnetism}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-primary-500">Top Performance</span>
              <span className="text-[10px] opacity-60 font-semibold">Sorted by clicks</span>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {topUrls.length === 0 ? (
                <div className="h-full flex items-center justify-center py-12 text-xs opacity-60">
                  No data to evaluate. Create shortlinks to see dashboard details.
                </div>
              ) : (
                topUrls.map((url, i) => {
                  const maxC = Math.max(...urls.map(u => u.clicks), 1);
                  const pct = ((url.clicks / maxC) * 100).toFixed(0);
                  return (
                    <div 
                      key={url._id} 
                      className={`p-3 rounded-2xl border transition-all hover:bg-primary-500/5 cursor-pointer ${
                        isDark ? 'bg-surface-950/40 border-surface-850/60' : 'bg-surface-50 border-surface-150'
                      }`}
                      onClick={() => onSelectUrl(url)}
                    >
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-bold text-primary-500 truncate max-w-[170px]">
                          neb.la/{url.shortCode}
                        </span>
                        <span className="font-black text-xs">{url.clicks} clicks</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                        isDark ? 'bg-surface-850' : 'bg-surface-150'
                      }`}>
                        <div 
                          style={{ width: `${pct}%` }}
                          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ParticleCard>

          {/* CARD 4: EFFICIENCY - Historical Daily Clicks Chart */}
          <ParticleCard
            className={baseClassName(3)}
            style={cardStyle}
            disableAnimations={shouldDisableAnimations}
            particleCount={particleCount}
            glowColor={glowColor}
            enableTilt={enableTilt}
            clickEffect={clickEffect}
            enableMagnetism={enableMagnetism}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-primary-500">Activity Trend</span>
              <span className="text-[10px] opacity-60 font-semibold">Last 7 Days redirection activity</span>
            </div>

            <div className="relative flex-1 min-h-[160px] w-full flex flex-col justify-end">
              <svg className="w-full h-[130px]" viewBox="0 0 500 130" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradBento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary-500, #8400ff)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="var(--color-primary-500, #8400ff)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.33, 0.66, 1].map((p, i) => (
                  <line 
                    key={i} 
                    x1="0" 
                    y1={130 - p * 110 - 10} 
                    x2="500" 
                    y2={130 - p * 110 - 10} 
                    stroke={isDark ? '#2a2635' : '#f1f5f9'} 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Plot Line and Area */}
                {(() => {
                  if (globalClicksByDay.length === 0) return null;
                  const points = globalClicksByDay.map((d, index) => {
                    const x = 30 + index * 73;
                    const y = 110 - (d.count / globalMaxClickVal) * 90;
                    return { x, y, count: d.count };
                  });

                  const pathD = points.reduce((acc, p, i) => {
                    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                  }, '');

                  const areaD = points.length > 0 
                    ? `${pathD} L ${points[points.length - 1].x} 110 L ${points[0].x} 110 Z` 
                    : '';

                  return (
                    <>
                      {areaD && <path d={areaD} fill="url(#chartGradBento)" />}
                      {pathD && (
                        <path 
                          d={pathD} 
                          fill="none" 
                          stroke="rgba(132, 0, 255, 1)" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                      {points.map((p, i) => (
                        <g key={i} className="group cursor-pointer">
                          <circle cx={p.x} cy={p.y} r="4" fill={isDark ? '#120F17' : '#ffffff'} stroke="rgba(132, 0, 255, 1)" strokeWidth="3" />
                          <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[9px] font-bold fill-current opacity-85">{p.count}</text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
              
              <div className="flex justify-between px-3 mt-2 text-[9px] opacity-75 font-semibold">
                {globalClicksByDay.map((d, i) => (
                  <span key={i}>
                    {new Date(d.day).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' })}
                  </span>
                ))}
              </div>
            </div>
          </ParticleCard>

          {/* CARD 5: CONNECTIVITY - Demographics */}
          <ParticleCard
            className={baseClassName(4)}
            style={cardStyle}
            disableAnimations={shouldDisableAnimations}
            particleCount={particleCount}
            glowColor={glowColor}
            enableTilt={enableTilt}
            clickEffect={clickEffect}
            enableMagnetism={enableMagnetism}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-primary-500">Demographics</span>
              <span className="p-1 rounded bg-accent-500/10 text-primary-500"><Laptop size={14} /></span>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {/* Devices */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Top Devices</span>
                {Object.keys(globalDevices).length === 0 ? (
                  <p className="text-[10px] opacity-50">Awaiting device logs...</p>
                ) : (
                  Object.entries(globalDevices).map(([device, count]) => {
                    const pct = ((count / allVisits.length) * 100).toFixed(0);
                    return (
                      <div key={device} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span className="capitalize">{device}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className={`w-full h-1 rounded-full ${isDark ? 'bg-surface-850' : 'bg-surface-100'}`}>
                          <div style={{ width: `${pct}%` }} className="h-full bg-primary-500 rounded-full" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Browsers */}
              <div className="space-y-2 pt-2 border-t border-surface-200 dark:border-surface-850">
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Top Browsers</span>
                {Object.keys(globalBrowsers).length === 0 ? (
                  <p className="text-[10px] opacity-50">Awaiting browser logs...</p>
                ) : (
                  Object.entries(globalBrowsers).map(([browser, count]) => {
                    const pct = ((count / allVisits.length) * 100).toFixed(0);
                    return (
                      <div key={browser} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span>{browser}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className={`w-full h-1 rounded-full ${isDark ? 'bg-surface-850' : 'bg-surface-100'}`}>
                          <div style={{ width: `${pct}%` }} className="h-full bg-accent-500 rounded-full" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </ParticleCard>

          {/* CARD 6: PROTECTION - Geolocation / Live Feed */}
          <ParticleCard
            className={baseClassName(5)}
            style={cardStyle}
            disableAnimations={shouldDisableAnimations}
            particleCount={particleCount}
            glowColor={glowColor}
            enableTilt={enableTilt}
            clickEffect={clickEffect}
            enableMagnetism={enableMagnetism}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-primary-500">Live Traffic</span>
              <span className="p-1 rounded bg-accent-500/10 text-primary-500"><Globe size={14} /></span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {allVisits.length === 0 ? (
                <div className="h-full flex items-center justify-center py-10 text-[10px] opacity-50">
                  Awaiting visits to feed...
                </div>
              ) : (
                [...allVisits].reverse().slice(0, 8).map((v, i) => (
                  <div key={i} className={`p-2 rounded-xl border flex items-center justify-between text-[10px] ${
                    isDark ? 'bg-surface-950/60 border-surface-850/70' : 'bg-surface-50 border-surface-150'
                  }`}>
                    <div className="truncate pr-1">
                      <p className="font-bold truncate capitalize">{v.device} • {v.browser}</p>
                      <p className="opacity-50 mt-0.5 text-[8px]">{new Date(v.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <span className="font-black text-primary-500 flex-shrink-0">{v.country}</span>
                  </div>
                ))
              )}
            </div>
          </ParticleCard>

        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
