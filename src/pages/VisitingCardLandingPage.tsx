import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Layers3,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';

const ONE_SIDE_FEATURES = [
  'Single front-side business card',
  '16 professionally designed templates',
  'Profile photo and company logo',
  'Personal and business contact details',
  'Live preview before export',
  'High-resolution image download',
];

const TWO_SIDE_FEATURES = [
  'Complete front and back card',
  '16 professionally designed templates',
  'Separate front and back layouts',
  'Photo, logo, contacts and company details',
  'Live two-side preview',
  'Print-ready export workflow',
];

export const VisitingCardLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (mode: 'one-side' | 'two-side') => {
    navigate(`/tools/visiting-card-generator/${mode}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEOHead
        title="Visiting Card Generator"
        description="Create a professional visiting card online with AHADEX TOOLS. Choose a 1-side or 2-side card format, select a professionally designed template, add your details, and export your finished card."
        keywords="visiting card generator, business card maker, visiting card maker online, business card generator, professional visiting card, 1 side visiting card, 2 side visiting card"
        canonicalUrl="https://ahadex.fun/tools/visiting-card-generator"
        toolData={{
          name: 'AHADEX Visiting Card Generator',
          description:
            'Create professional one-side or two-side visiting cards online with customizable templates, personal details, photos, logos, and high-resolution export.',
          category: 'DesignApplication',
          slug: 'visiting-card-generator',
        }}
      />

      <PageTransition>
        <main className="min-h-[calc(100vh-5rem)]">
          <section className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-0 top-48 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
              <Reveal direction="up">
                <div className="mx-auto max-w-3xl text-center">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Professional Card Studio
                  </div>

                  <h1 className="text-4xl font-black tracking-tight text-slate-100 sm:text-5xl lg:text-6xl">
                    Visiting Card Generator
                  </h1>

                  <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                    Create a polished professional visiting card from a carefully designed
                    template. Choose your card format first, then build it with your own
                    information.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Browser-based workflow
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                      <Layers3 className="h-3.5 w-3.5 text-cyan-400" />
                      1-side & 2-side formats
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                      <BriefcaseBusiness className="h-3.5 w-3.5 text-violet-400" />
                      Professional templates
                    </span>
                  </div>
                </div>
              </Reveal>

              <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:mt-16 md:grid-cols-2">
                <Reveal direction="up" delay={0.1}>
                  <button
                    type="button"
                    onClick={() => handleSelect('one-side')}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/70 hover:shadow-cyan-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:p-8"
                    aria-label="Create a 1-Side Visiting Card"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent opacity-70"
                      aria-hidden="true"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition-transform duration-300 group-hover:scale-105">
                        <UserRound className="h-7 w-7" />
                      </div>

                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                        1-Side
                      </span>
                    </div>

                    <div className="mt-7">
                      <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
                        1-Side Visiting Card
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Build a focused single-side professional card with your identity,
                        contact information, photo, logo, and business details.
                      </p>
                    </div>

                    <ul className="mt-7 space-y-3">
                      {ONE_SIDE_FEATURES.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                      <span className="text-sm font-semibold text-slate-200">
                        Start with 1-Side
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                </Reveal>

                <Reveal direction="up" delay={0.18}>
                  <button
                    type="button"
                    onClick={() => handleSelect('two-side')}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-slate-900/70 hover:shadow-violet-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:p-8"
                    aria-label="Create a 2-Side Visiting Card"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent opacity-70"
                      aria-hidden="true"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300 transition-transform duration-300 group-hover:scale-105">
                        <Layers3 className="h-7 w-7" />
                      </div>

                      <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-violet-300">
                        2-Side
                      </span>
                    </div>

                    <div className="mt-7">
                      <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
                        2-Side Visiting Card
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Design a complete front-and-back card for richer branding, contact
                        information, company details, services, and print-ready presentation.
                      </p>
                    </div>

                    <ul className="mt-7 space-y-3">
                      {TWO_SIDE_FEATURES.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                      <span className="text-sm font-semibold text-slate-200">
                        Start with 2-Side
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 group-hover:border-violet-400/30 group-hover:bg-violet-400/10 group-hover:text-violet-300">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                </Reveal>
              </div>

              <Reveal direction="up" delay={0.28}>
                <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-center text-xs leading-5 text-slate-500 sm:px-6">
                  Your card format is selected first. Templates, personal information,
                  live editing, preview, and export are handled in the following dedicated
                  steps.
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </PageTransition>
    </>
  );
};