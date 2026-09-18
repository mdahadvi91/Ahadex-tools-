import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PassportStepHeader } from '../../components/tools/passport/PassportStepHeader';
import { FinalPhotoPreview } from '../../components/tools/passport/FinalPhotoPreview';
import { DownloadControls } from '../../components/tools/passport/DownloadControls';
import {
  loadPassportSession,
  getPassportSessionSync,
} from '../../lib/passport/sessionStore';
import { renderFinalPassportCanvas } from '../../lib/passport/export';
import { PassportSession } from '../../types/passport';
import { Sparkles, Printer, ArrowLeft } from 'lucide-react';

export const PassportFinalPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<PassportSession>(getPassportSessionSync());
  const [previewCanvasUrl, setPreviewCanvasUrl] = useState<string | null>(null);

  useEffect(() => {
    loadPassportSession().then(async (s) => {
      if (!s.originalImage || !s.preparedImage) {
        navigate('/tools/passport-photo-generator');
        return;
      }
      setSession(s);

      try {
        const canvas = await renderFinalPassportCanvas(s);
        setPreviewCanvasUrl(canvas.toDataURL('image/jpeg', 0.95));
      } catch (err) {
        console.error('Final render error:', err);
      }
    });
  }, [navigate]);

  if (!session.preparedImage) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PassportStepHeader currentStep={5} session={session} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 5 of 6 • Official Biometric Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Final Preview & Single Download
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Inspect your passport photo, toggle biometric alignment guidelines, and export in 300 DPI high resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Column: High-Res Card Preview (Col 6) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
            <FinalPhotoPreview session={session} previewCanvasUrl={previewCanvasUrl} />
          </div>

          {/* Right Column: Specs & Download CTAs (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            <DownloadControls session={session} />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => navigate('/tools/passport-photo-generator/edit')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Style & Editing</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
