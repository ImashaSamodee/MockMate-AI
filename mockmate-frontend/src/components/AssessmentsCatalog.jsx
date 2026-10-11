// src/components/AssessmentsCatalog.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  ArrowLeft,
  Sparkles,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AssessmentsCatalog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const email = user?.email || 'imashasamodee@gmail.com';
      const res = await axios.get(`http://localhost:5000/api/assessments?email=${encodeURIComponent(email)}`);
      if (res.data && res.data.assessments) {
        setAssessments(res.data.assessments);
      }
    } catch (err) {
      console.error("Assessments fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Web Development', 'Backend', 'System Design', 'Programming', 'Leadership'];

  const filtered = assessments.filter(a => {
    if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.skills?.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              to="/certificates"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Back to Earned Certificates
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Certification Assessments
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-normal mt-1">
            Timed technical and behavioral examinations. Score {">="} 75% to earn an official verified certificate.
          </p>
        </div>

        <Link
          to="/certificates"
          className="px-5 py-2.5 rounded-full border border-gray-250 bg-white hover:bg-gray-50 text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2 shadow-2xs self-start"
        >
          <Award size={16} className="text-emerald-700" />
          <span>My Earned Certificates</span>
        </Link>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assessments by skill or title..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assessments Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400">Loading certification examinations...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs space-y-3 max-w-md mx-auto">
          <BookOpen size={32} className="mx-auto text-gray-400" />
          <h3 className="text-base font-bold text-gray-900">No assessments found</h3>
          <p className="text-xs text-gray-500">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-3xl p-7 border border-gray-200 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group space-y-6"
            >
              <div className="space-y-4">
                
                {/* Header row: Category & Level */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                    {test.category}
                  </span>
                  <span className="text-xs font-bold text-gray-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {test.level}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-extrabold text-xl text-gray-950 group-hover:text-emerald-800 transition-colors">
                    {test.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 font-normal leading-relaxed">
                    {test.description}
                  </p>
                </div>

                {/* Exam Parameters Row */}
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-gray-50/80 border border-gray-150 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Duration</span>
                    <strong className="text-xs sm:text-sm text-gray-900 font-extrabold flex items-center justify-center gap-1 mt-0.5">
                      <Clock size={12} className="text-emerald-700" /> {test.durationMinutes} Mins
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Questions</span>
                    <strong className="text-xs sm:text-sm text-gray-900 font-extrabold block mt-0.5">
                      {test.questionsCount || 6} Items
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Pass Mark</span>
                    <strong className="text-xs sm:text-sm text-emerald-800 font-extrabold block mt-0.5">
                      {test.passMark}%
                    </strong>
                  </div>
                </div>

                {/* Evaluated Skills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Evaluated Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {test.skills?.map((skill, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">
                  Attempt limit: {test.attemptLimit || 3} tries
                </span>

                <button
                  type="button"
                  onClick={() => navigate(`/assessments/${test.id}/take`)}
                  className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm group-hover:shadow"
                >
                  <span>Start Assessment Test</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AssessmentsCatalog;
