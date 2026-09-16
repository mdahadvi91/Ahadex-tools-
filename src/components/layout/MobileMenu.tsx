import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Sparkles, LayoutGrid, Info, Mail, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../../tools/registry';
import { AnimatedIcon } from '../animations/AnimatedIcon';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { useLanguage } from '../../context/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
}) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#080b11]/85 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Sliding Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 w-4/5 max-w-sm glass-panel bg-slate-950/95 border-r border-white/10 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl"
          >
            <div className="space-y-6">
              {/* Header with Logo and Close */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <AnimatedLogo size="sm" onClick={onClose} />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="w-full h-10 px-3.5 rounded-xl glass-input border border-white/10 flex items-center justify-between text-slate-400 text-xs hover:border-cyan-400/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>{t.common.searchPlaceholder.slice(0, 24)}...</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5">
                  ⌘K
                </span>
              </button>

              {/* Categories Navigation */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block mb-2 px-1 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  {t.common.categories}
                </span>

                <div className="space-y-1">
                  <NavLink
                    to="/"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`
                    }
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{t.common.allTools}</span>
                  </NavLink>

                  {CATEGORIES.map((cat) => (
                    <NavLink
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-white/5'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <AnimatedIcon name={cat.iconName} className="w-4 h-4 text-slate-400" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/5">
                        {cat.toolCount}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Additional Pages */}
              <div className="pt-4 border-t border-white/10 space-y-1">
                <Link
                  to="/about"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5"
                >
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>{t.common.about}</span>
                </Link>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{t.common.contact}</span>
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% In-Browser Privacy</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
