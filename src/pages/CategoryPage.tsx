import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PageTransition } from '../components/animations/PageTransition';
import { CATEGORIES, TOOLS_REGISTRY } from '../tools/registry';
import { ToolCard } from '../components/tools/ToolCard';
import { AnimatedIcon } from '../components/animations/AnimatedIcon';
import { Reveal } from '../components/animations/Reveal';
import { ArrowLeft, Sparkles, LayoutGrid } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    return <Navigate to="/404" replace />;
  }

  const categoryTools = TOOLS_REGISTRY.filter((t) => t.categorySlug === category.slug);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/#all-tools-section" className="hover:text-cyan-400 transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-cyan-400">{category.name}</span>
        </div>

        {/* Category Header */}
        <Reveal direction="up">
          <div className="relative rounded-3xl glass-card border border-white/10 p-6 sm:p-10 mb-10 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <AnimatedIcon name={category.iconName} className="w-7 h-7" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono mb-2">
                    <span>{categoryTools.length} Utilities Available</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                    {category.name}
                  </h1>
                  <p className="text-sm text-slate-300/90 mt-2 max-w-2xl leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              <Link to="/">
                <Button
                  variant="glass"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  All Tools
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Tool Cards for this category */}
        <div>
          <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Available Suite in {category.name}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryTools.map((tool, idx) => (
              <Reveal key={tool.id} delay={idx * 0.05} direction="up">
                <ToolCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Other Categories quick list */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span>Explore Other Categories</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((other) => (
              <Link
                key={other.id}
                to={`/category/${other.slug}`}
                className="p-3 rounded-xl glass-card border border-white/5 hover:border-cyan-400/40 text-center transition-all group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                  {other.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  {other.toolCount} tools
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
