import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  QrCode,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';

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

type TemplateDefinition = {
  id: string;
  name: string;
  category: string;
  accent: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  layout: TemplateLayout;
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

const MiniAvatar = ({
  template,
  large = false,
}: {
  template: TemplateDefinition;
  large?: boolean;
}) => (
  <div
    className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 ${
      large ? 'h-20 w-20' : 'h-10 w-10'
    }`}
    style={{
      borderColor: `${template.accent}99`,
      background: `${template.accent}14`,
      boxShadow: `0 0 0 5px ${template.accent}12, 0 12px 35px ${template.accent}18`,
    }}
  >
    <UserRound
      className={large ? 'h-9 w-9' : 'h-5 w-5'}
      style={{ color: template.accent }}
    />
  </div>
);

const ContactItem = ({
  icon: Icon,
  children,
  template,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  template: TemplateDefinition;
}) => (
  <div className="flex min-w-0 items-center gap-1.5">
    <Icon
      className="h-3 w-3 shrink-0"
      style={{ color: template.accent }}
    />
    <span className="truncate">{children}</span>
  </div>
);

const QrMock = ({
  template,
  light = false,
}: {
  template: TemplateDefinition;
  light?: boolean;
}) => (
  <div
    className="grid h-10 w-10 shrink-0 grid-cols-5 gap-[2px] rounded-md p-1"
    style={{
      background: light ? '#ffffff' : `${template.foreground}10`,
      border: `1px solid ${light ? '#d1d5db' : `${template.accent}44`}`,
    }}
    aria-hidden="true"
  >
    {Array.from({ length: 25 }).map((_, index) => {
      const filled =
        index % 3 === 0 ||
        index % 5 === 0 ||
        index === 7 ||
        index === 13 ||
        index === 19 ||
        index === 24;

      return (
        <span
          key={index}
          className="rounded-[1px]"
          style={{
            background: filled
              ? light
                ? '#111827'
                : template.foreground
              : 'transparent',
          }}
        />
      );
    })}
  </div>
);

const CardShell = ({
  template,
  children,
  className = '',
}: {
  template: TemplateDefinition;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative aspect-[1.75/1] w-full overflow-hidden rounded-[22px] ${className}`}
    style={{
      background: template.background,
      color: template.foreground,
      boxShadow: `0 25px 65px ${template.accent}18`,
    }}
  >
    {children}
  </div>
);

const DemoCard = ({
  template,
}: {
  template: TemplateDefinition;
}) => {
  const accent = template.accent;

  if (template.layout === 'portrait') {
    return (
      <CardShell template={template} className="p-5">
        <div
          className="absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.22 }}
        />

        <div className="relative flex h-full items-center gap-5">
          <MiniAvatar template={template} large />

          <div className="min-w-0">
            <p
              className="text-[7px] font-black uppercase tracking-[0.3em]"
              style={{ color: accent }}
            >
              NOVA STUDIO
            </p>

            <h3 className="mt-2 text-xl font-black tracking-tight">
              {DEMO.name}
            </h3>

            <p
              className="mt-1 text-[8px] font-semibold"
              style={{ color: accent }}
            >
              {DEMO.role}
            </p>

            <div
              className="mt-4 space-y-1 text-[6.5px]"
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
        </div>
      </CardShell>
    );
  }

  if (template.layout === 'luxury') {
    return (
      <CardShell template={template} className="p-6">
        <div
          className="absolute inset-3 rounded-[17px] border"
          style={{ borderColor: `${accent}55` }}
        />

        <div
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border font-serif text-sm"
          style={{
            borderColor: `${accent}66`,
            color: accent,
          }}
        >
          AM
        </div>

        <div className="relative flex h-full flex-col justify-center">
          <p
            className="text-[7px] font-bold uppercase tracking-[0.42em]"
            style={{ color: accent }}
          >
            NOVA STUDIO
          </p>

          <h3 className="mt-3 font-serif text-2xl tracking-wide">
            {DEMO.name}
          </h3>

          <p
            className="mt-1 text-[7px] uppercase tracking-[0.2em]"
            style={{ color: template.muted }}
          >
            {DEMO.role}
          </p>

          <div
            className="mt-5 h-px w-16"
            style={{ background: accent }}
          />

          <div
            className="mt-4 text-[6.5px]"
            style={{ color: template.muted }}
          >
            {DEMO.phone} · {DEMO.email} · {DEMO.website}
          </div>
        </div>
      </CardShell>
    );
  }

  if (template.layout === 'editorial') {
    return (
      <CardShell template={template}>
        <div
          className="absolute bottom-0 left-0 top-0 w-[31%]"
          style={{ background: template.accentSoft }}
        />

        <div className="relative flex h-full">
          <div className="flex w-[31%] items-end p-5">
            <div>
              <p
                className="text-3xl font-black leading-none"
                style={{ color: accent }}
              >
                AM
              </p>

              <p
                className="mt-2 text-[6px] font-bold uppercase tracking-[0.2em]"
                style={{ color: template.muted }}
              >
                Identity
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center p-6">
            <p
              className="text-[7px] font-black uppercase tracking-[0.28em]"
              style={{ color: accent }}
            >
              {DEMO.company}
            </p>

            <h3 className="mt-2 text-2xl font-black tracking-tight">
              {DEMO.name}
            </h3>

            <p
              className="mt-1 text-[8px] font-semibold"
              style={{ color: template.muted }}
            >
              {DEMO.role}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[6px]">
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
      </CardShell>
    );
  }

  if (template.layout === 'minimal') {
    return (
      <CardShell
        template={template}
        className="border bg-white p-7"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <p className="text-[7px] font-black uppercase tracking-[0.32em]">
              AHADEX
            </p>

            <span className="text-[6px] font-medium text-slate-400">
              BUSINESS IDENTITY
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-black tracking-[-0.05em]">
              {DEMO.name}
            </h3>

            <p className="mt-1 text-[8px] font-semibold text-slate-500">
              {DEMO.role} · {DEMO.company}
            </p>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1 text-[6.5px] text-slate-500">
              <p>{DEMO.phone}</p>
              <p>{DEMO.email}</p>
              <p>{DEMO.website}</p>
            </div>

            <QrMock template={template} light />
          </div>
        </div>
      </CardShell>
    );
  }

  if (template.layout === 'grid') {
    return (
      <CardShell template={template} className="p-6">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(${accent}18 1px, transparent 1px),
              linear-gradient(90deg, ${accent}18 1px, transparent 1px)
            `,
            backgroundSize: '26px 26px',
          }}
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span
              className="text-[7px] font-black uppercase tracking-[0.3em]"
              style={{ color: accent }}
            >
              NOVA / ARCH
            </span>

            <BriefcaseBusiness
              className="h-4 w-4"
              style={{ color: accent }}
            />
          </div>

          <div>
            <p className="text-[6px] uppercase tracking-[0.22em] opacity-60">
              {DEMO.role}
            </p>

            <h3 className="mt-1 text-2xl font-black">
              {DEMO.name}
            </h3>

            <div
              className="mt-3 h-px w-full"
              style={{ background: `${accent}55` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-[5.5px]">
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
      </CardShell>
    );
  }

  if (template.layout === 'asymmetric') {
    return (
      <CardShell template={template}>
        <div
          className="absolute right-0 top-0 h-full w-[38%]"
          style={{ background: `${accent}12` }}
        />

        <div
          className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.15 }}
        />

        <div className="relative flex h-full">
          <div className="flex w-[57%] flex-col justify-center p-6">
            <p
              className="text-[7px] font-black uppercase tracking-[0.28em]"
              style={{ color: accent }}
            >
              CREATIVE OFFICE
            </p>

            <h3 className="mt-2 text-2xl font-black">
              {DEMO.name}
            </h3>

            <p
              className="mt-1 text-[7px]"
              style={{ color: template.muted }}
            >
              {DEMO.role}
            </p>

            <div className="mt-4 space-y-1 text-[6px]">
              <ContactItem icon={Mail} template={template}>
                {DEMO.email}
              </ContactItem>
              <ContactItem icon={Globe} template={template}>
                {DEMO.website}
              </ContactItem>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="rotate-[-8deg]">
              <MiniAvatar template={template} large />
            </div>
          </div>
        </div>
      </CardShell>
    );
  }

  if (template.layout === 'glass') {
    return (
      <CardShell template={template} className="p-5">
        <div
          className="absolute -left-16 -top-16 h-44 w-44 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.18 }}
        />

        <div
          className="absolute bottom-5 right-5 top-5 w-px"
          style={{ background: `${accent}44` }}
        />

        <div
          className="relative flex h-full flex-col justify-between rounded-[18px] border p-5 backdrop-blur-xl"
          style={{
            borderColor: `${accent}33`,
            background: 'rgba(255,255,255,0.045)',
          }}
        >
          <div className="flex items-center gap-3">
            <MiniAvatar template />

            <div>
              <p className="text-[5.5px] uppercase tracking-[0.25em] opacity-50">
                DIGITAL IDENTITY
              </p>

              <p className="mt-1 text-[8px] font-bold">
                {DEMO.company}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black">
              {DEMO.name}
            </h3>

            <p
              className="mt-1 text-[7px] font-semibold"
              style={{ color: accent }}
            >
              {DEMO.role}
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-2 text-[6px]"
            style={{ color: template.muted }}
          >
            <ContactItem icon={Phone} template={template}>
              {DEMO.phone}
            </ContactItem>

            <ContactItem icon={Mail} template={template}>
              {DEMO.email}
            </ContactItem>
          </div>
        </div>
      </CardShell>
    );
  }

  if (template.layout === 'frame') {
    return (
      <CardShell template={template} className="p-5">
        <div
          className="absolute inset-4 rounded-[16px] border-2"
          style={{ borderColor: `${accent}44` }}
        />

        <div
          className="absolute left-7 top-7 h-8 w-8 border-l-2 border-t-2"
          style={{ borderColor: accent }}
        />

        <div
          className="absolute bottom-7 right-7 h-8 w-8 border-b-2 border-r-2"
          style={{ borderColor: accent }}
        />

        <div className="relative flex h-full flex-col items-center justify-center text-center">
          <p
            className="text-[7px] font-black uppercase tracking-[0.4em]"
            style={{ color: accent }}
          >
            {DEMO.company}
          </p>

          <h3 className="mt-3 text-2xl font-black">
            {DEMO.name}
          </h3>

          <p
            className="mt-1 text-[7px] font-medium"
            style={{ color: template.muted }}
          >
            {DEMO.role}
          </p>

          <div
            className="my-4 h-px w-16"
            style={{ background: accent }}
          />

          <div
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[6px]"
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
      </CardShell>
    );
  }

  if (template.layout === 'bold') {
    return (
      <CardShell template={template} className="p-6">
        <div
          className="absolute right-0 top-0 h-full w-[39%]"
          style={{ background: `${accent}12` }}
        />

        <div
          className="absolute bottom-0 left-0 h-1"
          style={{ background: accent, width: '48%' }}
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex justify-between">
            <span
              className="text-[7px] font-black uppercase tracking-[0.32em]"
              style={{ color: accent }}
            >
              AHADEX
            </span>

            <QrCode
              className="h-4 w-4"
              style={{ color: accent }}
            />
          </div>

          <div>
            <p
              className="text-[7px] font-bold uppercase tracking-[0.18em]"
              style={{ color: template.muted }}
            >
              {DEMO.role}
            </p>

            <h3 className="mt-1 text-3xl font-black uppercase tracking-[-0.04em]">
              {DEMO.name}
            </h3>

            <p
              className="mt-2 text-[7px] font-semibold"
              style={{ color: accent }}
            >
              {DEMO.company}
            </p>
          </div>

          <div
            className="grid grid-cols-3 gap-2 text-[5.5px]"
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
      </CardShell>
    );
  }

  if (template.layout === 'split') {
    return (
      <CardShell template={template}>
        <div
          className="absolute bottom-0 left-0 top-0 w-[42%]"
          style={{ background: template.accentSoft }}
        />

        <div className="relative flex h-full">
          <div className="flex w-[42%] items-center justify-center">
            <div className="text-center">
              <MiniAvatar template={template} large />

              <p
                className="mt-3 text-[6px] font-black uppercase tracking-[0.28em]"
                style={{ color: accent }}
              >
                {DEMO.company}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center p-6">
            <p
              className="text-[6px] font-bold uppercase tracking-[0.24em]"
              style={{ color: accent }}
            >
              PROFESSIONAL
            </p>

            <h3 className="mt-2 text-2xl font-black">
              {DEMO.name}
            </h3>

            <p
              className="mt-1 text-[7px]"
              style={{ color: template.muted }}
            >
              {DEMO.role}
            </p>

            <div
              className="mt-5 space-y-2 text-[6px]"
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
      </CardShell>
    );
  }

  return (
    <CardShell template={template} className="p-6">
      <div
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
        style={{ background: accent, opacity: 0.18 }}
      />

      <div className="relative flex h-full items-center">
        <div className="w-[58%]">
          <p
            className="text-[7px] font-black uppercase tracking-[0.28em]"
            style={{ color: accent }}
          >
            NOVA STUDIO
          </p>

          <h3 className="mt-2 text-2xl font-black">
            {DEMO.name}
          </h3>

          <p
            className="mt-1 text-[7px] font-semibold"
            style={{ color: template.muted }}
          >
            {DEMO.role}
          </p>

          <div
            className="mt-5 space-y-2 text-[6px]"
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

        <div className="ml-auto">
          <MiniAvatar template={template} large />
        </div>
      </div>
    </CardShell>
  );
};

export const OneSideTemplateGalleryPage: React.FC = () => {
  const navigate = useNavigate();

  const openEditor = (templateId: string) => {
    navigate(
      `/tools/visiting-card-generator/one-side/editor/${templateId}`,
    );
  };

  return (
    <PageTransition>
      <SEOHead
        title="1-Side Visiting Card Templates | AHADEX TOOLS"
        description="Explore finished single-side visiting card designs from AHADEX TOOLS. Choose a design and go directly to the editor to create your own professional card."
        canonical="https://ahadex.fun/tools/visiting-card-generator/one-side"
      />

      <main className="min-h-screen px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() =>
                navigate('/tools/visiting-card-generator')
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-2 text-xs font-bold text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              16 unique 1-side designs
            </div>
          </div>

          <Reveal>
            <section className="mb-10 max-w-4xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Single-Side Studio
              </p>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                1-Side Visiting Card Templates
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Browse complete single-side card designs before editing.
                Every preview is shown as a finished card so you can choose
                the visual direction first and start editing immediately.
              </p>
            </section>
          </Reveal>

          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'Finished previews',
                text: 'See the complete card design before editing.',
              },
              {
                icon: UserRound,
                title: 'Direct editing',
                text: 'Choose a template and open its editor directly.',
              },
              {
                icon: QrCode,
                title: 'Print-ready workflow',
                text: 'Build your card from one consistent template.',
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                >
                  <Icon className="h-5 w-5 text-cyan-300" />

                  <h2 className="mt-3 text-sm font-bold text-white">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {TEMPLATES.map((template, index) => (
              <Reveal
                key={template.id}
                delay={Math.min(index * 0.025, 0.35)}
              >
                <article className="group overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.025] p-3 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.045]">
                  <div className="rounded-[20px] bg-black/10 p-2">
                    <DemoCard template={template} />
                  </div>

                  <div className="px-2 pb-2 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ background: template.accent }}
                          />

                          <span className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            {template.category}
                          </span>
                        </div>

                        <h2 className="mt-2 truncate text-lg font-black text-white">
                          {template.name}
                        </h2>
                      </div>

                      <span className="shrink-0 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold text-slate-500">
                        {template.id}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditor(template.id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-bold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-100"
                    >
                      Use This Template
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <section className="mt-12 rounded-[26px] border border-cyan-400/10 bg-cyan-400/[0.025] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-[0.22em]">
                    Choose once, customize freely
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-black text-white">
                  Your selected design stays intact while you build your card.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The template is only the starting visual system. Your own
                  information, profile photo, company logo, contact details
                  and branding will be handled inside the editor.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('/tools/visiting-card-generator')
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Visiting Card Studio
              </button>
            </div>
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default OneSideTemplateGalleryPage;