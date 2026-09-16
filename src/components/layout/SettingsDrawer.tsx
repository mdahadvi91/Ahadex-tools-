import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { ThemeMode, LanguageCode } from '../../types';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Shield,
  FileText,
  HelpCircle,
  Mail,
  Info,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, options, t } = useLanguage();

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { mode: 'system', label: 'System', icon: <Laptop className="w-4 h-4" /> },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      side="right"
      title={
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Sparkles className="w-4 h-4" />
          <span>{t.common.quickSettings}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Appearance / Theme */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2.5">
            {t.common.theme}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.mode}
                type="button"
                onClick={() => setTheme(opt.mode)}
                className={`py-2 px-3 rounded-xl text-xs font-medium flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                  theme === opt.mode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm'
                    : 'glass-card text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            {t.common.language}
          </label>
          <div className="space-y-1.5">
            {options.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLanguage(opt.code as LanguageCode)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                  language === opt.code
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-semibold'
                    : 'glass-card text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{opt.nativeLabel}</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    ({opt.label})
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/5">
                  {opt.code}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Information & Legal Navigation */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
            Navigation & Legal
          </span>

          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{t.common.about}</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <Link
            to="/contact"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{t.common.contact}</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <Link
            to="/privacy"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>{t.common.privacy}</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <Link
            to="/terms"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{t.common.terms}</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <Link
            to="/disclaimer"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>{t.common.disclaimer}</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>
        </div>

        {/* Future domain footer info */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-center">
          <p className="text-[11px] text-slate-400 font-mono">
            AHADEX TOOLS v1.0 Foundation
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Engineered for https://ahadex.fun/
          </p>
        </div>
      </div>
    </Drawer>
  );
};
