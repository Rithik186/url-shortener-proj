import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const CTASection = () => {
  const { isDark } = useTheme()

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-3xl ${
          isDark ? 'bg-primary-500/8' : 'bg-primary-100/50'
        }`} />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          <motion.h2
            variants={itemVariants}
            className={`text-3xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-4 leading-tight ${
              isDark ? 'text-white' : 'text-surface-900'
            }`}
          >
            Ready to shorten your <span className="gradient-text">first link</span>?
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className={`text-lg max-w-xl mx-auto mb-10 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}
          >
            Join thousands of creators, marketers, and developers who trust Nebula to power their links.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              id="cta-signup-btn"
              className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 no-underline text-base"
            >
              Get Started — It's Free
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className={`font-medium px-8 py-4 rounded-xl border transition-all duration-300 no-underline text-base ${
                isDark
                  ? 'text-surface-400 hover:text-white border-surface-700/50 hover:border-primary-500/30'
                  : 'text-surface-500 hover:text-surface-900 border-surface-200 hover:border-primary-300'
              }`}
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
