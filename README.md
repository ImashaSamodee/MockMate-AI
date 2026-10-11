# MockMate AI 🤖✨
### AI-Powered Interview Coach & Technical Career Platform

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **MockMate AI** is a comprehensive, AI-driven preparation ecosystem designed to help developers and tech professionals master technical interviews, evaluate their coding competencies, receive instant actionable feedback, and earn verifiable industry credentials.

---

## 🌟 Key Features

### 🎙️ 1. Live AI Mock Interviews
- **Realistic Scenario Simulation:** Technical and behavioral interview sessions tailored to candidate seniority (Junior, Mid, Senior, Lead).
- **Domain Specializations:** Full Stack, Frontend, Backend, System Design, DevOps, and Behavioral HR interviews.
- **Intelligent Feedback Engine:** Powered by Google Gemini AI, evaluating technical depth, structured communication (STAR method), and problem-solving velocity.

### 📜 2. Skill Assessments & Verifiable Certificates
- **Timed Assessment Challenges:** Topic-specific assessments with real-world technical problems and automated scoring.
- **Tamper-Proof Verification Registry:** Public verification portal (`/verify/:certificateId`) allowing employers and recruiters to validate credential authenticity.
- **PDF Certificate Generation:** Exportable, print-ready digital certificates generated dynamically using `PDFKit`.

### 📄 3. AI Resume Reviewer & ATS Analyzer
- **Automated Resume Parsing:** Upload and parse PDF resumes directly in-browser.
- **Role Match Score:** Real-time alignment score against selected tech roles (e.g., Full Stack Engineer, Cloud Architect).
- **Gap Analysis & Recommendations:** Actionable advice on missing keywords, bullet point quantification, and layout optimizations.

### 📚 4. Technical Prep Library & Career Articles
- **Deep-Dive Engineering Articles:** Guides on system design trade-offs, algorithms, and interview question deconstructions.
- **Interactive Frameworks:** Step-by-step answer frameworks (e.g., the *Present-Past-Future* 90-second pitch).
- **Curated Practice Bank:** Hundreds of categorized questions with hints, optimal answers, and code snippets.

### ⚙️ 5. Personalized Candidate Settings & Profiles
- **Profile Synchronization:** Manage personal details, current role, target seniority, and biographical info backed by persistent storage.
- **Account Security:** In-app password updates and session security management.

---

## 🏗️ Architecture & Project Structure

MockMate AI is structured as a modular full-stack application:

```text
MockMate-AI/
├── mockmate-frontend/               # React 19 Client (SPA)
│   ├── public/                      # Static assets, hero images, badges
│   ├── src/
│   │   ├── assets/                  # Local media & illustrations
│   │   ├── components/              # Reusable UI & Page components
│   │   │   ├── ArticleWidgets.jsx   # Article sidebar widgets & CTAs
│   │   │   ├── AssessmentRunner.jsx # Timed assessment test taker
│   │   │   ├── CertificateDetail.jsx# Certificate visual preview & export
│   │   │   ├── Certificates.jsx     # Candidate certificates dashboard
│   │   │   ├── Dashboard.jsx        # Candidate command center
│   │   │   ├── Footer.jsx           # Streamlined dark emerald luxury footer
│   │   │   ├── InterviewRoom.jsx    # Live AI interview session interface
│   │   │   ├── InterviewTips.jsx    # Article index & resource center
│   │   │   ├── LandingPage.jsx      # High-conversion public landing page
│   │   │   ├── PublicVerify.jsx     # Public certificate verification
│   │   │   ├── ResumeReview.jsx     # AI resume scanner & ATS score
│   │   │   ├── Settings.jsx         # Candidate profile & account settings
│   │   │   ├── Sidebar.jsx          # Dashboard navigation sidebar
│   │   │   └── TipDetail.jsx        # Rich article reading experience
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Candidate auth & global state
│   │   ├── data/                    # Seed articles and questions data
│   │   ├── App.jsx                  # Main route configuration
│   │   ├── index.css                # Global Tailwind CSS tokens
│   │   └── main.jsx                 # Client entry point
│   ├── package.json
│   └── vite.config.js
│
├── mockmate-backend/                # Node.js & Express API Server
│   ├── data/                        # JSON fallback storage & persistence
│   │   ├── assessment_attempts.json
│   │   ├── assessmentsData.js
│   │   ├── certificates.json
│   │   └── user_profiles.json
│   ├── certificateManager.js        # Credential issuance & verify logic
│   ├── profileManager.js            # User profile data manager
│   ├── schema_certificates.sql      # Supabase SQL schema definitions
│   ├── server.js                    # Core Express server & API endpoints
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── .gitignore                       # Global Git exclusion rules
└── README.md                        # Project documentation
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, React Router v7 |
| **Styling & Design** | Tailwind CSS v4, Lucide React Icons |
| **Data Visualization** | Recharts |
| **Build Tool** | Vite 8 |
| **Backend Runtime** | Node.js, Express 5 |
| **Artificial Intelligence** | Google Gemini Generative AI SDK (`@google/generative-ai`) |
| **Database & Cloud Storage** | Supabase Database / Storage |
| **Document Processing** | Multer (Uploads), PDF-Parse (Resume extraction), PDFKit (Certificate generation) |

---

## 🚀 Getting Started

Follow these instructions to run MockMate AI locally on your development machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (version `v18.0.0` or higher recommended)
- `npm` (version `v9.0.0` or higher)
- A [Google Gemini API Key](https://aistudio.google.com/)
- A [Supabase](https://supabase.com/) project (optional for cloud persistence; local fallback is built-in)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/MockMate-AI.git
cd MockMate-AI
```

---

### 2. Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd mockmate-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from the template:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your API credentials:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   ```
5. Start the backend development server:
   ```bash
   node server.js
   ```
   *The backend will boot up at `http://localhost:5000`.*

---

### 3. Configure Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd mockmate-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web application in your browser:
   ```text
   http://localhost:5173
   ```

---

## 📡 Core API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/interview/chat` | Send interview transcript and receive real-time AI feedback |
| `POST` | `/api/resume/review` | Upload PDF resume for AI parsing and ATS scoring |
| `GET` | `/api/certificates` | Retrieve all certificates for the authenticated user |
| `GET` | `/api/certificates/:id` | Fetch specific certificate details by ID |
| `GET` | `/api/certificates/verify/:id` | Public credential verification endpoint |
| `GET` | `/api/certificates/:id/pdf` | Download officially styled PDF certificate |
| `GET` | `/api/settings/profile` | Retrieve candidate profile and preference settings |
| `PUT` | `/api/settings/profile` | Update profile information and bio |
| `PUT` | `/api/settings/security` | Validate current password and update account security credentials |

---

## 🛡️ Security & Privacy
- **Zero API Key Leakage:** All AI generation and third-party API queries are strictly proxied via the Node.js backend.
- **Credential Integrity:** Public certificate verification relies on deterministic hashes and unique credential tokens (`MM-XX-YYYY-XXXX`).
- **Environment Isolation:** `.env` credentials and temporary upload artifacts are systematically ignored by Git.

---

## 🤝 Contributing

Contributions to enhance MockMate AI are welcomed!

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with 💚 to empower developers and engineer success worldwide.</sub>
  <br />
  <strong>© 2026 MockMate AI. All rights reserved.</strong>
</div>
