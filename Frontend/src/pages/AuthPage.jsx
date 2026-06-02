import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Link2, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const AuthPage = () => {
  const { isDark } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [location.pathname])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password }

      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setIsLoading(false)
          return
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Authentication failed')
        setIsLoading(false)
        return
      }

      login(data.user, data.token) // AuthContext handles redirect to /home and success toast
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Cannot connect to backend server. Is it running?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      // In a real app, you'd send codeResponse to backend to verify and get user
      toast.success('Google authentication successful!')
      login({ id: 'google-temp', name: 'Google User', email: 'google@user.com' }, 'dummy-token')
    },
    onError: (error) => {
      toast.error('Google auth failed.')
      console.log('Auth Failed:', error)
    }
  })

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${isDark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
      
      {/* Left Panel - Branding/Graphics */}
      <div className={`hidden lg:flex flex-1 relative items-center justify-center overflow-hidden ${isDark ? 'bg-surface-900' : 'bg-white'} border-r ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 p-12 max-w-lg text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-8 no-underline group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <Link2 size={24} className="text-white" />
            </div>
            <span className={`text-4xl font-bold font-[family-name:var(--font-display)] tracking-tight ${isDark ? 'text-white' : 'text-surface-900'}`}>
              Snip<span className="gradient-text">link</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-display)]">
            {isLogin ? 'Welcome back to Sniplink' : 'Start your journey with us'}
          </h2>
          <p className={`text-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            {isLogin 
              ? 'Access your custom short links, analytics, and manage your dashboard.' 
              : 'Create custom short URLs, track clicks, and manage everything from a beautiful dashboard.'}
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center relative px-6 py-12 sm:px-12 lg:px-24">
        <button 
          onClick={() => navigate('/')}
          className={`absolute top-8 left-8 sm:left-12 p-3 rounded-full flex items-center justify-center transition-all cursor-pointer border-none z-20 ${
            isDark ? 'bg-surface-800/50 hover:bg-surface-700 text-surface-400 hover:text-white' : 'bg-white hover:bg-surface-100 text-surface-500 hover:text-surface-900 shadow-sm'
          }`}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="text-center mb-8 lg:hidden">
             <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6 no-underline">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Link2 size={20} className="text-white" />
              </div>
              <span className={`text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight ${isDark ? 'text-white' : 'text-surface-900'}`}>
                Snip<span className="gradient-text">link</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-display)]">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className={`${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
              {isLogin ? 'Enter your details to access your account.' : 'Fill in your details to get started.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Full Name</label>
                <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'}`}>
                  <User size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white placeholder-surface-600' : 'text-surface-900 placeholder-surface-400'}`}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Email Address</label>
              <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'}`}>
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`block text-sm font-medium ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors bg-transparent border-none cursor-pointer">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'}`}>
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

            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Confirm Password</label>
                <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'}`}>
                  <Lock size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white placeholder-surface-600' : 'text-surface-900 placeholder-surface-400'}`}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
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
            onClick={() => handleGoogleAuth()}
            type="button"
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all cursor-pointer font-medium text-sm ${
              isDark 
                ? 'bg-surface-900 border-surface-700 hover:bg-surface-800 text-white' 
                : 'bg-white border-surface-300 hover:bg-surface-50 text-surface-700 shadow-sm'
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
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin)
                navigate(isLogin ? '/signup' : '/login', { replace: true })
              }} 
              className="font-semibold text-primary-500 hover:text-primary-400 transition-colors no-underline bg-transparent border-none cursor-pointer p-0"
            >
              {isLogin ? 'Sign up for free' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
