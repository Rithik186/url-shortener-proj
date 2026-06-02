import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, Lock, User, ArrowRight, Loader2, ArrowLeft 
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

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

      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
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
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes shootingStar {
          0% {
            transform: translate(250px, -250px) rotate(-35deg) scaleX(0);
            opacity: 0;
          }
          8% {
            opacity: 1;
            transform: translate(120px, -120px) rotate(-35deg) scaleX(1.3);
          }
          28% {
            transform: translate(-180px, 180px) rotate(-35deg) scaleX(1.3);
            opacity: 0;
          }
          100% {
            transform: translate(-250px, 250px) rotate(-35deg) scaleX(0);
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
        .shooting-star-1 {
          animation: shootingStar 8s linear infinite;
        }
        .shooting-star-2 {
          animation: shootingStar 11s linear infinite;
          animation-delay: 3s;
        }
        .shooting-star-3 {
          animation: shootingStar 15s linear infinite;
          animation-delay: 6s;
        }
      `}</style>

      {/* Animated Shooting Stars (Spans the Entire Width) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className={`absolute top-[15%] right-[10%] w-36 h-[1.5px] bg-gradient-to-r from-transparent via-[#818cf8] to-white rounded-full shooting-star-1`} />
        <div className={`absolute top-[35%] right-[30%] w-28 h-[1px] bg-gradient-to-r from-transparent via-[#c084fc] to-white rounded-full shooting-star-2`} />
        <div className="absolute top-[8%] right-[55%] w-32 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-white rounded-full shooting-star-3" />
        <div className={`absolute top-[60%] right-[15%] w-36 h-[1px] bg-gradient-to-r from-transparent via-[#818cf8] to-white rounded-full shooting-star-1`} style={{ animationDelay: '2s' }} />
      </div>

      {/* Twinkling Space Stars (Spans the Entire Width) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[
          { top: '12%', left: '15%', size: '2.5px', delay: '0s' },
          { top: '24%', left: '45%', size: '2px', delay: '0.8s' },
          { top: '38%', left: '75%', size: '3px', delay: '1.6s' },
          { top: '52%', left: '88%', size: '1.5px', delay: '0.4s' },
          { top: '68%', left: '28%', size: '2.5px', delay: '1.2s' },
          { top: '76%', left: '60%', size: '3.5px', delay: '2.2s' },
          { top: '88%', left: '80%', size: '2px', delay: '0.6s' },
          { top: '15%', left: '62%', size: '3px', delay: '0.5s' },
          { top: '45%', left: '35%', size: '2px', delay: '1.1s' },
          { top: '80%', left: '10%', size: '3.5px', delay: '1.8s' }
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
              isDark ? 'bg-white' : 'bg-[#818cf8] opacity-60 shadow-[0_0_8px_rgba(129,140,248,0.3)]'
            }`} 
          />
        ))}
      </div>

      {/* LEFT PANEL: Space Adventure Vector Graphics */}
      <div className={`hidden lg:flex flex-1 relative items-center justify-center overflow-hidden border-r bg-transparent ${
        isDark ? 'border-[#1f1a3a]/40' : 'border-indigo-100'
      }`}>
        
        {/* Floating Custom Painted Planets */}
        <div className="absolute inset-0 z-0">
          
          {/* 1. Large Top-Left Giant Planet with rings */}
          <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full flex items-center justify-center animate-large-planet">
            {/* Planet sphere */}
            <div className={`w-full h-full rounded-full bg-gradient-to-br shadow-inner relative overflow-hidden ${
              isDark 
                ? 'from-[#38bdf8] via-[#0ea5e9] to-[#1e3a8a] shadow-[#000000]/60' 
                : 'from-[#60a5fa] via-[#a78bfa] to-[#f472b6] shadow-indigo-100'
            }`}>
              {/* Planetary atmosphere waves */}
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

          {/* 2. Medium Purple Cratered Planet (Middle-Right) */}
          <div className="absolute top-[32%] right-[20%] w-32 h-32 rounded-full relative animate-medium-planet">
            <div className={`w-full h-full rounded-full bg-gradient-to-br shadow-md ${
              isDark 
                ? 'from-[#c084fc] via-[#8b5cf6] to-[#4c1d95]' 
                : 'from-[#fbcfe8] via-[#f472b6] to-[#db2777]'
            }`}>
              {/* Craters */}
              <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-black/10 shadow-inner" />
              <div className="absolute bottom-6 left-8 w-8 h-8 rounded-full bg-black/10 shadow-inner" />
              <div className="absolute top-12 right-6 w-4 h-4 rounded-full bg-black/10 shadow-inner" />
            </div>
            {/* Planetary glow */}
            <div className={`absolute -inset-2 rounded-full blur-xl pointer-events-none ${
              isDark ? 'bg-purple-500/10' : 'bg-pink-400/15'
            }`} />
          </div>

          {/* 3. Small Dark Magenta Planet (Bottom-Left) */}
          <div className="absolute bottom-[20%] left-[12%] w-20 h-20 rounded-full relative animate-small-planet">
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${
              isDark 
                ? 'from-[#f472b6] via-[#db2777] to-[#831843]' 
                : 'from-[#a7f3d0] via-[#34d399] to-[#059669]'
            }`} />
            <div className={`absolute -inset-1 rounded-full blur-lg pointer-events-none ${
              isDark ? 'bg-pink-500/15' : 'bg-emerald-400/15'
            }`} />
          </div>
        </div>

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
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className={`absolute top-8 left-8 sm:left-12 p-2.5 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-sm z-20 hover:scale-105 active:scale-95 ${
            isDark 
              ? 'bg-[#151124] border-[#2d254b] text-surface-400 hover:text-white hover:bg-[#1a1530]' 
              : 'bg-white border-indigo-100 text-slate-500 hover:text-slate-900 hover:bg-[#f5f7ff]'
          }`}
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Glassmorphic Widget card wrapper to make the form stand out cleanly */}
        <div className={`max-w-[440px] w-full mx-auto relative z-10 p-8 md:p-10 rounded-[32px] backdrop-blur-md border transition-all duration-300 ${
          isDark 
            ? 'bg-[#110e20]/60 border-[#2d254b]/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
            : 'bg-white/60 border-indigo-200/50 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.12)]'
        }`}>
          
          {/* Main Title heading matching the image */}
          <div className="mb-8">
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up Only) */}
            {!isLogin && (
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
            )}

            {/* Email Address */}
            <div className="space-y-1">
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
            </div>

            {/* Password */}
            <div className="space-y-1">
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
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {!isLogin && (
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
            )}

            {/* Big Gradient Action Button matching image */}
            <button
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
            </button>
          </form>

          {/* Divider */}
          <div className={`h-px my-6 w-full ${isDark ? 'bg-[#1f1a3a]' : 'bg-[#e0e7ff]'}`} />

          {/* Third-party Logins */}
          <div className="space-y-5">
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
          </div>

          {/* Footer switcher link */}
          <div className="mt-8 text-center text-sm md:text-base">
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
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
