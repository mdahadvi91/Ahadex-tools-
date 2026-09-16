import React from 'react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { AnimatedLogo } from '../components/animations/AnimatedLogo';
import { ShieldCheck, Cpu, Zap, Lock, Globe, Terminal, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <Reveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered For Speed & Privacy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
              About AHADEX TOOLS
            </h1>
            <p className="text-base sm:text-lg text-slate-300/90 mt-4 leading-relaxed">
              AHADEX TOOLS was conceived to restore privacy, reliability, and speed to daily web
              utilities. We build tools that run completely within your client environment.
            </p>
          </div>
        </Reveal>

        {/* The Core Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Reveal direction="up" delay={0.1}>
            <div className="p-8 rounded-3xl glass-card border border-white/10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">The Conventional Problem</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Most online file conversion and formatting sites require uploading your files to
                  unknown remote servers. This introduces data privacy risks, sluggish upload and
                  download delays, and aggressive intrusive advertising.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="p-8 rounded-3xl glass-card border border-cyan-500/30 h-full flex flex-col justify-between shadow-lg shadow-cyan-950/20">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">The AHADEX Standard</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We rewrite utility workflows for modern WebAssembly and native Web APIs. Every
                  action—merging documents, converting WebP graphics, parsing JSON, or hashing
                  passwords—occurs exclusively in your device&apos;s memory.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Pillars Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-100 mb-8 text-center">
            Our Architectural Foundations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <Zap className="w-6 h-6 text-blue-400 mb-3" />
              <h4 className="text-base font-bold text-slate-200">Zero Server Latency</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                By running locally, operations avoid upload network bottlenecks and process at the
                speed of your CPU.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <Cpu className="w-6 h-6 text-purple-400 mb-3" />
              <h4 className="text-base font-bold text-slate-200">Modern WebAssembly</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                High-performance compiled binary execution safely sandboxed in the browser engine.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <Globe className="w-6 h-6 text-emerald-400 mb-3" />
              <h4 className="text-base font-bold text-slate-200">Cloudflare Edge Ready</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Engineered for global static distribution via Cloudflare Pages with zero server
                maintenance.
              </p>
            </div>
          </div>
        </div>

        {/* Production Domain Info */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 text-center text-xs font-mono text-slate-400">
          AHADEX TOOLS • Targeted for Production Release at{' '}
          <a
            href="https://ahadex.fun/"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 underline underline-offset-4 font-bold"
          >
            https://ahadex.fun/
          </a>
        </div>
      </div>
    </PageTransition>
  );
};
