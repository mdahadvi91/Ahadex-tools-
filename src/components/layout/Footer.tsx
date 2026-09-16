import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { CATEGORIES } from '../../tools/registry';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }
    addToast('Subscribed!', t.footer.subscribeSuccess, 'success');
    setEmail('');
  };

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#080b11]/80 backdrop-blur-xl overflow-hidden">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatedLogo size="md" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t.footer.legal}
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{t.footer.statusOperational}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
              <span className="inline-flex items-center gap-1 text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.common.clientSideSecured}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-blue-400">
                <Lock className="w-3.5 h-3.5" />
                {t.common.zeroDataRetention}
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              {t.common.categories}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="hover:text-cyan-400 transition-colors flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {cat.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Company */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              {t.common.navigationLegal}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  {t.common.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">
                  {t.common.contact}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
                  {t.common.privacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                  {t.common.terms}
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-cyan-400 transition-colors">
                  {t.common.disclaimer}
                </Link>
              </li>
            </ul>
          </div>

          {/* Updates & Community */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {t.footer.newsletterDesc}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full h-9 px-3 rounded-lg glass-input text-xs outline-none focus:border-cyan-400"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                className="w-full text-xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {t.footer.subscribe}
              </Button>
            </form>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>
              © {new Date().getFullYear()} AHADEX TOOLS. {t.footer.rights}
            </p>
            <p className="text-[11px] text-slate-400/80 mt-0.5">
              Production Gateway:{' '}
              <a
                href="https://ahadex.fun/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-2"
              >
                ahadex.fun
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              {t.common.privacy}
            </Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              {t.common.terms}
            </Link>
            <Link to="/disclaimer" className="hover:text-slate-300 transition-colors">
              {t.common.disclaimer}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
