import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight, Shield, Zap, Lock, Cpu, Command } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TiltCard } from '../animations/TiltCard';
import { FloatingElement } from '../animations/FloatingElement';

interface HeroSectionProps {
  onOpenSearch: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenSearch,
  onExploreClick,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const quickTags = [
    { label: 'PDF Merge', slug: 'pdf-merger' },
    { label: 'WebP Converter', slug: 'webp-converter' },
    { label: 'JSON Formatter', slug: 'json-formatter' },
    { label: 'QR Generator', slug: 'qr-code-generator' },
    { label: 'Password Gen', slug: 'password-generator' },
    { label: 'ATS Resume', slug: 'ats-resume-scanner' },
  ];

  // Staggered animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center"
      >
        {/* Step 2: Animated Badge */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-cyan-400/30 text-cyan-300 text-xs font-mono shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="font-semibold">{t.hero.badge}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-[11px]">v1.0 Architecture</span>
          </div>
        </motion.div>

        {/* Step 3: Large Animated Headline */}
        <motion.div variants={itemVariants} className="max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.15]">
            {t.hero.titlePart1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              {t.hero.titleGradient}
            </span>
            <br className="hidden sm:inline" />
            {' '}{t.hero.titlePart2}
          </h1>
        </motion.div>

        {/* Step 4: Description */}
        <motion.div variants={itemVariants} className="mt-5 max-w-2xl">
          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed">
            {t.hero.subtitle}
          </p>
        </motion.div>

        {/* Step 5: Large Futuristic Search Bar */}
        <motion.div variants={itemVariants} className="mt-8 w-full max-w-2xl">
          <div
            onClick={onOpenSearch}
            className="group relative w-full h-14 px-4 sm:px-5 rounded-2xl glass-input border border-cyan-500/30 hover:border-cyan-400/80 shadow-xl shadow-cyan-950/20 hover:shadow-cyan-900/30 flex items-center justify-between cursor-pointer transition-all duration-300"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

            <div className="flex items-center gap-3 w-full">
              <Search className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm sm:text-base text-slate-400/80 group-hover:text-slate-200 transition-colors truncate">
                {t.common.searchPlaceholder}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                <Command className="w-3.5 h-3.5" />
                <span>K</span>
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Trending Tags */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              {t.hero.quickTagsLabel}
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag.slug}
                type="button"
                onClick={onOpenSearch}
                className="px-2.5 py-1 rounded-lg glass-card hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition-colors cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 6: CTA Buttons */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            variant="primary"
            onClick={onExploreClick}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {t.hero.exploreCta}
          </Button>

          <Button
            size="lg"
            variant="glass"
            onClick={onOpenSearch}
            leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
          >
            {t.hero.featuresCta}
          </Button>
        </motion.div>

        {/* Step 7: Floating Visual Highlights */}
        <motion.div variants={itemVariants} className="mt-12 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <TiltCard className="p-4 rounded-2xl glass-card border border-white/10 text-left">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Shield className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-400">Zero file upload retention on remote servers.</p>
          </TiltCard>

          <TiltCard className="p-4 rounded-2xl glass-card border border-white/10 text-left">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Sub-Second
              </span>
            </div>
            <p className="text-xs text-slate-400">Instant processing powered by WebAssembly.</p>
          </TiltCard>

          <TiltCard className="p-4 rounded-2xl glass-card border border-white/10 text-left">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Lock className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Cryptographic
              </span>
            </div>
            <p className="text-xs text-slate-400">SHA-256 and Web Crypto hardware hashing.</p>
          </TiltCard>

          <TiltCard className="p-4 rounded-2xl glass-card border border-white/10 text-left">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Modern Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Modular future-proof tool architecture.</p>
          </TiltCard>
        </motion.div>
      </motion.div>
    </section>
  );
};
