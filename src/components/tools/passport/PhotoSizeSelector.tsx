import React, { useState } from 'react';
import { PhotoSizePreset } from '../../../types/passport';
import { PHOTO_SIZE_PRESETS, getPixelDimensions } from '../../../data/passport/sizes';
import { Check, Ruler, Info } from 'lucide-react';

interface PhotoSizeSelectorProps {
  selectedSize: PhotoSizePreset;
  onSelectSize: (size: PhotoSizePreset) => void;
}

export const PhotoSizeSelector: React.FC<PhotoSizeSelectorProps> = ({
  selectedSize,
  onSelectSize,
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customW, setCustomW] = useState<number>(35);
  const [customH, setCustomH] = useState<number>(45);

  const handleCustomApply = () => {
    if (customW > 10 && customH > 10) {
      onSelectSize({
        id: `custom-${customW}x${customH}`,
        name: `Custom ${customW} × ${customH} mm`,
        widthMm: customW,
        heightMm: customH,
        description: `Custom user-defined dimensions (${customW} × ${customH} mm).`,
        recommendedBg: 'white',
        headHeightPercentMin: 70,
        headHeightPercentMax: 80,
        popularCountries: [],
      });
      setIsCustom(true);
    }
  };

  const pixelDims = getPixelDimensions(selectedSize.widthMm, selectedSize.heightMm, 300);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Ruler className="w-4 h-4 text-cyan-400" />
          <span>Photo Dimensions (Physical Size)</span>
        </label>
        <span className="text-xs text-cyan-400 font-mono font-semibold">
          300 DPI: {pixelDims.width} × {pixelDims.height} px
        </span>
      </div>

      {/* Grid of Preset Sizes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PHOTO_SIZE_PRESETS.map((preset) => {
          const isSelected = selectedSize.id === preset.id && !isCustom;
          const px = getPixelDimensions(preset.widthMm, preset.heightMm, 300);

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setIsCustom(false);
                onSelectSize(preset);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400 text-white ring-1 ring-cyan-400/40 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{preset.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {px.width} × {px.height} px (300 DPI)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                {preset.description}
              </span>
            </button>
          );
        })}

        {/* Custom Size Toggle */}
        <button
          type="button"
          onClick={() => setIsCustom(true)}
          className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[90px] ${
            isCustom
              ? 'bg-cyan-500/15 border-cyan-400 text-white ring-1 ring-cyan-400/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">Custom Dimensions</span>
              {isCustom && <Check className="w-4 h-4 text-cyan-400" />}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Specify exact mm width & height
            </span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">User Specified</span>
        </button>
      </div>

      {/* Custom Millimeter Inputs if active */}
      {isCustom && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-300 font-medium">Width (mm):</label>
            <input
              type="number"
              min={15}
              max={150}
              value={customW}
              onChange={(e) => setCustomW(Number(e.target.value))}
              className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm font-mono text-white text-center focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-300 font-medium">Height (mm):</label>
            <input
              type="number"
              min={15}
              max={150}
              value={customH}
              onChange={(e) => setCustomH(Number(e.target.value))}
              className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm font-mono text-white text-center focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="button"
            onClick={handleCustomApply}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
          >
            Apply Size
          </button>
        </div>
      )}

      {/* Exact Pixel Resolution Note */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          Every photo is exported at genuine 300 DPI high-definition print resolution. Standard ISO print dimensions are strictly preserved.
        </span>
      </div>
    </div>
  );
};
