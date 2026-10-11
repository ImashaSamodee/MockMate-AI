// src/components/Footer.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#021814] text-gray-400 pt-12 pb-7 border-t border-emerald-900/40 overflow-hidden font-sans">
      
      {/* Background Ambient Glow & Wavy Lines (Matches Screenshot) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Neon Line Curves on Left */}
      <svg 
        className="absolute -left-6 bottom-0 w-72 h-44 text-emerald-500/10 pointer-events-none select-none" 
        viewBox="0 0 200 120" 
        fill="none"
      >
        <path d="M-20,120 Q50,40 130,70 T220,10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M-20,120 Q70,55 150,85 T220,25" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Subtle Neon Line Curves on Right */}
      <svg 
        className="absolute -right-6 top-0 w-72 h-44 text-emerald-500/10 pointer-events-none select-none" 
        viewBox="0 0 200 120" 
        fill="none"
      >
        <path d="M-20,10 Q60,80 140,50 T220,110" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ==================== TOP ROW WITH VERTICAL DIVIDERS ==================== */}
        <div className="flex flex-col lg:flex-row items-start lg:items-stretch justify-between gap-8 lg:gap-0">
          
          {/* Section 1: Brand & Description */}
          <div className="lg:w-[30%] lg:pr-8 space-y-3">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#00D084] to-[#059669] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="leading-tight">
                <span className="text-lg font-black text-white tracking-tight">
                  MockMate <span className="text-[#00D084]">AI</span>
                </span>
                <span className="text-[11px] text-gray-400 font-medium block">
                  AI-Powered Tech Interview Platform
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-xs pt-1 font-normal">
              Practice, improve and get hired with AI-powered interviews and personalized feedback.
            </p>
          </div>

          {/* Vertical Divider 1 */}
          <div className="hidden lg:block w-[1px] bg-emerald-900/35 self-stretch shrink-0 mx-2" />

          {/* Section 2: Product */}
          <div className="lg:w-[13%] lg:px-6 space-y-2.5">
            <h4 className="text-xs font-bold text-white tracking-wide">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="/#features" className="hover:text-emerald-400 transition-colors">Features</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
              </li>
            </ul>
          </div>

          {/* Vertical Divider 2 */}
          <div className="hidden lg:block w-[1px] bg-emerald-900/35 self-stretch shrink-0 mx-2" />

          {/* Section 3: Resources */}
          <div className="lg:w-[14%] lg:px-6 space-y-2.5">
            <h4 className="text-xs font-bold text-white tracking-wide">
              Resources
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/tips" className="hover:text-emerald-400 transition-colors">Interview Tips</Link>
              </li>
              <li>
                <Link to="/tips" className="hover:text-emerald-400 transition-colors">Blog</Link>
              </li>
              <li>
                <a 
                  href="#help" 
                  onClick={(e) => { e.preventDefault(); alert("Help Center is live 24/7 via support@mockmate.ai"); }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Vertical Divider 3 */}
          <div className="hidden lg:block w-[1px] bg-emerald-900/35 self-stretch shrink-0 mx-2" />

          {/* Section 4: Company */}
          <div className="lg:w-[15%] lg:px-6 space-y-2.5">
            <h4 className="text-xs font-bold text-white tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="/#about" className="hover:text-emerald-400 transition-colors">About Us</a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  onClick={(e) => { e.preventDefault(); alert("MockMate AI follows strict GDPR and SOC2 data privacy guidelines."); }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  onClick={(e) => { e.preventDefault(); alert("Terms of service are binding for all registered candidates."); }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Vertical Divider 4 */}
          <div className="hidden lg:block w-[1px] bg-emerald-900/35 self-stretch shrink-0 mx-2" />

          {/* Section 5: Social Icons & Quote */}
          <div className="lg:w-[26%] lg:pl-6 space-y-3.5">
            {/* Social Icons Row */}
            <div className="flex items-center gap-2">
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#03231B] border border-emerald-800/40 hover:border-emerald-400 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#03231B] border border-emerald-800/40 hover:border-emerald-400 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#03231B] border border-emerald-800/40 hover:border-emerald-400 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#03231B] border border-emerald-800/40 hover:border-emerald-400 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#03231B] border border-emerald-800/40 hover:border-emerald-400 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* Motivational Quote */}
            <div className="text-xs text-gray-300/90 leading-relaxed font-normal">
              <p>Build your skills. Ace your interviews.</p>
              <p className="flex items-center gap-1.5 mt-0.5">
                <span>Create a brighter future.</span>
                <span className="text-[#00D084]">💚</span>
              </p>
            </div>
          </div>

        </div>

        {/* ==================== BOTTOM HORIZONTAL LINE & LEGAL BAR ==================== */}
        <div className="border-t border-emerald-900/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="font-normal text-center sm:text-left">
            © 2026 MockMate AI. All rights reserved.
          </p>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-normal flex-wrap justify-center">
            <a 
              href="#cookies" 
              onClick={(e) => { e.preventDefault(); alert("Cookie Policy: Essential cookies are used to provide authenticated session management."); }} 
              className="hover:text-emerald-400 transition-colors"
            >
              Cookie Policy
            </a>
            <span className="text-emerald-900/60">|</span>
            <a 
              href="#sitemap" 
              onClick={(e) => { e.preventDefault(); alert("Sitemap: /dashboard, /interview, /practice, /tips, /certificates, /settings"); }} 
              className="hover:text-emerald-400 transition-colors"
            >
              Sitemap
            </a>
            <span className="text-emerald-900/60">|</span>
            <a 
              href="mailto:contact@mockmate.ai" 
              className="hover:text-emerald-400 transition-colors"
            >
              Contact Us
            </a>

            {/* Scroll to Top Circle Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-[#03231B] border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-900 transition-all flex items-center justify-center cursor-pointer ml-1 sm:ml-2 shadow-xs group"
              title="Back to Top"
            >
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;