import { useTheme } from '../context/ThemeContext'
import PillNav from '../Components/PillNav'
import HeroSection from '../Components/landing/HeroSection'
import FeaturesSection from '../Components/landing/FeaturesSection'
import HowItWorks from '../Components/landing/HowItWorks'
import CTASection from '../Components/landing/CTASection'
import Footer from '../Components/Footer'
import logo from '../assets/logo.svg'
import { Sun, Moon } from 'lucide-react'

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme()

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Log In', href: '/login' },
    { label: 'Get Started', href: '/signup' }
  ]

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${isDark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
      
      {/* Floating Header Actions / Theme Toggle */}
      <div className="absolute top-[1.2em] right-6 z-[1001] flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center ${
            isDark
              ? 'border-surface-800 bg-surface-900 text-yellow-400 hover:bg-surface-800 hover:scale-105'
              : 'border-surface-200 bg-white text-surface-500 hover:text-primary-600 hover:bg-surface-50 hover:scale-105'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <PillNav
          logo={logo}
          logoAlt="Nebula Logo"
          items={navItems}
          ease="power3.easeOut"
          baseColor={isDark ? '#120F17' : '#ffffff'}
          pillColor={isDark ? '#1e1a26' : '#f8fafc'}
          pillTextColor={isDark ? '#e9d5ff' : '#4f46e5'}
          hoveredPillTextColor={isDark ? '#120F17' : '#ffffff'}
          hoverCircleColor={isDark ? '#ffffff' : '#1e1b4b'}
          initialLoadAnimation={true}
        />
      </div>
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
