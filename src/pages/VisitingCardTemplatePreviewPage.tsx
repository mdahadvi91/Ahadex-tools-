import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Layers3,
  Palette,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';
import { OneSideCardCanvas } from '../components/visiting-card/OneSideCardCanvas';
import { TwoSideCardCanvas } from '../components/visiting-card/TwoSideCardCanvas';
import { ScaledCardPreview } from '../components/visiting-card/common/ScaledCardPreview';
import { getOneSideTemplate } from '../data/visiting-card/oneSideTemplates';
import { getTwoSideTemplate } from '../data/visiting-card/twoSideTemplates';
import { DEFAULT_AHAD_DATA, DEFAULT_TWO_SIDE_AHAD_DATA } from '../types/visitingCard';

export const VisitingCardTemplatePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode, templateId } = useParams<{
    mode?: string;
    templateId?: string;
  }>();

  const isTwoSide = mode === 'two-side';
  const id = templateId || '01';

  const oneSideTemplate = getOneSideTemplate(id);
  const twoSideTemplate = getTwoSideTemplate(id);
  const activeTemplate = isTwoSide ? twoSideTemplate : oneSideTemplate;

  const [activeSide, setActiveSide] = useState<'front' | 'back' | 'both'>('both');
  const [previewScaleMode, setPreviewScaleMode] = useState<'fit' | 'comfortable' | 'compact'>('comfortable');

  const editorPath = isTwoSide
    ? `/tools/visiting-card-generator/two-side/editor/${id}`
    : `/tools/visiting-card-generator/one-side/editor/${id}`;

  const galleryPath = isTwoSide
    ? '/tools/visiting-card-generator/two-side'
    : '/tools/visiting-card-generator/one-side';

  return (
    <PageTransition>
      <SEOHead
        title={`${activeTemplate.name} (${isTwoSide ? '2-Side' : '1-Side'}) Template Preview | AHADEX TOOLS`}
        description={`Preview the ${activeTemplate.name} visiting card template. View full design with portrait photo, verified AHADEX layout, and continue to customize.`}
      />

      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(galleryPath)}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {isTwoSide ? '2-Side' : '1-Side'} Templates
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                  isTwoSide
                    ? 'border-violet-400/20 bg-violet-400/10 text-violet-300'
                    : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
                }`}
              >
                {isTwoSide ? '2-SIDE PREVIEW' : '1-SIDE PREVIEW'}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-400">
                Template #{activeTemplate.id} · {activeTemplate.name}
              </span>
            </div>
          </div>

          {/* Title and Intro */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-bold text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Ready Template Demonstration
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {activeTemplate.name}
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-400">
              {activeTemplate.description} Review this ready layout below, then click &ldquo;Next: Customize Card&rdquo; to input your own photo, name, and details.
            </p>

            {/* 2-Side View Switcher if applicable */}
            {isTwoSide && (
              <div className="mt-6 flex items-center justify-center">
                <div className="flex rounded-xl bg-white/[0.06] p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveSide('both')}
                    className={`rounded-lg px-3 py-1.5 font-bold transition ${
                      activeSide === 'both'
                        ? 'bg-violet-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Both Sides
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSide('front')}
                    className={`rounded-lg px-3 py-1.5 font-bold transition ${
                      activeSide === 'front'
                        ? 'bg-violet-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Front Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSide('back')}
                    className={`rounded-lg px-3 py-1.5 font-bold transition ${
                      activeSide === 'back'
                        ? 'bg-violet-500 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Back Side
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Container with Scaling Size Control */}
          <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            {/* Visual adjustment toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200">
                  Full Visiting Card View (Adjusted to Fit Screen)
                </span>
                <span className="hidden text-xs text-slate-500 sm:inline">
                  · Downloads in official 300 DPI 1050 × 600 px print size
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 mr-1 hidden sm:inline">Card Display Size:</span>
                <button
                  type="button"
                  onClick={() => setPreviewScaleMode('compact')}
                  className={`rounded-lg px-2.5 py-1 font-bold transition ${
                    previewScaleMode === 'compact'
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  Compact
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScaleMode('comfortable')}
                  className={`rounded-lg px-2.5 py-1 font-bold transition ${
                    previewScaleMode === 'comfortable'
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScaleMode('fit')}
                  className={`rounded-lg px-2.5 py-1 font-bold transition ${
                    previewScaleMode === 'fit'
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  Full Width
                </button>
              </div>
            </div>

            {isTwoSide ? (
              <div className="space-y-8">
                {/* Front Side */}
                {(activeSide === 'front' || activeSide === 'both') && (
                  <div className={`mx-auto w-full transition-all duration-300 ${
                    previewScaleMode === 'compact'
                      ? 'max-w-[650px]'
                      : previewScaleMode === 'comfortable'
                      ? 'max-w-[850px]'
                      : 'max-w-full'
                  }`}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                        Side 1 · Front (Identity & Portrait)
                      </span>
                      <span className="text-xs font-mono text-cyan-400">1050 × 600 px (300 DPI)</span>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
                      <ScaledCardPreview wrapperClassName="rounded-2xl">
                        <TwoSideCardCanvas
                          template={twoSideTemplate}
                          data={DEFAULT_TWO_SIDE_AHAD_DATA}
                          side="front"
                        />
                      </ScaledCardPreview>
                    </div>
                  </div>
                )}

                {/* Back Side */}
                {(activeSide === 'back' || activeSide === 'both') && (
                  <div className={`mx-auto w-full transition-all duration-300 ${
                    previewScaleMode === 'compact'
                      ? 'max-w-[650px]'
                      : previewScaleMode === 'comfortable'
                      ? 'max-w-[850px]'
                      : 'max-w-full'
                  }`}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                        Side 2 · Back (Corporate Brand & QR)
                      </span>
                      <span className="text-xs font-mono text-violet-400">1050 × 600 px (300 DPI)</span>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
                      <ScaledCardPreview wrapperClassName="rounded-2xl">
                        <TwoSideCardCanvas
                          template={twoSideTemplate}
                          data={DEFAULT_TWO_SIDE_AHAD_DATA}
                          side="back"
                        />
                      </ScaledCardPreview>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 1-Side Card Preview */
              <div className={`mx-auto w-full transition-all duration-300 ${
                previewScaleMode === 'compact'
                  ? 'max-w-[650px]'
                  : previewScaleMode === 'comfortable'
                  ? 'max-w-[850px]'
                  : 'max-w-full'
              }`}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                    Full 1-Side Visiting Card
                  </span>
                  <span className="text-xs font-mono text-cyan-400">1050 × 600 px (300 DPI)</span>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
                  <ScaledCardPreview wrapperClassName="rounded-2xl">
                    <OneSideCardCanvas
                      template={oneSideTemplate}
                      data={DEFAULT_AHAD_DATA}
                    />
                  </ScaledCardPreview>
                </div>
              </div>
            )}

            {/* NEXT OPTION BAR: As user explicitly requested:
                "thokon sa jaita click korbe direct preview ta abar o dakbe tar necha next option asba ... thokon sa next a click korla new page asba sai demo data remove kore tar data deya sa download korba"
            */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row">
              <div>
                <h3 className="text-base font-bold text-white">Like this design?</h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Proceed to replace the demo data with your own and export high-res files.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(galleryPath)}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/[0.08]"
                >
                  Change Template
                </button>

                <button
                  type="button"
                  onClick={() => navigate(editorPath)}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-400/25 transition hover:bg-cyan-300"
                >
                  Next: Customize Card
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Template highlights */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Human Portrait Frame</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    High-contrast portrait placement on every card
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Interactive vCard QR</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Direct phone scan to save your contact card
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Print-Ready 300 DPI</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Precision 1050 × 600 px (3.5 × 2 inches)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default VisitingCardTemplatePreviewPage;
