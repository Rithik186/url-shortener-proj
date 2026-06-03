import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, RefreshCw } from 'lucide-react'

const OfflineOverlay = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      setIsOnline(navigator.onLine)
    }, 1200)
  }

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050212]/95 backdrop-blur-xl select-none"
        >
          {/* Neon background glows */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />

          {/* Offline Card */}
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-sm mx-4 p-8 rounded-[32px] border border-primary-500/15 bg-surface-950/40 backdrop-blur-md shadow-[0_24px_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
          >
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-primary-500 to-fuchsia-500" />

            {/* Icon Container */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 20px rgba(139,0,224,0.15)',
                  '0 0 35px rgba(139,0,224,0.3)',
                  '0 0 20px rgba(139,0,224,0.15)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400"
            >
              <WifiOff size={28} />
            </motion.div>

            {/* Content */}
            <h3 className="text-xl font-black tracking-tight text-white mb-2 font-sans">
              Connection Lost
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-8 px-2">
              We couldn't connect to the server. Please check your internet connection or network status and try again.
            </p>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRetry}
              disabled={isChecking}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white cursor-pointer bg-gradient-to-r from-primary-600 to-primary-800 hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] border-none transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
              {isChecking ? 'Checking Connection...' : 'Retry Connection'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineOverlay
