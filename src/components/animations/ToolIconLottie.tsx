/**
 * ARCHITECTURE NOTE: Pure React + Framer Motion Vector Micro-Animations.
 * 
 * We intentionally avoid heavy external Lottie JSON runtimes (e.g. lottie-web / @lottiefiles)
 * which add 300KB-500KB of parser overhead and CPU load on mobile devices.
 * Instead, AHADEX uses zero-overhead vector morphing and spring physics via Framer Motion.
 */
import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Image as ImageIcon,
  QrCode,
  FileCode,
  Lock,
  Layers,
  Sparkles,
  Scissors,
  Cpu,
  Minimize2,
  RefreshCw,
  Eye,
  Hash,
} from 'lucide-react';

interface ToolIconLottieProps {
  toolSlug: string;
  categorySlug: string;
  isHovered?: boolean;
}

export const ToolIconLottie: React.FC<ToolIconLottieProps> = ({
  toolSlug,
  categorySlug,
  isHovered = false,
}) => {
  // JPG / Image to PDF: Image transforms into PDF document
  if (toolSlug.includes('jpg-to-pdf') || toolSlug.includes('image-to-pdf')) {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Source Image icon */}
        <motion.div
          animate={
            isHovered
              ? { x: -8, opacity: 0.4, scale: 0.85 }
              : { x: -5, opacity: 0.8, scale: 0.95 }
          }
          transition={{ duration: 0.3 }}
          className="absolute left-0.5 text-cyan-400"
        >
          <ImageIcon className="w-5 h-5" />
        </motion.div>

        {/* Morphing Arrow or Beam */}
        <motion.div
          animate={isHovered ? { scale: [0.8, 1.2, 1], opacity: 1 } : { opacity: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-cyan-300 z-10"
        >
          <span className="text-[10px] font-mono font-bold">➔</span>
        </motion.div>

        {/* Destination PDF document */}
        <motion.div
          animate={
            isHovered
              ? { x: 8, opacity: 1, scale: 1.1, rotateY: 10 }
              : { x: 5, opacity: 0.9, scale: 1 }
          }
          transition={{ duration: 0.3 }}
          className="absolute right-0.5 text-red-400"
        >
          <FileText className="w-5 h-5" />
        </motion.div>
      </div>
    );
  }

  // Image Converter: format transformation (e.g. WebP / PNG / SVG morph)
  if (toolSlug.includes('converter') || toolSlug.includes('webp')) {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div
          animate={isHovered ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="text-cyan-400"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.div>
        <motion.div
          animate={isHovered ? { scale: [1, 1.25, 1], opacity: [0.5, 1, 0.8] } : { opacity: 0.5 }}
          transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
          className="absolute inset-0 flex items-center justify-center text-blue-300"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </motion.div>
      </div>
    );
  }

  // Image Compressor: shrinking / compression animation
  if (toolSlug.includes('compressor') || toolSlug.includes('compress')) {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div
          animate={
            isHovered
              ? { scale: [1, 0.7, 0.85, 0.75], rotate: [0, -5, 5, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
          className="text-cyan-400"
        >
          <ImageIcon className="w-5 h-5" />
        </motion.div>
        {/* Inward compression arrows */}
        <motion.div
          animate={isHovered ? { scale: [1.2, 0.85, 1], opacity: 1 } : { opacity: 0.3 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center text-cyan-300 pointer-events-none"
        >
          <Minimize2 className="w-6 h-6 stroke-[1.5]" />
        </motion.div>
      </div>
    );
  }

  // PDF Merge: multiple files joining together
  if (toolSlug.includes('pdf-merger') || toolSlug.includes('merge')) {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Sheet 1 */}
        <motion.div
          animate={
            isHovered
              ? { x: 0, y: 0, opacity: 1, rotate: 0 }
              : { x: -6, y: -4, opacity: 0.6, rotate: -8 }
          }
          transition={{ duration: 0.35 }}
          className="absolute text-red-400/70"
        >
          <FileText className="w-4 h-4" />
        </motion.div>

        {/* Sheet 2 */}
        <motion.div
          animate={
            isHovered
              ? { x: 0, y: 0, opacity: 1, rotate: 0 }
              : { x: 6, y: 4, opacity: 0.6, rotate: 8 }
          }
          transition={{ duration: 0.35 }}
          className="absolute text-orange-400/70"
        >
          <FileText className="w-4 h-4" />
        </motion.div>

        {/* Bound merged output */}
        <motion.div
          animate={
            isHovered
              ? { scale: [0.9, 1.15, 1.05], opacity: 1 }
              : { scale: 1, opacity: 0.9 }
          }
          transition={{ duration: 0.4 }}
          className="relative z-10 text-red-400"
        >
          <Layers className="w-5 h-5" />
        </motion.div>
      </div>
    );
  }

  // QR Generator: QR matrix pixel construction
  if (toolSlug.includes('qr') || toolSlug.includes('barcode')) {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div
          animate={
            isHovered
              ? { scale: [1, 1.08, 1], rotate: [0, 90, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.8 }}
          className="text-emerald-400"
        >
          <QrCode className="w-5 h-5" />
        </motion.div>

        {/* Matrix scanning beam */}
        {isHovered && (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 12, opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            className="absolute w-6 h-[1.5px] bg-emerald-300 shadow-sm shadow-emerald-400 pointer-events-none"
          />
        )}
      </div>
    );
  }

  // Security / Password / Hash: dynamic cipher lock
  if (categorySlug === 'security' || toolSlug.includes('password') || toolSlug.includes('hash')) {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div
          animate={
            isHovered
              ? { rotateY: [0, 180, 360], scale: 1.1 }
              : { rotateY: 0, scale: 1 }
          }
          transition={{ duration: 0.7 }}
          className="text-cyan-400"
        >
          <Lock className="w-5 h-5" />
        </motion.div>
      </div>
    );
  }

  // Code / JSON / Developer: terminal brackets & syntax pulse
  if (categorySlug === 'dev' || toolSlug.includes('json') || toolSlug.includes('code')) {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div
          animate={
            isHovered
              ? { scale: [1, 1.15, 1], color: '#38bdf8' }
              : { scale: 1, color: '#22d3ee' }
          }
          transition={{ duration: 0.4 }}
        >
          <FileCode className="w-5 h-5" />
        </motion.div>
      </div>
    );
  }

  // Default Fallback
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <motion.div
        animate={isHovered ? { scale: 1.15, rotate: 12 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
        className="text-cyan-400"
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>
    </div>
  );
};
