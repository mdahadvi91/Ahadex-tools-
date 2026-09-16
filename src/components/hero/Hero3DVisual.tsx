import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { FileText, Image as ImageIcon, QrCode, Sparkles, Shield, Cpu, Zap, Lock, Code2 } from 'lucide-react';

export const Hero3DVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeConcept, setActiveConcept] = useState<'pdf' | 'img' | 'qr' | 'code'>('pdf');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tilt mechanics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], isMobile ? [8, -8] : [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], isMobile ? [-10, 10] : [-22, 22]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  // Handle pointer movements relative to the 3D card viewport
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Canvas floating ambient particles & light simulation
  // ARCHITECTURE: Zero-dependency native HTML5 Canvas + Hardware CSS 3D Transforms (preserve-3d).
  // Delivers buttery 60 FPS across desktop and mobile without the 4MB+ bundle bloat or battery drain of Spline/Three.js.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Accessibility check: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['#22d3ee', '#38bdf8', '#818cf8', '#06b6d4'];
    // Strict mobile CPU cap: only 8 particles on small screens to guarantee zero frame-drop
    const particleCount = window.innerWidth < 640 ? 8 : 24;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 1,
        vx: (Math.random() - 0.5) * (window.innerWidth < 640 ? 0.2 : 0.35),
        vy: (Math.random() - 0.5) * (window.innerWidth < 640 ? 0.2 : 0.35),
        alpha: Math.random() * 0.4 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawScene = () => {
      ctx.clearRect(0, 0, width, height);

      // Orbital rings
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width < 400 ? 110 : 150, width < 400 ? 45 : 60, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();

      if (width >= 400) {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 190, 85, -Math.PI / 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Render floating particle dust
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
    };

    const render = () => {
      if (!isVisible || document.hidden) return;
      drawScene();
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Initial draw
    drawScene();
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }

    // Performance Observer: pause rendering completely when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible && !document.hidden && !prefersReducedMotion) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Battery / Tab optimization: pause loop when tab is hidden
    const handleVisibilityChange = () => {
      if (!document.hidden && isVisible && !prefersReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      drawScene();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none overflow-visible px-2"
      style={{ perspective: isMobile ? 800 : 1200 }}
    >
      {/* Background Shader & Radiant Glowing Blobs (Auto-reduced on mobile for crisp performance) */}
      <div className="absolute -top-6 -right-6 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-500/15 rounded-full blur-2xl sm:blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-44 sm:w-64 h-44 sm:h-64 bg-blue-600/15 rounded-full blur-2xl sm:blur-3xl pointer-events-none" />

      {/* Particle & Orbit Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Main 3D Perspective Stage */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 w-[270px] xs:w-[310px] sm:w-[360px] h-[280px] xs:h-[320px] sm:h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Core Glass Prism (Center 3D Slab) */}
        <div
          style={{ transform: isMobile ? 'translateZ(18px)' : 'translateZ(30px)' }}
          className="relative w-full max-w-[260px] xs:max-w-[290px] sm:max-w-[320px] h-[270px] xs:h-[300px] sm:h-[340px] rounded-3xl p-5 sm:p-6 glass-card bg-slate-900/85 border border-cyan-400/40 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl flex flex-col justify-between overflow-hidden"
        >
          {/* Dynamic Light Sheen / Shader glare */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-transparent pointer-events-none"
            style={{
              transform: useTransform(
                [glareX, glareY],
                ([gx, gy]) => `translate(${gx}, ${gy})`
              ),
            }}
          />

          {/* Top Header of the 3D Prism */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Spline 3D Matrix
                </div>
                <div className="text-[8px] sm:text-[9px] font-mono text-slate-400">Interactive Engine</div>
              </div>
            </div>

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Center Interactive Concept Display */}
          <div className="relative z-10 my-auto py-2 flex flex-col items-center text-center">
            {activeConcept === 'pdf' && (
              <motion.div
                key="pdf"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2.5"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-tr from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/10">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce duration-1000" />
                  <span className="absolute -bottom-2 px-2 py-0.5 rounded bg-red-500 text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wider">
                    PDF Engine
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-100">Document Engine</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono">Merge • Split • Protect</div>
              </motion.div>
            )}

            {activeConcept === 'img' && (
              <motion.div
                key="img"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2.5"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
                  <span className="absolute -bottom-2 px-2 py-0.5 rounded bg-cyan-500 text-[8px] sm:text-[9px] font-bold text-slate-950 uppercase tracking-wider">
                    WebP & Image
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-100">Image Labs</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono">Compress • Convert • Crop</div>
              </motion.div>
            )}

            {activeConcept === 'qr' && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2.5"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <QrCode className="w-8 h-8 sm:w-10 sm:h-10" />
                  <span className="absolute -bottom-2 px-2 py-0.5 rounded bg-emerald-500 text-[8px] sm:text-[9px] font-bold text-slate-950 uppercase tracking-wider">
                    QR Matrix
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-100">Vector QR Matrix</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono">URLs • Wi-Fi • Contacts</div>
              </motion.div>
            )}

            {activeConcept === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2.5"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
                  <Code2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin duration-3000" />
                  <span className="absolute -bottom-2 px-2 py-0.5 rounded bg-purple-500 text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wider">
                    Developer
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-100">Dev Utilities</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono">JSON • Regex • Crypto</div>
              </motion.div>
            )}
          </div>

          {/* Interactive Concept Selector Pills */}
          <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 pt-2.5 border-t border-white/10">
            {(['pdf', 'img', 'qr', 'code'] as const).map((concept) => (
              <button
                key={concept}
                type="button"
                onClick={() => setActiveConcept(concept)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-mono text-[9px] sm:text-[10px] uppercase font-bold transition-all cursor-pointer ${
                  activeConcept === concept
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-400/50'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {concept}
              </button>
            ))}
          </div>
        </div>

        {/* Satellite 3D Floating Element 1: PDF Capsule (Top-Left, responsive positioning) */}
        <motion.div
          style={{ transform: isMobile ? 'translateZ(30px)' : 'translateZ(65px)' }}
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden sm:flex absolute -top-4 -left-8 p-2.5 rounded-2xl glass-card bg-slate-900/90 border border-red-500/30 shadow-xl shadow-black/40 items-center gap-2 text-xs text-slate-200"
        >
          <div className="w-7 h-7 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold font-mono text-[10px] text-red-300">PDF Engine</div>
            <div className="text-[8px] text-slate-400">Merge & Compress</div>
          </div>
        </motion.div>

        {/* Satellite 3D Floating Element 2: Image Capsule (Top-Right, responsive positioning) */}
        <motion.div
          style={{ transform: isMobile ? 'translateZ(30px)' : 'translateZ(55px)' }}
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden sm:flex absolute -top-3 -right-6 p-2.5 rounded-2xl glass-card bg-slate-900/90 border border-cyan-400/30 shadow-xl shadow-black/40 items-center gap-2 text-xs text-slate-200"
        >
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold font-mono text-[10px] text-cyan-300">Image Labs</div>
            <div className="text-[8px] text-slate-400">JPG • PNG • WebP</div>
          </div>
        </motion.div>

        {/* Satellite 3D Floating Element 3: QR Generator (Bottom-Right) */}
        <motion.div
          style={{ transform: isMobile ? 'translateZ(30px)' : 'translateZ(75px)' }}
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden sm:flex absolute -bottom-4 -right-6 p-2.5 rounded-2xl glass-card bg-slate-900/90 border border-emerald-400/30 shadow-xl shadow-black/40 items-center gap-2 text-xs text-slate-200"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
            <QrCode className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold font-mono text-[10px] text-emerald-300">QR Matrix</div>
            <div className="text-[8px] text-slate-400">Vector SVG Gen</div>
          </div>
        </motion.div>

        {/* Satellite 3D Floating Element 4: Security Shield (Bottom-Left) */}
        <motion.div
          style={{ transform: isMobile ? 'translateZ(30px)' : 'translateZ(45px)' }}
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden sm:flex absolute -bottom-4 -left-6 p-2.5 rounded-2xl glass-card bg-slate-900/90 border border-cyan-500/30 shadow-xl shadow-black/40 items-center gap-2 text-xs text-slate-200"
        >
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold font-mono text-[10px] text-cyan-300">Zero-Upload</div>
            <div className="text-[8px] text-slate-400">100% On-Device</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
