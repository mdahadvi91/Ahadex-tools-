import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { TOOLS_REGISTRY } from '../../tools/registry';
import { ToolCard } from './ToolCard';
import { Reveal } from '../animations/Reveal';
import { useLanguage } from '../../context/LanguageContext';

export const FeaturedToolsSection: React.FC = () => {
  const { t } = useLanguage();
  const featuredTools = TOOLS_REGISTRY.filter((tool) => tool.isFeatured).slice(0, 4);

  return (
    <section className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Engine Highlights</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Featured Utilities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Hand-picked browser utilities optimized for instant execution with zero server latency.
            </p>
          </div>
        </Reveal>

        {/* Featured Grid Layout: Large Hero Card + Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTools.map((tool, index) => (
            <Reveal key={tool.id} delay={index * 0.08} direction="up">
              <ToolCard tool={tool} featured={index === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
