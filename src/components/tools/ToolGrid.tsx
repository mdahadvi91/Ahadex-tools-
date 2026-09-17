import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutGrid, List, Sparkles, X, ArrowRight, Filter, SearchX } from 'lucide-react';
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

const QUICK_TRENDING_SEARCHES = [
  { label: 'Photo QR Badge', query: 'badge' },
  { label: 'Visiting Card', query: 'visiting' },
  { label: 'QR Code', query: 'qr' },
  { label: 'Business Card', query: 'card' },
  { label: 'vCard', query: 'vcard' },
  { label: 'WiFi QR', query: 'wifi' },
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

  // Popular / Featured tools for top section
  const popularFeaturedTools = useMemo(
    () => TOOLS_REGISTRY.filter((tool) => tool.isFeatured || tool.isPopular),
    []
  );

  // Compute tool counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TOOLS_REGISTRY.forEach((tool) => {
      counts[tool.categorySlug] = (counts[tool.categorySlug] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredTools = useMemo(() => {
    let list = [...TOOLS_REGISTRY];

    // Category filter
    if (selectedCategory === 'featured') {
      list = list.filter((tool) => tool.isFeatured || tool.isPopular);
    } else if (selectedCategory !== 'all') {
      list = list.filter((tool) => tool.categorySlug === selectedCategory);
    }

    // Intelligent search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((tool) => {
        const nameMatch = tool.name.toLowerCase().includes(q);
        const descMatch = tool.description.toLowerCase().includes(q);
        const catMatch = tool.category.toLowerCase().includes(q) || tool.categorySlug.toLowerCase().includes(q);
        const tagMatch = tool.tags.some((tag) => tag.toLowerCase().includes(q));
        const badgeMatch = tool.badge?.toLowerCase().includes(q) || false;

        return nameMatch || descMatch || catMatch || tagMatch || badgeMatch;
      });
    }

    // Sort list
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
    <section id="all-tools-section" className="py-10 sm:py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1: Popular & Featured Tools */}
        {selectedCategory === 'all' && !searchQuery && popularFeaturedTools.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
                  Popular & Featured Tools
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Hand-Picked Utilities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {popularFeaturedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Main Search & Filters Bar */}
        <div className="space-y-6 pt-2">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                <span>Browse All Tools</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {filteredTools.length} {filteredTools.length === 1 ? 'utility' : 'utilities'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore our collection of browser-based utilities with 100% client-side execution.
              </p>
            </div>

            {/* Controls: Search Input, Sort Dropdown, View Switcher */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* In-Grid Intelligent Search */}
              <div className="relative flex-1 sm:flex-initial min-w-[200px] sm:min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools or keywords..."
                  className="w-full h-9 pl-9 pr-8 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-400 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'name' | 'category')}
                className="h-9 px-3 rounded-xl bg-slate-900 text-xs text-slate-300 border border-slate-800 outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="popular" className="bg-slate-900">Popular First</option>
                <option value="name" className="bg-slate-900">Alphabetical (A-Z)</option>
                <option value="category" className="bg-slate-900">By Category</option>
              </select>

              {/* Layout Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
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

          {/* Quick Trending Keyword Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-500 font-mono text-[11px] shrink-0 font-semibold">
              Quick Filter:
            </span>
            {QUICK_TRENDING_SEARCHES.map((tag) => {
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-sm'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-800'
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
                className="text-xs font-mono text-cyan-400 hover:underline shrink-0 ml-1 cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Section 3: Category Filter Navigation Bar */}
          {showFilters && (
            <div className="relative flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {/* All Tools Tab */}
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/50 shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>All Tools ({TOOLS_REGISTRY.length})</span>
              </button>

              {/* Featured Tab */}
              <button
                type="button"
                onClick={() => setSelectedCategory('featured')}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  selectedCategory === 'featured'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-400/50 shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured</span>
                <span className="text-[10px] font-mono opacity-70">
                  ({popularFeaturedTools.length})
                </span>
              </button>

              {/* Dynamic Category Tabs */}
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.slug;
                const count = categoryCounts[category.slug] || 0;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2 ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/50 shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <AnimatedIcon name={category.iconName} className="w-3.5 h-3.5 shrink-0" />
                    <span>{category.name}</span>
                    <span className="text-[10px] font-mono opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Tools Grid / List View */}
        {filteredTools.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              <AnimatePresence>
                {filteredTools.map((tool) => (
                  <motion.div
                    layout
                    key={tool.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                <Link
                  key={tool.id}
                  to={`/tools/${tool.slug}`}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/20">
                      <AnimatedIcon name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <div className="truncate min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100 group-hover:text-cyan-200 transition-colors truncate">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="hidden md:inline-block text-xs font-mono text-slate-400 uppercase bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      {tool.category}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all">
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
            className="py-16 text-center bg-slate-900/80 rounded-2xl border border-slate-800 p-8 max-w-lg mx-auto space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
              <SearchX className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">
                No tools found matching "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Try another search term or browse by selecting a category above.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters & Search
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

