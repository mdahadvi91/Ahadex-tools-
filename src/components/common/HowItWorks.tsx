import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MousePointerClick, UploadCloud, Cpu, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../animations/Reveal';
import { useLanguage } from '../../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      number: '01',
      icon: <MousePointerClick className="w-5 h-5 text-cyan-400" />,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
    },
    {
      number: '02',
      icon: <UploadCloud className="w-5 h-5 text-blue-400" />,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
    },
    {
      number: '03',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
    },
    {
      number: '04',
      icon: <Download className="w-5 h-5 text-emerald-400" />,
      title: t.howItWorks.step4Title,
      description: t.howItWorks.step4Desc,
    },
  ];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Execution Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              {t.howItWorks.title}
            </h2>
            <p className="text-xs sm:text-base text-slate-400 mt-3 leading-relaxed">
              {t.howItWorks.subtitle}
            </p>
          </div>
        </Reveal>

        {/* 4-Step Interactive Journey */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((step, idx) => (
            <Reveal key={step.number} delay={idx * 0.1} direction="up">
              <div
                onMouseEnter={() => setActiveStep(idx)}
                className={`relative h-full p-6 rounded-2xl glass-card border transition-all duration-300 cursor-pointer ${
                  activeStep === idx
                    ? 'border-cyan-400/60 bg-slate-900/90 shadow-lg shadow-cyan-950/30 -translate-y-1'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-slate-500/60 group-hover:text-cyan-400 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>

                {activeStep === idx && (
                  <motion.div
                    layoutId="stepActiveLine"
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
