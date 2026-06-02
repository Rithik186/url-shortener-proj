import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const HomePage = () => {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
      
      <nav className={`w-full p-6 border-b flex justify-between items-center ${isDark ? 'border-surface-800/50 bg-surface-900/50' : 'border-surface-200 bg-white/50'}`}>
        <div className="font-bold font-[family-name:var(--font-display)] text-xl">
          Snip<span className="gradient-text">link</span> Dashboard
        </div>
        <button 
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition-colors border-none cursor-pointer"
        >
          Logout
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`p-10 rounded-3xl max-w-lg w-full text-center border shadow-xl backdrop-blur-sm ${
          isDark ? 'bg-surface-900/50 border-surface-700/50' : 'bg-white border-surface-200'
        }`}>
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl font-bold text-white mb-6">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          <h1 className="text-3xl font-bold mb-4 font-[family-name:var(--font-display)]">
            Hello, <span className="gradient-text">{user?.name || 'User'}</span>!
          </h1>
          <p className={`text-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            Welcome to your Sniplink Dashboard.
          </p>
          <p className={`mt-2 text-sm ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
            ({user?.email})
          </p>
          
          <div className={`mt-8 p-6 rounded-2xl border border-dashed ${isDark ? 'border-surface-700 bg-surface-950/50' : 'border-surface-300 bg-surface-50'}`}>
            <p className={`text-sm ${isDark ? 'text-surface-500' : 'text-surface-500'}`}>
              Your links and analytics will appear here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
