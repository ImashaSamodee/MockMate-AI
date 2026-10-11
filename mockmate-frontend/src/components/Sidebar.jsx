// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Video, 
  BookOpen, 
  BarChart2, 
  FileText, 
  MessageSquare, 
  Award,
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { name: 'Mock Interview', icon: Video, path: '/interview' },
    { name: 'Practice Topics', icon: BookOpen, path: '/practice' },
    { name: 'Progress', icon: BarChart2, path: '/progress' },
    { name: 'Resume Review', icon: FileText, path: '/resume' },
    { name: 'Interview Tips', icon: MessageSquare, path: '/tips' },
    { name: 'Certificates', icon: Award, path: '/certificates' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col justify-between sticky top-0 shrink-0 select-none z-30 overflow-y-auto">
      <div className="p-5 pb-6">
        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 mb-6 cursor-pointer group"
          title="Back to Landing Page"
        >
          <div className="w-9 h-9 bg-[#064E3B] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
            M
          </div>
          <div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              MockMate <span className="text-[#059669]">AI</span>
            </span>
          </div>
        </div>

        {/* Navigation Items (Matches Reference Screenshot) */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold transition-all text-sm ${
                  isActive 
                  ? 'bg-[#064E3B] text-white shadow-md shadow-emerald-950/20' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Logout Action right below Settings */}
          <button 
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-2xl w-full font-semibold transition-colors text-sm cursor-pointer mt-1"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;