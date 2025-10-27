import React, { useState } from 'react';
import { Menu, User, LogOut, Sun, Moon, Bell} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarTrigger } from './Sidebar';

interface HeaderProps {
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuToggle, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState(1); // Mock notification count

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Aquí iría la lógica real para cambiar el tema
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 dark:bg-gray-900 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo responsive */}
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors md:hidden mr-2 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center min-w-0">
              <img src="/logo.png" alt="Escuela Bíblica Salem" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 truncate dark:text-white">EBS Online</span>
            </Link>
          </div>

          {/* Sidebar toggle y User menu responsive */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sidebar Trigger - Solo visible en desktop lg+ */}
            {user && (
              <SidebarTrigger className="hidden lg:inline-flex h-10 w-10 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100" />
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center border rounded-full p-1 transition-colors border-gray-200 dark:border-gray-700 focus:outline-none"
              aria-label="Cambiar tema"
            >
              <span className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`}>
                <Sun className="w-5 h-5" />
              </span>
              <span className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'text-blue-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Moon className="w-5 h-5" />
              </span>
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-100 hover:text-gray-900 h-10 w-10 relative dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  aria-label={`Ver notificaciones. ${notifications} sin leer.`}
                  aria-expanded="false"
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white dark:ring-gray-900 bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Separator */}
            {user && <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />}

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize dark:text-gray-400">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/contact"
                  className="hidden sm:inline text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Contáctanos
                </Link>
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};