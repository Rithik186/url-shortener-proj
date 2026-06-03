import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { 
  BarChart3, Link as LinkIcon, ExternalLink, Clock, Calendar, 
  Search, Eye, Laptop, Globe, MessageSquare, Share2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '../config'

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

const PublicStatsPage = () => {
  const { shortCode } = useParams()
  const { isDark } = useTheme()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/urls/stats/${shortCode}`)
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        } else {
          toast.error(data.message || 'Failed to load stats')
        }
      } catch (err) {
        console.error('Error fetching public stats:', err)
        toast.error('Could not load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [shortCode])

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
        <div className="flex flex-col items-center gap-3">
          <BarChart3 className="animate-pulse text-primary-500" size={48} />
          <p className="text-sm font-semibold">Loading public dashboard stats...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
        <div className="text-center space-y-4 p-6 max-w-md rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-xl">
          <LinkIcon className="mx-auto text-red-500" size={48} />
          <h2 className="text-xl font-bold">Link Not Found</h2>
          <p className="text-sm opacity-80">The statistics for shortcode "{shortCode}" could not be retrieved. It may have been deleted or the code is incorrect.</p>
          <Link to="/" className="inline-block px-6 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold no-underline">
            Go to Nebula
          </Link>
        </div>
      </div>
    )
  }

  // Aggregate Visit Stats
  const visits = stats.visits || []
  const browsers = {}
  const devices = {}
  const countries = {}

  visits.forEach(v => {
    browsers[v.browser || 'Unknown'] = (browsers[v.browser || 'Unknown'] || 0) + 1
    devices[v.device || 'Desktop'] = (devices[v.device || 'Desktop'] || 0) + 1
    countries[v.country || 'United States'] = (countries[v.country || 'United States'] || 0) + 1
  })

  // Group visits by date (last 7 days)
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last7Days.push(d.toISOString().split('T')[0])
  }

  const clicksByDay = last7Days.map(day => {
    const count = visits.filter(v => {
      const vDate = new Date(v.timestamp).toISOString().split('T')[0]
      return vDate === day
    }).length
    return { day, count }
  })

  const maxClickVal = Math.max(...clicksByDay.map(d => d.count), 1)

  return (
    <div className={`min-h-screen pb-16 ${isDark ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900'}`}>
      {/* Header Bar */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b py-4 px-6 flex items-center justify-between ${
        isDark ? 'bg-surface-950/80 border-surface-850' : 'bg-white/80 border-surface-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2">
          <BarChart3 className="text-primary-500" size={24} />
          <span className="font-extrabold text-lg font-[family-name:var(--font-display)]">neb.la / Public Stats</span>
        </div>
        <Link to="/" className="text-xs font-bold text-primary-500 hover:underline no-underline">
          Create Your Own Link &rarr;
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
        {/* Link Identity Card */}
        <div className={`p-6 md:p-8 rounded-3xl border shadow-xl ${
          isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary-500">Public Live Dashboard</span>
              <h1 className="text-2xl md:text-3xl font-black font-[family-name:var(--font-display)] truncate">
                neb.la/{stats.shortCode}
              </h1>
              <p className="text-xs break-all opacity-75 max-w-2xl">
                Destination: <a href={stats.originalUrl} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">{stats.originalUrl}</a>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href={`${API_BASE_URL}/${stats.shortCode}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all border-none cursor-pointer no-underline shadow-lg shadow-primary-500/25"
              >
                Visit Link
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'}`}>
            <span className="text-xs opacity-75 font-semibold">Total Clicks</span>
            <h2 className="text-4xl font-black mt-2 text-primary-500">{stats.clicks}</h2>
            <p className="text-[10px] opacity-60 mt-1">Accumulated overall clicks</p>
          </div>
          <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'}`}>
            <span className="text-xs opacity-75 font-semibold">Created Date</span>
            <h2 className="text-2xl font-black mt-3">{new Date(stats.createdAt).toLocaleDateString()}</h2>
            <p className="text-[10px] opacity-60 mt-1">Initialized at {new Date(stats.createdAt).toLocaleTimeString()}</p>
          </div>
          <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200'}`}>
            <span className="text-xs opacity-75 font-semibold">Last Visited</span>
            <h2 className="text-2xl font-black mt-3">
              {visits.length > 0 ? new Date(visits[visits.length - 1].timestamp).toLocaleDateString() : 'Never'}
            </h2>
            <p className="text-[10px] opacity-60 mt-1">
              {visits.length > 0 ? new Date(visits[visits.length - 1].timestamp).toLocaleTimeString() : 'Awaiting clicks'}
            </p>
          </div>
        </div>

        {/* Charting & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Click Trends Chart */}
          <div className={`lg:col-span-2 p-6 md:p-8 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
            <h3 className="text-lg font-bold mb-6 font-[family-name:var(--font-display)]">7-Day Click Trends</h3>
            
            {/* Custom SVG Line Chart */}
            <div className="relative h-64 w-full mt-4">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary-500, #6366f1)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--color-primary-500, #6366f1)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
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

                {/* Plot Area */}
                {(() => {
                  const points = clicksByDay.map((d, index) => {
                    const x = 30 + index * 73
                    const y = 180 - (d.count / maxClickVal) * 140
                    return { x, y, count: d.count, date: d.day }
                  })

                  const pathD = points.reduce((acc, p, i) => {
                    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
                  }, '')

                  const areaD = points.length > 0 
                    ? `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z` 
                    : ''

                  return (
                    <>
                      {/* Area Fill */}
                      {areaD && <path d={areaD} fill="url(#chartGrad)" />}

                      {/* Stroke Line */}
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

                      {/* Circles */}
                      {points.map((p, i) => (
                        <g key={i} className="group cursor-pointer">
                          <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r="5" 
                            fill={isDark ? '#1e1b4b' : '#ffffff'} 
                            stroke="var(--color-primary-500, #6366f1)" 
                            strokeWidth="3.5" 
                          />
                          <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r="10" 
                            fill="var(--color-primary-500, #6366f1)" 
                            opacity="0"
                            className="hover:opacity-20 transition-opacity" 
                          />
                          {/* Small label on hover/display */}
                          <text 
                            x={p.x} 
                            y={p.y - 12} 
                            textAnchor="middle" 
                            className="text-[9px] font-bold fill-current opacity-80"
                          >
                            {p.count}
                          </text>
                        </g>
                      ))}
                    </>
                  )
                })()}

                {/* X axis line */}
                <line x1="20" y1="180" x2="480" y2="180" stroke={isDark ? '#4b5563' : '#9ca3af'} strokeWidth="1.5" />
              </svg>
              
              {/* Custom Tooltips or labels at bottom */}
              <div className="flex justify-between px-3.5 mt-2 text-[10px] opacity-75 font-semibold">
                {clicksByDay.map((d, i) => (
                  <span key={i}>
                    {new Date(d.day).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' })}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Browser / Device Analytics */}
          <div className={`p-6 md:p-8 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
            <h3 className="text-lg font-bold mb-6 font-[family-name:var(--font-display)]">Visitor Demographics</h3>
            
            <div className="space-y-6">
              {/* Devices */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary-500 block">Devices</span>
                {Object.keys(devices).length === 0 ? (
                  <p className="text-xs opacity-60">No device data logged yet</p>
                ) : (
                  Object.entries(devices).map(([device, count]) => {
                    const pct = ((count / visits.length) * 100).toFixed(0)
                    return (
                      <div key={device} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="capitalize">{device}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-surface-800' : 'bg-surface-100'}`}>
                          <div style={{ width: `${pct}%` }} className="h-full bg-primary-500 rounded-full" />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Browsers */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary-500 block">Browsers</span>
                {Object.keys(browsers).length === 0 ? (
                  <p className="text-xs opacity-60">No browser data logged yet</p>
                ) : (
                  Object.entries(browsers).map(([browser, count]) => {
                    const pct = ((count / visits.length) * 100).toFixed(0)
                    return (
                      <div key={browser} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{browser}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-surface-800' : 'bg-surface-100'}`}>
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

        {/* Countries & Visit Log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Countries */}
          <div className={`p-6 md:p-8 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
            <h3 className="text-lg font-bold mb-6 font-[family-name:var(--font-display)] flex items-center gap-2">
              <Globe size={18} className="text-primary-500" />
              Geolocation (Countries)
            </h3>
            <div className="space-y-4">
              {Object.keys(countries).length === 0 ? (
                <p className="text-xs text-center py-8 opacity-65">Awaiting geo records...</p>
              ) : (
                Object.entries(countries)
                  .sort((a, b) => b[1] - a[1])
                  .map(([country, count]) => {
                    const pct = ((count / visits.length) * 100).toFixed(0)
                    return (
                      <div key={country} className="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-850">
                        <span className="text-xs font-semibold">{country}</span>
                        <span className="text-xs font-black text-primary-500">{count} visits ({pct}%)</span>
                      </div>
                    )
                  })
              )}
            </div>
          </div>

          {/* Recent Live logs */}
          <div className={`p-6 md:p-8 rounded-3xl border ${isDark ? 'bg-surface-900 border-surface-800' : 'bg-white border-surface-200 shadow-sm'}`}>
            <h3 className="text-lg font-bold mb-6 font-[family-name:var(--font-display)] flex items-center gap-2">
              <Clock size={18} className="text-primary-500" />
              Live Visitor logs
            </h3>
            
            {visits.length === 0 ? (
              <p className="text-xs text-center py-8 opacity-65">No traffic captured yet.</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {[...visits].reverse().slice(0, 10).map((v, i) => (
                  <div key={i} className={`p-3 rounded-2xl border flex justify-between items-center text-xs ${
                    isDark ? 'bg-surface-950 border-surface-850' : 'bg-surface-50 border-surface-150'
                  }`}>
                    <div>
                      <p className="font-bold">{v.device} • {v.browser}</p>
                      <p className="opacity-60 text-[10px] mt-0.5">{new Date(v.timestamp).toLocaleString()}</p>
                    </div>
                    <span className="font-black text-primary-500">{v.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default PublicStatsPage
