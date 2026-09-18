import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PassportStepHeader } from '../../components/tools/passport/PassportStepHeader';
import { ClothingTemplateSelector } from '../../components/tools/passport/ClothingTemplateSelector';
import { PhotoAdjustmentPanel } from '../../components/tools/passport/PhotoAdjustmentPanel';
import {
  loadPassportSession,
  savePassportSession,
  getPassportSessionSync,
} from '../../lib/passport/sessionStore';
import { renderFinalPassportCanvas } from '../../lib/passport/export';
import { PassportSession, PhotoAdjustments } from '../../types/passport';
import { ArrowRight, ShieldCheck, Shirt, Sliders, CheckCircle2 } from 'lucide-react';

export const PassportEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<PassportSession>(getPassportSessionSync());
  const [activeTab, setActiveTab] = useState<'templates' | 'adjustments'>('templates');
  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadPassportSession().then((s) => {
      if (!s.originalImage || !s.preparedImage) {
        navigate('/tools/passport-photo-generator');
      } else {
        setSession(s);
      }
    });
  }, [navigate]);

  // Re-render live canvas preview on template or adjustment changes
  useEffect(() => {
    let isMounted = true;
    const updatePreview = async () => {
      if (!session.preparedImage) return;
      try {
        const canvas = await renderFinalPassportCanvas(session);
        if (isMounted) {
          setLivePreviewUrl(canvas.toDataURL('image/jpeg', 0.9));
        }
      } catch (err) {
        console.error('Preview error:', err);
      }
    };

    updatePreview();
    return () => {
      isMounted = false;
    };
  }, [session.clothingTemplateId, session.adjustments, session.background, session.photoSize]);

  const handleSelectTemplate = (id: string) => {
    savePassportSession({ clothingTemplateId: id }).then(setSession);
  };

  const handleChangeAdjustments = (adjustments: PhotoAdjustments) => {
    savePassportSession({ adjustments }).then(setSession);
  };

  const handleResetAdjustments = () => {
    savePassportSession({
      adjustments: {
        brightness: 0,
        contrast: 0,
        temperature: 0,
        sharpness: 0,
        saturation: 0,
        exposure: 0,
      },
    }).then(setSession);
  };

  const handleContinue = () => {
    navigate('/tools/passport-photo-generator/final');
  };

  if (!session.preparedImage) return null;

  const aspectRatio = session.photoSize.widthMm / session.photoSize.heightMm;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PassportStepHeader currentStep={4} session={session} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Passport Portrait Card (Col 5) */}
          <div className="lg:col-span-5 flex flex-col items-center sticky top-28">
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
                <span className="font-semibold text-slate-200">Interactive Passport Card</span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                  {session.photoSize.name}
                </span>
              </div>

              {/* Photo Preview Canvas */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-750 bg-white transition-all duration-300"
                style={{
                  width: '100%',
                  maxWidth: `${Math.min(280, 280 * aspectRatio)}px`,
                  aspectRatio: `${session.photoSize.widthMm} / ${session.photoSize.heightMm}`,
                }}
              >
                {livePreviewUrl ? (
                  <img
                    src={livePreviewUrl}
                    alt="Live Portrait Editing"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
                    Rendering live edit...
                  </div>
                )}

                {/* Face Lock Tag */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 border border-cyan-400/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Face Locked 🔒</span>
                </div>
              </div>

              <div className="mt-5 w-full p-3 rounded-2xl bg-slate-800/40 border border-slate-750 text-xs text-slate-300 space-y-1 text-center">
                <span className="font-semibold text-white block">Strict Identity Guarantee</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Your facial structure, eyes, and skin features are 100% original. Clothing and lighting changes strictly conform to embassy requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Style & Editing Switcher (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tab Buttons: [ Templates ] [ Photo Editing ] */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'templates'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Shirt className="w-4 h-4" />
                <span>Executive Clothing Templates</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('adjustments')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'adjustments'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Lighting & Tone Controls</span>
              </button>
            </div>

            {/* Active Tab Panel */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              {activeTab === 'templates' ? (
                <ClothingTemplateSelector
                  selectedTemplateId={session.clothingTemplateId}
                  onSelectTemplate={handleSelectTemplate}
                />
              ) : (
                <PhotoAdjustmentPanel
                  adjustments={session.adjustments}
                  onChangeAdjustments={handleChangeAdjustments}
                  onReset={handleResetAdjustments}
                />
              )}
            </div>

            {/* Continue to Final Preview CTA */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Final Preview & Download</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
