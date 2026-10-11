import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  X, 
  Check, 
  Copy, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  TrendingUp, 
  RefreshCw, 
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'All',
  'General Tips',
  'Technical',
  'Behavioral',
  'Resume',
  'HR',
  'Career Growth'
];

const getCategoryBadgeStyle = (cat) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('general')) {
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }
  if (c.includes('technical')) {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
  if (c.includes('behavioral')) {
    return 'bg-purple-50 text-purple-800 border-purple-200';
  }
  if (c.includes('resume')) {
    return 'bg-blue-50 text-blue-800 border-blue-200';
  }
  if (c.includes('hr')) {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }
  if (c.includes('career')) {
    return 'bg-rose-50 text-rose-800 border-rose-200';
  }
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

// Comprehensive Local Fallback Data (100% matched to card titles with concise items)
const INITIAL_TIPS = [
  {
    id: 'tell-me-about-yourself',
    title: "How to Answer \"Tell Me About Yourself\"",
    category: 'General Tips',
    tag: 'General',
    readTime: '5 min read',
    image: '/tips/tell-me-about-yourself.jpg',
    summary: "Master the Present-Past-Future formula to deliver a clear, 90-second introduction that shows your potential, even if you don't have years of formal work experience.",
    difficulty: 'Beginner',
    formula: 'Part 1: Present (30s) → Part 2: Past (30s) → Part 3: Future (30s)',
    items: [
      {
        badge: 'PART 1',
        title: 'The Present (30 Seconds)',
        answer: 'State your university, your degree, and what programming languages or frameworks you are currently focusing on (e.g., React and Node.js).'
      },
      {
        badge: 'PART 2',
        title: 'The Past (30 Seconds)',
        answer: 'Talk about a recent academic project or personal project you built and what technical challenges you solved (e.g., frontend database connectivity, user auth).'
      },
      {
        badge: 'PART 3',
        title: 'The Future (30 Seconds)',
        answer: 'Explain why you want this specific internship or junior role and how you hope to contribute while learning from experienced developers.'
      },
      {
        badge: 'SCRIPT',
        title: 'Full Verbatim Model Script (University Student)',
        answer: '"I am currently a student at the Institute of Technology University of Moratuwa, focusing on full-stack web development. I have been spending a lot of my time mastering React and Node.js. Recently, I built a web application as an academic project, which really helped me understand how to connect a frontend to a database and handle user authentication. Before that, I focused on strengthening my programming basics using Java and building responsive user interfaces. What excites me most about this opportunity at your company is the chance to apply what I have learned in a real-world environment. I am looking for an internship where I can contribute to actual products while learning from experienced developers."'
      }
    ],
    keyPoints: [
      "Communication: Explain your background and projects clearly without rambling.",
      "Passion for Tech: Demonstrate that you are actively building things and learning outside of class.",
      "Willingness to Grow: Show readiness to absorb new knowledge in a real engineering team.",
      "Keep your total introduction strictly under 90 seconds using the 3-Step architecture."
    ],
    commonMistakes: [
      "The Resume Recitation: Don't just read your CV line by line.",
      "The Life Story: Don't start from your school days; stick to your tech journey.",
      "Saying \"I have no experience\": Always focus on the projects you HAVE built, rather than formal jobs you haven't had yet."
    ],
    recruiterTip: "As a student or junior developer, interviewers prioritize your communication clarity, eagerness to learn, and actual project problem-solving over formal years of experience."
  },
  {
    id: 'top-10-react-interview-questions',
    title: "Top 10 React Interview Questions",
    category: 'Technical',
    tag: 'Technical',
    readTime: '8 min read',
    image: '/tips/react-interview.jpg',
    summary: 'Crack senior React technical rounds with deep explanations of Virtual DOM, Fiber reconciliation, React 19 hooks, and SSR hydration.',
    difficulty: 'Advanced',
    formula: 'Concept Definition → Architectural Mechanism → Practical Code Trade-offs',
    items: [
      {
        badge: 'Q1',
        title: '1. How does the Virtual DOM and Fiber reconciliation work?',
        answer: 'React maintains an in-memory virtual tree. When state changes, Fiber reconciler splits diffing into an interruptible Render phase (computing changes) and a synchronous Commit phase (updating the DOM in batch), preventing UI freezes.'
      },
      {
        badge: 'Q2',
        title: '2. What is the difference between useMemo and useCallback?',
        answer: 'useMemo caches the result of a computed calculation, while useCallback caches the function definition itself between renders to preserve referential equality for child component props.'
      },
      {
        badge: 'Q3',
        title: '3. How do React Server Components (RSC) differ from Client Components?',
        answer: 'Server Components execute exclusively on the server and ship zero JavaScript bundle to the browser, while Client Components render in the browser for interactivity (useState, effects, event listeners).'
      },
      {
        badge: 'Q4',
        title: '4. Why is using array index as a key considered an anti-pattern?',
        answer: 'Index keys confuse React diffing algorithm when items are inserted, deleted, or reordered, causing unintended state bugs and unnecessary DOM re-renders.'
      },
      {
        badge: 'Q5',
        title: '5. How does automatic batching work in React 18 & 19?',
        answer: 'React automatically groups multiple state updates within timeouts, promises, and async calls into a single re-render, dramatically reducing layout thrashing.'
      },
      {
        badge: 'Q6',
        title: '6. How do you prevent memory leaks in useEffect?',
        answer: 'Always return a cleanup function to cancel active subscriptions, abort fetch requests (via AbortController), and clear timers before the component unmounts or re-renders.'
      },
      {
        badge: 'Q7',
        title: '7. When should you use Context API vs an external store (Zustand/Redux)?',
        answer: 'Context is ideal for low-frequency global state (theme, user auth). For high-frequency state updates, external stores prevent re-rendering all consuming sub-trees.'
      },
      {
        badge: 'Q8',
        title: '8. What is the difference between Controlled and Uncontrolled components?',
        answer: 'Controlled components have form inputs driven by React state via value/onChange. Uncontrolled components let the DOM handle form data via useRef.'
      },
      {
        badge: 'Q9',
        title: '9. What are React 19 Server Actions and useOptimistic?',
        answer: 'Server Actions allow asynchronous functions to run directly on the server from client forms. useOptimistic displays UI updates immediately before server confirmation.'
      },
      {
        badge: 'Q10',
        title: '10. What are custom hooks and what rules must they follow?',
        answer: 'Custom hooks are JavaScript functions starting with "use" that encapsulate and share reusable stateful logic while adhering to the standard Rules of Hooks.'
      }
    ],
    keyPoints: [
      "Explain the Fiber architecture: Cooperative scheduling & requestIdleCallback model.",
      "Differentiate useMemo/useCallback: Mention referential equality and profiler trade-offs.",
      "Master React 19 features: Server Actions, useOptimistic, and Server Components vs SSR.",
      "Deeply understand useEffect dependency arrays and closure capture bugs."
    ],
    commonMistakes: [
      "Saying Virtual DOM is always faster than Vanilla DOM without mentioning memory overhead.",
      "Claiming useState updates are purely synchronous.",
      "Neglecting accessibility (a11y) and keyboard navigation."
    ],
    recruiterTip: "Staff engineers love asking how you diagnose memory leaks and unwanted re-renders using React DevTools Profiler."
  },
  {
    id: 'behavioral-questions-preparation',
    title: "Behavioral Questions Preparation Guide",
    category: 'Behavioral',
    tag: 'Behavioral',
    readTime: '6 min read',
    image: '/tips/behavioral-guide.jpg',
    summary: 'Navigate Amazon Leadership Principles and Fortune 500 behavioral rounds with structured, high-impact STAR stories.',
    difficulty: 'Intermediate',
    formula: 'Situation (15%) → Task (15%) → Action (50%) → Result (20%)',
    items: [
      {
        badge: 'STAR 1',
        title: '1. Tell me about a complex technical challenge you solved.',
        answer: 'Structure with STAR: Detail the specific system constraint (e.g. latency spike), your diagnostics approach (profiler/logs), your fix (caching/indexing), and the quantified result (35% speedup).'
      },
      {
        badge: 'STAR 2',
        title: '2. Tell me about a disagreement with a team member.',
        answer: 'Demonstrate mature, data-driven debate without ego. Explain how you created benchmarks or an RFC to evaluate both ideas objectively and aligned with the team goal.'
      },
      {
        badge: 'STAR 3',
        title: '3. Tell me about a time you made a mistake or outage occurred.',
        answer: 'Demonstrate extreme ownership: Quick triage, transparent communication to stakeholders, and publishing a blameless post-mortem with automated safeguards.'
      },
      {
        badge: 'STAR 4',
        title: '4. Tell me about a time you worked under a tight deadline.',
        answer: 'Show prioritization: Negotiated MVP scope with product managers, focused on critical-path architecture, and delivered on-time with zero bugs.'
      }
    ],
    keyPoints: [
      "Spend half of your response describing your specific technical actions.",
      "Use 'I' instead of 'we' when highlighting your personal contribution.",
      "Always quantify results with percentages, dollar values, or user counts.",
      "Include the reflective takeaway: what you learned or improved afterwards."
    ],
    commonMistakes: [
      "Spending too long describing the problem and running out of time for the result.",
      "Blaming teammates or management when answering about conflict or failure.",
      "Giving vague outcomes without measurable proof."
    ],
    recruiterTip: "Interviewers look for high ownership and bias for action. Share real challenges with positive, accountable outcomes."
  },
  {
    id: 'ats-resume-secrets',
    title: "ATS Resume Formatting Secrets from FAANG Recruiters",
    category: 'Resume',
    tag: 'Resume',
    readTime: '7 min read',
    image: '/tips/resume-secrets.jpg',
    summary: 'How Workday, Greenhouse, and Lever parse PDF files and what layout choices trigger automatic disqualification.',
    difficulty: 'Beginner',
    formula: 'Clean Single-Column Layout → Standard Headings → Quantified Accomplishments',
    items: [
      {
        badge: 'RULE 1',
        title: 'Strict Single-Column Layout',
        answer: 'Never use two-column templates or Canva sidebars; ATS screeners like Workday read horizontally across columns, garbling your work history.'
      },
      {
        badge: 'RULE 2',
        title: 'Universal Section Headings',
        answer: 'Use exact headings: "Work Experience", "Technical Skills", "Education", "Projects". Avoid fancy labels like "My Milestones".'
      },
      {
        badge: 'RULE 3',
        title: 'Quantified XYZ Bullets',
        answer: '"Accomplished [X], measured by [Y], by doing [Z]." Lead every bullet with a strong action verb (Architected, Engineered, Optimized).'
      },
      {
        badge: 'RULE 4',
        title: 'Exact Keyword Density',
        answer: 'Mirror technical keywords directly from the target job posting (e.g. TypeScript, PostgreSQL, CI/CD) throughout your project bullets.'
      },
      {
        badge: 'RULE 5',
        title: 'Text-Selectable PDF Format',
        answer: 'Ensure your PDF text can be highlighted and copied. Flattened image scans or raster PDFs receive an automatic 0 score in ATS.'
      }
    ],
    keyPoints: [
      "Use single-column layout; multi-column resumes scramble text parsing in Workday.",
      "Stick to standard headers: Experience, Education, Projects, Technical Skills.",
      "Export as text-searchable PDF (never flattened raster images or scans).",
      "Incorporate 80%+ of core job description keywords naturally into bullets."
    ],
    commonMistakes: [
      "Putting contact details or skills in header/footer graphical canvas blocks.",
      "Using skill rating progress bars (e.g. 80% Python) which ATS parses as gibberish.",
      "Submitting resumes without GitHub or live deployment links."
    ],
    recruiterTip: "Recruiters spend 6 seconds on initial human review. Keep critical metrics above the fold."
  },
  {
    id: 'salary-negotiation-guide',
    title: "Salary Negotiation & Answering Expected Salary",
    category: 'HR',
    tag: 'HR',
    readTime: '5 min read',
    image: '/tips/salary-negotiation.jpg',
    summary: 'Tactful scripts and strategies to deflect premature salary questions and maximize your total compensation package.',
    difficulty: 'Intermediate',
    formula: 'Deflection & Market Alignment → Total Comp Evaluation → Collaborative Counter',
    items: [
      {
        badge: 'SCRIPT 1',
        title: 'Phone Screen Deflection Script',
        answer: '"I\'m primarily focused on finding the right role where I can make the biggest impact. Could you share the approved budget range for this position so we\'re aligned?"'
      },
      {
        badge: 'SCRIPT 2',
        title: 'Buying 48 Hours upon Verbal Offer',
        answer: '"Thank you so much! I\'m genuinely excited about joining the team. I\'d love to review the full written offer package and get back to you within 48 hours."'
      },
      {
        badge: 'SCRIPT 3',
        title: 'The Collaborative Counter-Offer',
        answer: '"Based on my experience architecting scalable systems and current market data for this tier, I was targeting $X base. If we can reach that, I\'m ready to sign today."'
      },
      {
        badge: 'CHECKLIST',
        title: 'Negotiable Levers Beyond Base Salary',
        answer: 'Base Salary • Signing Bonus • Equity Grants • Annual Performance Bonus • Remote Stipend • Additional PTO Days'
      }
    ],
    keyPoints: [
      "Never share your current salary or be the first to name a number in initial screeners.",
      "Always ask for the employer's approved band: 'What is the target range for this level?'.",
      "Negotiate on Total Compensation (Base + Equity + Signing Bonus + Learning Stipends).",
      "Always negotiate in writing with a collaborative, appreciative tone."
    ],
    commonMistakes: [
      "Accepting the verbal offer immediately on the phone without asking for 48 hours to review.",
      "Focusing only on base salary while ignoring vesting schedules and health perks.",
      "Issuing ultimatums rather than partnership-focused counters."
    ],
    recruiterTip: "Recruiters expect you to negotiate; having a polished counter-offer increases respect, not rejection."
  },
  {
    id: 'junior-to-senior-transition',
    title: "Transitioning from Junior to Senior Software Engineer",
    category: 'Career Growth',
    tag: 'Career Growth',
    readTime: '9 min read',
    image: '/tips/career-growth.jpg',
    summary: 'The mental shift from writing code to driving technical consensus, architecting resilient systems, and mentoring junior devs.',
    difficulty: 'Advanced',
    formula: 'Coding Execution → Systems Thinking → Cross-Team Technical Leadership',
    items: [
      {
        badge: 'SHIFT 1',
        title: 'From Writing Code → Architecting Systems',
        answer: 'Juniors write features; seniors write RFCs, evaluate failure modes, choose proper data models, and anticipate scalability bottlenecks.'
      },
      {
        badge: 'SHIFT 2',
        title: 'From Waiting for Tasks → Driving Business Impact',
        answer: 'Seniors don\'t wait for Jira tickets. They spot production latency, tech debt, and user drop-offs and propose solutions proactively.'
      },
      {
        badge: 'SHIFT 3',
        title: 'From Solo Contributor → Team Multiplier',
        answer: 'A senior engineer makes everyone around them better through constructive code reviews, mentorship, and creating clean shared libraries.'
      },
      {
        badge: 'SHIFT 4',
        title: 'Production Ownership & Observability',
        answer: 'Shipping code is only 30% of the job. Seniors build automated alerting, structured logging, distributed tracing, and automated test suites.'
      }
    ],
    keyPoints: [
      "Write design docs (RFCs) that outline trade-offs and disaster recovery plans.",
      "Shift from 'How do I build this?' to 'Should we build this, buy it, or simplify it?'.",
      "Conduct empathetic, constructive code reviews that teach rather than criticize.",
      "Build bridges between engineering, product, and business stakeholders."
    ],
    commonMistakes: [
      "Hoarding knowledge and becoming a single point of failure.",
      "Over-engineering simple requirements with trendy libraries.",
      "Neglecting observability, alerts, and production runbooks."
    ],
    recruiterTip: "In senior interviews, you will be evaluated heavily on how you resolve technical disagreements and mentor others."
  },
  {
    id: 'questions-to-ask-interviewer',
    title: "The 5 Questions You Must Ask Your Interviewer at the End",
    category: 'General Tips',
    tag: 'General',
    readTime: '4 min read',
    image: '/tips/questions-to-ask.jpg',
    summary: 'Turn the tables and stand out from 99% of candidates by asking high-level engineering culture and architectural questions.',
    difficulty: 'Beginner',
    formula: 'Engineering Velocity → Incident Culture → Team Vision Alignment',
    items: [
      {
        badge: 'Q1',
        title: 'Deployment & DevOps Velocity',
        answer: '"What does the typical deployment pipeline look like from merged PR to production, and how do you handle rollbacks?" (Shows you value shipping velocity).'
      },
      {
        badge: 'Q2',
        title: 'Technical Debt Management',
        answer: '"How does the engineering team balance shipping new features with paying down technical debt?" (Shows senior engineering pragmatism).'
      },
      {
        badge: 'Q3',
        title: 'Recent Architectural Hurdles',
        answer: '"What is the most complex technical challenge the team solved in the last 6 months?" (Demonstrates intellectual curiosity).'
      },
      {
        badge: 'Q4',
        title: 'Team Success Metrics',
        answer: '"What separates an average engineer from an exceptional one on this team in their first 6 months?" (Shows high ambition).'
      },
      {
        badge: 'Q5',
        title: 'Culture & Retention',
        answer: '"What initially brought you to this company, and what has kept you here?" (Builds authentic personal rapport).'
      }
    ],
    keyPoints: [
      "Ask questions that show you think like a member of their engineering team.",
      "Inquire about technical debt management and automated test coverage.",
      "Ask the interviewer what has kept them at the company and what their proudest project is.",
      "Never say 'No, I don't have any questions' when prompted."
    ],
    commonMistakes: [
      "Asking basic questions that are already answered on their public homepage.",
      "Focusing solely on vacation time or working hours in the first round.",
      "Failing to listen to their answer and not following up naturally."
    ],
    recruiterTip: "Curious candidates who ask thoughtful architectural questions leave a lasting impression on hiring managers."
  },
  {
    id: 'system-design-architecture-framework',
    title: "Mastering System Design: The 4-Step Architecture Framework",
    category: 'Technical',
    tag: 'Technical',
    readTime: '10 min read',
    image: '/tips/system-design.jpg',
    summary: 'A repeatable blueprint for scaling services to 10M requests: Requirements, High-Level Design, Deep-Dive, and Bottlenecks.',
    difficulty: 'Advanced',
    formula: 'Functional/Non-Functional Scope → High-Level Blocks → Deep-Dive Tiers → Bottlenecks & Failure Modes',
    items: [
      {
        badge: 'STEP 1',
        title: 'Scope & Scale Estimation (5 Mins)',
        answer: 'Clarify functional requirements (post tweet, timeline) and non-functional requirements (10M DAU, 100ms p99 read, 99.99% availability). Calculate Read/Write QPS and memory storage.'
      },
      {
        badge: 'STEP 2',
        title: 'High-Level Architecture (10 Mins)',
        answer: 'Sketch end-to-end block diagrams: Client → CDN → DNS → Reverse Proxy / Load Balancer → Stateless Microservices → Cache → Database.'
      },
      {
        badge: 'STEP 3',
        title: 'Core Deep-Dive & Data Model (15 Mins)',
        answer: 'Design database schemas (PostgreSQL vs MongoDB), caching strategies (Redis Cache-Aside), message queues (Kafka for async processing), and REST/gRPC contracts.'
      },
      {
        badge: 'STEP 4',
        title: 'Bottlenecks & Failure Modes (10 Mins)',
        answer: 'Address Single Points of Failure (SPOFs), database sharding by user_id, replication lag, rate limiters, and circuit breakers.'
      }
    ],
    keyPoints: [
      "Spend the first 5 minutes agreeing on Functional and Non-Functional scale requirements.",
      "Draw clear block diagrams: Clients, CDN, Load Balancer, API Services, Cache, DB.",
      "Address single points of failure (SPOF) with replicas and circuit breakers.",
      "Discuss database indexing strategies, CAP theorem trade-offs, and eventual consistency."
    ],
    commonMistakes: [
      "Jumping straight into drawing databases without calculating traffic or storage volume.",
      "Throwing Redis or Kafka at every problem without justifying why.",
      "Ignoring failure recovery, backup nodes, and replication lag."
    ],
    recruiterTip: "System design interviews are collaborative conversations. Talk out loud and state trade-offs constantly."
  }
];

const InterviewTips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tips, setTips] = useState(INITIAL_TIPS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [selectedTip, setSelectedTip] = useState(null);
  const [copiedItemIdx, setCopiedItemIdx] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('mockmate_bookmarked_tips');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI Generator Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // Fetch Tips from Backend
  useEffect(() => {
    fetchTips();
  }, [activeCategory]);

  const fetchTips = async () => {
    try {
      const categoryParam = activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : '';
      const res = await axios.get(`http://localhost:5000/api/tips${categoryParam}`);
      if (res.data && res.data.tips && res.data.tips.length > 0) {
        setTips(res.data.tips);
      }
    } catch (err) {
      console.warn('Backend fetch notice, using fallback rich tips data:', err.message);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (id, e) => {
    e?.stopPropagation();
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(bId => bId !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('mockmate_bookmarked_tips', JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage err:", err);
    }
  };

  // Copy Single Item to Clipboard
  const handleCopyItem = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedItemIdx(idx);
    setTimeout(() => setCopiedItemIdx(null), 2000);
  };

  // Copy All Items to Clipboard
  const handleCopyAll = (tip) => {
    if (!tip) return;
    let fullText = `${tip.title}\n\n`;
    if (tip.items && tip.items.length > 0) {
      fullText += tip.items.map(it => `[${it.badge || '•'}] ${it.title}\n${it.answer}`).join('\n\n');
    } else if (tip.sampleAnswer) {
      fullText += tip.sampleAnswer;
    }
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Generate Custom AI Tip
  const handleGenerateAiTip = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setAiGenerating(true);
    setAiError('');

    try {
      const res = await axios.post('http://localhost:5000/api/tips/generate', {
        topic: aiTopic.trim(),
        role: user?.jobRole || 'Full Stack Web Developer'
      });

      if (res.data && res.data.tip) {
        setTips(prev => [res.data.tip, ...prev]);
        setIsAiModalOpen(false);
        setAiTopic('');
        navigate('/interview-tips/' + (res.data.tip.slug || res.data.tip.id));
      } else {
        throw new Error('Failed to parse AI tip');
      }
    } catch (err) {
      console.error("AI tip generate error:", err);
      setAiError(err.response?.data?.error || err.message || 'Failed to generate guide with AI. Please verify backend is running.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Filtered Tips by Search Input and Category
  const filteredTips = tips.filter(tip => {
    // Category check (if backend didn't already filter)
    if (activeCategory !== 'All') {
      const catNorm = activeCategory.toLowerCase().trim();
      const tCat = (tip.category || '').toLowerCase().trim();
      const tTag = (tip.tag || '').toLowerCase().trim();
      const match = tCat === catNorm || 
                    tTag === catNorm ||
                    (catNorm === 'general tips' && (tCat === 'general' || tTag === 'general')) ||
                    (catNorm === 'general' && (tCat === 'general tips' || tTag === 'general'));
      if (!match) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tip.title.toLowerCase().includes(q) ||
      tip.summary?.toLowerCase().includes(q) ||
      tip.category?.toLowerCase().includes(q) ||
      tip.tag?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* -------------------- 1. HEADER (MATCHES SCREENSHOT) -------------------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Interview Tips & Resources
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-normal">
            Learn from expert tips, sample answers and industry insights.
          </p>
        </div>

        {/* Search & Custom AI Guide Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tips & questions..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 shadow-2xs transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles size={15} />
            <span className="hidden sm:inline">Ask AI for Tips</span>
            <span className="sm:hidden">AI Tips</span>
          </button>
        </div>
      </div>

      {/* -------------------- 2. CATEGORY PILLS (MATCHES SCREENSHOT) -------------------- */}
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none select-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#064E3B] text-white shadow-md shadow-emerald-950/20 scale-102'
                  : 'bg-gray-100/90 hover:bg-gray-200/80 text-gray-700 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* -------------------- 3. TIPS CARDS GRID (MATCHES SCREENSHOT) -------------------- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-xs animate-pulse">
              <div className="aspect-[16/10] bg-gray-100" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-100 rounded-md w-4/5" />
                <div className="h-5 bg-gray-100 rounded-md w-3/5" />
                <div className="pt-2 flex items-center justify-between">
                  <div className="h-6 w-16 bg-gray-100 rounded-full" />
                  <div className="h-4 w-14 bg-gray-100 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
            <BookOpen size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">No guides found for "{searchQuery || activeCategory}"</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Try switching categories or generate a tailored custom guide with Gemini AI!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredTips.map((tip) => {
            const isBookmarked = bookmarkedIds.includes(tip.id);
            const badgeClass = getCategoryBadgeStyle(tip.tag || tip.category);

            return (
              <div
                key={tip.id}
                onClick={() => navigate('/interview-tips/' + (tip.slug || tip.id))}
                className="bg-white rounded-3xl border border-gray-150/90 hover:border-gray-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer relative"
              >
                {/* Image Thumbnail Header (Matches Screenshot Aspect & Rounded Corners) */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img 
                    src={tip.image} 
                    alt={tip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/tips/react-interview.jpg';
                    }}
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(tip.id, e)}
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-gray-700 hover:text-emerald-700 hover:bg-white shadow-xs flex items-center justify-center transition-all cursor-pointer opacity-90 hover:scale-105"
                    title={isBookmarked ? "Remove Bookmark" : "Save Tip"}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={16} className="text-emerald-700 fill-emerald-700" />
                    ) : (
                      <Bookmark size={15} />
                    )}
                  </button>

                  {/* AI Generated Chip if dynamic */}
                  {tip.isAIGenerated && (
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                      <Sparkles size={11} className="text-emerald-400" />
                      <span>AI Custom Guide</span>
                    </span>
                  )}
                </div>

                {/* Card Content (Matches Screenshot Layout) */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg sm:text-xl text-gray-950 tracking-tight leading-snug group-hover:text-emerald-800 transition-colors">
                      {tip.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed line-clamp-2">
                      {tip.summary}
                    </p>
                  </div>

                  {/* Bottom Row: Category Pill & Read Time (Matches Reference Screenshot) */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeClass}`}>
                      {tip.tag || tip.category}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <Clock size={13} className="text-gray-400" />
                      <span>{tip.readTime}</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ==================== 4. ACCURATE, SHORT & BEAUTIFUL DETAIL READING MODAL ==================== */}
      {selectedTip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col border border-gray-150 animate-scale-in"
          >
            {/* Modal Header Cover */}
            <div className="relative aspect-[21/8] sm:aspect-[24/8] w-full overflow-hidden bg-slate-900 shrink-0">
              <img 
                src={selectedTip.image} 
                alt={selectedTip.title}
                className="w-full h-full object-cover opacity-85" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedTip(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <X size={18} />
              </button>

              {/* Header Badges */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                    {selectedTip.tag || selectedTip.category}
                  </span>
                  <span className="text-xs font-medium text-gray-200 flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                    <Clock size={12} /> {selectedTip.readTime}
                  </span>
                  {selectedTip.items && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white">
                      {selectedTip.items.length} Key Points
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyAll(selectedTip)}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedAll ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedAll ? 'Copied All!' : 'Copy Guide'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleBookmark(selectedTip.id)}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {bookmarkedIds.includes(selectedTip.id) ? (
                      <>
                        <BookmarkCheck size={14} className="text-emerald-400 fill-emerald-400" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={14} />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              
              {/* Title & Executive Summary */}
              <div className="space-y-2 border-b border-gray-150 pb-5">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                  {selectedTip.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  {selectedTip.summary}
                </p>
              </div>

              {/* Framework / Formula Strategy Badge */}
              {selectedTip.formula && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 block">
                      Core Strategy Formula
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-emerald-950 mt-0.5">
                      {selectedTip.formula}
                    </p>
                  </div>
                </div>
              )}

              {/* ==================== EXACT MATCHING ITEMS (SHORT, CLEAR & BEAUTIFUL) ==================== */}
              {selectedTip.items && selectedTip.items.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Key Breakdown for "{selectedTip.title}" ({selectedTip.items.length})</span>
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">Concise & Actionable</span>
                  </div>

                  <div className="space-y-3">
                    {selectedTip.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                              {item.badge || `0${idx + 1}`}
                            </span>
                            <h4 className="font-extrabold text-sm sm:text-base text-gray-950">
                              {item.title}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyItem(item.answer, idx)}
                            className="text-xs font-semibold text-gray-400 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
                            title="Copy this point"
                          >
                            {copiedItemIdx === idx ? (
                              <Check size={14} className="text-emerald-600" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>

                        {/* Short Punchy Answer / Execution Advice */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                          {item.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verbatim Model Answer (if not already in items) */}
              {selectedTip.sampleAnswer && (!selectedTip.items || selectedTip.items.length === 0) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                      Verbatim Model Answer
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyItem(selectedTip.sampleAnswer, 999)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 transition-all"
                    >
                      {copiedItemIdx === 999 ? (
                        <>
                          <Check size={14} className="text-emerald-700" />
                          <span>Copied Answer!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm sm:text-base text-gray-800 leading-relaxed font-normal italic relative">
                    "{selectedTip.sampleAnswer}"
                  </div>
                </div>
              )}

              {/* Recruiter Insider Secret */}
              {selectedTip.recruiterTip && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5">
                  <Lightbulb size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                      Recruiter Insider Tip
                    </span>
                    <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                      {selectedTip.recruiterTip}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-150 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-500 font-medium">
                MockMate AI • Direct Interview Intelligence
              </span>
              <button
                type="button"
                onClick={() => setSelectedTip(null)}
                className="bg-[#064E3B] hover:bg-[#053d2e] text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 cursor-pointer"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== 5. CUSTOM AI GUIDE GENERATOR MODAL ==================== */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-150 space-y-6 animate-scale-in"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-950">Ask AI for Custom Tips</h3>
                  <p className="text-xs text-gray-500">Get an instant expert guide tailored to your specific interview round</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGenerateAiTip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  What interview topic or question do you need help with?
                </label>
                <input
                  type="text"
                  required
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. 'Handling salary expectations', 'System Design Rate Limiter', 'Tell me about a time you failed'..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              {/* Suggestions Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-gray-400 font-semibold">Or click a popular prompt:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Explain a career gap',
                    'Why should we hire you?',
                    'Docker & Kubernetes basics',
                    'Disagreeing with a senior engineer'
                  ].map((sugg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAiTopic(sugg)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-semibold text-gray-600 transition-colors cursor-pointer"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {aiError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiGenerating || !aiTopic.trim()}
                  className="bg-[#064E3B] hover:bg-[#053d2e] disabled:opacity-60 text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Writing Expert Guide...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Generate AI Guide</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default InterviewTips;
