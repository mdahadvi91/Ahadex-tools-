import React from 'react';
import { PageTransition } from '../components/animations/PageTransition';
import { HeroSection } from '../components/hero/HeroSection';
import { ToolGrid } from '../components/tools/ToolGrid';

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
      {/* 1. Concise, High-Impact Hero Section */}
      <HeroSection onOpenSearch={onOpenSearch} onExploreClick={scrollToTools} />

      {/* 2. Direct Tool Discovery & Tool Grid */}
      <ToolGrid />
    </PageTransition>
  );
};
