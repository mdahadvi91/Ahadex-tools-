import { FaceData } from '../../types/passport';

/**
 * Removes the photo background using client-side edge-preserving silhouette segmentation.
 * Preserves hair texture, ears, neck, collar, and shoulders, with soft alpha feathering.
 */
export async function removePhotoBackground(
  image: HTMLImageElement,
  faceData: FaceData
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // 1. Sample background color distribution from top corners and edges
  let bgR = 0, bgG = 0, bgB = 0;
  let bgSampleCount = 0;

  // Sample top edge and upper corners
  for (let x = 0; x < width; x += 6) {
    for (let y = 0; y < Math.min(height * 0.12, 50); y += 6) {
      // Don't sample if near face center
      if (Math.abs(x - (faceData?.box.x + faceData?.box.width / 2)) < faceData?.box.width * 0.4) {
        continue;
      }
      const idx = (y * width + x) * 4;
      bgR += pixels[idx];
      bgG += pixels[idx + 1];
      bgB += pixels[idx + 2];
      bgSampleCount++;
    }
  }

  bgR = bgR / Math.max(1, bgSampleCount);
  bgG = bgG / Math.max(1, bgSampleCount);
  bgB = bgB / Math.max(1, bgSampleCount);

  // 2. Define person core anchor from faceData
  const face = faceData.box;
  const headCenterX = face.x + face.width / 2;
  const headCenterY = face.y + face.height * 0.45;
  const headRadiusX = face.width * 0.72;
  const headRadiusY = face.height * 0.78;

  // Shoulder boundary estimate
  const shoulderTopY = face.y + face.height * 0.85;
  const shoulderWidth = face.width * 1.8;

  // Create an alpha mask array
  const alphaMask = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];

      // Color distance to background sample
      const dR = r - bgR;
      const dG = g - bgG;
      const dB = b - bgB;
      const colorDist = Math.sqrt(dR * dR + dG * dG + dB * dB);

      // Geometric person distance
      let isInsidePersonCore = false;

      // Inside head ellipse
      const normHx = (x - headCenterX) / headRadiusX;
      const normHy = (y - headCenterY) / headRadiusY;
      if (normHx * normHx + normHy * normHy <= 1.0) {
        isInsidePersonCore = true;
      }

      // Inside torso / shoulders trapezoid below head
      if (y >= shoulderTopY) {
        const torsoProgress = (y - shoulderTopY) / Math.max(1, height - shoulderTopY);
        const currentTorsoHalfWidth = (shoulderWidth / 2) * (1 + torsoProgress * 0.5);
        if (Math.abs(x - headCenterX) <= currentTorsoHalfWidth) {
          isInsidePersonCore = true;
        }
      }

      // Compute Alpha
      let alpha = 255;

      if (isInsidePersonCore) {
        // Deep inside person -> full opacity
        alpha = 255;
      } else {
        // Near boundary: blend based on distance to background color
        if (colorDist < 25) {
          alpha = 0; // Pure background
        } else if (colorDist < 60) {
          // Soft transition edge around hair & clothing
          const factor = (colorDist - 25) / 35;
          alpha = Math.round(factor * 255);
        } else {
          // Outside core but significant contrast -> person periphery (hair wisps, shirt edges)
          // Further check distance from center
          const distFromCenter = Math.abs(x - headCenterX);
          if (distFromCenter < width * 0.42 && y > face.y * 0.4) {
            alpha = 255;
          } else {
            alpha = 0;
          }
        }
      }

      alphaMask[y * width + x] = alpha;
    }
  }

  // 3. Apply soft morphological smoothing & edge feathering to alpha mask
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = y * width + x;
      const currentAlpha = alphaMask[pos];
      
      // Feather transitions (anti-aliasing)
      if (currentAlpha > 0 && currentAlpha < 255) {
        const avg = (
          alphaMask[pos - 1] +
          alphaMask[pos + 1] +
          alphaMask[pos - width] +
          alphaMask[pos + width]
        ) / 4;
        pixels[pos * 4 + 3] = Math.round((currentAlpha + avg) / 2);
      } else {
        pixels[pos * 4 + 3] = currentAlpha;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}
