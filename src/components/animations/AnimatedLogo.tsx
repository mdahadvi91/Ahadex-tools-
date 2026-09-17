import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
  const shouldReduceMotion = useReducedMotion();

  const iconSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base font-extrabold tracking-tight',
    md: 'text-base sm:text-xl font-extrabold tracking-tight',
    lg: 'text-xl sm:text-2xl font-extrabold tracking-tight',
  };

  return (
    <Link
      to="/"
      id="brand-logo-link"
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl select-none ${className}`}
      aria-label="AHADEX TOOLS Home"
    >
      {/* Living Logo Container */}
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, -1.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}
      >
        {/* Ambient Pulsing Aura */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { scale: [1, 1.1, 1], opacity: [0.35, 0.65, 0.35] }
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 blur-[8px] pointer-events-none"
        />

        {/* Outer Rotating Shield Border */}
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-xl border border-cyan-400/40 group-hover:border-cyan-300 transition-colors duration-300"
        />

        {/* Core Glass Polygon Mark */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 border border-white/20 flex items-center justify-center shadow-inner overflow-hidden">
          {/* Continuous Subtle Light Sweep */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : { x: ['-100%', '200%'] }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent pointer-events-none"
          />

          {/* Lettermark ▲ Symbol */}
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-400 text-xs sm:text-sm tracking-tighter transform group-hover:scale-110 transition-transform duration-300">
            ▲
          </span>
        </div>
      </motion.div>

      {/* Brand Text Identity */}
      {showText && (
        <div className="flex flex-col justify-center shrink-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${textSizes[size]} text-slate-100 tracking-tight font-extrabold group-hover:text-cyan-200 transition-colors`}
            >
              AHADEX
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
              TOOLS
            </span>
          </div>
        </div>
      )}
    </Link>
  );
};
