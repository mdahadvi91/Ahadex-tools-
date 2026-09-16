import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
  };

  return (
    <Link
      to="/"
      id="brand-logo-link"
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl select-none ${className}`}
      aria-label="AHADEX TOOLS Home"
    >
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        {/* Ambient Glow Aura */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 blur-[10px] opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

        {/* Outer Rotating Shield/Polygon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-xl border border-cyan-400/40 group-hover:border-cyan-400/80 transition-colors duration-300"
        />

        {/* Center Futuristic Hex Mark */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/80 border border-white/15 flex items-center justify-center shadow-inner overflow-hidden">
          {/* Subtle light sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

          {/* Lettermark 'A' / Delta Glyph */}
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 text-sm md:text-base tracking-tighter transform group-hover:scale-110 transition-transform duration-300">
            ▲
          </span>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${textSizes[size]} text-slate-100 tracking-wider font-extrabold`}>
              AHADEX
            </span>
            <span className="text-xs uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-semibold">
              TOOLS
            </span>
          </div>
          <span className="text-[10px] text-slate-400 tracking-wide font-mono hidden sm:inline-block">
            UTILITY PLATFORM
          </span>
        </div>
      )}
    </Link>
  );
};
