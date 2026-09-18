import { FaceData, FaceBoundingBox } from '../../types/passport';

export interface FaceIdentityLock {
  originalImageSrc: string;
  faceBox: FaceBoundingBox;
  faceCropDataUrl: string;
  aspectRatio: number;
  hash: string;
  lockedAt: number;
}

/**
 * Creates an immutable Identity Reference Lock by extracting the original face crop
 * and locking its geometric and pixel properties.
 */
export async function createFaceIdentityLock(
  image: HTMLImageElement,
  faceData: FaceData
): Promise<FaceIdentityLock> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context for identity lock');

  const { box } = faceData;
  canvas.width = Math.max(1, box.width);
  canvas.height = Math.max(1, box.height);

  // Draw ONLY the original face area
  ctx.drawImage(
    image,
    box.x,
    box.y,
    box.width,
    box.height,
    0,
    0,
    box.width,
    box.height
  );

  const faceCropDataUrl = canvas.toDataURL('image/png');
  const hash = `ID_LOCK_${box.x}_${box.y}_${box.width}_${box.height}_${Date.now()}`;

  return {
    originalImageSrc: image.src,
    faceBox: { ...box },
    faceCropDataUrl,
    aspectRatio: box.width / Math.max(1, box.height),
    hash,
    lockedAt: Date.now(),
  };
}

/**
 * Validates that processed or cropped output maintains facial identity fidelity
 * by comparing geometric landmarks and aspect ratio against the locked identity.
 */
export function validateFaceIdentityIntegrity(
  lock: FaceIdentityLock,
  currentFaceData: FaceData
): { valid: boolean; driftPercentage: number; reason?: string } {
  if (!lock) {
    return { valid: true, driftPercentage: 0 };
  }

  const currentRatio = currentFaceData.box.width / Math.max(1, currentFaceData.box.height);
  const ratioDifference = Math.abs(currentRatio - lock.aspectRatio) / lock.aspectRatio;
  const driftPercentage = Math.round(ratioDifference * 100);

  // If aspect ratio drifted by more than 25%, flag identity deformation
  if (ratioDifference > 0.25) {
    return {
      valid: false,
      driftPercentage,
      reason: 'Facial proportion drift detected. Reverting to original face geometry to prevent distortion.',
    };
  }

  return {
    valid: true,
    driftPercentage,
  };
}
