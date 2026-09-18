import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PassportStepHeader } from '../../components/tools/passport/PassportStepHeader';
import { BackgroundSelector } from '../../components/tools/passport/BackgroundSelector';
import { CountrySelector } from '../../components/tools/passport/CountrySelector';
import { PhotoSizeSelector } from '../../components/tools/passport/PhotoSizeSelector';
import {
  loadPassportSession,
  savePassportSession,
  getPassportSessionSync,
} from '../../lib/passport/sessionStore';
import { PHOTO_SIZE_PRESETS } from '../../data/passport/sizes';
import { BG_COLOR_MAP } from '../../lib/passport/export';
import { PassportSession, PassportBgColor, PhotoSizePreset, CountryPreset } from '../../types/passport';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const PassportSettingsPage: React.FC = () => {
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

  const handleSelectBg = (bg: PassportBgColor) => {
    savePassportSession({ background: bg }).then(setSession);
  };

  const handleSelectCountry = (country: CountryPreset) => {
    const recommendedSize =
      PHOTO_SIZE_PRESETS.find((p) => p.id === country.recommendedSizeId) || session.photoSize;

    savePassportSession({
      countryCode: country.code,
      photoSize: recommendedSize,
      background: country.recommendedBg,
    }).then(setSession);
  };

  const handleSelectSize = (size: PhotoSizePreset) => {
    savePassportSession({ photoSize: size }).then(setSession);
  };

  const handleContinue = () => {
    navigate('/tools/passport-photo-generator/edit');
  };

  if (!session.preparedImage) return null;

  const currentBgHex = BG_COLOR_MAP[session.background] || '#ffffff';
  const isTransparent = session.background === 'transparent';
  const aspectRatio = session.photoSize.widthMm / session.photoSize.heightMm;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PassportStepHeader currentStep={3} session={session} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Passport Portrait Card (Col 5) */}
          <div className="lg:col-span-5 flex flex-col items-center sticky top-28">
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
                <span className="font-semibold text-slate-200">Live Passport Card</span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                  {session.photoSize.name}
                </span>
              </div>

              {/* Photo Preview Canvas */}
              <div
                className={`relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-750 transition-all duration-300 ${
                  isTransparent ? 'bg-checkerboard' : ''
                }`}
                style={{
                  width: '100%',
                  maxWidth: `${Math.min(280, 280 * aspectRatio)}px`,
                  aspectRatio: `${session.photoSize.widthMm} / ${session.photoSize.heightMm}`,
                  backgroundColor: isTransparent ? undefined : currentBgHex,
                }}
              >
                <img
                  src={session.preparedImage}
                  alt="Live Composition"
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300">
                  {session.photoSize.widthMm} × {session.photoSize.heightMm} mm
                </div>
              </div>

              <div className="mt-5 w-full space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Standard Ratio</span>
                  <span className="font-mono text-slate-200">70–80% Head Target</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Selected BG</span>
                  <span className="font-semibold text-white capitalize">{session.background}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Sections (Col 7) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Section 1: Background Color */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <BackgroundSelector
                selectedBg={session.background}
                onSelectBg={handleSelectBg}
              />
            </div>

            {/* Section 2: Country Selection */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <CountrySelector
                selectedCountryCode={session.countryCode}
                onSelectCountry={handleSelectCountry}
              />
            </div>

            {/* Section 3: Physical Size Selection */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <PhotoSizeSelector
                selectedSize={session.photoSize}
                onSelectSize={handleSelectSize}
              />
            </div>

            {/* Continue to Step 4 CTA */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Template & Photo Editing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
