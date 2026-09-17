import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';

type LayoutType =
  | 'portrait'
  | 'editorial'
  | 'luxury'
  | 'split'
  | 'minimal'
  | 'bold'
  | 'glass'
  | 'frame'
  | 'grid'
  | 'asymmetric';

type TemplateDefinition = {
  id: string;
  name: string;
  category: string;
  accent: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  layout: LayoutType;
};

const TEMPLATES: TemplateDefinition[] = [
  {
    id: '01',
    name: 'Executive Portrait',
    category: 'Executive',
    accent: '#38bdf8',
    accentSoft: '#082f49',
    background: '#07111f',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'portrait',
  },
  {
    id: '02',
    name: 'Monogram Noir',
    category: 'Luxury',
    accent: '#d4af6a',
    accentSoft: '#3a2b12',
    background: '#100e0b',
    foreground: '#fff8e7',
    muted: '#a8a29e',
    layout: 'luxury',
  },
  {
    id: '03',
    name: 'Editorial Split',
    category: 'Editorial',
    accent: '#fb7185',
    accentSoft: '#4c0519',
    background: '#fffaf7',
    foreground: '#18181b',
    muted: '#71717a',
    layout: 'editorial',
  },
  {
    id: '04',
    name: 'Swiss Minimal',
    category: 'Minimal',
    accent: '#111827',
    accentSoft: '#e5e7eb',
    background: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'minimal',
  },
  {
    id: '05',
    name: 'Royal Identity',
    category: 'Premium',
    accent: '#c084fc',
    accentSoft: '#3b0764',
    background: '#160b24',
    foreground: '#faf5ff',
    muted: '#c4b5fd',
    layout: 'luxury',
  },
  {
    id: '06',
    name: 'Architect Grid',
    category: 'Architecture',
    accent: '#60a5fa',
    accentSoft: '#172554',
    background: '#081321',
    foreground: '#eff6ff',
    muted: '#93c5fd',
    layout: 'grid',
  },
  {
    id: '07',
    name: 'Creative Offset',
    category: 'Creative',
    accent: '#34d399',
    accentSoft: '#064e3b',
    background: '#061814',
    foreground: '#ecfdf5',
    muted: '#86efac',
    layout: 'asymmetric',
  },
  {
    id: '08',
    name: 'Graphite Glass',
    category: 'Modern',
    accent: '#e2e8f0',
    accentSoft: '#27272a',
    background: '#111318',
    foreground: '#fafafa',
    muted: '#a1a1aa',
    layout: 'glass',
  },
  {
    id: '09',
    name: 'Cobalt Frame',
    category: 'Corporate',
    accent: '#2563eb',
    accentSoft: '#dbeafe',
    background: '#f8fbff',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'frame',
  },
  {
    id: '10',
    name: 'Rose Atelier',
    category: 'Personal Brand',
    accent: '#e11d48',
    accentSoft: '#ffe4e6',
    background: '#fff7f8',
    foreground: '#3f0b18',
    muted: '#881337',
    layout: 'editorial',
  },
  {
    id: '11',
    name: 'Copper Heritage',
    category: 'Heritage',
    accent: '#ea580c',
    accentSoft: '#431407',
    background: '#1a100a',
    foreground: '#fff7ed',
    muted: '#fdba74',
    layout: 'frame',
  },
  {
    id: '12',
    name: 'Aqua Digital',
    category: 'Technology',
    accent: '#2dd4bf',
    accentSoft: '#134e4a',
    background: '#031817',
    foreground: '#f0fdfa',
    muted: '#99f6e4',
    layout: 'grid',
  },
  {
    id: '13',
    name: 'Obsidian Signature',
    category: 'Signature',
    accent: '#f8fafc',
    accentSoft: '#334155',
    background: '#020617',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'bold',
  },
  {
    id: '14',
    name: 'Solar Statement',
    category: 'Bold',
    accent: '#facc15',
    accentSoft: '#422006',
    background: '#171208',
    foreground: '#fefce8',
    muted: '#fde68a',
    layout: 'bold',
  },
  {
    id: '15',
    name: 'Ocean Studio',
    category: 'Studio',
    accent: '#06b6d4',
    accentSoft: '#164e63',
    background: '#061923',
    foreground: '#ecfeff',
    muted: '#67e8f9',
    layout: 'split',
  },
  {
    id: '16',
    name: 'Silver Classic',
    category: 'Classic',
    accent: '#64748b',
    accentSoft: '#e2e8f0',
    background: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'frame',
  },
];

const DEMO = {
  name: 'Alex Morgan',
  role: 'Creative Director',
  company: 'Nova Studio',
  phone: '+1 555 018 2040',
  whatsapp: '+1 555 018 2040',
  email: 'hello@novastudio.com',
  website: 'novastudio.com',
  address: 'New York · London · Dubai',
  linkedin: 'linkedin.com/in/alexmorgan',
  instagram: '@alexmorgan',
};

const getTemplate = (id?: string) =>
  TEMPLATES.find((template) => template.id === id) || TEMPLATES[0];

const ContactItem = ({
  icon: Icon,
  children,
  template,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  template: TemplateDefinition;
}) => (
  <div className="flex min-w-0 items-center gap-3">
    <Icon
      className="h-4 w-4 shrink-0"
      style={{ color: template.accent }}
    />
    <span className="truncate">{children}</span>
  </div>
);

const Avatar = ({
  template,
  size = 'large',
}: {
  template: TemplateDefinition;
  size?: 'small' | 'large';
}) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full border ${
      size === 'large' ? 'h-24 w-24 border-2' : 'h-14 w-14'
    }`}
    style={{
      borderColor: `${template.accent}99`,
      background: `${template.accent}12`,
      boxShadow: `0 0 0 7px ${template.accent}10, 0 18px 45px ${template.accent}18`,
    }}
  >
    <UserRound
      className={size === 'large' ? 'h-11 w-11' : 'h-6 w-6'}
      style={{ color: template.accent }}
    />
  </div>
);

const QRMock = ({ template }: { template: TemplateDefinition }) => (
  <div
    className="grid h-24 w-24 grid-cols-7 gap-1 rounded-xl p-2"
    style={{
      background: '#ffffff',
      boxShadow: `0 15px 40px ${template.accent}22`,
    }}
    aria-hidden="true"
  >
    {Array.from({ length: 49 }).map((_, index) => (
      <span
        key={index}
        className="rounded-[1px]"
        style={{
          background:
            index % 2 === 0 ||
            index % 7 === 0 ||
            [1, 2, 8, 9, 15, 16, 42, 43, 44, 45].includes(index)
              ? '#111827'
              : '#ffffff',
        }}
      />
    ))}
  </div>
);

const PreviewCard = ({
  template,
}: {
  template: TemplateDefinition;
}) => {
  const accent = template.accent;

  if (template.layout === 'portrait') {
    return (
      <div
        className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px] p-8 sm:p-12"
        style={{
          background: template.background,
          color: template.foreground,
          boxShadow: `0 40px 100px ${accent}20`,
        }}
      >
        <div
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.18 }}
        />

        <div
          className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.08 }}
        />

        <div className="relative flex h-full items-center gap-7 sm:gap-10">
          <Avatar template={template} />

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-black uppercase tracking-[0.35em] sm:text-xs"
                style={{ color: accent }}
              >
                {DEMO.company}
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              {DEMO.name}
            </h2>

            <p
              className="mt-2 text-sm font-semibold sm:text-base"
              style={{ color: accent }}
            >
              {DEMO.role}
            </p>

            <div
              className="mt-7 grid gap-3 text-[10px] sm:grid-cols-2 sm:text-xs"
              style={{ color: template.muted }}
            >
              <ContactItem icon={Phone} template={template}>
                {DEMO.phone}
              </ContactItem>
              <ContactItem icon={Mail} template={template}>
                {DEMO.email}
              </ContactItem>
              <ContactItem icon={Globe} template={template}>
                {DEMO.website}
              </ContactItem>
              <ContactItem icon={MapPin} template={template}>
                {DEMO.address}
              </ContactItem>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === 'luxury') {
    return (
      <div
        className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px] p-9 sm:p-14"
        style={{
          background: template.background,
          color: template.foreground,
          boxShadow: `0 40px 100px ${accent}18`,
        }}
      >
        <div
          className="absolute inset-4 rounded-[23px] border sm:inset-6"
          style={{ borderColor: `${accent}55` }}
        />

        <div
          className="absolute right-9 top-9 flex h-16 w-16 items-center justify-center rounded-full border font-serif text-lg sm:right-14 sm:top-14"
          style={{
            borderColor: `${accent}77`,
            color: accent,
          }}
        >
          AM
        </div>

        <div className="relative flex h-full flex-col justify-center">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.45em] sm:text-xs"
            style={{ color: accent }}
          >
            {DEMO.company}
          </span>

          <h2 className="mt-4 font-serif text-3xl tracking-wide sm:text-5xl">
            {DEMO.name}
          </h2>

          <p
            className="mt-2 text-[10px] uppercase tracking-[0.25em] sm:text-xs"
            style={{ color: template.muted }}
          >
            {DEMO.role}
          </p>

          <div
            className="mt-7 h-px w-24"
            style={{ background: accent }}
          />

          <div
            className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[10px] sm:text-xs"
            style={{ color: template.muted }}
          >
            <span>{DEMO.phone}</span>
            <span>{DEMO.email}</span>
            <span>{DEMO.website}</span>
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === 'editorial') {
    return (
      <div
        className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px]"
        style={{
          background: template.background,
          color: template.foreground,
          boxShadow: `0 40px 100px ${accent}18`,
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-[30%]"
          style={{
            background: template.accentSoft,
          }}
        />

        <div className="relative flex h-full">
          <div className="flex w-[30%] items-end p-7 sm:p-12">
            <div>
              <span
                className="text-4xl font-black leading-none sm:text-6xl"
                style={{ color: accent }}
              >
                AM
              </span>
              <p
                className="mt-3 text-[8px] font-bold uppercase tracking-[0.25em] sm:text-[10px]"
                style={{ color: template.muted }}
              >
                Personal identity
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center p-7 sm:p-12">
            <span
              className="text-[9px] font-black uppercase tracking-[0.35em] sm:text-xs"
              style={{ color: accent }}
            >
              {DEMO.company}
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              {DEMO.name}
            </h2>

            <p
              className="mt-2 text-xs font-semibold sm:text-sm"
              style={{ color: template.muted }}
            >
              {DEMO.role}
            </p>

            <div
              className="mt-7 grid gap-3 text-[9px] sm:grid-cols-2 sm:text-xs"
              style={{ color: template.muted }}
            >
              <ContactItem icon={Phone} template={template}>
                {DEMO.phone}
              </ContactItem>
              <ContactItem icon={Mail} template={template}>
                {DEMO.email}
              </ContactItem>
              <ContactItem icon={Globe} template={template}>
                {DEMO.website}
              </ContactItem>
              <ContactItem icon={MapPin} template={template}>
                {DEMO.address}
              </ContactItem>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === 'minimal') {
    return (
      <div
        className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px] border bg-white p-8 sm:p-12"
        style={{
          borderColor: '#e2e8f0',
          color: template.foreground,
          boxShadow: '0 40px 100px rgba(15,23,42,0.12)',
        }}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-black uppercase tracking-[0.35em] sm:text-sm">
              NOVA
            </span>
            <span className="text-[9px] font-medium text-slate-400 sm:text-xs">
              PERSONAL IDENTITY
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-black tracking-[-0.05em] sm:text-5xl">
              {DEMO.name}
            </h2>

            <div className="mt-3 flex items-center gap-3">
              <span className="h-px w-10 bg-slate-900" />
              <span className="text-xs font-semibold sm:text-sm">
                {DEMO.role}
              </span>
            </div>

            <div className="mt-7 grid gap-3 text-[10px] text-slate-500 sm:grid-cols-2 sm:text-xs">
              <span>{DEMO.phone}</span>
              <span>{DEMO.email}</span>
              <span>{DEMO.website}</span>
              <span>{DEMO.address}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === 'grid') {
    return (
      <div
        className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px] p-8 sm:p-12"
        style={{
          background: template.background,
          color: template.foreground,
          boxShadow: `0 40px 100px ${accent}18`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(${accent}22 1px, transparent 1px), linear-gradient(90deg, ${accent}22 1px, transparent 1px)`,
            backgroundSize: '34px 34px',
          }}
        />

        <div className="relative grid h-full grid-cols-[1fr_auto] gap-8">
          <div className="flex flex-col justify-between">
            <div>
              <span
                className="text-[9px] font-black uppercase tracking-[0.4em] sm:text-xs"
                style={{ color: accent }}
              >
                ARCHIVE / {template.category}
              </span>

              <h2 className="mt-4 text-3xl font-black sm:text-5xl">
                {DEMO.name}
              </h2>

              <p
                className="mt-2 text-xs sm:text-sm"
                style={{ color: template.muted }}
              >
                {DEMO.role}
              </p>
            </div>

            <div
              className="grid gap-2 text-[9px] sm:grid-cols-2 sm:text-xs"
              style={{ color: template.muted }}
            >
              <span>{DEMO.phone}</span>
              <span>{DEMO.email}</span>
              <span>{DEMO.website}</span>
              <span>{DEMO.address}</span>
            </div>
          </div>

          <div className="flex items-center">
            <QRMock template={template} />
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === 'asymmetric') {
    return (
      <div
        className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px] p-8 sm:p-12"
        style={{
          background: template.background,
          color: template.foreground,
          boxShadow: `0 40px 100px ${accent}18`,
        }}
      >
        <div
          className="absolute right-0 top-0 h-full w-[38%]"
          style={{
            background: template.accentSoft,
            clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        />

        <div
          className="absolute -left-20 -top-20 h-64 w-64 rounded-full blur-3xl"
          style={{
            background: accent,
            opacity: 0.12,
          }}
        />

        <div className="relative flex h-full items-center">
          <div className="w-[67%]">
            <span
              className="text-[9px] font-black uppercase tracking-[0.4em] sm:text-xs"
              style={{ color: accent }}
            >
              CREATIVE PRACTICE
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              {DEMO.name}
            </h2>

            <p
              className="mt-2 text-xs font-semibold sm:text-sm"
              style={{ color: accent }}
            >
              {DEMO.role}
            </p>

            <div
              className="mt-7 space-y-2 text-[9px] sm:text-xs"
              style={{ color: template.muted }}
            >
              <ContactItem icon={Phone} template={template}>
                {DEMO.phone}
              </ContactItem>
              <ContactItem icon={Mail} template={template}>
                {DEMO.email}
              </ContactItem>
              <ContactItem icon={Globe} template={template}>
                {DEMO.website}
              </ContactItem>
            </div>
          </div>

          <div className="ml-auto flex w-[33%] justify-center">
            <Avatar template={template} />
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === 'glass') {
    return (
      <div
        className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px] p-8 sm:p-12"
        style={{
          background: template.background,
          color: template.foreground,
          boxShadow: `0 40px 100px ${accent}18`,
        }}
      >
        <div
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.16 }}
        />

        <div
          className="absolute inset-6 rounded-[24px] border backdrop-blur-xl"
          style={{
            borderColor: `${accent}30`,
            background: `${accent}08`,
          }}
        />

        <div className="relative flex h-full items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3">
              <Avatar template={template} size="small" />
              <div>
                <span
                  className="block text-[9px] font-black uppercase tracking-[0.35em]"
                  style={{ color: accent }}
                >
                  {DEMO.company}
                </span>
                <span
                  className="text-[9px]"
                  style={{ color: template.muted }}
                >
                  {DEMO.category || template.category}
                </span>
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-black sm:text-5xl">
              {DEMO.name}
            </h2>

            <p
              className="mt-2 text-xs sm:text-sm"
              style={{ color: template.muted }}
            >
              {DEMO.role}
            </p>
          </div>

          <div
            className="hidden max-w-[42%] space-y-3 text-xs sm:block"
            style={{ color: template.muted }}
          >
            <ContactItem icon={Phone} template={template}>
              {DEMO.phone}
            </ContactItem>
            <ContactItem icon={Mail} template={template}>
              {DEMO.email}
            </ContactItem>
            <ContactItem icon={Globe} template={template}>
              {DEMO.website}
            </ContactItem>
            <ContactItem icon={MapPin} template={template}>
              {DEMO.address}
            </ContactItem>
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === 'bold') {
    return (
      <div
        className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px] p-8 sm:p-12"
        style={{
          background: template.background,
          color: template.foreground,
          boxShadow: `0 40px 100px ${accent}18`,
        }}
      >
        <div
          className="absolute right-8 top-8 text-6xl font-black leading-none sm:right-12 sm:top-12 sm:text-8xl"
          style={{ color: `${accent}18` }}
        >
          AM
        </div>

        <div
          className="absolute bottom-0 left-0 h-2 w-full"
          style={{ background: accent }}
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-black uppercase tracking-[0.4em] sm:text-xs"
              style={{ color: accent }}
            >
              {DEMO.company}
            </span>

            <Sparkles
              className="h-5 w-5 sm:h-6 sm:w-6"
              style={{ color: accent }}
            />
          </div>

          <div>
            <h2 className="max-w-[70%] text-3xl font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl">
              {DEMO.name}
            </h2>

            <p
              className="mt-4 text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
              style={{ color: accent }}
            >
              {DEMO.role}
            </p>
          </div>

          <div
            className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] sm:text-xs"
            style={{ color: template.muted }}
          >
            <span>{DEMO.phone}</span>
            <span>{DEMO.email}</span>
            <span>{DEMO.website}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[1.75/1] w-full overflow-hidden rounded-[30px] p-8 sm:p-12"
      style={{
        background: template.background,
        color: template.foreground,
        boxShadow: `0 40px 100px ${accent}18`,
      }}
    >
      <div
        className="absolute inset-5 rounded-[22px] border"
        style={{ borderColor: `${accent}44` }}
      />

      <div className="relative flex h-full items-center justify-between gap-8">
        <div>
          <span
            className="text-[9px] font-black uppercase tracking-[0.4em] sm:text-xs"
            style={{ color: accent }}
          >
            {DEMO.company}
          </span>

          <h2 className="mt-4 text-3xl font-black sm:text-5xl">
            {DEMO.name}
          </h2>

          <p
            className="mt-2 text-xs sm:text-sm"
            style={{ color: template.muted }}
          >
            {DEMO.role}
          </p>

          <div
            className="mt-7 space-y-2 text-[9px] sm:text-xs"
            style={{ color: template.muted }}
          >
            <ContactItem icon={Phone} template={template}>
              {DEMO.phone}
            </ContactItem>
            <ContactItem icon={Mail} template={template}>
              {DEMO.email}
            </ContactItem>
            <ContactItem icon={Globe} template={template}>
              {DEMO.website}
            </ContactItem>
          </div>
        </div>

        <QRMock template={template} />
      </div>
    </div>
  );
};

const Feature = ({
  icon: Icon,
  title,
  text,
  template,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  template: TemplateDefinition;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
    <div
      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
      style={{
        background: `${template.accent}12`,
        color: template.accent,
      }}
    >
      <Icon className="h-5 w-5" />
    </div>

    <h3 className="font-bold text-white">{title}</h3>

    <p className="mt-1 text-sm leading-6 text-slate-400">
      {text}
    </p>
  </div>
);

export default function OneSideTemplatePreviewPage() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const template = getTemplate(templateId);

  const currentIndex = TEMPLATES.findIndex(
    (item) => item.id === template.id,
  );

  const previousTemplate =
    TEMPLATES[
      (currentIndex - 1 + TEMPLATES.length) % TEMPLATES.length
    ];

  const nextTemplate =
    TEMPLATES[(currentIndex + 1) % TEMPLATES.length];

  const useTemplate = () => {
    navigate(
      `/tools/visiting-card-generator/one-side/editor/${template.id}`,
    );
  };

  const openTemplate = (id: string) => {
    navigate(
      `/tools/visiting-card-generator/one-side/template/${id}`,
    );
  };

  return (
    <PageTransition>
      <SEOHead
        title={`${template.name} | 1-Side Visiting Card Template | AHADEX TOOLS`}
        description={`Preview the ${template.name} one-side visiting card template from AHADEX TOOLS. Choose the design and customize your own professional card.`}
        canonical={`https://ahadex.fun/tools/visiting-card-generator/one-side/template/${template.id}`}
      />

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/tools/visiting-card-generator/one-side',
                )
              }
              className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to 1-Side Templates
            </button>
          </Reveal>

          <Reveal>
            <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
                    style={{
                      background: `${template.accent}14`,
                      color: template.accent,
                    }}
                  >
                    1-Side Template
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {template.category}
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                  {template.name}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  A complete single-side visiting card design.
                  Preview the finished composition before opening
                  the editor.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Template</span>
                <span
                  className="font-black"
                  style={{ color: template.accent }}
                >
                  {template.id}
                </span>
                <span>/</span>
                <span>{TEMPLATES.length}</span>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="rounded-[34px] border border-white/10 bg-white/[0.025] p-3 shadow-2xl sm:p-5">
              <div className="rounded-[28px] bg-black/20 p-2 sm:p-4">
                <PreviewCard template={template} />
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => openTemplate(previousTemplate.id)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Template
              </button>

              <button
                type="button"
                onClick={useTemplate}
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5"
                style={{
                  background: template.accent,
                  boxShadow: `0 18px 50px ${template.accent}25`,
                }}
              >
                <Sparkles className="h-4 w-4" />
                Use This Template
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => openTemplate(nextTemplate.id)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                Next Template
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={UserRound}
                title="Single-side design"
                text="A complete front-facing card composition with no second-side preview."
                template={template}
              />

              <Feature
                icon={BriefcaseBusiness}
                title="Professional layout"
                text="Designed around real business identity, contact information and hierarchy."
                template={template}
              />

              <Feature
                icon={Sparkles}
                title="Fully customizable"
                text="Use the selected visual direction as the starting point for your own card."
                template={template}
              />

              <Feature
                icon={Globe}
                title="Digital-ready"
                text="Built to present your professional identity clearly across modern screens."
                template={template}
              />
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `${template.accent}12`,
                    color: template.accent,
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-white">
                    How this preview works
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
                    The information shown here is demonstration content
                    used only to make the template look like a finished
                    visiting card. Selecting “Use This Template” opens
                    the editor, where your own information can be entered.
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-12 pb-10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">
                    Explore 1-Side Templates
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose another complete single-side design.
                  </p>
                </div>

                <span
                  className="hidden text-xs font-bold sm:block"
                  style={{ color: template.accent }}
                >
                  {TEMPLATES.length} designs
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TEMPLATES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openTemplate(item.id)}
                    className={`group rounded-2xl border p-4 text-left transition ${
                      item.id === template.id
                        ? 'border-white/20 bg-white/[0.08]'
                        : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black"
                        style={{
                          background: `${item.accent}14`,
                          color: item.accent,
                        }}
                      >
                        {item.id}
                      </span>

                      <ArrowRight
                        className="h-4 w-4 text-slate-600 transition group-hover:text-slate-300"
                      />
                    </div>

                    <h3 className="mt-4 text-sm font-black text-white">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.category}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </Reveal>
        </div>
      </main>
    </PageTransition>
  );
}