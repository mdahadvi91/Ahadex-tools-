import React from 'react';
import { Shield, Zap, EyeOff, Boxes, Lock, Sparkles } from 'lucide-react';
import { Reveal } from '../animations/Reveal';
import { TiltCard } from '../animations/TiltCard';
import { useLanguage } from '../../context/LanguageContext';

export const WhyAhadex: React.FC = () => {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      title: t.features.privacyTitle,
      description: t.features.privacyDesc,
      tag: '100% Zero-Upload',
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: t.features.speedTitle,
      description: t.features.speedDesc,
      tag: 'Hardware Accelerated',
    },
    {
      icon: <EyeOff className="w-6 h-6 text-emerald-400" />,
      title: t.features.cleanTitle,
      description: t.features.cleanDesc,
      tag: 'Zero Telemetry',
    },
    {
      icon: <Boxes className="w-6 h-6 text-purple-400" />,
      title: t.features.futureTitle,
      description: t.features.futureDesc,
      tag: 'Modular Architecture',
    },
  ];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Platform Manifesto</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              {t.features.title}
            </h2>
            <p className="text-xs sm:text-base text-slate-400 mt-3 leading-relaxed">
              {t.features.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason, idx) => (
            <Reveal key={idx} delay={idx * 0.08} direction="up">
              <TiltCard maxTilt={4} className="h-full">
                <div className="h-full p-6 rounded-2xl glass-card border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {reason.icon}
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {reason.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100">
                      {reason.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cryptographically Sandboxed</span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
