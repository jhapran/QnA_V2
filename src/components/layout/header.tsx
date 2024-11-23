import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, BarChart2, User } from 'lucide-react';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Students', icon: Users, path: '/students' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="rounded-lg bg-blue-600 p-2">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EduQuery</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link to="/features" className="text-gray-700 hover:text-gray-900">Features</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-gray-900">Pricing</Link>
              <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
