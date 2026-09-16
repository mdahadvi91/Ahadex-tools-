import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight, Shield, Zap, Lock, Cpu, Command, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Hero3DVisual } from './Hero3DVisual';

interface HeroSectionProps {
  onOpenSearch: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenSearch,
  onExploreClick,
}) => {
  const { t } = useLanguage();

  const quickTags = [
    { label: 'PDF Merge', slug: 'pdf-merger' },
    { label: 'WebP Converter', slug: 'webp-converter' },
    { label: 'QR Generator', slug: 'qr-code-generator' },
    { label: 'Image Compressor', slug: 'image-compressor' },
    { label: 'JSON Formatter', slug: 'json-formatter' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative pt-4 pb-14 md:pt-10 md:pb-20 overflow-hidden">
      {/* Background Animated Shader Gradient & Soft Glowing Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Responsive Grid: Left Details + Right Spline 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Typography & Controls */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Signature Pill: Fast • Private • Simple */}
            <motion.div variants={itemVariants} className="inline-block">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-card border border-cyan-400/30 text-cyan-300 text-xs font-mono shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="font-bold tracking-wide">Fast • Private • Simple</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400 text-[11px]">100% On-Device</span>
              </div>
            </motion.div>

            {/* Brand Headline */}
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="text-sm sm:text-base font-mono uppercase tracking-widest text-cyan-400 font-bold">
                AHADEX TOOLS
              </div>
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.12]">
                Next-Gen Suite for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  Files, PDF & Images
                </span>
              </h1>
            </motion.div>

            {/* Sub-description */}
            <motion.div variants={itemVariants}>
              <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl">
                Convert, compress, merge, and manipulate your documents locally. Zero uploads, zero latency, maximum privacy.
              </p>
            </motion.div>

            {/* Quick Search Trigger Bar */}
            <motion.div variants={itemVariants} className="max-w-xl">
              <div
                onClick={onOpenSearch}
                className="group relative w-full h-13 px-4 rounded-2xl glass-input border border-cyan-500/30 hover:border-cyan-400/80 shadow-lg shadow-cyan-950/20 hover:shadow-cyan-900/30 flex items-center justify-between cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-3 w-full truncate">
                  <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                    Search over 30+ instant client utilities...
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Quick Tags */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-mono text-[11px] mr-1">Trending:</span>
                {quickTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    to={`/tools/${tag.slug}`}
                    className="px-2 py-0.5 rounded-lg glass-card hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Interactive CTA Buttons with Rive-like micro-animations */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-3">
              {/* Explore Tools Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExploreClick}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer group"
              >
                <span>Explore Tools</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Get Started / Quick Launch Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenSearch}
                className="h-12 px-6 rounded-2xl glass-card hover:border-cyan-400/60 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>Get Started</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Spline 3D Visual Stage */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <Hero3DVisual />
          </div>
        </div>

        {/* Feature Badges Bottom Row */}
        <motion.div
          variants={itemVariants}
          className="mt-14 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          <div className="p-3.5 rounded-2xl glass-card border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-slate-200 truncate">100% Client-Side</div>
              <div className="text-[11px] text-slate-400 truncate">Zero server file transit</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl glass-card border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-slate-200 truncate">Instant Latency</div>
              <div className="text-[11px] text-slate-400 truncate">WASM execution in RAM</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl glass-card border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-slate-200 truncate">Web Crypto API</div>
              <div className="text-[11px] text-slate-400 truncate">SHA-256 hardware secure</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl glass-card border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-slate-200 truncate">30+ Utilities</div>
              <div className="text-[11px] text-slate-400 truncate">Growing open suite</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
