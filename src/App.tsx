import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/layout/AdminLayout';
import CosmicBackground from './components/CosmicBackground';

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

const App = () => {
  return (
    <AdminProvider>
      <AuthProvider>
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
