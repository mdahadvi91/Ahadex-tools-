import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/animations/PageTransition';
import { Button } from '../components/ui/Button';
import { Sparkles, ArrowLeft, Search, ArrowRight } from 'lucide-react';
import { TOOLS_REGISTRY } from '../tools/registry';
import { useNavigate } from 'react-router-dom';

interface NotFoundPageProps {
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const popularTools = TOOLS_REGISTRY.filter((t) => t.isPopular).slice(0, 3);

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-mono mb-4">
          <span>Error 404: Route Not Found</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-rose-400 to-purple-500 font-mono tracking-tight">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-4">
          The requested tool or coordinate does not exist.
        </h2>

        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          The link you followed might be outdated or the utility was relocated within our modular
          architecture.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>

          <Button
            variant="glass"
            size="md"
            onClick={onOpenSearch}
            leftIcon={<Search className="w-4 h-4 text-cyan-400" />}
          >
            Search Tool Catalog
          </Button>
        </div>

        {/* Popular alternatives */}
        <div className="mt-14 pt-8 border-t border-white/10 text-left">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 text-center">
            Popular Utilities Instead
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.slug}`}
                className="p-3.5 rounded-xl glass-card border border-white/5 hover:border-cyan-400/40 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                    {tool.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{tool.category}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
