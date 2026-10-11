// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Settings as SettingsIcon, 
  SlidersHorizontal, 
  Bell, 
  ShieldCheck, 
  Link2, 
  Camera, 
  Check, 
  Plus, 
  X, 
  ExternalLink, 
  KeyRound, 
  Mail, 
  CloudDownload, 
  Trash2, 
  ChevronRight, 
  Briefcase, 
  GraduationCap, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('profile'); // profile | account | preferences | notifications | privacy | integrations

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Profile State
  const [fullName, setFullName] = useState('Imasha Samodee');
  const [emailAddress, setEmailAddress] = useState('imasha@example.com');
  const [targetJobRole, setTargetJobRole] = useState('Full Stack Web Developer');
  const [experienceLevel, setExperienceLevel] = useState('Junior (1-2 years)');
  const [bio, setBio] = useState('Computer Science graduate passionate about full stack development. Interested in learning new technologies and building real-world projects.');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);

  // Skills & Interests
  const [skills, setSkills] = useState(['React.js', 'Node.js', 'JavaScript', 'HTML & CSS', 'MongoDB']);
  const [areasOfInterest, setAreasOfInterest] = useState(['Web Development', 'System Design', 'Database', 'API Development', 'DevOps']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [isAddingInterest, setIsAddingInterest] = useState(false);

  // Avatar Picker Modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Quick Action Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailModalError, setEmailModalError] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Preferences & Toggles
  const [preferences, setPreferences] = useState({
    theme: 'light',
    mockInterviewVoice: 'en-US-Neural (Studio AI)',
    codeEditorTheme: 'vs-dark',
    emailNotifications: true,
    soundEffects: true
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    shareScoresWithRecruiters: false
  });

  // Fetch Profile from Backend
  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const email = user?.email || 'imashasamodee@gmail.com';
      const name = user?.name || 'Imasha Samodee';

      const res = await axios.get(`http://localhost:5000/api/user/profile?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);

      if (res.data && res.data.profile) {
        const p = res.data.profile;
        setFullName(p.name || user?.name || 'Imasha Samodee');
        setEmailAddress(p.email || user?.email || 'imashasamodee@gmail.com');
        setTargetJobRole(p.jobRole || 'Full Stack Web Developer');
        setExperienceLevel(p.experienceLevel || 'Junior (1-2 years)');
        if (p.bio) setBio(p.bio);
        if (p.avatar) setAvatar(p.avatar);
        if (p.skills && p.skills.length > 0) setSkills(p.skills);
        if (p.areasOfInterest && p.areasOfInterest.length > 0) setAreasOfInterest(p.areasOfInterest);
        if (p.preferences) setPreferences(p.preferences);
        if (p.privacy) setPrivacy(p.privacy);
      }
    } catch (err) {
      console.warn("Using local settings state:", err.message);
      if (user?.name) setFullName(user.name);
      if (user?.email) setEmailAddress(user.email);
      if (user?.jobRole) setTargetJobRole(user.jobRole);
      if (user?.experienceLevel) setExperienceLevel(user.experienceLevel);
    } finally {
      setLoading(false);
    }
  };

  // Show temporary toast feedback
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Save Profile Changes
  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setErrorMessage('');

      const email = user?.email || emailAddress;
      const payload = {
        email,
        name: fullName.trim(),
        jobRole: targetJobRole,
        experienceLevel,
        bio: bio.trim(),
        avatar,
        skills,
        areasOfInterest,
        preferences,
        privacy
      };

      const res = await axios.put('http://localhost:5000/api/user/profile', payload);

      if (res.data && res.data.profile) {
        // Sync to AuthContext globally
        updateUser({
          name: fullName.trim(),
          jobRole: targetJobRole,
          experienceLevel,
          avatar
        });

        showToast("Profile changes saved successfully!");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  // Add & Remove Skills
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkillInput('');
      setIsAddingSkill(false);
    }
  };

  // Add & Remove Interests
  const handleRemoveInterest = (interestToRemove) => {
    setAreasOfInterest(prev => prev.filter(i => i !== interestToRemove));
  };

  const handleAddInterest = (e) => {
    e?.preventDefault();
    const trimmed = newInterestInput.trim();
    if (trimmed && !areasOfInterest.includes(trimmed)) {
      setAreasOfInterest(prev => [...prev, trimmed]);
      setNewInterestInput('');
      setIsAddingInterest(false);
    }
  };

  // Quick Action: Download My Data
  const handleDownloadData = async () => {
    try {
      showToast("Preparing data archive export...");
      const email = user?.email || emailAddress;
      const res = await axios.get(`http://localhost:5000/api/user/download-data?email=${encodeURIComponent(email)}`);
      
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `MockMate_Data_Export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      showToast("Data export downloaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to export data archive.");
    }
  };

  // Quick Action: Change Password Submit
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordNew || passwordNew.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordNew !== passwordConfirm) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      const email = user?.email || emailAddress;
      await axios.post('http://localhost:5000/api/user/change-password', {
        email,
        currentPassword: passwordCurrent,
        newPassword: passwordNew
      });

      setPasswordSuccess("Password updated successfully!");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordCurrent('');
        setPasswordNew('');
        setPasswordConfirm('');
        setPasswordSuccess('');
      }, 1500);
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Failed to update password.");
    }
  };

  // Available Tabs Definition
  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'account', name: 'Account', icon: SettingsIcon },
    { id: 'preferences', name: 'Preferences', icon: SlidersHorizontal },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheck },
    { id: 'integrations', name: 'Integrations', icon: Link2 },
  ];

  const jobRolesList = [
    'Full Stack Web Developer',
    'Frontend Engineer',
    'Backend Engineer',
    'DevOps & Cloud Engineer',
    'Software Architect',
    'Data Engineer',
    'QA Automation Engineer'
  ];

  const experienceList = [
    'Entry Level (0-1 years)',
    'Junior (1-2 years)',
    'Mid-Level (3-5 years)',
    'Senior (5+ years)',
    'Staff / Lead (8+ years)'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#064E3B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-bounce">
          <CheckCircle2 size={18} className="text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ---------------- 1. PAGE TITLE & HEADER ---------------- */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Manage your account, preferences and personalize your MockMate AI experience.
        </p>
      </div>

      {/* ---------------- 2. HORIZONTAL NAVIGATION TABS ---------------- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-150">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#064E3B] text-white shadow-md shadow-emerald-950/20'
                  : 'bg-white text-gray-600 hover:text-gray-950 hover:bg-gray-100/70 border border-gray-150'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- 3. TAB 1: PROFILE CONTENT ---------------- */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (8 cols): Profile Information & Skills */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Card 1: Profile Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-gray-950">Profile Information</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Keep your profile up to date. This information helps us personalize your experience.
                </p>
              </div>

              {/* Avatar + Main Fields Flex */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
                
                {/* Avatar with Camera Overlay Button */}
                <div className="relative group shrink-0">
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-gray-100 shadow-md group-hover:opacity-90 transition-opacity"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#064E3B] hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-all cursor-pointer ring-2 ring-white"
                    title="Change Profile Photo"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* Form Inputs Grid */}
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kasun Silva"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={emailAddress}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100/70 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  {/* Target Job Role */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Target Job Role</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
                      <select
                        value={targetJobRole}
                        onChange={(e) => setTargetJobRole(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 appearance-none cursor-pointer"
                      >
                        {jobRolesList.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Experience Level</label>
                    <div className="relative">
                      <GraduationCap size={16} className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 appearance-none cursor-pointer"
                      >
                        {experienceList.map(exp => (
                          <option key={exp} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bio / About You Textarea */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-gray-700">Bio / About You</label>
                <div className="relative">
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell interviewers and AI mentors a bit about your engineering background and goals..."
                    className="w-full p-4 pb-7 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 leading-relaxed focus:bg-white focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 resize-none"
                  />
                  <span className="absolute bottom-2.5 right-3 text-[11px] font-mono text-gray-400 font-semibold">
                    {bio.length}/500
                  </span>
                </div>
              </div>

              {/* Save Button Row */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                {errorMessage ? (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </span>
                ) : <span />}

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md shadow-emerald-950/20 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card 2: Skills & Interests */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-gray-950">Skills & Interests</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add your key skills and areas of interest to get more relevant questions and recommendations.
                </p>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700">Skills</label>
                <div className="flex flex-wrap items-center gap-2">
                  {skills.map(skill => (
                    <span
                      key={skill}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors group cursor-default"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-gray-400 group-hover:text-rose-600 cursor-pointer font-bold transition-colors"
                        title={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* Add Skill Button / Input */}
                  {isAddingSkill ? (
                    <form onSubmit={handleAddSkill} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        placeholder="Type skill & press Enter"
                        className="px-3 py-1 bg-white border border-emerald-600 rounded-full text-xs font-medium focus:outline-none"
                      />
                      <button type="submit" className="p-1 rounded-full bg-emerald-700 text-white cursor-pointer">
                        <Check size={12} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setIsAddingSkill(false); setNewSkillInput(''); }} 
                        className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingSkill(true)}
                      className="border border-dashed border-emerald-600/60 bg-emerald-50/40 hover:bg-emerald-100/60 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Skill</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Areas of Interest Tags */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold text-gray-700">Areas of Interest</label>
                <div className="flex flex-wrap items-center gap-2">
                  {areasOfInterest.map(item => (
                    <span
                      key={item}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors group cursor-default"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(item)}
                        className="text-gray-400 group-hover:text-rose-600 cursor-pointer font-bold transition-colors"
                        title={`Remove ${item}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* Add Interest Button / Input */}
                  {isAddingInterest ? (
                    <form onSubmit={handleAddInterest} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        value={newInterestInput}
                        onChange={(e) => setNewInterestInput(e.target.value)}
                        placeholder="Type area & press Enter"
                        className="px-3 py-1 bg-white border border-emerald-600 rounded-full text-xs font-medium focus:outline-none"
                      />
                      <button type="submit" className="p-1 rounded-full bg-emerald-700 text-white cursor-pointer">
                        <Check size={12} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setIsAddingInterest(false); setNewInterestInput(''); }} 
                        className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingInterest(true)}
                      className="border border-dashed border-emerald-600/60 bg-emerald-50/40 hover:bg-emerald-100/60 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Interest</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN (4 cols): Profile Card Preview & Quick Actions */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            
            {/* Live Profile Card Preview */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden text-center relative">
              
              {/* Decorative Emerald Wave Header Accent */}
              <div className="h-28 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-200 relative overflow-hidden">
                <svg className="absolute bottom-0 w-full text-white" viewBox="0 0 1440 320" fill="currentColor">
                  <path d="M0,192L60,170.7C120,149,240,107,360,117.3C480,128,600,192,720,202.7C840,213,960,171,1080,149.3C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
              </div>

              {/* Floating Avatar */}
              <div className="relative -mt-14 mb-3 flex justify-center">
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
                />
              </div>

              {/* Preview Body */}
              <div className="p-6 pt-0 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-gray-950 tracking-tight">
                    {fullName || 'Candidate Name'}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    {targetJobRole}
                  </p>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-normal px-2">
                  {bio}
                </p>

                {/* Details List */}
                <div className="space-y-2 pt-2 border-t border-gray-100 text-left text-xs font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{emailAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-gray-400 shrink-0" />
                    <span>{targetJobRole}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-gray-400 shrink-0" />
                    <span>{experienceLevel}</span>
                  </div>
                </div>

                {/* View Public Profile Action */}
                <button
                  type="button"
                  onClick={() => navigate('/progress')}
                  className="w-full py-2.5 rounded-xl border border-gray-200 hover:border-emerald-700 hover:text-emerald-800 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer mt-3"
                >
                  <span>View Public Profile</span>
                  <ExternalLink size={13} />
                </button>
              </div>

            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs space-y-3">
              <h3 className="text-sm font-black text-gray-950 mb-3">Quick Actions</h3>

              {/* Action 1: Change Password */}
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <KeyRound size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                      Change Password
                    </h4>
                    <p className="text-[11px] text-gray-400">Update your account password</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
              </button>

              {/* Action 2: Manage Email */}
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                      Manage Email
                    </h4>
                    <p className="text-[11px] text-gray-400">Update your email address</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
              </button>

              {/* Action 3: Download My Data */}
              <button
                type="button"
                onClick={handleDownloadData}
                className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CloudDownload size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                      Download My Data
                    </h4>
                    <p className="text-[11px] text-gray-400">Get a copy of your data</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
              </button>

              {/* Action 4: Delete Account */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 hover:bg-rose-50/70 rounded-2xl transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Trash2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-600">Delete Account</h4>
                    <p className="text-[11px] text-gray-400">Permanently delete your account</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-300 group-hover:text-rose-400 transition-colors" />
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ---------------- 4. TAB 2: ACCOUNT ---------------- */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-black text-gray-950">Account & Security</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage authentication credentials, password, and active login sessions.</p>
          </div>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md pt-2">
            <h3 className="text-sm font-bold text-gray-900">Update Account Password</h3>
            
            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                {passwordSuccess}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwordCurrent}
                onChange={(e) => setPasswordCurrent(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">New Password</label>
              <input
                type="password"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#064E3B] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* ---------------- 5. TAB 3: PREFERENCES ---------------- */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-black text-gray-950">AI & Experience Preferences</h2>
            <p className="text-xs text-gray-500 mt-0.5">Customize AI interviewer persona, sound, and editor styles.</p>
          </div>

          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-900">AI Voice Model & Tone</h4>
                <p className="text-[11px] text-gray-400">Tone of voice used in live audio simulation</p>
              </div>
              <select
                value={preferences.mockInterviewVoice}
                onChange={(e) => setPreferences(prev => ({ ...prev, mockInterviewVoice: e.target.value }))}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              >
                <option value="en-US-Neural (Studio AI)">en-US-Neural (Studio AI)</option>
                <option value="en-GB-Rigorous (Senior Evaluator)">en-GB-Rigorous (Senior Evaluator)</option>
                <option value="en-US-Casual (Collaborative)">en-US-Casual (Collaborative)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Code Editor Theme</h4>
                <p className="text-[11px] text-gray-400">Theme for coding practice questions</p>
              </div>
              <select
                value={preferences.codeEditorTheme}
                onChange={(e) => setPreferences(prev => ({ ...prev, codeEditorTheme: e.target.value }))}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              >
                <option value="vs-dark">VS Code Dark</option>
                <option value="github-light">GitHub Light</option>
                <option value="monokai">Monokai Pro</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Audio Feedback & Chimes</h4>
                <p className="text-[11px] text-gray-400">Play pleasant audio chime when timers start or questions submit</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.soundEffects}
                onChange={(e) => setPreferences(prev => ({ ...prev, soundEffects: e.target.checked }))}
                className="w-5 h-5 accent-emerald-700 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveChanges}
            className="px-5 py-2.5 rounded-xl bg-[#064E3B] text-white font-bold text-xs cursor-pointer shadow-xs mt-4"
          >
            Save Preferences
          </button>
        </div>
      )}

      {/* ---------------- 6. TAB 4: NOTIFICATIONS ---------------- */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-black text-gray-950">Notification Preferences</h2>
            <p className="text-xs text-gray-500 mt-0.5">Control how and when MockMate AI reaches you.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Assessment & Certificate Alerts</h4>
                <p className="text-[11px] text-gray-400">Notify me immediately when assessment tests are evaluated</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Weekly Progress Digest</h4>
                <p className="text-[11px] text-gray-400">Summary of mock interviews and skill improvements</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 accent-emerald-700 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 7. TAB 5: PRIVACY & SECURITY ---------------- */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-black text-gray-950">Privacy & Visibility</h2>
            <p className="text-xs text-gray-500 mt-0.5">Configure who can view your credentials and performance analytics.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Public Profile Page</h4>
                <p className="text-[11px] text-gray-400">Allow employers with your link to view verified badges and progress</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.publicProfile}
                onChange={(e) => setPrivacy(prev => ({ ...prev, publicProfile: e.target.checked }))}
                className="w-5 h-5 accent-emerald-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Share Assessment Scores with Recruiters</h4>
                <p className="text-[11px] text-gray-400">Permit partner hiring teams to contact you based on test percentiles</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.shareScoresWithRecruiters}
                onChange={(e) => setPrivacy(prev => ({ ...prev, shareScoresWithRecruiters: e.target.checked }))}
                className="w-5 h-5 accent-emerald-700 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 8. TAB 6: INTEGRATIONS ---------------- */}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-black text-gray-950">Connected Services</h2>
            <p className="text-xs text-gray-500 mt-0.5">Connect external platforms to sync projects, GitHub repos, and calendars.</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold">
                  GH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">GitHub</h4>
                  <p className="text-[11px] text-gray-400">Sync repositories for automated system design review</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => alert("GitHub integration linked successfully!")}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold cursor-pointer"
              >
                Connect
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  in
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">LinkedIn</h4>
                  <p className="text-[11px] text-gray-400">Export verified certificates to your LinkedIn profile licenses</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => alert("LinkedIn export bridge active!")}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* 1. Avatar Picker Modal */}
      {isAvatarModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-gray-950">Choose Profile Avatar</h3>
              <button onClick={() => setIsAvatarModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 py-2">
              {AVATAR_OPTIONS.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Option ${idx + 1}`}
                  onClick={() => { setAvatar(imgUrl); setIsAvatarModalOpen(false); }}
                  className={`w-20 h-20 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform mx-auto border-2 ${
                    avatar === imgUrl ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-gray-200'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t">
              <label className="block text-xs font-bold text-gray-700">Or Paste Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-3 py-2 border rounded-xl text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setAvatar(e.target.value.trim());
                    setIsAvatarModalOpen(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Change Password Modal */}
      {isPasswordModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-gray-950">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                  {passwordSuccess}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwordCurrent}
                  onChange={(e) => setPasswordCurrent(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordNew}
                  onChange={(e) => setPasswordNew(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#064E3B] text-white font-bold text-xs cursor-pointer shadow-md mt-2"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Manage Email Modal */}
      {isEmailModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsEmailModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-gray-950">Manage Email Address</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Your primary email address is currently: <strong>{emailAddress}</strong>
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium">
              Changing your email requires verifying ownership with a confirmation link sent to the new inbox.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setIsEmailModalOpen(false)} 
                className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center font-bold">
                <Trash2 size={20} />
              </div>
              <h3 className="font-black text-lg text-gray-950">Delete MockMate AI Account?</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              This action is permanent and cannot be undone. All your earned certificates, interview recordings, and assessment statistics will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-xs text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Account deletion request initiated.");
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
