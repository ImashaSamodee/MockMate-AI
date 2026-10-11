// src/components/Certificates.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Award, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  ShieldCheck, 
  Star,
  Search,
  Filter,
  Share2,
  Check,
  Eye,
  BookOpen,
  BarChart2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CertificateDetail from './CertificateDetail';

const Certificates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [summary, setSummary] = useState({
    totalCertificates: 0,
    verifiedCertificates: 0,
    completedAssessments: 0,
    averageScore: '0%'
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCertForPreview, setSelectedCertForPreview] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const email = user?.email || 'imashasamodee@gmail.com';
      const name = user?.name || 'Imasha Samodee';
      const res = await axios.get(`http://localhost:5000/api/certificates?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);

      if (res.data) {
        setCertificates(res.data.certificates || []);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error("Certificates fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareCertificate = (cert, e) => {
    e.stopPropagation();
    const url = `http://localhost:5173/verify/${cert.certificateId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cert.certificateId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'Web Development', 'System Design', 'Programming', 'Leadership'];
  const levels = ['All', 'Senior Level (Verified)', 'Staff Level Ownership', 'Exceptional (Top 5%)'];

  // Filtered Certificates
  const filteredCertificates = certificates.filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedLevel !== 'All' && c.level !== selectedLevel) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.certificateId.toLowerCase().includes(q) ||
      c.level.toLowerCase().includes(q) ||
      c.skills?.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      
      {/* ----------------- 1. HEADER & CTA ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Earned Certificates
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-normal mt-1">
            Verified technical competency credentials backed by real AI mock interview evaluations and timed assessments.
          </p>
        </div>

        <button
          onClick={() => navigate('/assessments')}
          className="bg-[#064E3B] hover:bg-[#053d2e] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 self-start cursor-pointer hover:scale-102"
        >
          <Sparkles size={16} />
          <span>Take Test for Next Certificate</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* ----------------- 2. SUMMARY DASHBOARD CARDS (ACTUAL DB RECORDS) ----------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Certificates */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Award size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
              Total Certificates
            </span>
            <span className="text-2xl sm:text-3xl font-black text-gray-950">
              {summary.totalCertificates}
            </span>
          </div>
        </div>

        {/* Verified Credentials */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
              Verified Credentials
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-800">
              {summary.verifiedCertificates}
            </span>
          </div>
        </div>

        {/* Completed Assessments */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
              Completed Assessments
            </span>
            <span className="text-2xl sm:text-3xl font-black text-gray-950">
              {summary.completedAssessments}
            </span>
          </div>
        </div>

        {/* Average Assessment Score */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-150 shadow-2xs space-y-2 hover:border-gray-300 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
            <BarChart2 size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
              Average Score
            </span>
            <span className="text-2xl sm:text-3xl font-black text-purple-900">
              {summary.averageScore}
            </span>
          </div>
        </div>

      </div>

      {/* ----------------- 3. SEARCH & FILTERS BAR ----------------- */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, credential ID, or skill..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#064E3B] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Public Verification Link */}
          <Link
            to="/verify"
            className="px-3 py-1.5 rounded-xl border border-dashed border-emerald-400 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1.5 transition-all ml-auto md:ml-2"
          >
            <ShieldCheck size={13} />
            <span>Public Registry Lookup</span>
          </Link>
        </div>

      </div>

      {/* ----------------- 4. CERTIFICATES GRID ----------------- */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400">Loading verified credentials...</p>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs space-y-4 max-w-md mx-auto">
          <Award size={36} className="mx-auto text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900">No certificates match your filters</h3>
          <p className="text-xs text-gray-500">
            {searchQuery || selectedCategory !== 'All' 
              ? 'Try clearing search filters.' 
              : 'Pass your first assessment examination to earn an official certificate.'}
          </p>
          <button
            onClick={() => navigate('/assessments')}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold cursor-pointer"
          >
            Browse Available Assessments
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCertificates.map((cert) => {
            const isCopied = copiedId === cert.certificateId;

            return (
              <div 
                key={cert.id || cert.certificateId}
                onClick={() => setSelectedCertForPreview(cert)}
                className="bg-white rounded-3xl p-7 border border-gray-150/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
              >
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-bl-[5rem] pointer-events-none" />

                <div className="space-y-4">
                  {/* Card Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
                      <Award size={24} />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-700" />
                      <span>{cert.level}</span>
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  {(() => {
                    const candidateName = (cert.userName && cert.userName !== 'Candidate') 
                      ? cert.userName 
                      : (user?.name || 'Imasha Samodee');

                    return (
                      <>
                        <div>
                          <h3 className="font-extrabold text-lg sm:text-xl text-gray-950 group-hover:text-emerald-800 transition-colors">
                            {cert.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">
                            Candidate: <strong className="text-gray-900">{candidateName}</strong> • Issued {cert.issueDate}
                          </p>
                          <div className="text-xs text-emerald-800 font-bold mt-0.5">
                            {cert.score}
                          </div>
                        </div>

                        {/* Skills Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cert.skills?.map((skill, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-gray-700 px-2.5 py-1 rounded-full font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Bottom ID & Functional Actions */}
                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-mono text-gray-400 font-semibold">
                    ID: {cert.certificateId}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Share Action */}
                    <button
                      type="button"
                      onClick={(e) => handleShareCertificate(cert, e)}
                      className="text-xs font-bold text-gray-600 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy Public Verification Link"
                    >
                      {isCopied ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
                      <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
                    </button>

                    {/* View Certificate */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCertForPreview(cert);
                      }}
                      className="text-xs font-bold text-gray-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>Preview</span>
                    </button>

                    {/* Download PDF Action */}
                    <a
                      href={`http://localhost:5000/api/certificates/${cert.id || cert.certificateId}/pdf?email=${encodeURIComponent(user?.email || 'imashasamodee@gmail.com')}&name=${encodeURIComponent((cert.userName && cert.userName !== 'Candidate') ? cert.userName : (user?.name || 'Imasha Samodee'))}`}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
                    >
                      <Download size={13} />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ----------------- 5. CERTIFICATE PREVIEW MODAL ----------------- */}
      {selectedCertForPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-scale-up">
            <CertificateDetail 
              certificateProp={selectedCertForPreview} 
              onClose={() => setSelectedCertForPreview(null)} 
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Certificates;
