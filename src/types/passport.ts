export type PassportBgColor = 'white' | 'blue' | 'light-grey' | 'off-white' | 'transparent' | 'custom';

export interface FaceLandmarks {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  noseTip: { x: number; y: number };
  mouthCenter: { x: number; y: number };
  chin: { x: number; y: number };
  forehead: { x: number; y: number };
  leftEar?: { x: number; y: number };
  rightEar?: { x: number; y: number };
}

export interface FaceBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceData {
  detected: boolean;
  faceCount: number;
  confidence: number;
  box: FaceBoundingBox;
  landmarks: FaceLandmarks;
  tiltAngle: number; // in degrees
  shoulderSlope: number;
  eyeDistance: number;
  qualityScores: {
    lighting: number; // 0-100
    sharpness: number; // 0-100
    resolution: number; // 0-100
    overall: number; // 0-100
  };
  validationErrors: string[];
  validationWarnings: string[];
}

export interface PhotoSizePreset {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
  recommendedBg: PassportBgColor;
  headHeightPercentMin: number; // e.g. 70%
  headHeightPercentMax: number; // e.g. 80%
  popularCountries: string[];
}

export interface CountryPreset {
  code: string;
  name: string;
  flag: string;
  recommendedSizeId: string;
  recommendedBg: PassportBgColor;
  headRatioText: string;
  notes: string;
}

export interface ClothingTemplate {
  id: string;
  name: string;
  category: 'formal' | 'suit' | 'blazer' | 'uniform' | 'casual';
  gender: 'unisex' | 'men' | 'women';
  previewColor: string;
  description: string;
}

export interface PhotoAdjustments {
  brightness: number; // -20 to +20
  contrast: number; // -10 to +10
  temperature: number; // -15 to +15 (warmth)
  sharpness: number; // 0 to 20
  saturation: number; // -15 to +15
  exposure: number; // -10 to +10
}

export type PaperSizeId = 'a4' | 'letter' | 'legal' | '4x6';

export interface PaperSize {
  id: PaperSizeId;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

export interface PrintSettings {
  paperSize: PaperSizeId;
  includeCropMarks: boolean;
  includeBorder: boolean;
  borderColor: string;
  marginMm: number;
  spacingMm: number;
  customColumns?: number;
  customRows?: number;
}

export interface PassportSession {
  version: number;
  updatedAt: number;
  
  // Images
  originalImage: string | null; // Data URL of user photo (LOCKED reference)
  originalDimensions: { width: number; height: number };
  segmentedImage: string | null; // Data URL with background removed
  preparedImage: string | null; // Aligned & centered portrait
  finalImage: string | null; // Final rendered photo
  
  // Metadata & Detection
  faceData: FaceData | null;
  identityLocked: boolean;
  
  // Configurations
  background: PassportBgColor;
  customBgColor: string;
  countryCode: string;
  photoSize: PhotoSizePreset;
  
  // Customization
  clothingTemplateId: string;
  adjustments: PhotoAdjustments;
  
  // Print
  printSettings: PrintSettings;
}
