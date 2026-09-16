import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, Terminal, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../animations/Reveal';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="relative rounded-3xl glass-card border border-cyan-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl shadow-cyan-950/20">
            {/* Background Light Beam */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Client-Side Security</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  Your Data Stays In Your Browser.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Always.
                  </span>
                </h2>

                <p className="text-sm text-slate-300/90 leading-relaxed">
                  Unlike traditional web converter services that upload your private documents,
                  passwords, or photos to unknown remote servers, AHADEX TOOLS utilizes modern
                  WebAssembly, HTML5 APIs, and Web Cryptography. Processing happens right in your
                  device memory.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
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

              {/* Visual Interactive Terminal Blueprint */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl glass-panel bg-slate-950/90 border border-white/10 p-4 font-mono text-xs shadow-inner">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] text-slate-400">client_sandbox.env</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] leading-relaxed">
                    <p className="text-slate-400">
                      <span className="text-cyan-400">$</span> init_sandbox --security=maximum
                    </p>
                    <p className="text-emerald-400">
                      ✓ Network Uplink: <span className="text-slate-200">BLOCKED for file payload</span>
                    </p>
                    <p className="text-emerald-400">
                      ✓ WebCrypto Engine: <span className="text-slate-200">crypto.subtle Active</span>
                    </p>
                    <p className="text-emerald-400">
                      ✓ RAM Allocation: <span className="text-slate-200">Ephemeral Local Buffer</span>
                    </p>
                    <p className="text-cyan-300 pt-2 font-semibold">
                      [AHADEX VERIFICATION: 100% SECURE]
                    </p>
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
