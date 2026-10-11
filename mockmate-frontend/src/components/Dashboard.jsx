import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Star, 
  TrendingUp, 
  Clock, 
  Trophy, 
  Code, 
  Users, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import bullseyeTargetImg from '../assets/bullseye-target.jpg';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalInterviews: 12,
    averageScore: 68,
    practiceHours: 8.5,
    certificates: 5,
    thisWeekCount: 3,
    scoreImprovement: '+12% improvement'
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const userName = user?.name || 'Kasun Silva';
  const userRole = user?.jobRole || 'Full Stack Developer';
  const userEmail = user?.email || 'kasun@example.com';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dashboard/${encodeURIComponent(userEmail)}`, {
          timeout: 3000
        });
        if (response.data) {
          setStats(prev => ({
            ...prev,
            ...response.data
          }));
        }
      } catch (err) {
        console.warn("Using dashboard local fallback stats:", err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [userEmail]);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleStartInterview = (type = 'technical') => {
    navigate(`/interview?type=${type}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-7">
      
      {/* -------------------- 1. HERO BANNER WITH TARGET BULLSEYE -------------------- */}
      <div className="bg-gradient-to-r from-[#083b2e] via-[#063327] to-[#04241b] rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-emerald-950/20 border border-emerald-900/40">
        
        {/* Subtle decorative glow */}
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white flex items-center gap-2">
              <span>{getGreeting()}, {userName.split(' ')[0]}!</span>
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Keep practicing and you'll get there. You're {stats.averageScore}% closer to your goal!
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleStartInterview('technical')}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-lg shadow-emerald-950/30 flex items-center gap-2.5 cursor-pointer group transform hover:-translate-y-0.5"
              >
                <span>Start New Interview</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Bullseye Graphic (Exact match to reference design) */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-400/40 group bg-emerald-950/60">
              <img 
                src={bullseyeTargetImg} 
                alt="Target Bullseye" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -inset-1 bg-emerald-400/20 rounded-3xl blur-xl pointer-events-none -z-10" />
            </div>
          </div>

        </div>
      </div>

      {/* -------------------- 2. STATS ROW (4 CARDS) -------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Mock Interviews */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Star size={24} className="fill-blue-500/20 text-blue-500" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {loadingStats ? '...' : stats.totalInterviews}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-0.5">Mock Interviews</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">
              +{stats.thisWeekCount || 3} this week
            </div>
          </div>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp size={24} className="text-emerald-500" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {loadingStats ? '...' : `${stats.averageScore}%`}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-0.5">Average Score</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">
              {stats.scoreImprovement || '+12% improvement'}
            </div>
          </div>
        </div>

        {/* Card 3: Practice Time */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <Clock size={24} className="text-rose-500" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {loadingStats ? '...' : `${stats.practiceHours} hrs`}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-0.5">Practice Time</div>
            <div className="text-[11px] font-medium text-gray-400 mt-1">
              This month
            </div>
          </div>
        </div>

        {/* Card 4: Certificates */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
            <Trophy size={24} className="text-sky-500" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {loadingStats ? '...' : stats.certificates}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-0.5">Certificates</div>
            <div className="text-[11px] font-medium text-gray-400 mt-1">
              Earned
            </div>
          </div>
        </div>

      </div>

      {/* -------------------- 3. CHOOSE YOUR INTERVIEW TYPE -------------------- */}
      <div className="space-y-4 pt-2">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Choose Your Interview Type
          </h2>
          <button
            onClick={() => handleStartInterview('technical')}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Technical Interview */}
          <div
            onClick={() => handleStartInterview('technical')}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Code size={22} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                Technical Interview
              </h3>
              <p className="text-xs text-indigo-500/80 mt-1.5 leading-relaxed">
                DSA, System Design, Frameworks and more
              </p>
            </div>
            <div className="pt-5 flex items-center text-xs font-bold text-blue-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Start Session</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* 2. Behavioral Interview */}
          <div
            onClick={() => handleStartInterview('behavioral')}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Users size={22} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-emerald-600 transition-colors">
                Behavioral Interview
              </h3>
              <p className="text-xs text-emerald-600/80 mt-1.5 leading-relaxed">
                HR questions, teamwork, leadership and more
              </p>
            </div>
            <div className="pt-5 flex items-center text-xs font-bold text-emerald-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Start Session</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* 3. Role Specific */}
          <div
            onClick={() => handleStartInterview('role_specific')}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Briefcase size={22} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-amber-600 transition-colors">
                Role Specific
              </h3>
              <p className="text-xs text-amber-600/80 mt-1.5 leading-relaxed">
                Tailored questions for your target job role
              </p>
            </div>
            <div className="pt-5 flex items-center text-xs font-bold text-amber-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Start Session</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* 4. Mixed Interview */}
          <div
            onClick={() => handleStartInterview('mixed')}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Sparkles size={22} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-purple-600 transition-colors">
                Mixed Interview
              </h3>
              <p className="text-xs text-purple-600/80 mt-1.5 leading-relaxed">
                Combination of technical and behavioral questions
              </p>
            </div>
            <div className="pt-5 flex items-center text-xs font-bold text-purple-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Start Session</span>
              <ChevronRight size={14} />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
