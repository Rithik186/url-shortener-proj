import { Link2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const TwitterIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
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
  const { isDark } = useTheme()

  return (
    <footer className={`relative border-t ${isDark ? 'border-surface-800/50 bg-transparent' : 'border-surface-200 bg-surface-50'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Link2 size={18} className="text-white" />
              </div>
              <span className={`text-xl font-bold font-[family-name:var(--font-display)] tracking-tight ${isDark ? 'text-white' : 'text-surface-900'}`}>
                Nebu<span className="gradient-text">la</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-surface-500' : 'text-surface-500'}`}>
              Transform long URLs into powerful short links with real-time analytics.
            </p>
            <div className="flex gap-3">
              {[GithubIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
                <a key={i} href="#" className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-300 no-underline ${
                  isDark
                    ? 'bg-surface-800/50 hover:bg-primary-500/10 border-surface-700/50 hover:border-primary-500/30'
                    : 'bg-white hover:bg-primary-50 border-surface-200 hover:border-primary-300'
                }`}>
                  <Icon size={16} className={`${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: ['Features', 'API Docs', 'Integrations'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className={`font-semibold text-sm mb-4 uppercase tracking-wider ${isDark ? 'text-white' : 'text-surface-900'}`}>{col.title}</h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className={`text-sm transition-colors duration-200 no-underline ${
                      isDark ? 'text-surface-500 hover:text-primary-400' : 'text-surface-500 hover:text-primary-600'
                    }`}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
          isDark ? 'border-surface-800/50' : 'border-surface-200'
        }`}>
          <p className={`text-xs ${isDark ? 'text-surface-600' : 'text-surface-400'}`}>&copy; {new Date().getFullYear()} Nebula. All rights reserved.</p>
          <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>Built with ❤️ for developers</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
