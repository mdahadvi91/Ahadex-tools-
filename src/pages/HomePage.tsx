import React from 'react';
import { PageTransition } from '../components/animations/PageTransition';
import { HeroSection } from '../components/hero/HeroSection';
import { FeaturedToolsSection } from '../components/tools/FeaturedToolsSection';
import { CategorySection } from '../components/tools/CategorySection';
import { ToolGrid } from '../components/tools/ToolGrid';
import { WhyAhadex } from '../components/common/WhyAhadex';
import { HowItWorks } from '../components/common/HowItWorks';
import { TrustSection } from '../components/common/TrustSection';
import { FAQSection } from '../components/common/FAQSection';
import { CTASection } from '../components/common/CTASection';

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
      {/* 1. Hero Section */}
      <HeroSection onOpenSearch={onOpenSearch} onExploreClick={scrollToTools} />

      {/* 2. Featured Tools */}
      <FeaturedToolsSection />

      {/* 3. Categories */}
      <CategorySection />

      {/* 4. Complete Tool Grid */}
      <ToolGrid />

      {/* 5. Why AHADEX TOOLS */}
      <WhyAhadex />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Trust / Privacy Visual */}
      <TrustSection />

      {/* 8. FAQ Accordion */}
      <FAQSection />

      {/* 9. Call to Action */}
      <CTASection onExploreClick={scrollToTools} />
    </PageTransition>
  );
};
