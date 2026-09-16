import React from 'react';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { ShieldCheck, FileText, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const PrivacyPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-cyan-400 mb-6 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Utilities
        </Link>

        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Privacy Policy</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Last Updated: September 2026</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-slate-300/90 space-y-4 leading-relaxed border-t border-white/10 pt-6">
            <h3 className="text-base font-bold text-slate-100">1. Zero-Upload Architecture</h3>
            <p>
              AHADEX TOOLS operates fundamentally as a client-side suite. All file processing,
              conversions, formatting, encoding, and calculations occur directly within your device&apos;s
              local browser instance (using WebAssembly, JavaScript, and HTML5 Web APIs). At no
              point are your files, documents, passwords, or images transmitted to, processed by, or
              stored on our servers.
            </p>

            <h3 className="text-base font-bold text-slate-100">2. Analytics & Tracking</h3>
            <p>
              We do not track personally identifiable information (PII). We do not use intrusive third-party
              advertising cookies or sell telemetry to data brokers.
            </p>

            <h3 className="text-base font-bold text-slate-100">3. Local Storage</h3>
            <p>
              Non-sensitive interface preferences—such as your chosen theme (dark/light) and active
              language preference—are retained strictly within your device&apos;s local storage for session
              continuity.
            </p>

            <h3 className="text-base font-bold text-slate-100">4. Third-Party Dependencies</h3>
            <p>
              The platform is served via secure static edge delivery networks (e.g. Cloudflare Pages).
              Static assets (fonts, icons) are bundled directly or loaded via secure HTTPS.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-cyan-400 mb-6 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Utilities
        </Link>

        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Terms of Service</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Last Updated: September 2026</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-slate-300/90 space-y-4 leading-relaxed border-t border-white/10 pt-6">
            <h3 className="text-base font-bold text-slate-100">1. Acceptance of Terms</h3>
            <p>
              By accessing and using AHADEX TOOLS (ahadex.fun), you agree to be bound by these terms.
              If you do not agree to these terms, please do not use the service.
            </p>

            <h3 className="text-base font-bold text-slate-100">2. Free & Commercial Use</h3>
            <p>
              AHADEX TOOLS provides utility tools for personal, educational, and commercial purposes
              free of charge. You retain 100% intellectual property ownership of any files or data
              manipulated with our tools.
            </p>

            <h3 className="text-base font-bold text-slate-100">3. Acceptable Use</h3>
            <p>
              You agree not to use the tools for unlawful activities, including distributing malware,
              generating harmful cryptographic payloads, or attempting to compromise platform availability.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export const DisclaimerPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-cyan-400 mb-6 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Utilities
        </Link>

        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Disclaimer</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Last Updated: September 2026</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-slate-300/90 space-y-4 leading-relaxed border-t border-white/10 pt-6">
            <h3 className="text-base font-bold text-slate-100">1. &quot;As-Is&quot; Provision</h3>
            <p>
              All software utilities provided on AHADEX TOOLS are offered &quot;as is&quot; without warranty of
              any kind, either expressed or implied. While our algorithms undergo rigorous verification,
              we cannot guarantee that outputs will be error-free or suitable for critical missions.
            </p>

            <h3 className="text-base font-bold text-slate-100">2. Limitation of Liability</h3>
            <p>
              Under no circumstances shall AHADEX TOOLS or its developers be liable for direct, indirect,
              incidental, or consequential damages resulting from data loss, corrupted files, or
              system downtime while using these utilities. Users are strongly encouraged to maintain backups
              of crucial original documents.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
