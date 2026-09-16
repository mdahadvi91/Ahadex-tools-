import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from '../animations/Reveal';

interface CTASectionProps {
  onExploreClick: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onExploreClick }) => {
  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="relative rounded-3xl glass-card border border-cyan-500/40 p-8 sm:p-14 overflow-hidden text-center shadow-2xl shadow-cyan-950/30">
            {/* Ambient Aurora behind CTA */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/15 via-blue-600/15 to-purple-600/15 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Web Utilities</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
                Ready for Faster, Private Web Utilities?
              </h2>

              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
                Experience high-performance computing without uploading your sensitive data.
                Explore the AHADEX TOOLS ecosystem now.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={onExploreClick}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore All Utilities
                </Button>

                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="glass"
                    leftIcon={<Terminal className="w-4 h-4 text-cyan-400" />}
                  >
                    Suggest a New Tool
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
