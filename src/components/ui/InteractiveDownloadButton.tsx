import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Check, Loader2, Sparkles, ArrowDown } from 'lucide-react';

interface InteractiveDownloadButtonProps {
  filename?: string;
  onDownload?: () => void;
  className?: string;
}

export const InteractiveDownloadButton: React.FC<InteractiveDownloadButtonProps> = ({
  filename = 'output-file.pdf',
  onDownload,
  className = '',
}) => {
  // States: 'idle' | 'hover' | 'pressing' | 'downloading' | 'completed'
  const [buttonState, setButtonState] = useState<'idle' | 'downloading' | 'completed'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleClick = () => {
    if (buttonState !== 'idle') return;

    setButtonState('downloading');
    setDownloadProgress(0);

    // Simulate snappy download buffer streaming
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setButtonState('completed');
          if (onDownload) onDownload();

          // Reset back to idle after 2.5 seconds
          setTimeout(() => {
            setButtonState('idle');
            setDownloadProgress(0);
          }, 2500);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      disabled={buttonState === 'downloading'}
      className={`relative overflow-hidden h-12 px-6 rounded-2xl font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 shadow-xl ${
        buttonState === 'completed'
          ? 'bg-emerald-500 text-slate-950 border border-emerald-300 shadow-emerald-950/40'
          : buttonState === 'downloading'
          ? 'bg-slate-900 text-cyan-300 border border-cyan-500/50 shadow-cyan-950/30'
          : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-cyan-500/25'
      } ${className}`}
    >
      {/* Dynamic Progress Fill for Downloading State */}
      {buttonState === 'downloading' && (
        <motion.div
          className="absolute inset-0 bg-cyan-500/20 pointer-events-none"
          initial={{ width: '0%' }}
          animate={{ width: `${downloadProgress}%` }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Button State Content */}
      <AnimatePresence mode="wait">
        {buttonState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span className="font-bold">Download File</span>
            <span className="text-[11px] font-mono opacity-80 pl-1 border-l border-slate-950/20">
              {filename.split('.').pop()?.toUpperCase()}
            </span>
          </motion.div>
        )}

        {buttonState === 'downloading' && (
          <motion.div
            key="downloading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 z-10"
          >
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span className="font-mono text-xs text-slate-200">
              Streaming Payload... {downloadProgress}%
            </span>
          </motion.div>
        )}

        {buttonState === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 z-10"
          >
            <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span className="font-bold text-slate-950">Downloaded!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
