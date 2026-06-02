import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Link2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const HeroSection = () => {
  const [url, setUrl] = useState('')
  const { isDark } = useTheme()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
          Shorten. Track.
          <br />
          <span className="gradient-text">Dominate.</span>
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

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`relative flex items-center backdrop-blur-xl border rounded-2xl p-2 transition-all duration-300 ${
              isDark
                ? 'bg-surface-900/80 border-surface-700/50 focus-within:border-primary-500/40 shadow-2xl shadow-black/20'
                : 'bg-white border-surface-200 focus-within:border-primary-400 shadow-xl shadow-surface-200/50'
            }`}>
              <Link2 size={20} className={`ml-4 mr-2 shrink-0 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
              <input
                id="hero-url-input"
                type="url"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none py-3 px-2 text-base font-medium ${
                  isDark
                    ? 'text-white placeholder-surface-600'
                    : 'text-surface-900 placeholder-surface-400'
                }`}
              />
              <button
                id="hero-shorten-btn"
                className="shrink-0 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 border-none cursor-pointer text-sm"
              >
                Shorten
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
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
