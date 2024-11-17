import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/dashboard';
import { Landing } from './pages/landing';
import { Toaster } from 'sonner';

export function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Landing />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}