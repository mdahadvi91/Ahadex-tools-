import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SettingsDrawer } from './SettingsDrawer';
import { MobileMenu } from './MobileMenu';
import { Footer } from './Footer';
import { SearchModal } from '../tools/SearchModal';
import { ToastContainer } from '../ui/ToastContainer';
import { AnimatedGradient } from '../animations/AnimatedGradient';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

      {/* Sticky Liquid Glass Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Content Area with Optional Expandable Sidebar */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto">
        <main className="flex-1 w-full relative z-10">
          {children || <Outlet />}
        </main>
      </div>

      {/* Glass Footer */}
      <Footer />

      {/* Search Modal (Keyboard & Button Triggered) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Settings & Navigation Right Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
};
