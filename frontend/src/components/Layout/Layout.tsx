import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { UserSidebar, SidebarProvider, SidebarInset, useSidebar } from './Sidebar'; // Importar useSidebar
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
  showSidebar?: boolean;
}

// Componente interno para manejar el contexto del sidebar
const LayoutWithSidebar: React.FC<LayoutProps & { onLogout: () => void }> = ({ children, user, onLogout }) => {
  const { toggleSidebar } = useSidebar(); // Obtener toggleSidebar del contexto

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <UserSidebar user={user} />
      <div className="flex-1 flex flex-col w-full transition-all duration-200 md:ml-[var(--sidebar-width)] peer-data-[state=collapsed]:md:ml-[var(--sidebar-width-icon)]">
        <Header user={user} onLogout={onLogout} onMenuToggle={toggleSidebar} /> {/* Pasar toggleSidebar */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-14 sm:pt-16 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, user, showSidebar = false }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // If no sidebar is needed, render a simple layout
  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-14 sm:pt-16">
          {children}
        </main>
      </div>
    );
  }

  // If sidebar is needed, use the layout with custom sidebar
  return (
    <SidebarProvider>
      <LayoutWithSidebar user={user} onLogout={handleLogout}>
        {children}
      </LayoutWithSidebar>
    </SidebarProvider>
  );
};
