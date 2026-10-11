// src/components/AssessmentRunner.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  RotateCcw,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AssessmentRunner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // In seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // 1. Fetch Assessment
  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/assessments/${id}`);
      if (res.data && res.data.assessment) {
        setAssessment(res.data.assessment);
        setTimeLeft((res.data.assessment.durationMinutes || 15) * 60);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Timer Countdown
  useEffect(() => {
    if (!assessment || submissionResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, submissionResult]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  // 3. Submit Answers
  const handleSubmitAnswers = async () => {
    if (isSubmitting || submissionResult) return;
    setIsSubmitting(true);
    setConfirmSubmitOpen(false);

    try {
      const email = user?.email || 'imashasamodee@gmail.com';
      const name = user?.name || 'Imasha Samodee';

      const res = await axios.post(`http://localhost:5000/api/assessments/${id}/submit`, {
        email,
        name,
        answers
      });

      setSubmissionResult(res.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to submit assessment. Please check network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-500">Preparing examination environment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-black text-gray-950">Assessment Not Found</h3>
        <Link to="/assessments" className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeLeft < 120; // Under 2 mins

  // ------------------------- RESULTS SCREEN -------------------------
  if (submissionResult) {
    const passed = submissionResult.passed;
    const score = submissionResult.score;

    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in font-sans">
        
        {/* Result Banner */}
        <div className={`p-8 sm:p-10 rounded-3xl border text-center space-y-4 shadow-xl ${
          passed 
            ? 'bg-gradient-to-b from-emerald-900 to-teal-950 text-white border-emerald-500' 
            : 'bg-white text-gray-900 border-gray-200'
        }`}>
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-md ${
            passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30' : 'bg-rose-50 text-rose-600'
          }`}>
            {passed ? <Award size={44} /> : <XCircle size={44} />}
          </div>

          <div className="space-y-1">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
              passed ? 'text-emerald-300' : 'text-rose-600'
            }`}>
              {passed ? 'EXAMINATION PASSED • CREDENTIAL ISSUED' : 'ASSESSMENT RESULT • PASS MARK NOT MET'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {passed ? 'Congratulations, You Are Certified!' : 'Keep Practicing to Earn Your Certificate'}
            </h1>
          </div>

          {/* Score Stats Row */}
          <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/10 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-300 block">Your Score</span>
              <strong className="text-2xl font-black">{score}%</strong>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-300 block">Required Pass Mark</span>
              <strong className="text-2xl font-black">{submissionResult.passMark}%</strong>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-300 block">Correct Items</span>
              <strong className="text-2xl font-black">{submissionResult.correctCount} / {submissionResult.totalQuestions}</strong>
            </div>
          </div>

          {/* Next Steps Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {passed && submissionResult.newCertificate ? (
              <>
                <Link
                  to={`/certificates/${submissionResult.newCertificate.id || submissionResult.newCertificate.certificateId}`}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm flex items-center gap-2 transition-all shadow-md"
                >
                  <Award size={16} />
                  <span>View Your New Certificate</span>
                  <ArrowRight size={16} />
                </Link>

                <a
                  href={`http://localhost:5000/api/certificates/${submissionResult.newCertificate.id || submissionResult.newCertificate.certificateId}/pdf?email=${encodeURIComponent(user?.email || 'imashasamodee@gmail.com')}&name=${encodeURIComponent(submissionResult.newCertificate.userName || user?.name || 'Imasha Samodee')}`}
                  download
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition-all"
                >
                  <Download size={16} />
                  <span>Download Official PDF</span>
                </a>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSubmissionResult(null);
                  setAnswers({});
                  setTimeLeft((assessment.durationMinutes || 15) * 60);
                  setCurrentIdx(0);
                }}
                className="px-6 py-3 rounded-xl bg-[#064E3B] text-white font-black text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RotateCcw size={16} />
                <span>Retake Assessment</span>
              </button>
            )}

            <Link
              to="/certificates"
              className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-all"
            >
              Return to Certificates Dashboard
            </Link>
          </div>
        </div>

        {/* Detailed Question Explanations Breakdown */}
        {submissionResult.breakdown && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-150 pb-4">
              <h2 className="text-xl font-black text-gray-950">
                Detailed Examination Breakdown & Explanations
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Review your selections against the official answer keys and technical rationales.
              </p>
            </div>

            <div className="space-y-6">
              {submissionResult.breakdown.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    item.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gray-500">Question {idx + 1}</span>
                    <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      item.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {item.isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      <span>{item.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}</span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-gray-950">
                    {item.question}
                  </h3>

                  <div className="text-xs sm:text-sm space-y-1">
                    <div>
                      <span className="text-gray-500">Your Answer: </span>
                      <strong className={item.isCorrect ? 'text-emerald-800' : 'text-rose-800'}>
                        {item.candidateAnswer}
                      </strong>
                    </div>
                    {!item.isCorrect && (
                      <div>
                        <span className="text-gray-500">Correct Answer: </span>
                        <strong className="text-emerald-800">{item.correctAnswer}</strong>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-gray-200/80 text-xs text-gray-700 leading-relaxed font-normal">
                    <strong>Technical Explanation:</strong> {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // ------------------------- ACTIVE TEST RUNNER -------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
      
      {/* Top Test Header (Timer & Progress) */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-2xs py-3.5 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-black text-gray-950 truncate max-w-[200px] sm:max-w-md">
              {assessment.title}
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">•</span>
            <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
              Pass Mark: {assessment.passMark}%
            </span>
          </div>

          {/* Clock Timer */}
          <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 font-mono text-xs sm:text-sm font-bold shadow-2xs ${
            isTimeCritical 
              ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' 
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}>
            <Clock size={15} />
            <span>{formatTime(timeLeft)} remaining</span>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Question Palette Navigation Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentIdx === idx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#064E3B] text-white shadow-xs scale-105'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-gray-500 font-medium shrink-0">
            {answeredCount} of {totalQuestions} Answered
          </div>
        </div>

        {/* Active Question Card */}
        {currentQ && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span className="text-xs text-gray-400 font-medium">Single Choice</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-gray-950 tracking-tight leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-600 shadow-2xs ring-1 ring-emerald-600'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {letter}
                    </span>

                    <span className="text-xs sm:text-base text-gray-900 leading-relaxed font-normal pt-0.5">
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-6 border-t border-gray-150 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2.5 rounded-xl border border-gray-250 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {currentIdx < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Next Item</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmSubmitOpen(true)}
                    className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Check size={16} />
                    <span>Submit Examination</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-xl font-black text-gray-950">
              Submit Examination for Grading?
            </h3>
            
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions. Once submitted, your answers will be graded by the server and certificates issued if you meet the {assessment.passMark}% pass mark.
            </p>

            {answeredCount < totalQuestions && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
                <AlertTriangle size={16} className="text-amber-700 shrink-0" />
                <span>Warning: Unanswered questions will receive 0 marks.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Return to Review
              </button>

              <button
                type="button"
                onClick={handleSubmitAnswers}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-black shadow-md flex items-center gap-1.5"
              >
                {isSubmitting ? 'Grading Answers...' : 'Confirm & Grade'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AssessmentRunner;
