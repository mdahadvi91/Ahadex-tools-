import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  ServerOff,
  Terminal,
  CheckCircle2,
  FileText,
  Laptop,
  ArrowDown,
  Shield,
  HardDrive,
} from 'lucide-react';
import { Reveal } from '../animations/Reveal';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="relative rounded-3xl glass-card border border-cyan-500/30 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl shadow-cyan-950/20">
            {/* Background Calm Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text Column */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Client-Side Security</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
                  Your Data Stays In Your Browser.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Always.
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                  Unlike traditional cloud converter services that upload your private documents,
                  passwords, or photos to remote servers, AHADEX TOOLS utilizes modern WebAssembly,
                  HTML5 APIs, and Web Cryptography. Processing happens right in your device memory.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No Cloud File Retention</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero Analytics Trackers</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Works Completely Offline</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Wasm Sandboxed Execution</span>
                  </div>
                </div>
              </div>

              {/* Serene, Calm 2D Flow Animation Visual */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md rounded-2xl glass-panel bg-slate-950/85 border border-white/10 p-6 sm:p-8 flex flex-col items-center shadow-xl relative overflow-hidden">
                  {/* Subtle calm top label */}
                  <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>ON-DEVICE TRUST PIPELINE</span>
                    </span>
                    <span className="text-emerald-400">STATUS: PRIVATE</span>
                  </div>

                  {/* STEP 1: Top File Icon with gentle calm downward motion */}
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-950/40">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 mt-1.5">
                      Private File
                    </span>
                  </motion.div>

                  {/* Flow Arrow 1 */}
                  <motion.div
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="my-2 text-cyan-400 flex flex-col items-center"
                  >
                    <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-400 to-cyan-500/20" />
                    <ArrowDown className="w-3.5 h-3.5 -mt-0.5" />
                  </motion.div>

                  {/* STEP 2: DEVICE Processing Box */}
                  <motion.div
                    animate={{ borderColor: ['rgba(34,211,238,0.3)', 'rgba(56,189,248,0.6)', 'rgba(34,211,238,0.3)'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full max-w-xs py-3 px-4 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-center shadow-lg shadow-black/60 relative"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Laptop className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
                        DEVICE
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-300 font-medium">
                      Local RAM Processing
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                      <ServerOff className="w-3 h-3 text-rose-400" />
                      <span>Zero network packet egress</span>
                    </div>
                  </motion.div>

                  {/* Flow Arrow 2 */}
                  <motion.div
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="my-2 text-emerald-400 flex flex-col items-center"
                  >
                    <div className="w-0.5 h-4 bg-gradient-to-b from-emerald-400 to-emerald-500/20" />
                    <ArrowDown className="w-3.5 h-3.5 -mt-0.5" />
                  </motion.div>

                  {/* STEP 3: Safe Outcome Badge (Tranquil, no confetti) */}
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-md"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold">✓ Safe & Ephemeral</span>
                  </motion.div>

                  <div className="text-[10px] font-mono text-slate-400 mt-4 text-center">
                    Data purged from browser cache on tab close
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
