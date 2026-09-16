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
  MessageSquare,
  Mail,
  Globe,
  MapPin,
  Linkedin,
  Instagram,
  FileText,
  Image as ImageIcon,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  AlertTriangle,
  ZoomIn,
  Move,
  RefreshCw,
  Eye,
  Sliders,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../ui/Button';

// Card Side Modes
type CardSideMode = '1-side' | '2-side';

// Template Categories / Styles
export type TemplateId =
  | 'corporate'
  | 'minimal'
  | 'modern'
  | 'executive'
  | 'creative'
  | 'luxury'
  | 'dark'
  | 'tech';

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
    id: 'corporate',
    name: 'Corporate Classic',
    description: 'Clean navy & white layout with crisp authority for business executives.',
    badge: 'Professional',
    color: 'from-blue-600 to-indigo-700',
    previewBg: 'bg-slate-900 border-blue-500/30',
  },
  {
    id: 'minimal',
    name: 'Minimal Essence',
    description: 'Warm, typography-focused layout with balanced negative space.',
    badge: 'Clean',
    color: 'from-amber-500 to-stone-600',
    previewBg: 'bg-stone-900 border-amber-500/30',
  },
  {
    id: 'modern',
    name: 'Modern Gradient',
    description: 'Vibrant cyan-indigo neon accents with modern floating elements.',
    badge: 'Trending',
    color: 'from-cyan-500 to-blue-600',
    previewBg: 'bg-slate-950 border-cyan-500/30',
  },
  {
    id: 'executive',
    name: 'Executive Gold',
    description: 'Deep obsidian backdrop accented with rich metallic gold details.',
    badge: 'Premium',
    color: 'from-amber-400 to-yellow-600',
    previewBg: 'bg-zinc-950 border-amber-400/40',
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    description: 'Dynamic geometric cutouts & teal highlights for agencies and designers.',
    badge: 'Creative',
    color: 'from-emerald-400 to-teal-600',
    previewBg: 'bg-slate-900 border-emerald-400/30',
  },
  {
    id: 'luxury',
    name: 'Luxury Rose Gold',
    description: 'Sleek luxury design with rose champagne accents and corner trims.',
    badge: 'Luxury',
    color: 'from-rose-400 to-pink-600',
    previewBg: 'bg-stone-950 border-rose-400/30',
  },
  {
    id: 'dark',
    name: 'Dark Cyber Synth',
    description: 'Futuristic dark theme with neon cyan borders and tech grid accents.',
    badge: 'Cyber',
    color: 'from-cyan-400 to-purple-600',
    previewBg: 'bg-black border-cyan-400/50',
  },
  {
    id: 'tech',
    name: 'Tech Minimalist',
    description: 'Modern developer layout with status indicator and clean icon badges.',
    badge: 'Developer',
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
  linkedin: string;
  instagram: string;
  shortBio: string;
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
  jobTitle: 'Senior Software Architect',
  companyName: 'Ahadex Innovations Ltd.',
  phone: '+1 (555) 234-5678',
  whatsapp: '+1 (555) 234-5678',
  email: 'alexander@ahadex.fun',
  website: 'www.ahadex.fun',
  address: '100 Innovation Way, Silicon Valley, CA',
  linkedin: 'alexander-wright',
  instagram: '@alexander_architect',
  shortBio: 'Building scalable high-performance cloud architectures.',
  photoUrl: null,
  photoZoom: 1,
  photoX: 0,
  photoY: 0,
  photoFrame: 'circle',
  logoUrl: null,
  backSideTagline: 'Empowering Businesses with Next-Gen Digital Utilities',
  backSideServices: [
    'Cloud Architecture Design',
    'Custom Software Solutions',
    'Enterprise Security Audits',
    'UI/UX Prototyping',
  ],
};

export const VisitingCardGenerator: React.FC = () => {
  const { addToast } = useToast();

  // Primary State
  const [sideMode, setSideMode] = useState<CardSideMode>('1-side');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('corporate');
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [activeTab, setActiveTab] = useState<'info' | 'photo' | 'templates' | 'backside'>('info');
  const [activeSideView, setActiveSideView] = useState<'front' | 'back'>('front');

  // Confirmation Modal State for Mode Change
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [pendingMode, setPendingMode] = useState<CardSideMode | null>(null);

  // QR Code State
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Export Progress State
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Card DOM Refs for canvas export
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  // Generate QR Code dynamically from website or email
  useEffect(() => {
    const qrText = cardData.website
      ? cardData.website.startsWith('http')
        ? cardData.website
        : `https://${cardData.website}`
      : `BEGIN:VCARD\nVERSION:3.0\nN:${cardData.fullName}\nTEL:${cardData.phone}\nEMAIL:${cardData.email}\nEND:VCARD`;

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
  }, [cardData.website, cardData.fullName, cardData.phone, cardData.email]);

  // Request Mode Change Handler
  const handleModeChangeRequest = (newMode: CardSideMode) => {
    if (newMode === sideMode) return;

    if (sideMode === '2-side' && newMode === '1-side') {
      // Check if user edited backside custom info
      setPendingMode(newMode);
      setShowConfirmationModal(true);
    } else {
      setSideMode(newMode);
      addToast('Mode Switch', `Switched to ${newMode === '1-side' ? '1-Side' : '2-Side'} Visiting Card Mode`, 'info');
    }
  };

  const confirmModeSwitch = () => {
    if (pendingMode) {
      setSideMode(pendingMode);
      setPendingMode(null);
      setShowConfirmationModal(false);
      addToast('Mode Switch', 'Switched to 1-Side Visiting Card Mode', 'info');
    }
  };

  // Image File Upload Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      addToast('File Too Large', 'Photo size should be under 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCardData((prev) => ({
        ...prev,
        photoUrl: event.target?.result as string,
        photoZoom: 1,
        photoX: 0,
        photoY: 0,
      }));
      addToast('Upload Successful', 'Photo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('File Too Large', 'Logo size should be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCardData((prev) => ({
        ...prev,
        logoUrl: event.target?.result as string,
      }));
      addToast('Upload Successful', 'Logo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Export Logic
  const handleExportPNG = async (side: 'front' | 'back' = 'front') => {
    const targetRef = side === 'front' ? frontCardRef : backCardRef;
    if (!targetRef.current) {
      addToast('Export Error', 'Card element not found. Please try again.', 'error');
      return;
    }
    setIsExporting(true);

    try {
      addToast('Preparing Export', `Rendering High-Resolution PNG (${side === 'front' ? 'Front' : 'Back'})...`, 'info');
      const canvas = await html2canvas(targetRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const nameSlug = (cardData.fullName || 'VisitingCard').replace(/\s+/g, '_');
      link.download = `${nameSlug}_VisitingCard_${side.toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();

      addToast('Export Complete', `${side === 'front' ? 'Front' : 'Back'} side PNG exported successfully!`, 'success');
    } catch (err) {
      console.error('PNG Export Error:', err);
      addToast('Export Failed', 'Export failed. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport2SidePDF = async () => {
    if (!frontCardRef.current) {
      addToast('Export Error', 'Front card element not found.', 'error');
      return;
    }
    setIsExporting(true);

    try {
      addToast('Preparing Export', 'Generating Print-Ready 300 DPI PDF...', 'info');

      // Capture Front
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2.0], // Standard business card inches
      });

      // Page 1: Front
      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', 0, 0, 3.5, 2.0);

      // Page 2: Back (If 2-side mode and back card exists)
      if (sideMode === '2-side' && backCardRef.current) {
        const backCanvas = await html2canvas(backCardRef.current, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
        });

        pdf.addPage([3.5, 2.0], 'landscape');
        const backImgData = backCanvas.toDataURL('image/png');
        pdf.addImage(backImgData, 'PNG', 0, 0, 3.5, 2.0);
      }

      const nameSlug = (cardData.fullName || 'VisitingCard').replace(/\s+/g, '_');
      pdf.save(`${nameSlug}_VisitingCard_${sideMode === '2-side' ? '2Side' : '1Side'}.pdf`);
      addToast('Export Complete', `${sideMode === '2-side' ? '2-Side' : '1-Side'} PDF exported successfully!`, 'success');
    } catch (err) {
      console.error('PDF Export Error:', err);
      addToast('Export Failed', 'PDF Export failed. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper renderer for avatar photo in templates
  const renderAvatarPhoto = (className: string = 'w-16 h-16') => {
    const frameClasses = {
      circle: 'rounded-full',
      rounded: 'rounded-xl',
      square: 'rounded-none',
      hexagon: 'rounded-2xl border border-cyan-400/40 rotate-45 scale-90',
    };

    return (
      <div
        className={`relative overflow-hidden bg-slate-800 border-2 border-white/20 shadow-md ${frameClasses[cardData.photoFrame]} ${className}`}
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
          <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-400">
            <User className="w-1/2 h-1/2 opacity-60" />
          </div>
        )}
      </div>
    );
  };

  // Helper renderer for company logo
  const renderLogo = (defaultTextClassName: string = 'text-cyan-400 font-bold') => {
    if (cardData.logoUrl) {
      return (
        <img
          src={cardData.logoUrl}
          alt="Company Logo"
          className="h-7 w-auto object-contain max-w-[100px]"
        />
      );
    }
    return (
      <div className="flex items-center gap-1.5">
        <Building2 className="w-4 h-4 text-cyan-400" />
        <span className={`text-xs uppercase tracking-wider ${defaultTextClassName}`}>
          {cardData.companyName || 'AHADEX'}
        </span>
      </div>
    );
  };

  // Render Front Side Card Template
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
      linkedin,
      instagram,
      shortBio,
    } = cardData;

    switch (selectedTemplate) {
      case 'corporate':
        return (
          <div className="w-full h-full bg-slate-950 text-slate-100 p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-slate-800">
            {/* Top Navy Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
            
            {/* Header: Logo & Company */}
            <div className="flex items-center justify-between">
              {renderLogo('text-blue-400 font-bold text-xs tracking-wider')}
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40">
                Official Business
              </span>
            </div>

            {/* Main Profile Body */}
            <div className="flex items-center gap-4 my-auto">
              {renderAvatarPhoto('w-20 h-20 shrink-0 border-2 border-blue-500/40 shadow-xl')}
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold tracking-tight text-white truncate">
                  {fullName || 'Your Name'}
                </h2>
                <p className="text-xs font-semibold text-blue-400 tracking-wide uppercase mt-0.5 truncate">
                  {jobTitle || 'Your Profession'}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {shortBio || 'Company tagline or short professional bio goes here.'}
                </p>
              </div>
            </div>

            {/* Bottom Contact Details Grid */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{phone || '+1 000 000 0000'}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{email || 'email@domain.com'}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{website || 'www.domain.com'}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{address || 'City, Country'}</span>
              </div>
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="w-full h-full bg-stone-900 text-stone-100 p-6 flex flex-col justify-between relative overflow-hidden font-serif border border-amber-900/30">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-amber-200">
                  {fullName || 'Your Name'}
                </h2>
                <p className="text-xs font-sans uppercase tracking-widest text-stone-400 mt-0.5">
                  {jobTitle || 'Your Profession'}
                </p>
              </div>
              {renderAvatarPhoto('w-16 h-16 shrink-0 border border-amber-500/30')}
            </div>

            <div className="font-sans text-xs text-stone-300 space-y-1.5 my-auto">
              <p className="font-bold text-stone-200">{companyName || 'Company Name'}</p>
              <p className="text-stone-400 text-[11px] line-clamp-1">{shortBio}</p>
            </div>

            <div className="font-sans grid grid-cols-2 gap-2 text-[11px] text-stone-300 pt-3 border-t border-stone-800">
              <span className="truncate">📞 {phone}</span>
              <span className="truncate">✉️ {email}</span>
              <span className="truncate">🌐 {website}</span>
              <span className="truncate">📍 {address}</span>
            </div>
          </div>
        );

      case 'modern':
        return (
          <div className="w-full h-full bg-slate-950 text-slate-100 p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-cyan-500/30">
            {/* Glowing Corner Accents */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />

            <div className="flex items-center justify-between relative z-10">
              {renderLogo('text-cyan-400 font-extrabold')}
              {qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl}
                  alt="QR"
                  className="w-10 h-10 rounded bg-white p-0.5 border border-cyan-400/50"
                />
              )}
            </div>

            <div className="flex items-center gap-4 relative z-10 my-auto">
              {renderAvatarPhoto('w-20 h-20 shrink-0 border-2 border-cyan-400 shadow-lg shadow-cyan-950/50')}
              <div className="min-w-0">
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 truncate">
                  {fullName || 'Your Name'}
                </h2>
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                  {jobTitle || 'Your Profession'}
                </p>
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {companyName || 'Brand'}
                </span>
              </div>
            </div>

            <div className="relative z-10 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
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

      case 'executive':
        return (
          <div className="w-full h-full bg-zinc-950 text-amber-100 p-6 flex flex-col justify-between relative overflow-hidden font-sans border-2 border-amber-500/30">
            {/* Top Gold Bar Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600" />

            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-amber-300">
                  {fullName || 'Your Name'}
                </h2>
                <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold mt-0.5">
                  {jobTitle || 'Executive'}
                </p>
              </div>
              {renderAvatarPhoto('w-16 h-16 shrink-0 border-2 border-amber-400/60 shadow-lg')}
            </div>

            <div className="my-auto text-xs space-y-1 text-zinc-300">
              <p className="font-bold text-amber-200">{companyName}</p>
              <p className="text-[11px] text-zinc-400 line-clamp-2">{shortBio}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-amber-100/90 pt-3 border-t border-amber-500/20 font-mono">
              <span className="truncate">📞 {phone}</span>
              <span className="truncate">✉️ {email}</span>
              <span className="truncate">🌐 {website}</span>
              <span className="truncate">📍 {address}</span>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="w-full h-full bg-slate-900 text-slate-100 p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-teal-500/30">
            {/* Diagonal Creative Ribbon */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-teal-500/20 rotate-45 border border-teal-400/30" />

            <div className="flex items-center justify-between">
              {renderLogo('text-teal-400 font-black')}
              <span className="text-[10px] font-mono text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">
                Studio
              </span>
            </div>

            <div className="flex items-center gap-4 my-auto">
              {renderAvatarPhoto('w-18 h-18 shrink-0 border-2 border-teal-400')}
              <div>
                <h2 className="text-lg font-black text-white">{fullName}</h2>
                <p className="text-xs font-semibold text-teal-300 uppercase">{jobTitle}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{shortBio}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 pt-3 border-t border-slate-800">
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
                <Instagram className="w-3 h-3 text-pink-400 shrink-0" />
                <span className="truncate">{instagram}</span>
              </div>
            </div>
          </div>
        );

      case 'luxury':
        return (
          <div className="w-full h-full bg-stone-950 text-rose-100 p-6 flex flex-col justify-between relative overflow-hidden font-serif border border-rose-400/30">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-rose-200">{fullName}</h2>
                <p className="text-xs font-sans tracking-widest text-rose-400/80 uppercase mt-0.5">
                  {jobTitle}
                </p>
              </div>
              {renderAvatarPhoto('w-16 h-16 shrink-0 border border-rose-400/40')}
            </div>

            <div className="font-sans text-xs text-stone-300 my-auto">
              <p className="font-bold text-rose-200">{companyName}</p>
              <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2">{shortBio}</p>
            </div>

            <div className="font-sans grid grid-cols-2 gap-2 text-[11px] text-rose-200/90 pt-3 border-t border-rose-900/40">
              <span className="truncate">📞 {phone}</span>
              <span className="truncate">✉️ {email}</span>
              <span className="truncate">🌐 {website}</span>
              <span className="truncate">💼 {linkedin}</span>
            </div>
          </div>
        );

      case 'dark':
        return (
          <div className="w-full h-full bg-black text-cyan-400 p-6 flex flex-col justify-between relative overflow-hidden font-mono border-2 border-cyan-500/50 shadow-2xl">
            {/* Tech Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] text-cyan-300 px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 rounded">
                // SYSTEM_ID: #{fullName.slice(0, 3).toUpperCase()}
              </span>
              {renderLogo('text-cyan-400 font-bold')}
            </div>

            <div className="flex items-center gap-4 relative z-10 my-auto">
              {renderAvatarPhoto('w-18 h-18 shrink-0 border-2 border-cyan-400')}
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">{fullName}</h2>
                <p className="text-xs text-cyan-300 font-bold tracking-wider">{jobTitle}</p>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{companyName}</p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 pt-3 border-t border-cyan-900/50">
              <span className="truncate">TEL: {phone}</span>
              <span className="truncate">MAIL: {email}</span>
              <span className="truncate">WEB: {website}</span>
              <span className="truncate">LOC: {address}</span>
            </div>
          </div>
        );

      case 'tech':
        return (
          <div className="w-full h-full bg-slate-900 text-slate-100 p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-violet-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-slate-400">Available for Hire</span>
              </div>
              {renderLogo('text-violet-400 font-bold')}
            </div>

            <div className="flex items-center gap-4 my-auto">
              {renderAvatarPhoto('w-18 h-18 shrink-0 border-2 border-violet-400')}
              <div>
                <h2 className="text-lg font-extrabold text-white">{fullName}</h2>
                <p className="text-xs font-semibold text-violet-400">{jobTitle}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{companyName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-3 border-t border-slate-800">
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

  // Render Back Side Card Template
  const renderBackCardTemplate = () => {
    const { companyName, website, backSideTagline, backSideServices, email, phone, address } = cardData;

    return (
      <div className="w-full h-full bg-slate-950 text-slate-100 p-6 flex flex-col justify-between relative overflow-hidden font-sans border border-slate-800">
        {/* Subtle Background Pattern */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          {renderLogo('text-cyan-400 font-extrabold text-sm')}
          <span className="text-[10px] font-mono text-slate-400">{website || 'www.ahadex.fun'}</span>
        </div>

        <div className="my-auto text-center px-4">
          <p className="text-sm font-semibold text-slate-200 italic">
            "{backSideTagline || 'Empowering Innovation with Next-Gen Digital Utilities'}"
          </p>

          {/* Key Services List */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {backSideServices.map((service, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300"
              >
                ✓ {service}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
          <span>{phone}</span>
          <span>{email}</span>
          {qrCodeDataUrl && (
            <img src={qrCodeDataUrl} alt="QR Code" className="w-8 h-8 rounded bg-white p-0.5" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Mode Selector Banner (1-Side vs 2-Side) */}
      <div className="p-6 rounded-2xl glass-card border border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-slate-100">
                Select Visiting Card Format
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Choose between Single-sided quick cards or Double-sided corporate cards with Print PDF export.
            </p>
          </div>

          <div className="flex items-center p-1.5 rounded-xl bg-slate-950 border border-white/10 gap-2 shrink-0">
            <button
              onClick={() => handleModeChangeRequest('1-side')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                sideMode === '1-side'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>1-Side Card</span>
            </button>

            <button
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

      {/* Main Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Control Panel (Tabs: Info, Photo, Templates, Backside) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-white/10 bg-slate-900/80">
            {/* Editor Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-4 mb-6 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'info'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Card Info</span>
              </button>

              <button
                onClick={() => setActiveTab('photo')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'photo'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo & Framing</span>
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'templates'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Templates</span>
              </button>

              {sideMode === '2-side' && (
                <button
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

            {/* TAB 1: Card Information Inputs */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={cardData.fullName}
                      onChange={(e) => setCardData({ ...cardData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="e.g. Alexander Wright"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Job Title / Profession *
                    </label>
                    <input
                      type="text"
                      value={cardData.jobTitle}
                      onChange={(e) => setCardData({ ...cardData, jobTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="e.g. Senior Software Architect"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={cardData.companyName}
                      onChange={(e) => setCardData({ ...cardData, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="e.g. Ahadex Innovations"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={cardData.phone}
                      onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={cardData.whatsapp}
                      onChange={(e) => setCardData({ ...cardData, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={cardData.email}
                      onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="alexander@domain.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={cardData.website}
                      onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="www.ahadex.fun"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Office Address
                    </label>
                    <input
                      type="text"
                      value={cardData.address}
                      onChange={(e) => setCardData({ ...cardData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="Silicon Valley, CA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      value={cardData.linkedin}
                      onChange={(e) => setCardData({ ...cardData, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="in/alexander-wright"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={cardData.instagram}
                      onChange={(e) => setCardData({ ...cardData, instagram: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder="@alexander_architect"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Short Bio / Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={cardData.shortBio}
                    onChange={(e) => setCardData({ ...cardData, shortBio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none resize-none"
                    placeholder="Building scalable high-performance cloud architectures."
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Photo & Framing */}
            {activeTab === 'photo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Profile Photo Upload
                  </label>
                  <div className="flex items-center gap-4">
                    {renderAvatarPhoto('w-20 h-20 shrink-0')}
                    <div className="flex-1 space-y-2">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold cursor-pointer hover:bg-cyan-500/20 transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {cardData.photoUrl && (
                        <button
                          onClick={() => setCardData({ ...cardData, photoUrl: null })}
                          className="text-xs text-rose-400 hover:text-rose-300 underline font-mono block"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo Framing Shapes */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Frame Shape
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['circle', 'rounded', 'square', 'hexagon'] as const).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => setCardData({ ...cardData, photoFrame: shape })}
                        className={`p-3 rounded-xl border text-xs font-mono capitalize transition-all ${
                          cardData.photoFrame === shape
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-950 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Zoom & Positioning Sliders */}
                {cardData.photoUrl && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                        <span>Photo Zoom</span>
                        <span>{cardData.photoZoom.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={cardData.photoZoom}
                        onChange={(e) =>
                          setCardData({ ...cardData, photoZoom: parseFloat(e.target.value) })
                        }
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                          <span>Position X</span>
                          <span>{cardData.photoX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={cardData.photoX}
                          onChange={(e) =>
                            setCardData({ ...cardData, photoX: parseInt(e.target.value) })
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                          <span>Position Y</span>
                          <span>{cardData.photoY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={cardData.photoY}
                          onChange={(e) =>
                            setCardData({ ...cardData, photoY: parseInt(e.target.value) })
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Company Logo Upload */}
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Optional Company Logo
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 border border-dashed border-white/20 text-slate-400 text-xs cursor-pointer hover:border-cyan-400/50 hover:text-slate-200 transition-all">
                    <Building2 className="w-4 h-4 text-cyan-400" />
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

            {/* TAB 3: Professional Templates Picker */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">
                    Select Corporate Template Style
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    8 Distinct Styles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {TEMPLATE_OPTIONS.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        addToast('Template Selected', `Selected "${tpl.name}" Template`, 'info');
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedTemplate === tpl.id
                          ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-950/40'
                          : 'bg-slate-950 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-100">{tpl.name}</span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-cyan-300">
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

            {/* TAB 4: Backside Info (Only for 2-side mode) */}
            {activeTab === 'backside' && sideMode === '2-side' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Back Side Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={cardData.backSideTagline}
                    onChange={(e) => setCardData({ ...cardData, backSideTagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g. Empowering Digital Excellence"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Services / Bullet Points (4 lines)
                  </label>
                  {cardData.backSideServices.map((service, index) => (
                    <input
                      key={index}
                      type="text"
                      value={service}
                      onChange={(e) => {
                        const updated = [...cardData.backSideServices];
                        updated[index] = e.target.value;
                        setCardData({ ...cardData, backSideServices: updated });
                      }}
                      className="w-full px-3 py-2 mb-2 rounded-lg bg-slate-950 border border-white/10 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                      placeholder={`Service #${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Real-time Live Preview & Export Action Panel */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl glass-card border border-white/10 bg-slate-900/90 shadow-2xl">
            {/* Live Preview Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="text-base font-bold text-slate-100">Live Card Preview</h3>
              </div>

              {sideMode === '2-side' && (
                <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-mono">
                  <button
                    onClick={() => setActiveSideView('front')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeSideView === 'front'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Front Side
                  </button>
                  <button
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

            {/* Canvas Render Area (Standard Visiting Card Aspect Ratio 3.5:2 -> 525px x 300px) */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-white/5 min-h-[340px] overflow-hidden">
              <div className="relative w-[350px] sm:w-[500px] h-[200px] sm:h-[285px] rounded-xl shadow-2xl shrink-0">
                {/* Front Side Card Container */}
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

                {/* Back Side Card Container (Always mounted in 2-side mode) */}
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

              {/* Both Sides Thumbnail Indicator for 2-side mode */}
              {sideMode === '2-side' && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    Showing: {activeSideView === 'front' ? 'Page 1 (Front Side)' : 'Page 2 (Back Side)'}
                  </span>
                </div>
              )}
            </div>

            {/* Export Action Options */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              {sideMode === '1-side' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleExportPNG('front')}
                    disabled={isExporting}
                    className="w-full justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-950/50"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>Export PNG (HD)</span>
                  </Button>

                  <Button
                    onClick={handleExport2SidePDF}
                    disabled={isExporting}
                    className="w-full justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-950/50"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>Export Print PDF</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={handleExport2SidePDF}
                    disabled={isExporting}
                    className="w-full justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-950/50"
                  >
                    {isExporting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span>Export 2-Page Print PDF (300 DPI)</span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleExportPNG('front')}
                      disabled={isExporting}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Front Side (PNG)</span>
                    </button>

                    <button
                      onClick={() => handleExportPNG('back')}
                      disabled={isExporting}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Back Side (PNG)</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-1">
                <span>✓ Print-Ready 300 DPI</span>
                <span>✓ 100% In-Browser Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Switching from 2-Side to 1-Side */}
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
                <h3 className="text-lg font-bold text-slate-100">Switch to 1-Side Card?</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Switching to Single-Side Mode will hide the Back Side PDF options. Your front side contact details and photo will be preserved.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
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
