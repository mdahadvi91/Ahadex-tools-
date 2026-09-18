import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PassportStepHeader } from '../../components/tools/passport/PassportStepHeader';
import { PassportUploader } from '../../components/tools/passport/PassportUploader';
import { OriginalPhotoPreview } from '../../components/tools/passport/OriginalPhotoPreview';
import {
  loadPassportSession,
  savePassportSession,
  getPassportSessionSync,
} from '../../lib/passport/sessionStore';
import { detectFaceAndQuality, loadImage } from '../../lib/passport/faceDetection';
import { createFaceIdentityLock } from '../../lib/passport/identityProtection';
import { FaceData, PassportSession } from '../../types/passport';
import { Camera, Sparkles, Shield, AlertCircle } from 'lucide-react';

export const PassportUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<PassportSession>(getPassportSessionSync());
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPassportSession().then(setSession);
  }, []);

  const handleImageSelected = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setAnalyzing(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string;
          const img = await loadImage(dataUrl);

          // Detect face, quality & biometric points
          const faceData: FaceData = await detectFaceAndQuality(img);

          // Create Face Identity Lock
          const identityLock = await createFaceIdentityLock(img, faceData);

          const updated = await savePassportSession({
            originalImage: dataUrl,
            originalDimensions: {
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height,
            },
            faceData,
            identityLocked: true,
          });

          setSession(updated);
        } catch (err: any) {
          console.error('Image analysis error:', err);
          setError(err.message || 'Failed to analyze uploaded photo.');
        } finally {
          setAnalyzing(false);
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read image file.');
        setLoading(false);
        setAnalyzing(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Upload error');
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleContinue = () => {
    navigate('/tools/passport-photo-generator/prepare');
  };

  const handleRetake = () => {
    savePassportSession({
      originalImage: null,
      faceData: null,
      preparedImage: null,
      segmentedImage: null,
      finalImage: null,
    }).then(setSession);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sticky Step Header */}
      <PassportStepHeader currentStep={1} session={session} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Page Hero Header */}
        {!session.originalImage && (
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of 6 • Photo Upload</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Passport Size Photo Generator
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Create professional, government-standard passport & visa photos from your original portrait.
              Features automatic background replacement, posture alignment, and exact 300 DPI print templates.
            </p>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Workspace or Photo Preview */}
        {session.originalImage && session.faceData ? (
          <OriginalPhotoPreview
            imageSrc={session.originalImage}
            faceData={session.faceData}
            dimensions={session.originalDimensions}
            onContinue={handleContinue}
            onRetake={handleRetake}
            loading={loading}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            <PassportUploader onImageSelected={handleImageSelected} loading={loading || analyzing} />
          </div>
        )}
      </main>
    </div>
  );
};
