import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const HeroSection = () => {
  const { isDark } = useTheme()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-[pulse-glow_6s_ease-in-out_infinite] ${
          isDark ? 'bg-primary-500/8' : 'bg-primary-200/30'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-[pulse-glow_8s_ease-in-out_infinite_2s] ${
          isDark ? 'bg-accent-500/6' : 'bg-accent-400/15'
        }`} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.15)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.15)'} 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`text-5xl md:text-7xl lg:text-8xl font-extrabold font-[family-name:var(--font-display)] leading-[1.05] tracking-tight mb-6 ${
            isDark ? 'text-white' : 'text-surface-900'
          }`}
        >
          Smarter Links,
          <br />
          <span className="gradient-text">Better Clicks.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed ${
            isDark ? 'text-surface-400' : 'text-surface-500'
          }`}
        >
          Transform long, ugly URLs into powerful short links. Track every click,
          analyze your audience, and grow your reach — all from one beautiful dashboard.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/signup"
            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 no-underline text-base"
          >
            Get Started Free
            <ArrowRight size={18} />
          </a>
          <a
            href="#features"
            className={`font-medium px-8 py-4 rounded-xl border transition-all duration-300 no-underline text-base ${
              isDark
                ? 'text-surface-400 hover:text-white border-surface-700/50 hover:border-primary-500/30'
                : 'text-surface-500 hover:text-surface-900 border-surface-200 hover:border-primary-300'
            }`}
          >
            View Features
          </a>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none ${
        isDark
          ? 'bg-gradient-to-t from-surface-950 to-transparent'
          : 'bg-gradient-to-t from-white to-transparent'
      }`} />
    </section>
  )
}

export default HeroSection
