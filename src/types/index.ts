export type ToolStatus = 'ready' | 'beta' | 'planned';
export type ProcessingType = 'client-side' | 'wasm' | 'hybrid';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  categorySlug: string;
  iconName: string;
  tags: string[];
  status: ToolStatus;
  isFeatured?: boolean;
  isPopular?: boolean;
  badge?: string;
  inputFormat?: string;
  outputFormat?: string;
  processingType: ProcessingType;
  version?: string;
  releaseDate?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  gradient: string;
  toolCount: number;
}

export type LanguageCode = 'en' | 'bn' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
}

export type ThemeMode = 'dark' | 'light' | 'system';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface PlatformStat {
  label: string;
  value: string;
  description: string;
}
