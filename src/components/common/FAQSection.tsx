import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionItem } from '../ui/Accordion';
import { Reveal } from '../animations/Reveal';
import { useLanguage } from '../../context/LanguageContext';

export const FAQSection: React.FC = () => {
  const { t } = useLanguage();

  const faqItems: AccordionItem[] = [
    {
      id: 'privacy-guarantee',
      title: 'Are my uploaded files and private inputs sent to your server?',
      content: (
        <p>
          <strong>No, never.</strong> AHADEX TOOLS is architected as an offline-first, client-side
          utility suite. All operations—including image compression, PDF manipulations, cryptographic
          hashing, and QR generation—are executed directly in your browser using WebAssembly and
          native browser APIs. Your files are never transmitted to any external server or saved in a
          database.
        </p>
      ),
    },
    {
      id: 'cost-pricing',
      title: 'Is AHADEX TOOLS free to use for commercial and personal work?',
      content: (
        <p>
          Yes! All utility modules in AHADEX TOOLS are completely free for personal and commercial
          use. There are no subscription paywalls, watermarks, forced account signups, or usage limits.
        </p>
      ),
    },
    {
      id: 'file-size-limits',
      title: 'What is the maximum file size supported by in-browser processing?',
      content: (
        <p>
          Because operations run locally using your device&apos;s available RAM and CPU cores, file
          size thresholds depend on your hardware. For images, we comfortably support up to 50MB;
          for PDF documents, up to 100MB; and for JSON files, up to 50MB without browser frame
          drops.
        </p>
      ),
    },
    {
      id: 'offline-support',
      title: 'Can I use AHADEX TOOLS without an active internet connection?',
      content: (
        <p>
          Yes. Once you load the tool in your browser, the client-side scripts remain in memory and
          browser cache, allowing you to convert, encode, and format files even if you lose network
          connectivity.
        </p>
      ),
    },
    {
      id: 'new-tools-roadmap',
      title: 'How can I request a new tool or report an enhancement?',
      content: (
        <p>
          We maintain an open roadmap. You can submit feature requests through our Contact & Feedback
          page. Because AHADEX TOOLS utilizes a modular registry architecture, new utilities are
          frequently released.
        </p>
      ),
    },
  ];

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Knowledge Base</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              {t.common.faq}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Everything you need to know about our privacy architecture and technology stack.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <Accordion items={faqItems} />
        </Reveal>
      </div>
    </section>
  );
};
