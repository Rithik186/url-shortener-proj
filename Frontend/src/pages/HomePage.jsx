import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  Link2, Copy, Trash2, Moon, Sun, User, Settings, LogOut, Loader2, 
  Link as LinkIcon, Camera, X, ArrowRight, Menu, BarChart3, QrCode, 
  Plus, Check, ExternalLink, TrendingUp, Download, Search, ChevronRight,
  Clock, Calendar, Sparkles, History, ArrowLeft, Share2, Eye, Globe
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import QRCode from 'qrcode'
import MagicBento from '../Components/MagicBento'

const WhatsAppIcon = ({ size = 16, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
)

const HomePage = () => {
  const { user, logout, updateUser, isLoading: authLoading } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, analytics, qr, settings
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const shortenerInputRef = useRef(null)
  
  // Create Link Form States
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [isShortening, setIsShortening] = useState(false)

  // Data States
  const [urls, setUrls] = useState(() => {
    try {
      const cached = localStorage.getItem('sniplink-cached-urls')
      return cached ? JSON.parse(cached) : []
    } catch (e) {
      return []
    }
  })
  const [loadingUrls, setLoadingUrls] = useState(() => {
    try {
      const cached = localStorage.getItem('sniplink-cached-urls')
      return cached ? JSON.parse(cached).length === 0 : true
    } catch (e) {
      return true
    }
  })
  const [searchQuery, setSearchQuery] = useState('')
  
  // Analytics State
  const [selectedUrlForAnalytics, setSelectedUrlForAnalytics] = useState(null)
  
  // QR States
  const [qrText, setQrText] = useState('')
  const [downloadingQr, setDownloadingQr] = useState(false)
  const [selectedQrUrl, setSelectedQrUrl] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrSearchQuery, setQrSearchQuery] = useState('')
  const [qrSortBy, setQrSortBy] = useState('newest')
  const [qrFilterStatus, setQrFilterStatus] = useState('all')
  const [dashSortBy, setDashSortBy] = useState('newest')
  const [dashFilterStatus, setDashFilterStatus] = useState('all')

  // CSV Bulk States
  const [csvFile, setCsvFile] = useState(null)
  const [csvShorteningProgress, setCsvShorteningProgress] = useState(null)
  const [isCsvShortening, setIsCsvShortening] = useState(false)

  useEffect(() => {
    if (selectedQrUrl) {
      const fullUrl = `http://127.0.0.1:5000/${selectedQrUrl.shortCode}`
      QRCode.toDataURL(
        fullUrl, 
        { 
          width: 300, 
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }
      )
      .then(url => {
        setQrDataUrl(url)
      })
      .catch(err => {
        console.error('Failed to generate QR:', err)
        toast.error('Failed to generate QR Code')
      })
    } else {
      setQrDataUrl('')
    }
  }, [selectedQrUrl])

  // Profile States
  const [profileForm, setProfileForm] = useState({ name: '' })
  const [avatarBase64, setAvatarBase64] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const fileInputRef = useRef(null)

  // Sync user details when they load
  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '' })
      setAvatarBase64(user.avatar || '')
    }
  }, [user])

  // Handle Redirect/Auth Guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login')
      } else {
        fetchUrls()
      }
    }
  }, [user, authLoading, navigate])

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('sniplink-token')
      const response = await fetch('http://127.0.0.1:5000/api/urls', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.status === 401) {
        logout()
        return
      }
      const data = await response.json()
      if (data.success) {
        setUrls(data.urls)
        localStorage.setItem('sniplink-cached-urls', JSON.stringify(data.urls))
        
        // Update selected analytics URL details if one is selected
        if (selectedUrlForAnalytics) {
          const updated = data.urls.find(u => u._id === selectedUrlForAnalytics._id)
          if (updated) setSelectedUrlForAnalytics(updated)
        }

        // Set default QR text to last shortened URL if available
        if (data.urls.length > 0 && !qrText) {
          setQrText(`http://127.0.0.1:5000/${data.urls[0].shortCode}`)
        }
      }
    } catch (error) {
      console.error('Failed to fetch URLs:', error)
    } finally {
      setLoadingUrls(false)
    }
  }

  // Poll server for live stats updates every 5 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(fetchUrls, 5000)
      return () => clearInterval(interval)
    }
  }, [user, selectedUrlForAnalytics])

  const handleCsvUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCsvFile(file)
  }

  const processCsvShortening = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file first')
      return
    }
    
    setIsCsvShortening(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target.result
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
        if (lines.length <= 1) {
          toast.error('CSV is empty or missing data rows')
          setIsCsvShortening(false)
          return
        }

        const rows = []
        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
        const originalUrlIdx = headers.indexOf('originalUrl')
        const customAliasIdx = headers.indexOf('customAlias')
        const expiresAtIdx = headers.indexOf('expiresAt')

        const hasHeaders = originalUrlIdx !== -1
        const startIndex = hasHeaders ? 1 : 0

        for (let i = startIndex; i < lines.length; i++) {
          const columns = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''))
          if (columns.length > 0 && columns[0]) {
            const original = hasHeaders ? columns[originalUrlIdx] : columns[0]
            const alias = hasHeaders && customAliasIdx !== -1 ? columns[customAliasIdx] : columns[1] || ''
            const expiry = hasHeaders && expiresAtIdx !== -1 ? columns[expiresAtIdx] : columns[2] || ''
            
            if (original) {
              rows.push({
                originalUrl: original,
                customAlias: alias || undefined,
                expiresAt: expiry || undefined
              })
            }
          }
        }

        if (rows.length === 0) {
          toast.error('No valid rows found in CSV')
          setIsCsvShortening(false)
          return
        }

        setCsvShorteningProgress({ total: rows.length, current: 0, successes: 0, failures: 0 })

        const token = localStorage.getItem('sniplink-token')
        let successes = 0
        let failures = 0
        const newUrls = []

        for (let index = 0; index < rows.length; index++) {
          const row = rows[index]
          try {
            const response = await fetch('http://127.0.0.1:5000/api/urls/shorten', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify(row)
            })
            const data = await response.json()
            if (response.ok && data.success) {
              successes++
              newUrls.push(data.url)
            } else {
              failures++
            }
          } catch (err) {
            failures++
          }
          setCsvShorteningProgress({
            total: rows.length,
            current: index + 1,
            successes,
            failures
          })
        }

        toast.success(`Bulk shortening complete! ${successes} created, ${failures} failed.`)
        setUrls(prev => [...newUrls, ...prev])
        setCsvFile(null)
        setCsvShorteningProgress(null)
      } catch (err) {
        console.error('CSV Parsing Error:', err)
        toast.error('Failed to parse CSV file')
      } finally {
        setIsCsvShortening(false)
      }
    }
    reader.readAsText(csvFile)
  }

  const handleShorten = async (e) => {
    e.preventDefault()
    if (!originalUrl) return
    setIsShortening(true)
    try {
      const token = localStorage.getItem('sniplink-token')
      const response = await fetch('http://127.0.0.1:5000/api/urls/shorten', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          originalUrl, 
          customAlias: customAlias || undefined, 
          expiresAt: expiresAt || undefined 
        })
      })
      if (response.status === 401) {
        logout()
        return
      }
      const data = await response.json()
      if (response.ok) {
        toast.success('URL shortened successfully!')
        setOriginalUrl('')
        setCustomAlias('')
        setExpiresAt('')
        const updatedUrls = [data.url, ...urls]
        setUrls(updatedUrls)
        localStorage.setItem('sniplink-cached-urls', JSON.stringify(updatedUrls))
        setQrText(`http://127.0.0.1:5000/${data.url.shortCode}`)
        setShowAdvanced(false)
      } else {
        toast.error(data.message || 'Failed to shorten URL')
      }
    } catch (error) {
      toast.error('Server error')
    } finally {
      setIsShortening(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return
    try {
      const token = localStorage.getItem('sniplink-token')
      const response = await fetch(`http://127.0.0.1:5000/api/urls/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.status === 401) {
        logout()
        return
      }
      if (response.ok) {
        toast.success('Link deleted')
        const updatedUrls = urls.filter(url => url._id !== id)
        setUrls(updatedUrls)
        localStorage.setItem('sniplink-cached-urls', JSON.stringify(updatedUrls))
        if (selectedUrlForAnalytics?._id === id) {
          setSelectedUrlForAnalytics(null)
        }
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleCopy = (shortCode, id) => {
    const fullUrl = `http://127.0.0.1:5000/${shortCode}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSystemShare = (url) => {
    if (navigator.share) {
      navigator.share({
        title: 'SnipLink',
        text: 'Check out this shortened link!',
        url: url
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  }

  const handleWhatsAppShare = (url) => {
    const text = encodeURIComponent(`Check out this shortened link: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarBase64(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    try {
      const token = localStorage.getItem('sniplink-token')
      const response = await fetch('http://127.0.0.1:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: profileForm.name, avatar: avatarBase64 })
      })
      if (response.status === 401) {
        logout()
        return
      }
      const data = await response.json()
      if (response.ok) {
        toast.success('Profile updated successfully!')
        updateUser(data.user)
      } else {
        toast.error(data.message || 'Update failed')
      }
    } catch (error) {
      toast.error('Server error')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const downloadQrCode = async () => {
    if (!qrText) return
    setDownloadingQr(true)
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrText)}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sniplink-qr.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('QR Code downloaded!')
    } catch (error) {
      toast.error('Failed to download QR code')
    } finally {
      setDownloadingQr(false)
    }
  }

  // Filtered URLs based on search
  const filteredUrls = urls.filter(url => 
    url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) || 
    url.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filtered & Sorted URLs for the main dashboard list
  const filteredAndSortedDashboardUrls = urls
    .filter(url => {
      const matchesSearch = url.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
      const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
      if (dashFilterStatus === 'active') return matchesSearch && !isExpired
      if (dashFilterStatus === 'expired') return matchesSearch && isExpired
      return matchesSearch
    })
    .sort((a, b) => {
      if (dashSortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (dashSortBy === 'clicks') return b.clicks - a.clicks
      if (dashSortBy === 'name') return a.shortCode.localeCompare(b.shortCode)
      return new Date(b.createdAt) - new Date(a.createdAt) // 'newest' (default)
    })

  // Recent 3 URLs for Dashboard preview
  const recentDashboardUrls = [...urls]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Filtered & Sorted URLs specifically for the QR Library tab
  const filteredAndSortedQrUrls = urls
    .filter(url => {
      const matchesSearch = url.shortCode.toLowerCase().includes(qrSearchQuery.toLowerCase()) ||
                            url.originalUrl.toLowerCase().includes(qrSearchQuery.toLowerCase())
      const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
      if (qrFilterStatus === 'active') return matchesSearch && !isExpired
      if (qrFilterStatus === 'expired') return matchesSearch && isExpired
      return matchesSearch
    })
    .sort((a, b) => {
      if (qrSortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (qrSortBy === 'clicks') return b.clicks - a.clicks
      if (qrSortBy === 'name') return a.shortCode.localeCompare(b.shortCode)
      return new Date(b.createdAt) - new Date(a.createdAt) // 'newest' (default)
    })

  // Analytics helper calculations
  const totalClicks = urls.reduce((acc, curr) => acc + curr.clicks, 0)
  const averageClicks = urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : 0
  const mostClickedLink = urls.length > 0 ? [...urls].sort((a, b) => b.clicks - a.clicks)[0] : null

  // Render Full Screen Loading State to prevent redirection on refresh
  if (authLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${isDark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
          <div className="absolute w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
            <Link2 size={18} className="text-white" />
          </div>
        </div>
        <p className="mt-6 font-[family-name:var(--font-display)] text-lg font-medium opacity-75 tracking-wide animate-pulse">
          Loading dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
      
      {/* Sliding Sidebar Menu & Backdrop (Triggerable on Desktop & Mobile) */}
      <div 
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-350 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 border-r flex flex-col transition-transform duration-350 ease-out shadow-2xl ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'
      }`}>
        {/* Sidebar Logo */}
        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
              <Link2 size={20} className="text-white" />
            </div>
            <span className="font-bold font-[family-name:var(--font-display)] text-2xl tracking-tight">
              Snip<span className="gradient-text">link</span>
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className={`p-2 rounded-xl transition-colors border-none cursor-pointer ${
              isDark ? 'hover:bg-surface-800 text-surface-400' : 'hover:bg-surface-100 text-surface-505'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Mini-Profile */}
        <div className={`p-6 border-b flex items-center gap-4 ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-primary-500" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-bold text-sm truncate">{user?.name}</h4>
            <p className={`text-xs truncate ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{user?.email}</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all border-none cursor-pointer text-left ${
              activeTab === 'dashboard'
                ? 'bg-primary-500/10 text-primary-500 font-bold'
                : isDark ? 'text-surface-400 hover:bg-surface-800 hover:text-white' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
            }`}
          >
            <Sparkles size={20} />
            Dashboard Overview
          </button>

          <button
            onClick={() => { setActiveTab('links'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all border-none cursor-pointer text-left ${
              activeTab === 'links'
                ? 'bg-primary-500/10 text-primary-500 font-bold'
                : isDark ? 'text-surface-400 hover:bg-surface-800 hover:text-white' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
            }`}
          >
            <Link2 size={20} />
            URL Management
          </button>

          <button
            onClick={() => { setActiveTab('analytics'); setSelectedUrlForAnalytics(null); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all border-none cursor-pointer text-left ${
              activeTab === 'analytics' && !selectedUrlForAnalytics
                ? 'bg-primary-500/10 text-primary-500 font-bold'
                : isDark ? 'text-surface-400 hover:bg-surface-800 hover:text-white' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
            }`}
          >
            <BarChart3 size={20} />
            Link Analytics
          </button>



          <button
            onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all border-none cursor-pointer text-left ${
              activeTab === 'settings'
                ? 'bg-primary-500/10 text-primary-500 font-bold'
                : isDark ? 'text-surface-400 hover:bg-surface-800 hover:text-white' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
            }`}
          >
            <Settings size={20} />
            Account & Settings
          </button>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className={`p-4 border-t flex flex-col gap-2 ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors border-none cursor-pointer ${
              isDark ? 'bg-surface-800 hover:bg-surface-700 text-yellow-400' : 'bg-surface-100 hover:bg-surface-200 text-surface-600'
            }`}
          >
            <div className="flex items-center gap-3">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer text-left ${
              isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'
            }`}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className={`sticky top-0 z-30 px-6 py-4 border-b flex justify-between items-center backdrop-blur-md ${
          isDark ? 'bg-surface-950/80 border-surface-800/50' : 'bg-surface-50/80 border-surface-200'
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2.5 rounded-xl border-none cursor-pointer transition-all ${
                isDark ? 'bg-surface-800 hover:bg-surface-700 text-white animate-pulse' : 'bg-white hover:bg-surface-100 text-surface-900 shadow-sm'
              }`}
            >
              <Menu size={20} />
            </button>
            <span className="font-bold font-[family-name:var(--font-display)] text-2xl tracking-tight lg:block hidden">
              Snip<span className="gradient-text">link</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto">
          
          {/* TAB 1: DASHBOARD OVERVIEW (SHOWS ALL SHORTENED LINKS BY DEFAULT) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* URL Shortener Centerpiece */}
              <div className={`p-8 rounded-3xl border text-center space-y-6 max-w-3xl mx-auto shadow-xl relative overflow-hidden ${
                isDark 
                  ? 'bg-surface-900 border-surface-800' 
                  : 'bg-white border-surface-200'
              }`}>
                {/* Background ambient glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-2 relative z-10">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-display)]">
                    Shorten Your <span className="gradient-text">Destination</span> URL
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'} max-w-lg mx-auto`}>
                    Paste your long URL below to get a neat, tracked, and customizable shortlink instantly.
                  </p>
                </div>

                <form onSubmit={handleShorten} className="space-y-4 relative z-10">
                  <div className={`flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl border transition-all ${
                    isDark ? 'bg-surface-950 border-surface-800 focus-within:border-primary-500' : 'bg-surface-50 border-surface-200 focus-within:border-primary-500'
                  }`}>
                    <div className="flex-1 relative flex items-center">
                      <LinkIcon size={18} className={`absolute left-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                      <input 
                        type="url"
                        ref={shortenerInputRef}
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="Paste a long link (e.g. https://example.com/very-long-path)..."
                        required
                        className={`w-full bg-transparent border-none outline-none py-3.5 pl-11 pr-4 text-sm ${
                          isDark ? 'text-white' : 'text-surface-900'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isShortening}
                      className="px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border-none cursor-pointer shadow-lg shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isShortening ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      <span>Shorten URL</span>
                    </button>
                  </div>

                  {/* Toggle Advanced Options */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`text-xs font-bold flex items-center gap-1.5 bg-transparent border-none cursor-pointer hover:underline ${
                        isDark ? 'text-surface-400 hover:text-white' : 'text-surface-500 hover:text-surface-900'
                      }`}
                    >
                      <Settings size={12} />
                      <span>{showAdvanced ? 'Hide Advanced Options' : 'Customize Alias & Expiration'}</span>
                    </button>
                  </div>

                  {/* Advanced Options Content */}
                  {showAdvanced && (
                    <div className={`p-5 rounded-2xl border text-left space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 ${
                      isDark ? 'bg-surface-950/60 border-surface-800/80' : 'bg-white border-surface-150 shadow-inner'
                    }`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Custom Slug Input */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider opacity-85">Custom Alias (Slug)</label>
                          <div className={`relative flex items-center rounded-xl border transition-colors ${
                            isDark ? 'bg-surface-900 border-surface-750 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'
                          }`}>
                            <span className={`absolute left-3.5 text-xs font-semibold ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>/</span>
                            <input 
                              type="text"
                              value={customAlias}
                              onChange={(e) => setCustomAlias(e.target.value)}
                              placeholder="my-custom-slug"
                              className={`w-full bg-transparent border-none outline-none py-2.5 pl-7 pr-4 text-xs ${
                                isDark ? 'text-white' : 'text-surface-900'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Expiration Input */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider opacity-85">Expiration Date</label>
                          <div className={`relative flex items-center rounded-xl border transition-colors ${
                            isDark ? 'bg-surface-900 border-surface-750 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'
                          }`}>
                            <Calendar size={14} className={`absolute left-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                            <input 
                              type="datetime-local"
                              value={expiresAt}
                              onChange={(e) => setExpiresAt(e.target.value)}
                              className={`w-full bg-transparent border-none outline-none py-2.5 pl-9 pr-4 text-xs ${
                                isDark ? 'text-white' : 'text-surface-900'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Main Links List Container */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl font-black font-[family-name:var(--font-display)]">Recent Shortlinks</h3>
                </div>

                {loadingUrls ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-primary-500" />
                  </div>
                ) : recentDashboardUrls.length === 0 ? (
                  <div className="text-center py-12">
                    <Link2 size={36} className="mx-auto mb-3 opacity-40 text-primary-500" />
                    <p className="text-sm font-semibold">No shortened URLs found</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Create your first link above to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {recentDashboardUrls.map((url) => {
                        const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
                        return (
                          <div 
                            key={url._id} 
                            className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                              isDark 
                                ? 'bg-surface-900 border-surface-800 hover:border-surface-700' 
                                : 'bg-white border-surface-200 hover:shadow-surface-200/50'
                            }`}
                          >
                            {/* Left: Icon & URL Details */}
                            <div className="flex items-start gap-4 min-w-0 flex-1">
                              <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500 shrink-0 mt-0.5">
                                <LinkIcon size={20} />
                              </div>
                              <div className="min-w-0 flex-1 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <a 
                                    href={`http://127.0.0.1:5000/${url.shortCode}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-bold text-base text-primary-500 hover:text-primary-400 no-underline inline-flex items-center gap-1"
                                  >
                                    snip.link/{url.shortCode}
                                    <ExternalLink size={12} className="opacity-75" />
                                  </a>
                                  
                                  {/* Status Badge */}
                                  {url.expiresAt ? (
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      isExpired 
                                        ? 'bg-red-500/10 text-red-500' 
                                        : 'bg-green-500/10 text-green-500'
                                    }`}>
                                      <Clock size={10} />
                                      {isExpired ? 'Expired' : 'Active'}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                                      Permanent
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs truncate opacity-75 max-w-[280px] sm:max-w-md md:max-w-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                                  {url.originalUrl}
                                </p>
                                
                                {/* Meta Details Row */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] opacity-60">
                                  <span>Created: {new Date(url.createdAt).toLocaleDateString()}</span>
                                  {url.expiresAt && (
                                    <span className={isExpired ? 'text-red-550' : ''}>
                                      Expires: {new Date(url.expiresAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0 border-dashed border-surface-200 dark:border-surface-800">
                              {/* Actions bar */}
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleCopy(url.shortCode, url._id)}
                                  className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                    copiedId === url._id 
                                      ? 'bg-green-500 text-white shadow-md' 
                                      : isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-50 hover:bg-surface-100 text-surface-900'
                                  }`}
                                  title="Copy Link"
                                >
                                  {copiedId === url._id ? <Check size={14} /> : <Copy size={14} />}
                                </button>

                                <button 
                                  onClick={() => setSelectedQrUrl(url)}
                                  className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                    isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-50 hover:bg-surface-100 text-surface-900'
                                  }`}
                                  title="View QR Code"
                                >
                                  <QrCode size={14} />
                                </button>

                                <button 
                                  onClick={() => handleWhatsAppShare(`http://127.0.0.1:5000/${url.shortCode}`)}
                                  className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                    isDark ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                  }`}
                                  title="Share on WhatsApp"
                                >
                                  <WhatsAppIcon size={14} />
                                </button>

                                <button 
                                  onClick={() => handleSystemShare(`http://127.0.0.1:5000/${url.shortCode}`)}
                                  className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                    isDark ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                                  }`}
                                  title="Share Link"
                                >
                                  <Share2 size={14} />
                                </button>
                                
                                <button 
                                  onClick={() => {
                                    setSelectedUrlForAnalytics(url);
                                    setActiveTab('analytics');
                                  }}
                                  className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                    isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-50 hover:bg-surface-100 text-surface-900'
                                  }`}
                                  title="View Analytics"
                                >
                                  <BarChart3 size={14} />
                                </button>
                                
                                <button 
                                  onClick={() => handleDelete(url._id)}
                                  className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                    isDark ? 'bg-red-500/10 hover:bg-red-500/25 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-500'
                                  }`}
                                  title="Delete URL"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {urls.length > 3 && (
                      <div className="flex justify-center pt-4">
                        <button 
                          onClick={() => setActiveTab('links')}
                          className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isDark 
                              ? 'bg-surface-850 hover:bg-surface-800 text-white border-surface-750' 
                              : 'bg-surface-50 hover:bg-surface-100 text-surface-800 border-surface-200 shadow-sm'
                          }`}
                        >
                          <span>View All Shortlinks</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: URL MANAGEMENT */}
          {activeTab === 'links' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Main Links List Container */}
              <div className={`p-6 md:p-8 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                
                {/* Bulk CSV Shortening Widget */}
                <div className={`mb-8 p-6 rounded-3xl border ${
                  isDark ? 'bg-surface-950/40 border-surface-800' : 'bg-surface-50 border-surface-150 shadow-inner'
                }`}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm">Bulk URL Shortening</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-surface-450' : 'text-surface-500'}`}>
                        Upload a CSV containing originalUrl, customAlias (optional), and expiresAt (optional).
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {csvFile ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary-500/10 text-primary-500 max-w-[150px] truncate">
                            {csvFile.name}
                          </span>
                          <button 
                            onClick={processCsvShortening}
                            disabled={isCsvShortening}
                            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl text-xs font-bold border-none cursor-pointer flex items-center gap-2"
                          >
                            {isCsvShortening ? <Loader2 size={12} className="animate-spin" /> : null}
                            Start Import
                          </button>
                          <button 
                            onClick={() => setCsvFile(null)}
                            disabled={isCsvShortening}
                            className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                              isDark ? 'bg-surface-850 hover:bg-surface-800 text-white border-surface-750' : 'bg-white hover:bg-surface-50 text-surface-700 border-surface-200 shadow-sm'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-xs font-bold transition-all border-none cursor-pointer shadow-md hover:shadow-lg flex items-center gap-1.5">
                          <Plus size={14} />
                          Upload CSV
                          <input 
                            type="file" 
                            accept=".csv" 
                            onChange={handleCsvUpload} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Bulk Shortening Progress Indicator */}
                  {csvShorteningProgress && (
                    <div className="mt-4 pt-4 border-t border-dashed border-surface-250 dark:border-surface-800 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Importing: {csvShorteningProgress.current} / {csvShorteningProgress.total} rows</span>
                        <span className="text-emerald-500">Success: {csvShorteningProgress.successes} • Failed: {csvShorteningProgress.failures}</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-surface-900' : 'bg-surface-200'}`}>
                        <div 
                          style={{ width: `${(csvShorteningProgress.current / csvShorteningProgress.total) * 100}%` }}
                          className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-black font-[family-name:var(--font-display)]">URL Management</h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                      View, search, filter, sort, share or delete all your shortened links.
                    </p>
                  </div>
                  
                  {/* Search, Filter, and Sort Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Bar */}
                    <div className={`relative flex items-center rounded-xl border transition-all w-full sm:w-60 ${
                      isDark ? 'bg-surface-950 border-surface-800 focus-within:border-primary-500' : 'bg-surface-50 border-surface-200 focus-within:border-primary-500 shadow-sm'
                    }`}>
                      <Search size={14} className={`absolute left-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                      <input 
                        type="text"
                        placeholder="Search links..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`bg-transparent border-none outline-none py-2 pl-9 pr-4 text-xs w-full ${isDark ? 'text-white' : 'text-surface-950'}`}
                      />
                    </div>

                    {/* Filter Status Dropdown */}
                    <select
                      value={dashFilterStatus}
                      onChange={(e) => setDashFilterStatus(e.target.value)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer outline-none transition-all ${
                        isDark 
                          ? 'bg-surface-950 border-surface-800 text-white hover:bg-surface-850' 
                          : 'bg-white border-surface-200 text-surface-700 hover:bg-surface-50'
                      }`}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active Only</option>
                      <option value="expired">Expired Only</option>
                    </select>

                    {/* Sort By Dropdown */}
                    <select
                      value={dashSortBy}
                      onChange={(e) => setDashSortBy(e.target.value)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer outline-none transition-all ${
                        isDark 
                          ? 'bg-surface-950 border-surface-800 text-white hover:bg-surface-850' 
                          : 'bg-white border-surface-200 text-surface-700 hover:bg-surface-50'
                      }`}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="clicks">Most Clicks</option>
                      <option value="name">Alphabetical</option>
                    </select>
                  </div>
                </div>

                {loadingUrls ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-primary-500" />
                  </div>
                ) : filteredAndSortedDashboardUrls.length === 0 ? (
                  <div className="text-center py-12">
                    <Link2 size={36} className="mx-auto mb-3 opacity-40 text-primary-500" />
                    <p className="text-sm font-semibold">No shortened URLs found</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Try altering your search or filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAndSortedDashboardUrls.map((url) => {
                      const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
                      return (
                        <div 
                          key={url._id} 
                          className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                            isDark 
                              ? 'bg-surface-900 border-surface-800 hover:border-surface-700' 
                              : 'bg-white border-surface-200 hover:shadow-surface-200/50'
                          }`}
                        >
                          {/* Left: Icon & URL Details */}
                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500 shrink-0 mt-0.5">
                              <LinkIcon size={20} />
                            </div>
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <a 
                                  href={`http://127.0.0.1:5000/${url.shortCode}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-bold text-base text-primary-500 hover:text-primary-400 no-underline inline-flex items-center gap-1"
                                >
                                  snip.link/{url.shortCode}
                                  <ExternalLink size={12} className="opacity-75" />
                                </a>
                                
                                {/* Status Badge */}
                                {url.expiresAt ? (
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isExpired 
                                      ? 'bg-red-500/10 text-red-500' 
                                      : 'bg-green-500/10 text-green-500'
                                  }`}>
                                    <Clock size={10} />
                                    {isExpired ? 'Expired' : 'Active'}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                                    Permanent
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs truncate opacity-75 max-w-[280px] sm:max-w-md md:max-w-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                                {url.originalUrl}
                              </p>
                              
                              {/* Meta Details Row */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] opacity-60">
                                <span>Created: {new Date(url.createdAt).toLocaleDateString()}</span>
                                {url.expiresAt && (
                                  <span className={isExpired ? 'text-red-550' : ''}>
                                    Expires: {new Date(url.expiresAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0 border-dashed border-surface-200 dark:border-surface-800">
                            {/* Actions bar */}
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleCopy(url.shortCode, url._id)}
                                className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                  copiedId === url._id 
                                    ? 'bg-green-500 text-white shadow-md' 
                                    : isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-50 hover:bg-surface-100 text-surface-900'
                                }`}
                                title="Copy Link"
                              >
                                {copiedId === url._id ? <Check size={14} /> : <Copy size={14} />}
                              </button>

                              <button 
                                onClick={() => setSelectedQrUrl(url)}
                                className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                  isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-50 hover:bg-surface-100 text-surface-900'
                                }`}
                                title="View QR Code"
                              >
                                <QrCode size={14} />
                              </button>

                              <button 
                                onClick={() => handleWhatsAppShare(`http://127.0.0.1:5000/${url.shortCode}`)}
                                className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                  isDark ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                }`}
                                title="Share on WhatsApp"
                              >
                                <WhatsAppIcon size={14} />
                              </button>

                              <button 
                                onClick={() => handleSystemShare(`http://127.0.0.1:5000/${url.shortCode}`)}
                                className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                  isDark ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                                }`}
                                title="Share Link"
                              >
                                <Share2 size={14} />
                              </button>
                              
                              <button 
                                onClick={() => {
                                  setSelectedUrlForAnalytics(url);
                                  setActiveTab('analytics');
                                }}
                                className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                  isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-50 hover:bg-surface-100 text-surface-900'
                                }`}
                                title="View Analytics"
                              >
                                <BarChart3 size={14} />
                              </button>
                              
                              <button 
                                onClick={() => handleDelete(url._id)}
                                className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                                  isDark ? 'bg-red-500/10 hover:bg-red-500/25 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-550'
                                }`}
                                title="Delete URL"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED ANALYTICS VIEW */}
          {activeTab === 'analytics' && (() => {
            const totalCreated = urls.length;
            const activeLinksCount = urls.filter(url => !url.expiresAt || new Date(url.expiresAt) >= new Date()).length;
            const expiredLinksCount = urls.filter(url => url.expiresAt && new Date(url.expiresAt) < new Date()).length;

            // Generate last 7 days dates
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
              const d = new Date();
              d.setDate(d.getDate() - i);
              last7Days.push(d.toISOString().split('T')[0]);
            }

            // Aggregate global visitor data
            const allVisits = urls.flatMap(u => u.visits || []);
            const globalBrowsers = {};
            const globalDevices = {};
            const globalCountries = {};

            allVisits.forEach(v => {
              globalBrowsers[v.browser || 'Unknown'] = (globalBrowsers[v.browser || 'Unknown'] || 0) + 1;
              globalDevices[v.device || 'Desktop'] = (globalDevices[v.device || 'Desktop'] || 0) + 1;
              globalCountries[v.country || 'United States'] = (globalCountries[v.country || 'United States'] || 0) + 1;
            });

            const globalClicksByDay = last7Days.map(day => {
              const count = allVisits.filter(v => {
                const vDate = new Date(v.timestamp).toISOString().split('T')[0];
                return vDate === day;
              }).length;
              return { day, count };
            });

            const globalMaxClickVal = Math.max(...globalClicksByDay.map(d => d.count), 1);

            return (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {selectedUrlForAnalytics ? (() => {
                  // Specific URL Analytics Computations
                  const uVisits = selectedUrlForAnalytics.visits || [];
                  const uBrowsers = {};
                  const uDevices = {};
                  const uCountries = {};

                  uVisits.forEach(v => {
                    uBrowsers[v.browser || 'Unknown'] = (uBrowsers[v.browser || 'Unknown'] || 0) + 1;
                    uDevices[v.device || 'Desktop'] = (uDevices[v.device || 'Desktop'] || 0) + 1;
                    uCountries[v.country || 'United States'] = (uCountries[v.country || 'United States'] || 0) + 1;
                  });

                  const uClicksByDay = last7Days.map(day => {
                    const count = uVisits.filter(v => {
                      const vDate = new Date(v.timestamp).toISOString().split('T')[0];
                      return vDate === day;
                    }).length;
                    return { day, count };
                  });

                  const uMaxClickVal = Math.max(...uClicksByDay.map(d => d.count), 1);

                  return (
                    <div className="space-y-6">
                      {/* Back button & stats header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button
                          onClick={() => setSelectedUrlForAnalytics(null)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                            isDark ? 'bg-surface-800 hover:bg-surface-750 text-white' : 'bg-white hover:bg-surface-100 text-surface-900 shadow-sm border border-surface-200'
                          }`}
                        >
                          <ArrowLeft size={14} />
                          Back to Dashboard Overview
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/stats/${selectedUrlForAnalytics.shortCode}`}
                            target="_blank"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer no-underline bg-primary-500/10 text-primary-500 hover:bg-primary-500/20"
                          >
                            <Globe size={14} />
                            View Public Stats Page
                          </Link>
                        </div>
                      </div>

                      {/* Header Identity Card */}
                      <div className={`p-6 rounded-3xl border ${
                        isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                      }`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5 min-w-0">
                            <span className="text-[10px] uppercase font-black tracking-widest text-primary-500">Live Analytics Detail</span>
                            <div className="flex items-center gap-2.5">
                              <a 
                                href={`http://127.0.0.1:5000/${selectedUrlForAnalytics.shortCode}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-2xl font-black text-primary-500 hover:underline inline-flex items-center gap-1.5"
                              >
                                snip.link/{selectedUrlForAnalytics.shortCode}
                                <ExternalLink size={14} />
                              </a>
                            </div>
                            <p className="text-xs truncate opacity-70">
                              Destination: <a href={selectedUrlForAnalytics.originalUrl} target="_blank" rel="noreferrer" className="hover:underline">{selectedUrlForAnalytics.originalUrl}</a>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleCopy(selectedUrlForAnalytics.shortCode, selectedUrlForAnalytics._id)}
                              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                                copiedId === selectedUrlForAnalytics._id 
                                  ? 'bg-green-500 text-white' 
                                  : isDark ? 'bg-surface-800 text-white hover:bg-surface-700' : 'bg-surface-100 text-surface-900 hover:bg-surface-250 border border-surface-200'
                              }`}
                            >
                              {copiedId === selectedUrlForAnalytics._id ? <Check size={14} /> : <Copy size={14} />}
                              Copy Link
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                          <span className="text-xs opacity-75 font-semibold">Total Clicks</span>
                          <h3 className="text-3xl font-black mt-2 text-primary-500">{selectedUrlForAnalytics.clicks}</h3>
                          <p className="text-[10px] opacity-60 mt-1">Live recorded redirect visitors</p>
                        </div>
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                          <span className="text-xs opacity-75 font-semibold">Created Date</span>
                          <h3 className="text-2xl font-black mt-3">{new Date(selectedUrlForAnalytics.createdAt).toLocaleDateString()}</h3>
                          <p className="text-[10px] opacity-60 mt-1">at {new Date(selectedUrlForAnalytics.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                          <span className="text-xs opacity-75 font-semibold">Last Visited Time</span>
                          <h3 className="text-2xl font-black mt-3">
                            {uVisits.length > 0 ? new Date(uVisits[uVisits.length - 1].timestamp).toLocaleDateString() : 'Never'}
                          </h3>
                          <p className="text-[10px] opacity-60 mt-1">
                            {uVisits.length > 0 ? new Date(uVisits[uVisits.length - 1].timestamp).toLocaleTimeString() : 'Awaiting clicks'}
                          </p>
                        </div>
                      </div>

                      {/* Line Chart and visitor details */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Custom SVG Line Chart */}
                        <div className={`lg:col-span-2 p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                          <h4 className="text-sm font-bold mb-4">7-Day Click Volume</h4>
                          <div className="relative h-60 w-full">
                            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chartGradSingle" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="var(--color-primary-500, #6366f1)" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="var(--color-primary-500, #6366f1)" stopOpacity="0" />
                                </linearGradient>
                              </defs>

                              {/* Grid lines */}
                              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                                <line 
                                  key={i} 
                                  x1="0" 
                                  y1={200 - p * 160 - 20} 
                                  x2="500" 
                                  y2={200 - p * 160 - 20} 
                                  stroke={isDark ? '#374151' : '#e5e7eb'} 
                                  strokeWidth="1" 
                                  strokeDasharray="4 4"
                                />
                              ))}

                              {/* Path */}
                              {(() => {
                                const points = uClicksByDay.map((d, index) => {
                                  const x = 30 + index * 73
                                  const y = 180 - (d.count / uMaxClickVal) * 140
                                  return { x, y, count: d.count }
                                })

                                const pathD = points.reduce((acc, p, i) => {
                                  return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
                                }, '')

                                const areaD = points.length > 0 
                                  ? `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z` 
                                  : ''

                                return (
                                  <>
                                    {areaD && <path d={areaD} fill="url(#chartGradSingle)" />}
                                    {pathD && (
                                      <path 
                                        d={pathD} 
                                        fill="none" 
                                        stroke="var(--color-primary-500, #6366f1)" 
                                        strokeWidth="3.5" 
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    )}
                                    {points.map((p, i) => (
                                      <g key={i} className="group cursor-pointer">
                                        <circle cx={p.x} cy={p.y} r="4.5" fill={isDark ? '#1e1b4b' : '#ffffff'} stroke="var(--color-primary-500, #6366f1)" strokeWidth="3" />
                                        <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[9px] font-bold fill-current opacity-80">{p.count}</text>
                                      </g>
                                    ))}
                                  </>
                                )
                              })()}
                            </svg>
                            <div className="flex justify-between px-3 mt-2 text-[10px] opacity-75 font-semibold">
                              {uClicksByDay.map((d, i) => (
                                <span key={i}>
                                  {new Date(d.day).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' })}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Demographics details */}
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                          <h4 className="text-sm font-bold mb-4">Device & Browser</h4>
                          <div className="space-y-4">
                            {/* Devices */}
                            <div className="space-y-2">
                              <span className="text-[9px] uppercase font-bold tracking-wider text-primary-500 block">Devices</span>
                              {Object.keys(uDevices).length === 0 ? <p className="text-xs opacity-60">No device logs</p> : (
                                Object.entries(uDevices).map(([dev, count]) => {
                                  const pct = ((count / uVisits.length) * 100).toFixed(0)
                                  return (
                                    <div key={dev} className="space-y-1">
                                      <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="capitalize">{dev}</span>
                                        <span>{count} ({pct}%)</span>
                                      </div>
                                      <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-surface-800' : 'bg-surface-100'}`}>
                                        <div style={{ width: `${pct}%` }} className="h-full bg-primary-500 rounded-full" />
                                      </div>
                                    </div>
                                  )
                                })
                              )}
                            </div>

                            {/* Browsers */}
                            <div className="space-y-2">
                              <span className="text-[9px] uppercase font-bold tracking-wider text-primary-500 block">Browsers</span>
                              {Object.keys(uBrowsers).length === 0 ? <p className="text-xs opacity-60">No browser logs</p> : (
                                Object.entries(uBrowsers).map(([br, count]) => {
                                  const pct = ((count / uVisits.length) * 100).toFixed(0)
                                  return (
                                    <div key={br} className="space-y-1">
                                      <div className="flex items-center justify-between text-xs font-semibold">
                                        <span>{br}</span>
                                        <span>{count} ({pct}%)</span>
                                      </div>
                                      <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-surface-800' : 'bg-surface-100'}`}>
                                        <div style={{ width: `${pct}%` }} className="h-full bg-accent-500 rounded-full" />
                                      </div>
                                    </div>
                                  )
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Geo + Live visitor logs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Geolocation countries */}
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                          <h4 className="text-sm font-bold mb-4 flex items-center gap-1.5">
                            <Globe size={16} className="text-primary-500" />
                            Geolocation (Countries)
                          </h4>
                          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {Object.keys(uCountries).length === 0 ? (
                              <p className="text-xs text-center py-6 opacity-60">No geographic data logged</p>
                            ) : (
                              Object.entries(uCountries)
                                .sort((a, b) => b[1] - a[1])
                                .map(([c, count]) => {
                                  const pct = ((count / uVisits.length) * 100).toFixed(0)
                                  return (
                                    <div key={c} className="flex items-center justify-between text-xs py-1.5 border-b border-surface-200 dark:border-surface-850">
                                      <span className="font-semibold">{c}</span>
                                      <span className="font-bold text-primary-500">{count} ({pct}%)</span>
                                    </div>
                                  )
                                })
                            )}
                          </div>
                        </div>

                        {/* Recent log logs */}
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                          <h4 className="text-sm font-bold mb-4 flex items-center gap-1.5">
                            <Clock size={16} className="text-primary-500" />
                            Live Visit History (Realtime)
                          </h4>
                          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {uVisits.length === 0 ? (
                              <p className="text-xs text-center py-6 opacity-60">No visits recorded</p>
                            ) : (
                              [...uVisits].reverse().slice(0, 10).map((v, i) => (
                                <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                                  isDark ? 'bg-surface-950 border-surface-850' : 'bg-surface-50 border-surface-150'
                                }`}>
                                  <div>
                                    <p className="font-semibold">{v.device} • {v.browser}</p>
                                    <p className="text-[10px] opacity-60">{new Date(v.timestamp).toLocaleString()}</p>
                                  </div>
                                  <span className="font-bold text-primary-500">{v.country}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <MagicBento 
                    urls={urls}
                    totalCreated={totalCreated}
                    activeLinksCount={activeLinksCount}
                    expiredLinksCount={expiredLinksCount}
                    totalClicks={totalClicks}
                    globalClicksByDay={globalClicksByDay}
                    globalMaxClickVal={globalMaxClickVal}
                    globalDevices={globalDevices}
                    globalBrowsers={globalBrowsers}
                    globalCountries={globalCountries}
                    allVisits={allVisits}
                    onSelectUrl={setSelectedUrlForAnalytics}
                    isDark={isDark}
                  />
                )}
              </div>
            );
          })()}

          {/* TAB 3: QR CODE GENERATOR */}
          {false && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pb-2">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight font-[family-name:var(--font-display)]">QR Code Library</h2>
                  <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                    Select any of your shortened links to view and share its custom QR Code.
                  </p>
                </div>

                {/* Search, Filter, and Sort Controls */}
                {urls.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className={`relative flex items-center rounded-xl border transition-colors w-full sm:w-64 ${
                      isDark ? 'bg-surface-900 border-surface-800 focus-within:border-primary-500' : 'bg-white border-surface-200 focus-within:border-primary-500'
                    }`}>
                      <Search size={14} className={`absolute left-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                      <input 
                        type="text"
                        value={qrSearchQuery}
                        onChange={(e) => setQrSearchQuery(e.target.value)}
                        placeholder="Search QR Library..."
                        className={`w-full bg-transparent border-none outline-none py-2 pl-9 pr-4 text-xs ${
                          isDark ? 'text-white' : 'text-surface-900'
                        }`}
                      />
                    </div>

                    {/* Filter Status Dropdown */}
                    <select
                      value={qrFilterStatus}
                      onChange={(e) => setQrFilterStatus(e.target.value)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer outline-none transition-all ${
                        isDark 
                          ? 'bg-surface-900 border-surface-800 text-white hover:bg-surface-850' 
                          : 'bg-white border-surface-200 text-surface-700 hover:bg-surface-50'
                      }`}
                    >
                      <option value="all">All Links</option>
                      <option value="active">Active Only</option>
                      <option value="expired">Expired Only</option>
                    </select>

                    {/* Sort By Dropdown */}
                    <select
                      value={qrSortBy}
                      onChange={(e) => setQrSortBy(e.target.value)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer outline-none transition-all ${
                        isDark 
                          ? 'bg-surface-900 border-surface-800 text-white hover:bg-surface-850' 
                          : 'bg-white border-surface-200 text-surface-700 hover:bg-surface-50'
                      }`}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="clicks">Most Clicks</option>
                      <option value="name">Alphabetical</option>
                    </select>
                  </div>
                )}
              </div>

              {urls.length === 0 ? (
                <div className={`p-12 text-center rounded-3xl border ${
                  isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                }`}>
                  <QrCode size={48} className="mx-auto text-primary-500 mb-4 opacity-50" />
                  <h3 className="text-lg font-bold mb-1">No Links Shortened Yet</h3>
                  <p className={`text-sm mb-6 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                    Create your first shortened URL to generate dynamic QR codes.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab('dashboard');
                      setTimeout(() => shortenerInputRef.current?.focus(), 100);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold flex items-center gap-2 mx-auto border-none cursor-pointer shadow-lg shadow-primary-500/25 transition-all"
                  >
                    <Plus size={16} />
                    Create a Link
                  </button>
                </div>
              ) : filteredAndSortedQrUrls.length === 0 ? (
                <div className={`p-12 text-center rounded-3xl border ${
                  isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                }`}>
                  <Search size={36} className="mx-auto text-surface-400 mb-3 opacity-50" />
                  <h3 className="text-base font-bold mb-1">No matches found</h3>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                    Try checking your search query or filter options.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedQrUrls.map((url) => (
                    <div 
                      key={url._id} 
                      className={`p-6 rounded-3xl border transition-all hover:scale-[1.01] hover:shadow-lg flex flex-col justify-between ${
                        isDark ? 'bg-surface-900 border-surface-800 hover:border-surface-700' : 'bg-white border-surface-200 shadow-sm hover:shadow-surface-200/50'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500">
                            <QrCode size={20} />
                          </div>
                          <div className="truncate flex-1">
                            <h4 className="font-bold text-base truncate">snip.link/{url.shortCode}</h4>
                            <p className={`text-xs truncate opacity-75 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                              {url.originalUrl}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t pt-4 border-dashed border-surface-200 dark:border-surface-800">
                          <span className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                            {new Date(url.createdAt).toLocaleDateString()}
                          </span>
                          
                          <button 
                            onClick={() => setSelectedQrUrl(url)}
                            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all border-none cursor-pointer shadow-md hover:shadow-lg"
                          >
                            View QR Code
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS / PROFILE */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              <div className={`p-8 rounded-3xl border shadow-xl ${
                isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'
              }`}>
                <h3 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">Account Settings</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                  {/* Photo Edit */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {avatarBase64 ? (
                        <img src={avatarBase64} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-primary-500/30" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-3xl shadow-md">
                          {profileForm.name.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={20} />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/jpeg, image/png, image/webp" 
                      className="hidden" 
                    />
                    <div>
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                          isDark ? 'bg-surface-800 border-surface-700 hover:bg-surface-700 text-white' : 'bg-white border-surface-200 hover:bg-surface-50 text-surface-700'
                        }`}
                      >
                        Upload Picture
                      </button>
                      <p className={`text-[10px] mt-1.5 ${isDark ? 'text-surface-450' : 'text-surface-500'}`}>JPEG, PNG or WEBP. Max size 2MB.</p>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-405' : 'text-surface-600'}`}>Display Name</label>
                      <div className={`relative flex items-center rounded-xl border transition-colors ${
                        isDark ? 'bg-surface-950 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'
                      }`}>
                        <User size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          required
                          className={`w-full bg-transparent border-none outline-none py-3.5 pl-11 pr-4 text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-450' : 'text-surface-600'}`}>Email Address</label>
                      <div className={`relative flex items-center rounded-xl border opacity-70 ${
                        isDark ? 'bg-surface-950 border-surface-700' : 'bg-surface-50 border-surface-200'
                      }`}>
                        <User size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className={`w-full bg-transparent border-none outline-none py-3.5 pl-11 pr-4 text-sm cursor-not-allowed ${isDark ? 'text-white' : 'text-surface-900'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer shadow-lg shadow-primary-500/25"
                  >
                    {isUpdatingProfile ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                  </button>
                </form>
              </div>

              <div className={`p-6 rounded-3xl border flex items-center justify-between ${
                isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'
              }`}>
                <div>
                  <h4 className="font-bold text-sm">Design Credits</h4>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Created with premium glassmorphism patterns.</p>
                </div>
                <a 
                  href="https://rithik186.netlify.app/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-bold text-primary-500 hover:underline"
                >
                  By Rithik
                </a>
              </div>
            </div>
          )}

        </main>
      </div>



      {/* QR Code Pop-up Modal */}
      {selectedQrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setSelectedQrUrl(null)}
            className="absolute inset-0 bg-surface-950/40 backdrop-blur-md animate-in fade-in duration-200"
          />
          
          {/* Modal Container */}
          <div className={`relative w-full max-w-sm p-6 md:p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
            isDark ? 'bg-surface-900 border border-surface-800 text-white' : 'bg-white border border-surface-150 text-surface-950'
          }`}>
            {/* Close button */}
            <button 
              onClick={() => setSelectedQrUrl(null)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all border-none cursor-pointer ${
                isDark ? 'bg-surface-850 hover:bg-surface-800 text-surface-400 hover:text-white' : 'bg-surface-50 hover:bg-surface-100 text-surface-500 hover:text-surface-900'
              }`}
            >
              <X size={16} />
            </button>

            <div className="space-y-6 flex flex-col items-center">
              <div className="text-center space-y-1 w-full">
                <span className="text-[10px] uppercase tracking-widest font-black text-primary-500">Scan QR Code</span>
                <h3 className="text-2xl font-black font-[family-name:var(--font-display)] truncate px-4">
                  snip.link/{selectedQrUrl.shortCode}
                </h3>
                <p className="text-xs truncate opacity-60 max-w-[280px] mx-auto">
                  {selectedQrUrl.originalUrl}
                </p>
              </div>

              {/* QR Render Container - Floating paper-like card with zero internal border nesting */}
              <div className="p-5 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-surface-100 dark:border-none">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="QR Code" 
                    className="w-44 h-44 object-contain animate-in fade-in zoom-in-90 duration-200"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary-500" size={24} />
                  </div>
                )}
              </div>

              {/* Share details */}
              <div className="w-full space-y-3 pt-2 text-center">
                <p className={`text-[10px] uppercase font-bold tracking-widest opacity-60 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                  Quick Share Link
                </p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button 
                    onClick={() => handleWhatsAppShare(`http://127.0.0.1:5000/${selectedQrUrl.shortCode}`)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold border-none cursor-pointer transition-all shadow-md shadow-emerald-600/10"
                    title="Share on WhatsApp"
                  >
                    <WhatsAppIcon size={14} />
                    WhatsApp
                  </button>

                  <button 
                    onClick={() => handleSystemShare(`http://127.0.0.1:5000/${selectedQrUrl.shortCode}`)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold border-none cursor-pointer transition-all shadow-md shadow-blue-600/10"
                    title="Share Link"
                  >
                    <Share2 size={14} />
                    Share Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default HomePage
