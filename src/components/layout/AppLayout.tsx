import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { LeftSidebarDrawer } from './LeftSidebarDrawer';
import { SettingsDrawer } from './SettingsDrawer';
import { Footer } from './Footer';
import { FixedBackButton } from './FixedBackButton';
import { SearchModal } from '../tools/SearchModal';
import { ToastContainer } from '../ui/ToastContainer';
import { AnimatedGradient } from '../animations/AnimatedGradient';
import { SEOHead } from '../common/SEOHead';
import { pageview } from '../../lib/gtag';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const location = useLocation();

  // Scroll to top & trigger Google Analytics pageview on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
    pageview(location.pathname);
  }, [location.pathname]);

  // Global keyboard shortcut & custom event for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    const handleOpenSearch = () => setIsSearchOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('ahadex:open-search', handleOpenSearch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('ahadex:open-search', handleOpenSearch);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Dynamic SEO & Metadata Management */}
      <SEOHead />

      {/* Background Shader Gradient & Ambient Glows */}
      <AnimatedGradient />

      {/* Minimal Header / Brand Bar */}
      <Navbar
        onOpenLeftSidebar={() => setIsLeftSidebarOpen(true)}
        onOpenRightSidebar={() => setIsRightSidebarOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Master 3-Column Container */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        <div className="flex items-start gap-6 w-full">
          {/* Column 1: Persistent Left Sidebar (Categories Navigation - Desktop) */}
          <LeftSidebar />

          {/* Column 2: Main Content (Hero & Tool Grid & Active Tools) */}
          <main className="flex-1 min-w-0 w-full relative z-10">
            {children || <Outlet />}
          </main>

          {/* Column 3: Persistent Right Sidebar (Utility Controls & Trust - Desktop) */}
          <RightSidebar />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Fixed Global Back Button */}
      <FixedBackButton />

      {/* Mobile Drawers (Triggered from minimal header when screen size < xl) */}
      <LeftSidebarDrawer
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <SettingsDrawer
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};
