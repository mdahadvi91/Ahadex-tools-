import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Cpu, Palette, Sliders, CheckCircle2, Printer, Shield, ArrowLeft } from 'lucide-react';
import { PassportSession } from '../../../types/passport';

interface StepItem {
  number: number;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { number: 1, label: 'Upload Photo', path: '/tools/passport-photo-generator', icon: Upload },
  { number: 2, label: 'AI Preparation', path: '/tools/passport-photo-generator/prepare', icon: Cpu },
  { number: 3, label: 'Background & Country', path: '/tools/passport-photo-generator/settings', icon: Palette },
  { number: 4, label: 'Template & Editing', path: '/tools/passport-photo-generator/edit', icon: Sliders },
  { number: 5, label: 'Final Preview', path: '/tools/passport-photo-generator/final', icon: CheckCircle2 },
  { number: 6, label: 'Print Sheet', path: '/tools/passport-photo-generator/print', icon: Printer },
];

interface PassportStepHeaderProps {
  currentStep: number;
  session?: PassportSession | null;
}

export const PassportStepHeader: React.FC<PassportStepHeaderProps> = ({ currentStep, session }) => {
  const navigate = useNavigate();

  const handleStepClick = (step: StepItem) => {
    // Only allow skipping to earlier steps, or forward if image already exists
    if (step.number < currentStep) {
      navigate(step.path);
    } else if (step.number > currentStep && session?.originalImage) {
      if (step.number === 2 || (step.number > 2 && session.preparedImage)) {
        navigate(step.path);
      }
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-16 z-30 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => navigate('/category/image')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tools</span>
          </button>
          
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs">
                📸 Studio
              </span>
              Passport Photo Generator
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-2.5 h-2.5" /> Face Locked
            </span>
          </div>

          <span className="text-xs font-mono text-cyan-400 md:hidden font-semibold">
            Step {currentStep}/6
          </span>
        </div>

        {/* 6 Step Progress Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCurrent = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const isClickable = isCompleted || (step.number > currentStep && !!session?.originalImage);

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => isClickable && handleStepClick(step)}
                disabled={!isClickable && !isCurrent}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/40'
                    : isCompleted
                    ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-850 cursor-pointer border border-emerald-500/20'
                    : 'bg-slate-900/50 text-slate-500 cursor-not-allowed border border-slate-800/40'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-slate-950 text-cyan-400'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </span>
                <span className="hidden lg:inline">{step.label}</span>
                <Icon className="w-3.5 h-3.5 lg:hidden" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
