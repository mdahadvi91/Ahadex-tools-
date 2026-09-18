import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PassportStepHeader } from '../../components/tools/passport/PassportStepHeader';
import { ProcessingStatus, PipelineStep } from '../../components/tools/passport/ProcessingStatus';
import {
  loadPassportSession,
  savePassportSession,
  getPassportSessionSync,
} from '../../lib/passport/sessionStore';
import { removePhotoBackground } from '../../lib/passport/backgroundRemoval';
import { alignAndComposePassportPhoto } from '../../lib/passport/alignment';
import { loadImage } from '../../lib/passport/faceDetection';
import { PassportSession } from '../../types/passport';

const INITIAL_PIPELINE: PipelineStep[] = [
  { id: '1', title: 'Face Detection & Quality', desc: 'Verify landmarks, sharpness, and single-subject framing.', status: 'completed' },
  { id: '2', title: 'Identity Reference Lock 🔒', desc: 'Secure original face crop to prevent any AI hallucination.', status: 'processing' },
  { id: '3', title: 'Hair & Silhouette Matting', desc: 'Hair edge segmentation preserving ears and shoulders.', status: 'pending' },
  { id: '4', title: 'Background Removal', desc: 'Clean transparent cutout without halos or jagged artifacts.', status: 'pending' },
  { id: '5', title: 'Head Tilt & Eye Alignment', desc: 'Level horizontal eye line and correct subtle posture tilt.', status: 'pending' },
  { id: '6', title: 'Biometric Passport Composition', desc: 'Compose 70–80% head height ratio with standard headroom.', status: 'pending' },
];

export const PassportPreparePage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<PassportSession>(getPassportSessionSync());
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(INITIAL_PIPELINE);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function runPreparation() {
      const current = await loadPassportSession();
      setSession(current);

      if (!current.originalImage || !current.faceData) {
        navigate('/tools/passport-photo-generator');
        return;
      }

      // If already prepared, show ready
      if (current.preparedImage && current.segmentedImage) {
        if (isMounted) {
          setPipelineSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
          setIsComplete(true);
        }
        return;
      }

      try {
        // Step 2: Lock identity
        await new Promise((r) => setTimeout(r, 400));
        if (!isMounted) return;
        setPipelineSteps((prev) =>
          prev.map((s) => (s.id === '2' ? { ...s, status: 'completed' } : s.id === '3' ? { ...s, status: 'processing' } : s))
        );

        // Step 3 & 4: Background Removal & Edge matting
        const img = await loadImage(current.originalImage);
        const segmentedDataUrl = await removePhotoBackground(img, current.faceData);

        if (!isMounted) return;
        setPipelineSteps((prev) =>
          prev.map((s) =>
            s.id === '3' || s.id === '4'
              ? { ...s, status: 'completed' }
              : s.id === '5'
              ? { ...s, status: 'processing' }
              : s
          )
        );

        // Step 5 & 6: Alignment & Biometric Composition
        await new Promise((r) => setTimeout(r, 400));
        const alignment = await alignAndComposePassportPhoto(
          segmentedDataUrl,
          current.faceData,
          current.photoSize
        );

        if (!isMounted) return;
        setPipelineSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));

        const updated = await savePassportSession({
          segmentedImage: segmentedDataUrl,
          preparedImage: alignment.preparedImage,
        });

        if (isMounted) {
          setSession(updated);
          setIsComplete(true);
        }
      } catch (err) {
        console.error('Preparation pipeline error:', err);
      }
    }

    runPreparation();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleContinue = () => {
    navigate('/tools/passport-photo-generator/settings');
  };

  if (!session.originalImage) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PassportStepHeader currentStep={2} session={session} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <ProcessingStatus
          steps={pipelineSteps}
          isComplete={isComplete}
          onContinue={handleContinue}
          originalSrc={session.originalImage}
          preparedSrc={session.preparedImage || session.segmentedImage}
        />
      </main>
    </div>
  );
};
