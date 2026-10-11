import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Star, 
  TrendingUp, 
  Clock, 
  Trophy, 
  ChevronDown, 
  ArrowUpRight, 
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Progress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeUser = user || (() => {
    try {
      const saved = localStorage.getItem('mockmate_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const userEmail = activeUser?.email || 'imashasamodee@gmail.com';
  const userName = activeUser?.name || progressData?.user?.name || 'Kasun Silva';

  // Time range selector state
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const timeRangeOptions = [
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 3 Months', value: '3months' },
    { label: 'All Time', value: 'all' },
  ];

  // Progress stats state (with accurate fallback matching the reference screenshot)
  const [progressData, setProgressData] = useState({
    totalInterviews: 12,
    thisWeekCount: 3,
    averageScore: 68,
    scoreImprovement: '+12%',
    practiceHours: 8.5,
    practiceTimeSubtitle: 'This month',
    certificates: 5,
    certificatesSubtitle: 'Earned',
    scoreTrend: [
      { date: 'Oct 1', score: 18 },
      { date: 'Oct 8', score: 42 },
      { date: 'Oct 15', score: 36 },
      { date: 'Oct 22', score: 52 },
      { date: 'Oct 25', score: 68 },
      { date: 'Oct 28', score: 72 },
      { date: 'Oct 30', score: 76 },
    ],
    latestScore: 76,
    topicPerformance: [
      { topic: 'JavaScript', score: 82 },
      { topic: 'React.js', score: 72 },
      { topic: 'Node.js', score: 68 },
      { topic: 'System Design', score: 60 },
      { topic: 'Behavioral', score: 75 },
    ]
  });

  const [loading, setLoading] = useState(true);

  // Fetch progress stats from backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const option = timeRangeOptions.find(o => o.label === selectedRange)?.value || '30days';
        const res = await axios.get(`http://localhost:5000/api/progress/${encodeURIComponent(userEmail)}?timeRange=${option}`, {
          timeout: 4000
        });
        if (res.data) {
          setProgressData(prev => ({
            ...prev,
            ...res.data
          }));
        }
      } catch (err) {
        console.warn("Using local progress fallback:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userEmail, selectedRange]);

  // SVG Chart Dimensions & Coordinate Calculations
  const chartWidth = 520;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = progressData.scoreTrend || [];
  
  // Calculate SVG X, Y coordinates for each score trend data point
  const getCoordinates = (index, score) => {
    const totalPoints = Math.max(points.length - 1, 1);
    const x = paddingX + (index / totalPoints) * (chartWidth - paddingX * 2);
    // Y-Axis: 0 is at bottom (chartHeight - paddingY), 100 is at top (paddingY)
    const y = (chartHeight - paddingY) - (score / 100) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  // Generate SVG Path data (smooth cubic spline)
  const getPathData = () => {
    if (points.length === 0) return '';
    const coords = points.map((p, i) => getCoordinates(i, p.score));
    
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  // Generate Area Fill Path (connects to bottom corners)
  const getAreaPathData = () => {
    if (points.length === 0) return '';
    const coords = points.map((p, i) => getCoordinates(i, p.score));
    const linePath = getPathData();
    const bottomY = chartHeight - paddingY;
    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const lastIndex = points.length - 1;
  const lastPoint = points[lastIndex] || { score: 76, date: 'Oct 30' };
  const lastCoords = lastIndex >= 0 ? getCoordinates(lastIndex, lastPoint.score) : { x: 480, y: 80 };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* -------------------- 1. PAGE HEADER & TIME RANGE FILTER -------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Progress
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-normal">
            See your performance and improvement over time.
          </p>
        </div>

        {/* Time Range Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-gray-200/90 hover:border-gray-300 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-colors cursor-pointer select-none"
          >
            <span>{selectedRange}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-gray-700' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-40 animate-scale-up">
              {timeRangeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedRange(opt.label);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedRange === opt.label 
                      ? 'bg-emerald-50 text-emerald-800 font-bold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selectedRange === opt.label && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* -------------------- 2. TOP 4 STAT CARDS ROW -------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Interviews */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Star className="w-7 h-7 fill-[#3B82F6] text-[#3B82F6]" strokeWidth={1} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-950 tracking-tight leading-none">
              {progressData.totalInterviews}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Total Interviews
            </p>
            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
              <span>+{progressData.thisWeekCount} this week</span>
            </p>
          </div>
        </div>

        {/* Card 2: Average Score (Soft Mint Accent matching reference) */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100/90 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.06)] hover:shadow-lg transition-all flex items-center gap-4 group relative overflow-hidden bg-gradient-to-br from-emerald-50/40 via-white to-white">
          <div className="w-14 h-14 rounded-2xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <TrendingUp className="w-7 h-7 text-[#059669]" strokeWidth={2.4} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-950 tracking-tight leading-none">
              {progressData.averageScore}%
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Average Score
            </p>
            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
              <span>{progressData.scoreImprovement}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Practice Time */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Clock className="w-7 h-7 text-[#EA580C]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-950 tracking-tight leading-none">
              {progressData.practiceHours} hrs
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Practice Time
            </p>
            <p className="text-[11px] font-medium text-gray-400 mt-1">
              {progressData.practiceTimeSubtitle || 'This month'}
            </p>
          </div>
        </div>

        {/* Card 4: Certificates Earned */}
        <div className="bg-white rounded-3xl p-6 border border-gray-150/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Trophy className="w-7 h-7 text-[#2563EB]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-950 tracking-tight leading-none">
              {progressData.certificates}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Certificates
            </p>
            <p className="text-[11px] font-medium text-gray-400 mt-1">
              {progressData.certificatesSubtitle || 'Earned'}
            </p>
          </div>
        </div>

      </div>

      {/* -------------------- 3. SCORE TREND & TOPIC PERFORMANCE PANELS -------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
        
        {/* LEFT PANEL: Score Trend Line Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-8 border border-gray-150/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between relative">
          
          <div>
            <h3 className="font-extrabold text-xl text-gray-900 tracking-tight mb-4">
              Score Trend
            </h3>
          </div>

          {/* Clean SVG Line Chart */}
          <div className="relative w-full overflow-hidden select-none py-2">
            
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible"
            >
              <defs>
                {/* Area Gradient under curve */}
                <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Numbers */}
              {[100, 75, 50, 25, 0].map((val) => {
                const y = (chartHeight - paddingY) - (val / 100) * (chartHeight - paddingY * 2);
                return (
                  <g key={val} className="text-gray-400">
                    <line 
                      x1={paddingX} 
                      y1={y} 
                      x2={chartWidth - paddingX} 
                      y2={y} 
                      stroke="#F1F5F9" 
                      strokeWidth="1" 
                    />
                    <text 
                      x={paddingX - 10} 
                      y={y + 3.5} 
                      textAnchor="end" 
                      fontSize="10" 
                      fontWeight="500" 
                      fill="#94A3B8"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area Below Curve */}
              <path 
                d={getAreaPathData()} 
                fill="url(#scoreAreaGradient)" 
              />

              {/* Main Emerald Trend Line */}
              <path 
                d={getPathData()} 
                fill="none" 
                stroke="#059669" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Data Points on Line */}
              {points.map((pt, idx) => {
                const coords = getCoordinates(idx, pt.score);
                const isHovered = hoveredPoint === idx;
                const isLatest = idx === lastIndex;

                return (
                  <g 
                    key={idx} 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Hover glow */}
                    {isHovered && (
                      <circle 
                        cx={coords.x} 
                        cy={coords.y} 
                        r="10" 
                        fill="#A7F3D0" 
                        opacity="0.6" 
                      />
                    )}

                    {/* Circular Dot */}
                    <circle 
                      cx={coords.x} 
                      cy={coords.y} 
                      r={isLatest ? "5.5" : "4.5"} 
                      fill="#FFFFFF" 
                      stroke="#059669" 
                      strokeWidth={isLatest ? "3" : "2.5"} 
                      className="transition-all duration-150"
                    />

                    {/* X-Axis Date Labels */}
                    <text 
                      x={coords.x} 
                      y={chartHeight - 8} 
                      textAnchor="middle" 
                      fontSize="10.5" 
                      fontWeight="500" 
                      fill="#94A3B8"
                    >
                      {pt.date}
                    </text>
                  </g>
                );
              })}

              {/* Official 76% Tooltip Badge on Peak/Latest Point (Matches screenshot exactly) */}
              <g transform={`translate(${lastCoords.x - 22}, ${lastCoords.y - 36})`} className="pointer-events-none">
                {/* Pill Background */}
                <rect 
                  x="0" 
                  y="0" 
                  width="44" 
                  height="24" 
                  rx="7" 
                  fill="#064E3B" 
                  filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.18))"
                />
                {/* Small indicator pointer pointing down */}
                <polygon 
                  points="18,24 26,24 22,28" 
                  fill="#064E3B" 
                />
                {/* Badge text */}
                <text 
                  x="22" 
                  y="15.5" 
                  textAnchor="middle" 
                  fill="#FFFFFF" 
                  fontSize="11.5" 
                  fontWeight="900" 
                  letterSpacing="0.2px"
                  fontFamily="sans-serif"
                >
                  {lastPoint.score}%
                </text>
              </g>

            </svg>

            {/* Interactive Tooltip on Hover */}
            {hoveredPoint !== null && hoveredPoint !== lastIndex && (
              <div 
                className="absolute z-20 bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg pointer-events-none -translate-x-1/2 -translate-y-8"
                style={{
                  left: `${(getCoordinates(hoveredPoint, points[hoveredPoint].score).x / chartWidth) * 100}%`,
                  top: `${(getCoordinates(hoveredPoint, points[hoveredPoint].score).y / chartHeight) * 100}%`
                }}
              >
                {points[hoveredPoint].date}: {points[hoveredPoint].score}%
              </div>
            )}

          </div>

        </div>

        {/* RIGHT PANEL: Topic Performance Progress Bars (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-8 border border-gray-150/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          
          <div>
            <h3 className="font-extrabold text-xl text-gray-900 tracking-tight mb-6">
              Topic Performance
            </h3>
          </div>

          {/* 5 Topic Progress Bars (Matches screenshot) */}
          <div className="space-y-6 flex-1 flex flex-col justify-around">
            {progressData.topicPerformance.map((item) => (
              <div key={item.topic} className="flex items-center justify-between gap-3 group">
                
                {/* Topic Label */}
                <span className="text-sm font-semibold text-gray-800 w-28 shrink-0 group-hover:text-emerald-700 transition-colors">
                  {item.topic}
                </span>

                {/* Progress Bar Track & Fill */}
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-[#059669] rounded-full transition-all duration-1000 ease-out group-hover:bg-emerald-600"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                {/* Percentage Value */}
                <span className="text-sm font-extrabold text-gray-800 w-10 text-right shrink-0">
                  {item.score}%
                </span>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Progress;
