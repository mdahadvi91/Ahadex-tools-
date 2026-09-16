import React from 'react';
import { motion } from 'motion/react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  QrCode,
  Layers,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Plus,
  Minimize2,
  Lock,
  Code2,
} from 'lucide-react';

interface ToolEmptyStateProps {
  toolSlug: string;
  categorySlug: string;
  onBrowseClick?: () => void;
}

export const ToolEmptyState: React.FC<ToolEmptyStateProps> = ({
  toolSlug,
  categorySlug,
  onBrowseClick,
}) => {
  // 1. PDF Merge: 📄 + 📄 + 📄 -> 📑 PDF
  if (toolSlug.includes('pdf-merger') || toolSlug.includes('merge')) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center w-full">
        {/* 2D Explanatory Visual Diagram */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 mb-6 flex flex-col items-center">
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300 mb-2">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <FileText className="w-5 h-5" />
              <span className="text-[11px] font-mono font-bold">Doc 1</span>
            </div>
            <Plus className="w-4 h-4 text-slate-500" />
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <FileText className="w-5 h-5" />
              <span className="text-[11px] font-mono font-bold">Doc 2</span>
            </div>
            <Plus className="w-4 h-4 text-slate-500" />
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileText className="w-5 h-5" />
              <span className="text-[11px] font-mono font-bold">Doc 3</span>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-cyan-400 my-1 animate-bounce" />

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-md">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-xs sm:text-sm">Combined Unified PDF</span>
          </div>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-100">
          Merge your PDF files together
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
          Drag & drop 2 or more PDF documents here. Pages will be bound sequentially directly inside your browser RAM.
        </p>

        <button
          type="button"
          onClick={onBrowseClick}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950/20"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Select PDF Documents</span>
        </button>
      </div>
    );
  }

  // 2. Image Converter: 🖼️ -> 📄 / WebP / PNG
  if (toolSlug.includes('converter') || toolSlug.includes('webp') || toolSlug.includes('jpg-to-pdf')) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center w-full">
        {/* 2D Explanatory Visual Diagram */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 mb-6 flex items-center justify-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400"
          >
            <ImageIcon className="w-7 h-7 mb-1" />
            <span className="text-[10px] font-mono font-bold">Input Image</span>
          </motion.div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1">Transform</span>
            <ArrowRight className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="flex flex-col items-center p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
          >
            <FileText className="w-7 h-7 mb-1 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold">Optimized Target</span>
          </motion.div>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-100">
          Drop your image here to convert
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
          Converts PNG, JPG, WebP, SVG, and GIF instantly with zero quality degradation.
        </p>

        <button
          type="button"
          onClick={onBrowseClick}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950/20"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Image File</span>
        </button>
      </div>
    );
  }

  // 3. QR Generator: Text / URL -> [ QR Animation ]
  if (toolSlug.includes('qr') || toolSlug.includes('barcode')) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center w-full">
        {/* 2D Explanatory Visual Diagram */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 mb-6 flex flex-col items-center">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono text-xs flex items-center gap-2">
            <span className="text-emerald-400 font-bold">URL / Text:</span>
            <span>https://ahadex.fun</span>
          </div>

          <ArrowDown className="w-4 h-4 text-emerald-400 my-2 animate-bounce" />

          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-lg shadow-emerald-950/40"
          >
            <QrCode className="w-10 h-10" />
          </motion.div>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-100">
          Generate your custom QR Code
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
          Type any URL, Wi-Fi configuration, or text string to construct crisp vector SVG or high-res PNG codes.
        </p>

        <button
          type="button"
          onClick={onBrowseClick}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Enter Input Data</span>
        </button>
      </div>
    );
  }

  // 4. Image Compressor: [ Large MB ] -> [ Squeezed KB ]
  if (toolSlug.includes('compressor') || toolSlug.includes('compress')) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center w-full">
        {/* 2D Explanatory Visual Diagram */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 mb-6 flex items-center justify-center gap-4">
          <div className="flex flex-col items-center p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <ImageIcon className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-mono font-bold">5.8 MB (Original)</span>
          </div>

          <div className="flex flex-col items-center text-cyan-400">
            <Minimize2 className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-mono font-bold mt-1">-82%</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <ImageIcon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-mono font-bold">980 KB (Lossless)</span>
          </div>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-100">
          Compress images without quality loss
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
          Squeeze megabytes into lightweight kilobytes using smart browser quantization algorithms.
        </p>

        <button
          type="button"
          onClick={onBrowseClick}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950/20"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Image to Compress</span>
        </button>
      </div>
    );
  }

  // 5. Default Generic Empty State
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center w-full">
      <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-950/20">
        <UploadCloud className="w-8 h-8 animate-pulse" />
      </div>

      <h4 className="text-base sm:text-lg font-bold text-slate-100">
        Drop your input file here, or browse
      </h4>
      <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
        Supports instant client-side execution. Your data is computed strictly on your device.
      </p>

      <button
        type="button"
        onClick={onBrowseClick}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950/20"
      >
        <UploadCloud className="w-4 h-4" />
        <span>Browse Files</span>
      </button>
    </div>
  );
};
