import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CoursesPage } from './pages/CoursesPage';
import { CalendarPage } from './pages/CalendarPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { GradesPage } from './pages/GradesPage';

// Componente interno que usa el contexto de autenticación
const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <Layout>
              <LandingPage />
            </Layout>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/contact" 
          element={
            <Layout>
              <ContactPage />
            </Layout>
          } 
        />
        <Route 
          path="/about" 
          element={
            <Layout>
              <AboutPage />
            </Layout>
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> : <DashboardPage />}
            </ProtectedRoute>
          }
        />

        {/* Admin specific routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes for sidebar navigation */}
        <Route path="/cursos" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/tareas" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
        <Route path="/calificaciones" element={<ProtectedRoute><GradesPage /></ProtectedRoute>} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;