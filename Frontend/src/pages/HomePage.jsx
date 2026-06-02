import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  Link2, Copy, Trash2, Moon, Sun, User, Settings, LogOut, Loader2, 
  Link as LinkIcon, Camera, X, ArrowRight, Menu, BarChart3, QrCode, 
  Plus, Check, ExternalLink, TrendingUp, Download, Search, ChevronRight,
  Clock, Calendar, Sparkles, History, ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { user, logout, updateUser, isLoading: authLoading } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, analytics, qr, settings
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  // Create Link Form States
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [isShortening, setIsShortening] = useState(false)

  // Data States
  const [urls, setUrls] = useState([])
  const [loadingUrls, setLoadingUrls] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Analytics State
  const [selectedUrlForAnalytics, setSelectedUrlForAnalytics] = useState(null)
  
  // QR States
  const [qrText, setQrText] = useState('')
  const [downloadingQr, setDownloadingQr] = useState(false)
  
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
      const response = await fetch('http://localhost:5000/api/urls', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.status === 401) {
        logout()
        return
      }
      const data = await response.json()
      if (data.success) {
        setUrls(data.urls)
        
        // Update selected analytics URL details if one is selected
        if (selectedUrlForAnalytics) {
          const updated = data.urls.find(u => u._id === selectedUrlForAnalytics._id)
          if (updated) setSelectedUrlForAnalytics(updated)
        }

        // Set default QR text to last shortened URL if available
        if (data.urls.length > 0 && !qrText) {
          setQrText(`http://localhost:5000/${data.urls[0].shortCode}`)
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

  const handleShorten = async (e) => {
    e.preventDefault()
    if (!originalUrl) return
    setIsShortening(true)
    try {
      const token = localStorage.getItem('sniplink-token')
      const response = await fetch('http://localhost:5000/api/urls/shorten', {
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
        setUrls([data.url, ...urls])
        setQrText(`http://localhost:5000/${data.url.shortCode}`)
        setIsCreateModalOpen(false)
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
      const response = await fetch(`http://localhost:5000/api/urls/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.status === 401) {
        logout()
        return
      }
      if (response.ok) {
        toast.success('Link deleted')
        setUrls(urls.filter(url => url._id !== id))
        if (selectedUrlForAnalytics?._id === id) {
          setSelectedUrlForAnalytics(null)
        }
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleCopy = (shortCode, id) => {
    const fullUrl = `http://localhost:5000/${shortCode}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
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
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
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
            onClick={() => { setActiveTab('qr'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm transition-all border-none cursor-pointer text-left ${
              activeTab === 'qr'
                ? 'bg-primary-500/10 text-primary-500 font-bold'
                : isDark ? 'text-surface-400 hover:bg-surface-800 hover:text-white' : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
            }`}
          >
            <QrCode size={20} />
            QR Generator
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
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all border-none cursor-pointer shadow-md hover:shadow-lg hover:shadow-primary-500/15"
            >
              <Plus size={18} />
              <span>Create Link</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto">
          
          {/* TAB 1: DASHBOARD OVERVIEW (SHOWS ALL SHORTENED LINKS BY DEFAULT) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Stat Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-3xl border flex items-center justify-between ${
                  isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                }`}>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Total Links</span>
                    <h3 className="text-3xl font-black mt-1 font-[family-name:var(--font-display)]">{urls.length}</h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-primary-500/10 text-primary-500">
                    <LinkIcon size={22} />
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border flex items-center justify-between ${
                  isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                }`}>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Accumulated Traffic</span>
                    <h3 className="text-3xl font-black mt-1 font-[family-name:var(--font-display)]">{totalClicks}</h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-accent-500/10 text-accent-500">
                    <TrendingUp size={22} />
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border flex items-center justify-between ${
                  isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                }`}>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Average Clickrate</span>
                    <h3 className="text-3xl font-black mt-1 font-[family-name:var(--font-display)]">{averageClicks}</h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-green-500/10 text-green-500">
                    <BarChart3 size={22} />
                  </div>
                </div>
              </div>

              {/* Main Links List Container */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-bold font-[family-name:var(--font-display)]">Created Shortlinks</h3>
                  
                  {/* Search Bar */}
                  <div className={`relative flex items-center rounded-xl border transition-all ${
                    isDark ? 'bg-surface-950 border-surface-800 focus-within:border-primary-500' : 'bg-surface-50 border-surface-200 focus-within:border-primary-500 shadow-sm'
                  }`}>
                    <Search size={16} className={`absolute left-3 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                    <input 
                      type="text"
                      placeholder="Search links..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`bg-transparent border-none outline-none py-2.5 pl-9 pr-4 text-xs w-full sm:w-60 ${isDark ? 'text-white' : 'text-surface-950'}`}
                    />
                  </div>
                </div>

                {loadingUrls ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-primary-500" />
                  </div>
                ) : filteredUrls.length === 0 ? (
                  <div className="text-center py-12">
                    <Link2 size={36} className="mx-auto mb-3 opacity-40 text-primary-500" />
                    <p className="text-sm font-semibold">No shortened URLs found</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Create your first link by clicking "Create Link" above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-xs uppercase tracking-wider font-bold opacity-75 ${
                          isDark ? 'border-surface-800 text-surface-400' : 'border-surface-200 text-surface-500'
                        }`}>
                          <th className="py-3 px-4">Link Details</th>
                          <th className="py-3 px-4">Created</th>
                          <th className="py-3 px-4">Expires</th>
                          <th className="py-3 px-4 text-center">Clicks</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUrls.map((url) => {
                          const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
                          return (
                            <tr key={url._id} className={`border-b text-sm transition-colors ${
                              isDark ? 'border-surface-800/60 hover:bg-surface-850' : 'border-surface-150 hover:bg-surface-50/50'
                            }`}>
                              <td className="py-4 px-4 max-w-xs md:max-w-md">
                                <a 
                                  href={`http://localhost:5000/${url.shortCode}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-bold text-primary-500 hover:text-primary-400 no-underline inline-flex items-center gap-1.5"
                                >
                                  snip.link/{url.shortCode}
                                  <ExternalLink size={12} />
                                </a>
                                <div className={`text-xs truncate opacity-75 mt-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                                  {url.originalUrl}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-xs opacity-80 whitespace-nowrap">
                                {new Date(url.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4 text-xs whitespace-nowrap">
                                {url.expiresAt ? (
                                  <span className={`inline-flex items-center gap-1 font-semibold ${isExpired ? 'text-red-500' : 'text-green-500'}`}>
                                    <Clock size={12} />
                                    {isExpired ? 'Expired' : new Date(url.expiresAt).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <span className="opacity-60 font-medium">Never</span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                                  isDark ? 'bg-surface-850 text-white' : 'bg-surface-100 text-surface-900'
                                }`}>
                                  {url.clicks}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button 
                                    onClick={() => handleCopy(url.shortCode, url._id)}
                                    className={`p-2 rounded-lg transition-all border-none cursor-pointer ${
                                      copiedId === url._id 
                                        ? 'bg-green-500 text-white shadow-md' 
                                        : isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-100 hover:bg-surface-200 text-surface-900'
                                    }`}
                                    title="Copy Link"
                                  >
                                    {copiedId === url._id ? <Check size={14} /> : <Copy size={14} />}
                                  </button>
                                  
                                  <button 
                                    onClick={() => {
                                      setSelectedUrlForAnalytics(url);
                                      setActiveTab('analytics');
                                    }}
                                    className={`p-2 rounded-lg transition-all border-none cursor-pointer ${
                                      isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-100 hover:bg-surface-200 text-surface-900'
                                    }`}
                                    title="View Analytics"
                                  >
                                    <BarChart3 size={14} />
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleDelete(url._id)}
                                    className={`p-2 rounded-lg transition-all border-none cursor-pointer ${
                                      isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-500'
                                    }`}
                                    title="Delete URL"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {selectedUrlForAnalytics ? (
                // SPECIFIC URL ANALYTICS VIEW
                <div className="space-y-6">
                  {/* Back to Analytics Directory */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedUrlForAnalytics(null)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border-none cursor-pointer ${
                        isDark ? 'bg-surface-800 hover:bg-surface-750 text-white' : 'bg-white hover:bg-surface-100 text-surface-900 shadow-sm'
                      }`}
                    >
                      <ArrowLeft size={16} />
                      Back to Overview
                    </button>
                    <span className="text-xs opacity-75 font-semibold">Detailed Analytics</span>
                  </div>

                  {/* Header Highlight Card */}
                  <div className={`p-6 md:p-8 rounded-3xl border shadow-xl ${
                    isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`p-2 rounded-xl bg-primary-500/10 text-primary-500`}>
                            <LinkIcon size={20} />
                          </span>
                          <a 
                            href={`http://localhost:5000/${selectedUrlForAnalytics.shortCode}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-2xl font-black text-primary-500 hover:underline inline-flex items-center gap-2"
                          >
                            snip.link/{selectedUrlForAnalytics.shortCode}
                            <ExternalLink size={16} />
                          </a>
                        </div>
                        <p className={`text-xs break-all opacity-80 ${isDark ? 'text-surface-300' : 'text-surface-500'}`}>
                          Original URL: {selectedUrlForAnalytics.originalUrl}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCopy(selectedUrlForAnalytics.shortCode, selectedUrlForAnalytics._id)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                            copiedId === selectedUrlForAnalytics._id 
                              ? 'bg-green-500 text-white' 
                              : isDark ? 'bg-surface-800 text-white hover:bg-surface-700' : 'bg-surface-100 text-surface-900 hover:bg-surface-200'
                          }`}
                        >
                          {copiedId === selectedUrlForAnalytics._id ? <Check size={14} /> : <Copy size={14} />}
                          Copy Link
                        </button>
                        <button 
                          onClick={() => handleDelete(selectedUrlForAnalytics._id)}
                          className={`p-2.5 rounded-xl transition-all border-none cursor-pointer ${
                            isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-500'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Total Click Count</span>
                      <h3 className="text-4xl font-black mt-2 font-[family-name:var(--font-display)] text-primary-500">
                        {selectedUrlForAnalytics.clicks}
                      </h3>
                      <p className="text-xs opacity-75 mt-1.5">Visits since link generation</p>
                    </div>

                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Created On</span>
                      <h3 className="text-2xl font-black mt-3 font-[family-name:var(--font-display)]">
                        {new Date(selectedUrlForAnalytics.createdAt).toLocaleDateString()}
                      </h3>
                      <p className="text-xs opacity-75 mt-2">
                        {new Date(selectedUrlForAnalytics.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Last Visited Time</span>
                      <h3 className="text-2xl font-black mt-3 font-[family-name:var(--font-display)]">
                        {selectedUrlForAnalytics.visits && selectedUrlForAnalytics.visits.length > 0 ? (
                          new Date(selectedUrlForAnalytics.visits[selectedUrlForAnalytics.visits.length - 1].timestamp).toLocaleDateString()
                        ) : (
                          'No visits yet'
                        )}
                      </h3>
                      <p className="text-xs opacity-75 mt-2">
                        {selectedUrlForAnalytics.visits && selectedUrlForAnalytics.visits.length > 0 ? (
                          new Date(selectedUrlForAnalytics.visits[selectedUrlForAnalytics.visits.length - 1].timestamp).toLocaleTimeString()
                        ) : (
                          'Ready to capture traffic'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Visit History Log Timeline */}
                  <div className={`p-6 md:p-8 rounded-3xl border ${
                    isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                  }`}>
                    <h4 className="text-lg font-bold mb-6 font-[family-name:var(--font-display)] flex items-center gap-2">
                      <History size={18} className="text-primary-500" />
                      Recent Visit History (Live logs)
                    </h4>
                    
                    {!selectedUrlForAnalytics.visits || selectedUrlForAnalytics.visits.length === 0 ? (
                      <div className="text-center py-10 opacity-70">
                        <Clock size={36} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm">This link has not been visited yet.</p>
                      </div>
                    ) : (
                      <div className="relative border-l border-surface-200 pl-6 ml-3 space-y-6">
                        {/* Show up to 10 recent visits */}
                        {[...selectedUrlForAnalytics.visits].reverse().slice(0, 10).map((visit, index) => (
                          <div key={visit._id || index} className="relative">
                            {/* Dot */}
                            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary-500 border-4 border-white shadow" />
                            
                            <div className="space-y-1">
                              <p className="text-sm font-bold">
                                Visit #{selectedUrlForAnalytics.visits.length - index}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                                Captured on {new Date(visit.timestamp).toLocaleDateString()} at {new Date(visit.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // GENERAL ANALYTICS DIRECTORY
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                      <span className={`text-xs font-semibold ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Total Links</span>
                      <h3 className="text-3xl font-extrabold font-[family-name:var(--font-display)] mt-1">{urls.length}</h3>
                    </div>
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                      <span className={`text-xs font-semibold ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Total Clicks</span>
                      <h3 className="text-3xl font-extrabold font-[family-name:var(--font-display)] mt-1">{totalClicks}</h3>
                    </div>
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
                      <span className={`text-xs font-semibold ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Avg click performance</span>
                      <h3 className="text-3xl font-extrabold font-[family-name:var(--font-display)] mt-1">{averageClicks}</h3>
                    </div>
                  </div>

                  <div className={`p-6 md:p-8 rounded-3xl border ${
                    isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                  }`}>
                    <h4 className="text-lg font-bold mb-6 font-[family-name:var(--font-display)]">Traffic Distribution</h4>
                    {urls.length === 0 ? (
                      <p className="text-center text-sm py-10 opacity-70">Shorten some links to populate the analytics charts.</p>
                    ) : (
                      <div className="space-y-6">
                        {[...urls].slice(0, 5).map((url) => {
                          const maxClicks = Math.max(...urls.map(u => u.clicks), 1)
                          const percentage = ((url.clicks / maxClicks) * 100).toFixed(0)

                          return (
                            <div key={url._id} className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <button 
                                  onClick={() => setSelectedUrlForAnalytics(url)}
                                  className="font-bold text-primary-500 hover:underline bg-transparent border-none cursor-pointer"
                                >
                                  snip.link/{url.shortCode}
                                </button>
                                <span className="font-bold opacity-80">{url.clicks} Clicks</span>
                              </div>
                              <div className={`w-full h-3 rounded-full overflow-hidden ${
                                isDark ? 'bg-surface-850' : 'bg-surface-150'
                              }`}>
                                <div 
                                  style={{ width: `${percentage}%` }}
                                  className="h-full bg-gradient-to-r from-primary-600 to-primary-500 rounded-full"
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {mostClickedLink && (
                    <div className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'
                    }`}>
                      <div>
                        <h4 className="text-xs font-semibold opacity-75 uppercase tracking-wide">Top Performing Link</h4>
                        <button 
                          onClick={() => setSelectedUrlForAnalytics(mostClickedLink)}
                          className="text-xl font-extrabold text-primary-500 hover:underline bg-transparent border-none cursor-pointer mt-1 inline-flex items-center gap-1.5"
                        >
                          snip.link/{mostClickedLink.shortCode}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="block text-2xl font-black text-accent-500">{mostClickedLink.clicks} Clicks</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QR CODE GENERATOR */}
          {activeTab === 'qr' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`p-8 rounded-3xl border shadow-xl ${
                isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 font-[family-name:var(--font-display)]">Generate QR Code</h3>
                      <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                        Create custom dynamic QR codes for any short link. Users can scan this QR code to visit your original URL instantly.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">QR Code Content URL</label>
                      <div className={`relative flex items-center rounded-xl border transition-colors ${
                        isDark ? 'bg-surface-950 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'
                      }`}>
                        <QrCode size={18} className={`absolute left-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                        <input 
                          type="text"
                          value={qrText}
                          onChange={(e) => setQrText(e.target.value)}
                          placeholder="Paste link to generate QR..."
                          className={`w-full bg-transparent border-none outline-none py-3 pl-11 pr-4 text-sm ${
                            isDark ? 'text-white' : 'text-surface-900'
                          }`}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={downloadQrCode}
                      disabled={!qrText || downloadingQr}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed border-none cursor-pointer shadow-lg shadow-primary-500/25"
                    >
                      {downloadingQr ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                      Download QR Code
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 border rounded-2xl bg-white text-surface-950 shadow-inner">
                    {qrText ? (
                      <div className="space-y-4 text-center">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrText)}`} 
                          alt="QR Code" 
                          className="w-56 h-56 mx-auto border p-2 bg-white rounded-lg shadow-md"
                        />
                        <div className="text-xs font-semibold break-all text-surface-500 max-w-xs mx-auto">
                          {qrText}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20 text-surface-400 space-y-3">
                        <QrCode size={48} className="mx-auto opacity-50" />
                        <p className="text-xs">Provide a URL on the left to display QR Code.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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

      {/* CREATE NEW LINK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200 ${
            isDark ? 'bg-surface-900 border-surface-700' : 'bg-white border-surface-200'
          }`}>
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors border-none cursor-pointer ${
                isDark ? 'hover:bg-surface-800 text-surface-400 hover:text-white' : 'hover:bg-surface-100 text-surface-505 hover:text-surface-900'
              }`}
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold mb-1 font-[family-name:var(--font-display)]">Create Short Link</h3>
            <p className={`text-xs mb-6 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Generate a shortened link with custom parameters.</p>
            
            <form onSubmit={handleShorten} className="space-y-4">
              {/* Destination URL */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Destination URL *</label>
                <div className={`relative flex items-center rounded-xl border transition-colors ${
                  isDark ? 'bg-surface-950 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'
                }`}>
                  <LinkIcon size={16} className={`absolute left-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="https://example.com/very-long-link"
                    required
                    className={`w-full bg-transparent border-none outline-none py-3 pl-10 pr-4 text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}
                  />
                </div>
              </div>

              {/* Custom Alias */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Custom Alias (Optional)</label>
                <div className={`relative flex items-center rounded-xl border transition-colors ${
                  isDark ? 'bg-surface-950 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'
                }`}>
                  <Sparkles size={16} className={`absolute left-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-custom-slug"
                    className={`w-full bg-transparent border-none outline-none py-3 pl-10 pr-4 text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}
                  />
                </div>
                <p className="text-[10px] opacity-75 mt-1">Leave empty for auto-generated unique code.</p>
              </div>

              {/* Expiration date */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Link Expiration (Optional)</label>
                <div className={`relative flex items-center rounded-xl border transition-colors ${
                  isDark ? 'bg-surface-950 border-surface-700 focus-within:border-primary-500' : 'bg-surface-50 border-surface-300 focus-within:border-primary-500'
                }`}>
                  <Calendar size={16} className={`absolute left-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className={`w-full bg-transparent border-none outline-none py-3 pl-10 pr-4 text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}
                  />
                </div>
                <p className="text-[10px] opacity-75 mt-1">The link will be disabled after this timestamp.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors border-none cursor-pointer ${
                    isDark ? 'bg-surface-800 hover:bg-surface-750 text-white' : 'bg-surface-100 hover:bg-surface-200 text-surface-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isShortening}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  {isShortening ? <Loader2 size={18} className="animate-spin" /> : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default HomePage
