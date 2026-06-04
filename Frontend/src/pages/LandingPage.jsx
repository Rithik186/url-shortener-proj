import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import PillNav from '../Components/PillNav'
import HeroSection from '../Components/landing/HeroSection'
import FeaturesSection from '../Components/landing/FeaturesSection'
import HowItWorks from '../Components/landing/HowItWorks'
import CTASection from '../Components/landing/CTASection'
import Footer from '../Components/Footer'
import logo from '../assets/logo.svg'
import { Sun, Moon, X, User, Mail, MessageSquare, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../config'

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('nebula-user')
    if (storedUser) {
      const sessionActive = sessionStorage.getItem('nebula-session-active')
      if (sessionActive === 'true') {
        navigate('/home')
      } else {
        navigate('/login')
      }
    }
  }, [navigate])
  
  // Contact Form States
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [isSendingContact, setIsSendingContact] = useState(false)

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Log In', href: '/login' },
    { label: 'Contact Us', onClick: () => setShowContactModal(true) }
  ]

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSendingContact(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage
        })
      })
      const data = await response.json()
      if (response.ok && data.success) {
        toast.success('Your message has been sent successfully!')
        setContactName('')
        setContactEmail('')
        setContactMessage('')
        setShowContactModal(false)
      } else {
        toast.error(data.message || 'Failed to send message')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSendingContact(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen relative overflow-x-hidden ${isDark ? 'bg-transparent text-white' : 'bg-transparent text-surface-900'}`}
    >
      
      {/* Brand Logo */}
      <div className="fixed top-[1.2em] left-4 md:left-8 z-[1001]">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <img 
            src={logo} 
            alt="Nebula Logo" 
            className="w-9 h-9 md:w-10 md:h-10 object-contain group-hover:scale-105 transition-transform duration-300" 
          />
          <span className={`text-xl md:text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight ${isDark ? 'text-white' : 'text-surface-900'}`}>
            Nebu<span className="gradient-text">la</span>
          </span>
        </Link>
      </div>

      {/* Floating Header Actions / Theme Toggle */}
      <div className="fixed top-[1.2em] right-[4.5rem] md:right-6 z-[1001] flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center ${
            isDark
              ? 'border-surface-800 bg-surface-950 text-yellow-400 hover:bg-surface-900 hover:scale-105'
              : 'border-surface-200 bg-white text-surface-500 hover:text-primary-600 hover:bg-surface-50 hover:scale-105'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <PillNav
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

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setShowContactModal(false)}
            className="absolute inset-0 bg-surface-950/45 backdrop-blur-md animate-in fade-in duration-200"
          />
          
          {/* Modal Container */}
          <div className={`relative w-full max-w-md p-6 md:p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 theme-card ${
            isDark ? 'text-white' : 'text-surface-950'
          }`}>
            {/* Close button */}
            <button 
              onClick={() => setShowContactModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all border-none cursor-pointer ${
                isDark ? 'bg-surface-850 hover:bg-surface-800 text-surface-400 hover:text-white' : 'bg-surface-50 hover:bg-surface-100 text-surface-500 hover:text-surface-900'
              }`}
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-display)]">Contact Us</h3>
                <p className={`text-xs opacity-60 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>We'd love to hear from you!</p>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>Full Name</label>
                <div className={`relative flex items-center rounded-xl border transition-colors ${
                  isDark ? 'bg-surface-950 border-surface-700 focus-within:border-primary-500' : 'bg-white border-slate-200 focus-within:border-primary-500'
                }`}>
                  <User size={16} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-xs ${isDark ? 'text-white' : 'text-surface-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>Email Address</label>
                <div className={`relative flex items-center rounded-xl border transition-colors ${
                  isDark ? 'bg-surface-950 border-surface-700 focus-within:border-primary-500' : 'bg-white border-slate-200 focus-within:border-primary-500'
                }`}>
                  <Mail size={16} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-xs ${isDark ? 'text-white' : 'text-surface-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>Your Message</label>
                <div className={`relative flex items-start rounded-xl border transition-colors ${
                  isDark ? 'bg-surface-950 border-surface-700 focus-within:border-primary-500' : 'bg-white border-slate-200 focus-within:border-primary-500'
                }`}>
                  <MessageSquare size={16} className={`absolute left-4 top-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-xs resize-none ${isDark ? 'text-white' : 'text-surface-900'}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingContact}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-3 px-5 rounded-xl border-none cursor-pointer transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 mt-2"
              >
                {isSendingContact ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <MessageSquare size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </motion.div>
  )
}

export default LandingPage
