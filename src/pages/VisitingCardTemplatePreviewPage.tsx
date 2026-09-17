import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Mail,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';

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

const getMode = (value?: string): CardMode =>
  value === 'two-side' ? 'two-side' : 'one-side';

const getTemplate = (id?: string): TemplateStyle =>
  TEMPLATE_STYLES[id || '01'] || TEMPLATE_STYLES['01'];

const ProfileMark = ({
  accent,
  size = 'lg',
}: {
  accent: string;
  size?: 'sm' | 'lg';
}) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full border bg-white/10 ${
      size === 'lg'
        ? 'h-20 w-20 border-2'
        : 'h-12 w-12 border'
    }`}
    style={{
      borderColor: `${accent}88`,
      boxShadow: `0 0 0 6px ${accent}18, 0 0 30px ${accent}22`,
    }}
  >
    <UserRound
      className={size === 'lg' ? 'h-9 w-9' : 'h-5 w-5'}
      style={{ color: accent }}
    />
  </div>
);

const ContactLine = ({
  icon: Icon,
  children,
  color,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  color: string;
}) => (
  <div className="flex items-center gap-3">
    <Icon className="h-4 w-4 shrink-0" style={{ color }} />
    <span>{children}</span>
  </div>
);

const QrPattern = ({ accent }: { accent: string }) => (
  <div
    className="grid h-20 w-20 grid-cols-5 gap-1 rounded-lg p-2"
    style={{
      background: '#ffffff',
      boxShadow: `0 8px 30px ${accent}22`,
    }}
    aria-hidden="true"
  >
    {Array.from({ length: 25 }).map((_, index) => (
      <span
        key={index}
        className="rounded-[1px]"
        style={{
          background:
            index % 3 === 0 || index % 5 === 1
              ? '#111827'
              : '#ffffff',
        }}
      />
    ))}
  </div>
);

const OneSideCard = ({
  template,
  index,
}: {
  template: TemplateStyle;
  index: number;
}) => {
  const name = DEMO_NAMES[index];
  const role = DEMO_ROLES[index];

  return (
    <div
      className="relative mx-auto aspect-[1.75/1] w-full max-w-[900px] overflow-hidden rounded-[28px] p-8 shadow-2xl sm:p-10 lg:p-14"
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
        className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
        style={{
          background: template.accent,
          opacity: 0.08,
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
          className="absolute bottom-0 left-0 top-0 w-2"
          style={{ background: template.accent }}
        />
      )}

      <div
        className={`relative flex h-full ${
          template.layout === 'center'
            ? 'items-center justify-center text-center'
            : 'items-center'
        }`}
      >
        {template.layout !== 'center' && (
          <ProfileMark accent={template.accent} />
        )}

        <div
          className={
            template.layout === 'split'
              ? 'ml-auto w-[64%]'
              : template.layout === 'center'
                ? 'w-full'
                : 'ml-8'
          }
        >
          <div
            className={`mb-5 flex items-center gap-3 ${
              template.layout === 'center'
                ? 'justify-center'
                : ''
            }`}
          >
            <span
              className="text-xs font-black uppercase tracking-[0.28em]"
              style={{ color: template.accent }}
            >
              NOVA STUDIO
            </span>

            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: template.accent }}
            />

            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: template.muted }}
            >
              {template.category}
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {name}
          </h2>

          <p
            className="mt-3 text-base font-semibold sm:text-lg"
            style={{ color: template.accent }}
          >
            {role}
          </p>

          <div
            className={`mt-8 grid gap-x-8 gap-y-3 text-xs sm:text-sm ${
              template.layout === 'center'
                ? 'mx-auto max-w-xl sm:grid-cols-2'
                : 'max-w-2xl sm:grid-cols-2'
            }`}
            style={{ color: template.muted }}
          >
            <ContactLine
              icon={Phone}
              color={template.accent}
            >
              +1 555 018 2040
            </ContactLine>

            <ContactLine
              icon={MessageCircle}
              color={template.accent}
            >
              WhatsApp available
            </ContactLine>

            <ContactLine
              icon={Mail}
              color={template.accent}
            >
              hello@novastudio.com
            </ContactLine>

            <ContactLine
              icon={Globe}
              color={template.accent}
            >
              novastudio.com
            </ContactLine>

            <ContactLine
              icon={MapPin}
              color={template.accent}
            >
              New York · London · Dubai
            </ContactLine>

            <ContactLine
              icon={Linkedin}
              color={template.accent}
            >
              linkedin.com/in/alexmorgan
            </ContactLine>
          </div>

          <div
            className={`mt-8 flex items-center gap-4 ${
              template.layout === 'center'
                ? 'justify-center'
                : ''
            }`}
          >
            <span
              className="h-px w-14"
              style={{ background: template.accent }}
            />

            <span
              className="text-[10px] font-bold uppercase tracking-[0.24em]"
              style={{ color: template.muted }}
            >
              Professional identity
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TwoSideCard = ({
  template,
  index,
}: {
  template: TemplateStyle;
  index: number;
}) => {
  const name = DEMO_NAMES[index];
  const role = DEMO_ROLES[index];

  return (
    <div className="mx-auto grid w-full max-w-[1100px] gap-6 lg:grid-cols-2">
      <div
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
            opacity: 0.15,
          }}
        />

        {template.layout === 'split' && (
          <div
            className="absolute inset-y-0 left-0 w-[28%]"
            style={{
              background: template.accentSoft,
            }}
          />
        )}

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: template.accent }}
            >
              NOVA STUDIO
            </span>

            <span
              className="rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-widest"
              style={{
                borderColor: `${template.accent}55`,
                color: template.muted,
              }}
            >
              FRONT
            </span>
          </div>

          <div className="flex items-center gap-5">
            <ProfileMark accent={template.accent} size="lg" />

            <div>
              <h2 className="text-2xl font-black sm:text-3xl">
                {name}
              </h2>
              <p
                className="mt-2 text-sm font-semibold"
                style={{ color: template.accent }}
              >
                {role}
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-5 text-[10px] sm:text-xs"
            style={{ color: template.muted }}
          >
            <span>Creative direction</span>
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: template.accent }}
            />
            <span>Brand strategy</span>
          </div>
        </div>
      </div>

      <div
        className="relative aspect-[1.75/1] overflow-hidden rounded-[26px] p-8 shadow-2xl sm:p-10"
        style={{
          background: template.accentSoft,
          color: template.foreground,
          boxShadow: `0 30px 70px ${template.accent}14`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(135deg, transparent 45%, ${template.accent} 45%, ${template.accent} 47%, transparent 47%)`,
          }}
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: template.accent }}
            >
              CONTACT
            </span>

            <span
              className="rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-widest"
              style={{
                borderColor: `${template.accent}55`,
                color: template.muted,
              }}
            >
              BACK
            </span>
          </div>

          <div
            className="grid gap-3 text-xs"
            style={{ color: template.muted }}
          >
            <ContactLine
              icon={Phone}
              color={template.accent}
            >
              +1 555 018 2040
            </ContactLine>

            <ContactLine
              icon={Mail}
              color={template.accent}
            >
              hello@novastudio.com
            </ContactLine>

            <ContactLine
              icon={Globe}
              color={template.accent}
            >
              novastudio.com
            </ContactLine>

            <ContactLine
              icon={Instagram}
              color={template.accent}
            >
              @novastudio
            </ContactLine>

            <ContactLine
              icon={Linkedin}
              color={template.accent}
            >
              /in/alexmorgan
            </ContactLine>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <p
                className="text-sm font-black"
                style={{ color: template.foreground }}
              >
                New York · London · Dubai
              </p>

              <p
                className="mt-2 text-[9px]"
                style={{ color: template.muted }}
              >
                Business identity & professional contact
              </p>
            </div>

            <QrPattern accent={template.accent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const VisitingCardTemplatePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode, templateId } = useParams<{
    mode?: string;
    templateId?: string;
  }>();

  const currentMode = getMode(mode);
  const template = getTemplate(templateId);
  const numericIndex = Math.max(
    0,
    Math.min(15, Number.parseInt(templateId || '01', 10) - 1),
  );

  const editorPath = `/tools/visiting-card-generator/${currentMode}/editor/${templateId || '01'}`;

  return (
    <>
      <SEOHead
        title={`${template.name} | ${currentMode === 'two-side' ? '2-Side' : '1-Side'} Visiting Card Template | AHADEX TOOLS`}
        description={`Preview the ${template.name} visiting card template before creating your professional card with AHADEX TOOLS.`}
        canonical={`https://ahadex.fun/tools/visiting-card-generator/${currentMode}/template/${templateId || '01'}`}
      />

      <PageTransition>
        <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/tools/visiting-card-generator/${currentMode}`,
                  )
                }
                className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 dark:text-slate-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to templates
              </button>
            </Reveal>

            <Reveal delay={0.05}>
              <section className="mb-10 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  Template preview
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  {template.name}
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                  Review the complete visual composition before
                  entering your own information. This demo uses
                  fictional profile data.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    {template.category}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    {currentMode === 'two-side'
                      ? 'Front + Back'
                      : 'Single Side'}
                  </span>

                  <span
                    className="rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{
                      background: `${template.accent}18`,
                      color: template.accent,
                    }}
                  >
                    Template {templateId || '01'}
                  </span>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.1}>
              <section
                aria-label={`${template.name} preview`}
                className="rounded-[32px] border border-slate-200/80 bg-white/70 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] sm:p-6 lg:p-10"
              >
                {currentMode === 'two-side' ? (
                  <TwoSideCard
                    template={template}
                    index={numericIndex}
                  />
                ) : (
                  <OneSideCard
                    template={template}
                    index={numericIndex}
                  />
                )}
              </section>
            </Reveal>

            <Reveal delay={0.15}>
              <section className="mx-auto mt-10 max-w-4xl rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] sm:p-8">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `${template.accent}15`,
                        color: template.accent,
                      }}
                    >
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Complete design
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Typography, spacing, shapes and hierarchy are
                        already composed.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `${template.accent}15`,
                        color: template.accent,
                      }}
                    >
                      <BriefcaseBusiness className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Professional layout
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Built around readable business information
                        and clean visual hierarchy.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `${template.accent}15`,
                        color: template.accent,
                      }}
                    >
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Personalizable
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Replace the demo profile with your own details
                        in the editor.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/tools/visiting-card-generator/${currentMode}`,
                    )
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Choose another template
                </button>

                <button
                  type="button"
                  onClick={() => navigate(editorPath)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 sm:w-auto"
                  style={{
                    background: template.accent,
                    boxShadow: `0 12px 35px ${template.accent}35`,
                  }}
                >
                  Use This Template
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Reveal>

            <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
              Demo content is fictional and will be replaced by your
              information in the editor.
            </p>
          </div>
        </main>
      </PageTransition>
    </>
  );
};

export default VisitingCardTemplatePreviewPage;