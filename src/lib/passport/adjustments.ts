import { PhotoAdjustments } from '../../types/passport';

/**
 * Applies controlled, biometric-safe adjustments (brightness, contrast, temperature, sharpness, saturation, exposure)
 * to an ImageData buffer or canvas context.
 */
export function applyPhotoAdjustments(
  imageData: ImageData,
  adjustments: PhotoAdjustments
) {
  const { brightness, contrast, temperature, sharpness, saturation, exposure } = adjustments;
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  // Safe clamping factors
  const brightnessOffset = Math.max(-20, Math.min(20, brightness)) * 2.55; // [-51, +51]
  const exposureFactor = Math.pow(2, Math.max(-10, Math.min(10, exposure)) / 30); // subtle exposure
  const contrastFactor = (259 * (Math.max(-10, Math.min(10, contrast)) + 100)) / (100 * (259 - Math.max(-10, Math.min(10, contrast))));
  const tempOffset = Math.max(-15, Math.min(15, temperature));
  const satFactor = 1 + Math.max(-15, Math.min(15, saturation)) / 100;

  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a === 0) continue; // Skip transparent background

    // 1. Exposure
    r *= exposureFactor;
    g *= exposureFactor;
    b *= exposureFactor;

    // 2. Brightness
    r += brightnessOffset;
    g += brightnessOffset;
    b += brightnessOffset;

    // 3. Contrast
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // 4. Color Temperature (White balance shift)
    if (tempOffset > 0) {
      r += tempOffset * 1.2; // Warmer
      b -= tempOffset * 0.8;
    } else if (tempOffset < 0) {
      b += Math.abs(tempOffset) * 1.2; // Cooler
      r -= Math.abs(tempOffset) * 0.8;
    }

    // 5. Saturation
    if (satFactor !== 1) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * satFactor;
      g = gray + (g - gray) * satFactor;
      b = gray + (b - gray) * satFactor;
    }

    // Clamp values to [0, 255]
    pixels[i] = Math.max(0, Math.min(255, Math.round(r)));
    pixels[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
    pixels[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
  }

  // 6. Subtle Unsharp Masking / Sharpness if requested
  if (sharpness > 0) {
    applyUnsharpMask(imageData, width, height, Math.min(20, sharpness));
  }
}

/**
 * 3x3 convolution unsharp mask for clean passport edge sharpness
 */
function applyUnsharpMask(imageData: ImageData, width: number, height: number, amount: number) {
  const pixels = imageData.data;
  const copy = new Uint8ClampedArray(pixels);
  const factor = (amount / 20) * 0.35; // gentle factor

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const idx = (y * width + x) * 4;
      if (pixels[idx + 3] === 0) continue;

      for (let c = 0; c < 3; c++) {
        const center = copy[idx + c];
        const up = copy[((y - 1) * width + x) * 4 + c];
        const down = copy[((y + 1) * width + x) * 4 + c];
        const left = copy[(y * width + (x - 1)) * 4 + c];
        const right = copy[(y * width + (x + 1)) * 4 + c];

        const laplacian = 4 * center - (up + down + left + right);
        const sharpened = center + factor * laplacian;
        pixels[idx + c] = Math.max(0, Math.min(255, Math.round(sharpened)));
      }
    }
  }
}
