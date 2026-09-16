import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import { Tool } from '../../types';
import { ToolIconLottie } from '../animations/ToolIconLottie';
import { Badge } from '../ui/Badge';
import { TiltCard } from '../animations/TiltCard';

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, featured = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TiltCard maxTilt={3.5} className="h-full w-full">
      {/* Outer Spinning Border Frame Wrapper */}
      <div className="relative p-[1.5px] rounded-2xl overflow-hidden group h-full w-full shadow-lg transition-all duration-300">
        {/* Continuous 360-degree Rotating Neon Light Beam around Card Border */}
        <div className="absolute -inset-[200%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_260deg,#06b6d4_310deg,#3b82f6_360deg)] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Inner Tool Card Content */}
        <Link
          to={`/tools/${tool.slug}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative flex flex-col justify-between h-full rounded-[14px] p-2.5 xs:p-3 sm:p-4 md:p-5 transition-all duration-300 overflow-hidden ${
            featured
              ? 'bg-gradient-to-br from-slate-900/98 via-slate-950/95 to-cyan-950/40 shadow-cyan-950/30'
              : 'bg-slate-900/95 hover:bg-slate-900/98'
          }`}
        >
          {/* Subtle Ambient Radial Light Aura on Hover */}
          <div
            className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none ${
              isHovered ? 'bg-cyan-400/20 opacity-100' : 'bg-cyan-500/5 opacity-0'
            }`}
          />

          <div>
            {/* Top Row: Micro-Lottie Icon + Badge/Category */}
            <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
              {/* Animated Icon Container with Glow */}
              <div
                className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border transition-all duration-300 shrink-0 ${
                  isHovered
                    ? 'bg-cyan-500/20 border-cyan-400/60 scale-105 shadow-md shadow-cyan-500/25 text-cyan-300'
                    : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
                }`}
              >
                <ToolIconLottie
                  toolSlug={tool.slug}
                  categorySlug={tool.categorySlug}
                  isHovered={isHovered}
                />
              </div>

              {/* Badges / Category Pills */}
              <div className="flex items-center gap-1 flex-wrap justify-end">
                {tool.badge && (
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0 truncate">
                    {tool.badge}
                  </span>
                )}
                <span className="hidden xs:inline-block text-[8px] sm:text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400 shrink-0">
                  {tool.categorySlug}
                </span>
              </div>
            </div>

            {/* Tool Title */}
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
              {tool.name}
            </h3>

            {/* Tool Description */}
            <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-400 mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
              {tool.description}
            </p>
          </div>

          {/* Card Footer: Clean Device Indicator & Interactive Action Button */}
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <span className="hidden sm:inline-block truncate">Client RAM</span>
            </div>

            {/* High-Craft Interactive Open Button */}
            <div className="w-full sm:w-auto px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:border-transparent group-hover:text-slate-950 group-hover:shadow-md group-hover:shadow-cyan-500/30 text-cyan-300 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-bold transition-all duration-200">
              <span>Open Tool</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
            </div>
          </div>
        </Link>
      </div>
    </TiltCard>
  );
};
