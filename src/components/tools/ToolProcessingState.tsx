import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Image as ImageIcon,
  QrCode,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  Loader2,
} from 'lucide-react';

interface ToolProcessingStateProps {
  toolSlug: string;
  categorySlug: string;
}

export const ToolProcessingState: React.FC<ToolProcessingStateProps> = ({
  toolSlug,
  categorySlug,
}) => {
  const [progress, setProgress] = useState(15);
  const [currentStage, setCurrentStage] = useState('Allocating WASM memory buffer...');

  useEffect(() => {
    const stages = [
      'Allocating WASM memory buffer...',
      'Reading byte array & metadata...',
      'Executing hardware-accelerated pipeline...',
      'Optimizing output structure...',
      'Finalizing cryptographic validation...',
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < stages.length) {
        setCurrentStage(stages[step]);
        setProgress((prev) => Math.min(prev + 20, 95));
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center w-full min-h-[320px]">
      {/* Animated File & Laser Scanner Visual based on Tool Type */}
      <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-xl animate-pulse pointer-events-none" />

        {/* Main central container */}
        <div className="relative w-24 h-24 rounded-3xl glass-card bg-slate-900/90 border border-cyan-400/50 flex items-center justify-center shadow-2xl shadow-cyan-950/50 overflow-hidden">
          {/* Scanning Beam Animation */}
          <motion.div
            initial={{ y: -48 }}
            animate={{ y: 48 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
            className="absolute left-0 right-0 h-[2px] bg-cyan-300 shadow-[0_0_12px_#22d3ee] z-20"
          />

          {/* Icon determined by Tool Slug */}
          {toolSlug.includes('pdf') ? (
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-red-400 z-10"
            >
              <FileText className="w-10 h-10" />
            </motion.div>
          ) : toolSlug.includes('qr') ? (
            <motion.div
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-emerald-400 z-10"
            >
              <QrCode className="w-10 h-10" />
            </motion.div>
          ) : categorySlug === 'img' || toolSlug.includes('image') || toolSlug.includes('webp') ? (
            <motion.div
              animate={{ scale: [1, 0.85, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-cyan-400 z-10"
            >
              <ImageIcon className="w-10 h-10" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="text-cyan-400 z-10"
            >
              <Cpu className="w-10 h-10" />
            </motion.div>
          )}
        </div>

        {/* Corner orbit pulses */}
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
      </div>

      {/* Primary Status Headline */}
      <h4 className="text-lg sm:text-xl font-extrabold text-slate-100 flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
        <span>Processing Utility...</span>
      </h4>

      {/* Subtitle */}
      <p className="text-xs text-slate-400 mt-1 font-mono">
        Please wait while on-device computation completes
      </p>

      {/* Progress Bar & Telemetry Text */}
      <div className="w-full max-w-sm mt-6 space-y-2">
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            initial={{ width: '15%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="truncate max-w-[240px] text-cyan-300">{currentStage}</span>
          <span className="text-slate-300 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
