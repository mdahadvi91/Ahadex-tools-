import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PassportStepHeader } from '../../components/tools/passport/PassportStepHeader';
import { PrintSheetPreview } from '../../components/tools/passport/PrintSheetPreview';
import {
  loadPassportSession,
  savePassportSession,
  getPassportSessionSync,
} from '../../lib/passport/sessionStore';
import { PassportSession } from '../../types/passport';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const PassportPrintPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<PassportSession>(getPassportSessionSync());

  useEffect(() => {
    loadPassportSession().then((s) => {
      if (!s.originalImage || !s.preparedImage) {
        navigate('/tools/passport-photo-generator');
      } else {
        setSession(s);
      }
    });
  }, [navigate]);

  const handleUpdatePrintSettings = (updates: Partial<PassportSession['printSettings']>) => {
    savePassportSession({
      printSettings: {
        ...session.printSettings,
        ...updates,
      },
    }).then(setSession);
  };

  if (!session.preparedImage) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PassportStepHeader currentStep={6} session={session} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 6 of 6 • Print Sheet Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Print Multi-Photo Sheet
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Export a full print-ready sheet with automatically calculated maximum photo fit at 100% true physical scale.
          </p>
        </div>

        <PrintSheetPreview
          session={session}
          onUpdatePrintSettings={handleUpdatePrintSettings}
        />

        <div className="max-w-6xl mx-auto flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => navigate('/tools/passport-photo-generator/final')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Final Preview</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/tools/passport-photo-generator')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Start New Photo Session →
          </button>
        </div>
      </main>
    </div>
  );
};
