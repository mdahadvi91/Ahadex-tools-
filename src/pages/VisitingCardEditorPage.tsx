import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  Building2,
  Check,
  Download,
  Globe,
  ImagePlus,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  RefreshCw,
  Sparkles,
  Upload,
  UserRound,
} from 'lucide-react';

import { PageTransition } from '../components/animations/PageTransition';
import { SEOHead } from '../components/common/SEOHead';
import { useToast } from '../context/ToastContext';

type TemplateLayout =
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
  | 'diagonal'
  | 'halo'
  | 'cutout'
  | 'neo'
  | 'orbit'
  | 'gradient'
  | 'duotone'
  | 'vertical'
  | 'badge'
  | 'cinematic';

type TemplateStyle = {
  name: string;
  category: string;
  accent: string;
  accent2: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  layout: TemplateLayout;
  description: string;
};

type CardData = {
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
};

const CARD_WIDTH_PX = 1050;
const CARD_HEIGHT_PX = 600;
const CARD_WIDTH_IN = 3.5;
const CARD_HEIGHT_IN = 2;

const DEMO_PHOTO =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iMTEwMCIgdmlld0JveD0iMCAwIDkwMCAxMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjMGYxNzJhIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzM0MTU1Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjkwMCIgaGVpZ2h0PSIxMTAwIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iNDUwIiBjeT0iMzgwIiByPSIxNzAiIGZpbGw9IiNjYmQ1ZTEiLz48cGF0aCBkPSJNMTgwIDEwNTBjMzAtMjYwIDE3MC0zNjAgMjcwLTM2MHMjI0MCAxMDAgMjcwIDM2MCIgZmlsbD0iIzk0YTNhOCI+PC9wYXRoPjxjaXJjbGUgY3g9IjM5MCIgY3k9IjM2MCIgcj0iMTgiIGZpbGw9IiMwZjE3MmEiLz48Y2lyY2xlIGN4PSI1MTAiIGN5PSIzNjAiIHI9IjE4IiBmaWxsPSIjMGYxNzJhIi8+PHBhdGggZD0iTTM3MCA0NzBxODAgNjAgMTYwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmMTcyYSIgc3Ryb2tlLXdpZHRoPSIxOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHRleHQgeD0iNDUwIiB5PSIxMDMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDQiIGZpbGw9IiNmOGZhZmMiIGZvbnQtd2VpZ2h0PSI3MDAiPk1PSEFNTUFEIEFIQUQ8L3RleHQ+PC9zdmc+';

const DEMO_CARD_DATA: CardData = {
  photoUrl: DEMO_PHOTO,
  logoUrl: null,
  fullName: 'Mohammad Ahad',
  jobTitle: 'Creative Director',
  companyName: 'AHADEX',
  phone: '+971 50 000 0000',
  whatsapp: '+971 50 000 0000',
  email: 'hello@ahadex.fun',
  website: 'ahadex.fun',
  address: 'Sharjah · Dubai · UAE',
  linkedin: 'linkedin.com/in/mohammadahad',
  instagram: '@mohammadahad',
  bio: 'Digital creator building modern tools, products and professional identities.',
};

const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  '01': {
    name: 'Apex Executive',
    category: 'Executive',
    accent: '#38bdf8',
    accent2: '#2563eb',
    accentSoft: '#082f49',
    background: '#06111f',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'portrait',
    description: 'Executive portrait card with a powerful photo-led composition.',
  },
  '02': {
    name: 'Obsidian Gold',
    category: 'Luxury',
    accent: '#e7c46a',
    accent2: '#8b5e1a',
    accentSoft: '#3d2a0c',
    background: '#070605',
    foreground: '#fff8e7',
    muted: '#aaa39a',
    layout: 'luxury',
    description: 'Black-gold luxury identity with cinematic portrait treatment.',
  },
  '03': {
    name: 'Maison Editorial',
    category: 'Fashion',
    accent: '#f43f5e',
    accent2: '#be123c',
    accentSoft: '#4c0519',
    background: '#fff8f8',
    foreground: '#1f1115',
    muted: '#765d65',
    layout: 'editorial',
    description: 'Fashion-editorial composition with oversized typography and portrait.',
  },
  '04': {
    name: 'Swiss Precision',
    category: 'Minimal',
    accent: '#111827',
    accent2: '#64748b',
    accentSoft: '#e2e8f0',
    background: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'minimal',
    description: 'Ultra-clean Swiss grid with an integrated professional portrait.',
  },
  '05': {
    name: 'Royal Eclipse',
    category: 'Premium',
    accent: '#c084fc',
    accent2: '#7c3aed',
    accentSoft: '#3b0764',
    background: '#10051d',
    foreground: '#faf5ff',
    muted: '#c4b5fd',
    layout: 'monogram',
    description: 'Royal purple and black identity with monogram and portrait focus.',
  },
  '06': {
    name: 'Architect X',
    category: 'Architecture',
    accent: '#60a5fa',
    accent2: '#0ea5e9',
    accentSoft: '#172554',
    background: '#06111f',
    foreground: '#eff6ff',
    muted: '#93c5fd',
    layout: 'grid',
    description: 'Technical architectural grid with precision portrait framing.',
  },
  '07': {
    name: 'Emerald Offset',
    category: 'Creative',
    accent: '#34d399',
    accent2: '#10b981',
    accentSoft: '#064e3b',
    background: '#041713',
    foreground: '#ecfdf5',
    muted: '#86efac',
    layout: 'asymmetric',
    description: 'Creative asymmetric layout with a bold floating portrait.',
  },
  '08': {
    name: 'Graphite Glass',
    category: 'Modern',
    accent: '#e2e8f0',
    accent2: '#64748b',
    accentSoft: '#27272a',
    background: '#0d0f13',
    foreground: '#fafafa',
    muted: '#a1a1aa',
    layout: 'glass',
    description: 'Dark glassmorphism identity with layered portrait panel.',
  },
  '09': {
    name: 'Cobalt Frame',
    category: 'Corporate',
    accent: '#2563eb',
    accent2: '#06b6d4',
    accentSoft: '#dbeafe',
    background: '#f8fbff',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'frame',
    description: 'Corporate blue frame with strong portrait hierarchy.',
  },
  '10': {
    name: 'Rose Atelier',
    category: 'Personal Brand',
    accent: '#e11d48',
    accent2: '#fb7185',
    accentSoft: '#ffe4e6',
    background: '#fff7f8',
    foreground: '#3f0b18',
    muted: '#881337',
    layout: 'diagonal',
    description: 'Elegant personal-brand card with diagonal fashion geometry.',
  },
  '11': {
    name: 'Copper Heritage',
    category: 'Heritage',
    accent: '#ea580c',
    accent2: '#f59e0b',
    accentSoft: '#431407',
    background: '#170b06',
    foreground: '#fff7ed',
    muted: '#fdba74',
    layout: 'badge',
    description: 'Warm copper heritage composition with emblem-like portrait badge.',
  },
  '12': {
    name: 'Aqua Digital',
    category: 'Technology',
    accent: '#2dd4bf',
    accent2: '#06b6d4',
    accentSoft: '#134e4a',
    background: '#021615',
    foreground: '#f0fdfa',
    muted: '#99f6e4',
    layout: 'orbit',
    description: 'Digital aqua identity with orbital geometry and portrait.',
  },
  '13': {
    name: 'Midnight Signature',
    category: 'Signature',
    accent: '#f8fafc',
    accent2: '#94a3b8',
    accentSoft: '#334155',
    background: '#020617',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'signature',
    description: 'High-end signature layout with editorial portrait placement.',
  },
  '14': {
    name: 'Solar Statement',
    category: 'Bold',
    accent: '#facc15',
    accent2: '#f97316',
    accentSoft: '#422006',
    background: '#130d02',
    foreground: '#fefce8',
    muted: '#fde68a',
    layout: 'bold',
    description: 'Oversized statement typography with high-energy portrait block.',
  },
  '15': {
    name: 'Ocean Studio',
    category: 'Studio',
    accent: '#06b6d4',
    accent2: '#3b82f6',
    accentSoft: '#164e63',
    background: '#031521',
    foreground: '#ecfeff',
    muted: '#67e8f9',
    layout: 'split',
    description: 'Deep ocean studio card with modern split portrait composition.',
  },
  '16': {
    name: 'Silver Classic',
    category: 'Classic',
    accent: '#64748b',
    accent2: '#cbd5e1',
    accentSoft: '#e2e8f0',
    background: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'vertical',
    description: 'Classic professional identity with vertical photo architecture.',
  },
  '17': {
    name: 'Prism Velocity',
    category: 'Futuristic',
    accent: '#67e8f9',
    accent2: '#a78bfa',
    accentSoft: '#164e63',
    background: '#020617',
    foreground: '#ecfeff',
    muted: '#94a3b8',
    layout: 'prism',
    description: 'Futuristic prism layers, neon lighting and technical portrait treatment.',
  },
  '18': {
    name: 'Neo Brutalist',
    category: 'Brutalist',
    accent: '#f5f5f5',
    accent2: '#ef4444',
    accentSoft: '#27272a',
    background: '#111111',
    foreground: '#fafafa',
    muted: '#a1a1aa',
    layout: 'brutalist',
    description: 'Aggressive editorial typography with hard edges and portrait cutout.',
  },
  '19': {
    name: 'Halo Noir',
    category: 'Cinematic',
    accent: '#f59e0b',
    accent2: '#ef4444',
    accentSoft: '#451a03',
    background: '#090909',
    foreground: '#fff7ed',
    muted: '#a8a29e',
    layout: 'halo',
    description: 'Cinematic black identity with glowing halo around the portrait.',
  },
  '20': {
    name: 'Gradient Flux',
    category: 'Gradient',
    accent: '#8b5cf6',
    accent2: '#ec4899',
    accentSoft: '#4c1d95',
    background: '#10051d',
    foreground: '#faf5ff',
    muted: '#d8b4fe',
    layout: 'gradient',
    description: 'Premium gradient composition designed for modern creators.',
  },
  '21': {
    name: 'Duotone Studio',
    category: 'Creative',
    accent: '#f43f5e',
    accent2: '#14b8a6',
    accentSoft: '#3f172a',
    background: '#0f172a',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'duotone',
    description: 'Experimental duotone portrait treatment with bold color blocking.',
  },
  '22': {
    name: 'Cutout Atelier',
    category: 'Art Direction',
    accent: '#22c55e',
    accent2: '#84cc16',
    accentSoft: '#14532d',
    background: '#07130a',
    foreground: '#f0fdf4',
    muted: '#86efac',
    layout: 'cutout',
    description: 'Art-directed cutout portrait with layered shapes and strong identity.',
  },
  '23': {
    name: 'Orbit Prime',
    category: 'Future',
    accent: '#38bdf8',
    accent2: '#f472b6',
    accentSoft: '#172554',
    background: '#030712',
    foreground: '#f0f9ff',
    muted: '#93c5fd',
    layout: 'neo',
    description: 'High-tech orbital identity with asymmetric portrait composition.',
  },
  '24': {
    name: 'Black Label',
    category: 'Elite',
    accent: '#d4d4d8',
    accent2: '#71717a',
    accentSoft: '#27272a',
    background: '#050505',
    foreground: '#fafafa',
    muted: '#a1a1aa',
    layout: 'cinematic',
    description: 'Premium black-label cinematic card with large portrait and signature data.',
  },
};

const getTemplate = (id?: string): TemplateStyle =>
  TEMPLATE_STYLES[id || '01'] || TEMPLATE_STYLES['01'];

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'MA';

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read image.'));
      }
    };

    reader.onerror = () =>
      reject(reader.error || new Error('Unable to read image.'));

    reader.readAsDataURL(file);
  });

const waitForImages = async (root: HTMLElement) => {
  const images = Array.from(root.querySelectorAll('img'));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete && image.naturalWidth > 0) {
            resolve();
            return;
          }

          const finish = () => resolve();

          image.addEventListener('load', finish, { once: true });
          image.addEventListener('error', finish, { once: true });
        }),
    ),
  );
};

const waitForFonts = async () => {
  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Export must continue even if a webfont fails.
    }
  }
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  multiline?: boolean;
}) => {
  const common =
    'w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-white/[0.065]';

  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Icon className="h-3.5 w-3.5 text-cyan-300" />
        {label}
      </span>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${common} resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={common}
        />
      )}
    </label>
  );
};

const UploadBox = ({
  label,
  description,
  icon: Icon,
  onChange,
  accept,
  preview,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  preview: string | null;
}) => (
  <label className="group block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.035] p-4 transition hover:border-cyan-400/40 hover:bg-white/[0.055]">
    <input
      type="file"
      accept={accept}
      onChange={onChange}
      className="sr-only"
    />

    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cyan-400/10 text-cyan-300">
        {preview ? (
          <img
            src={preview}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <Upload className="ml-auto h-4 w-4 text-slate-500 transition group-hover:text-cyan-300" />
    </div>
  </label>
);

const ProfileVisual = ({
  photoUrl,
  accent,
  large = false,
  className = '',
}: {
  photoUrl: string | null;
  accent: string;
  large?: boolean;
  className?: string;
}) => (
  <div
    className={`relative shrink-0 overflow-hidden rounded-full border-2 ${
      large ? 'h-32 w-32' : 'h-20 w-20'
    } ${className}`}
    style={{
      borderColor: `${accent}99`,
      boxShadow: `0 0 0 7px ${accent}12, 0 0 45px ${accent}20`,
    }}
  >
    <img
      src={photoUrl || DEMO_PHOTO}
      alt="Professional portrait"
      className="h-full w-full object-cover"
    />
  </div>
);

const LogoVisual = ({
  logoUrl,
  companyName,
  template,
}: {
  logoUrl: string | null;
  companyName: string;
  template: TemplateStyle;
}) => (
  <div
    className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
    style={{
      borderColor: `${template.accent}55`,
      background: `${template.accent}12`,
    }}
  >
    {logoUrl ? (
      <img
        src={logoUrl}
        alt=""
        className="h-full w-full object-contain p-1.5"
      />
    ) : (
      <span
        className="text-sm font-black tracking-tight"
        style={{ color: template.accent }}
      >
        {getInitials(companyName)}
      </span>
    )}
  </div>
);

const ContactItem = ({
  icon: Icon,
  value,
  template,
}: {
  icon: React.ElementType;
  value: string;
  template: TemplateStyle;
}) => {
  if (!value.trim()) return null;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon
        className="h-3.5 w-3.5 shrink-0"
        style={{ color: template.accent }}
      />
      <span className="truncate">{value}</span>
    </div>
  );
};

const QrVisual = ({ src }: { src: string }) => {
  if (!src) {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white">
        <RefreshCw className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Contact QR code"
      className="h-20 w-20 rounded-xl bg-white p-1"
    />
  );
};

const CardFrame = ({
  template,
  children,
  cardRef,
}: {
  template: TemplateStyle;
  children: React.ReactNode;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={cardRef}
    data-export-card="one-side"
    className="relative h-[600px] w-[1050px] overflow-hidden"
    style={{
      background: template.background,
      color: template.foreground,
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

const PhotoPanel = ({
  photoUrl,
  template,
  className = '',
}: {
  photoUrl: string | null;
  template: TemplateStyle;
  className?: string;
}) => (
  <div
    className={`absolute overflow-hidden ${className}`}
    style={{
      borderColor: `${template.accent}66`,
      boxShadow: `0 0 60px ${template.accent}18`,
    }}
  >
    <img
      src={photoUrl || DEMO_PHOTO}
      alt="Professional portrait"
      className="h-full w-full object-cover"
    />
  </div>
);

const NameBlock = ({
  data,
  template,
  dark = false,
}: {
  data: CardData;
  template: TemplateStyle;
  dark?: boolean;
}) => (
  <div>
    <p
      className="text-[13px] font-black uppercase tracking-[0.32em]"
      style={{ color: template.accent }}
    >
      {data.companyName || 'AHADEX'}
    </p>

    <h1
      className="mt-3 text-[58px] font-black leading-[0.9] tracking-[-0.06em]"
      style={{ color: dark ? '#ffffff' : template.foreground }}
    >
      {data.fullName || 'Mohammad Ahad'}
    </h1>

    <p
      className="mt-4 text-[17px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: template.muted }}
    >
      {data.jobTitle || 'Creative Director'}
    </p>
  </div>
);

const CardContent = ({
  template,
  data,
  qrSrc,
  cardRef,
}: {
  template: TemplateStyle;
  data: CardData;
  qrSrc: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const photo = data.photoUrl || DEMO_PHOTO;

  switch (template.layout) {
    case 'portrait':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="inset-y-0 left-0 w-[39%] border-r-2"
          />

          <div
            className="absolute inset-y-0 left-[30%] w-[30%]"
            style={{
              background: `linear-gradient(90deg, transparent, ${template.background})`,
            }}
          />

          <div className="absolute left-[43%] right-14 top-12">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={data.companyName}
              template={template}
            />
            <div className="mt-10">
              <NameBlock data={data} template={template} />
            </div>
          </div>

          <div className="absolute bottom-12 left-[43%] right-14 grid grid-cols-2 gap-3 text-[12px]">
            <ContactItem icon={Phone} value={data.phone} template={template} />
            <ContactItem icon={Mail} value={data.email} template={template} />
            <ContactItem icon={Globe} value={data.website} template={template} />
            <ContactItem icon={MapPin} value={data.address} template={template} />
          </div>
        </CardFrame>
      );

    case 'luxury':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-7 border"
            style={{ borderColor: `${template.accent}55` }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-12 top-12 h-[330px] w-[250px] rounded-[24px] border-2"
          />

          <div
            className="absolute left-12 top-12 h-36 w-36 rounded-full border"
            style={{
              borderColor: `${template.accent}45`,
              boxShadow: `0 0 80px ${template.accent}20`,
            }}
          />

          <div className="absolute left-14 bottom-14 max-w-[620px]">
            <p
              className="text-[12px] font-bold uppercase tracking-[0.4em]"
              style={{ color: template.accent }}
            >
              {data.companyName || 'AHADEX'}
            </p>

            <h1 className="mt-4 font-serif text-[58px] tracking-[-0.03em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-3 text-[15px] uppercase tracking-[0.25em]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>

            <div className="mt-6 flex gap-7 text-[12px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
            </div>
          </div>

          <div className="absolute bottom-12 right-12">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'editorial':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-0 top-0 h-full w-[34%]"
            style={{ background: template.accentSoft }}
          />

          <div
            className="absolute left-[34%] top-0 h-full w-[2px]"
            style={{ background: template.accent }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-14 top-14 h-32 w-32 rounded-full border-2"
          />

          <div className="absolute left-14 top-14">
            <p
              className="text-xs font-black uppercase tracking-[0.3em]"
              style={{ color: template.accent }}
            >
              {data.companyName || 'AHADEX'}
            </p>

            <h1 className="mt-10 max-w-[600px] text-[62px] font-black leading-[0.84] tracking-[-0.07em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-5 text-[16px]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-12 left-14 right-14 flex items-end justify-between">
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[12px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
              <ContactItem icon={Globe} value={data.website} template={template} />
              <ContactItem icon={Instagram} value={data.instagram} template={template} />
            </div>

            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'minimal':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-14 top-14 h-36 w-36 rounded-2xl border"
          />

          <div className="absolute left-14 top-14">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
              {data.companyName || 'AHADEX'}
            </p>

            <h1 className="mt-12 text-[56px] font-black leading-none tracking-[-0.065em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-3 text-[16px]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div
            className="absolute bottom-16 left-14 right-14 h-px"
            style={{ background: template.accentSoft }}
          />

          <div className="absolute bottom-6 left-14 right-14 flex justify-between text-[12px]">
            <ContactItem icon={Phone} value={data.phone} template={template} />
            <ContactItem icon={Mail} value={data.email} template={template} />
            <ContactItem icon={Globe} value={data.website} template={template} />
          </div>
        </CardFrame>
      );

    case 'grid':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                linear-gradient(${template.accent}14 1px, transparent 1px),
                linear-gradient(90deg, ${template.accent}14 1px, transparent 1px)
              `,
              backgroundSize: '42px 42px',
            }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-12 top-12 h-[250px] w-[210px] rounded-2xl border-2"
          />

          <div className="absolute left-12 top-12">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={data.companyName}
              template={template}
            />
          </div>

          <div className="absolute left-12 bottom-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.28em]"
              style={{ color: template.accent }}
            >
              {data.jobTitle || 'PROFESSIONAL'}
            </p>

            <h1 className="mt-3 text-[52px] font-black tracking-[-0.06em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>
          </div>

          <div className="absolute right-12 bottom-12">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'asymmetric':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute right-0 top-0 h-full w-[35%]"
            style={{ background: template.accentSoft }}
          />

          <div
            className="absolute -right-24 -top-24 h-[430px] w-[430px] rounded-full border-[70px]"
            style={{ borderColor: `${template.accent}20` }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-14 top-14 h-36 w-36 rounded-full border-2"
          />

          <div className="absolute left-14 top-56">
            <NameBlock data={data} template={template} />
          </div>

          <div className="absolute bottom-14 left-14">
            <div className="flex gap-6 text-[12px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
            </div>
          </div>

          <div className="absolute bottom-12 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'glass':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(circle at 15% 20%, ${template.accent}22, transparent 30%), radial-gradient(circle at 85% 80%, ${template.accent2}20, transparent 35%)`,
            }}
          />

          <div className="absolute inset-10 rounded-[30px] border border-white/10 bg-white/[0.045] p-10">
            <div className="flex items-start justify-between">
              <LogoVisual
                logoUrl={data.logoUrl}
                companyName={data.companyName}
                template={template}
              />

              <PhotoPanel
                photoUrl={photo}
                template={template}
                className="relative h-28 w-28 rounded-3xl border-2"
              />
            </div>

            <div className="mt-12">
              <h1 className="text-[50px] font-black tracking-[-0.06em]">
                {data.fullName || 'Mohammad Ahad'}
              </h1>

              <p
                className="mt-2 text-[16px]"
                style={{ color: template.muted }}
              >
                {data.jobTitle || 'Creative Director'}
              </p>
            </div>

            <div className="absolute bottom-8 left-10 right-10 flex justify-between text-[12px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
              <ContactItem icon={Globe} value={data.website} template={template} />
            </div>
          </div>
        </CardFrame>
      );

    case 'frame':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-8 border-2"
            style={{ borderColor: `${template.accent}45` }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-14 top-14 h-36 w-36 rounded-full border-2"
          />

          <div className="absolute left-14 top-14">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={data.companyName}
              template={template}
            />
          </div>

          <div className="absolute left-14 top-48">
            <h1 className="text-[55px] font-black tracking-[-0.06em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-3 text-[16px] uppercase tracking-[0.22em]"
              style={{ color: template.accent }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-14 left-14 right-14 flex items-center justify-between text-[12px]">
            <div className="flex gap-7">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
            </div>

            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'bold':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-0 top-0 h-full w-[14px]"
            style={{ background: template.accent }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-12 top-12 h-[300px] w-[220px] border-4 border-white/20"
          />

          <div className="absolute left-16 top-12">
            <p
              className="text-xs font-black uppercase tracking-[0.35em]"
              style={{ color: template.accent }}
            >
              {data.companyName || 'STATEMENT'}
            </p>

            <h1 className="mt-12 max-w-[650px] text-[74px] font-black uppercase leading-[0.8] tracking-[-0.08em]">
              {data.fullName || 'MOHAMMAD AHAD'}
            </h1>

            <p
              className="mt-7 text-[18px] font-bold uppercase tracking-[0.22em]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'CREATIVE DIRECTOR'}
            </p>
          </div>

          <div className="absolute bottom-14 left-16 right-16 flex items-center justify-between">
            <div className="flex gap-8 text-[13px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
            </div>

            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'split':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-0 top-0 h-full w-[43%]"
            style={{
              background: `linear-gradient(135deg, ${template.accentSoft}, ${template.background})`,
            }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-10 top-10 h-[360px] w-[260px] rounded-[30px] border-2"
          />

          <div className="absolute right-14 top-14 max-w-[470px]">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={data.companyName}
              template={template}
            />

            <div className="mt-14">
              <NameBlock data={data} template={template} />
            </div>
          </div>

          <div className="absolute bottom-12 right-14">
            <div className="flex gap-6 text-[12px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
              <ContactItem icon={Globe} value={data.website} template={template} />
            </div>
          </div>
        </CardFrame>
      );

    case 'prism':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(${template.accent}10 1px, transparent 1px),
                linear-gradient(90deg, ${template.accent}10 1px, transparent 1px)
              `,
              backgroundSize: '44px 44px',
            }}
          />

          <div
            className="absolute -left-24 -top-24 h-[560px] w-[560px] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${template.accent}50, transparent 65%)`,
            }}
          />

          <div
            className="absolute right-[-180px] top-[-240px] h-[620px] w-[620px] rotate-45 border-[90px]"
            style={{ borderColor: `${template.accent2}18` }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-16 top-16 h-[310px] w-[230px] rotate-3 rounded-[30px] border-2"
          />

          <div className="absolute left-14 bottom-14">
            <p
              className="text-sm font-black uppercase tracking-[0.35em]"
              style={{ color: template.accent }}
            >
              DIGITAL IDENTITY
            </p>

            <h1 className="mt-3 text-[64px] font-black leading-[0.9] tracking-[-0.06em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p className="mt-5 text-[15px]" style={{ color: template.muted }}>
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-14 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'monogram':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-5 border"
            style={{ borderColor: `${template.accent}55` }}
          />

          <div
            className="absolute left-10 top-10 text-[150px] font-black leading-none"
            style={{ color: `${template.accent}14` }}
          >
            {getInitials(data.fullName)}
          </div>

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-14 top-14 h-[300px] w-[240px] rounded-full border-2"
          />

          <div className="absolute left-14 bottom-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.38em]"
              style={{ color: template.accent }}
            >
              {data.companyName || 'AHADEX'}
            </p>

            <h1 className="mt-3 text-[58px] font-black tracking-[-0.05em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-2 text-[16px] uppercase tracking-[0.2em]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-12 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'brutalist':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-0 top-0 h-full w-[24px]"
            style={{ background: template.accent2 }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-14 top-12 h-[300px] w-[240px] border-4"
          />

          <div className="absolute left-16 top-12">
            <p className="text-[12px] font-bold uppercase tracking-[0.45em] text-zinc-500">
              BUSINESS IDENTITY / 01
            </p>

            <h1 className="mt-9 max-w-[650px] text-[70px] font-black uppercase leading-[0.82] tracking-[-0.075em]">
              {data.fullName || 'MOHAMMAD AHAD'}
            </h1>

            <p
              className="mt-6 inline-block px-4 py-2 text-sm font-black uppercase tracking-[0.22em]"
              style={{
                background: template.accent,
                color: '#09090b',
              }}
            >
              {data.jobTitle || 'CREATIVE DIRECTOR'}
            </p>
          </div>

          <div className="absolute bottom-12 left-16 right-16 flex items-end justify-between">
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[12px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
              <ContactItem icon={Globe} value={data.website} template={template} />
              <ContactItem icon={MapPin} value={data.address} template={template} />
            </div>

            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'signature':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-7 border"
            style={{ borderColor: `${template.accent}55` }}
          />

          <div
            className="absolute left-12 top-10 text-[92px] font-black leading-none"
            style={{ color: `${template.accent}18` }}
          >
            {getInitials(data.fullName)}
          </div>

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-14 top-14 h-[270px] w-[210px] rounded-[18px] border-2"
          />

          <div className="absolute left-14 bottom-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.38em]"
              style={{ color: template.accent }}
            >
              {data.companyName || 'SIGNATURE STUDIO'}
            </p>

            <h1 className="mt-3 text-[58px] font-black tracking-[-0.05em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-2 text-[17px] uppercase tracking-[0.2em]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-12 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'diagonal':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute -left-28 -top-24 h-[760px] w-[430px] rotate-[18deg]"
            style={{
              background: `linear-gradient(180deg, ${template.accentSoft}, transparent)`,
            }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-16 top-16 h-[360px] w-[240px] rotate-[-6deg] rounded-[28px] border-2"
          />

          <div className="absolute right-14 top-14 max-w-[600px]">
            <p
              className="text-xs font-black uppercase tracking-[0.35em]"
              style={{ color: template.accent }}
            >
              PERSONAL BRAND
            </p>

            <h1 className="mt-8 text-[64px] font-black leading-[0.86] tracking-[-0.07em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-5 text-[17px]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-14 right-14">
            <div className="flex gap-6 text-[12px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
            </div>
          </div>
        </CardFrame>
      );

    case 'halo':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-[-120px] top-[-140px] h-[620px] w-[620px] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${template.accent}35, transparent 62%)`,
            }}
          />

          <div
            className="absolute left-14 top-14 h-[350px] w-[350px] rounded-full border"
            style={{
              borderColor: `${template.accent}40`,
              boxShadow: `0 0 100px ${template.accent}25`,
            }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-20 top-20 h-[300px] w-[280px] rounded-full border-2"
          />

          <div className="absolute right-14 top-14 max-w-[520px]">
            <p
              className="text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: template.accent }}
            >
              BLACK LABEL
            </p>

            <h1 className="mt-7 text-[64px] font-black leading-[0.9] tracking-[-0.065em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-4 text-[16px] uppercase tracking-[0.2em]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-14 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'gradient':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 80% 20%, ${template.accent}42, transparent 35%), radial-gradient(circle at 20% 85%, ${template.accent2}38, transparent 40%)`,
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(125deg, ${template.background}, transparent 55%, ${template.accentSoft})`,
            }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-14 top-14 h-[330px] w-[245px] rounded-[34px] border-2"
          />

          <div className="absolute right-14 top-14 max-w-[600px]">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={data.companyName}
              template={template}
            />

            <h1 className="mt-16 text-[66px] font-black leading-[0.88] tracking-[-0.07em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-4 text-[17px]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-12 left-14 right-14 flex justify-between text-[12px]">
            <ContactItem icon={Phone} value={data.phone} template={template} />
            <ContactItem icon={Mail} value={data.email} template={template} />
            <ContactItem icon={Globe} value={data.website} template={template} />
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'duotone':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-0 top-0 h-full w-[45%]"
            style={{ background: template.accent }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-14 top-14 h-[370px] w-[270px] rounded-[8px] border-4"
          />

          <div className="absolute right-14 top-14 max-w-[570px]">
            <p
              className="text-xs font-black uppercase tracking-[0.4em]"
              style={{ color: template.accent }}
            >
              DUOTONE IDENTITY
            </p>

            <h1 className="mt-10 text-[65px] font-black leading-[0.84] tracking-[-0.07em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-5 text-[17px]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-12 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'cutout':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute -left-20 -top-32 h-[500px] w-[500px] rounded-full"
            style={{ background: template.accentSoft }}
          />

          <div
            className="absolute right-[-100px] bottom-[-180px] h-[500px] w-[500px] rounded-full border-[80px]"
            style={{ borderColor: `${template.accent2}25` }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-16 top-16 h-[350px] w-[250px] rounded-[45%_55%_40%_60%] border-4"
          />

          <div className="absolute right-14 top-14 max-w-[580px]">
            <p
              className="text-xs font-black uppercase tracking-[0.35em]"
              style={{ color: template.accent }}
            >
              ART DIRECTION
            </p>

            <h1 className="mt-8 text-[64px] font-black leading-[0.86] tracking-[-0.07em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-5 text-[17px]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-14 right-14">
            <div className="flex gap-6 text-[12px]">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
            </div>
          </div>
        </CardFrame>
      );

    case 'orbit':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-14 top-14 h-[330px] w-[330px] rounded-full border"
            style={{ borderColor: `${template.accent}35` }}
          />

          <div
            className="absolute left-[-35px] top-[170px] h-px w-[430px] rotate-[28deg]"
            style={{ background: template.accent }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-20 top-20 h-[270px] w-[270px] rounded-full border-2"
          />

          <div className="absolute right-14 top-14 max-w-[550px]">
            <p
              className="text-xs font-black uppercase tracking-[0.4em]"
              style={{ color: template.accent }}
            >
              FUTURE SYSTEMS
            </p>

            <h1 className="mt-8 text-[63px] font-black leading-[0.87] tracking-[-0.07em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-5 text-[17px]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-14 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'neo':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-0 top-0 h-[12px] w-full"
            style={{ background: template.accent2 }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="right-12 top-12 h-[360px] w-[250px] border-4"
          />

          <div className="absolute left-16 top-14">
            <p className="text-[12px] font-black uppercase tracking-[0.45em]">
              SYSTEM / 023
            </p>

            <h1 className="mt-10 max-w-[620px] text-[76px] font-black uppercase leading-[0.76] tracking-[-0.085em]">
              {data.fullName || 'MOHAMMAD AHAD'}
            </h1>

            <p
              className="mt-8 inline-block px-4 py-2 text-sm font-black uppercase tracking-[0.22em]"
              style={{
                background: template.accent,
                color: '#020617',
              }}
            >
              {data.jobTitle || 'CREATIVE DIRECTOR'}
            </p>
          </div>

          <div className="absolute bottom-12 left-16 right-16 flex justify-between text-[12px]">
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              <ContactItem icon={Phone} value={data.phone} template={template} />
              <ContactItem icon={Mail} value={data.email} template={template} />
              <ContactItem icon={Globe} value={data.website} template={template} />
              <ContactItem icon={MapPin} value={data.address} template={template} />
            </div>

            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'vertical':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute left-0 top-0 h-full w-[25%]"
            style={{ background: template.accentSoft }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-10 top-10 h-[500px] w-[205px] rounded-[26px] border-2"
          />

          <div className="absolute left-[31%] top-14 right-14">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={data.companyName}
              template={template}
            />

            <h1 className="mt-12 text-[62px] font-black leading-[0.85] tracking-[-0.07em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-5 text-[17px]"
              style={{ color: template.accent }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-14 left-[31%] right-14 grid grid-cols-2 gap-3 text-[12px]">
            <ContactItem icon={Phone} value={data.phone} template={template} />
            <ContactItem icon={Mail} value={data.email} template={template} />
            <ContactItem icon={Globe} value={data.website} template={template} />
            <ContactItem icon={MapPin} value={data.address} template={template} />
          </div>
        </CardFrame>
      );

    case 'badge':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-8 rounded-[28px] border"
            style={{ borderColor: `${template.accent}35` }}
          />

          <div
            className="absolute left-14 top-14 h-[330px] w-[330px] rounded-full border-[14px]"
            style={{ borderColor: `${template.accent}22` }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="left-24 top-24 h-[250px] w-[250px] rounded-full border-4"
          />

          <div className="absolute right-14 top-14 max-w-[470px] text-right">
            <p
              className="text-xs font-black uppercase tracking-[0.4em]"
              style={{ color: template.accent }}
            >
              EST. AHADEX
            </p>

            <h1 className="mt-8 text-[60px] font-black leading-[0.88] tracking-[-0.065em]">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p
              className="mt-4 text-[16px] uppercase tracking-[0.2em]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'Creative Director'}
            </p>
          </div>

          <div className="absolute bottom-12 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    case 'cinematic':
      return (
        <CardFrame template={template} cardRef={cardRef}>
          <div
            className="absolute inset-0"
            style={{
              background:
                `linear-gradient(90deg, rgba(0,0,0,.85), transparent 60%), radial-gradient(circle at 80% 20%, ${template.accent}18, transparent 32%)`,
            }}
          />

          <PhotoPanel
            photoUrl={photo}
            template={template}
            className="inset-y-0 right-0 w-[48%] border-l-2"
          />

          <div className="absolute left-14 top-14 max-w-[570px]">
            <p
              className="text-xs font-bold uppercase tracking-[0.45em]"
              style={{ color: template.accent }}
            >
              BLACK LABEL
            </p>

            <h1 className="mt-10 text-[66px] font-black leading-[0.84] tracking-[-0.07em] text-white">
              {data.fullName || 'Mohammad Ahad'}
            </h1>

            <p className="mt-5 text-[17px] uppercase tracking-[0.2em] text-zinc-400">
              {data.jobTitle || 'Creative Director'}
            </p>

            <div className="mt-8 h-px w-32" style={{ background: template.accent }} />
          </div>

          <div className="absolute bottom-14 left-14 right-[53%] space-y-2 text-[12px] text-zinc-300">
            <ContactItem icon={Phone} value={data.phone} template={template} />
            <ContactItem icon={Mail} value={data.email} template={template} />
            <ContactItem icon={Globe} value={data.website} template={template} />
          </div>

          <div className="absolute bottom-12 right-14">
            <QrVisual src={qrSrc} />
          </div>
        </CardFrame>
      );

    default:
      return null;
  }
};

const VisitingCardEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const { addToast } = useToast();

  const template = useMemo(
    () => getTemplate(templateId),
    [templateId],
  );

  const [data, setData] = useState<CardData>(DEMO_CARD_DATA);
  const [qrSrc, setQrSrc] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'jpg' | 'pdf' | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const exportHostRef = useRef<HTMLDivElement | null>(null);

  const updateField = (
    key: keyof CardData,
    value: string,
  ) => {
    setData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateFile =
    (key: 'photoUrl' | 'logoUrl') =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith('image/')) {
        addToast(
          'Invalid image',
          'Please select a JPG, PNG, WebP or compatible image file.',
          'error',
        );
        return;
      }

      try {
        const url = await readFileAsDataUrl(file);

        setData((current) => ({
          ...current,
          [key]: url,
        }));
      } catch {
        addToast(
          'Upload failed',
          'The selected image could not be loaded.',
          'error',
        );
      } finally {
        event.target.value = '';
      }
    };

  useEffect(() => {
    let active = true;

    const qrPayload = [
      data.fullName,
      data.companyName,
      data.phone,
      data.whatsapp,
      data.email,
      data.website,
      data.linkedin,
      data.instagram,
      data.address,
    ]
      .filter((value) => value.trim())
      .join(' | ');

    QRCode.toDataURL(qrPayload || 'https://ahadex.fun', {
      width: 700,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) setQrSrc(url);
      })
      .catch(() => {
        if (active) setQrSrc('');
      });

    return () => {
      active = false;
    };
  }, [
    data.fullName,
    data.companyName,
    data.phone,
    data.whatsapp,
    data.email,
    data.website,
    data.linkedin,
    data.instagram,
    data.address,
  ]);

  const buildExportSurface = async () => {
    if (!cardRef.current || !exportHostRef.current) {
      throw new Error('Card preview is not ready.');
    }

    const host = exportHostRef.current;

    host.innerHTML = '';

    const exportCard = cardRef.current.cloneNode(
      true,
    ) as HTMLDivElement;

    exportCard.style.width = `${CARD_WIDTH_PX}px`;
    exportCard.style.height = `${CARD_HEIGHT_PX}px`;
    exportCard.style.minWidth = `${CARD_WIDTH_PX}px`;
    exportCard.style.maxWidth = `${CARD_WIDTH_PX}px`;
    exportCard.style.minHeight = `${CARD_HEIGHT_PX}px`;
    exportCard.style.maxHeight = `${CARD_HEIGHT_PX}px`;
    exportCard.style.aspectRatio = 'auto';
    exportCard.style.position = 'relative';
    exportCard.style.left = 'auto';
    exportCard.style.top = 'auto';
    exportCard.style.transform = 'none';
    exportCard.style.margin = '0';
    exportCard.style.boxShadow = 'none';
    exportCard.style.borderRadius = '0';

    host.appendChild(exportCard);

    host.style.display = 'block';
    host.style.position = 'fixed';
    host.style.left = '0';
    host.style.top = '0';
    host.style.width = `${CARD_WIDTH_PX}px`;
    host.style.height = `${CARD_HEIGHT_PX}px`;
    host.style.overflow = 'hidden';
    host.style.zIndex = '2147483647';
    host.style.pointerEvents = 'none';
    host.style.opacity = '1';

    await waitForFonts();
    await waitForImages(exportCard);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    return exportCard;
  };

  const cleanupExportSurface = () => {
    if (!exportHostRef.current) return;

    exportHostRef.current.innerHTML = '';
    exportHostRef.current.style.display = 'none';
  };

  const renderExportJpeg = async () => {
    const exportCard = await buildExportSurface();

    try {
      const dataUrl = await toJpeg(exportCard, {
        width: CARD_WIDTH_PX,
        height: CARD_HEIGHT_PX,
        quality: 0.98,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: template.background,
      });

      if (!dataUrl || dataUrl === 'data:,') {
        throw new Error('Image export produced an empty file.');
      }

      return dataUrl;
    } finally {
      cleanupExportSurface();
    }
  };

  const downloadDataUrl = (
    dataUrl: string,
    filename: string,
  ) => {
    const anchor = document.createElement('a');

    anchor.href = dataUrl;
    anchor.download = filename;
    anchor.rel = 'noopener';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const downloadJpg = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportType('jpg');

    try {
      const dataUrl = await renderExportJpeg();

      downloadDataUrl(
        dataUrl,
        `ahadex-1-side-visiting-card-${templateId || '01'}.jpg`,
      );

      addToast(
        'JPG ready',
        'Your 1050 × 600 print-ready visiting card has been downloaded.',
        'success',
      );
    } catch (error) {
      console.error(error);

      addToast(
        'JPG export failed',
        'The card could not be rendered. Please try again.',
        'error',
      );
    } finally {
      cleanupExportSurface();
      setIsExporting(false);
      setExportType(null);
    }
  };

  const downloadPdf = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportType('pdf');

    try {
      const dataUrl = await renderExportJpeg();

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [CARD_WIDTH_IN, CARD_HEIGHT_IN],
        compress: true,
      });

      pdf.addImage(
        dataUrl,
        'JPEG',
        0,
        0,
        CARD_WIDTH_IN,
        CARD_HEIGHT_IN,
        undefined,
        'FAST',
      );

      pdf.save(
        `ahadex-1-side-visiting-card-${templateId || '01'}.pdf`,
      );

      addToast(
        'PDF ready',
        'Your exact 3.5 × 2 inch visiting card PDF has been downloaded.',
        'success',
      );
    } catch (error) {
      console.error(error);

      addToast(
        'PDF export failed',
        'The card could not be rendered. Please try again.',
        'error',
      );
    } finally {
      cleanupExportSurface();
      setIsExporting(false);
      setExportType(null);
    }
  };

  const resetCard = () => {
    setData(DEMO_CARD_DATA);

    addToast(
      'Demo restored',
      'Mohammad Ahad demo information has been restored.',
      'success',
    );
  };

  return (
    <PageTransition>
      <SEOHead
        title={`${template.name} 1-Side Visiting Card Generator | AHADEX TOOLS`}
        description={`Create a premium one-sided visiting card using the ${template.name} template. Add your photo, logo, contact information and QR code, then export a print-ready JPG or exact 3.5 × 2 inch PDF.`}
        keywords={[
          '1-side visiting card generator',
          'single side business card generator',
          'premium visiting card maker',
          'business card maker',
          'photo visiting card generator',
          'print ready visiting card',
          'JPG visiting card',
          'PDF visiting card',
          template.name,
        ]}
      />

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() =>
                navigate('/tools/visiting-card-generator/one-side')
              }
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to 1-Side Templates
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
                1-SIDE ONLY
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-400">
                {template.name}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-400">
                {Object.keys(TEMPLATE_STYLES).length} Designs
              </span>
            </div>
          </div>

          <div className="mb-7">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: `${template.accent}14`,
                  color: template.accent,
                }}
              >
                <Palette className="h-5 w-5" />
              </div>

              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                  style={{ color: template.accent }}
                >
                  Premium 1-Side Visiting Card
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {template.name}
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {template.description} Every design keeps a dedicated
              professional photo as a core visual element.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
            <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Card Information
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Demo content uses Mohammad Ahad. Replace anything you need.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetCard}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.05]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Demo
                </button>
              </div>

              <div className="space-y-4">
                <UploadBox
                  label="Profile Photo"
                  description="Every template uses this photo"
                  icon={ImagePlus}
                  accept="image/*"
                  preview={data.photoUrl}
                  onChange={updateFile('photoUrl')}
                />

                <UploadBox
                  label="Company Logo"
                  description="PNG recommended"
                  icon={Building2}
                  accept="image/*"
                  preview={data.logoUrl}
                  onChange={updateFile('logoUrl')}
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <Field
                    label="Full Name"
                    value={data.fullName}
                    onChange={(value) => updateField('fullName', value)}
                    placeholder="Mohammad Ahad"
                    icon={UserRound}
                  />

                  <Field
                    label="Job Title"
                    value={data.jobTitle}
                    onChange={(value) => updateField('jobTitle', value)}
                    placeholder="Creative Director"
                    icon={Sparkles}
                  />

                  <Field
                    label="Company"
                    value={data.companyName}
                    onChange={(value) => updateField('companyName', value)}
                    placeholder="AHADEX"
                    icon={Building2}
                  />

                  <Field
                    label="Phone"
                    value={data.phone}
                    onChange={(value) => updateField('phone', value)}
                    placeholder="+971 50 000 0000"
                    icon={Phone}
                  />

                  <Field
                    label="WhatsApp"
                    value={data.whatsapp}
                    onChange={(value) => updateField('whatsapp', value)}
                    placeholder="+971 50 000 0000"
                    icon={MessageCircle}
                  />

                  <Field
                    label="Email"
                    value={data.email}
                    onChange={(value) => updateField('email', value)}
                    placeholder="hello@ahadex.fun"
                    icon={Mail}
                  />

                  <Field
                    label="Website"
                    value={data.website}
                    onChange={(value) => updateField('website', value)}
                    placeholder="ahadex.fun"
                    icon={Globe}
                  />

                  <Field
                    label="Address"
                    value={data.address}
                    onChange={(value) => updateField('address', value)}
                    placeholder="Sharjah · Dubai · UAE"
                    icon={MapPin}
                  />

                  <Field
                    label="LinkedIn"
                    value={data.linkedin}
                    onChange={(value) => updateField('linkedin', value)}
                    placeholder="linkedin.com/in/mohammadahad"
                    icon={Linkedin}
                  />

                  <Field
                    label="Instagram"
                    value={data.instagram}
                    onChange={(value) => updateField('instagram', value)}
                    placeholder="@mohammadahad"
                    icon={Instagram}
                  />

                  <Field
                    label="Short Bio"
                    value={data.bio}
                    onChange={(value) => updateField('bio', value)}
                    placeholder="Digital creator building modern tools."
                    icon={Sparkles}
                    multiline
                  />
                </div>
              </div>
            </section>

            <section className="min-w-0">
              <div className="sticky top-6">
                <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-black text-white">
                        Live Preview
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Final export: 1050 × 600 px
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={downloadJpg}
                        disabled={isExporting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {exportType === 'jpg' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        JPG
                      </button>

                      <button
                        type="button"
                        onClick={downloadPdf}
                        disabled={isExporting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {exportType === 'pdf' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="overflow-auto rounded-[24px] border border-white/10 bg-black/30 p-3 sm:p-5">
                    <div className="mx-auto w-full max-w-[1050px]">
                      <div
                        className="relative w-full overflow-hidden"
                        style={{
                          aspectRatio: '1050 / 600',
                        }}
                      >
                        <div
                          className="absolute left-0 top-0 origin-top-left"
                          style={{
                            width: `${CARD_WIDTH_PX}px`,
                            height: `${CARD_HEIGHT_PX}px`,
                            transform: 'scale(var(--card-scale))',
                          }}
                        >
                          <CardContent
                            template={template}
                            data={data}
                            qrSrc={qrSrc}
                            cardRef={cardRef}
                          />
                        </div>

                        <style>
                          {`
                            .card-preview-scale {
                              --card-scale: 1;
                            }
                          `}
                        </style>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">
                        24 Premium Designs
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Photo-first layouts
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">
                        Exact PDF
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        3.5 × 2 inches
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">
                        High Quality JPG
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        1050 × 600 px
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div
          ref={exportHostRef}
          aria-hidden="true"
          style={{
            display: 'none',
            width: `${CARD_WIDTH_PX}px`,
            height: `${CARD_HEIGHT_PX}px`,
          }}
        />
      </main>
    </PageTransition>
  );
};

export default VisitingCardEditorPage;",
[L3]   "title": "VisitingCardEditorPage.tsx",
[L4]   "modified_date": "2026-09-17T21:37:40Z",
[L5]   "url": "https://github.com/mdahadvi91/Ahadex-tools-/blob/main/src/pages/VisitingCardEditorPage.tsx",
[L6]   "display_url": "https://github.com/mdahadvi91/Ahadex-tools-/blob/main/src/pages/VisitingCardEditorPage.tsx",
[L7]   "display_title": "VisitingCardEditorPage.tsx"
}