import React, { useState } from 'react';
import { Eye, ShieldCheck, Ruler, CheckCircle2 } from 'lucide-react';
import { PassportSession } from '../../../types/passport';
import { getPixelDimensions } from '../../../data/passport/sizes';
import { BG_COLOR_MAP } from '../../../lib/passport/export';

interface FinalPhotoPreviewProps {
  session: PassportSession;
  previewCanvasUrl: string | null;
}

export const FinalPhotoPreview: React.FC<FinalPhotoPreviewProps> = ({
  session,
  previewCanvasUrl,
}) => {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const { photoSize, background, customBgColor } = session;
  const pixelDims = getPixelDimensions(photoSize.widthMm, photoSize.heightMm, 300);

  const aspectRatio = photoSize.widthMm / photoSize.heightMm;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Passport Photo Frame */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-750 bg-white transition-all duration-300"
        style={{
          width: '100%',
          maxWidth: `${Math.min(320, 320 * aspectRatio)}px`,
          aspectRatio: `${photoSize.widthMm} / ${photoSize.heightMm}`,
        }}
      >
        {previewCanvasUrl ? (
          <img
            src={previewCanvasUrl}
            alt="Final Passport Photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs font-mono">
            Generating 300 DPI Preview...
          </div>
        )}

        {/* Biometric Guidelines Overlay */}
        {showGuidelines && (
          <div className="absolute inset-0 pointer-events-none border border-cyan-400/40">
            {/* Center vertical line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-cyan-400/50 dashed" />

            {/* Top Head margin line (10% from top) */}
            <div className="absolute top-[10%] left-0 right-0 h-px bg-rose-400/60 flex items-center justify-end pr-1">
              <span className="text-[9px] font-mono text-rose-300 bg-slate-950/80 px-1 rounded">
                Crown Limit
              </span>
            </div>

            {/* Eye level line (~42% from top) */}
            <div className="absolute top-[42%] left-0 right-0 h-px bg-cyan-400/70 flex items-center justify-end pr-1">
              <span className="text-[9px] font-mono text-cyan-300 bg-slate-950/80 px-1 rounded">
                Eye Line (Level)
              </span>
            </div>

            {/* Chin boundary line (~85% from top) */}
            <div className="absolute top-[85%] left-0 right-0 h-px bg-emerald-400/60 flex items-center justify-end pr-1">
              <span className="text-[9px] font-mono text-emerald-300 bg-slate-950/80 px-1 rounded">
                Chin Target
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Guidelines Toggle */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowGuidelines(!showGuidelines)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
            showGuidelines
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showGuidelines ? 'Guidelines Active' : 'Show Biometric Guidelines'}</span>
        </button>
      </div>

      {/* Verified Badges */}
      <div className="w-full mt-4 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> Face Identity Locked 🔒
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
          <Ruler className="w-3.5 h-3.5" /> 300 DPI Ultra HD
        </span>
      </div>
    </div>
  );
};
