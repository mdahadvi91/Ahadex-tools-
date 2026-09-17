import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
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
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';
import { useToast } from '../context/ToastContext';

type CardMode = 'one-side' | 'two-side';
type CardSide = 'front' | 'back';

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
  | 'split';

type TemplateStyle = {
  name: string;
  category: string;
  accent: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  layout: TemplateLayout;
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
  },
  '02': {
    name: 'Monogram Noir',
    category: 'Luxury',
    accent: '#d4af6a',
    accentSoft: '#3a2b12',
    background: '#100e0b',
    foreground: '#fff8e7',
    muted: '#a8a29e',
    layout: 'luxury',
  },
  '03': {
    name: 'Editorial Split',
    category: 'Editorial',
    accent: '#fb7185',
    accentSoft: '#4c0519',
    background: '#fffaf7',
    foreground: '#18181b',
    muted: '#71717a',
    layout: 'editorial',
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
  },
  '05': {
    name: 'Royal Identity',
    category: 'Premium',
    accent: '#c084fc',
    accentSoft: '#3b0764',
    background: '#160b24',
    foreground: '#faf5ff',
    muted: '#c4b5fd',
    layout: 'luxury',
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
  },
  '08': {
    name: 'Graphite Glass',
    category: 'Modern',
    accent: '#e2e8f0',
    accentSoft: '#27272a',
    background: '#111318',
    foreground: '#fafafa',
    muted: '#a1a1aa',
    layout: 'glass',
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
  },
  '13': {
    name: 'Obsidian Signature',
    category: 'Signature',
    accent: '#f8fafc',
    accentSoft: '#334155',
    background: '#020617',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'bold',
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
  },
};

const getTemplate = (id?: string): TemplateStyle =>
  TEMPLATE_STYLES[id || '01'] || TEMPLATE_STYLES['01'];

const getModeFromPath = (pathname: string): CardMode =>
  pathname.includes('/two-side/') ? 'two-side' : 'one-side';

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AH';

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
  <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.035] p-4 transition hover:border-cyan-400/40 hover:bg-white/[0.055]">
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

const QrVisual = ({ value }: { value: string }) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let active = true;

    QRCode.toDataURL(value || 'https://ahadex.fun', {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => {
        if (active) setSrc('');
      });

    return () => {
      active = false;
    };
  }, [value]);

  if (!src) {
    return (
      <div className="h-24 w-24 rounded-xl bg-white" />
    );
  }

  return (
    <img
      src={src}
      alt="Contact QR code"
      className="h-24 w-24 rounded-xl bg-white p-1"
    />
  );
};

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

const CardBase = ({
  template,
  children,
  side,
  cardRef,
}: {
  template: TemplateStyle;
  children: React.ReactNode;
  side: CardSide;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={cardRef}
    data-export-card={side}
    data-card-side={side}
    className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[26px] shadow-2xl"
    style={{
      background: template.background,
      color: template.foreground,
      boxSizing: 'border-box',
    }}
  >
    <div
      className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
      style={{
        background: template.accent,
        opacity: 0.13,
      }}
    />

    <div
      className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
      style={{
        background: template.accent,
        opacity: 0.07,
      }}
    />

    {children}
  </div>
);

const OneSideCard = ({
  template,
  data,
  cardRef,
}: {
  template: TemplateStyle;
  data: CardData;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  const company = data.companyName || 'Your Company';
  const name = data.fullName || 'Your Name';
  const role = data.jobTitle || 'Professional Title';
  const initials = getInitials(data.fullName);

  if (template.layout === 'minimal') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div className="flex h-full flex-col justify-between p-9">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.35em]">
              AHADEX
            </span>
            <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-slate-400">
              BUSINESS IDENTITY
            </span>
          </div>

          <div>
            <h2 className="text-4xl font-black tracking-[-0.05em]">
              {name}
            </h2>

            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: template.accent }}
            >
              {role}
            </p>

            <p
              className="mt-1 text-xs"
              style={{ color: template.muted }}
            >
              {company}
            </p>
          </div>

          <div className="flex items-end justify-between gap-5">
            <div
              className="space-y-1 text-[8px]"
              style={{ color: template.muted }}
            >
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

            <QrVisual
              value={
                data.website ||
                data.email ||
                data.phone ||
                data.fullName ||
                'https://ahadex.fun'
              }
            />
          </div>
        </div>
      </CardBase>
    );
  }

  if (template.layout === 'luxury') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div
          className="absolute inset-5 rounded-[20px] border"
          style={{ borderColor: `${template.accent}45` }}
        />

        <div className="relative flex h-full flex-col justify-center px-12">
          <div
            className="absolute right-9 top-9 flex h-14 w-14 items-center justify-center rounded-full border font-serif text-base"
            style={{
              borderColor: `${template.accent}70`,
              color: template.accent,
            }}
          >
            {initials}
          </div>

          <p
            className="text-[8px] font-bold uppercase tracking-[0.45em]"
            style={{ color: template.accent }}
          >
            {company}
          </p>

          <h2 className="mt-4 font-serif text-4xl tracking-wide">
            {name}
          </h2>

          <p
            className="mt-2 text-[9px] uppercase tracking-[0.22em]"
            style={{ color: template.muted }}
          >
            {role}
          </p>

          <div
            className="my-5 h-px w-20"
            style={{ background: template.accent }}
          />

          <div
            className="flex flex-wrap gap-x-5 gap-y-2 text-[8px]"
            style={{ color: template.muted }}
          >
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
      </CardBase>
    );
  }

  if (template.layout === 'portrait') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div className="relative flex h-full items-center gap-8 p-10">
          <ProfileVisual
            photoUrl={data.photoUrl}
            accent={template.accent}
            large
          />

          <div className="min-w-0">
            <p
              className="text-[8px] font-black uppercase tracking-[0.32em]"
              style={{ color: template.accent }}
            >
              {company}
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              {name}
            </h2>

            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: template.accent }}
            >
              {role}
            </p>

            <div
              className="mt-5 space-y-2 text-[8px]"
              style={{ color: template.muted }}
            >
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
        </div>
      </CardBase>
    );
  }

  if (template.layout === 'editorial') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div
          className="absolute inset-y-0 left-0 w-[30%]"
          style={{ background: template.accentSoft }}
        />

        <div className="relative flex h-full">
          <div className="flex w-[30%] flex-col justify-end p-9">
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt=""
                className="mb-4 h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <span
                className="text-4xl font-black"
                style={{ color: template.accent }}
              >
                {initials}
              </span>
            )}

            <span
              className="mt-3 text-[7px] font-bold uppercase tracking-[0.25em]"
              style={{ color: template.muted }}
            >
              IDENTITY
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-center p-10">
            <p
              className="text-[8px] font-black uppercase tracking-[0.3em]"
              style={{ color: template.accent }}
            >
              {company}
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              {name}
            </h2>

            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: template.muted }}
            >
              {role}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-[8px]">
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
        </div>
      </CardBase>
    );
  }

  if (template.layout === 'grid') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `linear-gradient(${template.accent}18 1px, transparent 1px), linear-gradient(90deg, ${template.accent}18 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center justify-between">
            <span
              className="text-[8px] font-black uppercase tracking-[0.32em]"
              style={{ color: template.accent }}
            >
              AHADEX / {company}
            </span>

            <Building2
              className="h-5 w-5"
              style={{ color: template.accent }}
            />
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.22em] opacity-60">
              {role}
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {name}
            </h2>

            <div
              className="mt-5 h-px w-full"
              style={{ background: `${template.accent}55` }}
            />
          </div>

          <div
            className="grid grid-cols-3 gap-3 text-[7px]"
            style={{ color: template.muted }}
          >
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
      </CardBase>
    );
  }

  if (template.layout === 'asymmetric') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div
          className="absolute right-0 top-0 h-full w-[38%]"
          style={{ background: `${template.accent}12` }}
        />

        <div className="relative flex h-full">
          <div className="flex w-[62%] flex-col justify-center p-10">
            <p
              className="text-[8px] font-black uppercase tracking-[0.3em]"
              style={{ color: template.accent }}
            >
              CREATIVE OFFICE
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {name}
            </h2>

            <p
              className="mt-2 text-sm"
              style={{ color: template.muted }}
            >
              {role}
            </p>

            <div className="mt-6 space-y-2 text-[8px]">
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
                icon={Phone}
                value={data.phone}
                template={template}
              />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <ProfileVisual
              photoUrl={data.photoUrl}
              accent={template.accent}
              large
            />
          </div>
        </div>
      </CardBase>
    );
  }

  if (template.layout === 'glass') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div
          className="relative m-5 flex h-[calc(100%-40px)] flex-col justify-between rounded-[22px] border p-7 backdrop-blur-xl"
          style={{
            borderColor: `${template.accent}33`,
            background: 'rgba(255,255,255,0.045)',
          }}
        >
          <div className="flex items-center gap-4">
            <ProfileVisual
              photoUrl={data.photoUrl}
              accent={template.accent}
            />

            <div>
              <p className="text-[7px] uppercase tracking-[0.25em] opacity-50">
                DIGITAL IDENTITY
              </p>

              <p className="mt-1 text-xs font-bold">
                {company}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black">{name}</h2>

            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: template.accent }}
            >
              {role}
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-3 text-[8px]"
            style={{ color: template.muted }}
          >
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
      </CardBase>
    );
  }

  if (template.layout === 'frame') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div
          className="absolute inset-5 rounded-[20px] border-2"
          style={{ borderColor: `${template.accent}44` }}
        />

        <div
          className="absolute left-8 top-8 h-9 w-9 border-l-2 border-t-2"
          style={{ borderColor: template.accent }}
        />

        <div
          className="absolute bottom-8 right-8 h-9 w-9 border-b-2 border-r-2"
          style={{ borderColor: template.accent }}
        />

        <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
          <p
            className="text-[8px] font-black uppercase tracking-[0.42em]"
            style={{ color: template.accent }}
          >
            {company}
          </p>

          <h2 className="mt-4 text-4xl font-black">{name}</h2>

          <p
            className="mt-2 text-sm font-semibold"
            style={{ color: template.muted }}
          >
            {role}
          </p>

          <div
            className="my-5 h-px w-20"
            style={{ background: template.accent }}
          />

          <div
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[8px]"
            style={{ color: template.muted }}
          >
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
      </CardBase>
    );
  }

  if (template.layout === 'bold') {
    return (
      <CardBase
        template={template}
        side="front"
        cardRef={cardRef}
      >
        <div
          className="absolute right-0 top-0 h-full w-[38%]"
          style={{ background: `${template.accent}10` }}
        />

        <div
          className="absolute bottom-0 left-0 h-1.5 w-[48%]"
          style={{ background: template.accent }}
        />

        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center justify-between">
            <span
              className="text-[8px] font-black uppercase tracking-[0.35em]"
              style={{ color: template.accent }}
            >
              AHADEX
            </span>

            <Sparkles
              className="h-5 w-5"
              style={{ color: template.accent }}
            />
          </div>

          <div>
            <p
              className="text-[8px] font-bold uppercase tracking-[0.18em]"
              style={{ color: template.muted }}
            >
              {role}
            </p>

            <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em]">
              {name}
            </h2>

            <p
              className="mt-3 text-sm font-semibold"
              style={{ color: template.accent }}
            >
              {company}
            </p>
          </div>

          <div
            className="grid grid-cols-3 gap-3 text-[7px]"
            style={{ color: template.muted }}
          >
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
      </CardBase>
    );
  }

  return (
    <CardBase
      template={template}
      side="front"
      cardRef={cardRef}
    >
      <div
        className="absolute inset-y-0 left-0 w-[42%]"
        style={{ background: template.accentSoft }}
      />

      <div className="relative flex h-full">
        <div className="flex w-[42%] flex-col items-center justify-center text-center">
          <ProfileVisual
            photoUrl={data.photoUrl}
            accent={template.accent}
            large
          />

          <p
            className="mt-4 text-[7px] font-black uppercase tracking-[0.28em]"
            style={{ color: template.accent }}
          >
            {company}
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center p-10">
          <p
            className="text-[7px] font-bold uppercase tracking-[0.25em]"
            style={{ color: template.accent }}
          >
            PROFESSIONAL
          </p>

          <h2 className="mt-3 text-4xl font-black">{name}</h2>

          <p
            className="mt-2 text-sm"
            style={{ color: template.muted }}
          >
            {role}
          </p>

          <div
            className="mt-6 space-y-2 text-[8px]"
            style={{ color: template.muted }}
          >
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
      </div>
    </CardBase>
  );
};

const TwoSideFront = ({
  template,
  data,
  cardRef,
}: {
  template: TemplateStyle;
  data: CardData;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) => (
  <CardBase
    template={template}
    side="front"
    cardRef={cardRef}
  >
    <div className="relative flex h-full items-center gap-8 p-10">
      <ProfileVisual
        photoUrl={data.photoUrl}
        accent={template.accent}
        large
      />

      <div className="min-w-0">
        <p
          className="text-[8px] font-black uppercase tracking-[0.34em]"
          style={{ color: template.accent }}
        >
          {data.companyName || 'YOUR COMPANY'}
        </p>

        <h2 className="mt-3 text-4xl font-black">
          {data.fullName || 'Your Name'}
        </h2>

        <p
          className="mt-2 text-sm font-semibold"
          style={{ color: template.accent }}
        >
          {data.jobTitle || 'Professional Title'}
        </p>

        <p
          className="mt-4 max-w-md text-[8px] leading-5"
          style={{ color: template.muted }}
        >
          {data.bio ||
            'Your professional introduction appears here.'}
        </p>
      </div>
    </div>
  </CardBase>
);

const TwoSideBack = ({
  template,
  data,
  cardRef,
}: {
  template: TemplateStyle;
  data: CardData;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  const qrValue =
    data.website ||
    data.email ||
    data.phone ||
    data.fullName ||
    'https://ahadex.fun';

  return (
    <CardBase
      template={template}
      side="back"
      cardRef={cardRef}
    >
      <div
        className="absolute inset-y-0 right-0 w-[36%]"
        style={{ background: template.accentSoft }}
      />

      <div className="relative flex h-full items-center justify-between gap-8 p-10">
        <div className="min-w-0">
          <p
            className="text-[8px] font-black uppercase tracking-[0.35em]"
            style={{ color: template.accent }}
          >
            CONTACT
          </p>

          <h2 className="mt-3 text-2xl font-black">
            {data.companyName || 'Your Company'}
          </h2>

          <div
            className="mt-6 space-y-3 text-[9px]"
            style={{ color: template.muted }}
          >
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
            <ContactItem
              icon={Instagram}
              value={data.instagram}
              template={template}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center">
          <QrVisual value={qrValue} />

          <span
            className="mt-3 text-[7px] font-bold uppercase tracking-[0.2em]"
            style={{ color: template.muted }}
          >
            Scan to connect
          </span>
        </div>
      </div>
    </CardBase>
  );
};

const cloneForExport = (
  source: HTMLDivElement,
): HTMLDivElement => {
  const clone = source.cloneNode(true) as HTMLDivElement;

  clone.style.width = `${CARD_WIDTH_PX}px`;
  clone.style.height = `${CARD_HEIGHT_PX}px`;
  clone.style.maxWidth = 'none';
  clone.style.minWidth = `${CARD_WIDTH_PX}px`;
  clone.style.aspectRatio = 'auto';
  clone.style.borderRadius = '0';
  clone.style.position = 'fixed';
  clone.style.left = '-100000px';
  clone.style.top = '0';
  clone.style.zIndex = '-1';
  clone.style.overflow = 'hidden';

  document.body.appendChild(clone);

  return clone;
};

export const VisitingCardEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId } = useParams<{
    templateId?: string;
  }>();

  const toast = useToast();

  const mode = getModeFromPath(location.pathname);

  const template = useMemo(
    () => getTemplate(templateId),
    [templateId],
  );

  const [data, setData] = useState<CardData>({
    ...EMPTY_CARD_DATA,
  });
  const [side, setSide] = useState<CardSide>('front');
  const [busy, setBusy] = useState(false);
  const [built, setBuilt] = useState(false);

  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setData({ ...EMPTY_CARD_DATA });
    setSide('front');
    setBuilt(false);
  }, [templateId, mode]);

  const notify = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
  ) => {
    toast.addToast(title, message, type);
  };

  const update = (
    key: keyof CardData,
    value: string | null,
  ) => {
    setData((current) => ({
      ...current,
      [key]: value,
    }));
    setBuilt(false);
  };

  const handleImageUpload = (
    key: 'photoUrl' | 'logoUrl',
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify(
        'Invalid image',
        'Please select a valid image file.',
        'error',
      );
      event.target.value = '';
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      notify(
        'Image too large',
        'Image must be 8MB or smaller.',
        'error',
      );
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        update(key, reader.result);
      }
    };

    reader.onerror = () => {
      notify(
        'Upload failed',
        'Unable to read this image file.',
        'error',
      );
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const buildCard = () => {
    setBuilt(true);

    notify(
      'Card updated',
      'Your live card preview has been updated.',
      'success',
    );
  };

  const resetCard = () => {
    setData({ ...EMPTY_CARD_DATA });
    setSide('front');
    setBuilt(false);

    notify(
      'Fields cleared',
      'Your card information has been reset.',
      'info',
    );
  };

  const getExportSource = (
    targetSide: CardSide,
  ): HTMLDivElement | null => {
    return targetSide === 'front'
      ? frontRef.current
      : backRef.current;
  };

  const renderExportJpeg = async (
    targetSide: CardSide,
  ): Promise<string> => {
    const source = getExportSource(targetSide);

    if (!source) {
      throw new Error(
        `Unable to find ${targetSide} card preview.`,
      );
    }

    const clone = cloneForExport(source);

    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      return await toJpeg(clone, {
        width: CARD_WIDTH_PX,
        height: CARD_HEIGHT_PX,
        quality: 0.98,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: template.background,
        style: {
          width: `${CARD_WIDTH_PX}px`,
          height: `${CARD_HEIGHT_PX}px`,
        },
      });
    } finally {
      clone.remove();
    }
  };

  const downloadJpg = async () => {
    if (busy) return;

    setBusy(true);

    try {
      const targets: CardSide[] =
        mode === 'two-side'
          ? ['front', 'back']
          : ['front'];

      for (let index = 0; index < targets.length; index += 1) {
        const target = targets[index];
        const dataUrl = await renderExportJpeg(target);

        const anchor = document.createElement('a');
        anchor.href = dataUrl;
        anchor.download =
          mode === 'two-side'
            ? `ahadex-visiting-card-${target}.jpg`
            : 'ahadex-visiting-card.jpg';

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        if (index < targets.length - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 300),
          );
        }
      }

      notify(
        'JPG ready',
        mode === 'two-side'
          ? 'Front and back JPG files were downloaded.'
          : 'JPG downloaded at 1050 × 600 px.',
        'success',
      );
    } catch (error) {
      console.error('Visiting card JPG export failed:', error);

      notify(
        'JPG export failed',
        'Please try again after the card preview finishes rendering.',
        'error',
      );
    } finally {
      setBusy(false);
    }
  };

  const downloadPdf = async () => {
    if (busy) return;

    setBusy(true);

    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [CARD_WIDTH_IN, CARD_HEIGHT_IN],
        compress: true,
      });

      const front = await renderExportJpeg('front');

      pdf.addImage(
        front,
        'JPEG',
        0,
        0,
        CARD_WIDTH_IN,
        CARD_HEIGHT_IN,
        undefined,
        'FAST',
      );

      if (mode === 'two-side') {
        const back = await renderExportJpeg('back');

        pdf.addPage(
          [CARD_WIDTH_IN, CARD_HEIGHT_IN],
          'landscape',
        );

        pdf.addImage(
          back,
          'JPEG',
          0,
          0,
          CARD_WIDTH_IN,
          CARD_HEIGHT_IN,
          undefined,
          'FAST',
        );
      }

      pdf.save(
        mode === 'two-side'
          ? 'ahadex-visiting-card-2-side.pdf'
          : 'ahadex-visiting-card-1-side.pdf',
      );

      notify(
        'PDF ready',
        mode === 'two-side'
          ? 'PDF created with front and back on separate pages.'
          : 'PDF created at exact 3.5 × 2 inch card size.',
        'success',
      );
    } catch (error) {
      console.error('Visiting card PDF export failed:', error);

      notify(
        'PDF export failed',
        'Please try again after the card preview finishes rendering.',
        'error',
      );
    } finally {
      setBusy(false);
    }
  };

  const currentCard =
    mode === 'two-side'
      ? side === 'front'
        ? (
            <TwoSideFront
              template={template}
              data={data}
              cardRef={frontRef}
            />
          )
        : (
            <TwoSideBack
              template={template}
              data={data}
              cardRef={backRef}
            />
          )
      : (
          <OneSideCard
            template={template}
            data={data}
            cardRef={frontRef}
          />
        );

  return (
    <PageTransition>
      <SEOHead
        title={`${mode === 'two-side' ? '2-Side' : '1-Side'} Visiting Card Editor | AHADEX TOOLS`}
        description="Create a professional print-ready visiting card with AHADEX TOOLS. Customize your information, photo and branding, then export JPG or PDF."
        canonical={`https://ahadex.fun/tools/visiting-card-generator/${mode}/editor/${templateId || '01'}`}
      />

      <main className="min-h-screen px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/tools/visiting-card-generator/${mode}`,
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </button>

            <div className="flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-2 text-xs font-bold text-cyan-200">
              <Palette className="h-3.5 w-3.5" />
              {template.name}
            </div>
          </header>

          <Reveal>
            <section className="mb-7">
              <p
                className="mb-2 text-xs font-black uppercase tracking-[0.28em]"
                style={{ color: template.accent }}
              >
                {mode === 'two-side'
                  ? 'Two-Side Studio'
                  : 'Single-Side Studio'}
              </p>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                Build your visiting card
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Your selected template stays intact while your own
                information, photo and branding are added. Demo
                gallery content is never carried into your final card.
              </p>
            </section>
          </Reveal>

          <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
            <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Your information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Fill only the fields you need.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetCard}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-red-400/20 hover:text-red-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                <UploadBox
                  label="Profile photo"
                  description="JPG, PNG or WebP · max 8MB"
                  icon={ImagePlus}
                  accept="image/jpeg,image/png,image/webp"
                  preview={data.photoUrl}
                  onChange={(event) =>
                    handleImageUpload('photoUrl', event)
                  }
                />

                <UploadBox
                  label="Company logo"
                  description="Optional · JPG, PNG or WebP"
                  icon={Building2}
                  accept="image/jpeg,image/png,image/webp"
                  preview={data.logoUrl}
                  onChange={(event) =>
                    handleImageUpload('logoUrl', event)
                  }
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <Field
                    label="Full name"
                    value={data.fullName}
                    onChange={(value) =>
                      update('fullName', value)
                    }
                    placeholder="Your full name"
                    icon={UserRound}
                  />

                  <Field
                    label="Job title"
                    value={data.jobTitle}
                    onChange={(value) =>
                      update('jobTitle', value)
                    }
                    placeholder="Your professional title"
                    icon={BriefcaseIcon}
                  />

                  <Field
                    label="Company"
                    value={data.companyName}
                    onChange={(value) =>
                      update('companyName', value)
                    }
                    placeholder="Company or brand name"
                    icon={Building2}
                  />

                  <Field
                    label="Phone"
                    value={data.phone}
                    onChange={(value) =>
                      update('phone', value)
                    }
                    placeholder="+971 ..."
                    icon={Phone}
                  />

                  <Field
                    label="WhatsApp"
                    value={data.whatsapp}
                    onChange={(value) =>
                      update('whatsapp', value)
                    }
                    placeholder="+971 ..."
                    icon={MessageCircle}
                  />

                  <Field
                    label="Email"
                    value={data.email}
                    onChange={(value) =>
                      update('email', value)
                    }
                    placeholder="name@example.com"
                    icon={Mail}
                  />

                  <Field
                    label="Website"
                    value={data.website}
                    onChange={(value) =>
                      update('website', value)
                    }
                    placeholder="https://example.com"
                    icon={Globe}
                  />

                  <Field
                    label="Address"
                    value={data.address}
                    onChange={(value) =>
                      update('address', value)
                    }
                    placeholder="City, country"
                    icon={MapPin}
                  />

                  <Field
                    label="LinkedIn"
                    value={data.linkedin}
                    onChange={(value) =>
                      update('linkedin', value)
                    }
                    placeholder="linkedin.com/in/..."
                    icon={Linkedin}
                  />

                  <Field
                    label="Instagram"
                    value={data.instagram}
                    onChange={(value) =>
                      update('instagram', value)
                    }
                    placeholder="@username"
                    icon={Instagram}
                  />

                  {mode === 'two-side' && (
                    <Field
                      label="Short bio"
                      value={data.bio}
                      onChange={(value) =>
                        update('bio', value)
                      }
                      placeholder="A short professional introduction"
                      icon={Sparkles}
                      multiline
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={buildCard}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: template.accent }}
                >
                  <Check className="h-4 w-4" />
                  {built ? 'Card Updated' : 'Build Card'}
                </button>
              </div>
            </section>

            <section className="min-w-0 rounded-[28px] border border-white/10 bg-white/[0.025] p-4 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Live preview
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Standard print size: 3.5 × 2 inches · 300 DPI JPG
                  </p>
                </div>

                {mode === 'two-side' && (
                  <div className="flex rounded-xl border border-white/10 bg-black/10 p-1">
                    <button
                      type="button"
                      onClick={() => setSide('front')}
                      className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                        side === 'front'
                          ? 'bg-white/10 text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Front
                    </button>

                    <button
                      type="button"
                      onClick={() => setSide('back')}
                      className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                        side === 'back'
                          ? 'bg-white/10 text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>

              <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-[24px] border border-white/5 bg-black/10 p-3 sm:p-6">
                <div className="w-full max-w-[900px]">
                  {currentCard}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={downloadJpg}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3.5 text-sm font-black text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {busy
                    ? 'Preparing...'
                    : 'Download JPG'}
                </button>

                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: template.accent }}
                >
                  <Download className="h-4 w-4" />
                  {busy
                    ? 'Preparing...'
                    : 'Download PDF'}
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                    JPG
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-300">
                    1050 × 600 px
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                    PDF
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-300">
                    3.5 × 2 inch
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                    Format
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-300">
                    {mode === 'two-side'
                      ? 'Front + Back'
                      : 'Single Side'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

const BriefcaseIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="7"
      width="18"
      height="13"
      rx="2"
    />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
    <path d="M10 12v2h4v-2" />
  </svg>
);

export default VisitingCardEditorPage;