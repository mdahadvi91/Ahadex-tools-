import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Layers3,
  Sparkles,
} from 'lucide-react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { SEOHead } from '../components/common/SEOHead';
import { TwoSideCardCanvas } from '../components/visiting-card/TwoSideCardCanvas';
import { ScaledCardPreview } from '../components/visiting-card/common/ScaledCardPreview';
import { TWO_SIDE_TEMPLATES } from '../data/visiting-card/twoSideTemplates';
import { DEFAULT_TWO_SIDE_AHAD_DATA } from '../types/visitingCard';

export const VisitingCardTemplateGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredSide, setHoveredSide] = useState<Record<string, 'front' | 'back'>>({});

  const categories = [
    'all',
    'Corporate',
    'Luxury',
    'Technology',
    'Minimal',
    'Premium',
    'Business',
    'Creative',
    'Modern',
    'Executive',
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? TWO_SIDE_TEMPLATES
      : TWO_SIDE_TEMPLATES.filter(
          (t) => t.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const handleSelect = (templateId: string) => {
    navigate(`/tools/visiting-card-generator/two-side/template/${templateId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSide = (templateId: string, side: 'front' | 'back', e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredSide((prev) => ({ ...prev, [templateId]: side }));
  };

  return (
    <PageTransition>
      <SEOHead
        title="2-Side Visiting Card Templates | AHADEX TOOLS"
        description="Browse 16 complete two-sided visiting card templates. Complete with human portrait, company seal, dual-side preview, and 2-page print export."
        keywords={[
          '2-side visiting card templates',
          'double sided business card',
          'front and back visiting card',
          'business card templates',
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
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400/30 hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Card Generator
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-bold text-violet-300">
                2-SIDE GALLERY
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-400">
                16 Dual-Sided Designs
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-1.5 text-xs font-bold text-violet-300">
              <Layers3 className="h-3.5 w-3.5" />
              Complete Front & Back Sets
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Choose Your 2-Side Visiting Card
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Each card is ready with a visible executive human portrait of Mohammad Ahad, AHADEX corporate insignia, contact details, and back-side brand presence. Click any card to preview both sides and customize.
            </p>

            {/* Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition capitalize ${
                    selectedCategory === category
                      ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                      : 'border border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {filteredTemplates.map((template) => {
              const currentSide = hoveredSide[template.id] || 'front';

              return (
                <Reveal key={template.id}>
                  <div className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/60 p-5 shadow-2xl transition hover:border-violet-400/40 hover:bg-slate-950/90">
                    {/* Meta Bar */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/10 text-xs font-black text-violet-300 border border-violet-400/20">
                          {template.id}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition">
                            {template.name}
                          </h3>
                          <p className="text-xs text-slate-500">{template.category} Style</p>
                        </div>
                      </div>

                      {/* Front/Back Flip Switcher & Action */}
                      <div className="flex items-center gap-2">
                        <div className="flex rounded-lg bg-white/[0.06] p-1 text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={(e) => toggleSide(template.id, 'front', e)}
                            className={`rounded px-2 py-0.5 transition ${
                              currentSide === 'front'
                                ? 'bg-cyan-400 text-slate-950'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Front
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleSide(template.id, 'back', e)}
                            className={`rounded px-2 py-0.5 transition ${
                              currentSide === 'back'
                                ? 'bg-violet-500 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Back
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelect(template.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-violet-500 px-3 py-1.5 text-xs font-black text-white transition hover:bg-violet-400"
                        >
                          Preview
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Scaled Preview Canvas */}
                    <div
                      onClick={() => handleSelect(template.id)}
                      className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl transition group-hover:border-violet-400/30"
                    >
                      <ScaledCardPreview wrapperClassName="rounded-2xl">
                        <TwoSideCardCanvas
                          template={template}
                          data={DEFAULT_TWO_SIDE_AHAD_DATA}
                          side={currentSide}
                        />
                      </ScaledCardPreview>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <p className="line-clamp-1 max-w-[70%]">{template.description}</p>
                      <span className="text-[11px] font-mono text-violet-400">
                        {currentSide.toUpperCase()} · 1050 × 600 px
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default VisitingCardTemplateGalleryPage;
