import React from 'react';
import { PhotoAdjustments } from '../../../types/passport';
import { RotateCcw, Sun, Contrast, Thermometer, Sparkles, Sliders, ShieldAlert } from 'lucide-react';

interface PhotoAdjustmentPanelProps {
  adjustments: PhotoAdjustments;
  onChangeAdjustments: (adjustments: PhotoAdjustments) => void;
  onReset: () => void;
}

export const PhotoAdjustmentPanel: React.FC<PhotoAdjustmentPanelProps> = ({
  adjustments,
  onChangeAdjustments,
  onReset,
}) => {
  const updateField = (field: keyof PhotoAdjustments, value: number) => {
    onChangeAdjustments({
      ...adjustments,
      [field]: value,
    });
  };

  const isDefault = Object.values(adjustments).every((v) => v === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Biometric Lighting & Tone</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Safe-range biometric adjustments to balance lighting without violating passport regulations.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={isDefault}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isDefault
              ? 'border-slate-800 text-slate-600 cursor-not-allowed'
              : 'border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Controlled Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Brightness (-20 to +20) */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Brightness</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}
            </span>
          </div>
          <input
            type="range"
            min={-20}
            max={20}
            step={1}
            value={adjustments.brightness}
            onChange={(e) => updateField('brightness', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-20 (Darker)</span>
            <span>0</span>
            <span>+20 (Lighter)</span>
          </div>
        </div>

        {/* Contrast (-10 to +10) */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Contrast className="w-4 h-4 text-cyan-400" />
              <span>Contrast</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}
            </span>
          </div>
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={adjustments.contrast}
            onChange={(e) => updateField('contrast', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-10 (Soft)</span>
            <span>0</span>
            <span>+10 (Crisp)</span>
          </div>
        </div>

        {/* Temperature (-15 to +15) */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>White Balance (Warmth)</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {adjustments.temperature > 0 ? `+${adjustments.temperature}` : adjustments.temperature}
            </span>
          </div>
          <input
            type="range"
            min={-15}
            max={15}
            step={1}
            value={adjustments.temperature}
            onChange={(e) => updateField('temperature', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-15 (Cool)</span>
            <span>0</span>
            <span>+15 (Warm)</span>
          </div>
        </div>

        {/* Sharpness (0 to 20) */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Edge Clarity / Sharpness</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              +{adjustments.sharpness}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={adjustments.sharpness}
            onChange={(e) => updateField('sharpness', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 (Natural)</span>
            <span>+10</span>
            <span>+20 (Sharp)</span>
          </div>
        </div>
      </div>

      {/* Strict Passport Office Compliance Note */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2.5 text-slate-400">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Editing controls are intentionally calibrated within official government compliance ranges to prevent embassy rejection.
        </span>
      </div>
    </div>
  );
};
