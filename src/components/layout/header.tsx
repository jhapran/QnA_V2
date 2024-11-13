import { Bell, LogOut, Settings, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const isOnDashboard = location.pathname === '/dashboard';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-lg bg-blue-600 p-2">
            <User className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">EduQuery</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {!isOnDashboard && (
            <Button size="sm" onClick={handleGetStarted}>
              Get Started
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}