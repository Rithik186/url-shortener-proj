import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Link2, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const { isDark } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Signup failed')
        setIsLoading(false)
        return
      }

      toast.success('Account created successfully in MongoDB!')
      login(data.user) // AuthContext will handle state and redirect
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Cannot connect to backend server. Is it running?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: (codeResponse) => {
      toast.success('Google authentication successful!')
      login({ name: 'Google User', email: 'google@user.com' })
    },
    onError: (error) => {
      toast.error('Google signup failed.')
      console.log('Signup Failed:', error)
    }
  })

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 relative ${isDark ? 'bg-surface-950' : 'bg-surface-50'}`}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className={`absolute top-8 left-8 p-3 rounded-full flex items-center justify-center transition-all cursor-pointer border-none ${
          isDark ? 'bg-surface-800/50 hover:bg-surface-700 text-surface-400 hover:text-white' : 'bg-white hover:bg-surface-100 text-surface-500 hover:text-surface-900 shadow-sm'
        }`}
      >
        <ArrowLeft size={20} />
      </button>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-50 ${isDark ? 'bg-accent-500/10' : 'bg-accent-500/5'}`} />
      </div>

      <div className={`relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-surface-900/80 border-surface-700/50 shadow-black/40' 
          : 'bg-white/80 border-surface-200 shadow-surface-500/10'
      }`}>
        
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <Link2 size={20} className="text-white" />
          </div>
          <span className={`text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight ${isDark ? 'text-white' : 'text-surface-900'}`}>
            Snip<span className="gradient-text">link</span>
          </span>
        </Link>

        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Create an account</h1>
          <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Start shortening and tracking links today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Full Name</label>
            <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-950/50 border-surface-700 focus-within:border-primary-500' : 'bg-white border-surface-300 focus-within:border-primary-500'}`}>
              <User size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white placeholder-surface-600' : 'text-surface-900 placeholder-surface-400'}`}
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Email Address</label>
            <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-950/50 border-surface-700 focus-within:border-primary-500' : 'bg-white border-surface-300 focus-within:border-primary-500'}`}>
              <Mail size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white placeholder-surface-600' : 'text-surface-900 placeholder-surface-400'}`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Password</label>
            <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-950/50 border-surface-700 focus-within:border-primary-500' : 'bg-white border-surface-300 focus-within:border-primary-500'}`}>
              <Lock size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white placeholder-surface-600' : 'text-surface-900 placeholder-surface-400'}`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Confirm Password</label>
            <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-950/50 border-surface-700 focus-within:border-primary-500' : 'bg-white border-surface-300 focus-within:border-primary-500'}`}>
              <Lock size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white placeholder-surface-600' : 'text-surface-900 placeholder-surface-400'}`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className={`h-px flex-1 ${isDark ? 'bg-surface-800' : 'bg-surface-200'}`} />
          <span className={`text-xs uppercase tracking-wider font-medium ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Or continue with</span>
          <div className={`h-px flex-1 ${isDark ? 'bg-surface-800' : 'bg-surface-200'}`} />
        </div>

        <button
          onClick={() => handleGoogleSignup()}
          type="button"
          className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all cursor-pointer font-medium text-sm ${
            isDark 
              ? 'bg-surface-800/50 border-surface-700 hover:bg-surface-800 text-white' 
              : 'bg-white border-surface-300 hover:bg-surface-50 text-surface-700'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Google
        </button>

        <p className={`mt-8 text-center text-sm ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-400 transition-colors no-underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
