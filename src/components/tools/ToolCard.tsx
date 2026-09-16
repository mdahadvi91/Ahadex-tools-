import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';
import { Tool } from '../../types';
import { AnimatedIcon } from '../animations/AnimatedIcon';
import { Badge } from '../ui/Badge';
import { TiltCard } from '../animations/TiltCard';

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, featured = false }) => {
  return (
    <TiltCard
      maxTilt={featured ? 6 : 4}
      className={`h-full ${featured ? 'md:col-span-2' : ''}`}
    >
      <Link
        to={`/tools/${tool.slug}`}
        className={`group relative flex flex-col justify-between h-full rounded-2xl glass-card p-5 sm:p-6 border transition-all duration-300 shine-sweep ${
          featured
            ? 'border-cyan-500/40 hover:border-cyan-400 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-cyan-950/20 shadow-lg shadow-cyan-950/20'
            : 'border-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-950/20'
        }`}
      >
        <div>
          {/* Card Top: Icon & Badges */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                featured
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 group-hover:scale-105 group-hover:bg-cyan-500/30'
                  : 'bg-white/5 text-slate-300 border-white/10 group-hover:text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10'
              }`}
            >
              <AnimatedIcon name={tool.iconName} className="w-5 h-5" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {tool.badge && (
                <Badge
                  variant={featured ? 'cyan' : 'blue'}
                  withDot={tool.badge === 'Popular'}
                >
                  {tool.badge}
                </Badge>
              )}
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                {tool.categorySlug}
              </span>
            </div>
          </div>

          {/* Tool Title & Description */}
          <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
            {tool.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Card Footer: Tags & Micro Action */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate max-w-[70%]">
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Client-Side Engine</span>
          </div>

          <div className="flex items-center gap-1 text-cyan-400 font-medium group-hover:translate-x-1 transition-transform duration-200">
            <span className="text-xs">Open</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </Link>
    </TiltCard>
  );
};
