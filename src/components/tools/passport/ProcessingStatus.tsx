import React from 'react';
import { CheckCircle2, Loader2, ShieldCheck, UserCheck, Scissors, Sparkles, Scale } from 'lucide-react';

export interface PipelineStep {
  id: string;
  title: string;
  desc: string;
  status: 'pending' | 'processing' | 'completed';
}

interface ProcessingStatusProps {
  steps: PipelineStep[];
  isComplete: boolean;
  onContinue: () => void;
  originalSrc: string;
  preparedSrc: string | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  steps,
  isComplete,
  onContinue,
  originalSrc,
  preparedSrc,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Visual Before & After Preview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Photo Preparation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Background Removal & Biometric Alignment
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
            Hair edges, collar, and posture are automatically refined while facial identity remains 100% locked.
          </p>
        </div>

        {/* Before vs After Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center max-w-2xl mx-auto">
          {/* Before */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Original Photo
            </span>
            <div className="w-full max-w-[220px] aspect-[35/45] rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 flex items-center justify-center shadow-lg">
              <img
                src={originalSrc}
                alt="Original Upload"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* After */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span>Prepared & Aligned</span>
              {isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </span>
            <div className="w-full max-w-[220px] aspect-[35/45] rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-checkerboard flex items-center justify-center shadow-lg shadow-cyan-500/10 relative">
              {preparedSrc ? (
                <img
                  src={preparedSrc}
                  alt="Prepared Portrait"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  <span className="text-xs text-slate-400">Processing edges...</span>
                </div>
              )}

              {isComplete && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold shadow">
                  ✓ Ready
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Pipeline Progress List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Biometric Protection Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {steps.map((step) => {
            const isDone = step.status === 'completed';
            const isWorking = step.status === 'processing';

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isWorking
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 ring-1 ring-cyan-500/30'
                    : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-100">{step.title}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isWorking ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onContinue}
            disabled={!isComplete}
            className={`py-3.5 px-8 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center gap-2 ${
              isComplete
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>Continue to Background & Country</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
