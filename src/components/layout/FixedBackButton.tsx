import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const FixedBackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // If there is previous history in this session, navigate back
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      id="fixed-back-button"
      type="button"
      onClick={handleBack}
      className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass-card bg-[#0b0f19]/90 hover:bg-slate-900 text-slate-100 hover:text-cyan-300 border border-white/20 hover:border-cyan-400/60 shadow-2xl shadow-black/60 backdrop-blur-xl font-medium text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer group active:scale-95"
      aria-label="Back"
      title="Back"
    >
      <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform duration-200" />
      <span className="select-none font-semibold">Back</span>
    </button>
  );
};
