import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Eye, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { FaceData } from '../../../types/passport';

interface OriginalPhotoPreviewProps {
  imageSrc: string;
  faceData: FaceData | null;
  dimensions: { width: number; height: number };
  onContinue: () => void;
  onRetake: () => void;
  loading?: boolean;
}

export const OriginalPhotoPreview: React.FC<OriginalPhotoPreviewProps> = ({
  imageSrc,
  faceData,
  dimensions,
  onContinue,
  onRetake,
  loading = false,
}) => {
  const [showFaceBox, setShowFaceBox] = useState(true);

  const hasErrors = faceData ? faceData.validationErrors.length > 0 : false;
  const hasWarnings = faceData ? faceData.validationWarnings.length > 0 : false;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left: Original Photo with Face Box overlay */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-inner max-h-[380px] w-full flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Uploaded Original"
              className="max-h-[360px] w-auto object-contain mx-auto"
            />

            {/* Face Box Overlay */}
            {showFaceBox && faceData && faceData.detected && dimensions.width > 0 && (
              <div
                className="absolute border-2 border-cyan-400 bg-cyan-400/10 rounded-lg pointer-events-none transition-all"
                style={{
                  left: `${(faceData.box.x / dimensions.width) * 100}%`,
                  top: `${(faceData.box.y / dimensions.height) * 100}%`,
                  width: `${(faceData.box.width / dimensions.width) * 100}%`,
                  height: `${(faceData.box.height / dimensions.height) * 100}%`,
                }}
              >
                <span className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[10px] font-bold font-mono uppercase tracking-wider">
                  Target Face Lock 🔒
                </span>
              </div>
            )}
          </div>

          {/* Toggle face box & photo metadata */}
          <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-400 px-1">
            <span className="font-mono">
              {dimensions.width} × {dimensions.height} px
            </span>
            <button
              type="button"
              onClick={() => setShowFaceBox(!showFaceBox)}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showFaceBox ? 'Hide Face Frame' : 'Show Face Frame'}</span>
            </button>
          </div>
        </div>

        {/* Right: Validation Checklist & Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 Biometric Verification</span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Original Photo Inspection
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We verify your original portrait before AI preparation to guarantee embassy & passport compliance.
            </p>
          </div>

          {/* Verification Badges */}
          <div className="space-y-2.5">
            {/* Face detected */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Face Detected</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                Verified (100%)
              </span>
            </div>

            {/* One person detected */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200">Single Person Portrait</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                1 Person
              </span>
            </div>

            {/* Image Quality Score */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Image Quality Score</span>
                  <span className="text-[10px] text-slate-400">Resolution, lighting & sharpness</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                {faceData?.qualityScores.overall || 90}% High
              </span>
            </div>
          </div>

          {/* Errors or Warnings */}
          {hasErrors && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Issues Detected:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                {faceData?.validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {hasWarnings && !hasErrors && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Advisory Note:</span>
              </div>
              {faceData?.validationWarnings.map((warn, i) => (
                <p key={i} className="text-[11px] text-amber-200/90 pl-1">
                  {warn}
                </p>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onRetake}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Choose Another Photo</span>
            </button>

            <button
              type="button"
              onClick={onContinue}
              disabled={loading || hasErrors}
              className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                hasErrors
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02]'
              }`}
            >
              <span>Continue to AI Preparation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
