import { Bell, LogOut, Settings, User, Home, BookOpen, Users, BarChart2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Students', icon: Users, path: '/students' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

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

            {isAuthenticated ? (
              <nav className="hidden md:flex space-x-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
                <Link to="/features" className="text-gray-700 hover:text-gray-900">Features</Link>
                <Link to="/pricing" className="text-gray-700 hover:text-gray-900">Pricing</Link>
                <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <Settings className="h-5 w-5" />
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/signin')}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/signup')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <span>Sign Up Free</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}