// src/components/TipDetail.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Check, 
  Copy, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Code, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight,
  ThumbsUp,
  ChevronRight,
  List,
  AlertTriangle,
  Lightbulb,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INTERVIEW_ARTICLES, getArticleBySlugOrId } from '../data/interviewArticlesData';
import {
  IntroPracticeEditor,
  ReactQuestionsAccordion,
  StarMethodBuilder,
  AtsChecklist,
  SalaryNegotiationSimulator,
  SeniorAssessmentMatrix,
  SaveSelectedQuestionsDeck,
  SystemDesignPractice
} from './ArticleWidgets';

const TipDetail = () => {
  const { slug, id } = useParams();
  const articleParam = slug || id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(142);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 1. Load Article Data & Local Storage States
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check Bookmark Status
    try {
      const savedBookmarks = localStorage.getItem('mockmate_bookmarked_tips');
      const list = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      setIsBookmarked(list.includes(articleParam));
    } catch {
      setIsBookmarked(false);
    }

    // Check Completed Status
    try {
      const completedList = localStorage.getItem('mockmate_completed_articles');
      const comp = completedList ? JSON.parse(completedList) : [];
      setIsCompleted(comp.includes(articleParam));
    } catch {
      setIsCompleted(false);
    }

    // Fetch Article Data
    fetchArticleData();
  }, [articleParam]);

  const fetchArticleData = async () => {
    setLoading(true);

    // 1. Check local comprehensive articles dataset first
    const localMatch = getArticleBySlugOrId(articleParam);
    if (localMatch) {
      setArticle(localMatch);
      setLoading(false);
      return;
    }

    // 2. Query backend API if not found locally (for AI-generated dynamic guides)
    try {
      const res = await axios.get(`http://localhost:5000/api/tips/${articleParam}`);
      if (res.data && res.data.tip) {
        setArticle(res.data.tip);
      } else {
        // Fallback to first article if not found
        setArticle(INTERVIEW_ARTICLES['tell-me-about-yourself']);
      }
    } catch (err) {
      console.warn('Backend tip fetch notice, fallback to default:', err.message);
      // Sensible fallback
      setArticle(INTERVIEW_ARTICLES['tell-me-about-yourself']);
    } finally {
      setLoading(false);
    }
  };

  // 2. Active TOC tracking via IntersectionObserver
  useEffect(() => {
    if (!article?.sections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    article.sections.forEach((sec, idx) => {
      const el = document.getElementById(sec.id || `section-${idx}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [article]);

  // Handle Smooth Scroll to Section
  const scrollToSection = (secId) => {
    const el = document.getElementById(secId);
    if (el) {
      const offset = 90; // Top header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSectionId(secId);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    try {
      const saved = localStorage.getItem('mockmate_bookmarked_tips');
      let list = saved ? JSON.parse(saved) : [];
      if (isBookmarked) {
        list = list.filter(bId => bId !== articleParam && bId !== article?.id && bId !== article?.slug);
        setIsBookmarked(false);
      } else {
        list.push(article?.slug || article?.id || articleParam);
        setIsBookmarked(true);
      }
      localStorage.setItem('mockmate_bookmarked_tips', JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Mark as Completed
  const handleToggleCompleted = () => {
    try {
      const saved = localStorage.getItem('mockmate_completed_articles');
      let list = saved ? JSON.parse(saved) : [];
      const currentKey = article?.slug || article?.id || articleParam;
      if (isCompleted) {
        list = list.filter(k => k !== currentKey && k !== articleParam);
        setIsCompleted(false);
      } else {
        list.push(currentKey);
        setIsCompleted(true);
      }
      localStorage.setItem('mockmate_completed_articles', JSON.stringify(list));
    } catch (err) {
      console.error(err);
    }
  };

  // Share Article (Copy URL)
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Copy Code Snippet
  const handleCopyCode = (codeText, idx) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Like Article
  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    } else {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    }
  };

  // Compute 3 Related Articles
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    const all = Object.values(INTERVIEW_ARTICLES);
    return all
      .filter(a => a.id !== article.id && a.slug !== article.slug)
      .slice(0, 3);
  }, [article]);

  // Render Interactive Widget Based on Type
  const renderInteractiveWidget = () => {
    if (!article) return null;
    switch (article.interactiveType) {
      case 'intro-practice':
        return <IntroPracticeEditor />;
      case 'react-accordion':
        return <ReactQuestionsAccordion />;
      case 'star-builder':
        return <StarMethodBuilder />;
      case 'ats-checklist':
        return <AtsChecklist />;
      case 'salary-simulator':
        return <SalaryNegotiationSimulator />;
      case 'senior-assessment':
        return <SeniorAssessmentMatrix />;
      case 'saved-questions':
        return <SaveSelectedQuestionsDeck />;
      case 'system-design':
        return <SystemDesignPractice />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFDFD] flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-500">Loading interview guide...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FCFDFD] p-6 max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900">Article Not Found</h2>
        <p className="text-gray-500 text-sm">The requested interview guide could not be located.</p>
        <Link 
          to="/interview-tips"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-sm shadow-sm"
        >
          <ArrowLeft size={16} /> Return to Interview Tips
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFDFD] text-gray-900 font-sans pb-24">
      
      {/* -------------------- 1. TOP BREADCRUMB & UTILITY BAR -------------------- */}
      <div className="border-b border-gray-150 bg-white sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Breadcrumbs: Dashboard → Interview Tips → Article */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link to="/dashboard" className="hover:text-emerald-800 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
            <Link to="/interview-tips" className="hover:text-emerald-800 transition-colors">
              Interview Tips
            </Link>
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-950 font-bold truncate max-w-[200px] sm:max-w-[320px]">
              {article.title}
            </span>
          </nav>

          {/* Action Buttons: Bookmark & Share */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Share Button */}
            <div className="relative">
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl border border-gray-250 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Share Article"
              >
                {copiedUrl ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                <span className="hidden sm:inline">{copiedUrl ? 'Copied Link!' : 'Share'}</span>
              </button>
            </div>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isBookmarked 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-white border-gray-250 text-gray-700 hover:bg-gray-50'
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Save Article"}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck size={14} className="text-emerald-700 fill-emerald-700" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark size={14} />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Back to Tips Link */}
        <div className="mb-6">
          <Link
            to="/interview-tips"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to All Tips & Resources</span>
          </Link>
        </div>

        {/* -------------------- 2. HERO BANNER COVER -------------------- */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 mb-8 sm:mb-10">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-700"
            onError={(e) => {
              e.target.src = '/tips/react-interview.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Floating Category Pill on Hero */}
          <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-white flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-black px-3.5 py-1 rounded-full bg-emerald-600 text-white shadow-md uppercase tracking-wider">
                {article.tag || article.category}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-200 flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                <Clock size={13} /> {article.readTime}
              </span>
            </div>

            <span className="text-xs text-gray-300 font-medium hidden sm:inline bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
              {article.publishedDate || 'Editorial Interview Guide'}
            </span>
          </div>
        </div>

        {/* -------------------- 3. ARTICLE TITLE & METADATA -------------------- */}
        <div className="space-y-4 border-b border-gray-150 pb-8 mb-10">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-gray-500">
            <span className="text-emerald-800 font-extrabold uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {article.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-600 font-semibold">
              <Clock size={14} className="text-gray-400" />
              {article.readTime}
            </span>
            <span>•</span>
            <span className="text-gray-600 font-medium">
              By {article.author || 'MockMate Senior Editorial Staff'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-4xl">
            {article.summary}
          </p>

          {article.formula && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-teal-50/80 border border-emerald-200 flex items-start sm:items-center gap-3.5 mt-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <TrendingUp size={20} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 block">
                  The Core Framework
                </span>
                <p className="text-sm sm:text-base font-bold text-emerald-950 mt-0.5">
                  {article.formula}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* -------------------- 4. MAIN ARTICLE CONTENT WITH STICKY TOC -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Mobile Table of Contents Quick Jump (Visible only on mobile/tablet) */}
            {article.sections && article.sections.length > 0 && (
              <div className="block lg:hidden rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-700">
                  <List size={14} className="text-emerald-700" />
                  <span>Table of Contents</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.sections.map((sec, idx) => {
                    const secId = sec.id || `section-${idx}`;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToSection(secId)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-800 hover:border-emerald-400 hover:text-emerald-800 transition-all cursor-pointer"
                      >
                        {sec.heading.split('.')[0]}. {sec.heading.split('.')[1] || sec.heading}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section Breakdown */}
            {article.sections && article.sections.length > 0 ? (
              article.sections.map((sec, idx) => {
                const secId = sec.id || `section-${idx}`;
                return (
                  <section 
                    key={idx} 
                    id={secId} 
                    className="space-y-4 scroll-mt-24"
                  >
                    {/* Section Heading */}
                    <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2.5">
                      <span className="w-2 h-6 bg-emerald-700 rounded-full shrink-0" />
                      <span>{sec.heading}</span>
                    </h2>

                    {/* Paragraph Content */}
                    <div className="text-base sm:text-lg text-gray-800 font-normal leading-relaxed whitespace-pre-line space-y-3 font-sans">
                      {sec.content}
                    </div>

                    {/* Code Snippet Block if Present */}
                    {sec.code && (
                      <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-[#0F172A] my-4">
                        <div className="px-5 py-3 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            <span className="text-xs font-mono text-slate-400 ml-2 font-semibold flex items-center gap-1.5">
                              <Code size={13} /> Code Snippet
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyCode(sec.code, idx)}
                            className="text-xs font-mono font-bold text-slate-300 hover:text-white px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            {copiedCodeIdx === idx ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-300">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed scrollbar-thin">
                          <code>{sec.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Optional Secondary Code Block */}
                    {sec.secondaryHeading && (
                      <h3 className="text-lg font-bold text-gray-900 pt-2">
                        {sec.secondaryHeading}
                      </h3>
                    )}
                    {sec.secondaryCode && (
                      <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-[#0F172A] my-2">
                        <pre className="p-5 text-xs sm:text-sm font-mono text-teal-300 overflow-x-auto leading-relaxed scrollbar-thin">
                          <code>{sec.secondaryCode}</code>
                        </pre>
                      </div>
                    )}

                    {/* Callout Card (Tip or Warning) */}
                    {sec.callout && (
                      <div className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 my-4 ${
                        sec.callout.type === 'warning'
                          ? 'bg-amber-50/80 border-amber-250 text-amber-950'
                          : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      }`}>
                        <div className="shrink-0 mt-0.5">
                          {sec.callout.type === 'warning' ? (
                            <AlertTriangle size={18} className="text-amber-700" />
                          ) : (
                            <Lightbulb size={18} className="text-emerald-700" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-black uppercase tracking-wider block">
                            {sec.callout.title}
                          </span>
                          <p className="text-xs sm:text-sm leading-relaxed font-medium">
                            {sec.callout.text}
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })
            ) : (
              /* Fallback for structured items if no sections array */
              article.items && article.items.length > 0 && (
                <div className="space-y-6">
                  {article.items.map((item, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-xs uppercase">
                          {item.badge || `0${idx + 1}`}
                        </span>
                        <h4 className="font-extrabold text-base sm:text-lg text-gray-950">{item.title}</h4>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* -------------------- 5. EMBEDDED INTERACTIVE WIDGET -------------------- */}
            <div className="pt-2">
              {renderInteractiveWidget()}
            </div>

            {/* -------------------- 6. KEY TAKEAWAYS & COMPLETION -------------------- */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white shadow-xl space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckSquare size={20} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Summary & Retention
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Key Actionable Takeaways
                  </h3>
                </div>
              </div>

              <ul className="space-y-3 text-sm sm:text-base text-gray-200 leading-relaxed">
                {article.keyTakeaways && article.keyTakeaways.length > 0 ? (
                  article.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-1" />
                      <span>{takeaway}</span>
                    </li>
                  ))
                ) : (
                  article.keyPoints?.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-1" />
                      <span>{pt}</span>
                    </li>
                  )) || null
                )}
              </ul>

              {/* Mark as Completed Button */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-400">
                  Track your preparation progress across all interview masterclasses.
                </span>

                <button
                  type="button"
                  onClick={handleToggleCompleted}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isCompleted
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Completed! Marked in Progress</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare size={16} />
                      <span>Mark Guide as Completed</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* -------------------- 7. PRACTICE WITH AI BANNER (CTA) -------------------- */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-emerald-200 text-xs font-bold">
                  <Sparkles size={13} />
                  <span>Real-Time Voice & Video Simulation</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Ready to test this in a real interview?
                </h3>
                <p className="text-sm sm:text-base text-emerald-100 font-normal max-w-xl">
                  Launch MockMate AI's interactive simulator. Receive live feedback on speech clarity, technical accuracy, and composure.
                </p>
              </div>

              <Link
                to="/interview"
                className="shrink-0 px-7 py-3.5 rounded-2xl bg-white text-emerald-950 font-black text-sm sm:text-base hover:bg-emerald-50 hover:shadow-lg transition-all duration-300 flex items-center gap-2 group cursor-pointer z-10"
              >
                <span>Start AI Mock Interview</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* -------------------- 8. STICKY SIDEBAR (TOC & QUICK ACTIONS) (4 cols) -------------------- */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
            
            {/* Table of Contents Card */}
            {article.sections && article.sections.length > 0 && (
              <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <List size={14} className="text-emerald-800" />
                    Table of Contents
                  </span>
                  <span className="text-[11px] font-mono text-gray-400 font-semibold">
                    {article.sections.length} Sections
                  </span>
                </div>

                <nav className="space-y-1">
                  {article.sections.map((sec, idx) => {
                    const secId = sec.id || `section-${idx}`;
                    const isActive = activeSectionId === secId;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToSection(secId)}
                        className={`w-full text-left py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-900 font-bold border-l-4 border-emerald-700 pl-2.5'
                            : 'text-gray-600 hover:text-gray-950 hover:bg-gray-50'
                        }`}
                      >
                        <span className="truncate pr-2">{sec.heading}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Quick Completion & Bookmark Widget */}
            <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-2xs space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500 block">
                Your Reading Status
              </span>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleToggleCompleted}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-white text-gray-700 border-gray-250 hover:bg-gray-50'
                  }`}
                >
                  <CheckCircle2 size={15} className={isCompleted ? 'text-emerald-700' : 'text-gray-400'} />
                  <span>{isCompleted ? 'Completed Guide' : 'Mark as Completed'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleBookmark}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    isBookmarked
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-white text-gray-700 border-gray-250 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark size={15} className={isBookmarked ? 'text-emerald-700 fill-emerald-700' : 'text-gray-400'} />
                  <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark for Later'}</span>
                </button>
              </div>
            </div>

            {/* Quick Practice Card */}
            <div className="rounded-3xl bg-emerald-900 text-white p-6 shadow-md space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                Instant AI Practice
              </span>
              <h4 className="font-extrabold text-base text-white">
                Simulate this interview topic with MockMate AI
              </h4>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Test your delivery and answer framing under timed conditions with real-time feedback.
              </p>
              <Link
                to="/interview"
                className="w-full py-2.5 px-4 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 mt-2 shadow-sm"
              >
                <span>Launch Mock Interview</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </aside>

        </div>

        {/* -------------------- 9. RELATED ARTICLES SECTION -------------------- */}
        <div className="mt-20 pt-12 border-t border-gray-200 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                Continue Learning
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight mt-1">
                Related Interview Masterclasses
              </h3>
            </div>

            <Link
              to="/interview-tips"
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5"
            >
              <span>View All 8 Guides</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/interview-tips/${rel.slug || rel.id}`)}
                className="bg-white rounded-3xl border border-gray-200 hover:border-gray-300 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/tips/react-interview.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-900 text-[11px] font-bold">
                    {rel.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base text-gray-950 group-hover:text-emerald-800 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 font-normal leading-relaxed">
                      {rel.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {rel.readTime}
                    </span>
                    <span className="text-emerald-800 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read Guide <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TipDetail;
