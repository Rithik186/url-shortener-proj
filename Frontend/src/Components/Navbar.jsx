import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Link2, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
  ]

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? isDark
            ? 'bg-surface-950/80 backdrop-blur-xl border-b border-primary-500/10 shadow-lg shadow-primary-500/5'
            : 'bg-white/80 backdrop-blur-xl border-b border-surface-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group no-underline" id="navbar-logo">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow duration-300">
                <Link2 size={18} className="text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
            </div>
            <span className={`text-xl font-bold font-[family-name:var(--font-display)] tracking-tight ${isDark ? 'text-white' : 'text-surface-900'}`}>
              Snip<span className="gradient-text">link</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 relative group no-underline ${
                  isDark ? 'text-surface-400 hover:text-white' : 'text-surface-500 hover:text-surface-900'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'border-surface-700 bg-surface-800/50 text-surface-400 hover:text-yellow-400 hover:border-yellow-500/30'
                  : 'border-surface-200 bg-surface-50 text-surface-500 hover:text-primary-600 hover:border-primary-300'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/login"
              id="navbar-login-btn"
              className={`text-sm font-medium px-5 py-2.5 rounded-xl border border-transparent transition-all duration-300 no-underline ${
                isDark
                  ? 'text-surface-300 hover:text-white hover:border-primary-500/20 hover:bg-primary-500/5'
                  : 'text-surface-600 hover:text-surface-900 hover:border-surface-200 hover:bg-surface-50'
              }`}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              id="navbar-signup-btn"
              className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 no-underline"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile: theme toggle + menu */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'border-surface-700 bg-surface-800/50 text-surface-400'
                  : 'border-surface-200 bg-surface-50 text-surface-500'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              id="mobile-menu-toggle"
              className={`p-2 transition-colors bg-transparent border-none cursor-pointer ${
                isDark ? 'text-surface-400 hover:text-white' : 'text-surface-500 hover:text-surface-900'
              }`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          isMobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-6 pb-6 pt-2 backdrop-blur-xl border-b ${
          isDark
            ? 'bg-surface-950/95 border-primary-500/10'
            : 'bg-white/95 border-surface-200'
        }`}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                  isDark
                    ? 'text-surface-400 hover:text-white hover:bg-primary-500/5'
                    : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                }`}
              >
                {link.label}
              </a>
            ))}
            <hr className={`my-2 ${isDark ? 'border-surface-800' : 'border-surface-200'}`} />
            <Link to="/login" className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
              isDark ? 'text-surface-300 hover:text-white' : 'text-surface-600 hover:text-surface-900'
            }`}>
              Log In
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold px-4 py-3 rounded-xl text-center no-underline mt-1">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
