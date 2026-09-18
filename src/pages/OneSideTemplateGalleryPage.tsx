import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Layers3,
  Palette,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';
import { OneSideCardCanvas } from '../components/visiting-card/OneSideCardCanvas';
import { ScaledCardPreview } from '../components/visiting-card/common/ScaledCardPreview';
import { ONE_SIDE_TEMPLATES } from '../data/visiting-card/oneSideTemplates';
import { DEFAULT_AHAD_DATA } from '../types/visitingCard';

export const OneSideTemplateGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Executive',
    'Luxury',
    'Editorial',
    'Minimal',
    'Technology',
    'Creative',
    'Modern',
    'Corporate',
    'Heritage',
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? ONE_SIDE_TEMPLATES
      : ONE_SIDE_TEMPLATES.filter(
          (t) => t.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const handleSelect = (templateId: string) => {
    navigate(`/tools/visiting-card-generator/one-side/editor/${templateId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      <SEOHead
        title="1-Side Visiting Card Templates | AHADEX TOOLS"
        description="Browse 16 fully formed professional 1-side visiting card templates with complete photos, AHADEX branding, and verified contact layouts."
        keywords={[
          '1-side visiting card templates',
          'business card templates',
          'visiting card design',
          'single side business card',
          'visiting card generator',
        ]}
      />

      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header Navigation */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate('/tools/visiting-card-generator')}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Card Generator
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
                1-SIDE GALLERY
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-400">
                16 Ready Templates
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Complete Ready-to-Use Templates
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Choose Your 1-Side Visiting Card
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Every template is shown fully styled with human portrait photography, AHADEX branding, contact channels, and QR code. Select any template to replace the demo data with your own and download.
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition capitalize ${
                    selectedCategory === category
                      ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'border border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid: 2 columns on lg */}
          <div className="grid gap-8 md:grid-cols-2">
            {filteredTemplates.map((template) => (
              <Reveal key={template.id}>
                <div className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 p-5 shadow-2xl transition hover:border-cyan-400/40 hover:bg-slate-950/90">
                  {/* Template Meta Bar */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 text-xs font-black text-cyan-300 border border-cyan-400/20">
                        {template.id}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                          {template.name}
                        </h3>
                        <p className="text-xs text-slate-500">{template.category} Style</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {template.badge && (
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                          {template.badge}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSelect(template.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-3.5 py-1.5 text-xs font-black text-slate-950 transition hover:bg-cyan-300"
                      >
                        Customize
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Fully Formed Scaled Card Preview */}
                  <div
                    onClick={() => handleSelect(template.id)}
                    className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl transition group-hover:border-cyan-400/30"
                  >
                    <ScaledCardPreview wrapperClassName="rounded-2xl">
                      <OneSideCardCanvas
                        template={template}
                        data={DEFAULT_AHAD_DATA}
                      />
                    </ScaledCardPreview>
                  </div>

                  {/* Footer description & features */}
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <p className="line-clamp-1 max-w-[70%]">{template.description}</p>
                    <span className="text-[11px] font-mono text-cyan-400">
                      1050 × 600 px
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default OneSideTemplateGalleryPage;
