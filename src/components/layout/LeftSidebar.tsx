import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CATEGORIES, TOOLS_REGISTRY } from '../../tools/registry';
import { AnimatedIcon } from '../animations/AnimatedIcon';
import { LayoutGrid, Sparkles, ShieldCheck, Flame, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LeftSidebarProps {
  className?: string;
  onSelectCategory?: (categorySlug: string | null) => void;
  selectedCategorySlug?: string | null;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  className = '',
  onSelectCategory,
  selectedCategorySlug,
}) => {
  const { t } = useLanguage();
  const location = useLocation();

  // Calculate dynamic tool counts per category from registered tools
  const categoriesWithCounts = CATEGORIES.map((cat) => {
    const count = TOOLS_REGISTRY.filter((tool) => tool.categorySlug === cat.slug).length;
    return {
      ...cat,
      activeToolCount: count,
    };
  });

  // Separate populated categories vs coming soon categories
  const populatedCategories = categoriesWithCounts.filter((c) => c.activeToolCount > 0);
  const comingSoonCategories = categoriesWithCounts.filter((c) => c.activeToolCount === 0);

  return (
    <aside
      className={`w-64 shrink-0 glass-panel rounded-2xl p-4 border border-white/10 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto hidden xl:flex flex-col gap-6 shadow-xl ${className}`}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5" />
            {t.common.categories || 'Tool Categories'}
          </span>
          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/5">
            {TOOLS_REGISTRY.length} Tools
          </span>
        </div>

        <nav className="space-y-1">
          {/* All Tools Link */}
          <NavLink
            to="/"
            end
            onClick={() => onSelectCategory && onSelectCategory(null)}
            className={({ isActive }) => {
              const isAllSelected = isActive && (!selectedCategorySlug || location.pathname === '/');
              return `group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isAllSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
              }`;
            }}
          >
            {({ isActive }) => {
              const isAllSelected = isActive && (!selectedCategorySlug || location.pathname === '/');
              return (
                <>
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-200" />
                    <span>{t.common.allTools || 'All Utilities'}</span>
                  </div>
                  {isAllSelected && (
                    <motion.div
                      layoutId="activeLeftNavDot"
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                    />
                  )}
                </>
              );
            }}
          </NavLink>

          {/* Populated Active Categories */}
          {populatedCategories.map((category) => {
            const isCategoryActive =
              location.pathname === `/category/${category.slug}` ||
              selectedCategorySlug === category.slug;

            return (
              <NavLink
                key={category.id}
                to={`/category/${category.slug}`}
                onClick={() => onSelectCategory && onSelectCategory(category.slug)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isCategoryActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <AnimatedIcon
                    name={category.iconName}
                    className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0"
                  />
                  <span className="truncate">{category.name}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
                    {category.activeToolCount}
                  </span>
                  {isCategoryActive && (
                    <motion.div
                      layoutId="activeLeftNavDot"
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                    />
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Upcoming / Coming Soon Categories (Subtle grouping so users are never sent to a "faka dokan") */}
      {comingSoonCategories.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 block mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Upcoming Suites</span>
          </span>

          <div className="space-y-1">
            {comingSoonCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] text-slate-500 hover:text-slate-400 transition-colors"
                title={`${cat.name} tools are under active development`}
              >
                <div className="flex items-center gap-2 truncate">
                  <AnimatedIcon name={cat.iconName} className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-600 px-1.5 py-0.2 rounded bg-white/5">
                  Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Guarantee Badge */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Privacy Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            100% Client-side processing. Zero server storage.
          </p>
        </div>
      </div>
    </aside>
  );
};
