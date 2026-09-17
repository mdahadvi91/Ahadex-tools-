import React, { useState, useEffect } from 'react';
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
          ? 'py-2.5 bg-[#080b11]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40'
          : 'py-3 sm:py-3.5 bg-[#080b11]/80 backdrop-blur-lg border-b border-white/5'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 w-full">
        {/* Left Side: Mobile Menu Button + Living Logo Branding */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile Left Drawer Toggle (Hidden on xl screens where Left Sidebar is persistent) */}
          <button
            id="left-sidebar-menu-button"
            type="button"
            onClick={onOpenLeftSidebar}
            className="xl:hidden p-2 rounded-xl glass-card hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
            aria-label="Open Tool Categories"
            title="Tool Categories"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>

          {/* Living Logo + AHADEX TOOLS Header Identity */}
          <AnimatedLogo size="md" showText={true} />
        </div>

        {/* Center/Right Side: Compact Search Trigger + Right Controls Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Trigger Bar */}
          <button
            id="header-search-button"
            type="button"
            onClick={onOpenSearch}
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl glass-input border border-white/10 hover:border-cyan-400/50 flex items-center gap-2 text-slate-400 text-xs sm:text-sm hover:text-slate-200 transition-all shadow-sm group cursor-pointer"
            aria-label="Search tools"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
            <span className="hidden sm:inline text-xs text-slate-300 font-medium">
              {t.common.searchPlaceholder || 'Search tools...'}
            </span>
            <span className="sm:hidden text-xs text-slate-300 font-medium">
              Search...
            </span>
            <div className="hidden md:flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 shrink-0 ml-1">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>

          {/* Mobile Right Drawer Toggle (Hidden on xl screens where Right Sidebar is persistent) */}
          <button
            id="right-sidebar-button"
            type="button"
            onClick={onOpenRightSidebar}
            className="xl:hidden p-2 rounded-xl glass-card hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
            aria-label="Open Settings & Info"
            title="Settings & Info"
          >
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
