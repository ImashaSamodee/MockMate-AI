// src/components/PublicVerify.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Download, 
  ExternalLink, 
  ArrowLeft,
  Building2,
  Lock,
  Copy,
  Check
} from 'lucide-react';

const PublicVerify = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(certificateId || '');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (certificateId) {
      verifyCredential(certificateId);
    }
  }, [certificateId]);

  const verifyCredential = async (idToVerify) => {
    if (!idToVerify || !idToVerify.trim()) return;
    setLoading(true);
    setVerificationResult(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/certificates/verify/${encodeURIComponent(idToVerify.trim())}`);
      setVerificationResult(res.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setVerificationResult(err.response.data);
      } else {
        setVerificationResult({
          verified: false,
          status: 'error',
          message: 'Unable to connect to verification authority. Please verify server status.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/verify/${searchId.trim()}`);
      verifyCredential(searchId.trim());
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-emerald-200 selection:text-emerald-950 pb-20">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sm:px-10 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#064E3B] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="text-xl font-black text-gray-950 tracking-tight">
              MockMate <span className="text-[#059669]">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-gray-400 hidden sm:inline">
              PUBLIC REGISTRY
            </span>
            <Link
              to="/certificates"
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5"
            >
              <span>Candidate Portal</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-8">
        
        {/* Verification Portal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Lock size={13} className="text-emerald-700" />
            <span>Cryptographic Credential Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight">
            Verify MockMate AI Credential
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto font-normal">
            Employers, recruiters, and institutions can authenticate official technical certificates issued by the MockMate AI Certification Board.
          </p>
        </div>

        {/* Verification Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-white p-3 sm:p-4 rounded-3xl border border-gray-250 shadow-md flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 w-full px-3 text-gray-400">
            <Search size={20} className="shrink-0 text-emerald-700" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Certificate ID (e.g. MM-FS-2026-9842)..."
              className="w-full text-sm sm:text-base font-mono text-gray-900 focus:outline-none placeholder:text-gray-400 placeholder:font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !searchId.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#053d2e] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShieldCheck size={16} />
            )}
            <span>Verify Credential</span>
          </button>
        </form>

        {/* Verification Result Display */}
        {verificationResult && (
          <div className="animate-fade-in">
            {verificationResult.verified ? (
              /* Verified & Valid Card */
              <div className="bg-white rounded-3xl border-2 border-emerald-400 shadow-xl overflow-hidden">
                
                {/* Status Header */}
                <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shrink-0">
                      <ShieldCheck size={32} className="text-emerald-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-200">
                          Official Verification Record
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        Valid & Verified Credential
                      </h2>
                    </div>
                  </div>

                  <span className="self-start sm:self-center px-4 py-1.5 rounded-full bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 text-xs font-black uppercase tracking-wider">
                    Status: Active
                  </span>
                </div>

                {/* Credential Details Grid */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-150">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                        Candidate Name
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-1">
                        {verificationResult.certificate.candidateName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Verified via authenticated assessment examination
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                        Credential Awarded
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
                        {verificationResult.certificate.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Level: <strong className="text-gray-900">{verificationResult.certificate.level}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150">
                      <span className="text-gray-400 font-bold block uppercase text-[10px]">Credential ID</span>
                      <strong className="text-sm font-mono text-gray-950 mt-1 block truncate">
                        {verificationResult.certificate.certificateId}
                      </strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150">
                      <span className="text-gray-400 font-bold block uppercase text-[10px]">Issue Date</span>
                      <strong className="text-sm text-gray-950 mt-1 block">
                        {verificationResult.certificate.issueDate}
                      </strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150">
                      <span className="text-gray-400 font-bold block uppercase text-[10px]">Assessed Score</span>
                      <strong className="text-sm text-emerald-800 mt-1 block">
                        {verificationResult.certificate.score}
                      </strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150">
                      <span className="text-gray-400 font-bold block uppercase text-[10px]">Issuing Body</span>
                      <strong className="text-xs text-gray-950 mt-1 block leading-tight">
                        {verificationResult.certificate.issuer}
                      </strong>
                    </div>
                  </div>

                  {/* Verified Skills */}
                  {verificationResult.certificate.skills && verificationResult.certificate.skills.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                        Verified Technical Competencies
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {verificationResult.certificate.skills.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-6 border-t border-gray-150 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-4 py-2 rounded-xl border border-gray-250 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copied ? 'Verification Link Copied!' : 'Copy Verification Link'}</span>
                    </button>

                    <a
                      href={`http://localhost:5000/api/certificates/${verificationResult.certificate.certificateId}/pdf`}
                      download
                      className="px-5 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Download size={14} />
                      <span>Download Official PDF Record</span>
                    </a>
                  </div>

                </div>
              </div>
            ) : (
              /* Invalid or Revoked Credential Card */
              <div className="bg-white rounded-3xl border-2 border-rose-300 p-8 text-center space-y-4 shadow-lg max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <ShieldAlert size={32} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-950">
                    Credential Could Not Be Verified
                  </h3>
                  <p className="text-sm text-gray-600 font-normal">
                    {verificationResult.message || `No active certificate was found matching ID "${searchId}".`}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 text-left space-y-1 font-medium">
                  <strong>Possible reasons:</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-800">
                    <li>The certificate ID was mistyped or formatted incorrectly.</li>
                    <li>The certificate has not yet been issued or has been revoked.</li>
                    <li>The credential does not exist in the MockMate AI registry.</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchId('MM-FS-2026-9842');
                      verifyCredential('MM-FS-2026-9842');
                    }}
                    className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                  >
                    Try searching valid sample: MM-FS-2026-9842
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default PublicVerify;
