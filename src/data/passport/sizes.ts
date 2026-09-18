import { PhotoSizePreset } from '../../types/passport';

export const PHOTO_SIZE_PRESETS: PhotoSizePreset[] = [
  {
    id: '35x45',
    name: '35 × 45 mm',
    widthMm: 35,
    heightMm: 45,
    description: 'Universal standard for Bangladesh, UAE, UK, Schengen, Australia & India passport.',
    recommendedBg: 'white',
    headHeightPercentMin: 70,
    headHeightPercentMax: 80,
    popularCountries: ['BD', 'AE', 'GB', 'IN', 'PK', 'AU', 'FR', 'DE', 'IT', 'SG'],
  },
  {
    id: '2x2in',
    name: '2 × 2 inches (51 × 51 mm)',
    widthMm: 50.8,
    heightMm: 50.8,
    description: 'Official standard for US Passport, US Visa, India OCI & Saudi Work Visas.',
    recommendedBg: 'white',
    headHeightPercentMin: 50,
    headHeightPercentMax: 69,
    popularCountries: ['US', 'IN', 'SA'],
  },
  {
    id: '33x48',
    name: '33 × 48 mm',
    widthMm: 33,
    heightMm: 48,
    description: 'Standard for China passport and Chinese visa applications.',
    recommendedBg: 'white',
    headHeightPercentMin: 70,
    headHeightPercentMax: 80,
    popularCountries: ['CN'],
  },
  {
    id: '40x50',
    name: '40 × 50 mm',
    widthMm: 40,
    heightMm: 50,
    description: 'Used for Brazilian passport and select Asian and Latin American ID cards.',
    recommendedBg: 'white',
    headHeightPercentMin: 70,
    headHeightPercentMax: 80,
    popularCountries: ['BR'],
  },
  {
    id: '50x70',
    name: '50 × 70 mm',
    widthMm: 50,
    heightMm: 70,
    description: 'Standard for Canadian passport and citizenship applications.',
    recommendedBg: 'white',
    headHeightPercentMin: 62,
    headHeightPercentMax: 72,
    popularCountries: ['CA'],
  },
  {
    id: '40x60',
    name: '40 × 60 mm',
    widthMm: 40,
    heightMm: 60,
    description: 'Standard for Saudi Arabia Umrah/Hajj visa and special GCC permits.',
    recommendedBg: 'white',
    headHeightPercentMin: 65,
    headHeightPercentMax: 75,
    popularCountries: ['SA'],
  },
];

export const DEFAULT_PHOTO_SIZE: PhotoSizePreset = PHOTO_SIZE_PRESETS[0]; // 35x45 mm

/**
 * Calculates pixel dimensions given mm dimensions and DPI.
 * Standard print resolution is 300 DPI.
 */
export function getPixelDimensions(widthMm: number, heightMm: number, dpi: number = 300): { width: number; height: number } {
  const mmToInch = 25.4;
  const widthPx = Math.round((widthMm / mmToInch) * dpi);
  const heightPx = Math.round((heightMm / mmToInch) * dpi);
  return { width: widthPx, height: heightPx };
}
