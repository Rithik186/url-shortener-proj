import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, Lock, User, ArrowRight, Loader2, ArrowLeft 
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Authentication failed');
        setIsLoading(false);
        return;
      }

      login(data.user, data.token); // AuthContext handles redirect to /home and success toast
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Cannot connect to backend server. Is it running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      toast.success('Google authentication successful!');
      login({ id: 'google-temp', name: 'Google User', email: 'google@user.com' }, 'dummy-token');
    },
    onError: (error) => {
      toast.error('Google auth failed.');
      console.log('Auth Failed:', error);
    }
  });

  return (
    <div className={`min-h-screen flex transition-colors duration-500 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-[#0c0919] via-[#09070f] to-[#120a21] text-white' 
        : 'bg-gradient-to-br from-[#faf5ff] via-[#eef2ff] to-[#e0e7ff] text-[#1e1b4b]'
    }`}>
      
      {/* Fixed Back Button (Top-Left of screen) */}
      <button 
        onClick={() => navigate('/')}
        className={`fixed top-6 left-6 md:top-8 md:left-8 p-3 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border shadow-md z-[100] hover:scale-110 active:scale-95 ${
          isDark 
            ? 'bg-[#151124]/90 border-[#2d254b]/60 text-indigo-300 hover:text-white hover:bg-[#1e1738]/90 hover:shadow-indigo-500/20 hover:border-indigo-500/40 shadow-black/40' 
            : 'bg-white/90 border-indigo-150 text-indigo-600 hover:text-indigo-900 hover:bg-[#f3f1fa]/90 hover:shadow-indigo-500/10 hover:border-indigo-300 shadow-indigo-100/50'
        }`}
        aria-label="Back to home"
      >
        <ArrowLeft size={18} className="transition-transform duration-300 hover:-translate-x-0.5" />
      </button>
      
      {/* Dynamic Keyframe Animations Style Tag */}
      <style>{`
        @keyframes hoverLargePlanet {
          0%, 100% { transform: translateY(0px) rotate(-15deg); }
          50% { transform: translateY(-10px) rotate(-13deg); }
        }
        @keyframes hoverMediumPlanet {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(4deg); }
        }
        @keyframes hoverSmallPlanet {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes shootingStarFast {
          0% {
            transform: translate(60vw, -60vh) rotate(-35deg) scaleX(0);
            opacity: 0;
          }
          8% {
            opacity: 1;
            transform: translate(45vw, -45vh) rotate(-35deg) scaleX(2.5);
          }
          65% {
            transform: translate(-45vw, 45vh) rotate(-35deg) scaleX(2.5);
            opacity: 0.9;
          }
          85%, 100% {
            transform: translate(-60vw, 60vh) rotate(-35deg) scaleX(0);
            opacity: 0;
          }
        }
        @keyframes shootingStarSlow {
          0% {
            transform: translate(80vw, -40vh) rotate(-25deg) scaleX(0);
            opacity: 0;
          }
          12% {
            opacity: 1;
            transform: translate(55vw, -25vh) rotate(-25deg) scaleX(2);
          }
          70% {
            transform: translate(-55vw, 25vh) rotate(-25deg) scaleX(2);
            opacity: 0.8;
          }
          90%, 100% {
            transform: translate(-80vw, 40vh) rotate(-25deg) scaleX(0);
            opacity: 0;
          }
        }
        .animate-large-planet {
          animation: hoverLargePlanet 14s ease-in-out infinite;
        }
        .animate-medium-planet {
          animation: hoverMediumPlanet 18s ease-in-out infinite;
        }
        .animate-small-planet {
          animation: hoverSmallPlanet 10s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3.5s ease-in-out infinite;
        }
        .shooting-star-fast-1 { animation: shootingStarFast 5s linear infinite; }
        .shooting-star-fast-2 { animation: shootingStarFast 7s linear infinite; animation-delay: 1.5s; }
        .shooting-star-fast-3 { animation: shootingStarFast 9s linear infinite; animation-delay: 3s; }
        .shooting-star-fast-4 { animation: shootingStarFast 11s linear infinite; animation-delay: 4.5s; }
        
        .shooting-star-slow-1 { animation: shootingStarSlow 12s linear infinite; animation-delay: 0.5s; }
        .shooting-star-slow-2 { animation: shootingStarSlow 15s linear infinite; animation-delay: 3.5s; }
        .shooting-star-slow-3 { animation: shootingStarSlow 18s linear infinite; animation-delay: 7s; }
        .shooting-star-slow-4 { animation: shootingStarSlow 22s linear infinite; animation-delay: 10s; }
      `}</style>

      {/* Animated Shooting Stars (Spans the Entire Width - Fully Behind) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[
          { top: '10%', right: '5%', width: 'w-44', height: 'h-[2px]', className: 'shooting-star-fast-1' },
          { top: '25%', right: '15%', width: 'w-36', height: 'h-[1.5px]', className: 'shooting-star-slow-1' },
          { top: '40%', right: '8%', width: 'w-44', height: 'h-[2px]', className: 'shooting-star-fast-2' },
          { top: '55%', right: '20%', width: 'w-36', height: 'h-[1.5px]', className: 'shooting-star-slow-2' },
          { top: '70%', right: '12%', width: 'w-44', height: 'h-[2px]', className: 'shooting-star-fast-3' },
          { top: '80%', right: '30%', width: 'w-36', height: 'h-[1.5px]', className: 'shooting-star-slow-3' },
          { top: '5%', right: '40%', width: 'w-44', height: 'h-[2px]', className: 'shooting-star-fast-4' },
          { top: '92%', right: '10%', width: 'w-36', height: 'h-[1.5px]', className: 'shooting-star-slow-4' }
        ].map((star, i) => (
          <div
            key={i}
            style={{ top: star.top, right: star.right }}
            className={`absolute rounded-full pointer-events-none ${star.width} ${star.height} ${star.className} ${
              isDark 
                ? 'bg-gradient-to-r from-transparent via-[#818cf8] to-white' 
                : 'bg-gradient-to-r from-transparent via-[#7c3aed] to-[#3b82f6]'
            }`}
          />
        ))}
      </div>

      {/* Twinkling Space Stars (Spans the Entire Width - Fully Behind) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[
          { top: '8%', left: '5%', size: '3px', delay: '0s' },
          { top: '12%', left: '25%', size: '2.5px', delay: '0.4s' },
          { top: '16%', left: '50%', size: '3.5px', delay: '0.8s' },
          { top: '20%', left: '72%', size: '2px', delay: '1.2s' },
          { top: '24%', left: '92%', size: '3px', delay: '1.6s' },
          { top: '28%', left: '15%', size: '2.5px', delay: '2.0s' },
          { top: '32%', left: '38%', size: '4px', delay: '0.3s' },
          { top: '36%', left: '60%', size: '2px', delay: '0.7s' },
          { top: '40%', left: '80%', size: '3px', delay: '1.1s' },
          { top: '44%', left: '10%', size: '2.5px', delay: '1.5s' },
          { top: '48%', left: '48%', size: '3.5px', delay: '1.9s' },
          { top: '52%', left: '70%', size: '2px', delay: '0.2s' },
          { top: '56%', left: '90%', size: '3px', delay: '0.6s' },
          { top: '60%', left: '20%', size: '2.5px', delay: '1.0s' },
          { top: '64%', left: '35%', size: '4px', delay: '1.4s' },
          { top: '68%', left: '55%', size: '2px', delay: '1.8s' },
          { top: '72%', left: '85%', size: '3px', delay: '2.2s' },
          { top: '76%', left: '12%', size: '2.5px', delay: '0.5s' },
          { top: '80%', left: '42%', size: '3.5px', delay: '0.9s' },
          { top: '84%', left: '65%', size: '2px', delay: '1.3s' },
          { top: '88%', left: '88%', size: '3px', delay: '1.7s' },
          { top: '92%', left: '30%', size: '2.5px', delay: '2.1s' },
          { top: '96%', left: '75%', size: '3.5px', delay: '0.1s' },
          { top: '5%', left: '85%', size: '2px', delay: '0.9s' }
        ].map((star, i) => (
          <div 
            key={i} 
            style={{ 
              top: star.top, 
              left: star.left, 
              width: star.size, 
              height: star.size,
              animationDelay: star.delay
            }}
            className={`absolute rounded-full animate-twinkle ${
              isDark 
                ? 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]' 
                : 'bg-[#7c3aed] opacity-50 shadow-[0_0_8px_rgba(124,58,237,0.4)]'
            }`} 
          />
        ))}
      </div>

      {/* Symmetrical Floating Custom Painted Planets (Root Level) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* 1. Large Top-Left Giant Planet with rings (Left Side) */}
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full flex items-center justify-center animate-large-planet">
          {/* Planet sphere */}
          <div className={`w-full h-full rounded-full bg-gradient-to-br shadow-inner relative overflow-hidden ${
            isDark 
              ? 'from-[#38bdf8] via-[#0ea5e9] to-[#1e3a8a] shadow-[#000000]/60' 
              : 'from-[#60a5fa] via-[#a78bfa] to-[#f472b6] shadow-indigo-100'
          }`}>
            <div className="absolute inset-x-0 top-1/4 h-8 bg-white/15 blur-[1px] transform -skew-y-12" />
            <div className="absolute inset-x-0 top-2/4 h-12 bg-black/10 blur-[2px] transform -skew-y-12" />
            <div className="absolute inset-x-0 top-3/4 h-6 bg-white/5 blur-[1px] transform -skew-y-12" />
          </div>
          {/* Planet Rings */}
          <div className={`absolute w-[140%] h-[40%] rounded-full border-[8px] -rotate-[15deg] pointer-events-none scale-x-[1.2] blur-[1px] ${
            isDark ? 'border-white/15' : 'border-indigo-400/20'
          }`} />
          <div className={`absolute w-[142%] h-[42%] rounded-full border-[2px] -rotate-[15deg] pointer-events-none scale-x-[1.2] ${
            isDark ? 'border-white/5' : 'border-indigo-400/10'
          }`} />
        </div>

        {/* 2. Medium Purple Cratered Planet (Right Side, floating behind form card!) */}
        <div className="absolute top-[28%] right-[8%] w-32 h-32 rounded-full flex items-center justify-center animate-medium-planet">
          <div className={`w-full h-full rounded-full bg-gradient-to-br shadow-md relative overflow-hidden ${
            isDark 
              ? 'from-[#c084fc] via-[#8b5cf6] to-[#4c1d95]' 
              : 'from-[#fbcfe8] via-[#f472b6] to-[#db2777]'
          }`}>
            <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-black/10 shadow-inner" />
            <div className="absolute bottom-6 left-8 w-8 h-8 rounded-full bg-black/10 shadow-inner" />
            <div className="absolute top-12 right-6 w-4 h-4 rounded-full bg-black/10 shadow-inner" />
          </div>
          {/* Glowing Ring Lines */}
          <div className={`absolute w-[140%] h-[35%] rounded-full border-[4px] rotate-[20deg] pointer-events-none scale-x-[1.2] blur-[0.5px] ${
            isDark ? 'border-white/15' : 'border-indigo-400/25'
          }`} />
          <div className={`absolute w-[142%] h-[37%] rounded-full border-[1.5px] rotate-[20deg] pointer-events-none scale-x-[1.2] ${
            isDark ? 'border-white/5' : 'border-indigo-400/15'
          }`} />
          <div className={`absolute -inset-2 rounded-full blur-xl pointer-events-none ${
            isDark ? 'bg-purple-500/20' : 'bg-pink-400/30'
          }`} />
        </div>

        {/* 3. Small Cratered Planet (Left Side, floating below left panel text) */}
        <div className="absolute bottom-[20%] left-[8%] w-24 h-24 rounded-full relative animate-small-planet">
          <div className={`w-full h-full rounded-full bg-gradient-to-br shadow-md ${
            isDark 
              ? 'from-[#f472b6] via-[#db2777] to-[#831843]' 
              : 'from-[#a7f3d0] via-[#34d399] to-[#059669]'
          }`}>
            <div className="absolute top-3 left-4 w-3.5 h-3.5 rounded-full bg-black/10 shadow-inner" />
            <div className="absolute bottom-4 right-5 w-5 h-5 rounded-full bg-black/10 shadow-inner" />
          </div>
          <div className={`absolute -inset-1 rounded-full blur-lg pointer-events-none ${
            isDark ? 'bg-pink-500/20' : 'bg-emerald-400/30'
          }`} />
        </div>

        {/* 4. New Gas Giant Planet (Bottom Right Side, balancing the screen below form card) */}
        <div className="absolute bottom-[10%] right-[10%] w-28 h-28 rounded-full flex items-center justify-center animate-large-planet" style={{ animationDelay: '-6s' }}>
          {/* Planet sphere */}
          <div className={`w-full h-full rounded-full bg-gradient-to-br shadow-inner relative overflow-hidden ${
            isDark 
              ? 'from-[#fb923c] via-[#f97316] to-[#7c2d12] shadow-[#000000]/60' 
              : 'from-[#fef08a] via-[#fb923c] to-[#ec4899] shadow-indigo-100'
          }`}>
            <div className="absolute inset-x-0 top-1/3 h-5 bg-white/10 blur-[1px] transform skew-y-6" />
            <div className="absolute inset-x-0 top-2/3 h-6 bg-black/15 blur-[1.5px] transform skew-y-6" />
          </div>
          {/* Planet Rings */}
          <div className={`absolute w-[130%] h-[30%] rounded-full border-[5px] rotate-[10deg] pointer-events-none scale-x-[1.15] blur-[0.5px] ${
            isDark ? 'border-orange-400/20' : 'border-rose-400/30'
          }`} />
          <div className={`absolute w-[132%] h-[32%] rounded-full border-[1.5px] rotate-[10deg] pointer-events-none scale-x-[1.15] ${
            isDark ? 'border-orange-300/10' : 'border-rose-300/15'
          }`} />
          <div className={`absolute -inset-1 rounded-full blur-xl pointer-events-none ${
            isDark ? 'bg-orange-500/15' : 'bg-rose-400/25'
          }`} />
        </div>

      </div>

      {/* LEFT PANEL: Space Adventure Vector Graphics */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-transparent z-10">
        {/* Overlay Title text matching current application details */}
        <div className="absolute bottom-16 left-16 text-left z-10 space-y-1">
          <h2 className={`text-3xl font-black uppercase tracking-wider font-[family-name:var(--font-display)] leading-tight ${
            isDark ? 'text-white' : 'text-[#312e81]'
          }`}>
            Shorten your links to
          </h2>
          <h2 className="text-5xl font-black uppercase tracking-widest text-[#7c3aed] font-[family-name:var(--font-display)] leading-tight drop-shadow-md">
            Infinity!
          </h2>
        </div>
      </div>

      {/* RIGHT PANEL: Transparent overlay Sign In Form */}
      <div className="flex-1 flex flex-col justify-center relative px-4 sm:px-8 md:px-16 lg:px-20 bg-transparent z-10">

        {/* Glassmorphic Widget card wrapper to make the form stand out cleanly */}
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className={`max-w-[440px] w-full mx-auto relative z-10 p-8 md:p-10 rounded-[32px] backdrop-blur-md border transition-colors duration-300 ${
            isDark 
              ? 'bg-[#110e20]/60 border-[#2d254b]/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
              : 'bg-white/60 border-indigo-200/50 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.12)]'
          }`}
        >
          
          {/* Main Title heading matching the image */}
          <motion.div layout className="mb-8">
            <h1 className={`text-4xl md:text-5xl font-black mb-3 tracking-tight font-[family-name:var(--font-display)] uppercase ${
              isDark ? 'text-white' : 'text-[#1e1b4b]'
            }`}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className={`text-xs font-bold tracking-wide uppercase opacity-75 ${
              isDark ? 'text-slate-400' : 'text-[#4f46e5]'
            }`}>
              {isLogin ? 'Sign in with email address' : 'Create an account to begin'}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up Only) */}
            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1">
                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-[#7c3aed]/10 focus-within:border-[#7c3aed] ${
                      isDark ? 'bg-[#151124]/80 border-[#2d254b]' : 'bg-white border-[#e0e7ff]'
                    }`}>
                      <User size={18} className={`absolute left-4 ${isDark ? 'text-slate-500' : 'text-indigo-400'}`} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required={!isLogin}
                        className={`w-full bg-transparent border-none outline-none py-3.5 pl-12 pr-4 text-sm font-semibold ${
                          isDark ? 'text-white placeholder-slate-600' : 'text-slate-800 placeholder-[#a5b4fc]'
                        }`}
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address */}
            <motion.div layout className="space-y-1">
              <div className={`relative flex items-center rounded-2xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-[#7c3aed]/10 focus-within:border-[#7c3aed] ${
                isDark ? 'bg-[#151124]/80 border-[#2d254b]' : 'bg-white border-[#e0e7ff]'
              }`}>
                <Mail size={18} className={`absolute left-4 ${isDark ? 'text-slate-500' : 'text-indigo-400'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full bg-transparent border-none outline-none py-3.5 pl-12 pr-4 text-sm font-semibold ${
                    isDark ? 'text-white placeholder-slate-600' : 'text-slate-800 placeholder-[#a5b4fc]'
                  }`}
                  placeholder="Yourname@gmail.com"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div layout className="space-y-1">
              <div className={`relative flex items-center rounded-2xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-[#7c3aed]/10 focus-within:border-[#7c3aed] ${
                isDark ? 'bg-[#151124]/80 border-[#2d254b]' : 'bg-white border-[#e0e7ff]'
              }`}>
                <Lock size={18} className={`absolute left-4 ${isDark ? 'text-slate-500' : 'text-indigo-400'}`} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full bg-transparent border-none outline-none py-3.5 pl-12 pr-4 text-sm font-semibold ${
                    isDark ? 'text-white placeholder-slate-600' : 'text-slate-800 placeholder-[#a5b4fc]'
                  }`}
                  placeholder="Password"
                />
              </div>
            </motion.div>

            {/* Confirm Password (Sign Up Only) */}
            <AnimatePresence initial={false}>
              {!isLogin && (
                <motion.div
                  key="confirm-password-field"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1">
                    <div className={`relative flex items-center rounded-2xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-[#7c3aed]/10 focus-within:border-[#7c3aed] ${
                      isDark ? 'bg-[#151124]/80 border-[#2d254b]' : 'bg-white border-[#e0e7ff]'
                    }`}>
                      <Lock size={18} className={`absolute left-4 ${isDark ? 'text-slate-500' : 'text-indigo-400'}`} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={!isLogin}
                        className={`w-full bg-transparent border-none outline-none py-3.5 pl-12 pr-4 text-sm font-semibold ${
                          isDark ? 'text-white placeholder-slate-600' : 'text-slate-800 placeholder-[#a5b4fc]'
                        }`}
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Big Gradient Action Button matching image */}
            <motion.button
              layout
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#5b21b6] via-[#3b82f6] to-[#1d4ed8] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#5b21b6]/25 hover:opacity-90 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer text-sm"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Sign in' : 'Sign up'}
                  <ArrowRight size={16} />
                </span>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div layout className={`h-px my-6 w-full ${isDark ? 'bg-[#1f1a3a]' : 'bg-[#e0e7ff]'}`} />

          {/* Third-party Logins */}
          <motion.div layout className="space-y-5">
            <p className={`text-xs font-bold text-center opacity-70 ${isDark ? 'text-slate-400' : 'text-[#4f46e5]'}`}>
              Or continue with
            </p>
            
            {/* Google Button */}
            <button
              onClick={() => handleGoogleAuth()}
              type="button"
              className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl border transition-all duration-200 cursor-pointer font-bold text-xs ${
                isDark 
                  ? 'bg-[#151124] border-[#2d254b] text-white hover:bg-[#1a1530]' 
                  : 'bg-white border-[#e0e7ff] text-[#312e81] hover:bg-[#f5f7ff] shadow-sm shadow-[#818cf8]/5'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </button>
          </motion.div>

          {/* Footer switcher link */}
          <motion.div layout className="mt-8 text-center text-sm md:text-base">
            <span className="font-semibold opacity-70">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                navigate(isLogin ? '/signup' : '/login', { replace: true });
              }} 
              className="font-bold text-[#7c3aed] hover:text-primary-400 bg-transparent border-none cursor-pointer p-0 ml-1 text-sm md:text-base"
            >
              {isLogin ? 'Sign up for free' : 'Log in here'}
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
