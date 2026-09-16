import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles, Command } from 'lucide-react';
import { TOOLS_REGISTRY } from '../../tools/registry';
import { Tool } from '../../types';
import { AnimatedIcon } from '../animations/AnimatedIcon';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter tools by name, description, tags, category
  const filteredTools = query.trim()
    ? TOOLS_REGISTRY.filter((tool) => {
        const q = query.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }).slice(0, 8)
    : TOOLS_REGISTRY.filter((t) => t.isFeatured || t.isPopular).slice(0, 6);

  const handleSelect = (tool: Tool) => {
    onClose();
    navigate(`/tools/${tool.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredTools[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#080b11]/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl glass-card bg-slate-900/95 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-white/10">
              <Search className="w-5 h-5 text-cyan-400 shrink-0 ml-1" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={t.common.searchPlaceholder}
                className="w-full h-9 bg-transparent px-3 text-slate-100 placeholder-slate-400 text-sm md:text-base outline-none font-sans"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  aria-label="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/10 shrink-0">
                  ESC
                </span>
              )}
            </div>

            {/* Quick Filter Tags */}
            <div className="px-4 py-2 border-b border-white/5 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-slate-400 shrink-0 text-[11px] font-mono">
                Suggestions:
              </span>
              {['PDF', 'Image', 'JSON', 'QR', 'Password', 'WebP', 'Regex'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors shrink-0 text-[11px] font-mono cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleSelect(tool)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border border-cyan-400/40 shadow-sm'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-white/5 text-slate-400 group-hover:text-cyan-400'
                          }`}
                        >
                          <AnimatedIcon name={tool.iconName} className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-100 truncate">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <Badge variant="cyan" size="sm">
                                {tool.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                          {tool.category}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected
                              ? 'text-cyan-400 translate-x-1'
                              : 'text-slate-500 opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 px-4 text-center">
                  <Sparkles className="w-8 h-8 text-cyan-400/50 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-200">
                    {t.common.noResults}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    {t.common.noResultsDesc}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Navigation Tip */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    ↓
                  </kbd>{' '}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    ↵
                  </kbd>{' '}
                  Open
                </span>
              </div>
              <span>{TOOLS_REGISTRY.length} Available Tools</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
