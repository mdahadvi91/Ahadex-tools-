import { PaperSize, PaperSizeId } from '../../types/passport';

export const PAPER_SIZES: PaperSize[] = [
  {
    id: 'a4',
    name: 'A4 Sheet',
    widthMm: 210,
    heightMm: 297,
    description: 'Standard international paper (210 × 297 mm). Most popular for home & office printers.',
  },
  {
    id: 'letter',
    name: 'US Letter',
    widthMm: 215.9,
    heightMm: 279.4,
    description: 'Standard North American paper (8.5 × 11.0 inches). Commonly used in USA & Canada.',
  },
  {
    id: 'legal',
    name: 'US Legal',
    widthMm: 215.9,
    heightMm: 355.6,
    description: 'Long office paper (8.5 × 14.0 inches) for extra photo capacity.',
  },
  {
    id: '4x6',
    name: '4 × 6 inch Photo Paper',
    widthMm: 101.6,
    heightMm: 152.4,
    description: 'Standard photo studio glossy card (10 × 15 cm). Perfect for instant photo lab prints.',
  },
];

export const DEFAULT_PAPER_SIZE = PAPER_SIZES[0]; // A4

/**
 * Calculates how many photos of given width & height (in mm) fit onto paper
 * considering margins and spacing.
 */
export function calculatePrintGrid(
  paperWidthMm: number,
  paperHeightMm: number,
  photoWidthMm: number,
  photoHeightMm: number,
  marginMm: number = 10,
  spacingMm: number = 4
) {
  const printableWidth = paperWidthMm - marginMm * 2;
  const printableHeight = paperHeightMm - marginMm * 2;

  if (printableWidth <= 0 || printableHeight <= 0) {
    return { columns: 0, rows: 0, totalPhotos: 0, scale: 1 };
  }

  // Normal orientation
  const colsNormal = Math.max(1, Math.floor((printableWidth + spacingMm) / (photoWidthMm + spacingMm)));
  const rowsNormal = Math.max(1, Math.floor((printableHeight + spacingMm) / (photoHeightMm + spacingMm)));
  const totalNormal = colsNormal * rowsNormal;

  // Rotated orientation
  const colsRotated = Math.max(1, Math.floor((printableWidth + spacingMm) / (photoHeightMm + spacingMm)));
  const rowsRotated = Math.max(1, Math.floor((printableHeight + spacingMm) / (photoWidthMm + spacingMm)));
  const totalRotated = colsRotated * rowsRotated;

  // Pick whichever packs more cleanly (usually normal orientation for passport portraits)
  const isRotatedBetter = totalRotated > totalNormal && totalRotated > 0;

  const columns = isRotatedBetter ? colsRotated : colsNormal;
  const rows = isRotatedBetter ? rowsRotated : rowsNormal;
  const totalPhotos = columns * rows;

  return {
    columns,
    rows,
    totalPhotos,
    isRotated: isRotatedBetter,
    usedWidthMm: columns * photoWidthMm + (columns - 1) * spacingMm,
    usedHeightMm: rows * photoHeightMm + (rows - 1) * spacingMm,
  };
}
