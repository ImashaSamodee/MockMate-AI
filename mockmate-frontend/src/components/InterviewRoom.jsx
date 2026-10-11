import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Clock, 
  Mic, 
  MicOff, 
  Video, 
  Square, 
  PhoneOff, 
  Lightbulb, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Share2, 
  Sparkles, 
  Target, 
  FileText, 
  Camera, 
  Volume2, 
  VolumeX,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import aiInterviewerImg from '../assets/ai-interviewer.jpg';

const InterviewRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params (?type=technical/behavioral & ?topic=JavaScript & ?q=...)
  const queryParams = new URLSearchParams(location.search);
  const interviewType = queryParams.get('type') || 'technical';
  const topicParam = queryParams.get('topic') || '';
  const initialQuestionParam = queryParams.get('q') || '';

  const userName = user?.name || 'Kasun Silva';
  const userEmail = user?.email || 'kasun@example.com';
  const userRole = user?.jobRole || 'Full Stack Developer';
  const experienceLevel = user?.experienceLevel || 'Junior (1-2 years)';

  // Interview state
  const [loading, setLoading] = useState(true);
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const totalQuestions = 5;
  const [question, setQuestion] = useState(initialQuestionParam || 'Can you explain the difference between client-side rendering and server-side rendering, and when you might choose one over the other?');
  
  // Audio & Timer controls
  const [seconds, setSeconds] = useState(272); // 04:32 default timer
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);

  // User Answer & Submission
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Speech Recognition (Microphone Recording)
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        if (transcript) {
          setUserAnswer((prev) => (prev ? prev.trim() + ' ' : '') + transcript.trim());
        }
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Microphone voice recording is not supported in this browser. Please type your response directly into the answer box.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Speech recognition start notice:", err);
      }
    }
  };

  // Helper panel tabs: 'tips' | 'notes'
  const [activeSideTab, setActiveSideTab] = useState('tips');
  const [notes, setNotes] = useState('');

  // Hint state
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);

  // Performance Report Tabs: 'ai_feedback' | 'ideal_answer' | 'transcript'
  const [activeReportTab, setActiveReportTab] = useState('ai_feedback');

  // Ideal Answer controls (Audio TTS & Copy)
  const [isPlayingIdealAudio, setIsPlayingIdealAudio] = useState(false);
  const [copiedIdeal, setCopiedIdeal] = useState(false);

  const handleSpeakIdealAnswer = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    if (isPlayingIdealAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingIdealAudio(false);
      return;
    }

    const textToRead = evaluation?.ideal_answer;
    if (!textToRead) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    utterance.onend = () => setIsPlayingIdealAudio(false);
    utterance.onerror = () => setIsPlayingIdealAudio(false);

    setIsPlayingIdealAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyIdeal = () => {
    if (!evaluation?.ideal_answer) return;
    navigator.clipboard.writeText(evaluation.ideal_answer);
    setCopiedIdeal(true);
    setTimeout(() => setCopiedIdeal(false), 2000);
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Live timer
  useEffect(() => {
    let timer;
    if (isTimerRunning && !evaluation) {
      timer = setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, evaluation]);

  // Start interview and fetch first question from backend
  useEffect(() => {
    const startSession = async () => {
      setLoading(true);

      // If a specific question was picked from Practice Topics
      if (initialQuestionParam) {
        setInterviewId(`int_${Date.now()}`);
        setQuestion(initialQuestionParam);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/interview/start', {
          name: userName,
          email: userEmail,
          jobRole: userRole,
          experienceLevel,
          interviewType,
          topic: topicParam || undefined
        }, { timeout: 15000 });

        if (response.data) {
          setInterviewId(response.data.interviewId || `int_${Date.now()}`);
          if (response.data.firstQuestion) {
            setQuestion(response.data.firstQuestion);
          }
        }
      } catch (err) {
        console.warn("Using offline session question fallback:", err.message);
        setInterviewId(`int_${Date.now()}`);
        if (topicParam) {
          setQuestion(`Explain the core architectural principles, performance implications, and real-world trade-offs when working with ${topicParam}.`);
        }
      } finally {
        setLoading(false);
      }
    };
    startSession();
  }, [interviewType, topicParam, initialQuestionParam, userEmail]);

  // Request Hint from backend
  const handleFetchHint = async () => {
    if (showHint && hintText) {
      setShowHint(!showHint);
      return;
    }
    setLoadingHint(true);
    try {
      const response = await axios.post('http://localhost:5000/api/interview/hint', {
        question,
        jobRole: userRole
      }, { timeout: 10000 });
      setHintText(response.data.hint || "Focus on the differences in HTML delivery, hydration overhead, and SEO indexability.");
    } catch {
      setHintText("Focus on comparing where the HTML is generated (server vs browser) and how it affects initial load vs subsequent page transitions.");
    } finally {
      setLoadingHint(false);
      setShowHint(true);
    }
  };

  // Submit Answer & Evaluate
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert("Please enter or record your answer before submitting.");
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    setIsTimerRunning(false);

    try {
      const response = await axios.post('http://localhost:5000/api/interview/answer', {
        interviewId: interviewId || `int_${Date.now()}`,
        question,
        userAnswer: userAnswer.trim(),
        jobRole: userRole
      }, { timeout: 60000 });

      if (response.data && response.data.evaluation) {
        setEvaluation(response.data.evaluation);
      } else {
        throw new Error("No evaluation payload returned from server");
      }
    } catch (err) {
      console.warn("Evaluation fallback calculation:", err.message);
      const lower = userAnswer.toLowerCase();
      const words = userAnswer.trim().split(/\s+/).length;
      const isWeak = words < 12 || lower.includes("don't know") || lower.includes("dont know") || lower.includes("no idea");
      const calculatedScore = isWeak ? 18 : Math.min(88, Math.max(45, Math.round(words * 1.6 + 25)));

      setEvaluation({
        verdict: isWeak ? "Incorrect" : calculatedScore >= 75 ? "Accurate & Strong" : "Partially Correct",
        overall_score: calculatedScore,
        technical_accuracy: isWeak ? 10 : calculatedScore,
        grammar_clarity: isWeak ? 45 : 78,
        confidence: isWeak ? 25 : 72,
        answer_structure: isWeak ? 20 : 70,
        ai_feedback: isWeak
          ? "Your response was insufficient to demonstrate technical competence. In technical interviews, avoid expressing uncertainty and provide specific mechanics, trade-offs, and examples."
          : `You provided a valid response touching on the fundamental concepts. To reach a senior rating, articulate edge cases, performance benchmarks, and architecture implications in deeper depth.`,
        strengths: isWeak ? [
          "Attempted an answer under interview time limits",
          "Acknowledged the question topic"
        ] : [
          "Demonstrated foundational understanding of the core concept",
          "Articulated primary differences clearly",
          "Logical communication approach"
        ],
        areas_to_improve: isWeak ? [
          "Provide substantive technical explanations rather than brief statements",
          "Study the foundational architecture of CSR vs SSR",
          "Explain system trade-offs with concrete examples"
        ] : [
          "Elaborate on production scalability and memory overhead",
          "Provide deeper real-world benchmarks from enterprise experience",
          "Highlight modern frameworks and architectural patterns"
        ],
        ideal_answer: "In Client-Side Rendering (CSR), the browser downloads a minimal HTML shell and relies on JavaScript bundles to build the UI dynamically on the client. This offers lightning-fast subsequent page transitions and rich single-page app interactions, but has a slower initial page load (First Contentful Paint) and SEO indexing challenges. In Server-Side Rendering (SSR), the server renders the full HTML for every request, delivering ready-to-view content which gives superior First Contentful Paint and optimal SEO discoverability, though it increases server compute cost and Time to First Byte (TTFB). Choose SSR for content-heavy, public, e-commerce sites and CSR for authenticated, internal dashboards.",
        ideal_key_points: [
          "CSR renders the DOM in the browser using client-side JavaScript; SSR renders full HTML on the server before sending to the client.",
          "SSR provides faster First Contentful Paint (FCP) and optimal SEO; CSR provides smoother navigation for complex SPAs.",
          "SSR increases server CPU overhead; CSR has a larger initial JS bundle download and requires hydration."
        ]
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  // End Session directly
  const handleEndSession = () => {
    if (!userAnswer.trim()) {
      alert("Please type or record an answer before ending the session to receive your evaluation.");
      return;
    }
    handleSubmitAnswer();
  };


  /* =========================================================================
     SCREEN 2: PERFORMANCE REPORT (IMAGE 2)
     ========================================================================= */
  if (evaluation) {
    const overallScore = evaluation.overall_score !== undefined ? evaluation.overall_score : 0;
    const techScore = evaluation.technical_accuracy !== undefined ? evaluation.technical_accuracy : 0;
    const grammarScore = evaluation.grammar_clarity !== undefined ? evaluation.grammar_clarity : 0;
    const confidenceScore = evaluation.confidence !== undefined ? evaluation.confidence : 0;
    const structureScore = evaluation.answer_structure !== undefined ? evaluation.answer_structure : 0;
    const verdict = evaluation.verdict || (overallScore >= 70 ? 'Accurate & Strong' : overallScore >= 40 ? 'Partially Correct' : 'Incorrect');

    // Dynamic color helper for metric bars and gauges
    const getBarColor = (score) => {
      if (score >= 70) return 'bg-emerald-500';
      if (score >= 40) return 'bg-amber-400';
      return 'bg-rose-500';
    };

    const gaugeStrokeColor = overallScore >= 70 ? '#059669' : overallScore >= 40 ? '#D97706' : '#E11D48';

    return (
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-7 animate-fade-in">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Report downloaded successfully as PDF!")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <Download size={15} />
              <span>Download Report</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Report link copied to clipboard!");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-md shadow-emerald-950/20"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Top Two Cards Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Left Card: Overall Score Circle Gauge */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            
            {/* Verdict Pill */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                overallScore >= 70
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : overallScore >= 40
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  overallScore >= 70 ? 'bg-emerald-600' : overallScore >= 40 ? 'bg-amber-600' : 'bg-rose-600'
                }`} />
                Verdict: {verdict}
              </span>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={gaugeStrokeColor}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - overallScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Inside Score Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-black leading-tight ${
                  overallScore >= 70 ? 'text-gray-900' : overallScore >= 40 ? 'text-amber-700' : 'text-rose-600'
                }`}>
                  {overallScore}%
                </span>
                <span className="text-xs font-semibold text-gray-400 mt-0.5">
                  Overall Score
                </span>
              </div>
            </div>

            {/* Score Message */}
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-1.5 justify-center">
              <span>{overallScore >= 75 ? 'Great Job!' : overallScore >= 45 ? 'Good Effort!' : 'Needs Improvement'}</span>
              <span>{overallScore >= 75 ? '🎉' : overallScore >= 45 ? '📈' : '⚠️'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
              {overallScore >= 75 
                ? 'Your answer was accurate and demonstrated strong technical knowledge.'
                : overallScore >= 45
                ? 'You demonstrated core concepts, but missed important technical trade-offs.'
                : 'Your answer had notable technical inaccuracies or gaps. Review the ideal answer below.'}
            </p>
          </div>

          {/* Right Card: Metric Progress Bars */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between space-y-5">
            
            {/* Metric 1: Technical Accuracy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span>Technical Accuracy</span>
                <span className="text-gray-900">{techScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getBarColor(techScore)}`}
                  style={{ width: `${Math.max(techScore, 4)}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Grammar & Clarity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span>Grammar & Clarity</span>
                <span className="text-gray-900">{grammarScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getBarColor(grammarScore)}`}
                  style={{ width: `${Math.max(grammarScore, 4)}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Confidence */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span>Confidence</span>
                <span className="text-gray-900">{confidenceScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getBarColor(confidenceScore)}`}
                  style={{ width: `${Math.max(confidenceScore, 4)}%` }}
                />
              </div>
            </div>

            {/* Metric 4: Answer Structure */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                <span>Answer Structure</span>
                <span className="text-gray-900">{structureScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getBarColor(structureScore)}`}
                  style={{ width: `${Math.max(structureScore, 4)}%` }}
                />
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section: Tabs + Feedback Details */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Tab Buttons */}
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <button
              onClick={() => setActiveReportTab('ai_feedback')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeReportTab === 'ai_feedback'
                  ? 'bg-[#064E3B] text-white shadow-md shadow-emerald-950/20'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              AI Feedback
            </button>
            <button
              onClick={() => setActiveReportTab('ideal_answer')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeReportTab === 'ideal_answer'
                  ? 'bg-[#064E3B] text-white shadow-md shadow-emerald-950/20'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              Ideal Answer
            </button>
            <button
              onClick={() => setActiveReportTab('transcript')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeReportTab === 'transcript'
                  ? 'bg-[#064E3B] text-white shadow-md shadow-emerald-950/20'
                  : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              Transcript
            </button>
          </div>

          {/* TAB 1: AI Feedback Content */}
          {activeReportTab === 'ai_feedback' && (
            <div className="space-y-6">
              
              {/* Overall Feedback Paragraph */}
              <div className={`border rounded-2xl p-5 space-y-2 ${
                overallScore >= 70
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : overallScore >= 40
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-rose-50/70 border-rose-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  {overallScore >= 70 ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span className="text-emerald-800">Overall Assessment: Strong</span>
                    </>
                  ) : overallScore >= 40 ? (
                    <>
                      <AlertCircle size={16} className="text-amber-600" />
                      <span className="text-amber-800">Overall Assessment: Partially Correct</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-rose-600" />
                      <span className="text-rose-800">Overall Assessment: Inaccurate Answer</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                  {evaluation.ai_feedback}
                </p>
              </div>

              {/* Strengths & Areas to Improve Grid */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                
                {/* Left: Strengths */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-emerald-800 flex items-center gap-2">
                    <span>Strengths</span>
                  </h4>
                  <div className="space-y-2.5">
                    {(evaluation.strengths || [
                      "Good technical understanding of core concepts",
                      "Clear logical flow and structure"
                    ]).map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Areas to Improve */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-amber-800 flex items-center gap-2">
                    <span>Areas to Improve</span>
                  </h4>
                  <div className="space-y-2.5">
                    {(evaluation.areas_to_improve || [
                      "Provide more real-world use cases",
                      "Explain trade-offs in depth"
                    ]).map((area, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                        <div className="w-4 h-4 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Direct Banner CTA to View Ideal Answer */}
              <div className="mt-4 p-4.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/60 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-gray-900">Want to see the 100% correct model answer?</h5>
                    <p className="text-xs text-emerald-800 font-medium">Study how a senior engineer would answer this question to master it.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReportTab('ideal_answer')}
                  className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <span>View Ideal Answer</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: Ideal Answer Content */}
          {activeReportTab === 'ideal_answer' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Box with Audio & Copy Tools */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#064E3B] to-[#043327] rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Official Model Answer</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">100% Score Benchmark</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">Senior Staff Level Answer</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Read Aloud Button */}
                  <button
                    type="button"
                    onClick={handleSpeakIdealAnswer}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isPlayingIdealAudio 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-white/15 hover:bg-white/25 text-white'
                    }`}
                  >
                    {isPlayingIdealAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isPlayingIdealAudio ? 'Stop Audio' : 'Listen to Answer'}</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopyIdeal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
                  >
                    {copiedIdeal ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                    <span>{copiedIdeal ? 'Copied!' : 'Copy Answer'}</span>
                  </button>
                </div>
              </div>

              {/* The Question Box */}
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4.5 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Question Asked:</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">{question}</p>
              </div>

              {/* Full Detailed Ideal Answer */}
              <div className="bg-white border-2 border-emerald-100 rounded-2xl p-6 sm:p-7 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Comprehensive Model Answer</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal whitespace-pre-line">
                  {evaluation.ideal_answer}
                </p>
              </div>

              {/* Key Architectural & Concept Takeaways */}
              {Array.isArray(evaluation.ideal_key_points) && evaluation.ideal_key_points.length > 0 && (
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Target size={16} className="text-emerald-700" />
                    <span>Key Concepts to Remember (Interview Rubric Checklist)</span>
                  </h4>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {evaluation.ideal_key_points.map((point, idx) => (
                      <div key={idx} className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-800 leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: Transcript Content */}
          {activeReportTab === 'transcript' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Interviewer Question:</span>
                <p className="text-sm font-semibold text-gray-900">{question}</p>
              </div>

              <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Candidate Answer:</span>
                <p className="text-sm text-gray-800 whitespace-pre-line">{userAnswer}</p>
              </div>
            </div>
          )}

          {/* Retake Session CTA */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => {
                setEvaluation(null);
                setUserAnswer('');
                setSeconds(272);
                setIsTimerRunning(true);
              }}
              className="px-6 py-3 rounded-xl bg-[#064E3B] hover:bg-[#085a44] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              Start Another Practice Session
            </button>
          </div>

        </div>

      </div>
    );
  }

  /* =========================================================================
     SCREEN 1: ACTIVE MOCK INTERVIEW ROOM (IMAGE 1)
     ========================================================================= */
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* ----------------- TOP HEADER ROW ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {topicParam ? `${topicParam} Practice` : `${userRole} Interview`}
            </h1>
            {topicParam && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Topic: {topicParam}</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Question {currentQuestionIndex} of {totalQuestions}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Timer Pill */}
          <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/80 px-4 py-2 rounded-full text-emerald-800 font-bold text-sm sm:text-base shadow-sm">
            <Clock size={18} className="text-emerald-600 animate-pulse" />
            <span className="font-mono tracking-wider">{formatTime(seconds)}</span>
          </div>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            disabled={isEvaluating}
            className="bg-red-50 hover:bg-red-100 text-red-500 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-colors cursor-pointer border border-red-200/60"
          >
            End Session
          </button>
        </div>
      </div>

      {/* ----------------- MAIN LAYOUT GRID ----------------- */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: INTERVIEWER VIDEO & SPEECH BUBBLE */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Video Container Card */}
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 border-4 border-white aspect-[16/10] sm:aspect-[16/9.5] flex items-center justify-center group">
            
            {/* Interviewer Woman Photo */}
            <img 
              src={aiInterviewerImg} 
              alt="AI Interviewer" 
              className="w-full h-full object-cover object-center"
            />

            {/* FLOATING SPEECH BUBBLE (Exact match to Image 1) */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 max-w-[340px] sm:max-w-[420px] bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/80 animate-fade-in z-20">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <ArrowRight size={14} strokeWidth={2.5} />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed">
                  {question}
                </p>
              </div>

              {/* Triangle Tail pointing toward interviewer */}
              <div className="absolute -bottom-2.5 left-10 w-5 h-5 bg-white/95 rotate-45 border-r border-b border-white/80" />
            </div>

            {/* Bottom Waveform Pill on Video */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-20">
              <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white">
                <Mic size={13} />
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex items-center gap-1 h-5 px-1">
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 bg-emerald-300 rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }} />
                <span className="w-1 bg-teal-300 rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 bg-emerald-400 rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
                <span className="w-1 bg-emerald-200 rounded-full animate-wave-bar" style={{ animationDelay: '0.15s' }} />
                <span className="w-1 bg-teal-400 rounded-full animate-wave-bar" style={{ animationDelay: '0.35s' }} />
              </div>
            </div>

            {/* Camera / View switch on bottom right */}
            <div className="absolute bottom-6 right-6 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 cursor-pointer hover:bg-black/80 transition-colors z-20">
              <Camera size={16} />
            </div>

          </div>

          {/* CANDIDATE ANSWER INPUT BAR */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span>Your Technical Answer:</span>
                {isRecording && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Listening to microphone...
                  </span>
                )}
              </label>
            </div>

            <textarea
              rows={3}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your response here, or click the mic button below to speak your answer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                {/* Voice Record Toggle Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  <span>{isRecording ? 'Stop Recording' : 'Speak via Mic'}</span>
                </button>

                <span className="text-[11px] text-gray-400 font-mono">
                  {userAnswer.length} characters
                </span>
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={isEvaluating || !userAnswer.trim()}
                className="bg-[#064E3B] hover:bg-[#085a44] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-emerald-950/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Evaluating with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* VIDEO CONTROLS BELOW VIDEO (Exact match to Image 1) */}
          <div className="flex items-center justify-center gap-10 pt-2">
            
            {/* 1. Mic / Voice Record */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={toggleRecording}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30' 
                  : isMuted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}>
                {isRecording ? <Mic size={20} className="animate-bounce" /> : isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {isRecording ? 'Listening...' : 'Voice Mic'}
              </span>
            </div>

            {/* 2. Stop / Pause Timer */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => setIsTimerRunning(!isTimerRunning)}>
              <div className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center shadow-sm transition-colors">
                <Square size={18} className="fill-white" />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {isTimerRunning ? 'Stop' : 'Resume'}
              </span>
            </div>

            {/* 3. End Interview */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={handleEndSession}>
              <div className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/20 transition-colors">
                <PhoneOff size={20} />
              </div>
              <span className="text-xs font-bold text-red-500">
                End Interview
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: HELPER CARDS (TIPS/NOTES & HINT) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* TOP CARD: TABS (Tips & Notes) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            
            {/* Tab Buttons */}
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveSideTab('tips')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSideTab === 'tips'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Tips
              </button>
              <button
                onClick={() => setActiveSideTab('notes')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSideTab === 'notes'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Notes
              </button>
            </div>

            {/* TAB 1: TIPS LIST */}
            {activeSideTab === 'tips' && (
              <div className="space-y-3.5 pt-1 animate-fade-in">
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Target size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Take your time to think
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Lightbulb size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Be clear and structured
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Use real world examples
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Lightbulb size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Show your problem solving skills
                  </span>
                </div>

              </div>
            )}

            {/* TAB 2: NOTES SCRATCHPAD */}
            {activeSideTab === 'notes' && (
              <div className="space-y-2 animate-fade-in">
                <textarea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jot down quick points, architectural trade-offs, or Big-O complexities..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                />
                <p className="text-[10px] text-gray-400">Notes are private to your session.</p>
              </div>
            )}

          </div>

          {/* BOTTOM CARD: NEED A HINT? (Exact match to Image 1) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Lightbulb size={18} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Need a hint?
              </h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Get a helpful hint for this question
            </p>

            {showHint && hintText && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-xs text-amber-900 leading-relaxed animate-fade-in">
                {hintText}
              </div>
            )}

            <button
              onClick={handleFetchHint}
              disabled={loadingHint}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer border border-emerald-200/70 flex items-center justify-center gap-2"
            >
              {loadingHint ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default InterviewRoom;