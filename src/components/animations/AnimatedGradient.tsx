import React from 'react';
import { motion } from 'motion/react';

export const AnimatedGradient: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Subtle Matrix Grid Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />

      {/* Primary Cyan Aurora Light Orb */}
      <motion.div
        animate={{
          x: ['0%', '15%', '-10%', '0%'],
          y: ['0%', '-20%', '15%', '0%'],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-cyan-500/18 via-blue-600/10 to-transparent blur-[120px] will-change-transform"
      />

      {/* Secondary Indigo/Purple Aurora Light Orb */}
      <motion.div
        animate={{
          x: ['0%', '-20%', '10%', '0%'],
          y: ['0%', '25%', '-15%', '0%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-600/15 via-indigo-600/10 to-transparent blur-[130px] will-change-transform"
      />

      {/* Tertiary Emerald Accent Orb */}
      <motion.div
        animate={{
          x: ['0%', '15%', '-15%', '0%'],
          y: ['0%', '-15%', '20%', '0%'],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-teal-500/10 via-cyan-600/8 to-transparent blur-[110px] will-change-transform"
      />

      {/* Vignette Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080b11]/30 to-[#080b11]/80" />
    </div>
  );
};
