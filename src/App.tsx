import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ToolViewPage } from './pages/ToolViewPage';
import { VisitingCardLandingPage } from './pages/VisitingCardLandingPage';
import { VisitingCardTemplateGalleryPage } from './pages/VisitingCardTemplateGalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, TermsPage, DisclaimerPage } from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('ahadex:open-search'));
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onOpenSearch={openSearch} />}
                />

                <Route
                  path="/category/:categorySlug"
                  element={<CategoryPage />}
                />

                {/* Visiting Card Generator */}
                <Route
                  path="/tools/visiting-card-generator"
                  element={<VisitingCardLandingPage />}
                />

                <Route
                  path="/tools/visiting-card-generator/one-side"
                  element={<VisitingCardTemplateGalleryPage />}
                />

                <Route
                  path="/tools/visiting-card-generator/two-side"
                  element={<VisitingCardTemplateGalleryPage />}
                />

                {/* Existing tool fallback */}
                <Route
                  path="/tools/:toolSlug"
                  element={<ToolViewPage />}
                />

                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />

                <Route
                  path="*"
                  element={<NotFoundPage onOpenSearch={openSearch} />}
                />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}