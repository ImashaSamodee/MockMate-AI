// src/components/ArticleWidgets.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ExternalLink, 
  Bookmark, 
  Award, 
  Play, 
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  Code
} from 'lucide-react';

/* =========================================================================
   1. INTRO PRACTICE EDITOR (How to Answer "Tell Me About Yourself")
   ========================================================================= */
export const IntroPracticeEditor = () => {
  const navigate = useNavigate();
  const presets = {
    student: `"I am currently a student at the Institute of Technology University of Moratuwa, focusing on full-stack web development. I have been spending a lot of my time mastering React and Node.js. 

Recently, I built a web application as an academic project, which really helped me understand how to connect a frontend to a database and handle user authentication. Before that, I focused on strengthening my programming basics using Java and building responsive user interfaces. 

What excites me most about this opportunity at your company is the chance to apply what I have learned in a real-world environment. I am looking for an internship where I can contribute to actual products while learning from experienced developers."`,
    experienced: `"I'm currently a Full Stack Software Engineer at TechCorp, where I specialize in building high-performance web systems using React, TypeScript, and Node.js. 

Most recently, I led the architectural overhaul of our customer dashboard to React 19, which reduced initial page load times by 35% across 50,000 active users. Before that, I spent two years designing distributed microservices and asynchronous API pipelines in PostgreSQL. 

What excites me most about this opportunity at your company is your engineering roadmap around AI developer tools, where my background in real-time interfaces and backend scalability can make an immediate, tangible impact."`
  };

  const [text, setText] = useState(presets.student);
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Average speaking pace in an interview is ~130 words per minute
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  const getPaceStatus = () => {
    if (wordCount === 0) return { label: 'Empty', color: 'text-gray-400', bar: 'bg-gray-200', pct: 0 };
    if (estimatedSeconds < 45) return { label: 'Too Short (<45s)', color: 'text-amber-700', bar: 'bg-amber-400', pct: Math.min((estimatedSeconds / 90) * 100, 100) };
    if (estimatedSeconds <= 95) return { label: 'Optimal 90-Second Window', color: 'text-emerald-700', bar: 'bg-emerald-500', pct: Math.min((estimatedSeconds / 90) * 100, 100) };
    return { label: 'Over 90s — Trim Details', color: 'text-rose-700', bar: 'bg-rose-500', pct: 100 };
  };

  const status = getPaceStatus();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
            Interactive Practice Studio
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
            Write & Time Your 90-Second Introduction
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Craft your pitch and verify that it falls into the proven 60–90 second interview delivery window.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setText(presets.student)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-800 transition-all cursor-pointer shadow-2xs"
          >
            Load Student Preset
          </button>
          <button
            type="button"
            onClick={() => setText(presets.experienced)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:text-emerald-800 transition-all cursor-pointer shadow-2xs"
          >
            Load Engineer Preset
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your introduction following Present (30s) -> Past (30s) -> Future (30s)..."
          className="w-full rounded-2xl border border-gray-250 bg-white p-4 sm:p-5 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-inner font-sans leading-relaxed resize-y"
        />
      </div>

      {/* Live Speaking Time Meter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={16} className="text-emerald-700" />
            <span>Speaking Pace: <strong className={status.color}>{status.label}</strong></span>
          </div>
          <div className="text-gray-500 font-mono">
            {wordCount} words • ~{estimatedSeconds}s / 90s target
          </div>
        </div>

        <div className="w-full h-2.5 bg-gray-150 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 rounded-full ${status.bar}`}
            style={{ width: `${status.pct}%` }}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs sm:text-sm font-bold text-gray-700 hover:text-emerald-800 bg-white px-4 py-2 rounded-xl border border-gray-250 hover:border-emerald-300 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Introduction'}</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/interview')}
          className="text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
        >
          <Sparkles size={15} />
          <span>Practice Speaking in AI Interview</span>
        </button>
      </div>
    </div>
  );
};


/* =========================================================================
   2. TOP 10 REACT ACCORDION (Top 10 React Interview Questions)
   ========================================================================= */
export const ReactQuestionsAccordion = () => {
  const questions = [
    {
      q: '1. How Does the Virtual DOM & React Fiber Reconciliation Work?',
      difficulty: 'Mid-Senior',
      tag: 'Architecture',
      answer: `React maintains a lightweight in-memory representation of the browser DOM known as the Virtual DOM. When state changes, React compares the new tree with the previous snapshot through a diffing heuristic.
In React 16+, this is powered by the Fiber engine. Fiber splits rendering into:
• Phase 1 (Render Phase): Asynchronous, cooperative scheduling that can pause diffing if high-priority user input or animations occur.
• Phase 2 (Commit Phase): Synchronous execution that applies all calculated DOM mutations in a single batch to avoid layout tearing.`,
      code: `// Fiber splits execution into interruptible units (fibers):
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}`
    },
    {
      q: '2. What is the Difference Between useMemo and useCallback?',
      difficulty: 'Junior-Mid',
      tag: 'Hooks',
      answer: `Both are memoization tools to avoid unnecessary recalculations:
• useMemo: Caches the calculated RESULT of an expensive function. It re-computes only when dependencies change.
• useCallback: Caches the FUNCTION INSTANCE itself across renders to preserve referential equality when passing callbacks to memoized children (React.memo).`,
      code: `// useMemo caches value:
const filteredData = useMemo(() => computeHeavyFilter(items), [items]);

// useCallback caches function reference:
const handleClick = useCallback((id) => sendAnalytics(id), []);`
    },
    {
      q: '3. React Server Components (RSC) vs Client Components',
      difficulty: 'Senior',
      tag: 'React 19',
      answer: `React Server Components execute strictly on the server and ship ZERO JavaScript bundle to the browser. They can directly query databases, read disk files, and access secret API tokens.
Client Components use the 'use client' directive and run in the browser to provide interactivity (useState, useEffect, event listeners).`,
      code: `// Server Component: direct DB access, 0kB bundle
import db from '@/lib/db';
export default async function UserList() {
  const users = await db.query('SELECT * FROM users');
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`
    },
    {
      q: '4. Why is Using Array Index as Key an Anti-Pattern in Lists?',
      difficulty: 'Junior',
      tag: 'Fundamentals',
      answer: `Keys give elements a stable identity between renders. If you use index as a key and delete, reorder, or prepend items:
1. The keys no longer point to the original items.
2. React reuses component state for the wrong element, resulting in UI glitches (e.g. checked checkboxes persisting on the wrong row) and inefficient DOM rebuilding.`,
      code: `// BAD:
items.map((item, idx) => <ListItem key={idx} {...item} />);

// GOOD:
items.map(item => <ListItem key={item.id} {...item} />);`
    },
    {
      q: '5. How Do You Prevent Stale Closures in useEffect?',
      difficulty: 'Mid-Level',
      tag: 'Hooks',
      answer: `A stale closure occurs when an effect callback captures a state variable from an earlier render without listing it in the dependency array.
Fixes:
1. Include all referenced state/props in the dependency array.
2. Use functional state updates: setState(prev => prev + 1) instead of setState(count + 1).
3. Use a useRef to hold mutable latest values if you must avoid re-triggering the effect.`,
      code: `// Prevents stale closure without re-running interval:
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // Always reads freshest state
  }, 1000);
  return () => clearInterval(timer);
}, []);`
    },
    {
      q: '6. When Should You Build a Custom Hook?',
      difficulty: 'Mid-Level',
      tag: 'Clean Code',
      answer: `Build a custom hook whenever you want to extract stateful business logic from your UI components so it can be reused, tested in isolation, or simplified.
Custom hooks must start with "use" and adhere to the standard Rules of Hooks.`,
      code: `function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}`
    },
    {
      q: '7. What Are React 19 Server Actions and useOptimistic?',
      difficulty: 'Senior',
      tag: 'React 19',
      answer: `Server Actions allow async functions to run directly on the server when invoked from form submissions or event handlers on the client.
useOptimistic allows you to immediately update the client UI with the expected result while the server action is still in flight, rolling back automatically if the server errors.`,
      code: `'use client';
import { useOptimistic } from 'react';

function LikeButton({ initialLikes, onLike }) {
  const [likes, setOptimisticLikes] = useOptimistic(
    initialLikes,
    (current, update) => current + update
  );
  // Updates UI instantaneously!
}`
    },
    {
      q: '8. Controlled vs Uncontrolled Components',
      difficulty: 'Junior',
      tag: 'Forms',
      answer: `• Controlled: The form input value is driven directly by React state (value={text} onChange={e => setText(e.target.value)}). React is the single source of truth.
• Uncontrolled: The form element maintains its own internal DOM state. You access values using a React ref (inputRef.current.value) upon submit.`,
      code: `// Controlled:
<input value={query} onChange={e => setQuery(e.target.value)} />

// Uncontrolled:
<input ref={inputRef} defaultValue="Hello" />`
    },
    {
      q: '9. React Context API vs Zustand vs Redux',
      difficulty: 'Mid-Senior',
      tag: 'State Management',
      answer: `• Context API: Built-in, ideal for low-frequency global state (theme, user auth). Lacks selective subscription, so any state change re-renders all consumers.
• Zustand: Lightweight, hook-based, supports selector subscriptions (only re-renders component when selected slice changes), minimal boilerplate.
• Redux Toolkit: Best for complex enterprise apps with large engineering teams requiring strict action contracts and time-travel debugging.`,
      code: `// Zustand selector: only re-renders if user.role changes:
const role = useUserStore(state => state.user.role);`
    },
    {
      q: '10. How Does React Automatic Batching Work in React 18 & 19?',
      difficulty: 'Mid-Senior',
      tag: 'Performance',
      answer: `In React 17 and earlier, React only batched updates inside React event handlers. Updates inside setTimeout, promises, or fetch callbacks caused multiple separate renders.
In React 18 & 19, automatic batching groups ALL state updates into a single render pass regardless of where they originate.`,
      code: `// React 19 batches both updates into 1 render:
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 100);`
    }
  ];

  const [expanded, setExpanded] = useState({ 0: true, 1: true });
  const [copiedIdx, setCopiedIdx] = useState(null);

  const toggle = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAll = () => {
    const all = {};
    questions.forEach((_, idx) => (all[idx] = true));
    setExpanded(all);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-150 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Interactive Question Bank
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
            10 Deep-Dive React Interview Answers
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Expand questions to inspect technical explanations, engine mechanics, and clean code examples.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-all cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-all cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {questions.map((item, idx) => {
          const isOpen = !!expanded[idx];
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-emerald-200/90 bg-emerald-50/15 shadow-2xs' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                    item.difficulty === 'Junior' ? 'bg-blue-100 text-blue-800' :
                    item.difficulty === 'Senior' ? 'bg-purple-100 text-purple-800' :
                    'bg-emerald-100 text-emerald-900'
                  }`}>
                    {item.difficulty}
                  </span>
                  <span className="font-extrabold text-sm sm:text-base text-gray-950">
                    {item.q}
                  </span>
                </div>
                <div className="text-gray-400 shrink-0">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-emerald-150/50">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line font-normal">
                    {item.answer}
                  </p>

                  {/* Code snippet block */}
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A]">
                    <div className="px-4 py-2 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono flex items-center gap-1.5 font-bold">
                        <Code size={12} /> Solution Snippet
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(item.code, idx)}
                        className="text-slate-300 hover:text-white flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                      >
                        {copiedIdx === idx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{item.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


/* =========================================================================
   3. STAR ANSWER BUILDER (Behavioral Questions Preparation Guide)
   ========================================================================= */
export const StarMethodBuilder = () => {
  const presets = {
    outage: {
      s: "During our Black Friday traffic spike, the authentication service experienced a Redis connection pool exhaustion, causing an 8% spike in login errors.",
      t: "As the on-call engineer, I was tasked with restoring full system availability within our 2-hour SLA without losing customer shopping carts.",
      a: "I spun up an APM trace, diagnosed the pool leak, deployed an exponential backoff with jitter, and enabled an in-memory circuit breaker fallback.",
      r: "Within 45 minutes, error rates dropped to 0.01%, protecting $40,000 in checkout revenue. I followed up by writing an automated connection alert."
    },
    conflict: {
      s: "Our team was divided on whether to migrate our dashboard from Redux Toolkit to Zustand, creating friction during sprint planning.",
      t: "As the lead frontend developer, I needed to achieve technical consensus quickly to avoid missing our quarterly release milestone.",
      a: "I built a time-boxed spike: prototyping the most complex view in both libraries and benchmarking bundle size, boilerplate lines, and developer ergonomics with empirical metrics.",
      r: "The team unanimously aligned on Zustand, reducing bundle size by 14kB and boosting development velocity by 20% with zero team friction."
    }
  };

  const [form, setForm] = useState(presets.outage);
  const [copied, setCopied] = useState(false);

  const mergedAnswer = `[Situation]: "${form.s}"\n[Task]: "${form.t}"\n[Action]: "${form.a}"\n[Result]: "${form.r}"`;

  const wordCount = mergedAnswer.trim().split(/\s+/).length;
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  const handleCopy = () => {
    navigator.clipboard.writeText(mergedAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-purple-200 bg-gradient-to-b from-purple-50/40 to-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-150 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
            Interactive STAR Studio
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
            Build Your Structured Behavioral Story
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Fill in the 4 steps to assemble a high-impact narrative that hiring managers look for.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setForm(presets.outage)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-purple-50 hover:text-purple-900 transition-all cursor-pointer shadow-2xs"
          >
            Load Outage Preset
          </button>
          <button
            type="button"
            onClick={() => setForm(presets.conflict)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-purple-50 hover:text-purple-900 transition-all cursor-pointer shadow-2xs"
          >
            Load Conflict Preset
          </button>
        </div>
      </div>

      {/* 4 Step Inputs */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-[11px]">S</span>
            Situation (15% - Context & Constraints)
          </label>
          <textarea
            rows={2}
            value={form.s}
            onChange={(e) => setForm({ ...form, s: e.target.value })}
            className="w-full rounded-xl border border-gray-250 bg-white p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-[11px]">T</span>
            Task (15% - Your Specific Responsibility)
          </label>
          <textarea
            rows={2}
            value={form.t}
            onChange={(e) => setForm({ ...form, t: e.target.value })}
            className="w-full rounded-xl border border-gray-250 bg-white p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-[11px]">A</span>
            Action (50% - Your Direct Technical Choices & Leadership)
          </label>
          <textarea
            rows={3}
            value={form.a}
            onChange={(e) => setForm({ ...form, a: e.target.value })}
            className="w-full rounded-xl border border-gray-250 bg-white p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-[11px]">R</span>
            Result (20% - Metrics, Impact, & Takeaway)
          </label>
          <textarea
            rows={2}
            value={form.r}
            onChange={(e) => setForm({ ...form, r: e.target.value })}
            className="w-full rounded-xl border border-gray-250 bg-white p-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Generated Preview */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 font-mono text-xs sm:text-sm">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
          <span>Merged Verbatim Script</span>
          <span>{wordCount} words (~{estimatedSeconds}s delivery)</span>
        </div>
        <div className="text-purple-200 whitespace-pre-line leading-relaxed">
          {mergedAnswer}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs sm:text-sm font-bold text-white bg-purple-800 hover:bg-purple-900 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied STAR Story!' : 'Copy Formatted STAR Script'}</span>
        </button>
      </div>
    </div>
  );
};


/* =========================================================================
   4. ATS CHECKLIST & SCANNER CTA (ATS Resume Formatting Secrets)
   ========================================================================= */
export const AtsChecklist = () => {
  const navigate = useNavigate();
  const [checks, setChecks] = useState({
    singleCol: true,
    standardHeaders: true,
    xyzBullets: true,
    pdfSelectable: true,
    noCanvaGraphics: true,
    keywordsMatch: false
  });

  const toggle = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const score = Math.round((checkedCount / 6) * 100);

  return (
    <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/40 to-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-blue-150 pb-5">
        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
          ATS Compliance Tool
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
          Interactive ATS Readiness Audit
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
          Tick the items that your resume adheres to and compute your automated screening pass probability.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {[
          { key: 'singleCol', label: 'Strict Single-Column Layout (No multi-column sidebars)' },
          { key: 'standardHeaders', label: 'Universal Headers (Experience, Education, Skills)' },
          { key: 'xyzBullets', label: 'Google XYZ Bullets ("Accomplished X by Y doing Z")' },
          { key: 'pdfSelectable', label: 'Text-Selectable PDF (Ctrl+A & copy works in Reader)' },
          { key: 'noCanvaGraphics', label: 'Zero Floating Canvas Elements, Tables, or Icon Bars' },
          { key: 'keywordsMatch', label: 'Core Job Description Keywords Mirrored in Bullet Points' }
        ].map((item) => (
          <div
            key={item.key}
            onClick={() => toggle(item.key)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              checks[item.key] ? 'bg-white border-blue-300 shadow-2xs' : 'bg-gray-50 border-gray-200 opacity-75'
            }`}
          >
            <input
              type="checkbox"
              checked={checks[item.key]}
              onChange={() => {}}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Score gauge banner */}
      <div className="p-5 rounded-2xl bg-white border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-blue-900">
            Current ATS Parsing Score
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-0.5">
            {score}% Readiness
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {score >= 80 ? '✅ High probability of passing Workday, Taleo, and Greenhouse' : '⚠️ Address unchecked items to avoid automatic ATS rejection'}
          </div>
        </div>

        <Link
          to="/resume"
          className="w-full sm:w-auto text-xs sm:text-sm font-black px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md flex items-center justify-center gap-2 text-center"
        >
          <FileText size={16} />
          <span>Upload to MockMate Resume Scanner</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};


/* =========================================================================
   5. SALARY NEGOTIATION SIMULATOR (Salary Negotiation Guide)
   ========================================================================= */
export const SalaryNegotiationSimulator = () => {
  const scenarios = [
    {
      id: 'phone-screen',
      title: 'Initial Screener: "What is your target salary?"',
      script: `"I'm primarily focused on finding the right role where I can deliver maximum engineering impact and grow with the team.\n\nAs I learn more about the scope and technical challenges of the position, I'm confident we can agree on a package that reflects fair market value for this level. Could you share the approved budget range for this position?"`,
      psychology: 'Deflects politely without being evasive. Forces the recruiter to reveal the company’s pre-approved pay band first.'
    },
    {
      id: 'verbal-offer',
      title: 'Verbal Offer Received on Call: "We’re offering $X"',
      script: `"Thank you so much! I'm genuinely excited about the team's mission and the chance to contribute to the product roadmap.\n\nI want to carefully review the complete benefits and compensation package with my family. Could you send over the written offer details? I will review and get back to you within 48 hours."`,
      psychology: 'Prevents premature acceptance under phone pressure. Buys 48 hours to research market percentiles and craft a collaborative written counter-offer.'
    },
    {
      id: 'counter-offer',
      title: 'Written Counter-Offer: Target Higher Base or Signing Bonus',
      script: `"Hi [Recruiter Name],\n\nThank you again for extending the offer to join [Company]! I am thrilled about the engineering challenges ahead.\n\nBased on my experience architecting scalable distributed systems and current market data for this tier in our region, I was targeting a base salary of $X [or a signing bonus of $Y]. If we can reach that figure, I am ready to sign the offer immediately."`,
      psychology: 'Shows high enthusiasm while linking the counter-offer directly to market data and your technical value. Offers an immediate signature incentive.'
    }
  ];

  const [activeScenario, setActiveScenario] = useState('phone-screen');
  const [copied, setCopied] = useState(false);

  const selected = scenarios.find(s => s.id === activeScenario);

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/40 to-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-amber-150 pb-5">
        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
          Negotiation Scenario Simulator
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
          Select Your Live Interview Scenario
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
          Pick the situation you are facing to retrieve tactical, verbatim scripts and psychological rationales.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => setActiveScenario(sc.id)}
            className={`text-xs sm:text-sm font-extrabold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeScenario === sc.id
                ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
            }`}
          >
            {sc.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Script Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 font-mono text-xs sm:text-sm shadow-md">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
          <span className="font-bold text-amber-400">{selected.title}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Script'}</span>
          </button>
        </div>
        <p className="whitespace-pre-line leading-relaxed text-amber-100 font-sans text-sm sm:text-base">
          {selected.script}
        </p>
      </div>

      {/* Psychology rationale */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950">
        <strong>Negotiation Psychology:</strong> {selected.psychology}
      </div>
    </div>
  );
};


/* =========================================================================
   6. SENIOR ASSESSMENT MATRIX (Junior to Senior Transition)
   ========================================================================= */
export const SeniorAssessmentMatrix = () => {
  const competencies = [
    { key: 'arch', label: 'Systems Thinking & RFC Writing (Trade-offs & Disaster Recovery)' },
    { key: 'autonomy', label: 'High Autonomy (Takes vague problem statements to production)' },
    { key: 'mentorship', label: 'Team Multiplier (Conducts teaching code reviews & mentors juniors)' },
    { key: 'observability', label: 'Production Ownership (APM alerts, distributed tracing, runbooks)' },
    { key: 'business', label: 'Business Alignment (Builds what drives user retention vs trendy tech)' }
  ];

  const [ratings, setRatings] = useState({
    arch: 3,
    autonomy: 4,
    mentorship: 3,
    observability: 2,
    business: 3
  });

  const totalScore = Object.values(ratings).reduce((a, b) => a + b, 0);
  const percentage = Math.round((totalScore / 25) * 100);

  const getLevel = () => {
    if (percentage < 55) return { title: 'Junior Engineer', color: 'text-blue-700', advice: 'Focus on shipping error-free code and understanding the whole system architecture.' };
    if (percentage < 80) return { title: 'Mid-Level Engineer', color: 'text-emerald-700', advice: 'Start proposing written design docs (RFCs) and taking on on-call incident ownership.' };
    return { title: 'Senior Engineer Ready', color: 'text-purple-700', advice: 'Ready for senior roles! Emphasize team multiplication, trade-offs, and mentoring in interviews.' };
  };

  const level = getLevel();

  return (
    <div className="rounded-3xl border border-rose-200 bg-gradient-to-b from-rose-50/40 to-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-rose-150 pb-5">
        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
          Senior Competency Matrix
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
          Assess Your Senior Readiness Level
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
          Rate yourself on the 5 pillars that differentiate junior execution from senior engineering leadership.
        </p>
      </div>

      <div className="space-y-4">
        {competencies.map((comp) => (
          <div key={comp.key} className="space-y-1.5 bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900">
              <span>{comp.label}</span>
              <span className="font-mono text-rose-700">Level {ratings[comp.key]} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={ratings[comp.key]}
              onChange={(e) => setRatings({ ...ratings, [comp.key]: parseInt(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Result Card */}
      <div className="p-5 rounded-2xl bg-white border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-rose-900">
            Readiness Assessment
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-0.5">
            {percentage}% — <span className={level.color}>{level.title}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 max-w-lg">
            {level.advice}
          </p>
        </div>

        <Link
          to="/interview"
          className="w-full sm:w-auto text-xs sm:text-sm font-black px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          <span>Test in Senior Mock Interview</span>
        </Link>
      </div>
    </div>
  );
};


/* =========================================================================
   7. SAVED QUESTIONS DECK (The 5 Questions You Must Ask Your Interviewer)
   ========================================================================= */
export const SaveSelectedQuestionsDeck = () => {
  const defaultQuestions = [
    {
      id: 'q1',
      title: 'DevOps & Deployment Velocity',
      text: '"What does the typical deployment pipeline look like from a merged PR to production, and how do you handle database rollbacks?"',
      signal: 'Shows you care about velocity, automated testing, and CI/CD discipline.'
    },
    {
      id: 'q2',
      title: 'Technical Debt Management',
      text: '"How does the team balance shipping new product features with paying down technical debt and refactoring?"',
      signal: 'Demonstrates senior understanding of long-term software lifecycle.'
    },
    {
      id: 'q3',
      title: 'Recent Architectural Hurdles',
      text: '"What is the most complex engineering challenge the team solved in the last six months, and what did you learn from it?"',
      signal: 'Displays genuine intellectual curiosity about their technology stack.'
    },
    {
      id: 'q4',
      title: 'Measuring Exceptional Performance',
      text: '"What separates a good engineer from a truly exceptional one on this team in their first six months?"',
      signal: 'Shows high personal ambition and results-oriented drive.'
    },
    {
      id: 'q5',
      title: 'Culture & Retention',
      text: '"What initially brought you to this company, and what has kept you engaged here?"',
      signal: 'Builds authentic personal rapport and emotional connection.'
    }
  ];

  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('mockmate_saved_interview_questions');
      return saved ? JSON.parse(saved) : ['q1', 'q2', 'q4'];
    } catch {
      return ['q1', 'q2', 'q4'];
    }
  });

  const [copied, setCopied] = useState(false);

  const toggle = (id) => {
    let next;
    if (savedIds.includes(id)) {
      next = savedIds.filter(i => i !== id);
    } else {
      next = [...savedIds, id];
    }
    setSavedIds(next);
    try {
      localStorage.setItem('mockmate_saved_interview_questions', JSON.stringify(next));
    } catch {}
  };

  const handleCopyDeck = () => {
    const selectedText = defaultQuestions
      .filter(q => savedIds.includes(q.id))
      .map((q, idx) => `${idx + 1}. ${q.text} (${q.title})`)
      .join('\n\n');

    navigator.clipboard.writeText(selectedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/40 to-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-150 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
            Interview Prep Deck
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
            Build Your Personal Closing Questions Deck
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Select the questions you want to ask in your upcoming interview and export them directly to your prep notes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyDeck}
          disabled={savedIds.length === 0}
          className="text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied Selected!' : `Copy ${savedIds.length} Saved Questions`}</span>
        </button>
      </div>

      {/* Question Selector List */}
      <div className="space-y-3.5">
        {defaultQuestions.map((q) => {
          const isSelected = savedIds.includes(q.id);
          return (
            <div
              key={q.id}
              onClick={() => toggle(q.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                isSelected ? 'bg-white border-emerald-300 shadow-2xs' : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="mt-1 w-4 h-4 rounded text-emerald-700 accent-emerald-700 cursor-pointer"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm sm:text-base text-gray-950">{q.title}</h4>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                    {isSelected ? 'Saved in Deck' : 'Click to Add'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 italic font-medium">
                  {q.text}
                </p>
                <p className="text-xs text-gray-500 pt-1">
                  <strong>Positive Signal:</strong> {q.signal}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


/* =========================================================================
   8. SYSTEM DESIGN PRACTICE (Mastering System Design)
   ========================================================================= */
export const SystemDesignPractice = () => {
  const problems = [
    {
      title: 'Design TinyURL / URL Shortener',
      scale: '100M writes/month, 10:1 Read ratio',
      difficulty: 'Intermediate',
      keyConcepts: 'Base62 Encoding, Redis Cache-Aside, DB Sharding'
    },
    {
      title: 'Design Twitter / X Real-Time Feed',
      scale: '300M DAU, Fanout-on-Write vs Fanout-on-Read',
      difficulty: 'Advanced',
      keyConcepts: 'Hybrid Fanout, Redis Timeline Clusters, Kafka'
    },
    {
      title: 'Design YouTube / Video Streaming Pipeline',
      scale: '500 hrs video uploaded/min, Multi-bitrate HLS/DASH',
      difficulty: 'Staff',
      keyConcepts: 'Chunking, Async Transcoding Workers, CDN Caching'
    },
    {
      title: 'Design Distributed Rate Limiter',
      scale: '1M requests/sec across 50 API nodes',
      difficulty: 'Mid-Senior',
      keyConcepts: 'Token Bucket, Redis Lua Scripts, Sliding Window Log'
    }
  ];

  return (
    <div className="rounded-3xl border border-teal-200 bg-gradient-to-b from-teal-50/40 to-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-teal-150 pb-5">
        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
          Architecture Practice Suite
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-2">
          High-Yield System Design Practice Problems
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
          Apply the 4-step framework (Scope &rarr; High-Level &rarr; Deep-Dive &rarr; Bottlenecks) to these real-world FAANG interview challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {problems.map((prob, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-teal-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                prob.difficulty === 'Staff' ? 'bg-purple-100 text-purple-900' :
                prob.difficulty === 'Advanced' ? 'bg-teal-100 text-teal-900' :
                'bg-blue-100 text-blue-900'
              }`}>
                {prob.difficulty}
              </span>
              <span className="text-xs text-gray-400 font-mono">Problem 0{idx + 1}</span>
            </div>

            <h4 className="font-extrabold text-base text-gray-950">{prob.title}</h4>
            
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Scale Target:</strong> {prob.scale}</div>
              <div><strong>Key Architectural Patterns:</strong> {prob.keyConcepts}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs sm:text-sm text-teal-950 flex items-center gap-3">
        <Calculator size={20} className="shrink-0 text-teal-800" />
        <div>
          <strong>Golden Capacity Rule:</strong> 1 Million requests per day = ~12 requests per second. Always multiply by 2-5x to calculate peak traffic buffer.
        </div>
      </div>
    </div>
  );
};
