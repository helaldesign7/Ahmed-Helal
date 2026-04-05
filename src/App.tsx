import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { PublicHome } from './pages/PublicHome';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/layout/AdminLayout';
import { DashboardOverview } from './admin/pages/DashboardOverview';
import { AppearanceSettings } from './admin/pages/AppearanceSettings';
import { ProjectsManager } from './admin/pages/ProjectsManager';
import { CRMLeads } from './admin/pages/CRMLeads';
import { AISettings } from './admin/pages/AISettings';
import { ContentSectionsManager } from './admin/pages/ContentSectionsManager';
import { SystemSettings } from './admin/pages/SystemSettings';
import CosmicBackground from './components/CosmicBackground';

const App = () => {
  return (
    <AdminProvider>
      <AuthProvider>
        <CosmicBackground />
        <Router>
          <Routes>
            {/* Public Website Route */}
            <Route path="/" element={<PublicHome />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="theme" element={<AppearanceSettings />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="crm" element={<CRMLeads />} />
                <Route path="ai" element={<AISettings />} />
                <Route path="content" element={<ContentSectionsManager />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Route>

            {/* Catch-all redirect to public home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </AdminProvider>
  );
};

export default App;
