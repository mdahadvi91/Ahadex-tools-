import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight, ShieldCheck, Zap, Lock, Command } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
    { label: 'Visiting Card', slug: 'visiting-card-generator' },
    { label: 'Photo QR Badge', slug: 'photo-qr-badge-generator' },
  ];

  return (
    <section className="relative pt-4 pb-8 sm:pt-8 sm:pb-12 overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 text-center relative z-10 space-y-5">
        {/* Supporting Trust Line Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span>Fast • Simple • Privacy-first</span>
        </div>

        {/* Short & Powerful Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
          Simple tools for <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            everyday digital work.
          </span>
        </h1>

        {/* Concise Subtitle */}
        <p className="text-xs sm:text-base text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
          Create, convert, organize and manage your digital files with fast, privacy-first web tools.
        </p>

        {/* Direct Search & Quick Tags Box */}
        <div className="pt-2 max-w-lg mx-auto space-y-3">
          <div
            onClick={onOpenSearch}
            className="group relative w-full h-12 px-4 rounded-xl glass-input border border-cyan-500/30 hover:border-cyan-400/80 shadow-md flex items-center justify-between cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2.5 w-full truncate">
              <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                Search tools or utilities...
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                <Command className="w-3 h-3" />
                <span>K</span>
              </span>
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Quick Tools Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-500 font-mono text-[11px] mr-1">Popular:</span>
            {quickTags.map((tag) => (
              <Link
                key={tag.slug}
                to={`/tools/${tag.slug}`}
                className="px-2.5 py-1 rounded-lg glass-card hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition-colors cursor-pointer"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
