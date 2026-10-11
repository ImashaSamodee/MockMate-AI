import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  ArrowRight, 
  X, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Play, 
  Flame, 
  ChevronRight,
  Database,
  Network,
  Users,
  MessageSquare
} from 'lucide-react';

// Official & Crisp Custom Topic Icons matching the reference design
const TopicIcon = ({ iconType, className = "w-9 h-9" }) => {
  switch (iconType) {
    case 'javascript':
      return (
        <div className="w-10 h-10 rounded-lg bg-[#F7DF1E] flex items-end justify-end p-1 shadow-xs">
          <span className="font-black text-black text-base leading-none select-none tracking-tighter">JS</span>
        </div>
      );

    case 'react':
      return (
        <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#00D8FE" />
          <g stroke="#00D8FE" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case 'nodejs':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          {/* Hexagon with stylized node text */}
          <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#22C55E" />
          <path d="M12 4L19.5 8.3V15.7L12 20L4.5 15.7V8.3L12 4Z" fill="#15803D" />
          <text x="12" y="14.5" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">node</text>
        </svg>
      );

    case 'system-design':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Distributed cluster nodes with interconnecting lines */}
          <rect x="2" y="3" width="5" height="5" rx="1.5" fill="#EEF2FF" />
          <rect x="17" y="3" width="5" height="5" rx="1.5" fill="#EEF2FF" />
          <rect x="2" y="16" width="5" height="5" rx="1.5" fill="#EEF2FF" />
          <rect x="17" y="16" width="5" height="5" rx="1.5" fill="#EEF2FF" />
          <circle cx="12" cy="12" r="2.5" fill="#4F46E5" />
          <path d="M7 5.5H12M12 5.5H17M7 18.5H12M12 18.5H17M12 5.5V18.5" stroke="#4F46E5" strokeWidth="1.8" strokeDasharray="2 2" />
        </svg>
      );

    case 'database':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* 3D Stacked database disks */}
          <ellipse cx="12" cy="5" rx="8" ry="3" fill="#F3E8FF" />
          <path d="M4 5V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V5" />
          <path d="M4 12V19C4 20.66 7.58 22 12 22C16.42 22 20 20.66 20 19V12" />
        </svg>
      );

    case 'data-structures':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Binary tree / algorithmic hierarchy graph */}
          <circle cx="12" cy="4" r="2.5" fill="#D1FAE5" />
          <circle cx="6" cy="18" r="2.5" fill="#D1FAE5" />
          <circle cx="18" cy="18" r="2.5" fill="#D1FAE5" />
          <circle cx="12" cy="12" r="2" fill="#059669" />
          <path d="M12 6.5V10M10.5 13.5L7.5 16M13.5 13.5L16.5 16" />
        </svg>
      );

    case 'behavioral':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Collaboration team group */}
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="#FEF3C7" />
          <circle cx="9" cy="7" r="4" fill="#FEF3C7" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case 'hr-questions':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Interview dialogue speech bubble */}
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#E0F2FE" />
          <circle cx="8" cy="10" r="1" fill="#0284C7" />
          <circle cx="12" cy="10" r="1" fill="#0284C7" />
          <circle cx="16" cy="10" r="1" fill="#0284C7" />
        </svg>
      );

    default:
      return <BookOpen className="w-8 h-8 text-emerald-700" />;
  }
};

// Default static fallback topics (guarantees instantaneous rendering & exact match to reference screenshot)
const INITIAL_TOPICS = [
  {
    id: 'javascript',
    title: 'JavaScript',
    category: 'Programming',
    altCategory: 'Web Development',
    questionsCount: '120+ Questions',
    icon: 'javascript',
    bgClass: 'bg-[#FEF9C3]', // soft yellow
    borderHover: 'hover:border-amber-200',
    description: 'Master asynchronous event loops, closures, promises, prototype chains, ES6+ features, and modern V8 performance optimizations.',
    sampleQuestions: [
      { id: 'js_1', question: 'Explain the JavaScript event loop and how the call stack, microtask queue, and macrotask queue interact.', difficulty: 'Intermediate' },
      { id: 'js_2', question: 'What is a closure in JavaScript, and what are practical real-world use cases and potential memory leaks?', difficulty: 'Intermediate' },
      { id: 'js_3', question: 'Compare prototypal inheritance with classical OOP class inheritance in modern ECMAScript.', difficulty: 'Advanced' },
      { id: 'js_4', question: 'How do JavaScript Promises work internally, and what is the difference between Promise.all, Promise.allSettled, and Promise.race?', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'react',
    title: 'React.js',
    category: 'Web Development',
    altCategory: 'Programming',
    questionsCount: '90+ Questions',
    icon: 'react',
    bgClass: 'bg-[#E0F2FE]', // soft sky blue
    borderHover: 'hover:border-sky-200',
    description: 'Deep dive into virtual DOM reconciliation, React 19 hooks, state management patterns, Server Components (RSC), and SSR hydration.',
    sampleQuestions: [
      { id: 'react_1', question: 'Explain React’s Fiber reconciliation algorithm and how batching works in React 18 & 19.', difficulty: 'Advanced' },
      { id: 'react_2', question: 'When would you use useMemo and useCallback, and what are the performance overheads of misuse?', difficulty: 'Intermediate' },
      { id: 'react_3', question: 'How do React Server Components (RSC) differ from traditional Server-Side Rendering (SSR) and Client Components?', difficulty: 'Advanced' },
      { id: 'react_4', question: 'How do you handle global state management efficiently across deeply nested component trees without unnecessary re-renders?', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    category: 'Web Development',
    altCategory: 'Programming',
    questionsCount: '80+ Questions',
    icon: 'nodejs',
    bgClass: 'bg-[#DCFCE7]', // soft emerald green
    borderHover: 'hover:border-emerald-200',
    description: 'Explore libuv event loops, worker threads, async I/O streams, clusters, REST/GraphQL design, and high-concurrency architecture.',
    sampleQuestions: [
      { id: 'node_1', question: 'How does Node.js achieve non-blocking asynchronous I/O using libuv and the thread pool?', difficulty: 'Intermediate' },
      { id: 'node_2', question: 'What is backpressure in Node.js streams and how do you handle it when streaming large gigabyte files?', difficulty: 'Advanced' },
      { id: 'node_3', question: 'Compare worker threads with Node child processes and the cluster module for CPU-intensive workloads.', difficulty: 'Advanced' },
      { id: 'node_4', question: 'How would you architect a graceful shutdown sequence in an Express/Node.js microservice handling active database connections?', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'system-design',
    title: 'System Design',
    category: 'System Design',
    altCategory: 'Web Development',
    questionsCount: '70+ Questions',
    icon: 'system-design',
    bgClass: 'bg-[#EEF2FF]', // soft indigo
    borderHover: 'hover:border-indigo-200',
    description: 'Design distributed architectures, microservices, load balancing, caching tiers, message queues, and CAP theorem trade-offs.',
    sampleQuestions: [
      { id: 'sd_1', question: 'Design a distributed rate limiter that supports 100,000 requests per second across multiple data centers.', difficulty: 'Advanced' },
      { id: 'sd_2', question: 'How do you design an idempotent payment processing system that guarantees no double-charging during network timeouts?', difficulty: 'Advanced' },
      { id: 'sd_3', question: 'Compare Cache-Aside, Write-Through, and Write-Behind caching strategies with Redis in high-scale systems.', difficulty: 'Intermediate' },
      { id: 'sd_4', question: 'How would you architect a real-time notification service delivering push notifications to 10 million concurrent active users?', difficulty: 'Advanced' }
    ]
  },
  {
    id: 'database',
    title: 'Database',
    category: 'Database',
    altCategory: 'System Design',
    questionsCount: '85+ Questions',
    icon: 'database',
    bgClass: 'bg-[#F3E8FF]', // soft purple
    borderHover: 'hover:border-purple-200',
    description: 'Master B-Tree indexing, ACID transactions, normalization, sharding, replication lags, and SQL vs NoSQL trade-offs.',
    sampleQuestions: [
      { id: 'db_1', question: 'Explain how B-Tree indexes work in relational databases (PostgreSQL/MySQL) and why unindexed queries cause full table scans.', difficulty: 'Intermediate' },
      { id: 'db_2', question: 'What are ACID properties and how does PostgreSQL implement Multi-Version Concurrency Control (MVCC) during concurrent transactions?', difficulty: 'Advanced' },
      { id: 'db_3', question: 'What are the trade-offs between horizontal database sharding and vertical partitioning, and how do you handle distributed joins?', difficulty: 'Advanced' },
      { id: 'db_4', question: 'When would you pick an eventual-consistency document database (MongoDB/DynamoDB) over an ACID relational SQL database?', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    category: 'Programming',
    altCategory: 'System Design',
    questionsCount: '100+ Questions',
    icon: 'data-structures',
    bgClass: 'bg-[#D1FAE5]', // soft mint
    borderHover: 'hover:border-emerald-200',
    description: 'Tackle arrays, hash maps, linked lists, binary search trees, heaps, graphs, and Big-O asymptotic analysis.',
    sampleQuestions: [
      { id: 'dsa_1', question: 'Explain how a Hash Map handles hash collisions internally (separate chaining vs open addressing) and what triggers O(n) worst-case time.', difficulty: 'Intermediate' },
      { id: 'dsa_2', question: 'How do you detect a cycle in a singly linked list with O(1) space complexity using Floyd’s Tortoise and Hare algorithm?', difficulty: 'Intermediate' },
      { id: 'dsa_3', question: 'Compare Depth-First Search (DFS) and Breadth-First Search (BFS) in terms of memory space complexity on deep vs wide graphs.', difficulty: 'Intermediate' },
      { id: 'dsa_4', question: 'When would you implement a Trie (Prefix Tree) over a Hash Map for auto-complete search query suggestions?', difficulty: 'Advanced' }
    ]
  },
  {
    id: 'behavioral',
    title: 'Behavioral',
    category: 'Behavioral',
    altCategory: 'HR Questions',
    questionsCount: '120+ Questions',
    icon: 'behavioral',
    bgClass: 'bg-[#FEF3C7]', // soft amber peach
    borderHover: 'hover:border-amber-200',
    description: 'Practice the STAR method to demonstrate conflict resolution, project leadership, handling ambiguity, and tight deadlines.',
    sampleQuestions: [
      { id: 'beh_1', question: 'Tell me about a time when you strongly disagreed with a senior engineer or product manager on an architectural decision. How did you resolve it?', difficulty: 'Intermediate' },
      { id: 'beh_2', question: 'Describe a high-severity production outage or bug that you were responsible for or resolved under high pressure. What was the outcome and what did you learn?', difficulty: 'Intermediate' },
      { id: 'beh_3', question: 'How do you handle a situation where a project deadline is moving closer but the requirements keep shifting from stakeholders?', difficulty: 'Intermediate' },
      { id: 'beh_4', question: 'Give an example of a time you mentored a junior engineer or advocated for improving technical debt in your sprint cycle.', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'hr-questions',
    title: 'HR Questions',
    category: 'HR Questions',
    altCategory: 'Behavioral',
    questionsCount: '90+ Questions',
    icon: 'hr-questions',
    bgClass: 'bg-[#E0F2FE]', // soft sky blue
    borderHover: 'hover:border-sky-200',
    description: 'Ace culture fit, career trajectory questions, salary expectations, work style, and company alignment.',
    sampleQuestions: [
      { id: 'hr_1', question: 'Why are you looking to leave your current role, and what specific engineering culture or challenges are you seeking in your next position?', difficulty: 'Introductory' },
      { id: 'hr_2', question: 'Where do you see yourself technically and professionally in the next 3 to 5 years, and how does this role help you get there?', difficulty: 'Introductory' },
      { id: 'hr_3', question: 'How do you balance high-velocity feature delivery with maintaining high code quality, automated testing, and work-life balance?', difficulty: 'Intermediate' },
      { id: 'hr_4', question: 'What is your preferred management style, and how do you like to receive critical feedback on your work?', difficulty: 'Introductory' }
    ]
  }
];

const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'System Design',
  'Database',
  'Behavioral',
  'HR Questions'
];

const PracticeTopics = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicModal, setSelectedTopicModal] = useState(null);

  // Sync with backend API
  useEffect(() => {
    const fetchTopicsFromBackend = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/topics', { timeout: 4000 });
        if (res.data && Array.isArray(res.data.topics) && res.data.topics.length > 0) {
          // Merge with visual styling classes
          const enriched = res.data.topics.map(t => {
            const fallback = INITIAL_TOPICS.find(it => it.id === t.id) || {};
            return {
              ...t,
              bgClass: fallback.bgClass || 'bg-emerald-50',
              borderHover: fallback.borderHover || 'hover:border-emerald-200',
              sampleQuestions: t.sampleQuestions || fallback.sampleQuestions || []
            };
          });
          setTopics(enriched);
        }
      } catch (err) {
        console.warn("Using offline practice topics:", err.message);
      }
    };
    fetchTopicsFromBackend();
  }, []);

  // Filter topics by Category and Search Query
  const filteredTopics = topics.filter(t => {
    const matchesCategory = selectedCategory === 'All' || 
      t.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (t.altCategory && t.altCategory.toLowerCase() === selectedCategory.toLowerCase());

    const matchesSearch = !searchQuery.trim() || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Action: Launch interview for chosen topic
  const handleLaunchTopicInterview = (topicTitle) => {
    navigate(`/interview?topic=${encodeURIComponent(topicTitle)}&type=technical`);
  };

  // Action: Launch interview for a specific question
  const handlePracticeSpecificQuestion = (topicTitle, questionText) => {
    navigate(`/interview?topic=${encodeURIComponent(topicTitle)}&q=${encodeURIComponent(questionText)}&type=technical`);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* -------------------- 1. PAGE TITLE & SUBTITLE -------------------- */}
      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Practice Topics
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-normal">
          Choose a topic to start practicing with AI-generated questions.
        </p>
      </div>

      {/* -------------------- 2. SEARCH BAR -------------------- */}
      <div className="relative w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            className="w-full bg-white border border-gray-200/90 rounded-2xl py-3.5 pl-12 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* -------------------- 3. CATEGORY FILTER PILLS -------------------- */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none select-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#064E3B] text-white shadow-sm shadow-emerald-950/20'
                  : 'bg-white text-gray-600 hover:text-gray-950 hover:bg-gray-50 border border-gray-200/70'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* -------------------- 4. TOPIC CARDS GRID (MATCHES REFERENCE EXACTLY) -------------------- */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopicModal(topic)}
              className={`bg-white rounded-3xl p-7 sm:p-8 border border-gray-150/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1.5 ${topic.borderHover} transition-all duration-300 flex flex-col items-center text-center group cursor-pointer relative overflow-hidden`}
            >
              {/* Top squircle icon container */}
              <div className={`w-20 h-20 rounded-2xl ${topic.bgClass} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105 shadow-xs`}>
                <TopicIcon iconType={topic.icon} className="w-10 h-10" />
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-lg sm:text-xl text-gray-950 group-hover:text-emerald-700 transition-colors tracking-tight">
                {topic.title}
              </h3>

              {/* Question Count */}
              <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1 mb-6">
                {topic.questionsCount}
              </p>

              {/* Green Right Arrow */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLaunchTopicInterview(topic.title);
                }}
                className="text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer p-1"
                title={`Start ${topic.title} Interview`}
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" strokeWidth={2.4} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-xs space-y-3">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No topics found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search query or select another category filter above.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs font-bold text-emerald-700 hover:underline pt-2 inline-block cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* -------------------- 5. TOPIC DETAIL & QUESTIONS MODAL -------------------- */}
      {selectedTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-[2rem] max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-gray-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${selectedTopicModal.bgClass} flex items-center justify-center shadow-xs shrink-0`}>
                  <TopicIcon iconType={selectedTopicModal.icon} className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-950">
                      {selectedTopicModal.title}
                    </h2>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                      {selectedTopicModal.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {selectedTopicModal.questionsCount} Available • Senior Evaluation Benchmarks
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTopicModal(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors border border-gray-200 cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Description Box */}
              <div className="bg-emerald-50/60 border border-emerald-100/90 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900 mb-0.5">What Interviewers Look For:</p>
                  <p className="text-emerald-800/90">{selectedTopicModal.description}</p>
                </div>
              </div>

              {/* Sample / Curated Questions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-700" />
                    <span>Top Interview Questions ({selectedTopicModal.sampleQuestions?.length || 0})</span>
                  </h4>
                  <span className="text-[11px] text-gray-400 font-medium">Click any question to practice</span>
                </div>

                <div className="space-y-2.5">
                  {selectedTopicModal.sampleQuestions?.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      onClick={() => handlePracticeSpecificQuestion(selectedTopicModal.title, q.question)}
                      className="p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-600/70 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            Q{idx + 1}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            q.difficulty === 'Advanced' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60' 
                              : q.difficulty === 'Intermediate' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}>
                            {q.difficulty || 'Intermediate'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                          {q.question}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-50 group-hover:text-emerald-700 text-gray-400 flex items-center justify-center transition-colors shrink-0 mt-1">
                        <Play size={13} className="ml-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer with Primary CTA */}
            <div className="p-6 bg-slate-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-500 font-medium text-center sm:text-left">
                Real-time AI voice feedback, scoring breakdown & ideal answers included.
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedTopicModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-colors w-1/2 sm:w-auto cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchTopicInterview(selectedTopicModal.title)}
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 w-1/2 sm:w-auto cursor-pointer group"
                >
                  <span>Start Practice Session</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PracticeTopics;
