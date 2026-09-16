import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { LeftSidebarDrawer } from './LeftSidebarDrawer';
import { SettingsDrawer } from './SettingsDrawer';
import { Footer } from './Footer';
import { FixedBackButton } from './FixedBackButton';
import { SearchModal } from '../tools/SearchModal';
import { ToastContainer } from '../ui/ToastContainer';
import { AnimatedGradient } from '../animations/AnimatedGradient';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
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
      {/* Background Animated Atmosphere */}
      <AnimatedGradient />

      {/* Fixed Liquid Glass Navbar (stays on top even when scrolling) */}
      <Navbar
        onOpenLeftSidebar={() => setIsLeftSidebarOpen(true)}
        onOpenRightSidebar={() => setIsRightSidebarOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area (padding-top ensures content is not hidden behind fixed header) */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto pt-20 sm:pt-24">
        <main className="flex-1 w-full relative z-10">
          {children || <Outlet />}
        </main>
      </div>

      {/* Glass Footer */}
      <Footer />

      {/* Fixed Global Back Button (strictly says only "Back", stays fixed across all pages) */}
      <FixedBackButton />

      {/* Left Sidebar: Menu & Categories Drawer */}
      <LeftSidebarDrawer
        isOpen={isLeftSidebarOpen}
        onClose={() => setIsLeftSidebarOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Right Sidebar: Theme Toggle, Language, About, Contact, Privacy, Terms, Disclaimer */}
      <SettingsDrawer
        isOpen={isRightSidebarOpen}
        onClose={() => setIsRightSidebarOpen(false)}
      />

      {/* Search Modal (Keyboard & Button Triggered) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
};
