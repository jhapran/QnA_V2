import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/dashboard';
import { Landing } from './pages/landing';
import { Features } from './pages/features';
import { Pricing } from './pages/pricing';
import { Settings } from './pages/settings';
import { AdminDashboard } from './pages/admin/dashboard';
import { Organizations } from './pages/admin/organizations';
import { Analytics } from './pages/analytics';
import { OrganizationSettings } from './pages/organization/settings';
import { Toaster } from 'sonner';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
        <Route path="/features" element={<MainLayout><Features /></MainLayout>} />
        <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
        
        <Route
          path="/dashboard/*"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings/*"
          element={<Settings />}
        />
        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          }
        />
        <Route
          path="/organization/settings"
          element={<OrganizationSettings />}
        />
        <Route
          path="/admin/*"
          element={
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="organizations" element={<Organizations />} />
            </Routes>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}
