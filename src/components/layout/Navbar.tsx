import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  Sun,
  Moon,
  Globe,
  Menu,
  Sparkles,
  Command,
} from 'lucide-react';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onToggleSidebar?: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenSettings,
  onToggleSidebar,
  onOpenMobileMenu,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const { language, setLanguage, options, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-[#080b11]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Category Sidebar toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl glass-card hover:border-cyan-400/50 text-slate-300 hover:text-white transition-colors cursor-pointer hidden lg:flex items-center justify-center"
              aria-label="Toggle Category Navigation"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            </button>
          )}

          <AnimatedLogo size="md" />
        </div>

        {/* Center: Interactive Search Trigger (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full h-10 px-4 rounded-xl glass-input border border-white/10 hover:border-cyan-400/50 flex items-center justify-between text-slate-400 text-sm hover:text-slate-200 transition-all shadow-sm group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="truncate">{t.common.searchPlaceholder}</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right: Actions (Theme, Language, Settings, Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search on Mobile */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="md:hidden p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-cyan-400/50 transition-colors cursor-pointer"
            aria-label="Search tools"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="h-9 px-2.5 rounded-xl glass-card hover:border-cyan-400/50 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label="Select Language"
              aria-expanded={isLangMenuOpen}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline-block uppercase font-semibold">
                {language}
              </span>
            </button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 rounded-xl glass-card bg-slate-900/95 border border-white/15 p-1.5 shadow-2xl z-30 font-sans"
                  >
                    {options.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => {
                          setLanguage(opt.code as LanguageCode);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left rounded-lg text-xs flex items-center justify-between transition-colors ${
                          language === opt.code
                            ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{opt.nativeLabel}</span>
                        <span className="text-[10px] uppercase font-mono opacity-60">
                          {opt.code}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl glass-card hover:border-cyan-400/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <motion.div
              key={resolvedTheme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </motion.div>
          </button>

          {/* Quick Settings Drawer trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl glass-card hover:border-cyan-400/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Open Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-300" />
          </button>

          {/* Mobile Menu trigger */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2.5 rounded-xl glass-card hover:border-cyan-400/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Open Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
