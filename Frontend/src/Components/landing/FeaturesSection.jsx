import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import SpotlightCard from '../SpotlightCard'

/* ── Custom SVG Icon Components ─────────────────────────────────────── */
// ... (omitting lines 8 to 76 for brevity, but they are unchanged)
const IconURLShortening = ({ isDark }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M16 24l-2.83 2.83a4 4 0 01-5.66-5.66L12 16" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity={isDark ? "0.5" : "0.7"} />
    <path d="M24 16l2.83-2.83a4 4 0 015.66 5.66L28 24" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity={isDark ? "0.5" : "0.7"} />
    <path d="M15 25l10-10" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="8" cy="32" r="2" fill={isDark ? "white" : "#8b00e0"} opacity="0.4" />
    <circle cx="32" cy="8" r="2" fill={isDark ? "white" : "#8b00e0"} opacity="0.4" />
  </svg>
)

const IconClickAnalytics = ({ isDark }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="5" y="22" width="6" height="14" rx="2" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.25" : "0.4"} />
    <rect x="14" y="14" width="6" height="22" rx="2" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.4" : "0.6"} />
    <rect x="23" y="18" width="6" height="18" rx="2" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.55" : "0.75"} />
    <rect x="32" y="8" width="6" height="28" rx="2" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.8" : "0.95"} />
    <path d="M5 12 L14 6 L23 10 L35 3" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isDark ? "0.6" : "0.85"} />
    <circle cx="35" cy="3" r="2.5" fill={isDark ? "white" : "#8b00e0"} opacity="0.95" />
  </svg>
)

const IconSecurity = ({ isDark }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M20 4 L34 10 L34 20 C34 28 28 34 20 38 C12 34 6 28 6 20 L6 10 Z" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.1" : "0.2"} />
    <path d="M20 6 L32 11 L32 20 C32 27 27 32 20 36 C13 32 8 27 8 20 L8 11 Z" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="1.5" fill="none" opacity={isDark ? "0.45" : "0.7"} />
    <path d="M14 20 L18 24 L26 16" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconDashboard = ({ isDark }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="4" y="4" width="14" height="14" rx="4" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.7" : "0.85"} />
    <rect x="22" y="4" width="14" height="8" rx="3" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.35" : "0.5"} />
    <rect x="22" y="16" width="14" height="20" rx="4" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.5" : "0.65"} />
    <rect x="4" y="22" width="14" height="14" rx="4" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.3" : "0.45"} />
    <circle cx="11" cy="11" r="3" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.3" : "0.45"} />
    <rect x="25" y="20" width="8" height="2" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.4" : "0.55"} />
    <rect x="25" y="25" width="6" height="2" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.25" : "0.4"} />
  </svg>
)

const IconQRCode = ({ isDark }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="4" y="4" width="12" height="12" rx="2" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="1.8" fill="none" opacity={isDark ? "0.7" : "0.9"} />
    <rect x="7" y="7" width="6" height="6" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.65" : "0.8"} />
    <rect x="24" y="4" width="12" height="12" rx="2" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="1.8" fill="none" opacity={isDark ? "0.7" : "0.9"} />
    <rect x="27" y="7" width="6" height="6" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.65" : "0.8"} />
    <rect x="4" y="24" width="12" height="12" rx="2" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="1.8" fill="none" opacity={isDark ? "0.7" : "0.9"} />
    <rect x="7" y="27" width="6" height="6" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.65" : "0.8"} />
    <rect x="24" y="24" width="4" height="4" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.8" : "0.95"} />
    <rect x="32" y="24" width="4" height="4" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.55" : "0.75"} />
    <rect x="24" y="32" width="4" height="4" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.4" : "0.6"} />
    <rect x="32" y="32" width="4" height="4" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.7" : "0.95"} />
    <rect x="28" y="28" width="4" height="4" rx="1" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.3" : "0.5"} />
  </svg>
)

const IconCustomAlias = ({ isDark }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="4" y="12" width="32" height="16" rx="4" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.1" : "0.2"} />
    <rect x="6" y="14" width="28" height="12" rx="3" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="1.5" fill="none" opacity={isDark ? "0.4" : "0.65"} />
    <text x="10" y="24" fill={isDark ? "white" : "#8b00e0"} stroke={isDark ? "none" : "#8b00e0"} strokeWidth={isDark ? "0" : "0.3"} fontSize="10" fontWeight="700" fontFamily="monospace" opacity={isDark ? "0.75" : "0.9"}>/my</text>
    <text x="23" y="24" fill={isDark ? "white" : "#8b00e0"} stroke={isDark ? "none" : "#8b00e0"} strokeWidth={isDark ? "0" : "0.3"} fontSize="10" fontWeight="700" fontFamily="monospace" opacity={isDark ? "0.95" : "1"}>link</text>
    <path d="M30 8 L33 5 L36 8" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isDark ? "0.6" : "0.85"} />
    <path d="M33 5 L33 14" stroke={isDark ? "white" : "#8b00e0"} strokeWidth="2" strokeLinecap="round" opacity={isDark ? "0.6" : "0.85"} />
    <circle cx="8" cy="8" r="2" fill={isDark ? "white" : "#8b00e0"} opacity={isDark ? "0.2" : "0.35"} />
  </svg>
)

/* ── Feature Data ────────────────────────────────────────────────────── */

const SPOTLIGHT_COLOR = 'rgba(164, 0, 255, 0.45)'

const features = [
  {
    icon: IconURLShortening,
    title: 'URL Shortening',
    description: 'Submit any long URL and instantly generate a unique short link. Validates input, generates unique codes, and redirects seamlessly.',
  },
  {
    icon: IconClickAnalytics,
    title: 'Click Analytics',
    description: 'Track total clicks, last visited time, and recent visit history for every shortened URL with detailed analytics.',
  },
  {
    icon: IconSecurity,
    title: 'Authentication & Security',
    description: 'Secure signup and login with protected dashboard routes. Every user manages only their own shortened URLs.',
  },
  {
    icon: IconDashboard,
    title: 'User Dashboard',
    description: 'View all your links, original URLs, click counts, and creation dates. Delete or copy short URLs instantly from the UI.',
  },
  {
    icon: IconQRCode,
    title: 'QR Code Generation',
    description: 'Automatically generate QR codes for each shortened URL — perfect for print, social media, and offline sharing.',
  },
  {
    icon: IconCustomAlias,
    title: 'Custom Aliases',
    description: 'Create branded, memorable short links with custom aliases instead of random codes. Make your links truly yours.',
  },
]

/* ── Feature Card ────────────────────────────────────────────────────── */

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <SpotlightCard
        spotlightColor={SPOTLIGHT_COLOR}
        className={`h-full transition-all duration-500 hover:-translate-y-1.5 ${
          isDark
            ? '!bg-surface-900/80 !border-surface-800'
            : '!bg-white !border-surface-300/80 shadow-sm'
        }`}
      >
        <div className="relative z-10">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 ${
            isDark
              ? 'bg-white/[0.06] text-primary-400'
              : 'bg-[#a400ff]/10 text-[#8b00e0] border border-[#a400ff]/20'
          }`}>
            <Icon isDark={isDark} />
          </div>

          <h3 className={`text-lg font-semibold mb-3 font-[family-name:var(--font-display)] ${
            isDark ? 'text-white' : 'text-surface-900'
          }`}
          style={isDark ? {} : { textShadow: '0 1px 1px rgba(0,0,0,0.02)' }}
          >{feature.title}</h3>

          <p className={`text-sm leading-relaxed ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{feature.description}</p>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

/* ── Section ─────────────────────────────────────────────────────────── */

const FeaturesSection = () => {
  const { isDark } = useTheme()

  return (
    <section id="features" className="relative py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-3 block">Features</span>
          <h2 className={`text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-4 ${
            isDark ? 'text-white' : 'text-surface-900'
          }`}>
            Everything you need to <span className="gradient-text">manage links</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            Powerful tools to shorten, track, and optimize every link you share.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
