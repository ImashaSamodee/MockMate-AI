import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import InterviewRoom from './components/InterviewRoom';
import AuthModal from './components/AuthModal';
import PracticeTopics from './components/PracticeTopics';
import Progress from './components/Progress';
import Certificates from './components/Certificates';
import CertificateDetail from './components/CertificateDetail';
import PublicVerify from './components/PublicVerify';
import AssessmentsCatalog from './components/AssessmentsCatalog';
import AssessmentRunner from './components/AssessmentRunner';
import ResumeReview from './components/ResumeReview';
import InterviewTips from './components/InterviewTips';
import TipDetail from './components/TipDetail';
import Settings from './components/Settings';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Bell,
  ChevronDown
} from 'lucide-react';

// Wrapper for Dashboard Layout (with Sidebar and Top Header)
const DashboardLayout = ({ children }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userName = user?.name || 'Kasun Silva';
  const userRole = user?.jobRole || 'Full Stack Developer';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-200 selection:text-emerald-950 text-gray-900">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header (Matches Reference Design) */}
        <header className="bg-white border-b border-gray-100 h-20 px-6 sm:px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search for questions, topics or roles.." 
                className="w-full bg-gray-50/80 border border-gray-200/80 rounded-full py-2.5 pl-11 pr-4 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3 group-focus-within:text-emerald-600 transition-colors" />
            </div>
          </div>
          
          <div className="flex items-center gap-5 pl-4">
            {/* Notification Bell with Red Dot */}
            <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100/70 transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>

            {/* User Profile Dropdown Pill */}
            {isAuthenticated ? (
              <div 
                onClick={() => navigate('/settings')}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 pr-2 rounded-2xl transition-colors"
                title="View Settings & Profile"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"}
                  alt="Candidate"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shadow-sm"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                    {userName}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">
                    {userRole}
                  </p>
                </div>
                <ChevronDown size={15} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-xs font-semibold text-gray-700 hover:text-gray-950 px-3 py-2 rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-[#064E3B] text-white text-xs font-semibold px-4 py-2 rounded-full"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Main View */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </main>
    </div>
  );
};





// Route protection: only authenticated (registered & logged-in) users can access dashboard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Please log in to your registered account to access the dashboard.');
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <>
      {/* Global Auth Modal for Register / Login */}
      <AuthModal />

      <Routes>
        {/* Landing Page (matches reference screenshot!) */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Dashboard and App Routes: Only registered & logged-in users can access */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/interview" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InterviewRoom />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/practice" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PracticeTopics />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/progress" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Progress />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/certificates" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Certificates />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/certificates/:id" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CertificateDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/assessments" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AssessmentsCatalog />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/assessments/:id/take" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AssessmentRunner />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Public Verification Route - Accessible to anyone/recruiters */}
        <Route path="/verify" element={<PublicVerify />} />
        <Route path="/verify/:certificateId" element={<PublicVerify />} />

        <Route 
          path="/tips" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InterviewTips />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/interview-tips" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InterviewTips />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tips/:id" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TipDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/interview-tips/:slug" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TipDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/resume" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ResumeReview />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;