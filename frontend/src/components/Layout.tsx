import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, showSidebar = false }) => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onMenuToggle={handleMenuToggle} onLogout={handleLogout} />
      
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar
            user={user}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 transition-all duration-300">
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};