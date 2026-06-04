import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { 
  BarChart3, Link as LinkIcon, ExternalLink, Clock, Calendar, 
  Search, Eye, Laptop, Globe, MessageSquare, Share2, ChevronDown, Compass
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

const DonutChart = ({ data, isDark, title = "Device Breakdown" }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  
  const firstNonZero = data.find(d => d.value > 0);
  const defaultKey = firstNonZero ? firstNonZero.label.toLowerCase() : (data[0] ? data[0].label.toLowerCase() : '');
  
  const [activeKey, setActiveKey] = useState(defaultKey);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const getAnnularSectorPath = (x, y, innerRadius, outerRadius, startAngle, endAngle) => {
    const isFullCircle = (endAngle - startAngle) >= 360;
    const targetEndAngle = isFullCircle ? startAngle + 359.995 : endAngle;
    
    const start = polarToCartesian(x, y, outerRadius, startAngle);
    const end = polarToCartesian(x, y, outerRadius, targetEndAngle);
    const startInner = polarToCartesian(x, y, innerRadius, startAngle);
    const endInner = polarToCartesian(x, y, innerRadius, targetEndAngle);
    
    const largeArcFlag = targetEndAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      `M ${start.x} ${start.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
      "Z"
    ].join(" ");
  };

  if (total === 0) {
    return (
      <div className="space-y-4 w-full">
        <h4 className="text-sm font-bold text-left">{title}</h4>
        <div className="flex flex-col items-center justify-center py-10">
          <Compass size={32} className="text-primary-500/35 mb-2 animate-bounce" />
          <span className="text-xs opacity-50">No traffic data logged yet</span>
        </div>
      </div>
    );
  }

  let cumulativeValue = 0;
  const segments = data.map((d) => {
    const startAngle = (cumulativeValue / total) * 360;
    cumulativeValue += d.value;
    const endAngle = (cumulativeValue / total) * 360;
    return {
      ...d,
      startAngle,
      endAngle,
      key: d.label.toLowerCase()
    };
  });

  const activeSegment = segments.find(s => s.key === activeKey) || segments[0];

  return (
    <div className="space-y-6 w-full flex flex-col justify-between h-full text-left">
      <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-850/40 pb-3">
        <div className="space-y-1">
          <h4 className="text-base font-bold">{title}</h4>
          <p className="text-xs opacity-50">All-time traffic logs</p>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold outline-none cursor-pointer transition-all ${
              isDark 
                ? 'bg-surface-850 border-surface-750/70 text-white hover:bg-surface-800' 
                : 'bg-surface-100 border-surface-200 text-surface-800 hover:bg-surface-150'
            }`}
          >
            <span>{activeSegment ? activeSegment.label : 'Select'}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div 
              className={`absolute right-0 mt-2 w-36 rounded-2xl border shadow-xl z-20 overflow-hidden py-1.5 transition-all duration-200 ${
                isDark 
                  ? 'bg-surface-900/95 backdrop-blur-md border-surface-800 text-white shadow-black/40' 
                  : 'bg-white/95 backdrop-blur-md border-surface-150 text-surface-800 shadow-surface-300/30'
              }`}
            >
              {data.map((item) => {
                const isSelected = item.label.toLowerCase() === activeKey;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveKey(item.label.toLowerCase());
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-left px-3.5 py-2 text-xs transition-colors cursor-pointer border-none ${
                      isSelected
                        ? isDark 
                          ? 'bg-primary-50/10 text-primary-400 font-bold' 
                          : 'bg-primary-50 text-primary-600 font-bold'
                        : isDark
                          ? 'hover:bg-surface-800 text-surface-300'
                          : 'hover:bg-surface-50 text-surface-600'
                    }`}
                  >
                    <span className="capitalize">{item.label}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4 w-full flex-1">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0">
          <svg className="w-full h-full filter drop-shadow-[0_8px_24px_rgba(139,0,224,0.15)]" viewBox="0 0 100 100">
            {segments.map((seg, idx) => {
              if (seg.value === 0) return null;
              const isActive = seg.key === activeKey;
              
              const innerR = 26;
              const outerR = isActive ? 35 : 30;
              
              const pathD = getAnnularSectorPath(50, 50, innerR, outerR, seg.startAngle, seg.endAngle);
              
              return (
                <g 
                  key={idx} 
                  className="cursor-pointer animate-in fade-in duration-300"
                  onClick={() => setActiveKey(seg.key)}
                  onMouseEnter={() => setActiveKey(seg.key)}
                >
                  {isActive && (
                    <path
                      d={getAnnularSectorPath(50, 50, 37, 41, seg.startAngle, seg.endAngle)}
                      fill={seg.color}
                      opacity="0.25"
                      className="transition-all duration-300 animate-pulse"
                    />
                  )}
                  <path
                    d={pathD}
                    fill={seg.color}
                    className="transition-all duration-350 hover:opacity-95"
                  />
                </g>
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black font-sans tracking-tight">
              {activeSegment ? activeSegment.value.toLocaleString() : '0'}
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
              {activeSegment ? activeSegment.label : 'Visits'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:w-auto flex-1 justify-center">
          {segments.map((item, idx) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
            const isActive = item.key === activeKey;
            
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between gap-4 text-xs px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all w-full ${
                  isActive 
                    ? isDark ? 'bg-surface-850 text-white font-bold shadow-md shadow-violet-500/5' : 'bg-surface-150 text-surface-900 font-bold shadow-sm'
                    : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setActiveKey(item.key)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-inner" style={{ backgroundColor: item.color }} />
                  <span className="capitalize truncate max-w-[90px]">{item.label}</span>
                </div>
                <span className="font-bold opacity-90">{item.value} ({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ data, isDark }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const height = 240;
  const width = 500;
  const paddingX = 40;
  const paddingY = 30;
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-56">
        <span className="text-xs opacity-50">No click history logged</span>
      </div>
    );
  }

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  
  const barCount = data.length;
  const barGap = 18;
  const totalGapsWidth = barGap * (barCount - 1);
  const barWidth = (chartWidth - totalGapsWidth) / barCount;

  return (
    <div className="w-full space-y-4">
      <div className="relative h-64 w-full">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line
              key={i}
              x1={paddingX}
              y1={height - paddingY - p * chartHeight}
              x2={width - paddingX}
              y2={height - paddingY - p * chartHeight}
              stroke={isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Bars */}
          {data.map((d, idx) => {
            const x = paddingX + idx * (barWidth + barGap);
            const barHeight = (d.value / maxVal) * chartHeight;
            const y = height - paddingY - barHeight;
            
            return (
              <g key={idx} className="group cursor-pointer">
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 5)}
                  fill="url(#barGradient)"
                  rx="6"
                  ry="6"
                  className="transition-all duration-300 group-hover:opacity-90"
                />

                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill={isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)'}
                  className="text-[10px] font-extrabold font-[family-name:var(--font-sans)]"
                >
                  {d.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between px-3 mt-3 text-[10px] opacity-75 font-bold tracking-wider uppercase">
        {data.map((d, i) => {
          const parts = d.label.split(',')
          return (
            <span key={i} className="flex flex-col items-center text-center w-14">
              <span>{parts[0]}</span>
              {parts[1] && <span className="text-[9px] opacity-60 font-semibold mt-0.5">{parts[1]}</span>}
            </span>
          )
        })}
      </div>
    </div>
  );
};

const PublicStatsPage = () => {
  const { shortCode } = useParams()
  const { isDark } = useTheme()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7days')

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
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-transparent text-white' : 'bg-surface-50 text-surface-900'}`}>
        <div className="flex flex-col items-center gap-3">
          <BarChart3 className="animate-pulse text-primary-500" size={48} />
          <p className="text-sm font-semibold">Loading public dashboard stats...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-transparent text-white' : 'bg-surface-50 text-surface-900'}`}>
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

  const visits = stats.visits || []
  const devices = {}

  visits.forEach(v => {
    devices[v.device || 'Desktop'] = (devices[v.device || 'Desktop'] || 0) + 1
  })

  // Format devices data for DonutChart component
  const deviceData = Object.entries(devices).map(([label, value], i) => {
    const colors = ['#2563eb', '#3b82f6', '#c084fc', '#e9d5ff', '#f3e8ff']
    return {
      label,
      value,
      color: colors[i % colors.length]
    }
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

  const chartData7Days = clicksByDay.map(d => {
    const dateObj = new Date(d.day)
    const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'short' })
    const dayNum = dateObj.getDate().toString().padStart(2, '0')
    const monthNum = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    return {
      label: `${dayName},${dayNum}/${monthNum}`,
      value: d.count
    }
  })

  // Group visits by month (last 6 months)
  const last6Months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    last6Months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString(undefined, { month: 'short' }),
      yearLabel: d.getFullYear().toString().slice(-2)
    })
  }

  const chartDataMonthly = last6Months.map(m => {
    const count = visits.filter(v => {
      const vDate = new Date(v.timestamp)
      return vDate.getFullYear() === m.year && vDate.getMonth() === m.month
    }).length
    return {
      label: `${m.label},'${m.yearLabel}`,
      value: count
    }
  })

  // Group visits by year (last 4 years)
  const currentYear = new Date().getFullYear()
  const last4Years = []
  for (let i = 3; i >= 0; i--) {
    last4Years.push(currentYear - i)
  }

  const chartDataYearly = last4Years.map(year => {
    const count = visits.filter(v => {
      return new Date(v.timestamp).getFullYear() === year
    }).length
    return {
      label: `${year}`,
      value: count
    }
  })

  let activeChartData = []
  if (timeRange === '7days') {
    activeChartData = chartData7Days
  } else if (timeRange === 'monthly') {
    activeChartData = chartDataMonthly
  } else {
    activeChartData = chartDataYearly
  }

  return (
    <div className={`min-h-screen pb-16 ${isDark ? 'bg-transparent text-white' : 'bg-transparent text-surface-900'}`}>
      {/* Header Bar */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b py-4 px-6 flex items-center justify-between ${
        isDark ? 'bg-surface-100/80 border-surface-850' : 'bg-white/80 border-surface-200 shadow-sm'
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
        <div className="p-6 md:p-8 rounded-3xl theme-card shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2 min-w-0 text-left">
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
          <div className="p-6 rounded-3xl theme-card shadow-sm text-left">
            <span className="text-xs opacity-75 font-semibold">Total Clicks</span>
            <h2 className="text-4xl font-black mt-2 text-primary-500">{stats.clicks}</h2>
            <p className="text-[10px] opacity-60 mt-1">Accumulated overall clicks</p>
          </div>
          <div className="p-6 rounded-3xl theme-card shadow-sm text-left">
            <span className="text-xs opacity-75 font-semibold">Created Date</span>
            <h2 className="text-2xl font-black mt-3">{new Date(stats.createdAt).toLocaleDateString()}</h2>
            <p className="text-[10px] opacity-60 mt-1">Initialized at {new Date(stats.createdAt).toLocaleTimeString()}</p>
          </div>
          <div className="p-6 rounded-3xl theme-card shadow-sm text-left">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Click History bar chart */}
          <div className="lg:col-span-6 p-6 md:p-8 rounded-3xl theme-card shadow-sm">
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold">Click History</h4>
                  <p className="text-xs opacity-65">Track URL visitor trends</p>
                </div>
                
                {/* Range Selector Tabs */}
                <div className="flex p-1 rounded-xl bg-surface-100 dark:bg-surface-850 border border-surface-200/50 dark:border-surface-800 self-start sm:self-auto">
                  <button
                    onClick={() => setTimeRange('7days')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border-none cursor-pointer ${
                      timeRange === '7days'
                        ? 'bg-white dark:bg-surface-900 shadow-sm text-primary-500 font-black'
                        : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimeRange('monthly')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border-none cursor-pointer ${
                      timeRange === 'monthly'
                        ? 'bg-white dark:bg-surface-900 shadow-sm text-primary-500 font-black'
                        : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setTimeRange('yearly')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border-none cursor-pointer ${
                      timeRange === 'yearly'
                        ? 'bg-white dark:bg-surface-900 shadow-sm text-primary-500 font-black'
                        : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
              <BarChart data={activeChartData} isDark={isDark} />
            </div>
          </div>

          {/* Device Breakdown pie chart */}
          <div className="lg:col-span-6 p-6 md:p-8 rounded-3xl theme-card shadow-sm">
            <DonutChart data={deviceData} isDark={isDark} title="Device Breakdown" />
          </div>
        </div>

        {/* Recent Live logs */}
        <div className="p-6 md:p-8 rounded-3xl theme-card shadow-sm">
          <h3 className="text-lg font-bold mb-6 font-[family-name:var(--font-display)] flex items-center gap-2 text-left">
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
                  <div className="text-left">
                    <p className="font-bold">{v.device || 'Desktop'} • {v.browser || 'Unknown'}</p>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white">
                    {new Date(v.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PublicStatsPage
