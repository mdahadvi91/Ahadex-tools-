import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, LayoutGrid, List, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Tool, Category } from '../../types';
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

export const ToolGrid: React.FC<ToolGridProps> = ({
  initialCategory = 'all',
  showFilters = true,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'category'>('popular');

  const filteredTools = useMemo(() => {
    let list = [...TOOLS_REGISTRY];

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((tool) => tool.categorySlug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
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
    <section id="all-tools-section" className="py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Full Tool Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              All Platform Utilities ({filteredTools.length})
            </h2>
          </div>

          {/* Controls: Search, Sort, View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick in-grid search */}
            <div className="relative min-w-[200px] max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tools..."
                className="w-full h-9 pl-9 pr-3 rounded-xl glass-input text-xs outline-none focus:border-cyan-400"
              />
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'name' | 'category')}
              className="h-9 px-3 rounded-xl glass-card text-xs text-slate-300 border border-white/10 outline-none focus:border-cyan-400 cursor-pointer"
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
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Compact List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        {showFilters && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm'
                  : 'glass-card text-slate-300 hover:text-white hover:border-white/20 border-white/5'
              }`}
            >
              All Utilities ({TOOLS_REGISTRY.length})
            </button>

            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2 ${
                  selectedCategory === category.slug
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm'
                    : 'glass-card text-slate-300 hover:text-white hover:border-white/20 border-white/5'
                }`}
              >
                <AnimatedIcon name={category.iconName} className="w-3.5 h-3.5 shrink-0" />
                <span>{category.name}</span>
                <span className="text-[10px] font-mono opacity-60">
                  {category.toolCount}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Tools Display */}
        {filteredTools.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
                    <ToolCard tool={tool} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Compact List View */
            <div className="space-y-2">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.slug}`}
                  className="glass-card flex items-center justify-between p-3.5 rounded-xl border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/5 text-slate-300 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <AnimatedIcon name={tool.iconName} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
                      {tool.category}
                    </span>
                    <span className="text-xs text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                      Launch →
                    </span>
                  </div>
                </Link>
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
              className="mt-4"
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
