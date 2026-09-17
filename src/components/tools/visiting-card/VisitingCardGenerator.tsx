import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng, toJpeg } from 'html-to-image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import {
  CreditCard,
  Upload,
  User,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Download,
  Sparkles,
  Layers,
  RefreshCw,
  Eye,
  CheckCircle2,
  QrCode,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  Sliders,
  ShieldCheck,
  Check,
  FileText,
  Trash2,
  ZoomIn,
  X,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../ui/Button';

type CardSideMode = '1-side' | '2-side';

export type TemplateId =
  | 'executive_gold'
  | 'corporate_navy'
  | 'minimal_obsidian'
  | 'modern_platinum'
  | 'creative_studio'
  | 'luxury_rose'
  | 'cyber_dark'
  | 'founder_tech'
  | 'swiss_grid'
  | 'golden_crest'
  | 'carbon_stealth'
  | 'monaco_yacht'
  | 'tokyo_editorial'
  | 'legal_justice'
  | 'medical_pure'
  | 'architect_blueprint';

export interface TemplateOption {
  id: TemplateId;
  name: string;
  category: 'executive' | 'corporate' | 'tech' | 'creative';
  description: string;
  badge: string;
  color: string;
  previewBg: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'executive_gold',
    name: 'CEO Executive Gold',
    category: 'executive',
    description: 'Deep obsidian metallic background with refined gold foil styling.',
    badge: 'Fortune 500',
    color: 'from-amber-400 to-yellow-600',
    previewBg: 'bg-zinc-950 border-amber-400/40',
  },
  {
    id: 'corporate_navy',
    name: 'Corporate Royal Navy',
    category: 'corporate',
    description: 'Crisp royal navy backdrop with silver typography & sharp hierarchy.',
    badge: 'Corporate',
    color: 'from-blue-600 to-indigo-700',
    previewBg: 'bg-slate-900 border-blue-500/30',
  },
  {
    id: 'minimal_obsidian',
    name: 'Nordic Minimalist',
    category: 'corporate',
    description: 'Ultra-clean, high-contrast serif typography with generous spacing.',
    badge: 'Minimal',
    color: 'from-stone-400 to-stone-600',
    previewBg: 'bg-stone-900 border-stone-500/30',
  },
  {
    id: 'modern_platinum',
    name: 'Modern Platinum',
    category: 'tech',
    description: 'Sleek dark slate theme with cyan neon trims & subtle gradients.',
    badge: 'Modern',
    color: 'from-cyan-500 to-blue-600',
    previewBg: 'bg-slate-950 border-cyan-500/30',
  },
  {
    id: 'creative_studio',
    name: 'Creative Director',
    category: 'creative',
    description: 'Teal highlights with geometric elegance for agency leaders.',
    badge: 'Creative',
    color: 'from-emerald-400 to-teal-600',
    previewBg: 'bg-slate-900 border-emerald-400/30',
  },
  {
    id: 'luxury_rose',
    name: 'Luxury Rose Gold',
    category: 'executive',
    description: 'Champagne rose accents for premium luxury brands.',
    badge: 'Luxury',
    color: 'from-rose-400 to-pink-600',
    previewBg: 'bg-stone-950 border-rose-400/30',
  },
  {
    id: 'cyber_dark',
    name: 'Onyx Cyber Matrix',
    category: 'tech',
    description: 'Futuristic black layout with sharp cyan neon framing.',
    badge: 'Tech VIP',
    color: 'from-cyan-400 to-purple-600',
    previewBg: 'bg-black border-cyan-400/50',
  },
  {
    id: 'founder_tech',
    name: 'Silicon Tech Founder',
    category: 'tech',
    description: 'Modern developer & founder layout with active status indicator.',
    badge: 'Founder',
    color: 'from-violet-500 to-indigo-600',
    previewBg: 'bg-slate-900 border-violet-500/30',
  },
  {
    id: 'swiss_grid',
    name: 'Swiss Modernist',
    category: 'creative',
    description: 'High-contrast international typographic style with iconic red accent bar.',
    badge: 'Architectural',
    color: 'from-red-500 to-rose-700',
    previewBg: 'bg-zinc-900 border-red-500/40',
  },
  {
    id: 'golden_crest',
    name: 'Imperial Heritage',
    category: 'executive',
    description: 'Royal burgundy and burnished gold double-stroke frame for prestigious leaders.',
    badge: 'Heritage',
    color: 'from-yellow-500 to-amber-700',
    previewBg: 'bg-rose-950 border-amber-400/40',
  },
  {
    id: 'carbon_stealth',
    name: 'Carbon Stealth Black',
    category: 'executive',
    description: 'Monochrome carbon graphite finish with crisp white typographic precision.',
    badge: 'Stealth',
    color: 'from-zinc-400 to-zinc-700',
    previewBg: 'bg-neutral-950 border-neutral-700',
  },
  {
    id: 'monaco_yacht',
    name: 'Riviera Azure',
    category: 'corporate',
    description: 'Deep cobalt blue with golden nautical accents and pristine white clarity.',
    badge: 'Maritime',
    color: 'from-sky-400 to-blue-700',
    previewBg: 'bg-blue-950 border-sky-400/40',
  },
  {
    id: 'tokyo_editorial',
    name: 'Tokyo Editorial',
    category: 'creative',
    description: 'Contemporary Japanese asymmetrical design with delicate vertical dividers.',
    badge: 'Editorial',
    color: 'from-stone-300 to-amber-500',
    previewBg: 'bg-neutral-900 border-stone-600',
  },
  {
    id: 'legal_justice',
    name: 'Advocate & Legal Counsel',
    category: 'corporate',
    description: 'Stately dark forest green with warm brass gold accents for attorneys.',
    badge: 'Legal',
    color: 'from-emerald-500 to-amber-600',
    previewBg: 'bg-emerald-950 border-amber-500/40',
  },
  {
    id: 'medical_pure',
    name: 'Healthcare Specialist',
    category: 'creative',
    description: 'Clinical dark slate-cyan with sky-blue accents and medical shield badge.',
    badge: 'Medical',
    color: 'from-cyan-400 to-sky-600',
    previewBg: 'bg-slate-950 border-cyan-400/40',
  },
  {
    id: 'architect_blueprint',
    name: 'Architect Blueprint',
    category: 'tech',
    description: 'Deep navy technical blueprint with geometric drafting grid lines.',
    badge: 'Blueprint',
    color: 'from-blue-400 to-cyan-500',
    previewBg: 'bg-sky-950 border-blue-400/40',
  },
];

interface CardData {
  fullName: string;
  jobTitle: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  showPhoto: boolean;
  showQrCode: boolean;
  showCompanyName: boolean;
  photoUrl: string | null;
  photoZoom: number;
  photoX: number;
  photoY: number;
  photoFrame: 'circle' | 'rounded' | 'square';
  logoUrl: string | null;
  backSideTagline: string;
  backSideServices: string[];
}

const DEFAULT_CARD_DATA: CardData = {
  fullName: 'Alexander Wright',
  jobTitle: 'Chief Executive Officer',
  companyName: 'Ahadex Global Inc.',
  phone: '+1 (555) 234-5678',
  whatsapp: '+1 (555) 234-5678',
  email: 'alexander@ahadex.fun',
  website: 'www.ahadex.fun',
  address: 'Silicon Valley, CA',
  showPhoto: true,
  showQrCode: true,
  showCompanyName: true,
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  photoZoom: 1,
  photoX: 0,
  photoY: 0,
  photoFrame: 'circle',
  logoUrl: null,
  backSideTagline: 'Excellence in Enterprise Solutions',
  backSideServices: [
    'Strategic Leadership',
    'Global Operations',
    'Digital Transformation',
  ],
};

export const VisitingCardGenerator: React.FC = () => {
  const { addToast } = useToast();

  // Wizard Step: 1 = Choose Template, 2 = Photo & Logo, 3 = Card Info & Download
  const [wizardStep, setWizardStep] = useState<number>(1);
  const goToStep = (step: number) => {
    setWizardStep(step);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const [sideMode, setSideMode] = useState<CardSideMode>('1-side');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('executive_gold');
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [activePreviewSide, setActivePreviewSide] = useState<'front' | 'back'>('front');

  // Template Modal Pop-up States
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('all');
  const [templateModalSide, setTemplateModalSide] = useState<'front' | 'back'>('front');
  const [templateSearchQuery, setTemplateSearchQuery] = useState<string>('');

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [newServiceTag, setNewServiceTag] = useState<string>('');

  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const exportFrontRef = useRef<HTMLDivElement>(null);
  const exportBackRef = useRef<HTMLDivElement>(null);
  const studioContainerRef = useRef<HTMLDivElement>(null);

  // Generate QR Code data URL dynamically
  useEffect(() => {
    const qrText = cardData.website
      ? cardData.website.startsWith('http')
        ? cardData.website
        : `https://${cardData.website}`
      : `BEGIN:VCARD\nVERSION:3.0\nN:${cardData.fullName}\nTITLE:${cardData.jobTitle}\nTEL:${cardData.phone}\nEMAIL:${cardData.email}\nEND:VCARD`;

    QRCode.toDataURL(qrText, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [cardData.website, cardData.fullName, cardData.jobTitle, cardData.phone, cardData.email]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      addToast('File Too Large', 'Photo size should be under 8MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      addToast('Invalid File', 'Please select a valid image file.', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;

      if (typeof result !== 'string') {
        addToast('Upload Error', 'Could not read photo.', 'error');
        return;
      }

      setCardData((prev) => ({
        ...prev,
        photoUrl: result,
        showPhoto: true,
        photoZoom: 1,
        photoX: 0,
        photoY: 0,
      }));

      addToast('Photo Uploaded', 'Photo added to visiting card.', 'success');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('File Too Large', 'Logo size should be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;

      if (typeof result !== 'string') return;

      setCardData((prev) => ({
        ...prev,
        logoUrl: result,
      }));

      addToast('Logo Uploaded', 'Company logo updated!', 'success');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // True OKLCH-to-RGBA converter using browser canvas 2D frame-buffer
  // Ensures 100% compatibility with html2canvas by extracting standard 8-bit RGBA integers
  const oklchCache = useRef<Map<string, string>>(new Map());
  const oklchToRgba = (oklchStr: string): string => {
    if (!oklchStr || typeof document === 'undefined') return '#0f172a';
    if (oklchCache.current.has(oklchStr)) return oklchCache.current.get(oklchStr)!;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return '#0f172a';

      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = oklchStr;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      const alpha = +(a / 255).toFixed(3);
      const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      oklchCache.current.set(oklchStr, rgba);
      return rgba;
    } catch {
      return '#0f172a';
    }
  };

  const sanitizeCssText = (cssText: string): string => {
    if (!cssText || !cssText.includes('oklch')) return cssText;
    return cssText.replace(/oklch\([^)]+\)/gi, (match) => oklchToRgba(match));
  };

  // Safe Step Switching (Does not cause viewport jumping or layout shift)
  const handleStepChange = (targetStep: number) => {
    setWizardStep(targetStep);
  };

  // Capture Card Canvas with Deep Sanitization & Image Preloading
  const captureCardCanvas = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    // 1. Preload and verify all <img> elements
    const imgs = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth !== 0) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
              setTimeout(() => resolve(true), 1200);
            }
          })
      )
    );

    // Wait for web fonts if available
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    } catch {}

    const width = element.offsetWidth || 1050;
    const height = element.offsetHeight || 600;

    return html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 15000,
      width: width,
      height: height,
      onclone: (clonedDoc, clonedEl) => {
        // Ensure cloned element is 100% visible and unclipped
        if (clonedEl instanceof HTMLElement) {
          clonedEl.style.opacity = '1';
          clonedEl.style.visibility = 'visible';
          clonedEl.style.display = 'block';
          clonedEl.style.transform = 'none';
        }

        // 1. Sanitize all <style> tags text content
        const styleElements = clonedDoc.querySelectorAll('style');
        styleElements.forEach((styleEl) => {
          if (styleEl.textContent && styleEl.textContent.includes('oklch')) {
            styleEl.textContent = sanitizeCssText(styleEl.textContent);
          }
        });

        // 2. Recursively sanitize all stylesheet rules (including @layer utilities, @layer theme, @media)
        const sanitizeRuleList = (ruleList: CSSRuleList) => {
          for (let i = 0; i < ruleList.length; i++) {
            const rule = ruleList[i];
            if (rule instanceof CSSStyleRule) {
              if (rule.style && rule.style.cssText && rule.style.cssText.includes('oklch')) {
                rule.style.cssText = sanitizeCssText(rule.style.cssText);
              }
            } else if ('cssRules' in rule && (rule as any).cssRules) {
              try {
                sanitizeRuleList((rule as any).cssRules);
              } catch {}
            }
          }
        };

        try {
          Array.from(clonedDoc.styleSheets).forEach((sheet) => {
            try {
              const rules = sheet.cssRules;
              if (rules) sanitizeRuleList(rules);
            } catch {}
          });
        } catch {}

        // 3. Properties to sanitize on all cloned elements
        const colorProps = [
          'color',
          'backgroundColor',
          'borderColor',
          'borderTopColor',
          'borderRightColor',
          'borderBottomColor',
          'borderLeftColor',
          'outlineColor',
          'boxShadow',
          'textShadow',
          'fill',
          'stroke',
        ];

        const allNodes = Array.from(clonedDoc.querySelectorAll('*'));
        if (clonedDoc.body) allNodes.push(clonedDoc.body);

        allNodes.forEach((node) => {
          if (node instanceof HTMLElement || node instanceof SVGElement) {
            // Sanitize inline style attribute
            if (node.style && node.style.cssText && node.style.cssText.includes('oklch')) {
              node.style.cssText = sanitizeCssText(node.style.cssText);
            }

            // Sanitize computed colors
            const computed = clonedDoc.defaultView?.getComputedStyle(node);
            if (computed) {
              colorProps.forEach((prop) => {
                const val = (computed as any)[prop];
                if (typeof val === 'string' && val.includes('oklch')) {
                  (node.style as any)[prop] = sanitizeCssText(val);
                }
              });
            }
          }
        });
      },
    });
  };

  // Reliable instant downloader
  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }, 800);
  };

  const getSafeFilename = () => {
    const rawName = cardData.fullName?.trim() || 'Visiting_Card';
    return rawName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Visiting_Card';
  };

  // Export PNG (Front or Back)
  const handleExportPNG = async (side: 'front' | 'back' = 'front') => {
    const targetEl =
      side === 'front'
        ? exportFrontRef.current || frontCardRef.current
        : exportBackRef.current || backCardRef.current;

    if (!targetEl) {
      addToast('Export Error', `Card ${side} element unavailable.`, 'error');
      return;
    }

    if (isExporting) return;
    setIsExporting(true);

    try {
      addToast('Rendering Image', `Generating high-res PNG (${side})...`, 'info');
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      let dataUrl: string;
      try {
        dataUrl = await toPng(targetEl, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
          skipFonts: true,
          fontEmbedCSS: '',
        });
      } catch (e) {
        console.warn('html-to-image failed, using html2canvas fallback:', e);
        const canvas = await captureCardCanvas(targetEl);
        dataUrl = canvas.toDataURL('image/png');
      }

      const filename = `${getSafeFilename()}_${side.toUpperCase()}_300DPI.png`;
      triggerDownload(dataUrl, filename);
      addToast('Download Complete', `Saved ${filename}`, 'success');
    } catch (err: any) {
      console.error('PNG Export Error:', err);
      addToast('Export Error', `PNG export failed: ${err?.message || 'Unknown error'}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Export JPG (Front or Back)
  const handleExportJPG = async (side: 'front' | 'back' = 'front') => {
    const targetEl =
      side === 'front'
        ? exportFrontRef.current || frontCardRef.current
        : exportBackRef.current || backCardRef.current;

    if (!targetEl) return;
    if (isExporting) return;
    setIsExporting(true);

    try {
      addToast('Rendering Image', `Generating high-res JPG (${side})...`, 'info');
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      let dataUrl: string;
      try {
        dataUrl = await toJpeg(targetEl, {
          quality: 0.98,
          pixelRatio: 2,
          backgroundColor: '#0f172a',
          cacheBust: true,
          skipFonts: true,
          fontEmbedCSS: '',
        });
      } catch (e) {
        console.warn('html-to-image failed, using html2canvas fallback:', e);
        const canvas = await captureCardCanvas(targetEl);
        dataUrl = canvas.toDataURL('image/jpeg', 0.98);
      }

      const filename = `${getSafeFilename()}_${side.toUpperCase()}_300DPI.jpg`;
      triggerDownload(dataUrl, filename);
      addToast('Download Complete', `Saved ${filename}`, 'success');
    } catch (err: any) {
      console.error('JPG Export Error:', err);
      addToast('Export Error', `JPG export failed: ${err?.message || 'Unknown error'}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Print Ready PDF (Vector & 300DPI 3.5" x 2.0")
  const handleExportPDF = async () => {
    const frontEl = exportFrontRef.current || frontCardRef.current;
    if (!frontEl) {
      addToast('Export Error', 'Card front element unavailable.', 'error');
      return;
    }

    if (isExporting) return;
    setIsExporting(true);

    try {
      addToast('Generating PDF', 'Rendering 3.5" x 2.0" print-ready PDF document...', 'info');
      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      let frontImgData: string;
      try {
        frontImgData = await toJpeg(frontEl, {
          quality: 0.98,
          pixelRatio: 2,
          backgroundColor: '#0f172a',
          cacheBust: true,
          skipFonts: true,
          fontEmbedCSS: '',
        });
      } catch (e) {
        console.warn('html-to-image front failed, using html2canvas fallback:', e);
        const frontCanvas = await captureCardCanvas(frontEl);
        frontImgData = frontCanvas.toDataURL('image/jpeg', 0.98);
      }

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2.0],
        compress: true,
      });

      pdf.addImage(frontImgData, 'JPEG', 0, 0, 3.5, 2.0, undefined, 'FAST');

      const backEl = exportBackRef.current || backCardRef.current;
      if (sideMode === '2-side' && backEl) {
        await new Promise<void>((resolve) => setTimeout(resolve, 100));
        let backImgData: string;
        try {
          backImgData = await toJpeg(backEl, {
            quality: 0.98,
            pixelRatio: 2,
            backgroundColor: '#0f172a',
            cacheBust: true,
            skipFonts: true,
            fontEmbedCSS: '',
          });
        } catch (e) {
          console.warn('html-to-image back failed, using html2canvas fallback:', e);
          const backCanvas = await captureCardCanvas(backEl);
          backImgData = backCanvas.toDataURL('image/jpeg', 0.98);
        }

        pdf.addPage([3.5, 2.0], 'landscape');
        pdf.addImage(backImgData, 'JPEG', 0, 0, 3.5, 2.0, undefined, 'FAST');
      }

      const filename = `${getSafeFilename()}_${sideMode === '2-side' ? '2Side' : '1Side'}_Print.pdf`;
      pdf.save(filename);

      addToast('PDF Downloaded', `Successfully saved ${filename}`, 'success');
    } catch (err: any) {
      console.error('PDF Export Error:', err);
      addToast('Export Error', `PDF generation failed: ${err?.message || 'Unknown error'}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Render Mini Visual Card Thumbnail Preview for Step 1 & Modal
  const renderMiniTemplatePreview = (templateId: TemplateId, side: 'front' | 'back' = 'front') => {
    return (
      <div className="w-full aspect-[1.75/1] rounded-xl overflow-hidden border border-slate-800/80 shadow-md relative pointer-events-none select-none bg-slate-950">
        <div className="w-full h-full">
          {side === 'front'
            ? renderFrontCardTemplate(templateId, true)
            : renderBackCardTemplate(templateId, true)}
        </div>
      </div>
    );
  };

  // Render Avatar Photo Helper
  const renderAvatarPhoto = (className: string = 'w-16 h-16') => {
    if (!cardData.showPhoto) return null;

    const frameClasses = {
      circle: 'rounded-full',
      rounded: 'rounded-xl',
      square: 'rounded-none',
    };

    return (
      <div
        className={`relative overflow-hidden bg-slate-800 border-2 border-white/20 shadow-md shrink-0 ${frameClasses[cardData.photoFrame]} ${className}`}
      >
        {cardData.photoUrl ? (
          <img
            src={cardData.photoUrl}
            alt={cardData.fullName}
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${cardData.photoZoom}) translate(${cardData.photoX}px, ${cardData.photoY}px)`,
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
            <User className="w-1/2 h-1/2 opacity-60" />
          </div>
        )}
      </div>
    );
  };

  // Render Logo Helper
  const renderLogo = (defaultTextClassName: string = 'text-amber-400 font-bold') => {
    if (cardData.logoUrl) {
      return (
        <img
          src={cardData.logoUrl}
          alt="Company Logo"
          className="h-6 sm:h-7 w-auto object-contain max-w-[120px]"
        />
      );
    }

    if (!cardData.showCompanyName && !cardData.companyName) {
      return null;
    }

    return (
      <div className="flex items-center gap-1.5">
        <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className={`text-[11px] uppercase tracking-wider font-bold ${defaultTextClassName}`}>
          {cardData.companyName || 'AHADEX'}
        </span>
      </div>
    );
  };

  // Helper to render QR Code on front of visiting cards
  const renderFrontQr = (className: string = 'w-8 h-8 sm:w-10 sm:h-10') => {
    if (!cardData.showQrCode || !qrCodeDataUrl) return null;
    return (
      <div className={`p-0.5 rounded bg-white shadow-md border border-slate-300 shrink-0 ${className}`}>
        <img src={qrCodeDataUrl} alt="QR Code" className="w-full h-full object-contain" />
      </div>
    );
  };

  // Render Front Card Template
  const renderFrontCardTemplate = (overrideTemplateId?: TemplateId, isThumbnail: boolean = false) => {
    const tmplToUse = overrideTemplateId || selectedTemplate;
    const {
      fullName,
      jobTitle,
      companyName,
      phone,
      whatsapp,
      email,
      website,
      address,
      showCompanyName,
      showQrCode,
    } = cardData;

    switch (tmplToUse) {
      case 'executive_gold':
        return (
          <div className={`w-full h-full bg-zinc-950 text-amber-100 flex flex-col justify-between relative overflow-hidden font-sans border-2 border-amber-500/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600" />

            <div className="flex items-center justify-between border-b border-amber-500/20 pb-1">
              {renderLogo(isThumbnail ? 'text-amber-300 text-[9px]' : 'text-amber-300')}
              <span className={`font-mono uppercase tracking-widest text-amber-400/90 rounded bg-amber-950/80 border border-amber-500/30 ${isThumbnail ? 'text-[7px] px-1 py-0.5' : 'text-[9px] px-2 py-0.5'}`}>
                EXECUTIVE
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 border border-amber-400/60 shadow-md' : 'w-16 h-16 sm:w-20 sm:h-20 border-2 border-amber-400/60 shadow-xl')}
              <div className="min-w-0">
                <h2 className={`font-extrabold tracking-tight text-amber-200 truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Executive Name'}
                </h2>
                <p className={`font-semibold text-amber-400/90 tracking-wide uppercase truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Chief Executive Officer'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-zinc-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-[11px] mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-amber-500/20 flex items-center justify-between gap-2 pt-2 text-amber-100/90 font-mono ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-x-1 gap-y-0.5' : ''}`}>
                <div className="flex items-center gap-1 truncate">
                  <Phone className={`text-amber-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{phone || '+1 (555) 234-5678'}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Mail className={`text-amber-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{email || 'alexander@ahadex.fun'}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Globe className={`text-amber-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{website || 'www.ahadex.fun'}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <MapPin className={`text-amber-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{address || 'Silicon Valley, CA'}</span>
                </div>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'corporate_navy':
        return (
          <div className={`w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-slate-800 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

            <div className="flex items-center justify-between">
              {renderLogo(isThumbnail ? 'text-blue-400 text-[9px]' : 'text-blue-400')}
              <span className={`font-mono text-slate-400 uppercase tracking-widest rounded bg-blue-950/60 border border-blue-800/40 ${isThumbnail ? 'text-[7px] px-1 py-0.5' : 'text-[9px] px-2 py-0.5'}`}>
                OFFICIAL
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 border border-blue-500/40 shadow-md' : 'w-16 h-16 sm:w-20 sm:h-20 border-2 border-blue-500/40 shadow-xl')}
              <div className="min-w-0">
                <h2 className={`font-extrabold tracking-tight text-white truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Executive Name'}
                </h2>
                <p className={`font-semibold text-blue-400 tracking-wide uppercase truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Managing Director'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-slate-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-[11px] mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-slate-800 flex items-center justify-between gap-2 pt-2 text-slate-300 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-x-1 gap-y-0.5' : ''}`}>
                <div className="flex items-center gap-1 truncate">
                  <Phone className={`text-blue-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{phone}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Mail className={`text-indigo-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Globe className={`text-cyan-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{website}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <MapPin className={`text-blue-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{address}</span>
                </div>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'minimal_obsidian':
        return (
          <div className={`w-full h-full bg-stone-900 text-stone-100 flex flex-col justify-between relative overflow-hidden font-serif border border-amber-900/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-stone-800 pb-1">
              <div className="min-w-0">
                <h2 className={`font-bold tracking-tight text-amber-200 truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Executive Name'}
                </h2>
                <p className={`font-sans uppercase tracking-widest text-stone-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Founder'}
                </p>
              </div>
              {renderAvatarPhoto(isThumbnail ? 'w-7 h-7 border border-amber-500/30' : 'w-14 h-14 border border-amber-500/30')}
            </div>

            {showCompanyName && companyName && (
              <div className={`font-sans text-stone-300 my-auto ${isThumbnail ? 'text-[7px]' : 'text-xs'}`}>
                <p className="font-bold text-stone-200 truncate">{companyName}</p>
              </div>
            )}

            <div className={`font-sans flex items-center justify-between gap-2 border-t border-stone-800 pt-2 text-stone-300 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-0.5' : ''}`}>
                <span className="truncate">📞 {phone}</span>
                <span className="truncate">✉️ {email}</span>
                <span className="truncate">🌐 {website}</span>
                <span className="truncate">📍 {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'modern_platinum':
        return (
          <div className={`w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-cyan-500/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between relative z-10">
              {renderLogo(isThumbnail ? 'text-cyan-400 text-[9px]' : 'text-cyan-400')}
              {showQrCode && qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl}
                  alt="QR"
                  className={`rounded bg-white p-0.5 border border-cyan-400/50 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`}
                />
              )}
            </div>

            <div className={`flex items-center relative z-10 my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 border border-cyan-400' : 'w-16 h-16 sm:w-20 sm:h-20 border-2 border-cyan-400 shadow-lg shadow-cyan-950/50')}
              <div className="min-w-0">
                <h2 className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Executive Name'}
                </h2>
                <p className={`font-semibold text-cyan-400 uppercase tracking-wide truncate ${isThumbnail ? 'text-[7px]' : 'text-xs'}`}>
                  {jobTitle || 'President'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-slate-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-[11px] mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`relative z-10 border-t border-white/10 flex items-center justify-between gap-2 pt-2 text-slate-300 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <div className="flex items-center gap-1 truncate">
                  <Phone className={`text-cyan-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{phone}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Mail className={`text-cyan-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Globe className={`text-indigo-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{website}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <MapPin className={`text-indigo-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{address}</span>
                </div>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'creative_studio':
        return (
          <div className={`w-full h-full bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-teal-500/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between">
              {renderLogo(isThumbnail ? 'text-teal-400 text-[9px]' : 'text-teal-400')}
              <span className={`font-mono text-teal-300 bg-teal-950 rounded border border-teal-500/30 ${isThumbnail ? 'text-[7px] px-1 py-0.5' : 'text-[9px] px-2 py-0.5'}`}>
                DIRECTOR
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 border border-teal-400' : 'w-16 h-16 border-2 border-teal-400')}
              <div className="min-w-0">
                <h2 className={`font-black text-white truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-lg'}`}>{fullName}</h2>
                <p className={`font-semibold text-teal-300 uppercase truncate ${isThumbnail ? 'text-[7px]' : 'text-xs'}`}>{jobTitle}</p>
                {showCompanyName && companyName && (
                  <p className={`text-slate-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-[11px] mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`flex items-center justify-between gap-2 text-slate-300 border-t border-slate-800 pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <div className="flex items-center gap-1 truncate">
                  <Phone className={`text-teal-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{phone}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Mail className={`text-teal-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <Globe className={`text-emerald-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{website}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <MapPin className={`text-teal-400 shrink-0 ${isThumbnail ? 'w-2 h-2' : 'w-3 h-3'}`} />
                  <span className="truncate">{address}</span>
                </div>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'luxury_rose':
        return (
          <div className={`w-full h-full bg-stone-950 text-rose-100 flex flex-col justify-between relative overflow-hidden font-serif border border-rose-400/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-1">
              <div className="min-w-0">
                <h2 className={`font-bold tracking-tight text-rose-200 truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>{fullName}</h2>
                <p className={`font-sans tracking-widest text-rose-400/80 uppercase truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle}
                </p>
              </div>
              {renderAvatarPhoto(isThumbnail ? 'w-7 h-7 border border-rose-400/40' : 'w-14 h-14 border border-rose-400/40')}
            </div>

            {showCompanyName && companyName && (
              <div className={`font-sans text-stone-300 my-auto ${isThumbnail ? 'text-[7px]' : 'text-xs'}`}>
                <p className="font-bold text-rose-200 truncate">{companyName}</p>
              </div>
            )}

            <div className={`font-sans flex items-center justify-between gap-2 text-rose-200/90 border-t border-rose-900/40 pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">📞 {phone}</span>
                <span className="truncate">✉️ {email}</span>
                <span className="truncate">🌐 {website}</span>
                <span className="truncate">📍 {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'cyber_dark':
        return (
          <div className={`w-full h-full bg-black text-cyan-400 flex flex-col justify-between relative overflow-hidden font-mono border-2 border-cyan-500/50 shadow-2xl ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between relative z-10">
              <span className={`text-cyan-300 bg-cyan-950 border border-cyan-500/40 rounded ${isThumbnail ? 'text-[7px] px-1' : 'text-[9px] px-2 py-0.5'}`}>
                // VIP EXEC
              </span>
              {renderLogo(isThumbnail ? 'text-cyan-400 text-[9px] font-bold' : 'text-cyan-400 font-bold')}
            </div>

            <div className={`flex items-center relative z-10 my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 border border-cyan-400' : 'w-16 h-16 border-2 border-cyan-400')}
              <div className="min-w-0">
                <h2 className={`font-bold text-white truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-lg'}`}>{fullName}</h2>
                <p className={`text-cyan-300 font-bold tracking-wider truncate ${isThumbnail ? 'text-[7px]' : 'text-xs'}`}>{jobTitle}</p>
                {showCompanyName && companyName && (
                  <p className={`text-slate-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-[10px] mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`relative z-10 flex items-center justify-between gap-2 text-slate-300 border-t border-cyan-900/50 pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">TEL: {phone}</span>
                <span className="truncate">MAIL: {email}</span>
                <span className="truncate">WEB: {website}</span>
                <span className="truncate">LOC: {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'founder_tech':
        return (
          <div className={`w-full h-full bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-violet-500/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className={`rounded-full bg-emerald-400 animate-pulse ${isThumbnail ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
                <span className={`font-mono text-slate-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>Founder</span>
              </div>
              {renderLogo(isThumbnail ? 'text-violet-400 text-[9px]' : 'text-violet-400')}
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 border border-violet-400' : 'w-16 h-16 border-2 border-violet-400')}
              <div className="min-w-0">
                <h2 className={`font-extrabold text-white truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-lg'}`}>{fullName}</h2>
                <p className={`font-semibold text-violet-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-xs'}`}>{jobTitle}</p>
                {showCompanyName && companyName && (
                  <p className={`text-slate-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-[11px] mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`flex items-center justify-between gap-2 text-slate-300 border-t border-slate-800 pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">📱 {phone}</span>
                <span className="truncate">💬 {whatsapp}</span>
                <span className="truncate">📧 {email}</span>
                <span className="truncate">🌐 {website}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'swiss_grid':
        return (
          <div className={`w-full h-full bg-zinc-950 text-white flex flex-col justify-between relative overflow-hidden font-sans border-2 border-red-600/40 ${isThumbnail ? 'p-2 sm:p-2.5 pl-3.5' : 'p-5 sm:p-6 pl-8'}`}>
            <div className="absolute left-0 top-0 bottom-0 w-2 sm:w-2.5 bg-red-600" />
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
              {renderLogo(isThumbnail ? 'text-white text-[9px] font-black tracking-tighter' : 'text-white font-black tracking-tight')}
              <span className={`font-mono text-red-500 font-bold ${isThumbnail ? 'text-[7px]' : 'text-[9px]'}`}>
                SWISS MODERN
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 rounded-none border border-red-500' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-none border-2 border-red-500 shadow-xl')}
              <div className="min-w-0">
                <h2 className={`font-black tracking-tight text-white uppercase truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-lg sm:text-2xl'}`}>
                  {fullName || 'Alexandre Dupont'}
                </h2>
                <p className={`font-bold text-red-500 tracking-wider uppercase truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Creative Architect'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-zinc-400 font-medium truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-zinc-800 flex items-center justify-between gap-2 text-zinc-300 font-mono pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">T: {phone}</span>
                <span className="truncate">E: {email}</span>
                <span className="truncate">W: {website}</span>
                <span className="truncate">L: {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'golden_crest':
        return (
          <div className={`w-full h-full bg-rose-950 text-amber-100 flex flex-col justify-between relative overflow-hidden font-serif border-2 border-amber-400/50 shadow-2xl ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute inset-1.5 border border-amber-400/25 pointer-events-none" />
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-1 relative z-10">
              {renderLogo(isThumbnail ? 'text-amber-200 text-[9px] font-serif' : 'text-amber-200 font-serif')}
              <span className={`font-serif uppercase tracking-widest text-amber-300 ${isThumbnail ? 'text-[7px]' : 'text-[9px]'}`}>
                HERITAGE EST.
              </span>
            </div>

            <div className={`flex items-center my-auto relative z-10 ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 rounded-full border border-amber-400' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 shadow-2xl')}
              <div className="min-w-0">
                <h2 className={`font-bold tracking-tight text-amber-200 truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Lord Harrison Vance'}
                </h2>
                <p className={`font-sans tracking-widest uppercase text-amber-400/90 truncate ${isThumbnail ? 'text-[6px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Managing Director'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-amber-100/70 italic truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-amber-500/20 flex items-center justify-between gap-2 text-amber-100/90 font-sans relative z-10 pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">📞 {phone}</span>
                <span className="truncate">✉️ {email}</span>
                <span className="truncate">🌐 {website}</span>
                <span className="truncate">📍 {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'carbon_stealth':
        return (
          <div className={`w-full h-full bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans border border-neutral-700 shadow-2xl ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-800/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1">
              {renderLogo(isThumbnail ? 'text-neutral-200 text-[9px] font-bold' : 'text-neutral-200 font-bold')}
              <span className={`font-mono text-neutral-400 uppercase bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 ${isThumbnail ? 'text-[6px]' : 'text-[9px]'}`}>
                STEALTH // MK-IV
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 rounded-xl border border-neutral-600' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-neutral-600 shadow-xl')}
              <div className="min-w-0">
                <h2 className={`font-black text-white tracking-tight truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Marcus Black'}
                </h2>
                <p className={`font-semibold text-neutral-400 uppercase tracking-wider truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Chief Strategy Officer'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-neutral-500 font-mono truncate ${isThumbnail ? 'text-[7px]' : 'text-[11px] mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-neutral-800 flex items-center justify-between gap-2 text-neutral-300 font-mono pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">P: {phone}</span>
                <span className="truncate">E: {email}</span>
                <span className="truncate">W: {website}</span>
                <span className="truncate">A: {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'monaco_yacht':
        return (
          <div className={`w-full h-full bg-blue-950 text-sky-100 flex flex-col justify-between relative overflow-hidden font-sans border border-sky-400/40 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-amber-300 to-blue-600" />
            <div className="flex items-center justify-between border-b border-sky-900/50 pb-1">
              {renderLogo(isThumbnail ? 'text-sky-300 text-[9px] font-bold' : 'text-sky-300 font-bold')}
              <span className={`font-mono text-amber-300 uppercase ${isThumbnail ? 'text-[7px]' : 'text-[9px]'}`}>
                RIVIERA CLUB
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 rounded-full border border-sky-400' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-sky-400 shadow-xl')}
              <div className="min-w-0">
                <h2 className={`font-extrabold text-white tracking-tight truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Capitaine Laurent'}
                </h2>
                <p className={`font-bold text-amber-300 uppercase tracking-widest truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Maritime Advisor'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-sky-300/80 truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-sky-900/50 flex items-center justify-between gap-2 text-sky-200 font-sans pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">⚓ {phone}</span>
                <span className="truncate">✉️ {email}</span>
                <span className="truncate">🌐 {website}</span>
                <span className="truncate">📍 {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'tokyo_editorial':
        return (
          <div className={`w-full h-full bg-neutral-900 text-stone-200 flex flex-col justify-between relative overflow-hidden font-sans border border-stone-600 ${isThumbnail ? 'p-2 sm:p-2.5 pl-3' : 'p-5 sm:p-6 pl-8'}`}>
            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-stone-700 hidden sm:block" />
            <div className="flex items-center justify-between border-b border-stone-800 pb-1">
              {renderLogo(isThumbnail ? 'text-stone-300 text-[9px]' : 'text-stone-300')}
              <span className={`font-mono text-stone-400 ${isThumbnail ? 'text-[6px]' : 'text-[9px]'}`}>
                TOKYO EDITION
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 rounded-xl border border-stone-500' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-stone-500 shadow-md')}
              <div className="min-w-0">
                <h2 className={`font-medium tracking-tight text-white truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Kenji Takahashi'}
                </h2>
                <p className={`font-normal text-stone-400 tracking-wide uppercase truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Design Principal'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-stone-500 truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-stone-800 flex items-center justify-between gap-2 text-stone-300 font-mono pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">Tel. {phone}</span>
                <span className="truncate">Mail. {email}</span>
                <span className="truncate">Web. {website}</span>
                <span className="truncate">Loc. {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'legal_justice':
        return (
          <div className={`w-full h-full bg-emerald-950 text-emerald-100 flex flex-col justify-between relative overflow-hidden font-serif border-2 border-amber-500/40 shadow-xl ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/60" />
            <div className="flex items-center justify-between border-b border-emerald-900 pb-1">
              {renderLogo(isThumbnail ? 'text-amber-300 text-[9px] font-serif' : 'text-amber-300 font-serif')}
              <span className={`font-serif text-amber-300 uppercase tracking-wider ${isThumbnail ? 'text-[7px]' : 'text-[9px]'}`}>
                ATTORNEY AT LAW
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 rounded-lg border border-amber-400' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-amber-400 shadow-xl')}
              <div className="min-w-0">
                <h2 className={`font-bold tracking-tight text-amber-100 truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Advocate Eleanor Ross'}
                </h2>
                <p className={`font-sans font-semibold text-emerald-300 uppercase tracking-wider truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Senior Partner & Legal Counsel'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-emerald-400/80 italic truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-emerald-900 flex items-center justify-between gap-2 text-emerald-100 font-sans pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">⚖️ {phone}</span>
                <span className="truncate">✉️ {email}</span>
                <span className="truncate">🌐 {website}</span>
                <span className="truncate">🏛️ {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'medical_pure':
        return (
          <div className={`w-full h-full bg-slate-950 text-sky-100 flex flex-col justify-between relative overflow-hidden font-sans border border-cyan-400/40 shadow-xl ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500" />
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              {renderLogo(isThumbnail ? 'text-cyan-300 text-[9px] font-bold' : 'text-cyan-300 font-bold')}
              <span className={`font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30 ${isThumbnail ? 'text-[6px]' : 'text-[9px]'}`}>
                CLINICAL MD
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 rounded-full border border-cyan-400' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-cyan-400 shadow-xl')}
              <div className="min-w-0">
                <h2 className={`font-bold tracking-tight text-white truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Dr. Sophia Bennett, MD'}
                </h2>
                <p className={`font-semibold text-cyan-300 uppercase tracking-wider truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Medical Director & Surgeon'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-slate-400 truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-slate-800 flex items-center justify-between gap-2 text-sky-200 font-sans pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">🏥 {phone}</span>
                <span className="truncate">🩺 {email}</span>
                <span className="truncate">🌐 {website}</span>
                <span className="truncate">📍 {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      case 'architect_blueprint':
        return (
          <div className={`w-full h-full bg-sky-950 text-sky-200 flex flex-col justify-between relative overflow-hidden font-mono border-2 border-blue-400/50 shadow-2xl ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-blue-800/80 pb-1">
              {renderLogo(isThumbnail ? 'text-sky-300 text-[9px] font-bold' : 'text-sky-300 font-bold')}
              <span className={`text-blue-300 bg-blue-900/60 px-1.5 py-0.5 rounded border border-blue-500/40 ${isThumbnail ? 'text-[6px]' : 'text-[8px]'}`}>
                DWG #042 // SCALE 1:1
              </span>
            </div>

            <div className={`flex items-center my-auto ${isThumbnail ? 'gap-1.5' : 'gap-4'}`}>
              {renderAvatarPhoto(isThumbnail ? 'w-8 h-8 rounded-none border border-sky-400' : 'w-16 h-16 sm:w-20 sm:h-20 rounded-none border-2 border-sky-400 shadow-xl')}
              <div className="min-w-0">
                <h2 className={`font-bold text-white uppercase tracking-wider truncate ${isThumbnail ? 'text-[10px] leading-tight' : 'text-base sm:text-xl'}`}>
                  {fullName || 'Arch. David Sterling'}
                </h2>
                <p className={`text-sky-400 font-semibold uppercase truncate ${isThumbnail ? 'text-[7px]' : 'text-xs mt-0.5'}`}>
                  {jobTitle || 'Principal Architect'}
                </p>
                {showCompanyName && companyName && (
                  <p className={`text-blue-300 truncate ${isThumbnail ? 'text-[7px]' : 'text-[11px] mt-0.5'}`}>{companyName}</p>
                )}
              </div>
            </div>

            <div className={`border-t border-blue-800/80 flex items-center justify-between gap-2 text-sky-200 pt-2 ${isThumbnail ? 'text-[7px]' : 'text-[10px] sm:text-[11px]'}`}>
              <div className={`grid grid-cols-2 gap-x-2 gap-y-1 min-w-0 flex-1 ${isThumbnail ? 'gap-1' : ''}`}>
                <span className="truncate">CAD: {phone}</span>
                <span className="truncate">MSG: {email}</span>
                <span className="truncate">URL: {website}</span>
                <span className="truncate">GEO: {address}</span>
              </div>
              {renderFrontQr(isThumbnail ? 'w-5 h-5' : 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render Back Card Template with full 16 professional unique styles
  const renderBackCardTemplate = (overrideTemplateId?: TemplateId, isThumbnail: boolean = false) => {
    const tmplToUse = overrideTemplateId || selectedTemplate;
    const {
      companyName,
      website,
      backSideTagline,
      backSideServices,
      email,
      phone,
      showQrCode,
    } = cardData;

    switch (tmplToUse) {
      case 'executive_gold':
        return (
          <div className={`w-full h-full bg-zinc-950 text-amber-100 flex flex-col justify-between relative overflow-hidden font-sans border-2 border-amber-500/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600" />
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-1">
              {renderLogo(isThumbnail ? 'text-amber-300 text-[9px]' : 'text-amber-300 font-bold')}
              <span className={`font-mono text-amber-400/80 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website || 'www.domain.com'}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-serif italic text-amber-200 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline || 'Excellence in Enterprise Solutions'}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 ${isThumbnail ? 'text-[6px] px-1 py-0.2' : 'text-[10px] px-2 py-0.5'}`}>
                    ✓ {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-amber-500/20 text-amber-200/80 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <div className="flex items-center gap-1.5">
                  <span className={`text-amber-400 uppercase ${isThumbnail ? 'text-[5px]' : 'text-[8px]'}`}>SCAN TO CONNECT</span>
                  <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
                </div>
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'corporate_navy':
        return (
          <div className={`w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-slate-800 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              {renderLogo(isThumbnail ? 'text-blue-400 text-[9px]' : 'text-blue-400 font-bold')}
              <span className={`font-mono text-slate-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-semibold text-slate-200 italic ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-slate-900 border border-slate-800 text-blue-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    ✓ {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-slate-800 text-slate-400 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'minimal_obsidian':
        return (
          <div className={`w-full h-full bg-stone-900 text-stone-100 flex flex-col justify-between relative overflow-hidden font-serif border border-amber-900/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-stone-800 pb-1">
              <span className={`text-stone-300 font-bold ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`font-mono text-stone-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-serif italic text-stone-300 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-sans rounded bg-stone-950/70 border border-stone-800 text-stone-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    • {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-stone-800 text-stone-400 font-sans ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'modern_platinum':
        return (
          <div className={`w-full h-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-cyan-500/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              {renderLogo(isThumbnail ? 'text-cyan-400 text-[9px]' : 'text-cyan-400 font-bold')}
              <span className={`font-mono text-cyan-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-semibold text-slate-200 italic ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    ⚡ {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-slate-800 text-slate-400 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <div className="p-0.5 rounded bg-cyan-400">
                  <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
                </div>
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'creative_studio':
        return (
          <div className={`w-full h-full bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-teal-500/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              {renderLogo(isThumbnail ? 'text-teal-400 text-[9px]' : 'text-teal-400 font-bold')}
              <span className={`font-mono text-teal-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-bold text-teal-300 italic ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-teal-950 border border-teal-500/30 text-teal-200 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    ✦ {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-slate-800 text-slate-400 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'luxury_rose':
        return (
          <div className={`w-full h-full bg-stone-950 text-rose-100 flex flex-col justify-between relative overflow-hidden font-serif border border-rose-400/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute inset-1.5 border border-rose-400/20 pointer-events-none" />
            <div className="flex items-center justify-between border-b border-rose-900/30 pb-1 relative z-10">
              {renderLogo(isThumbnail ? 'text-rose-300 text-[9px]' : 'text-rose-300 font-serif')}
              <span className={`font-mono text-rose-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2 relative z-10">
              <p className={`font-serif italic text-rose-200 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-sans rounded bg-rose-950/60 border border-rose-400/30 text-rose-200 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    ❖ {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-rose-900/30 text-rose-300 font-sans relative z-10 ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 border border-rose-400 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'cyber_dark':
        return (
          <div className={`w-full h-full bg-black text-cyan-400 flex flex-col justify-between relative overflow-hidden font-mono border-2 border-cyan-500/50 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-1">
              <span className={`text-cyan-300 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>// SYS_VERIFY_BACK</span>
              <span className={`text-slate-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-mono text-cyan-300 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                &gt; "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    [+] {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-cyan-900/60 text-slate-400 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <div className="p-0.5 rounded bg-cyan-500">
                  <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
                </div>
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'founder_tech':
        return (
          <div className={`w-full h-full bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans border border-violet-500/30 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-600" />
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              {renderLogo(isThumbnail ? 'text-violet-400 text-[9px]' : 'text-violet-400 font-bold')}
              <span className={`font-mono text-emerald-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>● Available For Advisory</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-bold text-slate-200 italic ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-slate-950 border border-violet-500/30 text-violet-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    🚀 {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-slate-800 text-slate-400 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <div className="flex items-center gap-1">
                  <span className={`text-violet-400 ${isThumbnail ? 'text-[5px]' : 'text-[8px]'}`}>SCAN VCARD</span>
                  <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
                </div>
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'swiss_grid':
        return (
          <div className={`w-full h-full bg-zinc-950 text-white flex flex-col justify-between relative overflow-hidden font-sans border-2 border-red-600/40 ${isThumbnail ? 'p-2 sm:p-2.5 pl-3.5' : 'p-5 sm:p-6 pl-8'}`}>
            <div className="absolute left-0 top-0 bottom-0 w-2 sm:w-2.5 bg-red-600" />
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
              <span className={`font-black text-white ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`font-mono text-red-500 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-bold uppercase tracking-tight text-white ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono font-bold rounded bg-zinc-900 border border-red-600/40 text-red-400 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    ■ {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-zinc-800 text-zinc-400 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'golden_crest':
        return (
          <div className={`w-full h-full bg-rose-950 text-amber-100 flex flex-col justify-between relative overflow-hidden font-serif border-2 border-amber-400/50 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute inset-1.5 border border-amber-400/25 pointer-events-none" />
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-1 relative z-10">
              <span className={`font-serif text-amber-200 font-bold ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`font-serif text-amber-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2 relative z-10">
              <p className={`font-serif italic text-amber-200 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-serif rounded bg-rose-900/60 border border-amber-400/40 text-amber-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    👑 {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-amber-500/20 text-amber-300 font-sans relative z-10 ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <div className="p-0.5 rounded bg-amber-400">
                  <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
                </div>
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'carbon_stealth':
        return (
          <div className={`w-full h-full bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans border border-neutral-700 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1">
              <span className={`font-bold text-neutral-200 ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`font-mono text-neutral-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-semibold text-neutral-300 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-neutral-900 border border-neutral-800 text-neutral-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    • {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-neutral-800 text-neutral-400 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 border border-neutral-700 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'monaco_yacht':
        return (
          <div className={`w-full h-full bg-blue-950 text-sky-100 flex flex-col justify-between relative overflow-hidden font-sans border border-sky-400/40 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-amber-300 to-blue-600" />
            <div className="flex items-center justify-between border-b border-sky-900/50 pb-1">
              <span className={`font-bold text-sky-200 ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`font-mono text-amber-300 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>PORT DE MONACO</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-semibold italic text-sky-200 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-sans rounded bg-blue-900/60 border border-sky-400/30 text-sky-200 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    ⚓ {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-sky-900/50 text-sky-300 font-sans ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 border border-sky-400 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'tokyo_editorial':
        return (
          <div className={`w-full h-full bg-neutral-900 text-stone-200 flex flex-col justify-between relative overflow-hidden font-sans border border-stone-600 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-stone-800 pb-1">
              <span className={`font-medium text-stone-300 ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`font-mono text-stone-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>{website}</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-normal text-stone-300 italic ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-neutral-950 border border-stone-700 text-stone-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-stone-800 text-stone-400 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'legal_justice':
        return (
          <div className={`w-full h-full bg-emerald-950 text-emerald-100 flex flex-col justify-between relative overflow-hidden font-serif border-2 border-amber-500/40 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/60" />
            <div className="flex items-center justify-between border-b border-emerald-900 pb-1">
              <span className={`font-serif text-amber-200 font-bold ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`font-serif text-amber-400 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>BAR COUNCIL REGISTERED</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-serif italic text-amber-100 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-serif rounded bg-emerald-900/60 border border-amber-500/40 text-amber-200 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    ⚖️ {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-emerald-900 text-emerald-200 font-sans ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <div className="p-0.5 rounded bg-amber-500">
                  <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
                </div>
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'medical_pure':
        return (
          <div className={`w-full h-full bg-slate-950 text-sky-100 flex flex-col justify-between relative overflow-hidden font-sans border border-cyan-400/40 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500" />
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className={`font-bold text-white ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`font-mono text-cyan-300 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>EMERGENCY 24/7</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-semibold italic text-cyan-100 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    🩺 {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-slate-800 text-sky-300 font-sans ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 border border-cyan-400 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      case 'architect_blueprint':
        return (
          <div className={`w-full h-full bg-sky-950 text-sky-200 flex flex-col justify-between relative overflow-hidden font-mono border-2 border-blue-400/50 ${isThumbnail ? 'p-2 sm:p-2.5' : 'p-5 sm:p-6'}`}>
            <div className="flex items-center justify-between border-b border-blue-800/80 pb-1">
              <span className={`font-bold text-white ${isThumbnail ? 'text-[8px]' : 'text-xs'}`}>{companyName}</span>
              <span className={`text-blue-300 ${isThumbnail ? 'text-[7px]' : 'text-[10px]'}`}>DWG REVISION C</span>
            </div>

            <div className="my-auto text-center px-2">
              <p className={`font-mono uppercase text-sky-200 ${isThumbnail ? 'text-[8px]' : 'text-xs sm:text-sm'}`}>
                "{backSideTagline}"
              </p>
              <div className={`flex flex-wrap justify-center ${isThumbnail ? 'gap-1 mt-1' : 'gap-1.5 mt-3'}`}>
                {backSideServices.map((service, i) => (
                  <span key={i} className={`font-mono rounded bg-blue-950 border border-blue-400/40 text-sky-300 ${isThumbnail ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'}`}>
                    [#] {service}
                  </span>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-blue-800/80 text-sky-300 font-mono ${isThumbnail ? 'pt-1 text-[7px]' : 'pt-2 text-[10px]'}`}>
              <span>{phone}</span>
              {showQrCode && qrCodeDataUrl && (
                <div className="p-0.5 rounded bg-blue-400">
                  <img src={qrCodeDataUrl} alt="QR Code" className={`rounded bg-white p-0.5 ${isThumbnail ? 'w-5 h-5' : 'w-8 h-8'}`} />
                </div>
              )}
              <span>{email}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Live Card Preview Canvas Box Component
  const renderLivePreviewCard = () => {
    return (
      <div className="rounded-3xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Live Card Preview</span>
          </h4>

          {sideMode === '2-side' && (
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setActivePreviewSide('front')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activePreviewSide === 'front'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Front Side
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewSide('back')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activePreviewSide === 'back'
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Back Side
              </button>
            </div>
          )}
        </div>

        {/* Scaled Card Container */}
        <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 flex items-center justify-center min-h-[260px] overflow-hidden">
          <div className="w-full max-w-[420px] aspect-[1.75/1] relative shadow-2xl rounded-xl overflow-hidden">
            {/* Front Card Element */}
            <div
              ref={frontCardRef}
              className={`w-full h-full ${
                sideMode === '2-side' && activePreviewSide === 'back' ? 'hidden' : 'block'
              }`}
            >
              {renderFrontCardTemplate()}
            </div>

            {/* Back Card Element */}
            {sideMode === '2-side' && (
              <div
                ref={backCardRef}
                className={`w-full h-full ${
                  activePreviewSide === 'back' ? 'block' : 'hidden'
                }`}
              >
                {renderBackCardTemplate()}
              </div>
            )}
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>3.5" x 2.0" Standard Print Dimensions (300 DPI)</span>
        </div>
      </div>
    );
  };

  // Direct High-Definition Download / Export Panel
  const renderExportPanel = () => {
    return (
      <div className="rounded-3xl glass-card border border-amber-500/30 bg-slate-900/90 p-5 space-y-4 shadow-2xl">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-100 font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
          <Download className="w-4 h-4 text-amber-400" />
          <span>Download Visiting Card</span>
        </h4>

        <div className="space-y-2.5">
          <Button
            variant="primary"
            size="md"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-extrabold shadow-lg cursor-pointer"
            onClick={handleExportPDF}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {sideMode === '2-side' ? 'Download 2-Side Print PDF' : 'Download Print PDF (3.5" x 2.0")'}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleExportPNG('front')}
              isLoading={isExporting}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="cursor-pointer"
            >
              Front PNG (HD)
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => handleExportJPG('front')}
              isLoading={isExporting}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="cursor-pointer"
            >
              Front JPG (HD)
            </Button>
          </div>

          {sideMode === '2-side' && (
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleExportPNG('back')}
                isLoading={isExporting}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="cursor-pointer"
              >
                Back PNG (HD)
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => handleExportJPG('back')}
                isLoading={isExporting}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="cursor-pointer"
              >
                Back JPG (HD)
              </Button>
            </div>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Instant 300 DPI Local Export</span>
        </div>
      </div>
    );
  };

  // Render Pop-up Modal Window for 16 Professional Templates
  const renderTemplateModal = () => {
    if (!isTemplateModalOpen) return null;

    const filteredTemplates = TEMPLATE_OPTIONS.filter((t) => {
      const matchesCategory =
        templateCategoryFilter === 'all' || t.category === templateCategoryFilter;
      const matchesSearch =
        templateSearchQuery.trim() === '' ||
        t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
        t.badge.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(templateSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div
        id="template-selection-modal"
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsTemplateModalOpen(false);
        }}
      >
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-100">
                    Card Template Gallery
                  </h3>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    16 Unique Designs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any template to select and preview in real time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {sideMode === '2-side' && (
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setTemplateModalSide('front')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      templateModalSide === 'front'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Front View
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateModalSide('back')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      templateModalSide === 'back'
                        ? 'bg-indigo-500 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Back View
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="p-4 sm:px-6 bg-slate-950/90 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                placeholder="Search templates (e.g. Gold, Riviera)..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400 transition-colors"
              />
              {templateSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTemplateSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {[
                { id: 'all', label: 'All (16)' },
                { id: 'executive', label: 'Executive (4)' },
                { id: 'corporate', label: 'Corporate (4)' },
                { id: 'tech', label: 'Tech & Founder (4)' },
                { id: 'creative', label: 'Creative (4)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTemplateCategoryFilter(tab.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    templateCategoryFilter === tab.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-400 bg-slate-900/60 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Grid of Templates */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[62vh]">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm font-mono text-slate-400">
                  No templates match "{templateSearchQuery}"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTemplateSearchQuery('');
                    setTemplateCategoryFilter('all');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-amber-400 font-mono cursor-pointer"
                >
                  Reset search & filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplate(tmpl.id);
                        addToast('Template Selected', `${tmpl.name} applied to card preview`, 'info');
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-3 relative overflow-hidden group ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 shadow-xl shadow-amber-950/40 ring-2 ring-amber-400/30'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-600 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-100 truncate">
                            {tmpl.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 capitalize">
                            {tmpl.category} • {tmpl.badge}
                          </span>
                        </div>
                        {isSelected ? (
                          <div className="flex items-center gap-1 text-amber-400 text-[11px] font-mono font-bold shrink-0 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-300 transition-colors">
                            Select →
                          </span>
                        )}
                      </div>

                      {/* Visual Mini Preview */}
                      <div className="w-full">
                        {renderMiniTemplatePreview(tmpl.id, templateModalSide)}
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="text-slate-500">Selected Template:</span>
              <span className="text-amber-400 font-bold">
                {TEMPLATE_OPTIONS.find((t) => t.id === selectedTemplate)?.name}
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsTemplateModalOpen(false)}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Apply & Close Gallery
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Template Selection Popup Modal */}
      {renderTemplateModal()}

      {/* Step Navigation Progress Header (Wizard steps 1 to 3) */}
      <div className="space-y-6">
          {/* Progress Bar Header */}
          <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
              {/* Format Toggle Directly In Header */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSideMode('1-side');
                    addToast('Format Changed', 'Single-sided card format active', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    sideMode === '1-side'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1-Side
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSideMode('2-side');
                    addToast('Format Changed', 'Double-sided card format active', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    sideMode === '2-side'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2-Side
                </button>
              </div>

              <div className="h-4 w-[1px] bg-slate-800 hidden sm:block shrink-0" />

              {/* Step Indicators */}
              {[
                { step: 1, label: '1. Templates' },
                { step: 2, label: '2. Photo & Logo' },
                { step: 3, label: '3. Details & Download' },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => goToStep(s.step)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    wizardStep === s.step
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                      : wizardStep > s.step
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {wizardStep > s.step && <Check className="w-3.5 h-3.5" />}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setCardData(DEFAULT_CARD_DATA);
                setSelectedTemplate('executive_gold');
                addToast('Reset', 'Card restored to default sample data', 'info');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 cursor-pointer ml-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* ================= STEP 1: CHOOSE TEMPLATE (FULL VISITING CARD FORMAT) ================= */}
          {wizardStep === 1 && (() => {
            const currentTmpl =
              TEMPLATE_OPTIONS.find((t) => t.id === selectedTemplate) || TEMPLATE_OPTIONS[0];

            return (
              <div className="space-y-6">
                {/* Step 1 Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-slate-800 bg-slate-900/90 shadow-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        Step 1 of 3
                      </span>
                      <h2 className="text-base sm:text-lg font-extrabold text-white">
                        Choose Your Visiting Card Template
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Pick any of the 16 unique styles. The full visiting card format is displayed live below.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsTemplateModalOpen(true)}
                    leftIcon={<LayoutGrid className="w-4 h-4" />}
                    className="shrink-0"
                  >
                    Browse All 16 Templates (Popup)
                  </Button>
                </div>

                {/* Hero Full Visiting Card Display Box */}
                <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                        Active Design: {currentTmpl.name}
                      </span>
                      <p className="text-xs text-slate-400">
                        {currentTmpl.category.toUpperCase()} • {currentTmpl.badge} — {currentTmpl.description}
                      </p>
                    </div>

                    {sideMode === '2-side' && (
                      <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => setActivePreviewSide('front')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            activePreviewSide === 'front'
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Front Side
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePreviewSide('back')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            activePreviewSide === 'back'
                              ? 'bg-indigo-500 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Back Side
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Centered Big Business Card (100% full visiting card format) */}
                  <div className="flex justify-center items-center py-3">
                    <div className="w-full max-w-[560px] aspect-[1.75/1] relative shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-700 ring-4 ring-black/40">
                      <div
                        ref={frontCardRef}
                        className={`w-full h-full ${
                          sideMode === '2-side' && activePreviewSide === 'back' ? 'hidden' : 'block'
                        }`}
                      >
                        {renderFrontCardTemplate()}
                      </div>

                      {sideMode === '2-side' && (
                        <div
                          ref={backCardRef}
                          className={`w-full h-full ${
                            activePreviewSide === 'back' ? 'block' : 'hidden'
                          }`}
                        >
                          {renderBackCardTemplate()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Complete Visiting Card Format (3.5" × 2.0" Standard @ 300 DPI)</span>
                  </div>
                </div>

                {/* 16-Template Quick Picker Grid */}
                <div className="p-5 rounded-2xl glass-card border border-slate-800 bg-slate-900/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Select From 16 Unique Designs</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsTemplateModalOpen(true)}
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1"
                    >
                      <span>Open Filtered Modal</span>
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                    {TEMPLATE_OPTIONS.map((tmpl) => {
                      const isSelected = selectedTemplate === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => {
                            setSelectedTemplate(tmpl.id);
                            addToast('Template Selected', `${tmpl.name} applied`, 'info');
                          }}
                          className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between aspect-[1.35/1] relative overflow-hidden group ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40 text-amber-200 shadow-md'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-[11px] font-bold truncate block group-hover:text-amber-300">
                            {tmpl.name}
                          </span>
                          <div className="flex items-center justify-between mt-auto pt-1">
                            <span className="text-[9px] font-mono opacity-70 uppercase truncate">
                              {tmpl.badge}
                            </span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Step 1 Action */}
                <div className="p-5 rounded-2xl glass-card border border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-300 font-mono text-center sm:text-left">
                    Ready to customize photo, logo, and contact info for <span className="text-amber-300 font-bold">{currentTmpl.name}</span>?
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => goToStep(2)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Next Step: Photo & Logo (Step 2) →
                  </Button>
                </div>
              </div>
            );
          })()}

          {/* ================= STEPS 2 & 3: 2-COLUMN STUDIO (SIDE-BY-SIDE) ================= */}
          {wizardStep > 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Step 2 or Step 3 Controls */}
              <div className="lg:col-span-7 space-y-4">
                {/* STEP 2: UPLOAD PHOTO & LOGO */}
              {wizardStep === 2 && (
                <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Step 2: Profile Photo & Company Logo</span>
                    </h3>
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-slate-300 font-bold">
                        Profile Photo / Headshot
                      </label>
                      <label className="flex items-center gap-2 text-xs font-mono text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cardData.showPhoto}
                          onChange={(e) => setCardData({ ...cardData, showPhoto: e.target.checked })}
                          className="accent-amber-400 cursor-pointer"
                        />
                        <span>Show Photo</span>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {renderAvatarPhoto('w-20 h-20')}

                      <div className="flex-1 space-y-2 w-full">
                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-all">
                          <Upload className="w-4 h-4" />
                          <span>{cardData.photoUrl ? 'Change Photo' : 'Upload Headshot'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        {cardData.photoUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setCardData({
                                ...cardData,
                                photoUrl: null,
                                photoZoom: 1,
                              })
                            }
                            className="text-[11px] text-rose-400 hover:text-rose-300 underline font-mono block mx-auto sm:mx-0"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Zoom Control Slider (chotoboro) */}
                    {cardData.showPhoto && (
                      <div className="space-y-3 pt-3 border-t border-slate-800">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">Photo Zoom (Size):</span>
                            <span className="text-amber-400 font-bold">{Math.round(cardData.photoZoom * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.05"
                            value={cardData.photoZoom}
                            onChange={(e) =>
                              setCardData({ ...cardData, photoZoom: parseFloat(e.target.value) })
                            }
                            className="w-full accent-amber-400 cursor-pointer"
                          />
                        </div>

                        {/* Photo Shape */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-slate-400 block">Frame Shape</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'circle', label: 'Circle' },
                              { id: 'rounded', label: 'Rounded' },
                              { id: 'square', label: 'Square' },
                            ].map((shape) => (
                              <button
                                key={shape.id}
                                type="button"
                                onClick={() => setCardData({ ...cardData, photoFrame: shape.id as any })}
                                className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                                  cardData.photoFrame === shape.id
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {shape.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Company Logo Upload */}
                  <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="text-xs font-mono text-slate-300 font-bold block">
                      Company Logo (PNG / SVG)
                    </label>

                    <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900 border border-dashed border-slate-700 text-slate-300 text-xs cursor-pointer hover:border-amber-400/50 hover:text-white transition-all">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>{cardData.logoUrl ? 'Replace Company Logo' : 'Upload PNG / SVG Logo'}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => goToStep(1)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back: Templates
                    </Button>

                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => goToStep(3)}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Next: Fill Card Details & Download
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: CARD DETAILS */}
              {wizardStep === 3 && (
                <div className="rounded-2xl glass-card border border-slate-800 bg-slate-900/90 p-5 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      <span>Step 3: Executive Information</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={cardData.fullName}
                          onChange={(e) => setCardData({ ...cardData, fullName: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400"
                          placeholder="e.g. Alexander Wright"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                          Job Title / Position *
                        </label>
                        <input
                          type="text"
                          value={cardData.jobTitle}
                          onChange={(e) => setCardData({ ...cardData, jobTitle: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400"
                          placeholder="e.g. Chief Executive Officer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={cardData.companyName}
                          onChange={(e) => setCardData({ ...cardData, companyName: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400"
                          placeholder="e.g. Ahadex Global"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                          Direct Phone
                        </label>
                        <input
                          type="text"
                          value={cardData.phone}
                          onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400"
                          placeholder="+1 (555) 234-5678"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                          Executive Email
                        </label>
                        <input
                          type="email"
                          value={cardData.email}
                          onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400"
                          placeholder="alexander@ahadex.fun"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                          Website Domain
                        </label>
                        <input
                          type="text"
                          value={cardData.website}
                          onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400"
                          placeholder="www.ahadex.fun"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                        Office Location / Address
                      </label>
                      <input
                        type="text"
                        value={cardData.address}
                        onChange={(e) => setCardData({ ...cardData, address: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-400"
                        placeholder="Silicon Valley, CA"
                      />
                    </div>

                    {/* Back Side Info Fields if 2-Side mode */}
                    {sideMode === '2-side' && (
                      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 pt-3">
                        <label className="block text-xs font-mono text-indigo-300 font-bold">
                          Back Side Corporate Tagline
                        </label>
                        <input
                          type="text"
                          value={cardData.backSideTagline}
                          onChange={(e) => setCardData({ ...cardData, backSideTagline: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs text-slate-200 outline-none focus:border-indigo-400"
                          placeholder="e.g. Excellence in Enterprise Solutions"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => goToStep(2)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back: Photo & Logo
                    </Button>

                    <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Ready to Download (See Right Panel)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Persistent Live Preview + Step 3 Only Download Panel */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              {renderLivePreviewCard()}

              {wizardStep === 3 ? (
                renderExportPanel()
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center space-y-2.5">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Real-time Card Preview (Step {wizardStep} of 3)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Step {wizardStep} focuses on card design preview. High-resolution 300 DPI download buttons (PNG, JPG, PDF) will unlock on Step 3.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(3)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="w-full text-xs cursor-pointer"
                  >
                    Next: Final Details & Download (Step 3)
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      {/* Dedicated High-Res Export Canvas (1050x600 px = 3.5" x 2.0" @ 300DPI) */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '1050px',
          height: '1300px',
          zIndex: -99999,
          pointerEvents: 'none',
          visibility: 'visible',
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <div
          ref={exportFrontRef}
          style={{ width: '1050px', height: '600px', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden' }}
        >
          {renderFrontCardTemplate()}
        </div>
        <div
          ref={exportBackRef}
          style={{ width: '1050px', height: '600px', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden', marginTop: '20px' }}
        >
          {renderBackCardTemplate()}
        </div>
      </div>
    </div>
  );
};
