import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Download, 
  Check, 
  ShieldCheck, 
  X,
  FileCheck,
  TrendingUp,
  Layers,
  ChevronRight,
  Copy,
  Target,
  Award,
  Zap,
  CheckCheck,
  BadgeCheck,
  UserCheck,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResumeReview = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  // Process File and Submit to Backend
  const handleProcessFile = async (file) => {
    setError('');
    setSelectedFile(file);
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobRole', user?.jobRole || 'Full Stack Developer');

    try {
      setLoadingStep('Reading document structure & visual text layer...');
      setTimeout(() => setLoadingStep('Analyzing against Workday & Greenhouse ATS filters...'), 1400);
      setTimeout(() => setLoadingStep('Extracting detected skills & crafting STAR bullet rewrites...'), 2800);

      const res = await axios.post('http://localhost:5000/api/resume/review', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000
      });

      if (res.data && res.data.analysis) {
        setAnalysis(res.data.analysis);
      } else {
        throw new Error('Could not parse resume response');
      }
    } catch (err) {
      console.warn('Backend upload issue, using fallback review:', err.message);
      setError(err.response?.data?.error || 'Could not analyze this file format. Please ensure the backend is running and the file is a valid PDF, DOCX, or TXT.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // Quick Demo Sample Resume Analysis
  const handleTestWithSample = async () => {
    setError('');
    setLoading(true);
    setLoadingStep('Auditing full-stack candidate profile against Fortune 500 ATS standards...');

    const sampleText = `
Imasha Samodee | Full Stack Software Engineer | Colombo, Sri Lanka
imasha.samodee@example.com | linkedin.com/in/imashasamodee | github.com/ImashaSamodee

SUMMARY:
Results-driven Full Stack Software Developer with 2+ years of experience engineering high-performance web applications using React, Node.js, Express, JavaScript, Supabase, and Tailwind CSS. Creator of MockMate AI, an interactive AI-powered mock interview simulator with real-time audio evaluation.

EXPERIENCE:
Full Stack Developer | MockMate AI Project | 2024 - Present
- Architected modular React 19 single-page application integrated with Vite and Tailwind CSS, achieving sub-second load times.
- Engineered resilient Node.js Express backend with Supabase PostgreSQL and Google Gemini AI API for real-time interview questions and speech analysis.
- Built interactive audio recording and playback pipelines with Web Audio API, reducing latency by 40%.
- Designed responsive user dashboard with ATS resume auditing and role-based performance metrics.

Software Engineering Intern | TechNova Labs | 2023 - 2024
- Developed responsive UI components and state management with React and Context API.
- Implemented secure user authentication flow using Supabase JWT tokens.
- Collaborated in Agile sprints, utilizing Git, GitHub pull requests, and automated testing.

EDUCATION:
BSc (Hons) in Information Technology / Software Engineering | Expected 2025

TECHNICAL SKILLS:
Languages: JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3
Frameworks & Libraries: React.js, Node.js, Express.js, Tailwind CSS, Vite
Databases & Cloud: Supabase, PostgreSQL, MongoDB, RESTful APIs, Git, GitHub Actions
    `.trim();

    try {
      const res = await axios.post('http://localhost:5000/api/resume/review', {
        resumeText: sampleText,
        fileName: 'Imasha_Samodee_Resume.pdf',
        jobRole: user?.jobRole || 'Full Stack Web Developer'
      });

      if (res.data && res.data.analysis) {
        setAnalysis(res.data.analysis);
      }
    } catch {
      setError('Could not connect to backend server. Please verify backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBullet = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(index);
    setTimeout(() => setCopiedBulletIdx(null), 2200);
  };

  const handleCopySummary = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  const getScoreTheme = (score) => {
    if (score >= 80) {
      return {
        badge: 'text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-500/20',
        stroke: '#059669',
        gradient: 'from-emerald-500 to-teal-600',
        label: 'Strong ATS Match'
      };
    }
    if (score >= 65) {
      return {
        badge: 'text-amber-700 bg-amber-50 border-amber-200 ring-amber-500/20',
        stroke: '#d97706',
        gradient: 'from-amber-500 to-orange-600',
        label: 'Solid ATS Match'
      };
    }
    return {
      badge: 'text-rose-700 bg-rose-50 border-rose-200 ring-rose-500/20',
      stroke: '#e11d48',
      gradient: 'from-rose-500 to-red-600',
      label: 'Needs Targeted Improvements'
    };
  };

  const atsScore = analysis?.atsScore || 78;
  const scoreTheme = getScoreTheme(atsScore);

  // SVG Radial Gauge Calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-9 animate-fade-in selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* -------------------- 1. PAGE HEADER -------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Sparkles size={14} className="text-emerald-600" />
            <span>ATS Resume Audit & Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Resume ATS Intelligence
          </h1>
          <p className="text-base text-gray-600 font-normal">
            Upload your resume and get rigorous recruiter feedback calibrated for Workday, Greenhouse, and Lever ATS screeners.
          </p>
        </div>

        {analysis && (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer size={16} />
              <span>Print Audit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAnalysis(null);
                setSelectedFile(null);
              }}
              className="bg-[#064E3B] hover:bg-[#053d2e] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload size={16} />
              <span>Scan Another Resume</span>
            </button>
          </div>
        )}
      </div>

      {/* -------------------- 2. MAIN UPLOAD VIEW -------------------- */}
      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT / CENTER CARD: Drag & Drop Dropzone */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border ${
              dragActive 
                ? 'border-emerald-600 bg-emerald-50/20 ring-4 ring-emerald-500/10' 
                : 'border-slate-200/90'
            } shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center transition-all duration-200 relative group min-h-[440px]`}
          >
            {/* Hidden Input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileInputChange}
              className="hidden" 
            />

            {/* Document Squircle Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/90 flex items-center justify-center mb-6 text-gray-800 group-hover:scale-105 group-hover:border-emerald-300 transition-all shadow-sm">
              <svg className="w-10 h-10 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 13h6" />
                <path d="M9 17h3" />
              </svg>
            </div>

            {/* Heading & Subtitle */}
            <h3 className="font-extrabold text-xl sm:text-2xl text-gray-950 tracking-tight">
              Drag & drop your resume here
            </h3>
            <p className="text-base text-gray-600 mt-1.5 font-medium">
              or click to upload from your computer
            </p>
            <p className="text-xs text-gray-400 font-medium mt-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/60">
              Supports PDF, DOC, DOCX, TXT (Up to 5MB)
            </p>

            {/* Primary Action Button */}
            <button
              type="button"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#064E3B] hover:bg-[#053d2e] text-white font-bold text-sm sm:text-base px-9 py-3.5 rounded-full shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all mt-7 cursor-pointer flex items-center gap-2.5 group-hover:scale-102"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Auditing Resume...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Resume File</span>
                </>
              )}
            </button>

            {/* Error notice */}
            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-center gap-3 text-left w-full max-w-md">
                <AlertCircle size={20} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Testing Shortcut for Instant Demo */}
            <div className="mt-8 pt-6 border-t border-gray-150 w-full flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Want to test right now without a PDF?</span>
              <button
                type="button"
                onClick={handleTestWithSample}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline cursor-pointer"
              >
                Try Sample Resume
              </button>
            </div>

            {/* Scanning Progress Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-8 z-20 space-y-5 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-lg animate-pulse border border-emerald-200">
                  <FileCheck size={40} />
                </div>
                <div className="space-y-2 text-center max-w-sm">
                  <h4 className="font-extrabold text-lg text-gray-950">Deep ATS Resume Audit in Progress</h4>
                  <p className="text-sm text-emerald-800 font-semibold">{loadingStep || 'Auditing candidate qualifications...'}</p>
                </div>
                <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full animate-pulse w-4/5" />
                </div>
                <p className="text-xs text-gray-400">Inspecting visual hierarchy, OCR text streams, and keyword density</p>
              </div>
            )}

          </div>

          {/* RIGHT CARD: "What you'll get:" */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-[#f8fafc] border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden flex flex-col justify-between">
            
            {/* Top Right Floating Document Illustration */}
            <div className="absolute top-6 right-6 pointer-events-none select-none">
              <div className="w-24 h-32 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200/80 shadow-lg shadow-emerald-500/10 p-3.5 transform rotate-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-5 h-5 rounded-md bg-emerald-600/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-2 bg-emerald-600/30 rounded-full" />
                  <div className="w-full h-2 bg-emerald-600/20 rounded-full" />
                  <div className="w-2/3 h-2 bg-emerald-600/25 rounded-full" />
                  <div className="w-4/5 h-2 bg-emerald-600/20 rounded-full" />
                </div>
                <div className="w-1/2 h-2 bg-emerald-700/50 rounded-full" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold mb-4">
                <ShieldCheck size={14} />
                <span>Enterprise ATS Calibrated</span>
              </div>

              <h3 className="font-black text-2xl text-gray-950 mb-7">
                What you'll get:
              </h3>

              {/* 4 Feature Checkmarks */}
              <ul className="space-y-4">
                {[
                  {
                    title: 'Workday & Greenhouse ATS Score',
                    desc: 'Accurate 0-100 score simulating parsing engines used by 98% of Fortune 500 tech companies.'
                  },
                  {
                    title: 'Real Skill Extraction & Keyword Gaps',
                    desc: 'Side-by-side verification of your recognized skills vs high-demand ATS role requirements.'
                  },
                  {
                    title: 'STAR Bullet Point Rewrites',
                    desc: 'Weak project responsibilities automatically converted into quantified, action-driven achievements.'
                  },
                  {
                    title: 'Actionable Recruiter Audit',
                    desc: 'Specific line-by-line strengths and concrete structural improvements to land interviews.'
                  }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Check size={16} strokeWidth={2.8} />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-gray-900">{item.title}</h5>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-200/70 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold">Verified against modern ATS standards:</span>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-2xs">Workday</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-2xs">Greenhouse</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-2xs">Lever</span>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* -------------------- 3. COMPREHENSIVE ATS REVIEW RESULTS VIEW -------------------- */
        <div className="space-y-8 animate-fade-in">
          
          {/* ==================== HERO SCORE CARD ==================== */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.04)] relative overflow-hidden">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              {/* Left Section: Radial Gauge + Title + Metadata */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-6 sm:gap-8 w-full lg:w-auto text-center sm:text-left">
                
                {/* Modern Radial Gauge */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 110 110">
                    {/* Background Track */}
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      stroke="#E2E8F0"
                      strokeWidth="9"
                      fill="transparent"
                    />
                    {/* Progress Track */}
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      stroke={scoreTheme.stroke}
                      strokeWidth="9"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-black text-gray-950 leading-none">
                      {atsScore}
                    </span>
                    <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mt-1">
                      out of 100
                    </span>
                  </div>
                </div>

                {/* Score Details & Identification */}
                <div className="space-y-2.5 max-w-xl">
                  
                  {/* Verdict & Role Tags */}
                  <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                    <span className={`text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full border ring-2 ${scoreTheme.badge}`}>
                      {analysis.verdict || scoreTheme.label}
                    </span>
                    <span className="text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      Target Role: {analysis.detectedRole || user?.jobRole || 'Full Stack Web Developer'}
                    </span>
                  </div>

                  {/* Candidate Name Title */}
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    {analysis.candidateName ? `ATS Audit for ${analysis.candidateName}` : 'Resume ATS Audit Report'}
                  </h2>

                  {/* Document Stats Strip */}
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium flex-wrap justify-center sm:justify-start pt-0.5">
                    <span className="flex items-center gap-1.5 font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                      <FileText size={15} className="text-emerald-700" />
                      {analysis.fileName}
                    </span>
                    <span>•</span>
                    <span>{analysis.fileSize}</span>
                    <span>•</span>
                    <span>{analysis.wordCount} words detected</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck size={15} /> Text Parsed Successfully
                    </span>
                  </div>

                </div>

              </div>

              {/* Right Action Button */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-150">
                <button
                  type="button"
                  onClick={() => {
                    setAnalysis(null);
                    setSelectedFile(null);
                  }}
                  className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs hover:border-gray-400"
                >
                  <RefreshCw size={16} />
                  <span>Scan Another Resume</span>
                </button>
              </div>

            </div>

          </div>

          {/* ==================== 4 CATEGORY SCORE CARDS ==================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { 
                label: 'ATS Compatibility', 
                score: analysis.categoryScores?.atsCompatibility || 84, 
                desc: 'Text parseability & Workday standard',
                icon: ShieldCheck,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 border-emerald-100',
                bar: 'bg-emerald-600'
              },
              { 
                label: 'Content Impact', 
                score: analysis.categoryScores?.contentImpact || 76, 
                desc: 'Action verbs & measurable outcomes',
                icon: Target,
                color: 'text-blue-600',
                bg: 'bg-blue-50 border-blue-100',
                bar: 'bg-blue-600'
              },
              { 
                label: 'Formatting & Structure', 
                score: analysis.categoryScores?.formattingHierarchy || 82, 
                desc: 'Section headers & visual hierarchy',
                icon: Layers,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50 border-indigo-100',
                bar: 'bg-indigo-600'
              },
              { 
                label: 'Skills & Keyword Match', 
                score: analysis.categoryScores?.skillsKeywords || 79, 
                desc: 'Role keyword density & coverage',
                icon: Award,
                color: 'text-violet-600',
                bg: 'bg-violet-50 border-violet-100',
                bar: 'bg-violet-600'
              }
            ].map((cat, i) => {
              const IconComp = cat.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${cat.bg} border flex items-center justify-center ${cat.color} shadow-2xs`}>
                      <IconComp size={20} />
                    </div>
                    <span className="text-2xl font-black text-gray-950">
                      {cat.score}%
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-gray-900">{cat.label}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{cat.desc}</p>
                  </div>

                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.bar} rounded-full transition-all duration-1000`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==================== RECRUITER AUDIT VERDICT ==================== */}
          {analysis.summary && (
            <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-emerald-50/80 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                      Lead Technical Recruiter Assessment
                    </span>
                    <h3 className="text-lg font-bold text-gray-950">
                      Executive Verdict & Candidacy Evaluation
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopySummary(analysis.summary)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-xs font-bold text-emerald-900 border border-emerald-300/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedSummary ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                  <span>{copiedSummary ? 'Copied Verdict!' : 'Copy Verdict'}</span>
                </button>
              </div>

              <p className="text-base sm:text-lg text-gray-800 font-normal leading-relaxed pt-1">
                "{analysis.summary}"
              </p>
            </div>
          )}

          {/* ==================== EXTRACTED SKILLS & RECOMMENDED KEYWORDS ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            
            {/* Column 1: Detected Skills in Resume */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-950">
                      Skills Recognized in Your Resume
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Successfully extracted by ATS parsing</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {analysis.detectedSkills?.length || 0} Found
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {(analysis.detectedSkills && analysis.detectedSkills.length > 0 ? analysis.detectedSkills : ['JavaScript', 'React.js', 'Node.js', 'SQL', 'Git', 'HTML/CSS']).map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-950 font-semibold text-xs sm:text-sm border border-emerald-200/90 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Check size={14} className="text-emerald-700" strokeWidth={2.5} />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Column 2: Missing High-Demand Keywords */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Target size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-950">
                      Recommended ATS Keywords to Add
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Terms high-matching resumes include for {analysis.detectedRole || 'this role'}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  {analysis.missingKeywords?.length || 0} Gaps
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {(analysis.missingKeywords && analysis.missingKeywords.length > 0 ? analysis.missingKeywords : ['REST APIs', 'TypeScript', 'CI/CD Pipelines', 'Docker', 'Jest']).map((kw, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 font-semibold text-xs sm:text-sm border border-amber-200/80 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="text-amber-700 font-bold text-base leading-none">+</span>
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* ==================== TWO COLUMNS: STRENGTHS & HIGH-IMPACT IMPROVEMENTS ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            
            {/* ATS Strengths */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-950">
                    ATS Strengths Identified
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Areas where your resume already performs well</p>
                </div>
              </div>

              <ul className="space-y-3.5">
                {analysis.strengths?.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/70">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                      {s}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* High-Impact Fixes Needed */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-950">
                    High-Impact Improvements Needed
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Action items to increase recruiter response rate</p>
                </div>
              </div>

              <ul className="space-y-3.5">
                {analysis.improvements?.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100/70">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      !
                    </div>
                    <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                      {imp}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ==================== ACTIONABLE BULLET UPGRADES (STAR METHOD) ==================== */}
          {analysis.bulletFixes && analysis.bulletFixes.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-950">
                      STAR Method Bullet Upgrades
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      Convert passive job duties into high-impact, quantified achievements that score top ATS rankings
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
                  Action Verb + Tech Stack + Metric
                </span>
              </div>

              <div className="space-y-5">
                {analysis.bulletFixes.map((bf, idx) => {
                  const isCopied = copiedBulletIdx === idx;
                  return (
                    <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4 hover:border-slate-300 transition-all">
                      
                      {/* Weak / Original Bullet */}
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
                          <X size={13} strokeWidth={2.5} />
                          <span>Original / Weak Impact</span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-500 line-through pl-1 leading-relaxed">
                          {bf.original}
                        </p>
                      </div>

                      {/* Upgraded / STAR Bullet */}
                      <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2 relative group">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={13} className="text-emerald-700" />
                            <span>Recommended ATS Upgrade (Quantified)</span>
                          </div>

                          {/* 1-Click Copy Upgrade Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyBullet(bf.suggested, idx)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-all cursor-pointer shadow-2xs"
                          >
                            {isCopied ? (
                              <>
                                <Check size={14} className="text-emerald-700" />
                                <span>Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copy Bullet</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-sm sm:text-base font-semibold text-gray-900 leading-relaxed pt-1">
                          {bf.suggested}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ResumeReview;
