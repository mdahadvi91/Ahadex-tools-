import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { ThemeMode, LanguageCode } from '../../types';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Info,
  Mail,
  Shield,
  FileText,
  HelpCircle,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface RightSidebarProps {
  className?: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, options, t } = useLanguage();

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
    { mode: 'system', label: 'Auto', icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  return (
    <aside
      className={`w-60 shrink-0 glass-panel rounded-2xl p-4 border border-white/10 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto hidden xl:flex flex-col gap-6 shadow-xl ${className}`}
    >
      {/* 1. Appearance / Theme Section */}
      <div>
        <div className="flex items-center gap-1.5 px-1 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            {t.common.theme || 'Appearance'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {themeOptions.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setTheme(opt.mode)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-medium flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                theme === opt.mode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-bold shadow-sm'
                  : 'glass-card text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Language Controls */}
      <div>
        <div className="flex items-center gap-1.5 px-1 mb-2.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold">
            {t.common.language || 'Language'}
          </span>
        </div>

        <div className="space-y-1">
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code as LanguageCode)}
              className={`w-full py-2 px-3 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                language === opt.code
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-semibold shadow-sm'
                  : 'glass-card text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              <span className="text-xs">{opt.nativeLabel}</span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                {opt.code}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Utility Information & Trust Links */}
      <div className="pt-3 border-t border-white/10 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1 block mb-2 font-bold">
          Platform & Trust
        </span>

        <Link
          to="/about"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{t.common.about || 'About AHADEX'}</span>
        </Link>

        <Link
          to="/contact"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{t.common.contact || 'Contact Us'}</span>
        </Link>

        <Link
          to="/privacy"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{t.common.privacy || 'Privacy Policy'}</span>
        </Link>

        <Link
          to="/terms"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{t.common.terms || 'Terms of Service'}</span>
        </Link>

        <Link
          to="/disclaimer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{t.common.disclaimer || 'Disclaimer'}</span>
        </Link>
      </div>

      {/* Brand Watermark Footer */}
      <div className="mt-auto pt-3 border-t border-white/10 text-center">
        <p className="text-[10px] text-slate-400 font-mono">
          AHADEX TOOLS
        </p>
        <p className="text-[9px] text-slate-500 mt-0.5">
          Privacy-First Web Suite
        </p>
      </div>
    </aside>
  );
};
