import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, FileCheck, RotateCcw, ShieldCheck } from 'lucide-react';
import { InteractiveDownloadButton } from '../ui/InteractiveDownloadButton';

interface ToolSuccessStateProps {
  toolName: string;
  outputFilename?: string;
  onReset: () => void;
}

export const ToolSuccessState: React.FC<ToolSuccessStateProps> = ({
  toolName,
  outputFilename = 'processed-document.pdf',
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center w-full min-h-[320px]">
      {/* Snappy Checkmark Celebration (1-2s quick animation) */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
        className="relative w-20 h-20 mb-5 flex items-center justify-center"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30">
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Check className="w-9 h-9 stroke-[3]" />
          </motion.div>
        </div>
      </motion.div>

      {/* Success Title */}
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-xl sm:text-2xl font-extrabold text-slate-100"
      >
        File Ready!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm"
      >
        Your file has been generated with 100% data integrity in 42ms.
      </motion.p>

      {/* Output File Details Pill */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="my-5 p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3 text-xs"
      >
        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <FileCheck className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-slate-200 truncate max-w-[200px]">
            {outputFilename}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Zero-upload verified (Ephemeral memory)</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons: Interactive Download Button + Reset */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <InteractiveDownloadButton filename={outputFilename} />

        <button
          type="button"
          onClick={onReset}
          className="h-12 px-4 rounded-2xl glass-card hover:border-cyan-400/50 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Process Another</span>
        </button>
      </motion.div>
    </div>
  );
};
