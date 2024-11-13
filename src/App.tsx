import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/header';
import { Dashboard } from './pages/dashboard';
import { Landing } from './pages/landing';
import { Toaster } from 'sonner';

export function App() {
  // For demo purposes, we'll allow direct access to dashboard
  const isAuthenticated = true; // Changed to true to allow access

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated={isAuthenticated} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}