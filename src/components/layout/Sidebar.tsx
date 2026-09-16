import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { CATEGORIES } from '../../tools/registry';
import { AnimatedIcon } from '../animations/AnimatedIcon';
import { LayoutGrid, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, className = '' }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <aside
      className={`w-64 shrink-0 glass-panel rounded-2xl p-4 border border-white/10 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto hidden lg:flex flex-col gap-6 shadow-xl ${className}`}
    >
      <div>
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5" />
            {t.common.categories}
          </span>
          <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/5">
            {CATEGORIES.length}
          </span>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-200" />
                  <span>{t.common.allTools}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryDot"
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                  />
                )}
              </>
            )}
          </NavLink>

          {CATEGORIES.map((category) => (
            <NavLink
              key={category.id}
              to={`/category/${category.slug}`}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 truncate">
                    <AnimatedIcon
                      name={category.iconName}
                      className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0"
                    />
                    <span className="truncate">{category.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400/80 px-1.5 py-0.5 rounded bg-white/5">
                      {category.toolCount}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryDot"
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                      />
                    )}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Zero-Telemetry Privacy Badge */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Local Engine</span>
          </div>
          <p className="text-[11px] text-slate-300/80 leading-relaxed">
            All transformations execute inside your client environment. Zero uploads.
          </p>
        </div>
      </div>
    </aside>
  );
};
