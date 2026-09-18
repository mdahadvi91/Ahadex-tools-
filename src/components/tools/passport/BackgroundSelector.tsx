import React from 'react';
import { PassportBgColor } from '../../../types/passport';
import { Check } from 'lucide-react';

interface BackgroundSelectorProps {
  selectedBg: PassportBgColor;
  onSelectBg: (bg: PassportBgColor) => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  selectedBg,
  onSelectBg,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Background Color</span>
        </label>
        <span className="text-xs text-slate-400 font-mono">Official Passport Standard</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* White */}
        <button
          type="button"
          onClick={() => onSelectBg('white')}
          className={`relative group p-4 sm:p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[120px] ${
            selectedBg === 'white'
              ? 'border-cyan-400 bg-white/5 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white shadow-md border border-slate-200 flex items-center justify-center">
            {selectedBg === 'white' && <Check className="w-6 h-6 text-slate-900 stroke-[3]" />}
          </div>
          <div>
            <span className="text-sm font-bold text-white block">White</span>
            <span className="text-[11px] text-slate-400">Universal standard</span>
          </div>
        </button>

        {/* Blue */}
        <button
          type="button"
          onClick={() => onSelectBg('blue')}
          className={`relative group p-4 sm:p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[120px] ${
            selectedBg === 'blue'
              ? 'border-cyan-400 bg-blue-500/10 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600 shadow-md border border-blue-400/30 flex items-center justify-center">
            {selectedBg === 'blue' && <Check className="w-6 h-6 text-white stroke-[3]" />}
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Blue</span>
            <span className="text-[11px] text-slate-400">BD / GCC standard</span>
          </div>
        </button>

        {/* Light Grey */}
        <button
          type="button"
          onClick={() => onSelectBg('light-grey')}
          className={`relative group p-4 sm:p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[120px] ${
            selectedBg === 'light-grey'
              ? 'border-cyan-400 bg-white/5 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-slate-200 shadow-md border border-slate-300 flex items-center justify-center">
            {selectedBg === 'light-grey' && <Check className="w-6 h-6 text-slate-900 stroke-[3]" />}
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Light Grey</span>
            <span className="text-[11px] text-slate-400">UK & Australia</span>
          </div>
        </button>

        {/* Transparent */}
        <button
          type="button"
          onClick={() => onSelectBg('transparent')}
          className={`relative group p-4 sm:p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[120px] ${
            selectedBg === 'transparent'
              ? 'border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-checkerboard shadow-md border border-slate-700 flex items-center justify-center">
            {selectedBg === 'transparent' && <Check className="w-6 h-6 text-cyan-400 stroke-[3]" />}
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Transparent</span>
            <span className="text-[11px] text-slate-400">PNG Cutout</span>
          </div>
        </button>
      </div>
    </div>
  );
};
