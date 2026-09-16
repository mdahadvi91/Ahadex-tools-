import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'glass-card border-cyan-400/40 shadow-lg shadow-cyan-950/20'
                : 'glass-card border-white/10 hover:border-white/20'
            }`}
          >
            <button
              type="button"
              id={headerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleItem(item.id)}
              className="w-full px-5 py-4 flex items-center justify-between text-left text-slate-100 font-semibold text-sm sm:text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer group"
            >
              <span className="pr-4 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </span>
              
              {/* + to - Motion Indicator */}
              <div className="shrink-0 w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 transition-colors">
                {isOpen ? (
                  <Minus className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                )}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
