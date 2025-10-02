import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  GraduationCap,
  UserCheck,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose }) => {
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { icon: BookOpen, label: 'Dashboard', href: '/dashboard' },
      { icon: GraduationCap, label: 'Mis Cursos', href: '/courses' },
      { icon: Calendar, label: 'Calendario', href: '/calendar' },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...commonItems,
          { icon: FileText, label: 'Tareas', href: '/assignments' },
          { icon: BarChart3, label: 'Calificaciones', href: '/grades' },
        ];
      case 'teacher':
        return [
          ...commonItems,
          { icon: Users, label: 'Mis Estudiantes', href: '/students' },
          { icon: FileText, label: 'Crear Contenido', href: '/create' },
          { icon: UserCheck, label: 'Evaluaciones', href: '/evaluations' },
        ];
      case 'admin':
        return [
          ...commonItems,
          { icon: Users, label: 'Gestión Usuarios', href: '/admin/users' },
          { icon: BarChart3, label: 'Reportes', href: '/admin/reports' },
          { icon: Settings, label: 'Configuración', href: '/admin/settings' },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50',
        'lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Close button - mobile only */}
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>


          {/* User info */}
          {user && (
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};