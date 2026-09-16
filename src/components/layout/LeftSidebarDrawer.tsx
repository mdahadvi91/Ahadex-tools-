import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { CATEGORIES } from '../../tools/registry';
import { AnimatedIcon } from '../animations/AnimatedIcon';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Search,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface LeftSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const LeftSidebarDrawer: React.FC<LeftSidebarDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
}) => {
  const { t } = useLanguage();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      side="left"
      width="max-w-xs sm:max-w-sm"
      id="left-sidebar-drawer"
      title={
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <LayoutGrid className="w-4 h-4" />
          <span>Menu & Categories</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick Search Shortcut inside Drawer */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenSearch();
          }}
          className="w-full h-10 px-3.5 rounded-xl glass-input border border-white/10 hover:border-cyan-400/50 flex items-center justify-between text-slate-400 text-xs hover:text-slate-200 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>{t.common.searchPlaceholder.slice(0, 22)}...</span>
          </div>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
            ⌘K
          </span>
        </button>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              {t.common.categories}
            </span>
            <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
              {CATEGORIES.length} Suites
            </span>
          </div>

          <nav className="space-y-1">
            {/* All Tools Link */}
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'glass-card text-slate-300 hover:text-white hover:border-white/20'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{t.common.allTools}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </NavLink>

            {/* Individual Categories */}
            {CATEGORIES.map((category) => (
              <NavLink
                key={category.id}
                to={`/category/${category.slug}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'glass-card text-slate-300 hover:text-white hover:border-white/20'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <AnimatedIcon
                    name={category.iconName}
                    className="w-4 h-4 text-cyan-400 shrink-0"
                  />
                  <span className="truncate">{category.name}</span>
                </div>

                <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/5 shrink-0">
                  {category.toolCount}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Local Engine Security Guarantee */}
        <div className="pt-2 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>100% Client-Side Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every operation runs locally in your browser. No files or text are transmitted to
              external servers.
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
