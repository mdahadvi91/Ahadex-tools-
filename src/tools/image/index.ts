/**
 * AHADEX TOOLS - Image Module Engine Blueprint
 * Modular tool interfaces and future execution handlers for Image & Media tools.
 */

export interface ImageProcessingOptions {
  quality?: number; // 0.1 to 1.0
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
}

export interface ImageProcessingResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  dataUrl?: string;
  filename: string;
}

export const imageToolModule = {
  category: 'image',
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  isWasmAccelerated: true,
};
