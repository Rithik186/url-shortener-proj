import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link2, BarChart3, Shield, LayoutDashboard, QrCode, PenLine } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const features = [
  {
    icon: Link2,
    title: 'URL Shortening',
    description: 'Submit any long URL and instantly generate a unique short link. Validates input, generates unique codes, and redirects seamlessly.',
    color: 'from-primary-500 to-primary-600',
    glow: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Click Analytics',
    description: 'Track total clicks, last visited time, and recent visit history for every shortened URL with detailed analytics.',
    color: 'from-accent-500 to-accent-600',
    glow: 'accent',
  },
  {
    icon: Shield,
    title: 'Authentication & Security',
    description: 'Secure signup and login with protected dashboard routes. Every user manages only their own shortened URLs.',
    color: 'from-violet-500 to-violet-600',
    glow: 'violet',
  },
  {
    icon: LayoutDashboard,
    title: 'User Dashboard',
    description: 'View all your links, original URLs, click counts, and creation dates. Delete or copy short URLs instantly from the UI.',
    color: 'from-amber-500 to-amber-600',
    glow: 'amber',
  },
  {
    icon: QrCode,
    title: 'QR Code Generation',
    description: 'Automatically generate QR codes for each shortened URL — perfect for print, social media, and offline sharing.',
    color: 'from-cyan-500 to-cyan-600',
    glow: 'cyan',
  },
  {
    icon: PenLine,
    title: 'Custom Aliases',
    description: 'Create branded, memorable short links with custom aliases instead of random codes. Make your links truly yours.',
    color: 'from-rose-500 to-rose-600',
    glow: 'rose',
  },
]

const glowColors = {
  primary: 'rgba(99,102,241,0.15)',
  accent: 'rgba(16,185,129,0.15)',
  violet: 'rgba(139,92,246,0.15)',
  amber: 'rgba(245,158,11,0.15)',
  cyan: 'rgba(6,182,212,0.15)',
  rose: 'rgba(244,63,94,0.15)',
}

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = feature.icon
  const { isDark } = useTheme()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative glass-card glass-card-hover p-8 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: glowColors[feature.glow] }}
      />

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className="text-white" />
        </div>
        <h3 className={`text-lg font-semibold mb-3 font-[family-name:var(--font-display)] ${
          isDark ? 'text-white' : 'text-surface-900'
        }`}>{feature.title}</h3>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{feature.description}</p>
      </div>
    </motion.div>
  )
}

const FeaturesSection = () => {
  const headRef = useRef(null)
  const isHeadInView = useInView(headRef, { once: true, margin: '-50px' })
  const { isDark } = useTheme()

  return (
    <section id="features" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeadInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
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
