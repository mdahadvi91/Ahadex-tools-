import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, SlidersHorizontal, Command } from 'lucide-react';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { useLanguage } from '../../context/LanguageContext';

interface NavbarProps {
  onOpenLeftSidebar: () => void;
  onOpenRightSidebar: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLeftSidebar,
  onOpenRightSidebar,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'py-2 sm:py-2.5 bg-[#080b11]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40'
          : 'py-2.5 sm:py-3.5 bg-[#080b11]/75 backdrop-blur-lg border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-4 w-full">
        {/* 1. Left Sidebar (Menu Button) + 2. Logo + 3. Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* 1. Left Sidebar (Menu Button) */}
          <button
            id="left-sidebar-menu-button"
            type="button"
            onClick={onOpenLeftSidebar}
            className="p-1.5 sm:p-2.5 rounded-xl glass-card hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
            aria-label="Open Left Menu & Categories"
            title="Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </button>

          {/* 2. Logo */}
          <div className="shrink-0">
            <AnimatedLogo size="sm" showText={false} />
          </div>

          {/* 3. Title */}
          <Link
            to="/"
            id="header-brand-title"
            className="flex items-center gap-1 select-none group focus:outline-none shrink-0"
            aria-label="AHADEX TOOLS Home"
          >
            <span className="text-sm sm:text-lg md:text-xl font-extrabold tracking-tight text-slate-100 group-hover:text-cyan-200 transition-colors">
              AHADEX
            </span>
            <span className="hidden xs:inline text-[9px] sm:text-xs uppercase tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
              TOOLS
            </span>
          </Link>
        </div>

        {/* 4. Search - Auto responsive: short on mobile, full on desktop */}
        <div className="flex-1 min-w-0 max-w-md mx-1 sm:mx-4">
          <button
            id="header-search-button"
            type="button"
            onClick={onOpenSearch}
            className="w-full h-8 sm:h-10 px-2 sm:px-4 rounded-xl glass-input border border-white/10 hover:border-cyan-400/50 flex items-center justify-between text-slate-400 text-xs sm:text-sm hover:text-slate-200 transition-all shadow-sm group cursor-pointer"
            aria-label="Search tools"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
              {/* On desktop: full descriptive text */}
              <span className="hidden md:inline truncate">{t.common.searchPlaceholder}</span>
              {/* On tablet/small screens: medium text */}
              <span className="hidden sm:inline md:hidden truncate">Search utilities...</span>
              {/* On mobile: compact clean label that prevents overflowing */}
              <span className="sm:hidden truncate text-[11px] text-slate-400">Search tools...</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 shrink-0 ml-1">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* 5. Right Sidebar (Settings & Navigation Drawer Button) */}
        <div className="flex items-center shrink-0">
          <button
            id="right-sidebar-button"
            type="button"
            onClick={onOpenRightSidebar}
            className="p-1.5 sm:p-2.5 rounded-xl glass-card hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
            aria-label="Open Settings & Navigation"
            title="Settings & Navigation"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
