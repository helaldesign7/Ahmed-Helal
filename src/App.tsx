import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/layout/AdminLayout';
import CosmicBackground from './components/CosmicBackground';
import { useAdmin } from './contexts/useAdmin';

// Lazy load pages
const PublicHome = lazy(() => import('./pages/PublicHome').then(m => ({ default: m.PublicHome })));
const DashboardOverview = lazy(() => import('./admin/pages/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const AppearanceSettings = lazy(() => import('./admin/pages/AppearanceSettings').then(m => ({ default: m.AppearanceSettings })));
const ProjectsManager = lazy(() => import('./admin/pages/ProjectsManager').then(m => ({ default: m.ProjectsManager })));
const CRMLeads = lazy(() => import('./admin/pages/CRMLeads').then(m => ({ default: m.CRMLeads })));
const AISettings = lazy(() => import('./admin/pages/AISettings').then(m => ({ default: m.AISettings })));
const ContentSectionsManager = lazy(() => import('./admin/pages/ContentSectionsManager').then(m => ({ default: m.ContentSectionsManager })));
const SystemSettings = lazy(() => import('./admin/pages/SystemSettings').then(m => ({ default: m.SystemSettings })));
const MediaManager = lazy(() => import('./admin/pages/MediaManager').then(m => ({ default: m.MediaManager })));
const ProjectDetails = lazy(() => import('./admin/pages/ProjectDetails').then(m => ({ default: m.ProjectDetails })));

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div className="relative">
      <div className="w-20 h-20 rounded-full border-2 border-white/5 animate-pulse" />
      <div className="absolute inset-0 w-20 h-20 rounded-full border-t-2 border-accent-violet animate-spin" />
    </div>
  </div>
);

// --- Global Theme Controller ---
const GlobalTheme = () => {
  const { appearance, siteContent } = useAdmin();

  useEffect(() => {
    if (!appearance) return;

    // 1. Inject CSS Variables
    const root = document.documentElement;
    const accent = appearance.accentColor || '#8B5CF6';
    const bg = appearance.bgColor || '#000000';
    
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };

    const rgb = hexToRgb(accent);
    
    // 🔥 MASTER SYNC - Update every variable name used in the system
    root.style.setProperty('--color-accent-violet', accent);
    root.style.setProperty('--accent-violet', accent);
    root.style.setProperty('--accent-rgb', rgb);
    
    root.style.setProperty('--color-primary-black', bg);
    root.style.setProperty('--bg-black', bg);
    root.style.setProperty('--bg-surface', `${bg}E6`); // Glassmorphism
    
    root.style.setProperty('--border-radius', appearance.borderRadius || '16px');
    root.style.setProperty('--font-primary', appearance.fontFamily || 'Inter');
    
    // 2. Update Favicon & Title
    if (appearance.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = appearance.faviconUrl;
    }

    // 3. Update SEO Meta Tags
    const updateMeta = (nameOrProperty: string, value: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) element.setAttribute('property', nameOrProperty);
        else element.setAttribute('name', nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    const siteTitle = appearance.metaTitle || (siteContent?.hero?.title?.en ? `${siteContent.hero.title.en} | Portfolio` : 'Ahmed Helal');
    const siteDesc = appearance.metaDescription || "Crafting immersive digital experiences through cinematic design.";

    document.title = siteTitle;
    updateMeta('description', siteDesc);
    updateMeta('og:title', siteTitle, true);
    updateMeta('og:description', siteDesc, true);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', siteTitle);
    updateMeta('twitter:description', siteDesc);

    if (appearance.ogImageUrl) {
      updateMeta('og:image', appearance.ogImageUrl, true);
      updateMeta('twitter:image', appearance.ogImageUrl);
    }
  }, [appearance, siteContent]);

  return null;
};

const App = () => {
  return (
    <AdminProvider>
      <AuthProvider>
        <GlobalTheme />
        <CosmicBackground />
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Website Route */}
              <Route path="/" element={<PublicHome />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="theme" element={<AppearanceSettings />} />
                  <Route path="projects" element={<ProjectsManager />} />
                  <Route path="projects/:id" element={<ProjectDetails />} />
                  <Route path="crm" element={<CRMLeads />} />
                  <Route path="ai" element={<AISettings />} />
                  <Route path="content" element={<ContentSectionsManager />} />
                  <Route path="media" element={<MediaManager />} />
                  <Route path="settings" element={<SystemSettings />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Route>
              </Route>

              {/* Catch-all redirect to public home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </AdminProvider>
  );
};

export default App;
