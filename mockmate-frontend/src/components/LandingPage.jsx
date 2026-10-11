import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Bot, 
  BarChart3, 
  Sparkles, 
  Star, 
  Award, 
  Check, 
  Code2, 
  Cpu, 
  Zap, 
  ChevronRight,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import heroCandidateImg from '../assets/hero-candidate.jpg';
import Footer from './Footer';

const LandingPage = () => {
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoAnswer, setDemoAnswer] = useState('');
  const [demoEvaluated, setDemoEvaluated] = useState(false);

  const handleCta = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openAuthModal('register');
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openAuthModal('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      
      {/* -------------------- 1. NAVIGATION BAR -------------------- */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#064E3B] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
              MockMate <span className="text-[#059669]">AI</span>
            </span>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600">
            <a href="#home" className="text-gray-900 hover:text-emerald-700 transition-colors">Home</a>
            <a href="#features" className="hover:text-emerald-700 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How it Works</a>
            <a href="#demo" className="hover:text-emerald-700 transition-colors">Live Demo</a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">Pricing</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#064E3B] hover:bg-[#085a44] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-md shadow-emerald-950/20 flex items-center gap-2"
                >
                  <span>Dashboard</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-950 px-4 py-2.5 rounded-full hover:bg-gray-100/70 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-[#064E3B] hover:bg-[#085a44] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-md shadow-emerald-950/20 hover:shadow-lg hover:shadow-emerald-950/25 cursor-pointer transform hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* -------------------- 2. HERO SECTION -------------------- */}
      <section id="home" className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-teal-50/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6">
              
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-gray-900 leading-[1.15]">
                  Ace Your <br />
                  Next Interview <br />
                  with <span className="text-[#059669]">AI.</span>
                </h1>
                
                <p className="text-gray-600 text-sm sm:text-base font-normal leading-relaxed max-w-md pt-1">
                  Practice real interview questions, get instant AI feedback, and build the confidence to land your dream job.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  onClick={handleCta}
                  className="bg-[#064E3B] hover:bg-[#085a44] text-white font-semibold text-sm sm:text-[15px] px-6 py-3 rounded-full transition-all shadow-md shadow-emerald-950/20 hover:shadow-lg hover:shadow-emerald-950/25 flex items-center gap-2 group cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="bg-transparent hover:bg-gray-100/80 text-gray-800 font-semibold text-sm sm:text-[15px] px-5 py-3 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200/80 flex items-center justify-center text-gray-800">
                    <Play size={12} className="fill-current ml-0.5" />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="pt-2 flex items-center gap-3.5">
                {/* Overlapping Avatar Stack */}
                <div className="flex -space-x-2.5 overflow-hidden p-0.5">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="Candidate"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Candidate"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"
                    alt="Candidate"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                    alt="Candidate"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                    alt="Candidate"
                  />
                </div>

                {/* Rating & text */}
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-gray-900 text-xs sm:text-sm">10,000+</span>
                    <span className="text-[11px] sm:text-xs text-gray-500 font-medium">smart professionals</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-0.5">
                    <span>trust MockMate AI</span>
                    <span className="text-amber-500 flex items-center ml-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="ml-0.5 font-bold text-gray-800">4.9/5</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Column (Proportionately compact) */}
            <div className="lg:col-span-6 xl:col-span-6 relative">
              <div className="relative mx-auto max-w-[420px]">
                
                {/* Main Hero Card Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-950/10 border-4 border-white bg-white group">
                  <img
                    src={heroCandidateImg}
                    alt="MockMate AI candidate practicing technical interview"
                    className="w-full h-[370px] sm:h-[420px] object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  
                  {/* Subtle bottom gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge 1: "AI Interviewer" + Animated Audio Waveform */}
                <div className="absolute -top-2.5 left-2 sm:-left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg shadow-black/10 border border-white/80 animate-float-card flex flex-col gap-1.5 z-20 min-w-[170px]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-xs">
                      <Bot size={15} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">AI Interviewer</h4>
                      <p className="text-[9px] text-emerald-600 font-medium">Active Listening</p>
                    </div>
                  </div>

                  {/* Audio Waveform visualization */}
                  <div className="flex items-center justify-center gap-1 h-6 px-2 bg-slate-50/80 rounded-lg">
                    <div className="w-1 bg-[#10B981] rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 bg-[#059669] rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
                    <div className="w-1 bg-[#047857] rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 bg-[#10B981] rounded-full animate-wave-bar" style={{ animationDelay: '0.5s' }} />
                    <div className="w-1 bg-[#064E3B] rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }} />
                    <div className="w-1 bg-[#10B981] rounded-full animate-wave-bar" style={{ animationDelay: '0.6s' }} />
                    <div className="w-1 bg-[#059669] rounded-full animate-wave-bar" style={{ animationDelay: '0.15s' }} />
                    <div className="w-1 bg-[#047857] rounded-full animate-wave-bar" style={{ animationDelay: '0.35s' }} />
                  </div>
                </div>

                {/* Floating Badge 2: Checklist */}
                <div className="absolute top-[35%] -left-2 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg shadow-black/10 border border-white/80 animate-float-delayed z-20 space-y-2 min-w-[170px]">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>Real Questions</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>Instant Feedback</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span>Improve Skills</span>
                  </div>
                </div>

                {/* Floating Badge 3: Score Surge */}
                <div className="absolute -bottom-3 right-2 sm:-right-3 bg-gradient-to-br from-[#10B981] to-[#047857] rounded-2xl p-3 shadow-lg shadow-emerald-950/20 text-white z-20 flex items-center gap-2.5 animate-float-card">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <TrendingUp size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-emerald-100 uppercase tracking-wider">Score Surge</div>
                    <div className="text-base font-black text-white">+88% Pass Rate</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------- 3. INTERACTIVE LIVE DEMO PREVIEW -------------------- */}
      <section id="demo" className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-3.5 py-1.5 rounded-full">
              Try It Right Now
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Experience the AI Interviewer
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              See how MockMate AI analyzes your technical responses and provides instant, constructive feedback.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-[#06241a] text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Gemini Technical Evaluator</h3>
                  <p className="text-xs text-emerald-300">Question 1 of 5 • Full Stack Role</p>
                </div>
              </div>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                Live Simulation
              </span>
            </div>

            {/* Question */}
            <div className="my-6 p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-xs text-emerald-400 font-semibold mb-1 uppercase tracking-wider">AI Question:</p>
              <p className="text-base sm:text-lg font-medium text-gray-100">
                "What is the difference between client-side rendering (CSR) and server-side rendering (SSR), and how does each impact SEO and initial page load?"
              </p>
            </div>

            {/* Sample Answer Input */}
            <div className="space-y-3">
              <label className="text-xs text-gray-300 font-semibold flex items-center justify-between">
                <span>Your Answer:</span>
                <button
                  type="button"
                  onClick={() => {
                    setDemoAnswer("In SSR, the HTML is pre-rendered on the server for each request, delivering complete HTML to crawlers which is great for SEO and faster First Contentful Paint. In CSR, the browser downloads a minimal HTML bundle with JS that renders everything on the client side, which is fast for subsequent navigations but has slower initial load.");
                  }}
                  className="text-emerald-400 text-xs hover:underline cursor-pointer"
                >
                  Fill Sample Answer
                </button>
              </label>

              <textarea
                value={demoAnswer}
                onChange={(e) => setDemoAnswer(e.target.value)}
                placeholder="Type your answer or click 'Fill Sample Answer' to test the evaluator..."
                rows={3}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setDemoEvaluated(true)}
                  className="bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-900/40 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Evaluate with AI</span>
                </button>
              </div>
            </div>

            {/* Evaluation Result */}
            {demoEvaluated && (
              <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                    <span className="text-xs text-emerald-300">Technical Score</span>
                    <p className="text-2xl font-black text-emerald-400">9.5 / 10</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                    <span className="text-xs text-blue-300">Grammar & Tone</span>
                    <p className="text-2xl font-black text-blue-400">10 / 10</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                    <span className="text-xs text-amber-300">Status</span>
                    <p className="text-2xl font-black text-amber-400">High Match</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-xs sm:text-sm text-gray-200">
                  <span className="font-bold text-emerald-400 block mb-1">AI Feedback:</span>
                  "Excellent response! You clearly articulated the core trade-offs: SSR pre-populates the HTML payload on the server allowing web crawlers instant indexability and superior FCP, while CSR offloads computation to client JS engines. To make it senior-level, you can mention hydration overhead and hybrid approaches like Incremental Static Regeneration (ISR)."
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={handleCta}
                    className="bg-white hover:bg-gray-100 text-[#064E3B] font-bold text-sm px-6 py-3 rounded-full transition-all inline-flex items-center gap-2 shadow-lg"
                  >
                    <span>Practice Full 5-Question Interview Session</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* -------------------- 4. FEATURES SECTION -------------------- */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-3.5 py-1.5 rounded-full">
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            Engineered to Help You Pass Any Tech Interview
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Every feature is fine-tuned to mirror top tech hiring loops at FAANG, high-growth startups, and global enterprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <Bot size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Adaptive Gemini AI</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Questions dynamically adjust based on your role and experience level, asking follow-up edge cases like a principal engineer.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Detailed Feedback</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Get comprehensive technical scorecards, grammatical clarity ratings, and an ideal model answer within seconds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics & Mastery Dashboard</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Track your mock session completion, average technical proficiency scores, and identify specific gaps before interview day.
            </p>
          </div>

        </div>
      </section>

      {/* -------------------- 5. HOW IT WORKS -------------------- */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-100/60 px-3.5 py-1.5 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              How MockMate AI Works
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2">
              From zero practice to confident offer negotiation in three streamlined steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#064E3B] text-white font-bold flex items-center justify-center text-sm mb-6">
                01
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Select Target Job Role</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose Frontend, Backend, Full Stack, DevOps, or Data Science and specify your seniority level from Intern to Senior.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#064E3B] text-white font-bold flex items-center justify-center text-sm mb-6">
                02
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Engage in Live Interview</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Answer realistic coding, architecture, and system design questions tailored specifically for your chosen job role.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#064E3B] text-white font-bold flex items-center justify-center text-sm mb-6">
                03
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Review & Score 90%+</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Inspect AI breakdown, compare against ideal responses, and watch your readiness metric jump on your personal dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------- 6. PRICING SECTION -------------------- */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-3.5 py-1.5 rounded-full">
            Transparent Plans
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            Start Free, Upgrade When You're Ready
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            No credit card required to get started. Join thousands of candidates landing top offers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Starter Plan */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Starter</h3>
              <p className="text-xs text-gray-500 mt-1">Perfect for trying out the platform</p>
              <div className="my-6">
                <span className="text-4xl font-black text-gray-900">$0</span>
                <span className="text-gray-400 text-sm ml-2">/ forever</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> 3 AI Mock Interviews / month</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Basic Score Feedback</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> 5 Tech Stack Roles</li>
              </ul>
            </div>
            <button
              onClick={handleCta}
              className="mt-8 w-full py-3 rounded-xl border border-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#064E3B] text-white p-8 rounded-3xl shadow-xl shadow-emerald-950/20 relative flex flex-col justify-between transform md:-translate-y-2 border-2 border-emerald-400">
            <span className="absolute -top-3 right-6 bg-emerald-400 text-[#064E3B] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              Most Popular
            </span>
            <div>
              <h3 className="font-bold text-lg text-white">Pro Candidate</h3>
              <p className="text-xs text-emerald-200 mt-1">For active interview preppers</p>
              <div className="my-6">
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-emerald-200 text-sm ml-2">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-emerald-100">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-300" /> Unlimited AI Mock Interviews</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-300" /> Deep Grammar & Technical Breakdown</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-300" /> Perfect Model Answers</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-300" /> Analytics Dashboard Tracking</li>
              </ul>
            </div>
            <button
              onClick={handleCta}
              className="mt-8 w-full py-3 rounded-xl bg-white text-[#064E3B] font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Accelerator Plan */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Career Accelerator</h3>
              <p className="text-xs text-gray-500 mt-1">For career switchers & seniors</p>
              <div className="my-6">
                <span className="text-4xl font-black text-gray-900">$49</span>
                <span className="text-gray-400 text-sm ml-2">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> AI Resume Review & Match</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Salary Negotiation Coach</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Priority 24/7 Support</li>
              </ul>
            </div>
            <button
              onClick={handleCta}
              className="mt-8 w-full py-3 rounded-xl border border-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Get Accelerator
            </button>
          </div>

        </div>
      </section>

      {/* -------------------- 7. FOOTER -------------------- */}
      <Footer />

      {/* -------------------- 8. WATCH DEMO MODAL -------------------- */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Play size={24} className="fill-current ml-0.5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Watch MockMate in Action</h3>
            <p className="text-gray-500 text-sm mb-6">
              Experience the fast feedback loop of our AI interview simulator right in your browser.
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-3 mb-6 border border-gray-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Simulates live hiring loops with senior tech questions</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Provides exact scoring breakdown: technical & communication</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Generates an ideal benchmark answer for each question</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDemoModalOpen(false)}
                className="flex-1 py-3 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDemoModalOpen(false);
                  handleCta();
                }}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-[#064E3B] text-white hover:bg-[#085a44] transition-colors shadow-md"
              >
                Try It Free Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
