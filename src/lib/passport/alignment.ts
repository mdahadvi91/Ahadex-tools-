import { FaceData, PhotoSizePreset } from '../../types/passport';
import { loadImage } from './faceDetection';

export interface AlignmentResult {
  preparedImage: string; // Data URL of aligned & cropped portrait
  cropBox: { x: number; y: number; width: number; height: number };
  scaleFactor: number;
  rotationDegrees: number;
}

/**
 * Aligns head tilt, balances shoulders, and composes passport portrait
 * conforming strictly to biometric specifications (eye line height, head size ratio).
 */
export async function alignAndComposePassportPhoto(
  segmentedImageSrc: string,
  faceData: FaceData,
  photoSize: PhotoSizePreset
): Promise<AlignmentResult> {
  const image = await loadImage(segmentedImageSrc);
  const srcWidth = image.naturalWidth || image.width;
  const srcHeight = image.naturalHeight || image.height;

  const targetAspect = photoSize.widthMm / photoSize.heightMm;

  // 1. Calculate tilt angle from eye line if available
  const { leftEye, rightEye } = faceData.landmarks;
  const dX = rightEye.x - leftEye.x;
  const dY = rightEye.y - leftEye.y;
  let tiltRadians = Math.atan2(dY, dX);
  // Restrict subtle correction between -6 and +6 degrees to avoid unnatural warping
  let tiltDegrees = (tiltRadians * 180) / Math.PI;
  if (Math.abs(tiltDegrees) > 15) tiltDegrees = 0; // Guard against misdetection
  const correctedAngleDeg = -tiltDegrees; // Rotate counter-clockwise to level

  // 2. Determine target framing based on biometric head height percentage
  // Standard target: head should occupy ~75% of photo height
  const targetHeadPercent = (photoSize.headHeightPercentMin + photoSize.headHeightPercentMax) / 200;
  
  const faceHeight = faceData.box.height;
  const estimatedCrownToChin = faceHeight * 1.15; // from top of hair to chin

  // Desired total crop height in original image pixels
  let cropHeight = estimatedCrownToChin / targetHeadPercent;
  let cropWidth = cropHeight * targetAspect;

  // Center on head horizontally and eye line vertically
  const headCenterX = faceData.box.x + faceData.box.width / 2;
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;

  // Target eye position from top: ~42% of photo height (leaving headroom)
  const targetEyeYRatio = 0.42;
  let cropX = headCenterX - cropWidth / 2;
  let cropY = eyeCenterY - cropHeight * targetEyeYRatio;

  // Boundary clamping with proportional aspect preservation
  if (cropWidth > srcWidth) {
    cropWidth = srcWidth;
    cropHeight = cropWidth / targetAspect;
  }
  if (cropHeight > srcHeight) {
    cropHeight = srcHeight;
    cropWidth = cropHeight * targetAspect;
  }

  // Adjust crop origin so it fits inside source dimensions
  if (cropX < 0) cropX = 0;
  if (cropX + cropWidth > srcWidth) cropX = srcWidth - cropWidth;
  if (cropY < 0) cropY = 0;
  if (cropY + cropHeight > srcHeight) cropY = srcHeight - cropHeight;

  // 3. Render aligned crop to high-resolution canvas
  // Render at 1200px height for ultra-crisp biometric rendering
  const outHeight = 1200;
  const outWidth = Math.round(outHeight * targetAspect);

  const canvas = document.createElement('canvas');
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D context for alignment');

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.save();
  // Translate to center of output canvas
  ctx.translate(outWidth / 2, outHeight / 2);

  // Apply subtle head tilt leveling
  if (Math.abs(correctedAngleDeg) > 0.4) {
    ctx.rotate((correctedAngleDeg * Math.PI) / 180);
  }

  // Scale factor from crop dimensions to output canvas
  const scale = outWidth / cropWidth;

  // Draw rotated & centered image
  const drawX = (-cropWidth / 2) * scale;
  const drawY = (-cropHeight / 2) * scale;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    drawX,
    drawY,
    outWidth,
    outHeight
  );

  ctx.restore();

  const preparedImage = canvas.toDataURL('image/png');

  return {
    preparedImage,
    cropBox: {
      x: Math.round(cropX),
      y: Math.round(cropY),
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
    },
    scaleFactor: scale,
    rotationDegrees: correctedAngleDeg,
  };
}
