import { motion } from 'framer-motion'
import { Link2, Globe } from 'lucide-react'

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const Footer = () => {
  const socialLinks = [
    { Icon: GithubIcon, href: 'https://github.com/Rithik186', label: 'GitHub' },
    { Icon: Globe, href: 'https://rithik186.netlify.app/', label: 'Portfolio' },
    { Icon: LinkedinIcon, href: 'https://www.linkedin.com/in/rithikkannaa-k/', label: 'LinkedIn' }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={containerVariants}
      className="relative border-t border-slate-800/40 bg-[#0a0814] text-slate-400 overflow-hidden"
    >
      {/* Background glow animation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary-500/5 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-slate-800/30">
          {/* Brand */}
          <motion.div variants={childVariants} className="max-w-md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Link2 size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight text-white">
                Nebu<span className="gradient-text">la</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Transform long URLs into powerful short links with real-time analytics. Build, track, and optimize your connection points.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={childVariants} className="flex gap-4">
            {socialLinks.map(({ Icon, href, label }) => (
              <a 
                key={label} 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={label}
                className="w-11 h-11 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-center transition-all duration-300 no-underline text-slate-400 hover:text-white hover:bg-primary-500/10 hover:border-primary-500/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,0,224,0.15)]"
              >
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div 
          variants={childVariants}
          className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500"
        >
          <p>&copy; {new Date().getFullYear()} Nebula. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with</span>
            <span className="animate-pulse text-red-500">❤️</span>
            <span>by</span>
            <a 
              href="https://rithik186.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-primary-400 hover:text-primary-300 hover:underline transition-colors"
            >
              Rithik
            </a>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
