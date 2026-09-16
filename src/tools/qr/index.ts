/**
 * AHADEX TOOLS - QR & Barcode Module Blueprint
 */
export interface QrOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  size?: number;
  fgColor?: string;
  bgColor?: string;
  margin?: number;
}

export const qrToolModule = {
  category: 'qr',
  formats: ['qrcode', 'code128', 'ean13', 'upca'],
};
