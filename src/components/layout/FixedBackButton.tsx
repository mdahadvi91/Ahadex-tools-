import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FixedBackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRtl } = useLanguage();

  // Hide fixed back button on homepage since it's the root page
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <button
      id="fixed-top-back-button"
      type="button"
      onClick={handleBack}
      className={`fixed top-16 sm:top-20 ${
        isRtl ? 'right-3 sm:right-6' : 'left-3 sm:left-6'
      } z-40 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 shadow-xl shadow-cyan-950/40 backdrop-blur-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer group active:scale-95`}
      aria-label={t.common.back}
      title={t.common.back}
    >
      <ArrowLeft
        className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${
          isRtl ? 'group-hover:translate-x-1 rotate-180' : 'group-hover:-translate-x-1'
        }`}
      />
      <span className="select-none font-sans font-bold">{t.common.back}</span>
    </button>
  );
};
