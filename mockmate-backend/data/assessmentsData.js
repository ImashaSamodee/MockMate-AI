// mockmate-backend/data/assessmentsData.js
// Standardized technical & leadership certification assessments

const ASSESSMENTS = [
    {
        id: 'react-frontend-specialist',
        title: 'Advanced React.js & Frontend Architecture',
        category: 'Web Development',
        level: 'Senior Level',
        durationMinutes: 15,
        passMark: 75, // 75% needed to pass
        attemptLimit: 3,
        eligibility: 'Open to all candidates mastering modern React & JavaScript',
        skills: ['React 19', 'Virtual DOM & Fiber', 'Hooks & Memoization', 'Server Components', 'State Management'],
        certificateTitle: 'Senior React.js Engineering Proficiency',
        gradeTitle: 'Senior Level (Verified)',
        description: 'Rigorous assessment evaluating Virtual DOM diffing, Fiber cooperative scheduling, custom hooks, Server Actions, and rendering optimization.',
        questions: [
            {
                id: 'q1',
                question: 'How does React’s Fiber engine improve performance compared to the legacy stack reconciler?',
                options: [
                    'It compiles React JSX directly into machine bytecode at build time.',
                    'It splits rendering into an asynchronous, interruptible render phase and a synchronous commit phase, preventing UI frame drops.',
                    'It runs all state updates synchronously on a web worker thread.',
                    'It completely bypasses the browser DOM by drawing directly onto an HTML5 Canvas element.'
                ],
                correctIndex: 1,
                explanation: 'Fiber breaks rendering work into incremental units, allowing React to pause and yield execution for user interactions and animations during the render phase, and flush DOM mutations synchronously in the commit phase.'
            },
            {
                id: 'q2',
                question: 'When should useCallback be utilized rather than standard inline function definitions?',
                options: [
                    'On every single function inside a React component to maximize execution speed.',
                    'Only when preserving referential equality of callbacks passed to memoized children (React.memo) or dependency arrays.',
                    'To automatically cancel asynchronous network promises when a component unmounts.',
                    'To serialize function definitions into localStorage between browser reloads.'
                ],
                correctIndex: 1,
                explanation: 'useCallback memoizes the function reference itself. It has memory overhead and should only be used when passing functions to optimized memoized children or in dependency arrays.'
            },
            {
                id: 'q3',
                question: 'What is a core architectural difference of React Server Components (RSC) in React 19 / Next.js?',
                options: [
                    'They run in the browser after a 2-second timeout.',
                    'They execute strictly on the server and send 0 KB of component JavaScript to the client browser.',
                    'They must always use useState and useEffect to manage component lifecycles.',
                    'They require client-side WebAssembly to execute in production.'
                ],
                correctIndex: 1,
                explanation: 'Server Components execute exclusively on the server, can directly query databases, and ship zero JavaScript bundle to the client.'
            },
            {
                id: 'q4',
                question: 'Why is using array index as a "key" prop discouraged when rendering dynamic lists in React?',
                options: [
                    'React throws an unrecoverable runtime exception if index is an integer.',
                    'Array indices cause keys to shift when items are reordered or deleted, resulting in stale component state and unnecessary DOM re-renders.',
                    'It slows down CSS styling animations.',
                    'Browsers do not support numbers in HTML data attributes.'
                ],
                correctIndex: 1,
                explanation: 'Using indices confuses React’s reconciliation algorithm when items are sorted, prepended, or removed, leading to UI bugs and broken local component state.'
            },
            {
                id: 'q5',
                question: 'How does automatic batching behave in React 18 & 19 for state updates inside async promises or setTimeout?',
                options: [
                    'Updates inside promises are never batched and always trigger multiple re-renders.',
                    'All state updates within async calls, timeouts, and native events are grouped together into a single render pass.',
                    'Only the first state update executes; subsequent updates are discarded.',
                    'Batching requires wrapping updates manually in ReactDOM.unstable_batchedUpdates.'
                ],
                correctIndex: 1,
                explanation: 'React 18 & 19 introduced universal automatic batching across all asynchronous callbacks, promises, and timeouts.'
            },
            {
                id: 'q6',
                question: 'What is the primary trade-off when selecting React Context API vs an external store like Zustand for high-frequency state updates?',
                options: [
                    'Context API cannot store strings or numbers.',
                    'Context API lacks selective subscription; any update re-renders all consuming components regardless of whether their specific slice changed.',
                    'Zustand requires compiling Node.js on the client.',
                    'Context API does not work in functional components.'
                ],
                correctIndex: 1,
                explanation: 'Context API triggers re-renders on every consumer when the provider value changes. Zustand supports selector-based subscriptions to prevent unnecessary sub-tree re-renders.'
            }
        ]
    },
    {
        id: 'node-backend-architect',
        title: 'Node.js & Scalable Backend Engineering',
        category: 'Backend',
        level: 'Senior Level',
        durationMinutes: 15,
        passMark: 75,
        attemptLimit: 3,
        eligibility: 'Open to all candidates with backend engineering experience',
        skills: ['Node.js', 'libuv Event Loop', 'Streams & Backpressure', 'PostgreSQL', 'Microservices'],
        certificateTitle: 'Senior Node.js Backend Engineering Proficiency',
        gradeTitle: 'Senior Level (Verified)',
        description: 'Comprehensive test assessing asynchronous I/O, event loop phases, stream backpressure, database connection pooling, and resilient microservice design.',
        questions: [
            {
                id: 'q1',
                question: 'How does Node.js handle non-blocking I/O operations under the hood?',
                options: [
                    'By spawning a separate operating system process for every incoming HTTP request.',
                    'Through the libuv library, which abstracts the OS event notification systems (epoll/kqueue) and maintains a background thread pool for blocking tasks.',
                    'By pausing JavaScript execution until the filesystem returns data.',
                    'By compiling Node.js into multi-threaded Java bytecode.'
                ],
                correctIndex: 1,
                explanation: 'Node.js delegates asynchronous I/O to libuv, utilizing OS non-blocking primitives and a worker thread pool for filesystem/crypto calls.'
            },
            {
                id: 'q2',
                question: 'What is "backpressure" in Node.js streams and how is it properly managed?',
                options: [
                    'Network packet loss caused by physical router buffer overflows.',
                    'A condition where the data producer reads faster than the consumer can write; managed by pausing reads until the drain event fires or using pipeline().',
                    'CPU overheating during heavy JSON parsing operations.',
                    'An error that occurs when a database transaction is rolled back.'
                ],
                correctIndex: 1,
                explanation: 'Backpressure occurs when the read buffer fills faster than the write stream can flush to disk/socket. stream.pipeline() automatically handles backpressure and cleans up stream handles.'
            },
            {
                id: 'q3',
                question: 'Which event loop phase executes process.nextTick callbacks?',
                options: [
                    'The Poll phase after I/O polling completes.',
                    'The Close callbacks phase.',
                    'Immediately after the currently running JavaScript operation completes, before the event loop advances to the next phase.',
                    'Only during garbage collection cycles.'
                ],
                correctIndex: 2,
                explanation: 'process.nextTick is part of the microtask queue and runs immediately after the current operation finishes, before the event loop moves to the next phase.'
            },
            {
                id: 'q4',
                question: 'Why should database connection pools be preferred over opening a new TCP connection per HTTP request?',
                options: [
                    'Opening TCP and TLS handshakes per request incurs severe CPU and latency overhead and risks exhausting database connection limits.',
                    'Databases do not support more than one simultaneous connection.',
                    'Connection pools automatically rewrite SQL queries into faster NoSQL lookups.',
                    'TCP connections are only permitted on port 80.'
                ],
                correctIndex: 0,
                explanation: 'Database connection pools reuse established TCP/auth connections, avoiding latency spikes and protecting the database from connection exhaustion.'
            },
            {
                id: 'q5',
                question: 'How should CPU-intensive workloads (such as image processing or heavy cryptography) be handled in a production Node.js service?',
                options: [
                    'Run them on the main event loop thread using a while(true) loop.',
                    'Offload to Worker Threads, dedicated background microservices, or an asynchronous message queue worker.',
                    'Wrap them inside a setTimeout(fn, 0) timer.',
                    'Increase the size of V8 heap memory with --max-old-space-size.'
                ],
                correctIndex: 1,
                explanation: 'CPU-heavy work blocks the single-threaded Node event loop. Offloading to Worker Threads or async queues prevents blocking incoming I/O.'
            },
            {
                id: 'q6',
                question: 'What is the purpose of a circuit breaker pattern in microservices communication?',
                options: [
                    'To encrypt passwords using SHA-256 before storing.',
                    'To automatically trip open when a downstream service fails repeatedly, preventing cascading timeouts and returning an immediate graceful fallback.',
                    'To block unauthorized HTTP headers from reaching the web server.',
                    'To automatically restart the cloud virtual machine.'
                ],
                correctIndex: 1,
                explanation: 'Circuit breakers monitor failure rates and fail fast when downstream services are unhealthy, giving them time to recover without bringing down the caller.'
            }
        ]
    },
    {
        id: 'system-design-proficiency',
        title: 'Distributed System Design & Architecture',
        category: 'System Design',
        level: 'Staff Level',
        durationMinutes: 20,
        passMark: 80,
        attemptLimit: 3,
        eligibility: 'Recommended for mid to senior engineers preparing for architectural rounds',
        skills: ['Load Balancers', 'Redis Caching', 'Microservices', 'Database Sharding', 'Event-Driven Systems'],
        certificateTitle: 'Distributed System Design & High Scale Architecture',
        gradeTitle: 'Staff Level Ownership',
        description: 'Elite architecture assessment covering scalability, high availability, database partitioning, Cache-Aside strategies, and CAP theorem trade-offs.',
        questions: [
            {
                id: 'q1',
                question: 'In a read-heavy web system (95% reads, 5% writes), which architectural strategy provides the greatest reduction in database latency?',
                options: [
                    'Replacing all relational databases with flat CSV files on local disk.',
                    'Implementing a Cache-Aside distributed caching tier (e.g. Redis) backed by asynchronous read replicas.',
                    'Increasing the HTTP timeout from 5 seconds to 60 seconds.',
                    'Converting all REST APIs to synchronous SOAP XML protocols.'
                ],
                correctIndex: 1,
                explanation: 'Caching hot data in-memory via Redis reduces read latency to sub-millisecond levels and offloads queries from database replicas.'
            },
            {
                id: 'q2',
                question: 'What is the primary purpose of consistent hashing when distributing keys across a cluster of caching nodes?',
                options: [
                    'To encrypt all cached keys using AES-256.',
                    'To minimize the number of keys that must be remapped when a node is added or removed from the cluster.',
                    'To guarantee that every key has the exact same byte length.',
                    'To prevent network socket disconnections.'
                ],
                correctIndex: 1,
                explanation: 'Consistent hashing maps keys to a virtual ring so that adding or removing a node only re-allocates K/N keys on average, preventing massive cache stampedes.'
            },
            {
                id: 'q3',
                question: 'According to the CAP Theorem, what guarantee must a distributed system sacrifice during a network partition (P)?',
                options: [
                    'Either Consistency (all nodes see the exact same data simultaneously) or Availability (every non-failing node returns a response).',
                    'Persistence of data to disk.',
                    'Network bandwidth speeds.',
                    'HTTPS SSL certification.'
                ],
                correctIndex: 0,
                explanation: 'When network partitions occur, distributed systems must trade off strict consistency (CP) for high availability (AP), or vice versa.'
            },
            {
                id: 'q4',
                question: 'How does database sharding differ from read replication?',
                options: [
                    'Sharding only works on MySQL; replication only works on PostgreSQL.',
                    'Replication duplicates the entire dataset to multiple nodes for read scalability; sharding partitions different subsets of data across multiple nodes for write scalability.',
                    'Sharding deletes historical records; replication preserves them.',
                    'They are identical terms with no architectural distinction.'
                ],
                correctIndex: 1,
                explanation: 'Read replicas hold identical copies to distribute read load. Sharding horizontally partitions rows across disparate database instances to distribute write load and storage limits.'
            },
            {
                id: 'q5',
                question: 'What mechanism prevents double-spending or duplicate charges during payment processing when network timeouts occur?',
                options: [
                    'Retrying the request 100 times without delay.',
                    'Idempotency keys: assigning a unique client-generated token that the server checks in a transactional store before executing charges.',
                    'Storing credit card numbers in plaintext in browser cookies.',
                    'Disabling HTTP keep-alive.'
                ],
                correctIndex: 1,
                explanation: 'Idempotency keys ensure that retried payment requests execute exactly once even if network timeouts disconnect the client.'
            },
            {
                id: 'q6',
                question: 'What is the role of an asynchronous event stream (e.g. Apache Kafka or RabbitMQ) in a microservices ecosystem?',
                options: [
                    'To replace CSS stylesheets across client browsers.',
                    'To decouple producer and consumer services, buffer traffic spikes, and guarantee reliable asynchronous event delivery.',
                    'To directly serve static image assets to users.',
                    'To automatically generate SQL database schemas.'
                ],
                correctIndex: 1,
                explanation: 'Message brokers decouple microservices, buffer burst traffic, and allow consumer services to process events at their own pace.'
            }
        ]
    },
    {
        id: 'javascript-runtime-core',
        title: 'Advanced JavaScript (ES6+ & V8 Runtime Engine)',
        category: 'Programming',
        level: 'Advanced',
        durationMinutes: 15,
        passMark: 75,
        attemptLimit: 3,
        eligibility: 'Open to all developers seeking verified core JavaScript depth',
        skills: ['V8 Engine', 'Event Loop', 'Closures', 'Prototypes', 'Promises & Async'],
        certificateTitle: 'Advanced JavaScript (ES6+ & V8 Runtime Engine)',
        gradeTitle: 'Exceptional (Top 5%)',
        description: 'Rigorous assessment of JavaScript execution contexts, memory heaps, V8 Hidden Classes, prototypal inheritance, and Promise microtasks.',
        questions: [
            {
                id: 'q1',
                question: 'What is a closure in JavaScript and what is a real-world risk associated with misuse?',
                options: [
                    'A way to close browser windows; risk of crashing the operating system.',
                    'A function that retains access to its lexical scope even when executed outside that scope; misuse can retain unwanted references causing memory leaks.',
                    'A private HTML tag that prevents text copying.',
                    'An ES6 feature that disables asynchronous callbacks.'
                ],
                correctIndex: 1,
                explanation: 'Closures bundle a function with its lexical environment. If large parent scope variables are inadvertently referenced by long-lived closures, garbage collection is prevented, causing memory leaks.'
            },
            {
                id: 'q2',
                question: 'Between Promise.then callbacks and setTimeout(fn, 0), which callback executes first when both are queued?',
                options: [
                    'setTimeout executes first because timer callbacks have higher priority.',
                    'Promise.then executes first because Promises are placed in the microtask queue, which is emptied before macrotasks.',
                    'They execute in alphabetical order.',
                    'The browser chooses randomly.'
                ],
                correctIndex: 1,
                explanation: 'Microtasks (Promises, queueMicrotask) are always executed immediately after the current script, before the event loop processes the next macrotask (setTimeout, setInterval).'
            },
            {
                id: 'q3',
                question: 'What is the difference between prototypal inheritance and classical class inheritance?',
                options: [
                    'JavaScript classes are purely syntactic sugar over prototypal delegation; objects inherit directly from other objects via their prototype chain.',
                    'Prototypes only work on Windows; classes work on all platforms.',
                    'Classes are immutable; prototypes cannot be modified.',
                    'Classes require compiling C++ before running.'
                ],
                correctIndex: 0,
                explanation: 'JavaScript is prototypal at its core. ES6 class syntax provides familiar syntax while continuing to utilize prototypal delegation under the hood.'
            },
            {
                id: 'q4',
                question: 'How do V8 Hidden Classes optimize property access on JavaScript objects?',
                options: [
                    'By hashing all property names on every single read.',
                    'By dynamically creating internal shape descriptors for objects that share identical property structures, enabling inline caching.',
                    'By converting all properties to numbers.',
                    'By writing objects to temporary disk files.'
                ],
                correctIndex: 1,
                explanation: 'V8 uses Hidden Classes (Shapes) and Inline Caches to look up object properties in constant time, as long as properties are initialized in consistent orders.'
            },
            {
                id: 'q5',
                question: 'What happens when Promise.all is passed an array of 5 promises and one rejects?',
                options: [
                    'It waits for all 5 to finish and ignores the error.',
                    'It immediately rejects with the error of the first rejected promise (fail-fast behavior).',
                    'It automatically retries the rejected promise 3 times.',
                    'It returns undefined for all promises.'
                ],
                correctIndex: 1,
                explanation: 'Promise.all fails fast upon the first rejection. To wait for all promises regardless of failure, use Promise.allSettled().'
            },
            {
                id: 'q6',
                question: 'Why does "0.1 + 0.2 === 0.3" evaluate to false in JavaScript?',
                options: [
                    'JavaScript integers are 128-bit decimals.',
                    'JavaScript uses IEEE 754 double-precision floating-point numbers, where 0.1 and 0.2 cannot be represented precisely in binary.',
                    'It is a known syntax error in JavaScript.',
                    'Math operations require the BigInt constructor.'
                ],
                correctIndex: 1,
                explanation: 'IEEE 754 binary floating-point representation causes 0.1 + 0.2 to evaluate to 0.30000000000000004, causing strict equality comparison to return false.'
            }
        ]
    },
    {
        id: 'executive-behavioral-leadership',
        title: 'Executive Behavioral & STAR Communication',
        category: 'Leadership',
        level: 'Staff Level',
        durationMinutes: 15,
        passMark: 75,
        attemptLimit: 3,
        eligibility: 'Open to all candidates seeking verified leadership & communication credentials',
        skills: ['STAR Method', 'Conflict Resolution', 'Blameless Post-Mortems', 'Technical Mentorship', 'High Ownership'],
        certificateTitle: 'Executive Behavioral & STAR Communication',
        gradeTitle: 'Staff Level Ownership',
        description: 'Real-world behavioral scenarios evaluating conflict resolution, high ownership during outages, empathetic mentorship, and stakeholder communication.',
        questions: [
            {
                id: 'q1',
                question: 'What is the optimal distribution of time across the STAR method components in a 2-minute answer?',
                options: [
                    'Situation 50%, Task 30%, Action 10%, Result 10%.',
                    'Situation 15%, Task 15%, Action 50%, Result 20%.',
                    'Spend the entire 2 minutes explaining who caused the problem.',
                    'Skip Situation and Task entirely; only give the Result.'
                ],
                correctIndex: 1,
                explanation: 'Hiring managers care most about your personal technical actions (50%) and quantifiable outcomes (20%). Situation and Task should take no more than 30 seconds combined.'
            },
            {
                id: 'q2',
                question: 'During a high-severity production outage, what is the mark of high engineering ownership?',
                options: [
                    'Quickly identifying which colleague pushed the bug and assigning blame in public channels.',
                    'Standing up a collaborative incident triage, communicating transparent updates to stakeholders, resolving the incident, and leading a blameless post-mortem.',
                    'Turning off phone notifications until the sprint review.',
                    'Deploying untested hotfixes directly to production without logging.'
                ],
                correctIndex: 1,
                explanation: 'Extreme ownership means focusing on rapid triage, transparent communication, safeguarding users, and implementing systemic safeguards in a blameless post-mortem.'
            },
            {
                id: 'q3',
                question: 'How should a senior engineer resolve a technical disagreement with a peer over architectural approaches?',
                options: [
                    'Engage in heated arguments until the other engineer gives up.',
                    'Run a time-boxed spike to evaluate both approaches empirically against agreed benchmarks (latency, lines of code, ergonomics) and align objectively.',
                    'Complain to executive leadership to overrule the teammate.',
                    'Silently refactor the teammate’s code in production.'
                ],
                correctIndex: 1,
                explanation: 'Objective data, time-boxed prototypes, and collaborative RFCs remove ego from technical debate and preserve team cohesion.'
            },
            {
                id: 'q4',
                question: 'When asked about a project that failed or missed its delivery deadline, what is the best way to frame your answer?',
                options: [
                    'Explain that management gave unreasonable deadlines and marketing made impossible promises.',
                    'Take accountability for what you controlled, analyze the root cause honestly, and explain concrete practices you instituted to prevent recurrence.',
                    'Deny that the project ever missed its deadline.',
                    'State that you were not involved in any significant way.'
                ],
                correctIndex: 1,
                explanation: 'Interviewers look for self-awareness, accountability, and the ability to convert failures into enduring engineering wisdom.'
            },
            {
                id: 'q5',
                question: 'How should you conduct code reviews to foster psychological safety while maintaining high engineering quality?',
                options: [
                    'Reject pull requests with one-word comments like "Bad" or "Wrong".',
                    'Phrase suggestions collaboratively, explain the underlying technical reasons or trade-offs, praise good solutions, and differentiate blockers from nits.',
                    'Only review code written by friends.',
                    'Approve every pull request without reading it to maximize velocity.'
                ],
                correctIndex: 1,
                explanation: 'Empathetic code reviews teach rather than criticize, distinguishing critical architectural blockers from optional styling suggestions.'
            },
            {
                id: 'q6',
                question: 'When asked "Tell me about yourself" at the start of a technical interview, what should you strictly avoid?',
                options: [
                    'Highlighting your recent software projects and tech stack.',
                    'Chronologically reciting your resume from childhood or stating "I have no experience".',
                    'Explaining why you are excited about this specific engineering team.',
                    'Speaking for 90 seconds in a structured manner.'
                ],
                correctIndex: 1,
                explanation: 'Reciting your CV line-by-line or saying "I have no experience" hurts first impressions. Focus on what you have built and your passion for learning.'
            }
        ]
    }
];

module.exports = { ASSESSMENTS };
