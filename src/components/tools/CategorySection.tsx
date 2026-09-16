import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CATEGORIES } from '../../tools/registry';
import { AnimatedIcon } from '../animations/AnimatedIcon';
import { Reveal } from '../animations/Reveal';
import { TiltCard } from '../animations/TiltCard';
import { LayoutGrid, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const CategorySection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
                <LayoutGrid className="w-4 h-4" />
                <span>Architecture Breakdown</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                Browse by Category
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Specialized utility workspaces designed for discrete workflows and processing pipelines.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORIES.map((category, idx) => (
            <Reveal key={category.id} delay={idx * 0.05} direction="up">
              <TiltCard maxTilt={5} className="h-full">
                <Link
                  to={`/category/${category.slug}`}
                  className="group relative flex flex-col justify-between h-full rounded-2xl glass-card p-5 border border-white/10 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
                        <AnimatedIcon name={category.iconName} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400 group-hover:text-cyan-300 transition-colors">
                        {category.toolCount} tools
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {category.name}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-medium">
                    <span>Explore Suite</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
