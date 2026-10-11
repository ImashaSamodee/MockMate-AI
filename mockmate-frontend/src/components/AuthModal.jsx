import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  GraduationCap,
  AlertCircle
} from 'lucide-react';

const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    authRedirectMessage,
    closeAuthModal, 
    setAuthModalMode, 
    login, 
    register
  } = useAuth();
  
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('Full Stack Web Developer');
  const [experienceLevel, setExperienceLevel] = useState('Junior (1-2 years)');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        if (!email.trim() || !password) {
          setError('Please enter both your email address and password.');
          setLoading(false);
          return;
        }
        await login({ email: email.trim(), password });
        navigate('/dashboard');
      } else {
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
          setError('Please fill in your name, email, password, and confirm password.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please verify your password and re-enter.');
          setLoading(false);
          return;
        }
        await register({ name: name.trim(), email: email.trim(), password, jobRole, experienceLevel });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={closeAuthModal}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Decorator */}
        <div className="bg-gradient-to-r from-[#064E3B] to-[#0A3D2C] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-white text-base">
              M
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                MockMate <span className="text-emerald-400">AI</span>
              </h3>
              <p className="text-xs text-emerald-200">AI-Powered Tech Interview Platform</p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-6 pt-5">
          {authRedirectMessage && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>{authRedirectMessage}</span>
            </div>
          )}

          {/* Modal Title */}
          <div className="mb-5 text-center">
            <h4 className="text-lg font-extrabold text-gray-950 tracking-tight">
              {authModalMode === 'login' ? 'Log In to MockMate AI' : 'Create Your Account'}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {authModalMode === 'login' 
                ? 'Enter your credentials to access your dashboard & certificates' 
                : 'Register to take assessments and earn verified credentials'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{error}</p>
                {authModalMode === 'login' && error.includes('register') && (
                  <button
                    type="button"
                    onClick={() => { setAuthModalMode('register'); setError(''); }}
                    className="font-bold underline text-red-800 mt-1 block cursor-pointer"
                  >
                    Click here to create a new account →
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Kasun Fernando"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target Job Role</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. Full Stack Dev"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        className="w-full pl-9 pr-2 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Experience</label>
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3 top-3.5 text-gray-400" />
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full pl-9 pr-2 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white text-gray-900 cursor-pointer"
                      >
                        <option>Internship</option>
                        <option>Junior (1-2 years)</option>
                        <option>Mid-Level (3-5 years)</option>
                        <option>Senior (5+ years)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                {authModalMode === 'login' && (
                  <button type="button" className="text-xs text-emerald-700 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">Confirm Password</label>
                  {confirmPassword && (
                    <span className={`text-[11px] font-bold ${password === confirmPassword ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 text-gray-900 placeholder:text-gray-400 transition-all ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-400/20' 
                        : 'border-gray-200 focus:border-emerald-600 focus:ring-emerald-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-5 bg-[#064E3B] hover:bg-[#085a44] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : authModalMode === 'login' ? (
                <>
                  <span>Log In to Account</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Create Account & Start</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Note */}
          <div className="mt-5 text-center text-xs text-gray-500">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('register'); setError(''); setPassword(''); setConfirmPassword(''); }}
                  className="font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('login'); setError(''); setPassword(''); setConfirmPassword(''); }}
                  className="font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Log in to your account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
