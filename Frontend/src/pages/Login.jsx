import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Link2, Mail, Lock, ArrowRight, Loader2, ArrowLeft, X } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'

const Login = () => {
  const { isDark } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [isSendingForgot, setIsSendingForgot] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1: request, 2: reset (dev testing), 3: success (email sent check)
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setIsSendingForgot(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || 'Failed to send password reset email.')
        return
      }
      
      toast.success(data.message || 'Reset link processed.')
      
      // In local dev, backend sends resetToken back for convenience
      if (data.resetToken) {
        setResetToken(data.resetToken)
        setForgotStep(2)
      } else {
        setForgotStep(3)
      }
    } catch (err) {
      console.error(err)
      toast.error('Connection error connecting to API.')
    } finally {
      setIsSendingForgot(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    
    setIsResetting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || 'Failed to reset password.')
        return
      }
      
      toast.success('Password reset successfully! You can now log in.')
      setShowForgotModal(false)
      setForgotStep(1)
      setForgotEmail('')
      setResetToken('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      console.error(err)
      toast.error('Connection error resetting password.')
    } finally {
      setIsResetting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Invalid email or password.')
        setIsLoading(false)
        return
      }

      // Successful login
      login(data.user)
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Cannot connect to backend server. Is it running?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      toast.success('Google authentication successful!')
      login({ name: 'Google User', email: 'google@user.com' })
    },
    onError: (error) => {
      toast.error('Google login failed.')
      console.log('Login Failed:', error)
    }
  })

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 relative ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
      
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
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] rounded-full blur-3xl opacity-50 ${isDark ? 'bg-primary-500/10' : 'bg-primary-500/5'}`} />
      </div>

      <div className={`relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
        isDark 
          ? 'glass-card border-primary-500/20 shadow-[0_20px_50px_rgba(10,4,32,0.6)]' 
          : 'bg-white/80 border-surface-200 shadow-surface-500/10'
      }`}>
        
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <Link2 size={20} className="text-white" />
          </div>
          <span className={`text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight ${isDark ? 'text-white' : 'text-surface-900'}`}>
            Nebu<span className="gradient-text">la</span>
          </span>
        </Link>

        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Welcome back</h1>
          <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Enter your details to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Email Address</label>
            <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-950/60 border-primary-500/20 focus-within:border-primary-500' : 'bg-white border-surface-300 focus-within:border-primary-500'}`}>
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
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-sm font-medium ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotStep(1)
                  setShowForgotModal(true)
                }}
                className="text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors border-none bg-transparent cursor-pointer no-underline"
              >
                Forgot password?
              </button>
            </div>
            <div className={`relative flex items-center rounded-xl border transition-colors ${isDark ? 'bg-surface-950/60 border-primary-500/20 focus-within:border-primary-500' : 'bg-white border-surface-300 focus-within:border-primary-500'}`}>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                Sign In
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
          onClick={() => toast.error('Google authentication is currently not available. Coming soon!')}
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
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary-500 hover:text-primary-400 transition-colors no-underline">
            Sign up for free
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowForgotModal(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-350 animate-in fade-in"
          />
          <div className={`relative z-10 w-full max-w-md p-8 rounded-3xl border shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-250 ${
            isDark ? 'glass-card border-primary-500/20 text-white animate-pulse-slow' : 'bg-white border-slate-100 text-surface-900'
          }`}>
            <div className="flex justify-between items-start border-b border-surface-200 dark:border-surface-850/50 pb-3">
              <div>
                <h3 className="text-xl font-bold font-sans">
                  {forgotStep === 1 && 'Reset Password'}
                  {forgotStep === 2 && 'Set New Password'}
                  {forgotStep === 3 && 'Check Your Inbox'}
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                  {forgotStep === 1 && 'Enter your email to request a reset link'}
                  {forgotStep === 2 && 'Choose a strong new password for your account'}
                  {forgotStep === 3 && 'We sent recovery instructions to your email'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className={`p-1.5 rounded-full border cursor-pointer transition-all ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-black/5 border-black/10 hover:bg-black/10 text-slate-800'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold uppercase tracking-widest ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>Email Address</label>
                  <div className={`relative flex items-center rounded-xl border transition-colors ${
                    isDark ? 'bg-surface-950/60 border-primary-500/20 focus-within:border-primary-500' : 'bg-surface-50 border-surface-200 focus-within:border-primary-500 shadow-inner'
                  }`}>
                    <Mail size={16} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSendingForgot}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 border-none cursor-pointer shadow-lg shadow-primary-500/25 transition-all disabled:opacity-70"
                >
                  {isSendingForgot ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold uppercase tracking-widest ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>New Password</label>
                  <div className={`relative flex items-center rounded-xl border transition-colors ${
                    isDark ? 'bg-surface-950/60 border-primary-500/20 focus-within:border-primary-500' : 'bg-surface-50 border-surface-200 focus-within:border-primary-500 shadow-inner'
                  }`}>
                    <Lock size={16} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold uppercase tracking-widest ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>Confirm New Password</label>
                  <div className={`relative flex items-center rounded-xl border transition-colors ${
                    isDark ? 'bg-surface-950/60 border-primary-500/20 focus-within:border-primary-500' : 'bg-surface-50 border-surface-200 focus-within:border-primary-500 shadow-inner'
                  }`}>
                    <Lock size={16} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 border-none cursor-pointer shadow-lg shadow-primary-500/25 transition-all disabled:opacity-70"
                >
                  {isResetting ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                </button>
              </form>
            )}

            {forgotStep === 3 && (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <Mail size={24} />
                </div>
                <p className={`text-sm ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
                  We sent a password reset email to <span className="font-bold text-primary-500">{forgotEmail}</span>. Please click the link in that email to reset your credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full mt-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold py-3 rounded-xl border-none cursor-pointer shadow-md"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
