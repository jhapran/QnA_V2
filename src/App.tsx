import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/dashboard';
import { Landing } from './pages/landing';
import { SignIn } from './pages/auth/signin';
import { SignUp } from './pages/auth/signup';
import { Features } from './pages/features';
import { Pricing } from './pages/pricing';
import { Settings } from './pages/settings';
import { AdminDashboard } from './pages/admin/dashboard';
import { Organizations } from './pages/admin/organizations';
import { Analytics } from './pages/analytics';
import { OrganizationSettings } from './pages/organization/settings';
import { Toaster } from 'sonner';
import { AuthProvider } from './components/auth/AuthProvider';
import { useAuth } from './components/auth/AuthProvider';
import { testDatabaseConnection } from './lib/utils/testConnection';
import { toast } from 'sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

export function App() {
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testDatabaseConnection();
      if (!isConnected) {
        toast.error('Database connection failed. Please check your configuration.');
      }
    };

    checkConnection();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
          <Route path="/signin" element={<MainLayout><SignIn /></MainLayout>} />
          <Route path="/signup" element={<MainLayout><SignUp /></MainLayout>} />
          <Route path="/features" element={<MainLayout><Features /></MainLayout>} />
          <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/*"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization/settings"
            element={
              <ProtectedRoute>
                <OrganizationSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="organizations" element={<Organizations />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}