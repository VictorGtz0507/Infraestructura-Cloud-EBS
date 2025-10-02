import React from 'react';
import { Menu, User, BookOpen, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuToggle, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center ml-2 lg:ml-0">
              <img src="/logo.png" alt="Escuela Bíblica Salem" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-900">Escuela Bíblica Salem</span>
            </Link>
          </div>

          {/* Navigation - Desktop - Solo para usuarios no autenticados */}
          {!user && (
            <nav className="hidden lg:flex space-x-8">
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Contáctanos
                </Link>
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
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