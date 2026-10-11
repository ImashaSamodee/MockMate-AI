// src/data/interviewArticlesData.js
// Comprehensive, production-grade article content for all 8 MockMate AI interview guides

export const INTERVIEW_ARTICLES = {
  'tell-me-about-yourself': {
    id: 'tell-me-about-yourself',
    slug: 'tell-me-about-yourself',
    aliases: ['tell-me-about-yourself', 'how-to-answer-tell-me-about-yourself'],
    title: "How to Answer \"Tell Me About Yourself\"",
    category: 'General Tips',
    tag: 'General',
    readTime: '5 min read',
    image: '/tips/tell-me-about-yourself.jpg',
    summary: "Master the Present-Past-Future formula to deliver a clear, 90-second introduction that shows your potential, even if you don't have years of formal work experience.",
    author: 'Senior Engineering Interviewer',
    publishedDate: 'Student & Junior Developer Guide',
    formula: 'Part 1: Present (30s) → Part 2: Past (30s) → Part 3: Future (30s)',
    keyTakeaways: [
      "Keep your answer strictly under 90 seconds to avoid losing the interviewer's attention.",
      "Anchor on the Present first: university, degree, and current tech stack you are mastering.",
      "Highlight one standout project with actual technical problem-solving rather than listing coursework.",
      "Connect your future goals directly to what you hope to contribute and learn at their specific company."
    ],
    sections: [
      {
        id: 'what-interviewers-listen-for',
        heading: '1. What Interviewers Are Really Listening For',
        content: `As a student or junior developer, interviewers are not expecting you to know everything. They are looking for three core signals:
• **Communication:** Can you explain your background and technical projects clearly without rambling?
• **Passion for Tech:** Are you actively building things, experimenting with modern frameworks, and learning outside of class?
• **Willingness to Grow:** Are you ready to absorb new engineering practices and thrive inside a real engineering team?`,
        callout: {
          type: 'tip',
          title: 'Recruiter Insight',
          text: 'This question sets the tone for the entire interview. A structured 90-second answer immediately marks you as composed, articulate, and prepared.'
        }
      },
      {
        id: 'the-3-step-architecture',
        heading: '2. The 3-Step Architecture for Students',
        content: `Split your answer into three simple, balanced parts:
• **Part 1: The Present (30 Seconds)** - State your university, your degree, and what programming languages or frameworks you are currently focusing on.
• **Part 2: The Past (30 Seconds)** - Talk about a recent academic project or personal project you built and what technical challenges you solved.
• **Part 3: The Future (30 Seconds)** - Explain why you want this specific internship or junior role and how you hope to contribute.`,
        code: `// The 90-Second Formula for Students:
[0:00 - 0:30] Present: University + Degree + Current tech stack you are learning
[0:30 - 1:00] Past:    Best academic project + Key technical skills applied
[1:00 - 1:30] Future:  Why you want this internship + What you hope to learn`
      },
      {
        id: 'verbatim-model-scripts',
        heading: '3. Full Verbatim Model Scripts',
        content: `Here is a realistic, field-tested model answer for university undergraduates and junior developers:`,
        code: `"I am currently a student at the Institute of Technology University of Moratuwa, focusing on full-stack web development. I have been spending a lot of my time mastering React and Node.js. 

Recently, I built a web application as an academic project, which really helped me understand how to connect a frontend to a database and handle user authentication. Before that, I focused on strengthening my programming basics using Java and building responsive user interfaces. 

What excites me most about this opportunity at your company is the chance to apply what I have learned in a real-world environment. I am looking for an internship where I can contribute to actual products while learning from experienced developers."`,
        secondaryHeading: 'Alternative: Model Script for Candidates with Work Experience',
        secondaryCode: `"I'm currently a Full Stack Software Engineer at TechCorp, where I specialize in building high-performance web systems using React, TypeScript, and Node.js.

Most recently, I led the architectural overhaul of our customer dashboard to React 19, which reduced initial page load times by 35% across 50,000 active users. Before that, I spent two years designing distributed microservices and asynchronous API pipelines in PostgreSQL.

What excites me most about this opportunity at your company is your engineering roadmap around AI developer tooling, where my background in real-time interfaces and backend scalability can make an immediate, tangible impact."`
      },
      {
        id: 'critical-mistakes-to-avoid',
        heading: '4. Critical Mistakes to Avoid',
        content: `Avoid these three common pitfalls that immediately lower candidate scores:
• **The Resume Recitation:** Don't just read your CV line by line. The interviewer has already skimmed your resume; they want your story.
• **The Life Story:** Don't start from your school days or childhood hobbies; stick strictly to your tech journey.
• **Saying "I have no experience":** Always focus on the projects you HAVE built, rather than the formal corporate jobs you haven't had yet.`,
        callout: {
          type: 'warning',
          title: 'Common Trap',
          text: 'Never speak for longer than 2 minutes without pausing or asking if the interviewer would like to dive deeper into any specific project.'
        }
      }
    ],
    interactiveType: 'intro-practice'
  },

  'top-10-react-interview-questions': {
    id: 'top-10-react-interview-questions',
    slug: 'top-10-react-interview-questions',
    aliases: ['top-10-react-interview-questions', 'react-interview-questions', 'react-interview'],
    title: "Top 10 React Interview Questions",
    category: 'Technical',
    tag: 'Technical',
    readTime: '8 min read',
    image: '/tips/react-interview.jpg',
    summary: 'Master the top 10 conceptual and architectural questions asked by tech companies: Fiber reconciliation, useMemo vs useCallback, React 19 hooks, and SSR.',
    author: 'Staff Frontend Architect',
    publishedDate: 'Updated for React 19 & 2026 Standards',
    formula: 'Core Definition → Engine Mechanism → Production Code Snippet → Performance Trade-offs',
    keyTakeaways: [
      "Understand Fiber's two-phase reconciliation: interruptible Render phase vs synchronous Commit phase.",
      "Differentiate referential equality (useCallback) from memoized computation results (useMemo).",
      "Explain React Server Components (RSC) as 0kB client bundle code executing during server render.",
      "Demonstrate React 19 features like Server Actions, useActionState, and useOptimistic."
    ],
    sections: [
      {
        id: 'react-fiber-reconciliation',
        heading: '1. Virtual DOM & React Fiber Reconciliation',
        content: `React maintains a lightweight in-memory tree called the Virtual DOM. When component state changes, React computes diffs against the previous snapshot.
In React 16+, this is driven by the **Fiber engine**, which replaced the stack reconciler. Fiber breaks work into incremental units, allowing React to pause, prioritize, and resume rendering to preserve 60 FPS interactions.`,
        code: `// Fiber divides rendering into two distinct stages:
// Phase 1: Render Phase (Asynchronous diffing - interruptible)
function reconcileFiber(workInProgressNode, nextProps) {
  return diffChildren(workInProgressNode, nextProps);
}

// Phase 2: Commit Phase (Synchronous DOM mutation - batch applied)
function commitWork(fiberTree) {
  DOMRenderer.flushMutations(fiberTree);
}`
      },
      {
        id: 'usememo-vs-usecallback',
        heading: '2. What is the Difference Between useMemo and useCallback?',
        content: `Both hooks optimize performance via memoization, but target different elements:
• \`useMemo\`: Memoizes the **result of a calculation**. It recomputes only when dependencies change.
• \`useCallback\`: Memoizes a **function definition** itself between renders, preventing child re-renders caused by new function references (\`React.memo\`).`,
        code: `import React, { useState, useMemo, useCallback } from 'react';

function ProductCatalog({ products, onSelect }) {
  const [filterText, setFilterText] = useState('');

  // useMemo: caches the filtered array result
  const filtered = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));
  }, [products, filterText]);

  // useCallback: preserves stable function reference
  const handleSelect = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  return <ChildList items={filtered} onItemClick={handleSelect} />;
}`
      },
      {
        id: 'react-server-components',
        heading: '3. React Server Components (RSC) vs Client Components',
        content: `React Server Components execute exclusively on the server and ship **0 KB of JavaScript** to the browser.
• **Server Components:** Can query databases directly, read file systems, and keep server tokens secure.
• **Client Components:** Use the \`'use client'\` directive to enable browser hooks (\`useState\`, \`useEffect\`) and DOM event listeners.`,
        code: `// Server Component (Default in modern React frameworks)
import db from '@/lib/database';
import ClientButton from './ClientButton';

export default async function UserProfile({ userId }) {
  // Direct database query on server - zero client JS!
  const user = await db.users.findUnique({ where: { id: userId } });

  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <ClientButton userId={user.id} />
    </div>
  );
}`
      },
      {
        id: '10-questions-overview',
        heading: '4. Complete 10-Question Technical Breakdown',
        content: `Explore all ten questions with expandable deep-dives, production code snippets, and difficulty ratings in our interactive technical matrix below.`
      }
    ],
    interactiveType: 'react-accordion'
  },

  'behavioral-questions-preparation': {
    id: 'behavioral-questions-preparation',
    slug: 'behavioral-questions-preparation',
    aliases: ['behavioral-questions-preparation', 'behavioral-guide', 'star-method-guide'],
    title: "Behavioral Questions Preparation Guide",
    category: 'Behavioral',
    tag: 'Behavioral',
    readTime: '6 min read',
    image: '/tips/behavioral-guide.jpg',
    summary: 'Master the STAR methodology for Amazon Leadership Principles, Google Googlyness, and engineering behavioral rounds.',
    author: 'Senior Engineering Manager',
    publishedDate: 'Behavioral Mastery Series',
    formula: 'Situation (15%) → Task (15%) → Action (50%) → Result (20%)',
    keyTakeaways: [
      "Dedicate at least 50% of your time to the Action step, highlighting your specific technical decisions.",
      "Say 'I' instead of 'we' to make your individual contribution unmistakably clear.",
      "Always quantify the Result with concrete numbers: latency drop, dollars saved, or user counts.",
      "Conclude with a retrospective reflection: what you learned and how it made you a better engineer."
    ],
    sections: [
      {
        id: 'star-method-architecture',
        heading: '1. Mastering the STAR Method for Technical Engineers',
        content: `Technical behavioral rounds evaluate how you handle conflict, pressure, system failures, and trade-offs. The STAR structure keeps your story structured:
• **Situation (15%):** Provide concise context: company, timeline, and the business constraint.
• **Task (15%):** Define your specific objective, deadlines, and technical obstacles.
• **Action (50%):** Detail your technical diagnostics, architecture decisions, and teamwork. Use "I", not "we".
• **Result (20%):** Share measurable technical outcomes (speed, uptime, dollars) and retrospective insights.`,
        callout: {
          type: 'tip',
          title: 'The Golden Ratio',
          text: 'Spend no more than 30 seconds setting up the problem. The interviewer cares most about what YOU did to solve it.'
        }
      },
      {
        id: 'star-outage-example',
        heading: '2. Scenario 1: Handling a Critical Production Outage (Ownership)',
        content: `**Question:** "Tell me about a time you handled a critical system outage or made a high-stakes engineering mistake."`,
        code: `[Situation]: "During a major Black Friday sale, our authentication service suffered sudden Redis connection timeouts, resulting in an 8% spike in login failures."
[Task]:      "As the on-call engineer, I had to identify the root cause and restore zero-downtime logins within a strict 2-hour SLA."
[Action]:    "I stood up a blameless war room, analyzed APM traces, and identified connection pool exhaustion. I patched our client pool configuration, deployed an exponential backoff with jitter, and enabled an automatic circuit breaker fallback."
[Result]:    "Within 45 minutes, error rates dropped to 0.01%, protecting an estimated $40,000 in checkout revenue. I followed up by writing a comprehensive post-mortem and adding automated latency alerts."`
      },
      {
        id: 'star-conflict-example',
        heading: '3. Scenario 2: Technical Disagreement & Consensus (Collaboration)',
        content: `**Question:** "Tell me about a time you had a technical disagreement with a team member."`,
        code: `[Situation]: "Our team was split on whether to migrate our state management to Redux Toolkit or Zustand for a new client dashboard."
[Task]:      "As lead developer on the feature, I needed to resolve the deadlock without causing team friction or delaying our quarterly sprint."
[Action]:    "Rather than debating opinions, I created a time-boxed spike: I built a prototype of the most complex view in both libraries and benchmarked bundle size, boilerplate lines of code, and developer ergonomics. I presented the empirical data to the team."
[Result]:    "The team unanimously agreed on Zustand, saving 14kB of bundle size and accelerating feature velocity by 20%. The discussion built mutual respect across the team."`
      }
    ],
    interactiveType: 'star-builder'
  },

  'ats-resume-secrets': {
    id: 'ats-resume-secrets',
    slug: 'ats-resume-formatting-secrets',
    aliases: ['ats-resume-formatting-secrets', 'ats-resume-secrets', 'resume-formatting'],
    title: "ATS Resume Formatting Secrets from FAANG Recruiters",
    category: 'Resume',
    tag: 'Resume',
    readTime: '7 min read',
    image: '/tips/resume-secrets.jpg',
    summary: 'The technical rules for beating Applicant Tracking Systems like Workday, Greenhouse, and Lever.',
    author: 'Senior Technical Talent Partner',
    publishedDate: 'ATS Compliance Manual',
    formula: 'Single-Column Layout → Standard Headings → Quantified XYZ Bullets → Text-Searchable PDF',
    keyTakeaways: [
      "Avoid multi-column templates or Canva designs; ATS screeners parse horizontally across columns.",
      "Stick strictly to standard headers: Work Experience, Technical Skills, Education, Projects.",
      "Use Google's XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
      "Export as a clean text-selectable PDF and verify that text can be highlighted and copied cleanly."
    ],
    sections: [
      {
        id: 'why-canva-fails-ats',
        heading: '1. Why Multi-Column Canva Resumes Fail ATS Screeners',
        content: `Modern ATS software (Workday, Taleo, Greenhouse) extracts plain text streams from PDFs. When an ATS encounters multi-column layouts, floating graphic text boxes, or tables, it reads horizontally across columns. This blends job titles with company descriptions and scraps your skills into gibberish.
A clean, single-column resume format ensures 100% parse rate accuracy across every enterprise ATS.`,
        callout: {
          type: 'warning',
          title: 'ATS Reality Check',
          text: 'Over 75% of qualified engineering resumes are disqualified before human review due to unparseable formatting errors.'
        }
      },
      {
        id: 'google-xyz-formula',
        heading: '2. The Google XYZ Bullet Point Formula',
        content: `Every bullet point under your work experience should follow Google's proven structure:
**"Accomplished [X], as measured by [Y], by doing [Z]."**`,
        code: `// BAD (Weak, passive):
- Responsible for working on backend APIs and fixing database bugs.

// GOOD (Google XYZ Formula with metrics & tech stack):
- Architected 14 RESTful microservices in Node.js and PostgreSQL, processing 2.4M daily requests with 99.98% uptime and 42ms p99 latency.`
      },
      {
        id: 'ats-compliant-template',
        heading: '3. ATS-Compliant Markdown Resume Structure',
        content: `Use universal headers so ATS parsers map your data with 100% fidelity:`,
        code: `## JANE DOE
Full Stack Software Engineer | jane@example.com | github.com/janedoe

### TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3
- Frameworks: React.js, Next.js, Node.js, Express, Tailwind CSS
- Databases & Cloud: PostgreSQL, Supabase, Redis, Docker, Git, CI/CD

### WORK EXPERIENCE
**Software Engineer** | Acme Tech | 2024 - Present
- Engineered responsive React dashboards reducing initial page load by 32%.
- Built high-throughput REST APIs handling 50k daily active users with Node.js.`
      }
    ],
    interactiveType: 'ats-checklist'
  },

  'salary-negotiation-guide': {
    id: 'salary-negotiation-guide',
    slug: 'salary-negotiation-and-answering-expected-salary',
    aliases: ['salary-negotiation-and-answering-expected-salary', 'salary-negotiation-guide', 'salary-negotiation'],
    title: "Salary Negotiation & Answering Expected Salary",
    category: 'HR',
    tag: 'HR',
    readTime: '5 min read',
    image: '/tips/salary-negotiation.jpg',
    summary: 'Tactful scripts and psychological strategies to deflect early salary questions and maximize your total compensation package.',
    author: 'Executive Compensation Advisor',
    publishedDate: 'Career Negotiation Playbook',
    formula: 'Deflection & Market Alignment → Total Comp Evaluation → Collaborative Counter',
    keyTakeaways: [
      "Never name a specific number or state your current salary during initial phone screens.",
      "Ask for the company's approved salary band: 'What is the target range for this role?'.",
      "Always negotiate on Total Compensation (Base + Equity + Signing Bonus + Performance).",
      "Negotiate collaboratively in writing with genuine appreciation for the offer."
    ],
    sections: [
      {
        id: 'the-cardinal-rule',
        heading: '1. The Cardinal Rule: Never Name a Number First',
        content: `In early phone screeners, recruiters often ask: *"What are your salary expectations?"*. Naming a number too early caps your upper ceiling and puts you at a disadvantage before you have demonstrated technical value.
By politely deflecting and asking for their approved budget band, you preserve your leverage while remaining professional and respectful.`,
        callout: {
          type: 'tip',
          title: 'Recruiter Expectation',
          text: 'Recruiters expect top candidates to negotiate. A polite, data-backed counter-offer increases their respect for your caliber.'
        }
      },
      {
        id: 'phone-screen-deflection-script',
        heading: '2. Phone Screen Deflection Script',
        content: `Use this polite, collaborative script when asked for your salary expectations in initial rounds:`,
        code: `"I'm primarily focused on finding the right role where I can deliver maximum engineering impact and grow with the team. 

As I learn more about the scope and technical challenges of the position, I'm confident we can agree on a package that reflects fair market value for this level. Could you share the approved budget range for this position?"`
      },
      {
        id: 'counter-offer-email-script',
        heading: '3. Written Counter-Offer Email Template',
        content: `When you receive the written offer, buy 48 hours to evaluate total compensation and respond with this proven template:`,
        code: `Subject: Re: Job Offer - Software Engineer - Jane Doe

Hi [Recruiter Name],

Thank you so much for extending the offer to join [Company]! I am genuinely thrilled about the team's engineering mission and the chance to contribute to [Specific Project].

Based on my background architecting high-scale distributed systems and current market data for this tier in our region, I was targeting a base salary of $X [or a signing bonus of $Y].

If we can reach that figure, I would be thrilled to sign the offer immediately and begin onboarding. Thank you again for your partnership!

Warm regards,
Jane Doe`
      }
    ],
    interactiveType: 'salary-simulator'
  },

  'junior-to-senior-transition': {
    id: 'junior-to-senior-transition',
    slug: 'transitioning-from-junior-to-senior-software-engineer',
    aliases: ['transitioning-from-junior-to-senior-software-engineer', 'junior-to-senior-transition', 'junior-to-senior'],
    title: "Transitioning from Junior to Senior Software Engineer",
    category: 'Career Growth',
    tag: 'Career Growth',
    readTime: '9 min read',
    image: '/tips/career-growth.jpg',
    summary: 'The mental and technical shift from writing code to driving technical consensus, architecting resilient systems, and mentoring junior engineers.',
    author: 'VP of Engineering',
    publishedDate: 'Engineering Leadership Series',
    formula: 'Coding Execution → Systems Thinking → Team Multiplication → Production Ownership',
    keyTakeaways: [
      "Shift focus from 'How do I code this?' to 'Should we build this, buy it, or simplify it?'.",
      "Write design docs (RFCs) that anticipate failure modes, capacity limits, and rollback plans.",
      "Act as a team multiplier through empathetic code reviews, mentorship, and unblocking teammates.",
      "Take extreme ownership of production systems: monitoring, alerting, observability, and blameless post-mortems."
    ],
    sections: [
      {
        id: 'the-4-key-shifts',
        heading: '1. The 4 Key Shifts from Junior to Senior',
        content: `A senior engineer is defined not by typing speed, but by minimizing rework and multiplying team velocity:
1. **From Coding Features → Designing Systems:** Juniors ask *"How do I code this?"*; seniors ask *"Should we build this, buy it, or simplify requirements?"*.
2. **From Waiting for Tasks → Driving Business Impact:** Proactively spotting bottlenecks and tech debt before they cause production outages.
3. **From Solo Contributor → Team Multiplier:** Conducting constructive code reviews, unblocking colleagues, and writing clear RFC documentation.
4. **Production Ownership:** Building observability, alerting, and failure recovery protocols.`,
        callout: {
          type: 'tip',
          title: 'Career Milestones',
          text: 'Promotion to Senior is not about seniority in years; it is about autonomy, technical judgment, and elevating everyone around you.'
        }
      },
      {
        id: 'writing-effective-rfcs',
        heading: '2. Writing an Effective RFC (Request for Comments)',
        content: `Senior engineers build consensus through written architectural proposals:`,
        code: `## RFC: Real-Time Notification Architecture
**Author:** Jane Doe | **Status:** Proposed | **Date:** 2026-10-11

### 1. Problem Statement & Goals
Our polling mechanism generates 400 unnecessary requests/sec per user, causing high database load.

### 2. Proposed Architecture
Migrate to WebSocket server backed by Redis Pub/Sub cluster.

### 3. Trade-offs & Alternatives Considered
- SSE (Server-Sent Events): Simpler, but lacks bidirectional channel for future chat feature.
- Long Polling: Retains high connection overhead.

### 4. Rollout & Disaster Recovery Plan
Feature flag rollout (10% -> 50% -> 100%) with automated fallback to polling if socket disconnects.`
      }
    ],
    interactiveType: 'senior-assessment'
  },

  'questions-to-ask-interviewer': {
    id: 'questions-to-ask-interviewer',
    slug: 'the-5-questions-you-must-ask-your-interviewer-at-the-end',
    aliases: ['the-5-questions-you-must-ask-your-interviewer-at-the-end', 'questions-to-ask-interviewer', '5-questions-to-ask-interviewer'],
    title: "The 5 Questions You Must Ask Your Interviewer at the End",
    category: 'General Tips',
    tag: 'General',
    readTime: '4 min read',
    image: '/tips/questions-to-ask.jpg',
    summary: 'Turn the tables and leave a lasting impression by asking high-level architectural, CI/CD velocity, and team culture questions.',
    author: 'Principal Technical Recruiter',
    publishedDate: 'Interview Strategy Series',
    formula: 'Engineering Velocity → Technical Debt Management → Team Vision Alignment',
    keyTakeaways: [
      "Never say 'No, I don't have any questions' — it signals disinterest or passivity.",
      "Ask technical depth questions that demonstrate you think like an active team engineer.",
      "Inquire about release pipelines, technical debt allocation, and incident response culture.",
      "Listen actively and follow up organically to turn the closing minutes into a genuine peer conversation."
    ],
    sections: [
      {
        id: 'why-having-questions-matters',
        heading: '1. Why "I Have No Questions" Hurts Your Chances',
        content: `When the interviewer asks *"Do you have any questions for me?"*, replying *"No, I think you covered everything"* signals a lack of curiosity or passive mindset. Great engineers interview the company as much as the company interviews them.
Asking high-level engineering questions positions you as a thoughtful, proactive peer rather than just a task worker.`,
        callout: {
          type: 'tip',
          title: 'Psychological Signal',
          text: 'The questions you ask reveal how you think about software architecture, engineering standards, and team collaboration.'
        }
      },
      {
        id: 'the-5-core-questions',
        heading: '2. The 5 High-Impact Questions & What Signals They Send',
        content: `Here are the 5 questions to ask and the exact positive signals they convey to the hiring team:`,
        code: `// Question 1: DevOps & Deployment Velocity
"What does the typical deployment pipeline look like from a merged PR to production, and how do you handle database rollbacks?"
-> Signal: You care about release velocity, automated testing, and CI/CD discipline.

// Question 2: Technical Debt Management
"How does the team balance shipping new product features with paying down technical debt and refactoring?"
-> Signal: You understand long-term maintainability and software engineering lifecycle.

// Question 3: Recent Architectural Hurdles
"What is the most complex engineering challenge the team solved in the last six months, and what did you learn from it?"
-> Signal: You have genuine intellectual curiosity about their technology stack.

// Question 4: Measuring Exceptional Performance
"What separates a good engineer from a truly exceptional one on this team in their first six months?"
-> Signal: You are ambitious and goal-oriented.

// Question 5: Culture & Retention
"What initially brought you to this company, and what has kept you engaged here?"
-> Signal: Builds warm, authentic personal rapport with the interviewer.`
      }
    ],
    interactiveType: 'saved-questions'
  },

  'system-design-architecture-framework': {
    id: 'system-design-architecture-framework',
    slug: 'mastering-system-design-the-4-step-architecture-framework',
    aliases: ['mastering-system-design-the-4-step-architecture-framework', 'system-design-architecture-framework', 'system-design'],
    title: "Mastering System Design: The 4-Step Architecture Framework",
    category: 'Technical',
    tag: 'Technical',
    readTime: '10 min read',
    image: '/tips/system-design.jpg',
    summary: 'A step-by-step blueprint for scaling services to 10M requests: Requirements, High-Level Architecture, Deep-Dive, and Bottlenecks.',
    author: 'Principal Systems Architect',
    publishedDate: 'System Design Masterclass',
    formula: 'Functional/Non-Functional Scope → High-Level Blocks → Deep-Dive Tiers → Bottlenecks & Scale',
    keyTakeaways: [
      "Always spend the first 5 minutes agreeing on Functional and Non-Functional scale requirements.",
      "Draw end-to-end tiers: Client → CDN → DNS → Load Balancer → Stateless Microservices → Cache → Sharded DB.",
      "Use the Cache-Aside pattern with TTLs to protect databases from read-heavy traffic.",
      "Address single points of failure (SPOFs) with multi-region database replicas and circuit breakers."
    ],
    sections: [
      {
        id: 'step-1-scope-and-scale',
        heading: '1. Step 1: Scope & Scale Estimation (First 5 Mins)',
        content: `Never start drawing boxes immediately. Agree on requirements and scale calculations first:
• **Functional Requirements:** e.g., Shorten long URLs, redirect to original URL, custom alias support.
• **Non-Functional Requirements:** 100M new URLs/month, 10:1 Read-to-Write ratio, <50ms read latency, 99.99% availability.
• **Calculations:** Write QPS = 100M / (30 days * 86,400s) ≈ 40 writes/sec. Read QPS = 400 reads/sec. Storage: 100M * 500 bytes = 50GB/month (3TB over 5 years).`,
        callout: {
          type: 'tip',
          title: 'Interview Best Practice',
          text: 'Write your math clearly on the whiteboard or virtual canvas. Demonstrating capacity estimation shows senior architectural maturity.'
        }
      },
      {
        id: 'step-2-high-level-architecture',
        heading: '2. Step 2: High-Level Architecture Block Diagram',
        content: `Sketch the clean end-to-end tiers from clients to storage:`,
        code: `[Client Apps (Mobile / Web)]
           │
           ▼
[Cloudflare CDN & DDoS Protection]
           │
           ▼
[AWS ALB (Round-Robin Load Balancer)]
           │
     ┌─────┴─────────────────────┐
     ▼                           ▼
[Auth Service]           [Feed Service (Stateless Node.js)]
     │                           │
[PostgreSQL (Users)]     ┌───────┴───────────────────┐
                         ▼                           ▼
                  [Redis Cache Cluster]       [Kafka Event Stream]
                         │                           │
                         ▼                           ▼
                  [PostgreSQL Sharded]        [Elasticsearch Worker]`
      },
      {
        id: 'step-3-cache-aside-pattern',
        heading: '3. Step 3: Cache-Aside Implementation Pattern',
        content: `Cache-Aside pattern prevents database saturation during high traffic:`,
        code: `async function getShortUrl(shortKey) {
  // 1. Read from Redis Cache
  const cachedUrl = await redis.get(\`url:\${shortKey}\`);
  if (cachedUrl) {
    return cachedUrl; // Cache Hit (~2ms)
  }

  // 2. Cache Miss -> Query Database
  const record = await db.query('SELECT original_url FROM urls WHERE short_key = $1', [shortKey]);

  if (record && record.rows.length > 0) {
    const originalUrl = record.rows[0].original_url;
    // 3. Write to Cache with TTL (24 Hours)
    await redis.setex(\`url:\${shortKey}\`, 86400, originalUrl);
    return originalUrl;
  }

  return null;
}`
      },
      {
        id: 'step-4-bottlenecks-and-fault-tolerance',
        heading: '4. Step 4: Bottlenecks & Fault Tolerance',
        content: `Address Single Points of Failure (SPOF) and scaling limits:
• **Database Sharding:** Hash partition by \`short_key\` or \`user_id\` across 4 database shards to distribute write load.
• **Read Replicas:** 3 asynchronous read replicas per shard to handle 90% read traffic.
• **Rate Limiting:** Token Bucket rate limiter at the API gateway to prevent denial-of-service abuse.
• **Circuit Breakers:** Exponential backoff with jitter to prevent cascading microservice timeouts.`
      }
    ],
    interactiveType: 'system-design'
  }
};

// Helper function to resolve article by ID or slug
export const getArticleBySlugOrId = (identifier) => {
  if (!identifier) return null;
  const norm = identifier.toLowerCase().trim();

  // Exact ID match
  if (INTERVIEW_ARTICLES[norm]) {
    return INTERVIEW_ARTICLES[norm];
  }

  // Search by slug or aliases
  const found = Object.values(INTERVIEW_ARTICLES).find(art => 
    art.id === norm ||
    art.slug === norm ||
    (art.aliases && art.aliases.includes(norm))
  );

  return found || null;
};
