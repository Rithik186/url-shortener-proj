import { useState, useEffect, useRef } from 'react';
import { 
  Link2, Copy, Check, ExternalLink, Laptop, Clock, ArrowLeft, 
  ChevronRight, Calendar, Compass, ShieldAlert, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

// ----------------------------------------------------
// Custom SVG Donut Chart
// ----------------------------------------------------
// ----------------------------------------------------
// Custom Interactive SVG Donut/Pie Chart
// ----------------------------------------------------
const DonutChart = ({ data, isDark, title = "Device Breakdown" }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  
  const firstNonZero = data.find(d => d.value > 0);
  const defaultKey = firstNonZero ? firstNonZero.label.toLowerCase() : (data[0] ? data[0].label.toLowerCase() : '');
  
  const [activeKey, setActiveKey] = useState(defaultKey);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
        <h4 className="text-sm font-bold">{title}</h4>
        <div className="flex flex-col items-center justify-center py-10">
          <Compass size={32} className="text-primary-500/35 mb-2 animate-bounce" />
          <span className="text-xs opacity-50">No browser or device traffic data logged yet</span>
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
    <div className="space-y-4 w-full">
      {/* Header with Title and Select Dropdown */}
      <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-850/40 pb-2">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold">{title}</h4>
          <p className="text-[10px] opacity-50">All-time traffic logs</p>
        </div>
        
        {/* Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11.5px] font-bold outline-none cursor-pointer transition-all ${
              isDark 
                ? 'bg-surface-800 border-surface-750/70 text-white hover:bg-surface-700' 
                : 'bg-surface-100 border-surface-200 text-surface-800 hover:bg-surface-150'
            }`}
          >
            <span>{activeSegment ? activeSegment.label : 'Select Device'}</span>
            <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div 
              className={`absolute right-0 mt-1.5 w-32 rounded-2xl border shadow-xl z-20 overflow-hidden py-1 transition-all duration-200 ${
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
                    className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs transition-colors cursor-pointer border-none ${
                      isSelected
                        ? isDark 
                          ? 'bg-primary-500/10 text-primary-400 font-bold' 
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

      {/* Pie Chart Canvas */}
      <div className="flex flex-col min-[400px]:flex-row items-center justify-center gap-6 py-2 w-full">
        <div className="relative w-28 h-28 min-[400px]:w-32 min-[400px]:h-32 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {segments.map((seg, idx) => {
              if (seg.value === 0) return null;
              const isActive = seg.key === activeKey;
              
              // Normal radii vs Active radii
              const innerR = 26;
              const outerR = isActive ? 34 : 30;
              
              const pathD = getAnnularSectorPath(50, 50, innerR, outerR, seg.startAngle, seg.endAngle);
              
              return (
                <g 
                  key={idx} 
                  className="cursor-pointer"
                  onClick={() => setActiveKey(seg.key)}
                  onMouseEnter={() => setActiveKey(seg.key)}
                >
                  {/* Outer active highlight ring (Sector shape) */}
                  {isActive && (
                    <path
                      d={getAnnularSectorPath(50, 50, 36, 40, seg.startAngle, seg.endAngle)}
                      fill={seg.color}
                      opacity="0.3"
                      className="transition-all duration-300 animate-pulse"
                    />
                  )}
                  {/* Core sector path */}
                  <path
                    d={pathD}
                    fill={seg.color}
                    className="transition-all duration-300 hover:opacity-90"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Centered label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-sans">
              {activeSegment ? activeSegment.value.toLocaleString() : '0'}
            </span>
            <span className="text-[9px] uppercase tracking-widest opacity-60">
              {activeSegment ? activeSegment.label : 'Visits'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 w-full min-[400px]:w-auto flex-1">
          {segments.map((item, idx) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
            const isActive = item.key === activeKey;
            
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between gap-3 text-[11px] px-2.5 py-1.5 rounded-xl cursor-pointer transition-all w-full ${
                  isActive 
                    ? isDark ? 'bg-surface-800 text-white font-bold' : 'bg-surface-150 text-surface-900 font-bold'
                    : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setActiveKey(item.key)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="capitalize truncate max-w-[80px]">{item.label}</span>
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

// ----------------------------------------------------
// Custom Bezier Line/Area Chart
// ----------------------------------------------------
// ----------------------------------------------------
// Custom SVG Bar Chart (Contribution style)
// ----------------------------------------------------
const BarChart = ({ data, isDark }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const height = 180;
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-xs opacity-50">No click history logged</span>
      </div>
    );
  }

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  
  const barCount = data.length;
  const barGap = 16;
  const totalGapsWidth = barGap * (barCount - 1);
  const barWidth = (chartWidth - totalGapsWidth) / barCount;

  return (
    <div className="w-full">
      <div className="relative h-44 w-full">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
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
                {/* Rounded Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 4)}
                  fill="#8b00e0"
                  rx="4"
                  ry="4"
                  className="transition-all duration-300 group-hover:opacity-85"
                />

                {/* Always-visible Clean Count Label */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill={isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.65)'}
                  className="text-[9px] font-bold font-[family-name:var(--font-sans)]"
                >
                  {d.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Date labels */}
      <div className="flex justify-between px-3 mt-2 text-[9px] opacity-60 font-semibold tracking-wider uppercase">
        {data.map((d, i) => {
          const shortLabel = d.label.includes(',') ? d.label.split(',')[0] : d.label;
          return (
            <span key={i} className="text-center w-12">{shortLabel}</span>
          );
        })}
      </div>
    </div>
  );
};

// Geolocation card components removed.

// ----------------------------------------------------
// Main Analytics Dashboard Component
// ----------------------------------------------------
const AnalyticsDashboard = ({ 
  urls = [], 
  isDark = true, 
  selectedUrl = null, 
  setSelectedUrl = () => {}, 
  handleCopy = () => {}, 
  copiedId = null 
}) => {
  const [activeDateRange] = useState('Last 7 Days');

  // --------------------------------------------------
  // Computations
  // --------------------------------------------------
  const totalCreated = urls.length;
  const activeLinksCount = urls.filter(url => !url.expiresAt || new Date(url.expiresAt) >= new Date()).length;
  const expiredLinksCount = urls.filter(url => url.expiresAt && new Date(url.expiresAt) < new Date()).length;
  const totalClicks = urls.reduce((acc, curr) => acc + curr.clicks, 0);

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

  allVisits.forEach(v => {
    globalBrowsers[v.browser || 'Unknown'] = (globalBrowsers[v.browser || 'Unknown'] || 0) + 1;
    globalDevices[v.device || 'Desktop'] = (globalDevices[v.device || 'Desktop'] || 0) + 1;
  });

  const globalClicksByDay = last7Days.map(day => {
    const count = allVisits.filter(v => {
      const vDate = new Date(v.timestamp).toISOString().split('T')[0];
      return vDate === day;
    }).length;
    const dObj = new Date(day);
    const label = dObj.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });
    return { label, value: count };
  });

  const topPerformanceUrls = [...urls].sort((a, b) => b.clicks - a.clicks);

  // Styling helper
  const cardBgClass = 'glass-card text-surface-900 dark:text-white';

  const subTextClass = isDark ? 'text-surface-400' : 'text-surface-500';

  return (
    <div className="space-y-6">
      
      {/* -------------------------------------------------- */}
      {/* DETAILED VIEW FOR SINGLE SELECTED LINK */}
      {/* -------------------------------------------------- */}
      {selectedUrl ? (() => {
        const uVisits = selectedUrl.visits || [];
        const uBrowsers = {};
        const uDevices = {};

        uVisits.forEach(v => {
          uBrowsers[v.browser || 'Unknown'] = (uBrowsers[v.browser || 'Unknown'] || 0) + 1;
          uDevices[v.device || 'Desktop'] = (uDevices[v.device || 'Desktop'] || 0) + 1;
        });

        const uClicksByDay = last7Days.map(day => {
          const count = uVisits.filter(v => {
            const vDate = new Date(v.timestamp).toISOString().split('T')[0];
            return vDate === day;
          }).length;
          const dObj = new Date(day);
          const label = dObj.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });
          return { label, value: count };
        });

        const deviceChartData = [
          { label: 'Desktop', value: uDevices['Desktop'] || 0, color: '#8b00e0' },
          { label: 'Mobile', value: uDevices['Mobile'] || 0, color: '#10b981' },
          { label: 'Tablet', value: uDevices['Tablet'] || 0, color: '#f59e0b' }
        ];

        const isLinkExpired = selectedUrl.expiresAt && new Date(selectedUrl.expiresAt) < new Date();

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => setSelectedUrl(null)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                  isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-surface-100 hover:bg-surface-200 text-surface-900 shadow-xs'
                }`}
              >
                <ArrowLeft size={14} />
                Back to Analytics Dashboard
              </button>
              
              <div className="flex flex-wrap gap-2">
                <Link 
                  to={`/stats/${selectedUrl.shortCode}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer no-underline bg-primary-500/10 text-primary-500 hover:bg-primary-500/20"
                >
                  <Compass size={14} />
                  Public Stats
                </Link>
                <a 
                  href={`${API_BASE_URL}/${selectedUrl.shortCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer no-underline bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                >
                  <ExternalLink size={14} />
                  Visit Link
                </a>
              </div>
            </div>

            {/* Selected Link Title Card */}
            <div className={`p-6 rounded-3xl border ${cardBgClass}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] uppercase font-black tracking-widest text-primary-500">Selected URL Identity</span>
                  <h2 className="text-xl md:text-2xl font-black text-primary-500 truncate">
                    neb.la/{selectedUrl.shortCode}
                  </h2>
                  <p className="text-xs truncate opacity-70">
                    Destination: <span className="font-semibold">{selectedUrl.originalUrl}</span>
                  </p>
                </div>

                <button 
                  onClick={() => handleCopy(selectedUrl.shortCode, selectedUrl._id)}
                  className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                    copiedId === selectedUrl._id 
                      ? 'bg-green-500 text-white' 
                      : isDark ? 'bg-surface-800 text-white hover:bg-surface-700' : 'bg-surface-100 text-surface-900 hover:bg-surface-200'
                  }`}
                >
                  {copiedId === selectedUrl._id ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === selectedUrl._id ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Metric widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-6 rounded-3xl border ${cardBgClass} flex flex-col justify-between h-28`}>
                <span className="text-xs opacity-75 font-semibold">Redirect Clicks</span>
                <div>
                   <h3 className="text-2xl font-bold font-sans">{selectedUrl.clicks}</h3>
                  <p className="text-[9px] opacity-50">Total visits recorded live</p>
                </div>
              </div>
              <div className={`p-6 rounded-3xl border ${cardBgClass} flex flex-col justify-between h-28`}>
                <span className="text-xs opacity-75 font-semibold">Status</span>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    isLinkExpired ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {isLinkExpired ? 'Expired' : 'Active'}
                  </span>
                  <p className="text-[9px] opacity-50 mt-1">
                    {selectedUrl.expiresAt ? `Expires: ${new Date(selectedUrl.expiresAt).toLocaleDateString()}` : 'Permanent Link'}
                  </p>
                </div>
              </div>
              <div className={`p-6 rounded-3xl border ${cardBgClass} flex flex-col justify-between h-28`}>
                <span className="text-xs opacity-75 font-semibold">Created On</span>
                <div>
                  <h3 className="text-lg font-black">{new Date(selectedUrl.createdAt).toLocaleDateString()}</h3>
                  <p className="text-[9px] opacity-50">at {new Date(selectedUrl.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>

            {/* Graphics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Click History bar chart */}
              <div className={`lg:col-span-7 p-6 rounded-3xl border ${cardBgClass}`}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold">Click History</h4>
                    <p className="text-xs opacity-60">Last 7 days of activity</p>
                  </div>
                  <BarChart data={uClicksByDay} isDark={isDark} />
                </div>
              </div>

              {/* Devices */}
              <div className={`lg:col-span-5 p-6 rounded-3xl border ${cardBgClass}`}>
                <DonutChart data={deviceChartData} isDark={isDark} title="Devices Breakdown" />
              </div>
            </div>

            {/* Realtime list */}
            <div className={`p-6 rounded-3xl border ${cardBgClass} space-y-4`}>
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold">Live Visitor Traffic Feed</h4>
                <span className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-extrabold uppercase animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {uVisits.length === 0 ? (
                  <div className="text-center py-12 text-xs opacity-50">No recent visitor logs</div>
                ) : (
                  [...uVisits].reverse().slice(0, 10).map((v, idx) => (
                    <div key={idx} className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-surface-950/40 border-surface-850/60' : 'bg-white/10 border-white/20'
                    }`}>
                      <div>
                        <p className="font-bold">{v.device || 'Desktop'} • {v.browser || 'Browser'}</p>
                        <p className="text-[10px] opacity-50 mt-0.5">{new Date(v.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })() : (
        // --------------------------------------------------
        // GLOBAL ANALYTICS DASHBOARD VIEW
        // --------------------------------------------------
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Title & Filter Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
               <h2 className="text-2xl font-bold tracking-tight font-sans">
                Detailed Link Analytics
              </h2>
              <p className={`text-sm ${subTextClass}`}>
                Monitor link health, redirection traffic, and platform device patterns.
              </p>
            </div>

            {/* Date range dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60 font-semibold">Range:</span>
              <select
                disabled
                value={activeDateRange}
                className={`px-3 py-2 rounded-xl border text-xs font-bold outline-none cursor-not-allowed opacity-75 ${
                  isDark 
                    ? 'bg-surface-900/60 border-surface-800 text-white' 
                    : 'bg-white/20 border-white/30 text-surface-700'
                }`}
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total links */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between h-28 ${cardBgClass}`}>
              <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-wider">Total Links</span>
              </div>
              <div>
                 <h3 className="text-2xl font-bold font-sans">{totalCreated}</h3>
                <p className="text-[9px] opacity-50 mt-0.5">Shortlinks created overall</p>
              </div>
            </div>

            {/* 2. Active links */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between h-28 ${cardBgClass}`}>
              <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-wider">Active</span>
              </div>
              <div>
                 <h3 className="text-2xl font-bold font-sans">{activeLinksCount}</h3>
                <p className="text-[9px] opacity-50 mt-0.5">Active non-expired links</p>
              </div>
            </div>

            {/* 3. Expired links */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between h-28 ${cardBgClass}`}>
              <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-wider">Expired</span>
              </div>
              <div>
                 <h3 className="text-2xl font-bold font-sans">{expiredLinksCount}</h3>
                <p className="text-[9px] opacity-50 mt-0.5">Expired time-limited links</p>
              </div>
            </div>

            {/* 4. Total clicks */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between h-28 ${cardBgClass}`}>
              <div className="flex justify-between items-center opacity-70">
                <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
              </div>
              <div>
                 <h3 className="text-2xl font-bold font-sans">{totalClicks}</h3>
                <p className="text-[9px] opacity-50 mt-0.5">Redirections resolved globally</p>
              </div>
            </div>
          </div>

          {/* Core Graphics layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Click History bar chart */}
            <div className={`lg:col-span-7 p-6 rounded-3xl border ${cardBgClass}`}>
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold">Click History</h4>
                  <p className="text-xs opacity-60">Last 7 days of activity</p>
                </div>
                <BarChart data={globalClicksByDay} isDark={isDark} />
              </div>
            </div>

            {/* Devices breakdown */}
            <div className={`lg:col-span-5 p-6 rounded-3xl border ${cardBgClass}`}>
              <DonutChart 
                data={[
                  { label: 'Desktop', value: globalDevices['Desktop'] || 0, color: '#8b00e0' },
                  { label: 'Mobile', value: globalDevices['Mobile'] || 0, color: '#10b981' },
                  { label: 'Tablet', value: globalDevices['Tablet'] || 0, color: '#f59e0b' }
                ]} 
                isDark={isDark} 
                title="Device & Browser breakdown"
              />
            </div>
          </div>

          {/* Realtime logs */}
          <div className={`p-6 rounded-3xl border ${cardBgClass} space-y-4`}>
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold">Realtime Live Visitor Logs</h4>
              <span className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-extrabold uppercase animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sync
              </span>
            </div>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {allVisits.length === 0 ? (
                <div className="text-center py-12 text-xs opacity-50">No visits registered yet</div>
              ) : (
                [...allVisits].reverse().slice(0, 10).map((v, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                    isDark ? 'bg-surface-950/40 border-surface-850/60' : 'bg-white/10 border-white/20'
                  }`}>
                    <div>
                      <p className="font-bold">{v.device || 'Desktop'} • {v.browser || 'Browser'}</p>
                      <p className="text-[10px] opacity-50 mt-0.5">{new Date(v.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Links list datatable */}
          <div className={`p-6 rounded-3xl border ${cardBgClass} space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-200 dark:border-surface-850 pb-3">
              <div>
                <h4 className="text-base font-bold">Link Performance Leaderboard</h4>
                <p className="text-xs opacity-60 mt-0.5">Click ranking for all shortened URL resources</p>
              </div>
            </div>

            {/* Leaderboard Table / Cards */}
            <div className="space-y-4">
              {/* Desktop view: Table */}
              {/* Desktop view: Grid Table */}
              <div className="hidden md:block space-y-2.5">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-surface-500 opacity-75 border-b border-surface-200 dark:border-surface-850/50 pb-2">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-5">Destination Link Details</div>
                  <div className="col-span-3">Shortlink URL</div>
                  <div className="col-span-1 text-center">Clicks</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                {/* Rows */}
                {topPerformanceUrls.map((url, index) => {
                  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
                  return (
                    <div
                      key={url._id}
                      className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-2xl border transition-all duration-200 group ${
                        isDark 
                          ? 'border-surface-850/30 bg-surface-950/20 hover:bg-surface-850/20 hover:border-surface-800' 
                          : 'border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/40 shadow-xs'
                      }`}
                    >
                      {/* Rank */}
                      <div className="col-span-1 text-center font-black opacity-60 text-sm">
                        #{index + 1}
                      </div>

                      {/* Destination Details */}
                      <div className="col-span-5 min-w-0 pr-2">
                        <div className="font-bold truncate text-sm mb-0.5 text-primary-500 capitalize">
                          {url.shortCode}
                        </div>
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs opacity-60 hover:text-primary-500 truncate block no-underline"
                        >
                          {url.originalUrl}
                        </a>
                      </div>

                      {/* Shortlink URL */}
                      <div className="col-span-3 min-w-0 flex items-center gap-1.5">
                        <span className="font-bold text-primary-500 truncate">neb.la/{url.shortCode}</span>
                        <button
                          onClick={() => handleCopy(url.shortCode, url._id)}
                          className={`p-1.5 rounded-lg border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                            copiedId === url._id
                              ? 'bg-green-500 text-white animate-pulse'
                              : isDark ? 'bg-surface-800 hover:bg-surface-700 text-white' : 'bg-white/20 hover:bg-white/45 text-surface-700 border border-white/30'
                          }`}
                        >
                          {copiedId === url._id ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>

                      {/* Clicks */}
                      <div className="col-span-1 text-center">
                        <span className="font-black px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs">
                          {url.clicks}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-1 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          isExpired
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </div>

                      {/* Action */}
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => setSelectedUrl(url)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
                            isDark ? 'bg-surface-800 hover:bg-surface-750 text-white' : 'bg-white/20 hover:bg-white/45 text-surface-900 border border-white/30'
                          }`}
                        >
                          Analyze
                          <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile view: Stacked List */}
              <div className="block md:hidden space-y-3">
                {topPerformanceUrls.map((url, index) => {
                  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
                  return (
                    <div
                      key={url._id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDark ? 'bg-surface-950 border-surface-850/60' : 'bg-white/10 border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary-500/10 text-primary-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            #{index + 1}
                          </span>
                          <div className="font-bold text-sm truncate max-w-[150px]">{url.shortCode}</div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          isExpired
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <p className="opacity-60 truncate">{url.originalUrl}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-surface-200 dark:border-surface-850 mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-primary-500">neb.la/{url.shortCode}</span>
                            <button
                              onClick={() => handleCopy(url.shortCode, url._id)}
                              className={`p-1 rounded-lg border-none cursor-pointer ${
                                copiedId === url._id
                                  ? 'bg-green-500 text-white'
                                  : isDark ? 'bg-surface-800 text-white' : 'bg-white/20 hover:bg-white/45 text-surface-700 border border-white/30'
                              }`}
                            >
                              {copiedId === url._id ? <Check size={10} /> : <Copy size={10} />}
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-primary-500">{url.clicks} clicks</span>
                            <button
                              onClick={() => setSelectedUrl(url)}
                              className="p-1.5 rounded-xl bg-primary-500/10 text-primary-500 border-none cursor-pointer"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
