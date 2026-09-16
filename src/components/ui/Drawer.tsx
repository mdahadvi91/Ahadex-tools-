import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  side?: 'left' | 'right';
  width?: string;
  id?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  width = 'max-w-md',
  id = 'drawer-panel',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const slideVariants = {
    closed: {
      x: side === 'right' ? '100%' : '-100%',
      opacity: 0.8,
    },
    open: {
      x: 0,
      opacity: 1,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={id} className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#080b11]/70 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          <div
            className={`fixed inset-y-0 ${
              side === 'right' ? 'right-0' : 'left-0'
            } flex max-w-full`}
          >
            <motion.div
              variants={slideVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`w-screen ${width} glass-panel bg-slate-900/95 border-${
                side === 'right' ? 'l' : 'r'
              } border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  {title ? (
                    <div className="text-base font-bold text-slate-100">{title}</div>
                  ) : (
                    <div />
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm text-slate-300">{children}</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
