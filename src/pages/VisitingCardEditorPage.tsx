import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  | 'signature';

type TemplateStyle = {
  name: string;
  category: string;
  accent: string;
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

const EMPTY_CARD_DATA: CardData = {
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

const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  '01': {
    name: 'Executive Portrait',
    category: 'Executive',
    accent: '#38bdf8',
    accentSoft: '#082f49',
    background: '#07111f',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'portrait',
    description: 'Confident executive identity with strong portrait focus.',
  },

  '02': {
    name: 'Obsidian Gold',
    category: 'Luxury',
    accent: '#d4af6a',
    accentSoft: '#5b4316',
    background: '#080706',
    foreground: '#fff8e7',
    muted: '#a8a29e',
    layout: 'monogram',
    description: 'Deep black luxury composition with gold geometry and signature typography.',
  },

  '03': {
    name: 'Editorial Rose',
    category: 'Editorial',
    accent: '#fb7185',
    accentSoft: '#4c0519',
    background: '#fff9fa',
    foreground: '#18181b',
    muted: '#71717a',
    layout: 'editorial',
    description: 'Elegant editorial composition for personal brands and creatives.',
  },

  '04': {
    name: 'Swiss Minimal',
    category: 'Minimal',
    accent: '#111827',
    accentSoft: '#e5e7eb',
    background: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'minimal',
    description: 'Clean typographic system with disciplined spacing.',
  },

  '05': {
    name: 'Cyber Prism',
    category: 'Technology',
    accent: '#67e8f9',
    accentSoft: '#164e63',
    background: '#030712',
    foreground: '#ecfeff',
    muted: '#94a3b8',
    layout: 'prism',
    description: 'Futuristic layered glass, neon prism and technical grid treatment.',
  },

  '06': {
    name: 'Architect Grid',
    category: 'Architecture',
    accent: '#60a5fa',
    accentSoft: '#172554',
    background: '#081321',
    foreground: '#eff6ff',
    muted: '#93c5fd',
    layout: 'grid',
    description: 'Precision grid system inspired by architecture and engineering.',
  },

  '07': {
    name: 'Creative Offset',
    category: 'Creative',
    accent: '#34d399',
    accentSoft: '#064e3b',
    background: '#061814',
    foreground: '#ecfdf5',
    muted: '#86efac',
    layout: 'asymmetric',
    description: 'Asymmetric creative identity with energetic offset geometry.',
  },

  '08': {
    name: 'Neo Editorial',
    category: 'Modern',
    accent: '#f5f5f5',
    accentSoft: '#3f3f46',
    background: '#111113',
    foreground: '#fafafa',
    muted: '#a1a1aa',
    layout: 'brutalist',
    description: 'High-contrast editorial typography with brutalist visual structure.',
  },

  '09': {
    name: 'Cobalt Frame',
    category: 'Corporate',
    accent: '#2563eb',
    accentSoft: '#dbeafe',
    background: '#f8fbff',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'frame',
    description: 'Professional corporate frame with a sharp blue identity.',
  },

  '10': {
    name: 'Rose Atelier',
    category: 'Personal Brand',
    accent: '#e11d48',
    accentSoft: '#ffe4e6',
    background: '#fff7f8',
    foreground: '#3f0b18',
    muted: '#881337',
    layout: 'editorial',
    description: 'Soft premium identity for consultants and personal brands.',
  },

  '11': {
    name: 'Copper Heritage',
    category: 'Heritage',
    accent: '#ea580c',
    accentSoft: '#431407',
    background: '#1a100a',
    foreground: '#fff7ed',
    muted: '#fdba74',
    layout: 'frame',
    description: 'Warm heritage aesthetic with copper accents and deep charcoal.',
  },

  '12': {
    name: 'Aqua Digital',
    category: 'Technology',
    accent: '#2dd4bf',
    accentSoft: '#134e4a',
    background: '#031817',
    foreground: '#f0fdfa',
    muted: '#99f6e4',
    layout: 'grid',
    description: 'Digital-first identity with aqua glow and technical structure.',
  },

  '13': {
    name: 'Royal Monogram',
    category: 'Signature',
    accent: '#f4d27a',
    accentSoft: '#4a3511',
    background: '#090909',
    foreground: '#fff9e8',
    muted: '#b5b0a4',
    layout: 'signature',
    description: 'High-end monogram composition with elegant frame architecture.',
  },

  '14': {
    name: 'Solar Statement',
    category: 'Bold',
    accent: '#facc15',
    accentSoft: '#422006',
    background: '#171208',
    foreground: '#fefce8',
    muted: '#fde68a',
    layout: 'bold',
    description: 'Bold yellow statement design with oversized typography.',
  },

  '15': {
    name: 'Ocean Studio',
    category: 'Studio',
    accent: '#06b6d4',
    accentSoft: '#164e63',
    background: '#061923',
    foreground: '#ecfeff',
    muted: '#67e8f9',
    layout: 'split',
    description: 'Contemporary studio identity with deep ocean gradients.',
  },

  '16': {
    name: 'Silver Classic',
    category: 'Classic',
    accent: '#64748b',
    accentSoft: '#e2e8f0',
    background: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'frame',
    description: 'Timeless professional layout with restrained silver accents.',
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
    .toUpperCase() || 'AH';

const readFileAsDataUrl = (
  file: File,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read file.'));
      }
    };

    reader.onerror = () =>
      reject(reader.error || new Error('Unable to read file.'));

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
      // Font loading failure should never block export.
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
}: {
  photoUrl: string | null;
  accent: string;
  large?: boolean;
}) => (
  <div
    className={`relative shrink-0 overflow-hidden rounded-full border-2 ${
      large ? 'h-28 w-28' : 'h-16 w-16'
    }`}
    style={{
      borderColor: `${accent}99`,
      boxShadow: `0 0 0 6px ${accent}16, 0 0 35px ${accent}18`,
    }}
  >
    {photoUrl ? (
      <img
        src={photoUrl}
        alt=""
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-white/10">
        <UserRound
          className={large ? 'h-12 w-12' : 'h-7 w-7'}
          style={{ color: accent }}
        />
      </div>
    )}
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

const QrVisual = ({
  src,
}: {
  src: string;
}) => {
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

const OneSideCard = ({
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
  const initials = getInitials(data.fullName);

  if (template.layout === 'monogram') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute inset-5 border"
          style={{ borderColor: `${template.accent}55` }}
        />

        <div
          className="absolute left-10 top-10 h-36 w-36 rounded-full border"
          style={{
            borderColor: `${template.accent}45`,
            boxShadow: `0 0 80px ${template.accent}18`,
          }}
        />

        <div
          className="absolute -right-32 -bottom-44 h-[520px] w-[520px] rounded-full border-[2px]"
          style={{
            borderColor: `${template.accent}25`,
          }}
        />

        <div className="absolute left-12 top-12">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={data.companyName}
            template={template}
          />
        </div>

        <div className="absolute left-14 top-40 max-w-[590px]">
          <p
            className="mb-3 text-[15px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: template.accent }}
          >
            {data.companyName || 'PRIVATE IDENTITY'}
          </p>

          <h1 className="text-[62px] font-black leading-[0.92] tracking-[-0.055em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-5 text-[19px] font-medium uppercase tracking-[0.18em]"
            style={{ color: template.muted }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute bottom-12 left-14 right-14 flex items-end justify-between">
          <div className="space-y-2 text-[15px]">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
            <ContactItem
              icon={Globe}
              value={data.website}
              template={template}
            />
          </div>

          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'prism') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(${template.accent}12 1px, transparent 1px),
              linear-gradient(90deg, ${template.accent}12 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        <div
          className="absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${template.accent}45, transparent 65%)`,
          }}
        />

        <div
          className="absolute right-[-180px] top-[-220px] h-[600px] w-[600px] rotate-45 border-[90px]"
          style={{
            borderColor: `${template.accent}14`,
          }}
        />

        <div className="absolute left-12 top-12 flex items-center gap-4">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={data.companyName}
            template={template}
          />

          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.28em]"
              style={{ color: template.accent }}
            >
              {data.companyName || 'AHADEX STUDIO'}
            </p>

            <p
              className="mt-1 text-xs"
              style={{ color: template.muted }}
            >
              DIGITAL IDENTITY
            </p>
          </div>
        </div>

        <div className="absolute bottom-14 left-14">
          <p
            className="mb-3 text-sm font-bold uppercase tracking-[0.35em]"
            style={{ color: template.accent }}
          >
            {data.jobTitle || 'CREATIVE PROFESSIONAL'}
          </p>

          <h1 className="text-[64px] font-black leading-[0.9] tracking-[-0.06em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <div
            className="mt-6 h-px w-64"
            style={{ background: template.accent }}
          />

          <p
            className="mt-4 max-w-[520px] text-[14px] leading-6"
            style={{ color: template.muted }}
          >
            {data.bio ||
              'Create a powerful professional identity with a modern digital-first business card.'}
          </p>
        </div>

        <div className="absolute bottom-14 right-14">
          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'brutalist') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute left-0 top-0 h-full w-[24px]"
          style={{ background: template.accent }}
        />

        <div
          className="absolute right-0 top-0 h-full w-[10px]"
          style={{ background: template.accent }}
        />

        <div className="absolute left-16 top-12">
          <p className="text-[12px] font-bold uppercase tracking-[0.45em] text-zinc-500">
            BUSINESS IDENTITY / 01
          </p>

          <h1 className="mt-9 max-w-[680px] text-[70px] font-black uppercase leading-[0.82] tracking-[-0.075em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-6 inline-block px-4 py-2 text-sm font-black uppercase tracking-[0.22em]"
            style={{
              background: template.accent,
              color: '#09090b',
            }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute bottom-12 left-16 right-16 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[13px]">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
            <ContactItem
              icon={Globe}
              value={data.website}
              template={template}
            />
            <ContactItem
              icon={MapPin}
              value={data.address}
              template={template}
            />
          </div>

          <div className="flex items-center gap-4">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={data.companyName}
              template={template}
            />
            {qrSrc ? <QrVisual src={qrSrc} /> : null}
          </div>
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'signature') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute inset-7 rounded-[2px] border"
          style={{ borderColor: `${template.accent}55` }}
        />

        <div
          className="absolute left-12 top-12 text-[90px] font-black leading-none"
          style={{
            color: `${template.accent}20`,
          }}
        >
          {initials}
        </div>

        <div className="absolute right-14 top-14">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={data.companyName}
            template={template}
          />
        </div>

        <div className="absolute left-14 bottom-14">
          <p
            className="text-xs font-bold uppercase tracking-[0.38em]"
            style={{ color: template.accent }}
          >
            {data.companyName || 'SIGNATURE STUDIO'}
          </p>

          <h1 className="mt-3 text-[58px] font-black tracking-[-0.05em]">
            {data.fullName || 'Your Name'}
          </h1>

          <p
            className="mt-2 text-[17px] uppercase tracking-[0.2em]"
            style={{ color: template.muted }}
          >
            {data.jobTitle || 'Your Position'}
          </p>

          <div className="mt-7 flex gap-7 text-[13px]">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
          </div>
        </div>

        <div className="absolute bottom-12 right-14">
          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'portrait') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div className="absolute inset-y-0 left-0 w-[38%]">
          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: template.accentSoft }}
            >
              <UserRound
                className="h-28 w-28"
                style={{ color: template.accent }}
              />
            </div>
          )}

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent 50%, ${template.background} 100%)`,
            }}
          />
        </div>

        <div className="absolute left-[42%] right-12 top-12">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={data.companyName}
            template={template}
          />

          <p
            className="mt-8 text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: template.accent }}
          >
            {data.companyName || 'YOUR COMPANY'}
          </p>

          <h1 className="mt-2 text-[50px] font-black leading-none tracking-[-0.055em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-3 text-[17px]"
            style={{ color: template.muted }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute bottom-12 left-[42%] right-12">
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-[12px]">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
            <ContactItem
              icon={Globe}
              value={data.website}
              template={template}
            />
            <ContactItem
              icon={MapPin}
              value={data.address}
              template={template}
            />
          </div>
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'luxury') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute inset-7 rounded-2xl border"
          style={{ borderColor: `${template.accent}40` }}
        />

        <div
          className="absolute left-0 top-0 h-full w-[5px]"
          style={{ background: template.accent }}
        />

        <div className="absolute left-14 top-14">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={data.companyName}
            template={template}
          />
        </div>

        <div className="absolute left-14 top-44">
          <h1 className="text-[54px] font-black tracking-[-0.055em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-3 text-[16px] uppercase tracking-[0.25em]"
            style={{ color: template.accent }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute bottom-14 left-14 flex gap-7 text-[13px]">
          <ContactItem
            icon={Phone}
            value={data.phone}
            template={template}
          />
          <ContactItem
            icon={Mail}
            value={data.email}
            template={template}
          />
          <ContactItem
            icon={Globe}
            value={data.website}
            template={template}
          />
        </div>

        <div className="absolute right-14 bottom-14">
          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'editorial') {
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

        <div className="absolute left-14 top-14">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: template.accent }}
          >
            {data.companyName || 'STUDIO'}
          </p>

          <h1 className="mt-10 max-w-[580px] text-[58px] font-black leading-[0.88] tracking-[-0.065em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-5 text-[16px]"
            style={{ color: template.muted }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute right-14 top-14">
          <ProfileVisual
            photoUrl={data.photoUrl}
            accent={template.accent}
            large
          />
        </div>

        <div className="absolute bottom-14 left-14 right-14 flex items-end justify-between">
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-[13px]">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
            <ContactItem
              icon={Globe}
              value={data.website}
              template={template}
            />
            <ContactItem
              icon={Instagram}
              value={data.instagram}
              template={template}
            />
          </div>

          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'minimal') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div className="absolute left-14 top-14">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            {data.companyName || 'COMPANY'}
          </p>

          <h1 className="mt-12 text-[56px] font-black leading-none tracking-[-0.065em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-3 text-[16px]"
            style={{ color: template.muted }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute right-14 top-14">
          <LogoVisual
            logoUrl={data.logoUrl}
            companyName={data.companyName}
            template={template}
          />
        </div>

        <div
          className="absolute bottom-14 left-14 right-14 h-px"
          style={{ background: template.accentSoft }}
        />

        <div className="absolute bottom-6 left-14 right-14 flex justify-between text-[12px]">
          <ContactItem
            icon={Phone}
            value={data.phone}
            template={template}
          />
          <ContactItem
            icon={Mail}
            value={data.email}
            template={template}
          />
          <ContactItem
            icon={Globe}
            value={data.website}
            template={template}
          />
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'grid') {
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
            {data.fullName || 'YOUR NAME'}
          </h1>
        </div>

        <div className="absolute right-12 top-14 w-[330px]">
          <div
            className="rounded-2xl border p-5 backdrop-blur-xl"
            style={{
              borderColor: `${template.accent}35`,
              background: `${template.accent}0a`,
            }}
          >
            <div className="space-y-4 text-[13px]">
              <ContactItem
                icon={Phone}
                value={data.phone}
                template={template}
              />
              <ContactItem
                icon={MessageCircle}
                value={data.whatsapp}
                template={template}
              />
              <ContactItem
                icon={Mail}
                value={data.email}
                template={template}
              />
              <ContactItem
                icon={Globe}
                value={data.website}
                template={template}
              />
              <ContactItem
                icon={MapPin}
                value={data.address}
                template={template}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12">
          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'asymmetric') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute right-0 top-0 h-full w-[34%]"
          style={{ background: template.accentSoft }}
        />

        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[80px]"
          style={{ borderColor: `${template.accent}20` }}
        />

        <div className="absolute left-14 top-14">
          <ProfileVisual
            photoUrl={data.photoUrl}
            accent={template.accent}
            large
          />
        </div>

        <div className="absolute left-14 top-52">
          <h1 className="text-[58px] font-black leading-none tracking-[-0.065em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-4 text-[17px] font-semibold"
            style={{ color: template.accent }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute bottom-14 left-14">
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: template.muted }}
          >
            {data.companyName || 'YOUR COMPANY'}
          </p>

          <div className="flex gap-6 text-[13px]">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
          </div>
        </div>

        <div className="absolute right-14 bottom-14">
          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'glass') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(255,255,255,.12), transparent 30%), radial-gradient(circle at 85% 80%, rgba(148,163,184,.12), transparent 35%)',
          }}
        />

        <div className="absolute inset-10 rounded-[28px] border border-white/10 bg-white/[0.035] p-10 backdrop-blur-2xl">
          <div className="flex items-start justify-between">
            <LogoVisual
              logoUrl={data.logoUrl}
              companyName={data.companyName}
              template={template}
            />

            <ProfileVisual
              photoUrl={data.photoUrl}
              accent={template.accent}
            />
          </div>

          <div className="mt-12">
            <h1 className="text-[50px] font-black tracking-[-0.06em]">
              {data.fullName || 'YOUR NAME'}
            </h1>

            <p
              className="mt-2 text-[16px]"
              style={{ color: template.muted }}
            >
              {data.jobTitle || 'YOUR POSITION'}
            </p>
          </div>

          <div className="absolute bottom-8 left-10 right-10 flex justify-between text-[12px]">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
            <ContactItem
              icon={Globe}
              value={data.website}
              template={template}
            />
          </div>
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'frame') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute inset-8 border-2"
          style={{ borderColor: `${template.accent}45` }}
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
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-3 text-[16px] uppercase tracking-[0.22em]"
            style={{ color: template.accent }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute right-14 top-14">
          <ProfileVisual
            photoUrl={data.photoUrl}
            accent={template.accent}
            large
          />
        </div>

        <div className="absolute bottom-14 left-14 right-14 flex items-center justify-between text-[12px]">
          <div className="flex gap-7">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
            <ContactItem
              icon={Globe}
              value={data.website}
              template={template}
            />
          </div>

          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  if (template.layout === 'bold') {
    return (
      <CardFrame template={template} cardRef={cardRef}>
        <div
          className="absolute left-0 top-0 h-full w-[12px]"
          style={{ background: template.accent }}
        />

        <div className="absolute left-16 top-12">
          <p
            className="text-xs font-black uppercase tracking-[0.35em]"
            style={{ color: template.accent }}
          >
            {data.companyName || 'STATEMENT'}
          </p>

          <h1 className="mt-12 max-w-[760px] text-[76px] font-black uppercase leading-[0.8] tracking-[-0.08em]">
            {data.fullName || 'YOUR NAME'}
          </h1>

          <p
            className="mt-7 text-[18px] font-bold uppercase tracking-[0.22em]"
            style={{ color: template.muted }}
          >
            {data.jobTitle || 'YOUR POSITION'}
          </p>
        </div>

        <div className="absolute bottom-14 left-16 right-16 flex items-center justify-between">
          <div className="flex gap-8 text-[13px]">
            <ContactItem
              icon={Phone}
              value={data.phone}
              template={template}
            />
            <ContactItem
              icon={Mail}
              value={data.email}
              template={template}
            />
          </div>

          {qrSrc ? <QrVisual src={qrSrc} /> : null}
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame template={template} cardRef={cardRef}>
      <div
        className="absolute inset-y-0 left-0 w-[42%]"
        style={{ background: template.accentSoft }}
      />

      <div className="absolute left-14 top-14">
        <LogoVisual
          logoUrl={data.logoUrl}
          companyName={data.companyName}
          template={template}
        />

        <h1 className="mt-12 text-[52px] font-black leading-none tracking-[-0.06em]">
          {data.fullName || 'YOUR NAME'}
        </h1>

        <p
          className="mt-3 text-[16px]"
          style={{ color: template.accent }}
        >
          {data.jobTitle || 'YOUR POSITION'}
        </p>
      </div>

      <div className="absolute right-14 top-14">
        <ProfileVisual
          photoUrl={data.photoUrl}
          accent={template.accent}
          large
        />
      </div>

      <div className="absolute bottom-14 right-14 w-[430px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[12px]">
          <ContactItem
            icon={Phone}
            value={data.phone}
            template={template}
          />
          <ContactItem
            icon={MessageCircle}
            value={data.whatsapp}
            template={template}
          />
          <ContactItem
            icon={Mail}
            value={data.email}
            template={template}
          />
          <ContactItem
            icon={Globe}
            value={data.website}
            template={template}
          />
          <ContactItem
            icon={MapPin}
            value={data.address}
            template={template}
          />
          <ContactItem
            icon={Linkedin}
            value={data.linkedin}
            template={template}
          />
        </div>
      </div>

      <div className="absolute bottom-14 left-14">
        {qrSrc ? <QrVisual src={qrSrc} /> : null}
      </div>
    </CardFrame>
  );
};

export const VisitingCardEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const { addToast } = useToast();

  const template = useMemo(
    () => getTemplate(templateId),
    [templateId],
  );

  const [data, setData] = useState<CardData>(EMPTY_CARD_DATA);
  const [qrSrc, setQrSrc] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<
    'jpg' | 'pdf' | null
  >(null);

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
    async (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
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

    const value = qrPayload || 'https://ahadex.fun';

    QRCode.toDataURL(value, {
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
    exportCard.style.borderRadius = '0';
    exportCard.style.position = 'relative';
    exportCard.style.left = 'auto';
    exportCard.style.top = 'auto';
    exportCard.style.transform = 'none';
    exportCard.style.margin = '0';
    exportCard.style.boxShadow = 'none';

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

  const renderExportJpeg = async (): Promise<string> => {
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
    setData(EMPTY_CARD_DATA);
    addToast(
      'Editor reset',
      'All entered information has been cleared.',
      'success',
    );
  };

  return (
    <PageTransition>
      <SEOHead
        title={`${template.name} 1-Side Visiting Card Generator | AHADEX TOOLS`}
        description={`Create a professional one-sided visiting card using the ${template.name} template. Add your photo, logo, contact information and QR code, then export a print-ready JPG or exact 3.5 × 2 inch PDF.`}
        keywords={[
          '1-side visiting card generator',
          'single side business card generator',
          'visiting card maker',
          'business card maker',
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
                navigate(
                  '/tools/visiting-card-generator/one-side',
                )
              }
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to 1-Side Templates
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
                1-SIDE ONLY
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-400">
                {template.name}
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
                  1-Side Visiting Card
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {template.name}
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {template.description} Enter your information, preview the
              finished card, then export the exact print dimensions.
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
                    All fields start empty.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetCard}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.05]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                <UploadBox
                  label="Profile Photo"
                  description="JPG, PNG or WebP"
                  icon={ImagePlus}
                  accept="image/*"
                  preview={data.photoUrl}
                  onChange={updateFile('photoUrl')}
                />

                <UploadBox
                  label="Company Logo"
                  description="Transparent PNG recommended"
                  icon={Building2}
                  accept="image/*"
                  preview={data.logoUrl}
                  onChange={updateFile('logoUrl')}
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <Field
                    label="Full Name"
                    value={data.fullName}
                    onChange={(value) =>
                      updateField('fullName', value)
                    }
                    placeholder="Your full name"
                    icon={UserRound}
                  />

                  <Field
                    label="Job Title"
                    value={data.jobTitle}
                    onChange={(value) =>
                      updateField('jobTitle', value)
                    }
                    placeholder="Creative Director"
                    icon={Sparkles}
                  />

                  <Field
                    label="Company"
                    value={data.companyName}
                    onChange={(value) =>
                      updateField('companyName', value)
                    }
                    placeholder="Company name"
                    icon={Building2}
                  />

                  <Field
                    label="Phone"
                    value={data.phone}
                    onChange={(value) =>
                      updateField('phone', value)
                    }
                    placeholder="+971 50 000 0000"
                    icon={Phone}
                  />

                  <Field
                    label="WhatsApp"
                    value={data.whatsapp}
                    onChange={(value) =>
                      updateField('whatsapp', value)
                    }
                    placeholder="+971 50 000 0000"
                    icon={MessageCircle}
                  />

                  <Field
                    label="Email"
                    value={data.email}
                    onChange={(value) =>
                      updateField('email', value)
                    }
                    placeholder="hello@example.com"
                    icon={Mail}
                  />

                  <Field
                    label="Website"
                    value={data.website}
                    onChange={(value) =>
                      updateField('website', value)
                    }
                    placeholder="https://example.com"
                    icon={Globe}
                  />

                  <Field
                    label="Address"
                    value={data.address}
                    onChange={(value) =>
                      updateField('address', value)
                    }
                    placeholder="Dubai, UAE"
                    icon={MapPin}
                  />

                  <Field
                    label="LinkedIn"
                    value={data.linkedin}
                    onChange={(value) =>
                      updateField('linkedin', value)
                    }
                    placeholder="linkedin.com/in/username"
                    icon={Linkedin}
                  />

                  <Field
                    label="Instagram"
                    value={data.instagram}
                    onChange={(value) =>
                      updateField('instagram', value)
                    }
                    placeholder="@username"
                    icon={Instagram}
                  />

                  <Field
                    label="Short Bio"
                    value={data.bio}
                    onChange={(value) =>
                      updateField('bio', value)
                    }
                    placeholder="Short professional introduction"
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
                        <div className="absolute inset-0 origin-top-left">
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                          >
                            <OneSideCard
                              template={template}
                              data={data}
                              qrSrc={qrSrc}
                              cardRef={cardRef}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <p className="mt-2 text-xs font-bold text-white">
                        Print-ready JPG
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        1050 × 600 px
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
                        QR Included
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Contact information
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

export default VisitingCardEditorPage;