import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

export const AnimatedGradient: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* 1. Desktop Responsive Background Image (Sci-Fi Cyberpunk Planet & Neon City) */}
      <img
        src="/bg-futuristic-desktop.jpg"
        alt="AHADEX Cyberpunk Sci-Fi Background"
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 pointer-events-none"
        style={{ opacity: isDark ? 0.45 : 0.18 }}
      />

      {/* 2. Mobile Responsive Background Image (Optimized Portrait Visual) */}
      <img
        src="/bg-futuristic-mobile.jpg"
        alt="AHADEX Cyberpunk Sci-Fi Background Mobile"
        className="block md:hidden absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 pointer-events-none"
        style={{ opacity: isDark ? 0.50 : 0.20 }}
      />

      {/* 3. Dynamic Theme Backdrop Overlay Filter */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-b from-[#080b11]/75 via-[#0c121e]/82 to-[#080b11]/92 backdrop-blur-[2px]'
            : 'bg-gradient-to-b from-[#f8fafc]/88 via-[#f1f5f9]/92 to-[#f8fafc]/95 backdrop-blur-[6px]'
        }`}
      />

      {/* 4. Subtle Matrix Grid Texture */}
      <div
        className={`absolute inset-0 bg-grid-pattern transition-opacity duration-500 ${
          isDark ? 'opacity-40' : 'opacity-20'
        }`}
      />

      {/* 5. Primary Cyan Aurora Light Orb */}
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
        className={`absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full blur-[120px] will-change-transform ${
          isDark
            ? 'bg-gradient-to-br from-cyan-500/20 via-blue-600/12 to-transparent'
            : 'bg-gradient-to-br from-cyan-400/25 via-blue-400/15 to-transparent'
        }`}
      />

      {/* 6. Secondary Indigo/Purple Aurora Light Orb */}
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
        className={`absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full blur-[130px] will-change-transform ${
          isDark
            ? 'bg-gradient-to-bl from-purple-600/15 via-indigo-600/10 to-transparent'
            : 'bg-gradient-to-bl from-purple-400/20 via-sky-300/15 to-transparent'
        }`}
      />

      {/* 7. Tertiary Emerald Accent Orb */}
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
        className={`absolute bottom-10 left-1/3 w-[450px] h-[450px] rounded-full blur-[110px] will-change-transform ${
          isDark
            ? 'bg-gradient-to-tr from-teal-500/12 via-cyan-600/8 to-transparent'
            : 'bg-gradient-to-tr from-teal-400/15 via-blue-300/10 to-transparent'
        }`}
      />

      {/* Vignette Edge Shading */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-b from-transparent via-transparent to-[#080b11]/80'
            : 'bg-gradient-to-b from-transparent via-transparent to-[#f8fafc]/70'
        }`}
      />
    </div>
  );
};
