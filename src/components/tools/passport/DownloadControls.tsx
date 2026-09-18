import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, Image as ImageIcon, Printer, Check, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { PassportSession } from '../../../types/passport';
import { getPixelDimensions } from '../../../data/passport/sizes';
import { COUNTRY_PRESETS } from '../../../data/passport/countries';
import {
  renderFinalPassportCanvas,
  downloadCanvasJpg,
  downloadCanvasPng,
  exportSinglePhotoPdf,
} from '../../../lib/passport/export';

interface DownloadControlsProps {
  session: PassportSession;
}

export const DownloadControls: React.FC<DownloadControlsProps> = ({ session }) => {
  const navigate = useNavigate();
  const [downloadingFormat, setDownloadingFormat] = useState<'jpg' | 'png' | 'pdf' | null>(null);

  const country = COUNTRY_PRESETS.find((c) => c.code === session.countryCode) || COUNTRY_PRESETS[0];
  const { photoSize, background } = session;
  const pixelDims = getPixelDimensions(photoSize.widthMm, photoSize.heightMm, 300);

  const handleDownload = async (format: 'jpg' | 'png' | 'pdf') => {
    try {
      setDownloadingFormat(format);
      const canvas = await renderFinalPassportCanvas(session);
      const filename = `passport-photo-${photoSize.id}-${session.countryCode.toLowerCase()}`;

      if (format === 'jpg') {
        downloadCanvasJpg(canvas, `${filename}.jpg`);
      } else if (format === 'png') {
        downloadCanvasPng(canvas, `${filename}.png`);
      } else if (format === 'pdf') {
        await exportSinglePhotoPdf(
          canvas,
          { width: photoSize.widthMm, height: photoSize.heightMm },
          `${filename}.pdf`
        );
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingFormat(null), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Photo Specifications Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Biometric Passport Specifications</span>
        </h4>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Print Size</span>
            <span className="font-bold text-white font-mono">{photoSize.name}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Physical Resolution</span>
            <span className="font-bold text-cyan-400 font-mono">300 DPI ({pixelDims.width} × {pixelDims.height} px)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Country Standard</span>
            <span className="font-semibold text-white truncate block">
              {country.flag} {country.name}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block">Background Tone</span>
            <span className="font-semibold text-white capitalize">{background}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Original Facial Identity 100% Preserved (No AI Generation / Morphing)</span>
        </div>
      </div>

      {/* Download Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2.5">
          {/* Download JPG */}
          <button
            type="button"
            onClick={() => handleDownload('jpg')}
            disabled={downloadingFormat !== null}
            className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow"
          >
            {downloadingFormat === 'jpg' ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4 text-cyan-400" />
            )}
            <span>Download JPG</span>
          </button>

          {/* Download PNG */}
          <button
            type="button"
            onClick={() => handleDownload('png')}
            disabled={downloadingFormat !== null}
            className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow"
          >
            {downloadingFormat === 'png' ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            ) : (
              <ImageIcon className="w-4 h-4 text-emerald-400" />
            )}
            <span>Download PNG</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={() => handleDownload('pdf')}
            disabled={downloadingFormat !== null}
            className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 shadow"
          >
            {downloadingFormat === 'pdf' ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-amber-400" />
            )}
            <span>Download PDF</span>
          </button>
        </div>

        {/* Primary CTA: Create Print Sheet */}
        <button
          type="button"
          onClick={() => navigate('/tools/passport-photo-generator/print')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>Create Multi-Photo Print Sheet (A4 / Letter / 4×6) →</span>
        </button>
      </div>
    </div>
  );
};
