import { jsPDF } from 'jspdf';
import { PassportSession, PassportBgColor } from '../../types/passport';
import { getPixelDimensions } from '../../data/passport/sizes';
import { loadImage } from './faceDetection';
import { drawClothingOverlay } from './clothing';
import { applyPhotoAdjustments } from './adjustments';

export const BG_COLOR_MAP: Record<PassportBgColor, string> = {
  white: '#ffffff',
  blue: '#1d4ed8', // Standard passport blue (e.g. Bangladesh / Oman / Kuwait)
  'light-grey': '#e5e7eb', // UK / Australia standard
  'off-white': '#f8fafc',
  transparent: 'transparent',
  custom: '#ffffff',
};

/**
 * Renders the final passport photo canvas at exact physical 300 DPI dimensions.
 */
export async function renderFinalPassportCanvas(session: PassportSession): Promise<HTMLCanvasElement> {
  const { photoSize, background, customBgColor, preparedImage, segmentedImage, originalImage, clothingTemplateId, adjustments } = session;

  const imageSrc = preparedImage || segmentedImage || originalImage;
  if (!imageSrc) throw new Error('No image available to render');

  const img = await loadImage(imageSrc);

  // Exact 300 DPI pixel dimensions
  const { width: targetW, height: targetH } = getPixelDimensions(photoSize.widthMm, photoSize.heightMm, 300);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw Background
  const bgColor = background === 'custom' ? customBgColor : BG_COLOR_MAP[background] || '#ffffff';
  if (background !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);
  }

  // 2. Draw Portrait
  ctx.drawImage(img, 0, 0, targetW, targetH);

  // 3. Draw Clothing Overlay if selected
  if (clothingTemplateId && clothingTemplateId !== 'none') {
    const chinY = targetH * 0.58;
    const neckWidth = targetW * 0.35;
    drawClothingOverlay(ctx, {
      canvasWidth: targetW,
      canvasHeight: targetH,
      chinY,
      neckWidth,
      templateId: clothingTemplateId,
    });
  }

  // 4. Apply Adjustments
  const hasAdjustments = Object.values(adjustments).some((val) => val !== 0);
  if (hasAdjustments) {
    const imageData = ctx.getImageData(0, 0, targetW, targetH);
    applyPhotoAdjustments(imageData, adjustments);
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}

/**
 * Export final photo as a single-page PDF with physical size metadata.
 */
export async function exportSinglePhotoPdf(
  canvas: HTMLCanvasElement,
  photoSizeMm: { width: number; height: number },
  filename: string = 'passport-photo.pdf'
) {
  const isLandscape = photoSizeMm.width > photoSizeMm.height;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [photoSizeMm.width, photoSizeMm.height],
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  pdf.addImage(imgData, 'JPEG', 0, 0, photoSizeMm.width, photoSizeMm.height, undefined, 'FAST');
  pdf.save(filename);
}

/**
 * Download canvas as JPG image
 */
export function downloadCanvasJpg(canvas: HTMLCanvasElement, filename: string = 'passport-photo.jpg') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.98);
  link.click();
}

/**
 * Download canvas as PNG image
 */
export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string = 'passport-photo.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
