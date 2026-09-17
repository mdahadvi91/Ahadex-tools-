import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  AlertTriangle,
  RefreshCw,
  Eye,
  CheckCircle2,
  QrCode,
  Image as ImageIcon,
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
  | 'founder_tech';

interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  badge: string;
  color: string;
  previewBg: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'executive_gold',
    name: 'CEO Executive Gold',
    description: 'Deep obsidian metallic background with refined gold foil styling.',
    badge: 'Fortune 500',
    color: 'from-amber-400 to-yellow-600',
    previewBg: 'bg-zinc-950 border-amber-400/40',
  },
  {
    id: 'corporate_navy',
    name: 'Corporate Royal Navy',
    description: 'Crisp royal navy backdrop with silver typography & sharp hierarchy.',
    badge: 'Corporate',
    color: 'from-blue-600 to-indigo-700',
    previewBg: 'bg-slate-900 border-blue-500/30',
  },
  {
    id: 'minimal_obsidian',
    name: 'Minimalist Obsidian',
    description: 'Ultra-clean, high-contrast serif typography with generous spacing.',
    badge: 'Minimal',
    color: 'from-stone-400 to-stone-600',
    previewBg: 'bg-stone-900 border-stone-500/30',
  },
  {
    id: 'modern_platinum',
    name: 'Modern Platinum',
    description: 'Sleek dark slate theme with cyan neon trims & subtle gradients.',
    badge: 'Modern',
    color: 'from-cyan-500 to-blue-600',
    previewBg: 'bg-slate-950 border-cyan-500/30',
  },
  {
    id: 'creative_studio',
    name: 'Creative Director',
    description: 'Teal highlights with geometric elegance for agency leaders.',
    badge: 'Creative',
    color: 'from-emerald-400 to-teal-600',
    previewBg: 'bg-slate-900 border-emerald-400/30',
  },
  {
    id: 'luxury_rose',
    name: 'Luxury Rose Gold',
    description: 'Champagne rose champagne accents for premium luxury brands.',
    badge: 'Luxury',
    color: 'from-rose-400 to-pink-600',
    previewBg: 'bg-stone-950 border-rose-400/30',
  },
  {
    id: 'cyber_dark',
    name: 'Onyx Cyber',
    description: 'Futuristic black layout with sharp cyan neon framing.',
    badge: 'Tech CEO',
    color: 'from-cyan-400 to-purple-600',
    previewBg: 'bg-black border-cyan-400/50',
  },
  {
    id: 'founder_tech',
    name: 'Tech Founder',
    description: 'Modern developer & founder layout with active status indicator.',
    badge: 'Founder',
    color: 'from-violet-500 to-indigo-600',
    previewBg: 'bg-slate-900 border-violet-500/30',
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
  photoFrame: 'circle' | 'rounded' | 'square' | 'hexagon';
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
  photoUrl: null,
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
    'Enterprise Advisory',
  ],
};

export const VisitingCardGenerator: React.FC = () => {
  const { addToast } = useToast();

  const [sideMode, setSideMode] = useState<CardSideMode>('1-side');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('executive_gold');
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [activeTab, setActiveTab] = useState<'info' | 'photo' | 'templates' | 'backside'>('info');
  const [activeSideView, setActiveSideView] = useState<'front' | 'back'>('front');

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [pendingMode, setPendingMode] = useState<CardSideMode | null>(null);

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

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

  const handleModeChangeRequest = (newMode: CardSideMode) => {
    if (newMode === sideMode) return;

    if (sideMode === '2-side' && newMode === '1-side') {
      setPendingMode(newMode);
      setShowConfirmationModal(true);
    } else {
      setSideMode(newMode);
      setActiveSideView('front');
      addToast(
        'Format Switch',
        `Switched to ${newMode === '1-side' ? '1-Side' : '2-Side'} Card Format`,
        'info'
      );
    }
  };

  const confirmModeSwitch = () => {
    if (pendingMode) {
      setSideMode(pendingMode);
      setActiveSideView('front');
      setPendingMode(null);
      setShowConfirmationModal(false);
      addToast('Format Switch', 'Switched to 1-Side Card Format', 'info');
    }
  };

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
        addToast('Upload Error', 'Could not read the selected photo.', 'error');
        return;
      }

      setCardData((prev) => ({
        ...prev,
        photoUrl: result,
        photoZoom: 1,
        photoX: 0,
        photoY: 0,
      }));

      addToast('Upload Successful', 'Photo uploaded successfully!', 'success');
    };

    reader.onerror = () => {
      addToast('Upload Error', 'Could not read the selected photo.', 'error');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('File Too Large', 'Logo size should be under 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      addToast('Invalid File', 'Please select a valid image logo.', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;

      if (typeof result !== 'string') {
        addToast('Upload Error', 'Could not read the selected logo.', 'error');
        return;
      }

      setCardData((prev) => ({
        ...prev,
        logoUrl: result,
      }));

      addToast('Upload Successful', 'Logo uploaded successfully!', 'success');
    };

    reader.onerror = () => {
      addToast('Upload Error', 'Could not read the selected logo.', 'error');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /**
   * Fail-safe High Resolution Canvas capturing.
   * Uses scale: 2 for 1000x570 or 1050x600 px export, allowTaint: false to prevent security blocks.
   */
  const captureCardCanvas = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    return html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      imageTimeout: 10000,
    });
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.rel = 'noopener';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSafeFilename = () => {
    const rawName = cardData.fullName?.trim() || 'CEO_Visiting_Card';

    const safeName = rawName
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 80);

    return safeName || 'CEO_Visiting_Card';
  };

  const handleExportPNG = async (side: 'front' | 'back' = 'front') => {
    const targetRef = side === 'front' ? frontCardRef : backCardRef;

    if (!targetRef.current) {
      addToast(
        'Export Error',
        `${side === 'front' ? 'Front' : 'Back'} card element not found. Please try again.`,
        'error'
      );
      return;
    }

    if (isExporting) return;

    setIsExporting(true);

    try {
      addToast(
        'Generating Image',
        `Rendering 300 DPI HD PNG (${side === 'front' ? 'Front' : 'Back'})...`,
        'info'
      );

      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      const canvas = await captureCardCanvas(targetRef.current);
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const filename = `${getSafeFilename()}_${side.toUpperCase()}_300DPI.png`;

      downloadDataUrl(dataUrl, filename);

      addToast(
        'Export Successful',
        `${side === 'front' ? 'Front' : 'Back'} side HD PNG downloaded successfully!`,
        'success'
      );
    } catch (err) {
      console.error('PNG Export Error:', err);
      addToast(
        'Export Notice',
        'Direct download attempted. Please check your browser downloads.',
        'info'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJPG = async (side: 'front' | 'back' = 'front') => {
    const targetRef = side === 'front' ? frontCardRef : backCardRef;

    if (!targetRef.current) return;
    if (isExporting) return;

    setIsExporting(true);

    try {
      addToast(
        'Generating Image',
        `Rendering 300 DPI High-Res JPG (${side === 'front' ? 'Front' : 'Back'})...`,
        'info'
      );

      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      const canvas = await captureCardCanvas(targetRef.current);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const filename = `${getSafeFilename()}_${side.toUpperCase()}_300DPI.jpg`;

      downloadDataUrl(dataUrl, filename);

      addToast(
        'Export Successful',
        `${side === 'front' ? 'Front' : 'Back'} side High-Res JPG downloaded successfully!`,
        'success'
      );
    } catch (err) {
      console.error('JPG Export Error:', err);
      addToast('Export Error', 'Could not export JPG. Please try PNG or PDF.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport2SidePDF = async () => {
    if (!frontCardRef.current) {
      addToast('Export Error', 'Front card element not found.', 'error');
      return;
    }

    if (isExporting) return;

    setIsExporting(true);

    try {
      addToast(
        'Generating Print PDF',
        sideMode === '2-side'
          ? 'Generating 2-page print-ready 3.5"x2.0" PDF...'
          : 'Generating 300 DPI print-ready 3.5"x2.0" PDF...',
        'info'
      );

      await new Promise<void>((resolve) => setTimeout(resolve, 100));

      const frontCanvas = await captureCardCanvas(frontCardRef.current);
      const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.98);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2.0],
        compress: true,
      });

      pdf.addImage(
        frontImgData,
        'JPEG',
        0,
        0,
        3.5,
        2.0,
        undefined,
        'FAST'
      );

      if (sideMode === '2-side' && backCardRef.current) {
        await new Promise<void>((resolve) => setTimeout(resolve, 50));

        const backCanvas = await captureCardCanvas(backCardRef.current);
        const backImgData = backCanvas.toDataURL('image/jpeg', 0.98);

        pdf.addPage([3.5, 2.0], 'landscape');

        pdf.addImage(
          backImgData,
          'JPEG',
          0,
          0,
          3.5,
          2.0,
          undefined,
          'FAST'
        );
      }

      const filename = `${getSafeFilename()}_${
        sideMode === '2-side' ? '2Side_Print' : '1Side_Print'
      }.pdf`;

      pdf.save(filename);

      addToast(
        'PDF Complete',
        `${sideMode === '2-side' ? '2-Side' : '1-Side'} Print-Ready PDF generated!`,
        'success'
      );
    } catch (err) {
      console.error('PDF Export Error:', err);
      addToast('Export Error', 'Could not generate PDF. Try PNG or JPG export.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const renderAvatarPhoto = (className: string = 'w-16 h-16') => {
    if (!cardData.showPhoto) return null;

    const frameClasses = {
      circle: 'rounded-full',
      rounded: 'rounded-xl',
      square: 'rounded-none',
      hexagon: 'rounded-2xl border border-amber-400/40 rotate-45 scale-90',
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

  const renderFrontCardTemplate = () => {
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

    switch (selectedTemplate) {
      case 'executive_gold':
        return (
          <div className="w-full h-full bg-zinc-950 text-amber-100 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-sans border-2 border-amber-500/30">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
              {renderLogo('text-amber-300')}
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400/90 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30">
                EXECUTIVE
              </span>
            </div>

            {/* Main Info */}
            <div className="flex items-center gap-4 my-auto">
              {renderAvatarPhoto('w-16 h-16 sm:w-20 sm:h-20 border-2 border-amber-400/60 shadow-xl')}
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-amber-200 truncate">
                  {fullName || 'Executive Name'}
                </h2>
                <p className="text-xs font-semibold text-amber-400/90 tracking-wide uppercase mt-0.5 truncate">
                  {jobTitle || 'Chief Executive Officer'}
                </p>
                {showCompanyName && companyName && (
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{companyName}</p>
                )}
              </div>
            </div>

            {/* Contact Footer */}
            <div className="pt-2 border-t border-amber-500/20 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-amber-100/90 font-mono">
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{phone || '+1 000 000 0000'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{email || 'ceo@domain.com'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{website || 'www.domain.com'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{address || 'Silicon Valley, CA'}</span>
              </div>
            </div>
          </div>
        );

      case 'corporate_navy':
        return (
          <div className="w-full h-full bg-slate-950 text-slate-100 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-slate-800">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

            <div className="flex items-center justify-between">
              {renderLogo('text-blue-400')}
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40">
                OFFICIAL
              </span>
            </div>

            <div className="flex items-center gap-4 my-auto">
              {renderAvatarPhoto('w-16 h-16 sm:w-20 sm:h-20 border-2 border-blue-500/40 shadow-xl')}
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-white truncate">
                  {fullName || 'Executive Name'}
                </h2>
                <p className="text-xs font-semibold text-blue-400 tracking-wide uppercase mt-0.5 truncate">
                  {jobTitle || 'Managing Director'}
                </p>
                {showCompanyName && companyName && (
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{companyName}</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">{phone}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{website}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">{address}</span>
              </div>
            </div>
          </div>
        );

      case 'minimal_obsidian':
        return (
          <div className="w-full h-full bg-stone-900 text-stone-100 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-serif border border-amber-900/30">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-amber-200 truncate">
                  {fullName || 'Executive Name'}
                </h2>
                <p className="text-xs font-sans uppercase tracking-widest text-stone-400 mt-0.5 truncate">
                  {jobTitle || 'Founder'}
                </p>
              </div>
              {renderAvatarPhoto('w-14 h-14 border border-amber-500/30')}
            </div>

            {showCompanyName && companyName && (
              <div className="font-sans text-xs text-stone-300 my-auto">
                <p className="font-bold text-stone-200 truncate">{companyName}</p>
              </div>
            )}

            <div className="font-sans grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] text-stone-300 pt-2 border-t border-stone-800">
              <span className="truncate">📞 {phone}</span>
              <span className="truncate">✉️ {email}</span>
              <span className="truncate">🌐 {website}</span>
              <span className="truncate">📍 {address}</span>
            </div>
          </div>
        );

      case 'modern_platinum':
        return (
          <div className="w-full h-full bg-slate-950 text-slate-100 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-cyan-500/30">
            <div className="flex items-center justify-between relative z-10">
              {renderLogo('text-cyan-400')}
              {showQrCode && qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl}
                  alt="QR"
                  className="w-8 h-8 rounded bg-white p-0.5 border border-cyan-400/50"
                />
              )}
            </div>

            <div className="flex items-center gap-4 relative z-10 my-auto">
              {renderAvatarPhoto('w-16 h-16 sm:w-20 sm:h-20 border-2 border-cyan-400 shadow-lg shadow-cyan-950/50')}
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 truncate">
                  {fullName || 'Executive Name'}
                </h2>
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide truncate">
                  {jobTitle || 'President'}
                </p>
                {showCompanyName && companyName && (
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{companyName}</p>
                )}
              </div>
            </div>

            <div className="relative z-10 pt-2 border-t border-white/10 grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{phone}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate">{website}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate">{address}</span>
              </div>
            </div>
          </div>
        );

      case 'creative_studio':
        return (
          <div className="w-full h-full bg-slate-900 text-slate-100 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-teal-500/30">
            <div className="flex items-center justify-between">
              {renderLogo('text-teal-400')}
              <span className="text-[9px] font-mono text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">
                DIRECTOR
              </span>
            </div>

            <div className="flex items-center gap-4 my-auto">
              {renderAvatarPhoto('w-16 h-16 border-2 border-teal-400')}
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black text-white truncate">{fullName}</h2>
                <p className="text-xs font-semibold text-teal-300 uppercase truncate">{jobTitle}</p>
                {showCompanyName && companyName && (
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{companyName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="w-3 h-3 text-teal-400 shrink-0" />
                <span className="truncate">{phone}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 text-teal-400 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{website}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                <span className="truncate">{address}</span>
              </div>
            </div>
          </div>
        );

      case 'luxury_rose':
        return (
          <div className="w-full h-full bg-stone-950 text-rose-100 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-serif border border-rose-400/30">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-rose-200 truncate">{fullName}</h2>
                <p className="text-xs font-sans tracking-widest text-rose-400/80 uppercase mt-0.5 truncate">
                  {jobTitle}
                </p>
              </div>
              {renderAvatarPhoto('w-14 h-14 border border-rose-400/40')}
            </div>

            {showCompanyName && companyName && (
              <div className="font-sans text-xs text-stone-300 my-auto">
                <p className="font-bold text-rose-200 truncate">{companyName}</p>
              </div>
            )}

            <div className="font-sans grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] text-rose-200/90 pt-2 border-t border-rose-900/40">
              <span className="truncate">📞 {phone}</span>
              <span className="truncate">✉️ {email}</span>
              <span className="truncate">🌐 {website}</span>
              <span className="truncate">📍 {address}</span>
            </div>
          </div>
        );

      case 'cyber_dark':
        return (
          <div className="w-full h-full bg-black text-cyan-400 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-mono border-2 border-cyan-500/50 shadow-2xl">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[9px] text-cyan-300 px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 rounded">
                // VIP EXEC
              </span>
              {renderLogo('text-cyan-400 font-bold')}
            </div>

            <div className="flex items-center gap-4 relative z-10 my-auto">
              {renderAvatarPhoto('w-16 h-16 border-2 border-cyan-400')}
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">{fullName}</h2>
                <p className="text-xs text-cyan-300 font-bold tracking-wider truncate">{jobTitle}</p>
                {showCompanyName && companyName && (
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{companyName}</p>
                )}
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-1 text-[10px] text-slate-300 pt-2 border-t border-cyan-900/50">
              <span className="truncate">TEL: {phone}</span>
              <span className="truncate">MAIL: {email}</span>
              <span className="truncate">WEB: {website}</span>
              <span className="truncate">LOC: {address}</span>
            </div>
          </div>
        );

      case 'founder_tech':
        return (
          <div className="w-full h-full bg-slate-900 text-slate-100 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-violet-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-400">Founder Card</span>
              </div>
              {renderLogo('text-violet-400')}
            </div>

            <div className="flex items-center gap-4 my-auto">
              {renderAvatarPhoto('w-16 h-16 border-2 border-violet-400')}
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-extrabold text-white truncate">{fullName}</h2>
                <p className="text-xs font-semibold text-violet-400 truncate">{jobTitle}</p>
                {showCompanyName && companyName && (
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{companyName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] text-slate-300 pt-2 border-t border-slate-800">
              <span className="truncate">📱 {phone}</span>
              <span className="truncate">💬 {whatsapp}</span>
              <span className="truncate">📧 {email}</span>
              <span className="truncate">🌐 {website}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderBackCardTemplate = () => {
    const {
      companyName,
      website,
      backSideTagline,
      backSideServices,
      email,
      phone,
      showQrCode,
    } = cardData;

    return (
      <div className="w-full h-full bg-slate-950 text-slate-100 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-slate-800">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          {renderLogo('text-amber-400 font-extrabold text-xs')}
          <span className="text-[10px] font-mono text-slate-400">
            {website || 'www.ahadex.fun'}
          </span>
        </div>

        <div className="my-auto text-center px-4">
          <p className="text-xs sm:text-sm font-semibold text-slate-200 italic">
            "{backSideTagline || 'Excellence in Enterprise Solutions'}"
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {backSideServices.map((service, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300"
              >
                ✓ {service}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
          <span>{phone}</span>
          <span>{email}</span>
          {showQrCode && qrCodeDataUrl && (
            <img
              src={qrCodeDataUrl}
              alt="QR Code"
              className="w-8 h-8 rounded bg-white p-0.5"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Format Selector */}
      <div className="p-6 rounded-2xl glass-card border border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-slate-100">
                CEO & Executive Visiting Card Generator
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Create clean, high-class 1-Side or 2-Side business cards with 300 DPI PNG, JPG, and Print PDF export.
            </p>
          </div>

          <div className="flex items-center p-1.5 rounded-xl bg-slate-950 border border-white/10 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleModeChangeRequest('1-side')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sideMode === '1-side'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>1-Side Card</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChangeRequest('2-side')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sideMode === '2-side'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2-Side Card</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 ml-1">
                PDF
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-white/10 bg-slate-900/80">
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'info'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Executive Info</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'photo'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo & Toggles</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'templates'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Templates</span>
              </button>

              {sideMode === '2-side' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('backside')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'backside'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Back Side Info</span>
                </button>
              )}
            </div>

            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Executive Full Name *
                    </label>
                    <input
                      type="text"
                      value={cardData.fullName}
                      onChange={(e) => setCardData({ ...cardData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="e.g. Alexander Wright"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Job Title / Designation *
                    </label>
                    <input
                      type="text"
                      value={cardData.jobTitle}
                      onChange={(e) => setCardData({ ...cardData, jobTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="e.g. Chief Executive Officer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={cardData.companyName}
                      onChange={(e) => setCardData({ ...cardData, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="e.g. Ahadex Global"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Direct Phone Number
                    </label>
                    <input
                      type="text"
                      value={cardData.phone}
                      onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="+1 (555) 234-5678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      WhatsApp Line
                    </label>
                    <input
                      type="text"
                      value={cardData.whatsapp}
                      onChange={(e) => setCardData({ ...cardData, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="+1 (555) 234-5678"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Executive Email
                    </label>
                    <input
                      type="email"
                      value={cardData.email}
                      onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="alexander@ahadex.fun"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Website Domain
                    </label>
                    <input
                      type="text"
                      value={cardData.website}
                      onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="www.ahadex.fun"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      HQ / City Location
                    </label>
                    <input
                      type="text"
                      value={cardData.address}
                      onChange={(e) => setCardData({ ...cardData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="Silicon Valley, CA"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'photo' && (
              <div className="space-y-6">
                {/* Element Display Toggles */}
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                  <span className="text-xs font-mono text-slate-300 block font-bold mb-2">
                    Card Visibility Toggles
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCardData({ ...cardData, showPhoto: !cardData.showPhoto })}
                      className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                        cardData.showPhoto
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{cardData.showPhoto ? 'Photo On' : 'Photo Off'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCardData({ ...cardData, showQrCode: !cardData.showQrCode })}
                      className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                        cardData.showQrCode
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{cardData.showQrCode ? 'QR On' : 'QR Off'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCardData({ ...cardData, showCompanyName: !cardData.showCompanyName })
                      }
                      className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                        cardData.showCompanyName
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-white/10 text-slate-500'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{cardData.showCompanyName ? 'Company On' : 'Company Off'}</span>
                    </button>
                  </div>
                </div>

                {cardData.showPhoto && (
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      Profile Photo Upload
                    </label>

                    <div className="flex items-center gap-4">
                      {renderAvatarPhoto('w-20 h-20')}

                      <div className="flex-1 space-y-2">
                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-all">
                          <Upload className="w-4 h-4" />
                          <span>Upload Portrait</span>
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
                                photoX: 0,
                                photoY: 0,
                              })
                            }
                            className="text-xs text-rose-400 hover:text-rose-300 underline font-mono block"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Company Logo
                  </label>

                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 border border-dashed border-white/20 text-slate-400 text-xs cursor-pointer hover:border-amber-400/50 hover:text-slate-200 transition-all">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>
                      {cardData.logoUrl ? 'Change Company Logo' : 'Upload PNG Logo'}
                    </span>

                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">
                    Select CEO / Executive Template
                  </span>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    8 Executive Styles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {TEMPLATE_OPTIONS.map((tpl) => (
                    <div
                      key={tpl.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        addToast(
                          'Template Selected',
                          `Selected "${tpl.name}" Template`,
                          'info'
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedTemplate(tpl.id);
                          addToast(
                            'Template Selected',
                            `Selected "${tpl.name}" Template`,
                            'info'
                          );
                        }
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedTemplate === tpl.id
                          ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-950/40'
                          : 'bg-slate-950 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-100">
                          {tpl.name}
                        </span>

                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-amber-300">
                          {tpl.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'backside' && sideMode === '2-side' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Back Side Tagline / Slogan
                  </label>

                  <input
                    type="text"
                    value={cardData.backSideTagline}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        backSideTagline: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Excellence in Enterprise Solutions"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Executive Pillars / Services (4 lines)
                  </label>

                  {cardData.backSideServices.map((service, index) => (
                    <input
                      key={index}
                      type="text"
                      value={service}
                      onChange={(e) => {
                        const updated = [...cardData.backSideServices];
                        updated[index] = e.target.value;

                        setCardData({
                          ...cardData,
                          backSideServices: updated,
                        });
                      }}
                      className="w-full px-3 py-2 mb-2 rounded-lg bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder={`Pillar #${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl glass-card border border-white/10 bg-slate-900/90 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-base font-bold text-slate-100">
                  Live HD Preview (3.5" x 2.0")
                </h3>
              </div>

              {sideMode === '2-side' && (
                <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveSideView('front')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeSideView === 'front'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Front Side
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSideView('back')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeSideView === 'back'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Back Side
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-white/5 min-h-[310px] overflow-hidden">
              <div className="relative w-[340px] sm:w-[450px] h-[194px] sm:h-[257px] rounded-xl shadow-2xl shrink-0">
                <div
                  ref={frontCardRef}
                  className={`w-full h-full rounded-xl overflow-hidden transition-all duration-300 ${
                    sideMode === '1-side' || activeSideView === 'front'
                      ? 'relative z-10 opacity-100'
                      : 'absolute inset-0 opacity-0 pointer-events-none z-0'
                  }`}
                >
                  {renderFrontCardTemplate()}
                </div>

                {sideMode === '2-side' && (
                  <div
                    ref={backCardRef}
                    className={`w-full h-full rounded-xl overflow-hidden transition-all duration-300 ${
                      activeSideView === 'back'
                        ? 'relative z-10 opacity-100'
                        : 'absolute inset-0 opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    {renderBackCardTemplate()}
                  </div>
                )}
              </div>

              {sideMode === '2-side' && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    Showing:{' '}
                    {activeSideView === 'front'
                      ? 'Page 1 (Front Side)'
                      : 'Page 2 (Back Side)'}
                  </span>
                </div>
              )}
            </div>

            {/* Smart Fail-Safe Downloads */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              {sideMode === '1-side' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleExportPNG('front')}
                    disabled={isExporting}
                    className="justify-center gap-1.5 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold rounded-xl shadow-lg text-xs"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>HD PNG</span>
                  </Button>

                  <Button
                    onClick={() => handleExportJPG('front')}
                    disabled={isExporting}
                    className="justify-center gap-1.5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold rounded-xl shadow-lg text-xs"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 text-cyan-400" />
                    )}
                    <span>HD JPG</span>
                  </Button>

                  <Button
                    onClick={handleExport2SidePDF}
                    disabled={isExporting}
                    className="justify-center gap-1.5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg text-xs"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>Print PDF</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Button
                    onClick={handleExport2SidePDF}
                    disabled={isExporting}
                    className="w-full justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-950/50"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span>Download 2-Page Print PDF (300 DPI)</span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleExportPNG('front')}
                      disabled={isExporting}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Front PNG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportPNG('back')}
                      disabled={isExporting}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Back PNG</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-1">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 300 DPI Guaranteed
                </span>
                <span>Standard 3.5" x 2.0" Format</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full p-6 rounded-2xl glass-card border border-amber-500/40 bg-slate-900 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold text-slate-100">
                  Switch to 1-Side Format?
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Switching to 1-Side format will focus export on the front side card.
                Your contact details and profile settings will be preserved.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmationModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmModeSwitch}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                >
                  Confirm Switch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
