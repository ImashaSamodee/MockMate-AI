// src/components/CertificateDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Award, 
  Download, 
  Share2, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Calendar,
  Lock,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CertificateDetail = ({ certificateProp, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [certificate, setCertificate] = useState(certificateProp || null);
  const [loading, setLoading] = useState(!certificateProp);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!certificateProp && id) {
      fetchCertificate(id);
    }
  }, [id, certificateProp]);

  const fetchCertificate = async (certId) => {
    setLoading(true);
    try {
      const email = user?.email || 'imashasamodee@gmail.com';
      const name = user?.name || 'Imasha Samodee';
      const res = await axios.get(`http://localhost:5000/api/certificates/${certId}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
      if (res.data && res.data.certificate) {
        setCertificate(res.data.certificate);
      } else {
        throw new Error('Certificate not found');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to load certificate record.');
    } finally {
      setLoading(false);
    }
  };

  const verificationUrl = certificate ? `http://localhost:5173/verify/${certificate.certificateId}` : '';

  const handleShare = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-500">Loading certificate credential...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-black text-gray-900">Certificate Not Found</h3>
        <p className="text-sm text-gray-500">{error || 'This certificate could not be retrieved.'}</p>
        <button
          onClick={() => (onClose ? onClose() : navigate('/certificates'))}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs"
        >
          Return to Certificates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (onClose ? onClose() : navigate('/certificates'))}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-all cursor-pointer shadow-2xs"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
              Official Credential Preview
            </h1>
            <p className="text-xs text-gray-500 font-mono">
              CREDENTIAL ID: {certificate.certificateId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 rounded-xl border border-gray-250 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Credential'}</span>
          </button>

          {/* Official Candidate Name */}
          {(() => {
            const candidateDisplayName = (certificate.userName && certificate.userName !== 'Candidate')
              ? certificate.userName
              : (user?.name || 'Imasha Samodee');

            return (
              <a
                href={`http://localhost:5000/api/certificates/${certificate.id || certificate.certificateId}/pdf?email=${encodeURIComponent(user?.email || 'imashasamodee@gmail.com')}&name=${encodeURIComponent(candidateDisplayName)}`}
                download
                className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Download size={14} />
                <span>Download Official PDF</span>
              </a>
            );
          })()}
        </div>
      </div>

      {/* ----------------- DIPLOMA PREVIEW FRAME ----------------- */}
      <div className="relative bg-[#FCFDFD] rounded-3xl p-6 sm:p-10 lg:p-14 border-4 border-[#064E3B] shadow-2xl overflow-hidden">
        
        {/* Inner Gold Inset Border */}
        <div className="absolute inset-3 border-2 border-[#D97706]/70 rounded-2xl pointer-events-none" />

        {/* Subtle Watermark Emblem Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Award size={480} />
        </div>

        {/* Certificate Content */}
        <div className="relative z-10 text-center space-y-6 sm:space-y-8">
          
          {/* Header Board Title */}
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#064E3B] block">
              MOCKMATE AI CERTIFICATION BOARD
            </span>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-gray-400 block">
              AUTONOMOUS TECHNICAL EVALUATION & CREDENTIALING DIRECTORY
            </span>
          </div>

          {/* Certificate of Competency Title */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight font-serif">
              Certificate of Technical Competency
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-sans italic">
              This credential certifies that candidate
            </p>
          </div>

          {/* Candidate Name */}
          <div className="py-1">
            <span className="text-3xl sm:text-5xl font-black text-[#064E3B] tracking-tight border-b-2 border-emerald-600 pb-2 inline-block px-6 font-serif">
              {(certificate.userName && certificate.userName !== 'Candidate') ? certificate.userName : (user?.name || 'Imasha Samodee')}
            </span>
          </div>

          {/* Satisfied examination */}
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            has successfully satisfied all standardized examination milestones, architectural assessments, and live evaluation rubrics required for the credential:
          </p>

          {/* Credential Title & Grade Badge */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {certificate.title}
            </h3>

            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2 rounded-full bg-emerald-50/90 border border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold shadow-xs">
              <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
              <span className="text-emerald-800 font-semibold">Grade:</span>
              <span className="text-emerald-950 font-extrabold">{certificate.level}</span>
              <span className="text-emerald-400 font-light">•</span>
              <span className="text-emerald-800 font-semibold">Score:</span>
              <span className="text-emerald-900 font-extrabold">{certificate.score}</span>
            </div>
          </div>

          {/* Verified Skills */}
          {certificate.skills && certificate.skills.length > 0 && (
            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Demonstrated Technical Competencies:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {certificate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Signatures & Seal Footer */}
          <div className="pt-8 sm:pt-12 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-left">
            
            {/* Left Column: ID & Date */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                CREDENTIAL RECORD
              </span>
              <div className="font-mono font-bold text-gray-950">
                {certificate.certificateId}
              </div>
              <div className="text-gray-500">
                Issued: {certificate.issueDate}
              </div>
              <Link
                to={`/verify/${certificate.certificateId}`}
                target="_blank"
                className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1 text-[11px]"
              >
                <span>Verify Online</span>
                <ExternalLink size={11} />
              </Link>
            </div>

            {/* Center: Verification Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-600 flex flex-col items-center justify-center shadow-inner text-amber-900 font-bold select-none">
                <ShieldCheck size={26} className="text-amber-700" />
                <span className="text-[9px] font-black uppercase tracking-wider">VERIFIED</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 mt-1 font-semibold">
                SEAL ID: {certificate.certificateId.slice(-4)}
              </span>
            </div>

            {/* Right Column: Signature */}
            <div className="text-left sm:text-right space-y-1 text-xs">
              <div className="font-serif italic text-lg sm:text-xl text-gray-800 border-b border-gray-300 pb-1 sm:inline-block">
                Dr. Alistair Vance
              </div>
              <div className="font-bold text-gray-950 text-xs">
                Chair, Technical Certification Board
              </div>
              <div className="text-gray-400 text-[11px]">
                MockMate AI Autonomous Evaluation Engine
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CertificateDetail;
