import React from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Zap,
  EyeOff,
  Boxes,
  Lock,
  Sparkles,
  ArrowDown,
  ArrowRight,
  Laptop,
  CheckCircle,
  FileCheck,
  Upload,
  Cpu,
  Download,
} from 'lucide-react';
import { Reveal } from '../animations/Reveal';
import { TiltCard } from '../animations/TiltCard';
import { useLanguage } from '../../context/LanguageContext';

export const WhyAhadex: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Engine Advantages</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              {t.features.title}
            </h2>
            <p className="text-xs sm:text-base text-slate-400 mt-3 leading-relaxed">
              Engineered with privacy-by-design, cryptographic guarantees, and native client speed.
            </p>
          </div>
        </Reveal>

        {/* 3 Core High-Impact Features with 2D Visual Diagrams */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Private Processing */}
          <Reveal delay={0.08} direction="up">
            <TiltCard maxTilt={4} className="h-full">
              <div className="h-full p-6 rounded-2xl glass-card border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      Zero-Upload
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">
                    Private Processing
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    Your files never transit external servers or cloud queues. Computation stays in your device memory.
                  </p>
                </div>

                {/* 2D Explanatory Visual: Laptop -> Local Process -> Device */}
                <div className="my-5 p-4 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Laptop className="w-5 h-5" />
                    <span className="text-xs font-mono font-bold">[ User File ]</span>
                  </div>

                  <ArrowDown className="w-3.5 h-3.5 text-cyan-400 my-1.5 animate-bounce" />

                  <div className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-semibold">
                    Local In-Browser WASM
                  </div>

                  <ArrowDown className="w-3.5 h-3.5 text-emerald-400 my-1.5 animate-bounce" />

                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>✓ Device Only (No Cloud Upload)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GDPR & HIPAA Compliant</span>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* Feature 2: Fast Processing */}
          <Reveal delay={0.16} direction="up">
            <TiltCard maxTilt={4} className="h-full">
              <div className="h-full p-6 rounded-2xl glass-card border border-white/10 hover:border-blue-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      Multi-Threaded
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">
                    Fast Processing
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    Zero upload wait times or server queue congestion. Execution occurs instantly at RAM speeds.
                  </p>
                </div>

                {/* 2D Explanatory Visual: Animated File Processing Illustration */}
                <div className="my-5 p-4 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col items-center justify-center">
                  <div className="relative w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-md">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    >
                      <Cpu className="w-7 h-7" />
                    </motion.div>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  </div>

                  <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-slate-300">
                    <span className="text-cyan-400 font-bold">Latency:</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300">
                      ~16ms to 45ms
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">Native C++ compilation</span>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>Hardware Accelerated</span>
                </div>
              </div>
            </TiltCard>
          </Reveal>

          {/* Feature 3: Easy to Use */}
          <Reveal delay={0.24} direction="up">
            <TiltCard maxTilt={4} className="h-full">
              <div className="h-full p-6 rounded-2xl glass-card border border-white/10 hover:border-emerald-400/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Zero Friction
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">
                    Easy to Use
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    No registrations, no intrusive popups, and no limits. Open any tool and execute in seconds.
                  </p>
                </div>

                {/* 2D Explanatory Visual: Upload -> Process -> Download */}
                <div className="my-5 p-4 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-center gap-2">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-white/5 text-[10px] font-mono text-slate-300">
                    <Upload className="w-4 h-4 text-cyan-400 mb-1" />
                    <span>Upload</span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />

                  <div className="flex flex-col items-center p-2 rounded-lg bg-white/5 text-[10px] font-mono text-slate-300">
                    <Cpu className="w-4 h-4 text-purple-400 mb-1" />
                    <span>Process</span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />

                  <div className="flex flex-col items-center p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono text-emerald-300 font-bold">
                    <Download className="w-4 h-4 text-emerald-400 mb-1" />
                    <span>Download</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Free & Unlimited</span>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
