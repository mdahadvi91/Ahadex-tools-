import React from 'react';
import { PageTransition } from '../components/animations/PageTransition';
import { HeroSection } from '../components/hero/HeroSection';
import { ToolGrid } from '../components/tools/ToolGrid';
import { WhyAhadex } from '../components/common/WhyAhadex';
import { HowItWorks } from '../components/common/HowItWorks';
import { TrustSection } from '../components/common/TrustSection';
import { FAQSection } from '../components/common/FAQSection';
import { CTASection } from '../components/common/CTASection';
import { AdsterraNativeBanner } from '../components/ads/AdsterraNativeBanner';

interface HomePageProps {
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenSearch }) => {
  const scrollToTools = () => {
    const el = document.getElementById('all-tools-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageTransition>
      {/* 1. Hero Section with Search and Trending Pills */}
      <HeroSection onOpenSearch={onOpenSearch} onExploreClick={scrollToTools} />

      {/* Adsterra Native Banner Slot 1: After Hero, before All Tools */}
      <AdsterraNativeBanner slotId="homepage-slot-1" />

      {/* 2. Full Tool Registry - All Platform Utilities (Elevated right to the top) */}
      <ToolGrid />

      {/* Adsterra Native Banner Slot 2: After All Tools, before Why AHADEX */}
      <AdsterraNativeBanner slotId="homepage-slot-2" />

      {/* 3. Why AHADEX TOOLS */}
      <WhyAhadex />

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Trust / Privacy Visual */}
      <TrustSection />

      {/* 6. FAQ Accordion */}
      <FAQSection />

      {/* Adsterra Native Banner Slot 3: After FAQ, before CTA */}
      <AdsterraNativeBanner slotId="homepage-slot-3" />

      {/* 7. Call to Action */}
      <CTASection onExploreClick={scrollToTools} />
    </PageTransition>
  );
};
