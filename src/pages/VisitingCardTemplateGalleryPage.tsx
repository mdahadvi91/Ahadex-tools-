import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Layers3,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';

type CardMode = 'one-side' | 'two-side';

type TemplateDefinition = {
  id: string;
  name: string;
  style: string;
  accent: string;
  accentSoft: string;
  background: string;
  foreground: string;
  muted: string;
  layout: 'left' | 'center' | 'split' | 'dark';
  badge: string;
};

const TEMPLATES: TemplateDefinition[] = [
  {
    id: '01',
    name: 'Executive Edge',
    style: 'Corporate',
    accent: '#22d3ee',
    accentSoft: '#083344',
    background: '#07111f',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'left',
    badge: 'Executive',
  },
  {
    id: '02',
    name: 'Midnight Gold',
    style: 'Luxury',
    accent: '#fbbf24',
    accentSoft: '#422006',
    background: '#11100d',
    foreground: '#fff7ed',
    muted: '#a8a29e',
    layout: 'center',
    badge: 'Luxury',
  },
  {
    id: '03',
    name: 'Tech Grid',
    style: 'Technology',
    accent: '#818cf8',
    accentSoft: '#1e1b4b',
    background: '#090b18',
    foreground: '#f8fafc',
    muted: '#9ca3af',
    layout: 'split',
    badge: 'Tech',
  },
  {
    id: '04',
    name: 'Pure Minimal',
    style: 'Minimal',
    accent: '#0f172a',
    accentSoft: '#e2e8f0',
    background: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    layout: 'left',
    badge: 'Minimal',
  },
  {
    id: '05',
    name: 'Royal Violet',
    style: 'Premium',
    accent: '#c084fc',
    accentSoft: '#3b0764',
    background: '#170b25',
    foreground: '#faf5ff',
    muted: '#c4b5fd',
    layout: 'center',
    badge: 'Premium',
  },
  {
    id: '06',
    name: 'Ocean Professional',
    style: 'Business',
    accent: '#38bdf8',
    accentSoft: '#082f49',
    background: '#08202d',
    foreground: '#f0f9ff',
    muted: '#7dd3fc',
    layout: 'split',
    badge: 'Business',
  },
  {
    id: '07',
    name: 'Emerald Studio',
    style: 'Creative',
    accent: '#34d399',
    accentSoft: '#064e3b',
    background: '#071a15',
    foreground: '#ecfdf5',
    muted: '#86efac',
    layout: 'left',
    badge: 'Creative',
  },
  {
    id: '08',
    name: 'Graphite Line',
    style: 'Editorial',
    accent: '#e5e7eb',
    accentSoft: '#27272a',
    background: '#18181b',
    foreground: '#fafafa',
    muted: '#a1a1aa',
    layout: 'dark',
    badge: 'Editorial',
  },
  {
    id: '09',
    name: 'Cobalt Architect',
    style: 'Modern',
    accent: '#60a5fa',
    accentSoft: '#172554',
    background: '#071426',
    foreground: '#eff6ff',
    muted: '#93c5fd',
    layout: 'split',
    badge: 'Modern',
  },
  {
    id: '10',
    name: 'Rose Atelier',
    style: 'Personal Brand',
    accent: '#fb7185',
    accentSoft: '#4c0519',
    background: '#1b0a11',
    foreground: '#fff1f2',
    muted: '#fda4af',
    layout: 'center',
    badge: 'Personal',
  },
  {
    id: '11',
    name: 'Copper Craft',
    style: 'Heritage',
    accent: '#fb923c',
    accentSoft: '#431407',
    background: '#1c110b',
    foreground: '#fff7ed',
    muted: '#fdba74',
    layout: 'left',
    badge: 'Heritage',
  },
  {
    id: '12',
    name: 'Arctic Clean',
    style: 'Clean',
    accent: '#0891b2',
    accentSoft: '#cffafe',
    background: '#ecfeff',
    foreground: '#164e63',
    muted: '#155e75',
    layout: 'split',
    badge: 'Clean',
  },
  {
    id: '13',
    name: 'Onyx Signature',
    style: 'Signature',
    accent: '#f8fafc',
    accentSoft: '#334155',
    background: '#020617',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'dark',
    badge: 'Signature',
  },
  {
    id: '14',
    name: 'Aqua Digital',
    style: 'Digital',
    accent: '#2dd4bf',
    accentSoft: '#134e4a',
    background: '#041b1b',
    foreground: '#f0fdfa',
    muted: '#99f6e4',
    layout: 'left',
    badge: 'Digital',
  },
  {
    id: '15',
    name: 'Solar Modern',
    style: 'Bold',
    accent: '#facc15',
    accentSoft: '#422006',
    background: '#15120a',
    foreground: '#fefce8',
    muted: '#fde68a',
    layout: 'split',
    badge: 'Bold',
  },
  {
    id: '16',
    name: 'Silver Frame',
    style: 'Classic',
    accent: '#cbd5e1',
    accentSoft: '#334155',
    background: '#111827',
    foreground: '#f8fafc',
    muted: '#94a3b8',
    layout: 'center',
    badge: 'Classic',
  },
];

const DEMO_NAMES = [
  'Alex Morgan',
  'Daniel Brooks',
  'Maya Wilson',
  'Noah Carter',
  'Olivia Bennett',
  'Ethan Parker',
  'Sophia Reed',
  'Lucas Mitchell',
  'Emma Collins',
  'James Anderson',
  'Ava Thompson',
  'Henry Walker',
  'Grace Turner',
  'Leo Harrison',
  'Isla Cooper',
  'Ryan Foster',
];

const DEMO_ROLES = [
  'Creative Director',
  'Managing Consultant',
  'Brand Strategist',
  'Software Engineer',
  'Marketing Specialist',
  'Product Designer',
  'Business Advisor',
  'Creative Producer',
  'Architect',
  'Digital Consultant',
  'Founder & CEO',
  'Project Manager',
  'UX Designer',
  'Technology Lead',
  'Visual Designer',
  'Operations Director',
];

const getModeCopy = (mode: CardMode) => {
  if (mode === 'two-side') {
    return {
      title: '2-Side Visiting Card Templates',
      description:
        'Choose a complete front-and-back visiting card design. Every template is presented as a finished visual concept before you start editing.',
      eyebrow: 'Front + Back Studio',
      countLabel: '16 two-side templates',
    };
  }

  return {
    title: '1-Side Visiting Card Templates',
    description:
      'Choose a complete single-side visiting card design. Review the visual hierarchy, typography, photo placement, contact layout, and branding before editing.',
    eyebrow: 'Single-Side Studio',
    countLabel: '16 one-side templates',
  };
};

const MiniPhoto = ({
  accent,
  size = 'md',
}: {
  accent: string;
  size?: 'sm' | 'md';
}) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 ${
      size === 'sm' ? 'h-7 w-7' : 'h-10 w-10'
    }`}
    style={{ boxShadow: `0 0 0 3px ${accent}22` }}
    aria-hidden="true"
  >
    <UserRound
      className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'}
      style={{ color: accent }}
    />
  </div>
);

const CardPreview: React.FC<{
  template: TemplateDefinition;
  mode: CardMode;
  index: number;
}> = ({ template, mode, index }) => {
  const name = DEMO_NAMES[index];
  const role = DEMO_ROLES[index];

  if (mode === 'two-side') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div
          className="relative aspect-[1.75/1] overflow-hidden rounded-lg p-3 shadow-lg"
          style={{
            background: template.background,
            color: template.foreground,
          }}
        >
          <div
            className="absolute right-0 top-0 h-16 w-16 rounded-full blur-2xl"
            style={{ background: template.accent, opacity: 0.18 }}
          />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span
                className="text-[7px] font-black uppercase tracking-[0.18em]"
                style={{ color: template.accent }}
              >
                NOVA STUDIO
              </span>
              <span className="text-[6px] opacity-60">01</span>
            </div>

            <div>
              <div
                className="mb-1 h-px w-8"
                style={{ background: template.accent }}
              />
              <p className="text-[10px] font-black leading-none">{name}</p>
              <p
                className="mt-1 text-[6px] font-medium"
                style={{ color: template.muted }}
              >
                {role}
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative aspect-[1.75/1] overflow-hidden rounded-lg p-3 shadow-lg"
          style={{
            background: template.accentSoft,
            color: template.foreground,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(135deg, transparent 45%, ${template.accent} 45%, ${template.accent} 48%, transparent 48%)`,
            }}
          />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p
                className="text-[6px] font-bold uppercase tracking-[0.16em]"
                style={{ color: template.accent }}
              >
                CONTACT
              </p>
              <p className="mt-1 text-[6px] opacity-80">+1 555 018 2040</p>
              <p className="mt-0.5 text-[6px] opacity-80">
                hello@novastudio.com
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[6px] opacity-70">novastudio.com</p>
                <p className="mt-0.5 text-[5px] opacity-50">
                  New York · London · Dubai
                </p>
              </div>

              <div
                className="flex h-8 w-8 items-center justify-center rounded-md"
                style={{
                  background: template.background,
                  border: `1px solid ${template.accent}55`,
                }}
              >
                <div
                  className="grid h-5 w-5 grid-cols-3 gap-[2px]"
                  aria-hidden="true"
                >
                  {Array.from({ length: 9 }).map((_, qrIndex) => (
                    <span
                      key={qrIndex}
                      className="rounded-[1px]"
                      style={{
                        background:
                          qrIndex % 3 === 0
                            ? template.accent
                            : template.foreground,
                        opacity: qrIndex % 2 === 0 ? 1 : 0.65,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCenter = template.layout === 'center';

  return (
    <div
      className="relative aspect-[1.75/1] overflow-hidden rounded-xl p-4 shadow-xl"
      style={{
        background: template.background,
        color: template.foreground,
      }}
    >
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl"
        style={{ background: template.accent, opacity: 0.18 }}
      />

      {template.layout === 'split' && (
        <div
          className="absolute bottom-0 left-0 top-0 w-[30%]"
          style={{
            background: template.accentSoft,
            borderRight: `1px solid ${template.accent}44`,
          }}
        />
      )}

      {template.layout === 'dark' && (
        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{ background: template.accent }}
        />
      )}

      <div
        className={`relative flex h-full ${
          isCenter ? 'items-center justify-center text-center' : 'items-center'
        }`}
      >
        {template.layout !== 'center' && (
          <MiniPhoto accent={template.accent} />
        )}

        <div
          className={
            template.layout === 'split'
              ? 'ml-auto w-[63%]'
              : template.layout === 'center'
                ? 'w-full'
                : 'ml-3'
          }
        >
          <div
            className={`mb-2 flex items-center gap-2 ${
              isCenter ? 'justify-center' : ''
            }`}
          >
            <span
              className="text-[7px] font-black uppercase tracking-[0.18em]"
              style={{ color: template.accent }}
            >
              NOVA STUDIO
            </span>
            <span className="text-[6px] opacity-40">/</span>
            <span className="text-[6px] opacity-50">{template.badge}</span>
          </div>

          {template.layout === 'center' && (
            <div className="mb-2 flex justify-center">
              <MiniPhoto accent={template.accent} size="sm" />
            </div>
          )}

          <h3 className="text-[14px] font-black leading-none">{name}</h3>
          <p
            className="mt-1 text-[7px] font-semibold"
            style={{ color: template.accent }}
          >
            {role}
          </p>

          <div
            className={`mt-3 space-y-1 text-[6px] ${
              isCenter ? 'flex flex-wrap justify-center gap-x-3' : ''
            }`}
            style={{ color: template.muted }}
          >
            <span>+1 555 018 2040</span>
            <span>hello@novastudio.com</span>
            <span>novastudio.com</span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-3 right-3 h-2 w-8 rounded-full"
        style={{ background: template.accent, opacity: 0.8 }}
      />
    </div>
  );
};

export const VisitingCardTemplateGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();

  const currentMode: CardMode =
    mode === 'two-side' ? 'two-side' : 'one-side';

  const copy = getModeCopy(currentMode);

  const handleUseTemplate = (templateId: string) => {
    navigate(
      `/tools/visiting-card-generator/${currentMode}/template/${templateId}`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title={`${copy.title} | AHADEX TOOLS`}
        description={copy.description}
        keywords={`visiting card templates, business card templates, ${currentMode === 'two-side' ? 'two side visiting card templates' : 'one side visiting card templates'}, professional business card design`}
        canonicalUrl={`https://ahadex.fun/tools/visiting-card-generator/${currentMode}`}
        toolData={{
          name: `AHADEX ${copy.title}`,
          description: copy.description,
          category: 'DesignApplication',
          slug: `visiting-card-generator-${currentMode}`,
        }}
      />

      <PageTransition>
        <main className="min-h-[calc(100vh-5rem)]">
          <section className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-0 top-64 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
              <Reveal direction="up">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/tools/visiting-card-generator')
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Card Format
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                      <Layers3 className="h-3.5 w-3.5 text-cyan-400" />
                      {copy.countLabel}
                    </span>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.08}>
                <div className="mx-auto max-w-3xl text-center">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    {copy.eyebrow}
                  </div>

                  <h1 className="text-3xl font-black tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
                    {copy.title}
                  </h1>

                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                    {copy.description}
                  </p>
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.16}>
                <div className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Finished visual previews
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2">
                    <UserRound className="h-3.5 w-3.5 text-cyan-400" />
                    Photo & contact hierarchy
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2">
                    <BriefcaseBusiness className="h-3.5 w-3.5 text-violet-400" />
                    Professional layouts
                  </span>
                </div>
              </Reveal>

              <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {TEMPLATES.map((template, index) => (
                  <Reveal
                    key={template.id}
                    direction="up"
                    delay={Math.min(index * 0.025, 0.3)}
                  >
                    <article className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-3 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-900/70">
                      <CardPreview
                        template={template}
                        mode={currentMode}
                        index={index}
                      />

                      <div className="px-1 pb-1 pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                              Template {template.id}
                            </p>
                            <h2 className="mt-1 text-base font-bold text-slate-100">
                              {template.name}
                            </h2>
                            <p
                              className="mt-1 text-xs font-semibold"
                              style={{ color: template.accent }}
                            >
                              {template.style}
                            </p>
                          </div>

                          <span
                            className="mt-1 h-3 w-3 rounded-full ring-4 ring-white/[0.03]"
                            style={{ background: template.accent }}
                            aria-hidden="true"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUseTemplate(template.id)}
                          className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-xs font-bold text-slate-300 transition-all duration-300 hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                          aria-label={`Use ${template.name} template`}
                        >
                          <span>Preview & Use</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>

              <Reveal direction="up" delay={0.35}>
                <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-center text-xs leading-6 text-slate-500">
                  Each preview uses fictional information only. Your real photo,
                  name, profession, company, contact details, social links, and
                  logo will be added later in the dedicated editor.
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </PageTransition>
    </>
  );
};