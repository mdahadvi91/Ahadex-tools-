export type TemplateLayout =
  | 'portrait'
  | 'luxury'
  | 'editorial'
  | 'minimal'
  | 'grid'
  | 'asymmetric'
  | 'glass'
  | 'frame'
  | 'bold'
  | 'split'
  | 'prism'
  | 'monogram'
  | 'brutalist'
  | 'signature'
  | 'cyber'
  | 'executive';

export interface OneSideCardData {
  photoUrl: string | null;
  logoUrl: string | null;
  fullName: string;
  jobTitle: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  linkedin: string;
  instagram: string;
  bio: string;
}

export interface TwoSideCardData {
  // Front side data
  photoUrl: string | null;
  logoUrl: string | null;
  fullName: string;
  jobTitle: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  linkedin: string;
  instagram: string;
  bio: string;
  // Back side specific data
  backTagline: string;
  backDescription: string;
  backWebsite: string;
  backEmail: string;
  backPhone: string;
  backAddress: string;
  showQrOnBack: boolean;
}

export interface OneSideTemplate {
  id: string;
  name: string;
  category: string;
  accent: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  layout: TemplateLayout;
  description: string;
  badge?: string;
  demoPortrait: string;
}

export interface TwoSideTemplate {
  id: string;
  name: string;
  category: string;
  accent: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  layout: TemplateLayout;
  description: string;
  badge?: string;
  demoPortrait: string;
  backBackground?: string;
  backForeground?: string;
}

export const CARD_WIDTH_PX = 1050;
export const CARD_HEIGHT_PX = 600;
export const CARD_WIDTH_IN = 3.5;
export const CARD_HEIGHT_IN = 2;

export const DEFAULT_AHAD_DATA: OneSideCardData = {
  photoUrl: null,
  logoUrl: null,
  fullName: 'Mohammad Ahad',
  jobTitle: 'Founder & CEO',
  companyName: 'AHADEX',
  phone: '+880 1700 000000',
  whatsapp: '+880 1700 000000',
  email: 'ahad@ahadex.com',
  website: 'ahadex.fun',
  address: 'Dubai · Dhaka · Worldwide',
  linkedin: 'linkedin.com/in/mohammadahad',
  instagram: '@mohammadahad',
  bio: 'Building futuristic digital tools, high-performance web applications, and next-generation developer utilities at AHADEX.',
};

export const DEFAULT_TWO_SIDE_AHAD_DATA: TwoSideCardData = {
  ...DEFAULT_AHAD_DATA,
  backTagline: 'INNOVATION THROUGH PRECISION',
  backDescription: 'AHADEX powers next-generation digital experiences, high-performance privacy-first tools, and developer technologies.',
  backWebsite: 'ahadex.fun',
  backEmail: 'contact@ahadex.com',
  backPhone: '+880 1700 000000',
  backAddress: 'AHADEX HQ · Dubai Silicon Oasis & Dhaka Tech Park',
  showQrOnBack: true,
};

export const EMPTY_ONE_SIDE_CARD_DATA: OneSideCardData = {
  photoUrl: null,
  logoUrl: null,
  fullName: '',
  jobTitle: '',
  companyName: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  address: '',
  linkedin: '',
  instagram: '',
  bio: '',
};

export const EMPTY_TWO_SIDE_CARD_DATA: TwoSideCardData = {
  ...EMPTY_ONE_SIDE_CARD_DATA,
  backTagline: '',
  backDescription: '',
  backWebsite: '',
  backEmail: '',
  backPhone: '',
  backAddress: '',
  showQrOnBack: true,
};
