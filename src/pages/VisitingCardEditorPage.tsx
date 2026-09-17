import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toJpeg, toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Download,
  Globe,
  ImagePlus,
  Instagram,
  Layers3,
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

type TemplateStyle = {
  name: string;
  category: string;
  accent: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  layout: 'left' | 'center' | 'split' | 'dark';
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

const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  '01': {
    name: 'Executive Edge',
    category: 'Corporate',
    accent: '#22d3ee',
    accentSoft: '#083344',
    background: '#07111f',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'left',
  },
  '02': {
    name: 'Midnight Gold',
    category: 'Luxury',
    accent: '#fbbf24',
    accentSoft: '#422006',
    background: '#11100d',
    foreground: '#fff7ed',
    muted: '#a8a29e',
    layout: 'center',
  },
  '03': {
    name: 'Tech Grid',
    category: 'Technology',
    accent: '#818cf8',
    accentSoft: '#1e1b4b',
    background: '#090b18',
    foreground: '#f8fafc',
    muted: '#9ca3af',
    layout: 'split',
  },
  '04': {
    name: 'Pure Minimal',
    category: 'Minimal',
    accent: '#0f172a',
    accentSoft: '#e2e8f0',
    background: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'left',
  },
  '05': {
    name: 'Royal Violet',
    category: 'Premium',
    accent: '#c084fc',
    accentSoft: '#3b0764',
    background: '#170b25',
    foreground: '#faf5ff',
    muted: '#c4b5fd',
    layout: 'center',
  },
  '06': {
    name: 'Ocean Professional',
    category: 'Business',
    accent: '#38bdf8',
    accentSoft: '#082f49',
    background: '#08202d',
    foreground: '#f0f9ff',
    muted: '#7dd3fc',
    layout: 'split',
  },
  '07': {
    name: 'Emerald Studio',
    category: 'Creative',
    accent: '#34d399',
    accentSoft: '#064e3b',
    background: '#071a15',
    foreground: '#ecfdf5',
    muted: '#86efac',
    layout: 'left',
  },
  '08': {
    name: 'Graphite Line',
    category: 'Editorial',
    accent: '#e5e7eb',
    accentSoft: '#27272a',
    background: '#18181b',
    foreground: '#fafafa',
    muted: '#a1a1aa',
    layout: 'dark',
  },
  '09': {
    name: 'Cobalt Architect',
    category: 'Modern',
    accent: '#60a5fa',
    accentSoft: '#172554',
    background: '#071426',
    foreground: '#eff6ff',
    muted: '#93c5fd',
    layout: 'split',
  },
  '10': {
    name: 'Rose Atelier',
    category: 'Personal Brand',
    accent: '#fb7185',
    accentSoft: '#4c0519',
    background: '#1b0a11',
    foreground: '#fff1f2',
    muted: '#fda4af',
    layout: 'center',
  },
  '11': {
    name: 'Copper Craft',
    category: 'Heritage',
    accent: '#fb923c',
    accentSoft: '#431407',
    background: '#1c110b',
    foreground: '#fff7ed',
    muted: '#fdba74',
    layout: 'left',
  },
  '12': {
    name: 'Arctic Clean',
    category: 'Clean',
    accent: '#0891b2',
    accentSoft: '#cffafe',
    background: '#ecfeff',
    foreground: '#164e63',
    muted: '#155e75',
    layout: 'split',
  },
  '13': {
    name: 'Onyx Signature',
    category: 'Signature',
    accent: '#f8fafc',
    accentSoft: '#334155',
    background: '#020617',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'dark',
  },
  '14': {
    name: 'Aqua Digital',
    category: 'Digital',
    accent: '#2dd4bf',
    accentSoft: '#134e4a',
    background: '#041b1b',
    foreground: '#f0fdfa',
    muted: '#99f6e4',
    layout: 'left',
  },
  '15': {
    name: 'Solar Modern',
    category: 'Bold',
    accent: '#facc15',
    accentSoft: '#422006',
    background: '#15120a',
    foreground: '#fefce8',
    muted: '#fde68a',
    layout: 'split',
  },
  '16': {
    name: 'Silver Frame',
    category: 'Classic',
    accent: '#cbd5e1',
    accentSoft: '#334155',
    background: '#111827',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'center',
  },
};

const DEFAULT_CARD_DATA: CardData = {
  photoUrl: null,
  logoUrl: null,
  fullName: 'Alex Morgan',
  jobTitle: 'Creative Director',
  companyName: 'Nova Studio',
  phone: '+1 555 018 2040',
  whatsapp: '+1 555 018 2040',
  email: 'hello@novastudio.com',
  website: 'novastudio.com',
  address: 'New York · London · Dubai',
  linkedin: 'linkedin.com/in/alexmorgan',
  instagram: '@alexmorgan',
  bio: 'Building memorable brands and digital experiences.',
};

const getMode = (value?: string): CardMode =>
  value === 'two-side' ? 'two-side' : 'one-side';

const getTemplate = (id?: string): TemplateStyle =>
  TEMPLATE_STYLES[id || '01'] || TEMPLATE_STYLES['01'];

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
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
        {preview ? (
          <img
            src={preview}
            alt=""
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
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
    return <div className="h-24 w-24 rounded-xl bg-white/90" />;
  }

  return (
    <img
      src={src}
      alt="Contact QR code"
      className="h-24 w-24 rounded-xl bg-white p-1"
    />
  );
};

const OneSideCard = ({
  template,
  data,
}: {
  template: TemplateStyle;
  data: CardData;
}) => {
  const centered = template.layout === 'center';

  return (
    <div
      className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[26px] p-8 shadow-2xl sm:p-10 lg:p-12"
      style={{
        background: template.background,
        color: template.foreground,
        boxShadow: `0 35px 90px ${template.accent}18`,
      }}
    >
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: template.accent,
          opacity: 0.14,
        }}
      />

      <div
        className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: template.accent,
          opacity: 0.07,
        }}
      />

      {template.layout === 'split' && (
        <div
          className="absolute inset-y-0 left-0 w-[28%]"
          style={{
            background: template.accentSoft,
            borderRight: `1px solid ${template.accent}55`,
          }}
        />
      )}

      {template.layout === 'dark' && (
        <div
          className="absolute bottom-0 left-0 top-0 w-1.5"
          style={{ background: template.accent }}
        />
      )}

      <div
        className={`relative flex h-full ${
          centered
            ? 'items-center justify-center text-center'
            : 'items-center'
        }`}
      >
        {!centered && (
          <ProfileVisual
            photoUrl={data.photoUrl}
            accent={template.accent}
            large
          />
        )}

        <div
          className={
            template.layout === 'split'
              ? 'ml-auto w-[64%]'
              : centered
                ? 'w-full'
                : 'ml-8'
          }
        >
          <div
            className={`mb-4 flex items-center gap-3 ${
              centered ? 'justify-center' : ''
            }`}
          >
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt=""
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : null}

            <span
              className="text-xs font-black uppercase tracking-[0.28em]"
              style={{ color: template.accent }}
            >
              {data.companyName || 'YOUR COMPANY'}
            </span>
          </div>

          {centered && (
            <div className="mb-5 flex justify-center">
              <ProfileVisual
                photoUrl={data.photoUrl}
                accent={template.accent}
              />
            </div>
          )}

          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            {data.fullName || 'Your Name'}
          </h2>

          <p
            className="mt-2 text-base font-semibold sm:text-lg"
            style={{ color: template.accent }}
          >
            {data.jobTitle || 'Your Profession'}
          </p>

          {data.bio ? (
            <p
              className={`mt-4 max-w-xl text-xs leading-relaxed sm:text-sm ${
                centered ? 'mx-auto' : ''
              }`}
              style={{ color: template.muted }}
            >
              {data.bio}
            </p>
          ) : null}

          <div
            className={`mt-6 grid gap-x-8 gap-y-2 text-[10px] sm:text-xs ${
              centered
                ? 'mx-auto max-w-xl sm:grid-cols-2'
                : 'max-w-2xl sm:grid-cols-2'
            }`}
            style={{ color: template.muted }}
          >
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: template.accent }}
                />
                <span>{data.phone}</span>
              </div>
            )}

            {data.whatsapp && (
              <div className="flex items-center gap-2">
                <MessageCircle
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: template.accent }}
                />
                <span>{data.whatsapp}</span>
              </div>
            )}

            {data.email && (
              <div className="flex items-center gap-2">
                <Mail
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: template.accent }}
                />
                <span>{data.email}</span>
              </div>
            )}

            {data.website && (
              <div className="flex items-center gap-2">
                <Globe
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: template.accent }}
                />
                <span>{data.website}</span>
              </div>
            )}

            {data.address && (
              <div className="flex items-center gap-2">
                <MapPin
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: template.accent }}
                />
                <span>{data.address}</span>
              </div>
            )}

            {data.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: template.accent }}
                />
                <span>{data.linkedin}</span>
              </div>
            )}

            {data.instagram && (
              <div className="flex items-center gap-2">
                <Instagram
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: template.accent }}
                />
                <span>{data.instagram}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TwoSideCards = ({
  template,
  data,
  qrValue,
}: {
  template: TemplateStyle;
  data: CardData;
  qrValue: string;
}) => (
  <div className="grid w-full gap-6 lg:grid-cols-2">
    <div
      data-card-side="front"
      className="relative aspect-[1.75/1] overflow-hidden rounded-[26px] p-8 shadow-2xl sm:p-10"
      style={{
        background: template.background,
        color: template.foreground,
        boxShadow: `0 30px 70px ${template.accent}18`,
      }}
    >
      <div
        className="absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl"
        style={{
          background: template.accent,
          opacity: 0.13,
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt=""
                className="h-9 w-9 rounded-lg object-contain"
              />
            ) : null}

            <span
              className="text-xs font-black uppercase tracking-[0.25em]"
              style={{ color: template.accent }}
            >
              {data.companyName || 'YOUR COMPANY'}
            </span>
          </div>

          <span
            className="text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ color: template.muted }}
          >
            FRONT
          </span>
        </div>

        <div className="flex items-center gap-6">
          <ProfileVisual
            photoUrl={data.photoUrl}
            accent={template.accent}
            large
          />

          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              {data.fullName || 'Your Name'}
            </h2>

            <p
              className="mt-2 text-sm font-semibold"
              style={{ color: template.accent }}
            >
              {data.jobTitle || 'Your Profession'}
            </p>
          </div>
        </div>

        <div
          className="flex items-center justify-between text-[10px]"
          style={{ color: template.muted }}
        >
          <span>{data.website || 'yourwebsite.com'}</span>
          <span>Professional identity</span>
        </div>
      </div>
    </div>

    <div
      data-card-side="back"
      className="relative aspect-[1.75/1] overflow-hidden rounded-[26px] p-8 shadow-2xl sm:p-10"
      style={{
        background: template.accentSoft,
        color: template.foreground,
        boxShadow: `0 30px 70px ${template.accent}12`,
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(135deg, transparent 45%, ${template.accent} 45%, ${template.accent} 47%, transparent 47%)`,
        }}
      />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-black uppercase tracking-[0.25em]"
            style={{ color: template.accent }}
          >
            CONTACT
          </span>

          <span
            className="text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{ color: template.muted }}
          >
            BACK
          </span>
        </div>

        <div
          className="grid gap-x-8 gap-y-3 text-xs sm:grid-cols-2"
          style={{ color: template.muted }}
        >
          {data.phone && (
            <div className="flex items-center gap-2">
              <Phone
                className="h-3.5 w-3.5"
                style={{ color: template.accent }}
              />
              <span>{data.phone}</span>
            </div>
          )}

          {data.whatsapp && (
            <div className="flex items-center gap-2">
              <MessageCircle
                className="h-3.5 w-3.5"
                style={{ color: template.accent }}
              />
              <span>{data.whatsapp}</span>
            </div>
          )}

          {data.email && (
            <div className="flex items-center gap-2">
              <Mail
                className="h-3.5 w-3.5"
                style={{ color: template.accent }}
              />
              <span>{data.email}</span>
            </div>
          )}

          {data.website && (
            <div className="flex items-center gap-2">
              <Globe
                className="h-3.5 w-3.5"
                style={{ color: template.accent }}
              />
              <span>{data.website}</span>
            </div>
          )}

          {data.address && (
            <div className="flex items-center gap-2">
              <MapPin
                className="h-3.5 w-3.5"
                style={{ color: template.accent }}
              />
              <span>{data.address}</span>
            </div>
          )}

          {data.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin
                className="h-3.5 w-3.5"
                style={{ color: template.accent }}
              />
              <span>{data.linkedin}</span>
            </div>
          )}

          {data.instagram && (
            <div className="flex items-center gap-2">
              <Instagram
                className="h-3.5 w-3.5"
                style={{ color: template.accent }}
              />
              <span>{data.instagram}</span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-5">
          <div className="max-w-[65%]">
            <p className="text-sm font-bold">
              {data.bio || 'Connect with me.'}
            </p>

            <p
              className="mt-2 text-[10px]"
              style={{ color: template.muted }}
            >
              {data.companyName || 'Your Company'}
            </p>
          </div>

          <QrVisual value={qrValue} />
        </div>
      </div>
    </div>
  </div>
);

export const VisitingCardEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { mode: modeParam, templateId } = useParams();

  const mode = getMode(modeParam);
  const template = getTemplate(templateId);

  const [data, setData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [built, setBuilt] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const oneSideRef = useRef<HTMLDivElement>(null);
  const twoSideRef = useRef<HTMLDivElement>(null);

  const canonical = `https://ahadex.fun/tools/visiting-card-generator/${mode}/editor/${templateId || '01'}`;

  const update = <K extends keyof CardData>(
    key: K,
    value: CardData[K],
  ) => {
    setData((current) => ({
      ...current,
      [key]: value,
    }));
    setBuilt(false);
  };

  const qrValue = useMemo(() => {
    const website = data.website.trim();

    if (website) {
      return website.startsWith('http')
        ? website
        : `https://${website}`;
    }

    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.fullName}`,
      `TITLE:${data.jobTitle}`,
      `ORG:${data.companyName}`,
      `TEL:${data.phone}`,
      `TEL;TYPE=WHATSAPP:${data.whatsapp}`,
      `EMAIL:${data.email}`,
      `URL:${data.website}`,
      `ADR:${data.address}`,
      'END:VCARD',
    ].join('\n');
  }, [data]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: 'photoUrl' | 'logoUrl',
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const maxSize =
      key === 'photoUrl' ? 8 * 1024 * 1024 : 5 * 1024 * 1024;

    if (!file.type.startsWith('image/')) {
      addToast(
        'Invalid image',
        'Please select a valid JPG, PNG, WebP or other image file.',
        'error',
      );
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      addToast(
        'File too large',
        `Please keep the ${key === 'photoUrl' ? 'photo' : 'logo'} under ${
          key === 'photoUrl' ? '8MB' : '5MB'
        }.`,
        'error',
      );
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') return;

      update(key, reader.result);

      addToast(
        key === 'photoUrl' ? 'Photo uploaded' : 'Logo uploaded',
        key === 'photoUrl'
          ? 'Your profile photo is now in the live preview.'
          : 'Your company logo is now in the live preview.',
        'success',
      );
    };

    reader.onerror = () => {
      addToast(
        'Upload failed',
        'The selected image could not be read.',
        'error',
      );
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const buildCard = () => {
    setBuilt(true);

    window.setTimeout(() => {
      const target =
        mode === 'two-side'
          ? twoSideRef.current
          : oneSideRef.current;

      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 80);

    addToast(
      'Card built',
      'Your visiting card preview is ready to export.',
      'success',
    );
  };

  const exportPng = async () => {
    const target =
      mode === 'two-side'
        ? twoSideRef.current
        : oneSideRef.current;

    if (!target) return;

    setIsExporting(true);

    try {
      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: template.background,
      });

      const link = document.createElement('a');
      link.download = `ahadex-visiting-card-${mode}-${templateId || '01'}.png`;
      link.href = dataUrl;
      link.click();

      addToast(
        'PNG downloaded',
        'Your high-resolution visiting card image is ready.',
        'success',
      );
    } catch (error) {
      console.error('PNG export failed:', error);

      addToast(
        'Export failed',
        'The card could not be exported as PNG.',
        'error',
      );
    } finally {
      setIsExporting(false);
    }
  };

  const exportJpg = async () => {
    const target =
      mode === 'two-side'
        ? twoSideRef.current
        : oneSideRef.current;

    if (!target) return;

    setIsExporting(true);

    try {
      const dataUrl = await toJpeg(target, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.98,
        backgroundColor: template.background,
      });

      const link = document.createElement('a');
      link.download = `ahadex-visiting-card-${mode}-${templateId || '01'}.jpg`;
      link.href = dataUrl;
      link.click();

      addToast(
        'JPG downloaded',
        'Your high-resolution visiting card image is ready.',
        'success',
      );
    } catch (error) {
      console.error('JPG export failed:', error);

      addToast(
        'Export failed',
        'The card could not be exported as JPG.',
        'error',
      );
    } finally {
      setIsExporting(false);
    }
  };

  const exportPdf = async () => {
    if (mode !== 'two-side') return;

    const target = twoSideRef.current;

    if (!target) return;

    setIsExporting(true);

    try {
      const cards = Array.from(
        target.querySelectorAll<HTMLElement>('[data-card-side]'),
      );

      if (cards.length < 2) {
        throw new Error('Both card sides are required.');
      }

      const images = await Promise.all(
        cards.slice(0, 2).map((card) =>
          toPng(card, {
            cacheBust: true,
            pixelRatio: 3,
            backgroundColor: template.background,
          }),
        ),
      );

      const first = cards[0];
      const width = first.offsetWidth;
      const height = first.offsetHeight;

      const orientation = width >= height ? 'landscape' : 'portrait';

      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [width, height],
        compress: true,
      });

      pdf.addImage(images[0], 'PNG', 0, 0, width, height);
      pdf.addPage([width, height], orientation);
      pdf.addImage(images[1], 'PNG', 0, 0, width, height);

      pdf.save(
        `ahadex-visiting-card-two-side-${templateId || '01'}.pdf`,
      );

      addToast(
        'PDF downloaded',
        'Your two-side print-ready card PDF is ready.',
        'success',
      );
    } catch (error) {
      console.error('PDF export failed:', error);

      addToast(
        'PDF export failed',
        'The two-side card could not be exported.',
        'error',
      );
    } finally {
      setIsExporting(false);
    }
  };

  const resetForm = () => {
    setData(DEFAULT_CARD_DATA);
    setBuilt(false);

    addToast(
      'Form reset',
      'The editor has been restored to the default demo data.',
      'success',
    );
  };

  return (
    <>
      <SEOHead
        title={`${template.name} Visiting Card Editor | AHADEX TOOLS`}
        description={`Create and download a professional ${mode === 'two-side' ? 'two-side' : 'one-side'} visiting card using the ${template.name} template on AHADEX TOOLS.`}
        canonical={canonical}
      />

      <PageTransition>
        <main className="min-h-screen pb-20">
          <div className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-6 lg:px-8">
            <Reveal>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/tools/visiting-card-generator/${mode}/template/${templateId || '01'}`,
                  )
                }
                className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Template Preview
              </button>
            </Reveal>

            <Reveal>
              <section className="mb-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        Card Editor
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-400">
                        {mode === 'two-side' ? 'Front + Back' : 'Single Side'}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-400">
                        Template {templateId || '01'}
                      </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                      Build your visiting card
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                      Enter your real details, add your photo or logo, review
                      the live design, then export the finished card in a
                      high-resolution format.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                    <div
                      className="h-10 w-10 rounded-xl"
                      style={{
                        background: template.background,
                        border: `1px solid ${template.accent}55`,
                        boxShadow: `0 0 24px ${template.accent}18`,
                      }}
                    />

                    <div>
                      <p className="text-sm font-bold text-white">
                        {template.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {template.category}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
              <Reveal>
                <aside className="rounded-3xl border border-white/10 bg-slate-950/55 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                        Step 1
                      </p>
                      <h2 className="mt-1 text-xl font-black text-white">
                        Your information
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-white"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Reset
                    </button>
                  </div>

                  <div className="space-y-4">
                    <UploadBox
                      label="Profile Photo"
                      description="JPG, PNG or WebP · max 8MB"
                      icon={ImagePlus}
                      accept="image/*"
                      preview={data.photoUrl}
                      onChange={(event) =>
                        handleImageUpload(event, 'photoUrl')
                      }
                    />

                    <UploadBox
                      label="Company Logo"
                      description="Optional · JPG, PNG or WebP · max 5MB"
                      icon={Building2}
                      accept="image/*"
                      preview={data.logoUrl}
                      onChange={(event) =>
                        handleImageUpload(event, 'logoUrl')
                      }
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                      <Field
                        label="Full Name"
                        value={data.fullName}
                        onChange={(value) => update('fullName', value)}
                        placeholder="Your full name"
                        icon={UserRound}
                      />

                      <Field
                        label="Job Title / Profession"
                        value={data.jobTitle}
                        onChange={(value) => update('jobTitle', value)}
                        placeholder="e.g. Creative Director"
                        icon={BriefcaseBusiness}
                      />

                      <Field
                        label="Company Name"
                        value={data.companyName}
                        onChange={(value) => update('companyName', value)}
                        placeholder="Your company"
                        icon={Building2}
                      />

                      <Field
                        label="Phone"
                        value={data.phone}
                        onChange={(value) => update('phone', value)}
                        placeholder="+1 555 000 0000"
                        icon={Phone}
                      />

                      <Field
                        label="WhatsApp"
                        value={data.whatsapp}
                        onChange={(value) => update('whatsapp', value)}
                        placeholder="+1 555 000 0000"
                        icon={MessageCircle}
                      />

                      <Field
                        label="Email"
                        value={data.email}
                        onChange={(value) => update('email', value)}
                        placeholder="you@example.com"
                        icon={Mail}
                      />

                      <Field
                        label="Website"
                        value={data.website}
                        onChange={(value) => update('website', value)}
                        placeholder="yourwebsite.com"
                        icon={Globe}
                      />

                      <Field
                        label="Address"
                        value={data.address}
                        onChange={(value) => update('address', value)}
                        placeholder="City · Country"
                        icon={MapPin}
                      />

                      <Field
                        label="LinkedIn"
                        value={data.linkedin}
                        onChange={(value) => update('linkedin', value)}
                        placeholder="linkedin.com/in/username"
                        icon={Linkedin}
                      />

                      <Field
                        label="Instagram"
                        value={data.instagram}
                        onChange={(value) => update('instagram', value)}
                        placeholder="@username"
                        icon={Instagram}
                      />

                      <Field
                        label="Short Bio"
                        value={data.bio}
                        onChange={(value) => update('bio', value)}
                        placeholder="A short professional description"
                        icon={Palette}
                        multiline
                      />
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] p-4">
                    <div className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

                      <div>
                        <p className="text-sm font-bold text-white">
                          Live preview
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Your changes appear immediately in the card preview.
                          Build Card simply locks the current state as your
                          export-ready result.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={buildCard}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/15 transition hover:bg-cyan-300 active:scale-[0.99]"
                  >
                    <Sparkles className="h-4 w-4" />
                    {built ? 'Rebuild Card' : 'Build Card'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </aside>
              </Reveal>

              <Reveal>
                <section className="min-w-0">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                        Step 2
                      </p>
                      <h2 className="mt-1 text-xl font-black text-white">
                        Live card preview
                      </h2>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-slate-400">
                      <Layers3 className="h-3.5 w-3.5" />
                      {mode === 'two-side'
                        ? 'Front + Back'
                        : 'One Side'}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-3 shadow-2xl backdrop-blur-xl sm:p-5 lg:p-7">
                    {mode === 'two-side' ? (
                      <div ref={twoSideRef}>
                        <TwoSideCards
                          template={template}
                          data={data}
                          qrValue={qrValue}
                        />
                      </div>
                    ) : (
                      <div ref={oneSideRef}>
                        <OneSideCard
                          template={template}
                          data={data}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <Download className="h-5 w-5 text-cyan-300" />
                      <p className="mt-3 text-sm font-bold text-white">
                        High resolution
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        PNG and JPG exports use a high pixel ratio for crisp
                        digital sharing.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <Palette className="h-5 w-5 text-cyan-300" />
                      <p className="mt-3 text-sm font-bold text-white">
                        Template preserved
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your selected template remains the visual foundation
                        of the generated card.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                      <Sparkles className="h-5 w-5 text-cyan-300" />
                      <p className="mt-3 text-sm font-bold text-white">
                        Ready to export
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Build the card, review it, then download the final
                        result.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/55 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                          Step 3
                        </p>

                        <h2 className="mt-1 text-xl font-black text-white">
                          Download your card
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                          Export the current finished design. For two-side
                          cards, the PDF contains both sides as separate pages.
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] px-3 py-2 text-xs font-semibold text-emerald-300">
                        <Check className="h-3.5 w-3.5" />
                        {built ? 'Built & ready' : 'Live preview'}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <button
                        type="button"
                        disabled={isExporting}
                        onClick={exportPng}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3.5 text-sm font-bold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Download className="h-4 w-4" />
                        Download PNG
                      </button>

                      <button
                        type="button"
                        disabled={isExporting}
                        onClick={exportJpg}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3.5 text-sm font-bold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Download className="h-4 w-4" />
                        Download JPG
                      </button>

                      {mode === 'two-side' ? (
                        <button
                          type="button"
                          disabled={isExporting}
                          onClick={exportPdf}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 lg:col-span-1"
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/tools/visiting-card-generator/${mode}/template/${templateId || '01'}`,
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Change Template
                        </button>
                      )}
                    </div>

                    {isExporting && (
                      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] py-3 text-xs font-semibold text-cyan-300">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Preparing your high-resolution export...
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Template: {template.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        You can return to the gallery without losing the
                        current editor route.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/tools/visiting-card-generator/${mode}`,
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Choose another template
                    </button>
                  </div>
                </section>
              </Reveal>
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
};

export default VisitingCardEditorPage;