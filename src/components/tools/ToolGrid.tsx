import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutGrid, List, Sparkles, X, ArrowRight } from 'lucide-react';
import { Tool } from '../../types';
import { TOOLS_REGISTRY, CATEGORIES } from '../../tools/registry';
import { ToolCard } from './ToolCard';
import { AnimatedIcon } from '../animations/AnimatedIcon';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';

interface ToolGridProps {
  initialCategory?: string;
  showFilters?: boolean;
}

const TRENDING_TAGS = [
  { label: 'PDF Merge', query: 'pdf merge' },
  { label: 'WebP Converter', query: 'webp' },
  { label: 'QR Generator', query: 'qr' },
  { label: 'Image Compressor', query: 'compress' },
  { label: 'JSON Formatter', query: 'json' },
  { label: 'Password Generator', query: 'password' },
];

export const ToolGrid: React.FC<ToolGridProps> = ({
  initialCategory = 'all',
  showFilters = true,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'category'>('popular');

  const featuredCount = useMemo(
    () => TOOLS_REGISTRY.filter((tool) => tool.isFeatured).length,
    []
  );

  const filteredTools = useMemo(() => {
    let list = [...TOOLS_REGISTRY];

    // Filter by Category or Featured
    if (selectedCategory === 'featured') {
      list = list.filter((tool) => tool.isFeatured);
    } else if (selectedCategory !== 'all') {
      list = list.filter((tool) => tool.categorySlug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'popular') {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
      list.sort((a, b) => a.category.localeCompare(b.category));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="all-tools-section" className="py-12 sm:py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Full Tool Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
              All Platform Utilities{' '}
              <span className="text-cyan-400 font-mono text-xl sm:text-2xl md:text-3xl font-bold">
                ({filteredTools.length})
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              High-performance client-side modules running 100% locally in your device RAM.
            </p>
          </div>

          {/* Controls: In-Grid Search, Sort Selector, View Toggle */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quick in-grid search */}
            <div className="relative flex-1 sm:flex-initial min-w-[170px] sm:min-w-[220px]">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter utilities..."
                className="w-full h-9 pl-9 pr-8 rounded-xl glass-input text-xs outline-none focus:border-cyan-400 text-slate-100 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'name' | 'category')}
              className="h-9 px-2.5 sm:px-3 rounded-xl glass-card text-xs text-slate-300 border border-white/10 outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="popular" className="bg-slate-900">Popular First</option>
              <option value="name" className="bg-slate-900">Alphabetical (A-Z)</option>
              <option value="category" className="bg-slate-900">By Category</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl glass-card border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Grid View"
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Compact List View"
                title="Compact List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Trending Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-3 sm:mb-4 scrollbar-none text-xs">
          <span className="text-slate-400 font-mono text-[11px] shrink-0 font-semibold">
            Trending:
          </span>
          {TRENDING_TAGS.map((tag) => {
            const isActive = searchQuery.toLowerCase() === tag.query.toLowerCase();
            return (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  if (isActive) {
                    setSearchQuery('');
                  } else {
                    setSearchQuery(tag.query);
                    setSelectedCategory('all');
                  }
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-sm'
                    : 'bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border-white/5 hover:border-cyan-500/30'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[10px] font-mono text-cyan-400 hover:underline shrink-0 ml-1 cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Category Pills Bar with Motion sliding indicator */}
        {showFilters && (
          <div className="relative flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none">
            {/* 1. All Utilities Tab */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('all')}
              className={`relative px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'text-cyan-300 border-cyan-400/50'
                  : 'text-slate-300 hover:text-white border-white/5 glass-card'
              }`}
            >
              {selectedCategory === 'all' && (
                <motion.div
                  layoutId="activeCategoryTabPill"
                  className="absolute inset-0 bg-cyan-500/20 border border-cyan-400/50 rounded-xl -z-10 shadow-sm shadow-cyan-950/40"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span>All Utilities ({TOOLS_REGISTRY.length})</span>
            </motion.button>

            {/* 2. Featured Filter Tab */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('featured')}
              className={`relative px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
                selectedCategory === 'featured'
                  ? 'text-cyan-300 border-cyan-400/50'
                  : 'text-slate-300 hover:text-white border-white/5 glass-card'
              }`}
            >
              {selectedCategory === 'featured' && (
                <motion.div
                  layoutId="activeCategoryTabPill"
                  className="absolute inset-0 bg-cyan-500/20 border border-cyan-400/50 rounded-xl -z-10 shadow-sm shadow-cyan-950/40"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured</span>
              <span className="text-[10px] font-mono opacity-60">({featuredCount})</span>
            </motion.button>

            {/* 3. Each Category */}
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category.slug;
              return (
                <motion.button
                  key={category.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 sm:gap-2 group ${
                    isActive
                      ? 'text-cyan-300 border-cyan-400/50'
                      : 'text-slate-300 hover:text-white border-white/5 glass-card'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryTabPill"
                      className="absolute inset-0 bg-cyan-500/20 border border-cyan-400/50 rounded-xl -z-10 shadow-sm shadow-cyan-950/40"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="transition-transform group-hover:scale-110">
                    <AnimatedIcon name={category.iconName} className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <span>{category.name}</span>
                  <span className="text-[10px] font-mono opacity-60">
                    {category.toolCount}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Tools Display Grid: Mobile strictly 2 columns (grid-cols-2), Tablet 3 columns (md:grid-cols-3), Laptop/Desktop 4 columns (lg:grid-cols-4) */}
        {filteredTools.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5"
            >
              <AnimatePresence>
                {filteredTools.map((tool) => (
                  <motion.div
                    layout
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ToolCard tool={tool} featured={tool.isFeatured} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Compact List View */
            <div className="space-y-3">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="relative p-[1.5px] rounded-2xl overflow-hidden group shadow-lg transition-all duration-300"
                >
                  <div className="absolute -inset-[200%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_260deg,#06b6d4_310deg,#3b82f6_360deg)] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <Link
                    to={`/tools/${tool.slug}`}
                    className="relative glass-card flex items-center justify-between p-3.5 sm:p-4 rounded-[14px] bg-slate-900/95 hover:bg-slate-900/98 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 flex items-center justify-center shrink-0">
                        <AnimatedIcon name={tool.iconName} className="w-4 h-4" />
                      </div>
                      <div className="truncate min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
                      <span className="hidden md:inline-block text-xs font-mono text-slate-400">
                        {tool.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-300 text-[11px] font-bold flex items-center gap-1 transition-all">
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 text-center glass-card rounded-2xl border border-white/10 p-8 max-w-md mx-auto"
          >
            <Sparkles className="w-10 h-10 text-cyan-400/50 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-100">
              {t.common.noResults}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t.common.noResultsDesc}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 cursor-pointer"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
