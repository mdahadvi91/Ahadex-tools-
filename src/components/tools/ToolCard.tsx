import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { Tool } from '../../types';
import { ToolIconLottie } from '../animations/ToolIconLottie';
import { Badge } from '../ui/Badge';

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, featured = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="h-full w-full">
      <Link
        to={`/tools/${tool.slug}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative flex flex-col justify-between h-full rounded-2xl p-4 sm:p-5 transition-all duration-300 overflow-hidden border cursor-pointer active:scale-[0.98] ${
          featured
            ? 'bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-xl hover:shadow-cyan-950/40'
            : 'bg-slate-900/80 hover:bg-slate-900/95 border-slate-800/80 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/30'
        }`}
      >
        {/* Subtle Ambient Hover Glow */}
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'bg-cyan-500/15 opacity-100' : 'opacity-0'
          }`}
        />

        <div>
          {/* Top Row: Hero Tool Icon + Category & Badge Pills */}
          <div className="flex items-start justify-between gap-2 mb-3.5">
            {/* Tool Icon as Card Hero Element */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all duration-300 shrink-0 ${
                isHovered
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 scale-105 shadow-md shadow-cyan-500/20'
                  : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
              }`}
            >
              <ToolIconLottie
                toolSlug={tool.slug}
                categorySlug={tool.categorySlug}
                isHovered={isHovered}
              />
            </div>

            {/* Badges / Category Tag */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {tool.badge && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                    tool.badge === 'Popular'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : tool.badge === 'New'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  {tool.badge}
                </span>
              )}
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 shrink-0">
                {tool.category}
              </span>
            </div>
          </div>

          {/* Tool Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-200 transition-colors line-clamp-1 leading-snug">
            {tool.name}
          </h3>

          {/* Tool Concise Description */}
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Card Footer: Privacy Indicator & Open CTA */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
          {/* Subtle Client-Side Privacy Indicator */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">100% Client Privacy</span>
          </div>

          {/* Prominent Open Tool CTA */}
          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:border-transparent group-hover:text-slate-950 group-hover:shadow-md group-hover:shadow-cyan-500/25 text-cyan-300 flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-200 shrink-0">
            <span>Open Tool</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
          </div>
        </div>
      </Link>
    </div>
  );
};

