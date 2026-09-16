import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MousePointerClick,
  UploadCloud,
  Cpu,
  Download,
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';
import { Reveal } from '../animations/Reveal';
import { useLanguage } from '../../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      number: '①',
      icon: <MousePointerClick className="w-5 h-5 text-cyan-400" />,
      title: 'Choose Tool',
      description: 'Select from 30+ specialized PDF, image, cryptographic, and developer modules.',
      visual: (
        <div className="h-28 w-full rounded-xl bg-slate-950/60 border border-white/5 p-3 flex flex-col justify-between overflow-hidden relative">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono">
            <Search className="w-3 h-3 text-cyan-400" />
            <span>Search: "pdf merge"</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <motion.div
              animate={{ scale: [0.96, 1.02, 0.96] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-bold text-cyan-300 flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              <span>PDF Merge</span>
            </motion.div>
            <div className="p-1.5 rounded-lg bg-white/5 text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>WebP Conv</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: '②',
      icon: <UploadCloud className="w-5 h-5 text-blue-400" />,
      title: 'Upload File',
      description: 'Drop your files into the sandbox. Data remains inside your browser memory.',
      visual: (
        <div className="h-28 w-full rounded-xl bg-slate-950/60 border border-white/5 p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <motion.div
            animate={{ y: [-4, 6, -4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2 p-2 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-mono shadow-md"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>document.pdf</span>
          </motion.div>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-3" />
          <span className="text-[9px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <Shield className="w-2.5 h-2.5" /> Client RAM Buffer
          </span>
        </div>
      ),
    },
    {
      number: '③',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: 'Process Locally',
      description: 'WebAssembly executes calculations in parallel using native device cores.',
      visual: (
        <div className="h-28 w-full rounded-xl bg-slate-950/60 border border-white/5 p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-md">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Cpu className="w-6 h-6" />
            </motion.div>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="mt-2 text-[10px] font-mono text-purple-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>WASM Execution: 18ms</span>
          </div>
        </div>
      ),
    },
    {
      number: '④',
      icon: <Download className="w-5 h-5 text-emerald-400" />,
      title: 'Instant Download',
      description: 'Save the optimized output instantly. The memory cache is cleanly purged.',
      visual: (
        <div className="h-28 w-full rounded-xl bg-slate-950/60 border border-white/5 p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[11px] shadow-lg shadow-emerald-500/25"
          >
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>File Ready!</span>
          </motion.div>
          <span className="text-[9px] font-mono text-slate-400 mt-2">Zero traces retained</span>
        </div>
      ),
    },
  ];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Pipeline Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              {t.howItWorks.title}
            </h2>
            <p className="text-xs sm:text-base text-slate-400 mt-3 leading-relaxed">
              Step-by-step 100% on-device architecture explained visually.
            </p>
          </div>
        </Reveal>

        {/* 4-Step Interactive Journey with 2D Visuals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((step, idx) => (
            <Reveal key={step.number} delay={idx * 0.08} direction="up">
              <div
                onMouseEnter={() => setActiveStep(idx)}
                className={`relative h-full p-5 rounded-2xl glass-card border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  activeStep === idx
                    ? 'border-cyan-400/60 bg-slate-900/90 shadow-xl shadow-cyan-950/30 -translate-y-1'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xl font-black text-cyan-400">
                      {step.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* 2D Explanatory Animation Visual */}
                <div className="mt-auto pt-2">
                  {step.visual}
                </div>

                {/* Active Indicator Line */}
                {activeStep === idx && (
                  <motion.div
                    layoutId="howItWorksLine"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
