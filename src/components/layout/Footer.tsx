import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { CATEGORIES } from '../../tools/registry';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-16 border-t border-white/10 bg-[#080b11]/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <AnimatedLogo size="md" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Create, convert, and manage digital files with fast, privacy-first web utilities. 100% client-side execution.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-cyan-400 font-mono pt-1">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Uploads
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                Private
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              {t.common.categories || 'Categories'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-cyan-300 transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-300 transition-colors">
                  {t.common.about || 'About'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-300 transition-colors">
                  {t.common.contact || 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Trust */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-cyan-300 transition-colors">
                  {t.common.privacy || 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-300 transition-colors">
                  {t.common.terms || 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-cyan-300 transition-colors">
                  {t.common.disclaimer || 'Disclaimer'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <p>© {new Date().getFullYear()} AHADEX TOOLS. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            https://ahadex.fun/
          </p>
        </div>
      </div>
    </footer>
  );
};
