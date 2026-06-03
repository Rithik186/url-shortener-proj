import { motion } from 'framer-motion'
import { Link2, BarChart3, Share2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Paste Your URL',
    description: 'Drop in any long URL — from any platform, any length. We validate and handle it instantly.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    number: '02',
    icon: Share2,
    title: 'Get Your Short Link',
    description: 'Receive a clean, unique short link with an optional custom alias, ready to share anywhere.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Track Performance',
    description: 'Monitor clicks, visit timestamps, and analytics from your personal dashboard in real-time.',
    color: 'from-violet-500 to-violet-600',
  },
]

const HowItWorks = () => {
  const { isDark } = useTheme()

  return (
    <section id="how-it-works" className="relative py-16 md:py-20">
      <div className={`absolute inset-0 pointer-events-none ${
        isDark ? 'bg-gradient-to-b from-transparent via-primary-500/[0.02] to-transparent' : ''
      }`} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-3 block">How It Works</span>
          <h2 className={`text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-4 ${
            isDark ? 'text-white' : 'text-surface-900'
          }`}>
            Three steps to <span className="gradient-text-accent">shorter links</span>
          </h2>
          <p className={`max-w-xl mx-auto text-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            Start shortening URLs in seconds. No technical setup needed.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-primary-500/30 via-accent-500/30 to-violet-500/30" />
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              <line x1="0" y1="0" x2="100%" y2="0" stroke="url(#dashGrad)" strokeWidth="2" strokeDasharray="6 6" style={{ animation: 'dash-flow 1s linear infinite' }} />
              <defs>
                <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#34d399" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="text-center relative"
              >
                <div className="relative inline-flex items-center justify-center mb-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl relative z-10`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${step.color} opacity-15 blur-xl`} />
                  <span className={`absolute -top-3 -right-3 w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold z-20 font-[family-name:var(--font-display)] ${
                    isDark
                      ? 'bg-surface-900 border-surface-700 text-surface-400'
                      : 'bg-white border-surface-200 text-surface-500 shadow-sm'
                  }`}>
                    {step.number}
                  </span>
                </div>

                <h3 className={`text-xl font-semibold mb-3 font-[family-name:var(--font-display)] ${
                  isDark ? 'text-white' : 'text-surface-900'
                }`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed max-w-xs mx-auto ${
                  isDark ? 'text-surface-400' : 'text-surface-500'
                }`}>{step.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
