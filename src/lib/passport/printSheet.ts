import { jsPDF } from 'jspdf';
import { PassportSession } from '../../types/passport';
import { PAPER_SIZES, calculatePrintGrid } from '../../data/passport/paperSizes';
import { renderFinalPassportCanvas } from './export';

/**
 * Generates a high-resolution print sheet canvas containing multiple exact-scale passport photos
 * with crop marks, borders, and print alignment header.
 */
export async function renderPrintSheetCanvas(
  session: PassportSession
): Promise<{
  canvas: HTMLCanvasElement;
  totalPhotos: number;
  columns: number;
  rows: number;
  paperName: string;
}> {
  const paper = PAPER_SIZES.find((p) => p.id === session.printSettings.paperSize) || PAPER_SIZES[0];
  const { widthMm: paperW, heightMm: paperH } = paper;
  const { widthMm: photoW, heightMm: photoH } = session.photoSize;
  const { marginMm, spacingMm, includeCropMarks, includeBorder, borderColor } = session.printSettings;

  const grid = calculatePrintGrid(paperW, paperH, photoW, photoH, marginMm, spacingMm);
  const { columns, rows, totalPhotos } = grid;

  // Render sheet at 300 DPI (1 mm = 11.811 px)
  const dpi = 300;
  const mmToPx = (mm: number) => Math.round((mm / 25.4) * dpi);

  const sheetW = mmToPx(paperW);
  const sheetH = mmToPx(paperH);

  const canvas = document.createElement('canvas');
  canvas.width = sheetW;
  canvas.height = sheetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available for print sheet');

  // Background white sheet
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sheetW, sheetH);

  // Render the single photo high-res canvas once
  const singlePhotoCanvas = await renderFinalPassportCanvas(session);

  // Calculate centered start coordinates
  const totalGridWMm = columns * photoW + (columns - 1) * spacingMm;
  const totalGridHMm = rows * photoH + (rows - 1) * spacingMm;

  const startXMm = (paperW - totalGridWMm) / 2;
  // Leave small top margin for print instructions line
  const startYMm = Math.max(marginMm, (paperH - totalGridHMm) / 2);

  const photoWPx = mmToPx(photoW);
  const photoHPx = mmToPx(photoH);
  const spacingPx = mmToPx(spacingMm);
  const cropMarkLengthPx = mmToPx(3);

  // Draw Header Note on Paper (for printing instructions)
  ctx.fillStyle = '#64748b';
  ctx.font = `${Math.round(sheetW * 0.013)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(
    `AHADEX PASSPORT STUDIO • ${session.photoSize.name} (${photoW}×${photoH}mm) • Print at 100% Scale (Actual Size / Do Not Fit To Page)`,
    sheetW / 2,
    mmToPx(startYMm * 0.6)
  );

  // Draw grid of photos
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const xPx = mmToPx(startXMm) + c * (photoWPx + spacingPx);
      const yPx = mmToPx(startYMm) + r * (photoHPx + spacingPx);

      // Draw photo
      ctx.drawImage(singlePhotoCanvas, xPx, yPx, photoWPx, photoHPx);

      // Draw optional thin border
      if (includeBorder) {
        ctx.strokeStyle = borderColor || '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(xPx, yPx, photoWPx, photoHPx);
      }

      // Draw Crop Marks around corners
      if (includeCropMarks) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;

        // Top-Left corner mark
        ctx.beginPath();
        ctx.moveTo(xPx - cropMarkLengthPx, yPx);
        ctx.lineTo(xPx, yPx);
        ctx.lineTo(xPx, yPx - cropMarkLengthPx);
        ctx.stroke();

        // Top-Right corner mark
        ctx.beginPath();
        ctx.moveTo(xPx + photoWPx + cropMarkLengthPx, yPx);
        ctx.lineTo(xPx + photoWPx, yPx);
        ctx.lineTo(xPx + photoWPx, yPx - cropMarkLengthPx);
        ctx.stroke();

        // Bottom-Left corner mark
        ctx.beginPath();
        ctx.moveTo(xPx - cropMarkLengthPx, yPx + photoHPx);
        ctx.lineTo(xPx, yPx + photoHPx);
        ctx.lineTo(xPx, yPx + photoHPx + cropMarkLengthPx);
        ctx.stroke();

        // Bottom-Right corner mark
        ctx.beginPath();
        ctx.moveTo(xPx + photoWPx + cropMarkLengthPx, yPx + photoHPx);
        ctx.lineTo(xPx + photoWPx, yPx + photoHPx);
        ctx.lineTo(xPx + photoWPx, yPx + photoHPx + cropMarkLengthPx);
        ctx.stroke();
      }
    }
  }

  return {
    canvas,
    totalPhotos,
    columns,
    rows,
    paperName: paper.name,
  };
}

/**
 * Exports the complete multi-photo sheet to a 300 DPI PDF document
 * with exact page dimensions matching the physical paper size.
 */
export async function exportPrintSheetPdf(session: PassportSession, filename?: string) {
  const paper = PAPER_SIZES.find((p) => p.id === session.printSettings.paperSize) || PAPER_SIZES[0];
  const { canvas, totalPhotos } = await renderPrintSheetCanvas(session);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [paper.widthMm, paper.heightMm],
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  pdf.addImage(imgData, 'JPEG', 0, 0, paper.widthMm, paper.heightMm, undefined, 'FAST');

  const name = filename || `passport-photos-${paper.id}-${totalPhotos}pcs.pdf`;
  pdf.save(name);
}
