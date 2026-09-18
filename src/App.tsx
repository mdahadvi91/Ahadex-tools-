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
import { OneSideTemplateGalleryPage } from './pages/OneSideTemplateGalleryPage';
import { VisitingCardTemplatePreviewPage } from './pages/VisitingCardTemplatePreviewPage';
import { OneSideVisitingCardEditorPage } from './pages/OneSideVisitingCardEditorPage';
import { TwoSideVisitingCardEditorPage } from './pages/TwoSideVisitingCardEditorPage';
import { PassportUploadPage } from './pages/passport/PassportUploadPage';
import { PassportPreparePage } from './pages/passport/PassportPreparePage';
import { PassportSettingsPage } from './pages/passport/PassportSettingsPage';
import { PassportEditPage } from './pages/passport/PassportEditPage';
import { PassportFinalPage } from './pages/passport/PassportFinalPage';
import { PassportPrintPage } from './pages/passport/PassportPrintPage';
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

                {/* 1-Side Visiting Card */}
                <Route
                  path="/tools/visiting-card-generator/one-side"
                  element={<OneSideTemplateGalleryPage />}
                />

                <Route
                  path="/tools/visiting-card-generator/one-side/template/:templateId"
                  element={<VisitingCardTemplatePreviewPage />}
                />

                <Route
                  path="/tools/visiting-card-generator/one-side/editor/:templateId"
                  element={<OneSideVisitingCardEditorPage />}
                />

                {/* 2-Side Visiting Card */}
                <Route
                  path="/tools/visiting-card-generator/two-side"
                  element={<VisitingCardTemplateGalleryPage />}
                />

                <Route
                  path="/tools/visiting-card-generator/two-side/template/:templateId"
                  element={<VisitingCardTemplatePreviewPage />}
                />

                <Route
                  path="/tools/visiting-card-generator/two-side/editor/:templateId"
                  element={<TwoSideVisitingCardEditorPage />}
                />

                {/* Passport Size Photo Generator (6 Full Pages) */}
                <Route
                  path="/tools/passport-photo-generator"
                  element={<PassportUploadPage />}
                />
                <Route
                  path="/tools/passport-photo-generator/upload"
                  element={<PassportUploadPage />}
                />
                <Route
                  path="/tools/passport-photo-generator/prepare"
                  element={<PassportPreparePage />}
                />
                <Route
                  path="/tools/passport-photo-generator/settings"
                  element={<PassportSettingsPage />}
                />
                <Route
                  path="/tools/passport-photo-generator/edit"
                  element={<PassportEditPage />}
                />
                <Route
                  path="/tools/passport-photo-generator/final"
                  element={<PassportFinalPage />}
                />
                <Route
                  path="/tools/passport-photo-generator/print"
                  element={<PassportPrintPage />}
                />
                <Route
                  path="/tools/passport-size-photo-generator"
                  element={<PassportUploadPage />}
                />

                {/* Existing tool fallback */}
                <Route
                  path="/tools/:toolSlug"
                  element={<ToolViewPage />}
                />

                {/* Informational and trust pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />

                {/* Global fallback */}
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