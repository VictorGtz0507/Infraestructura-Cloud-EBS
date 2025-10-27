import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCoursesPage } from './pages/AdminCoursesPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import Courses from './pages/Courses';
import Calendar from './pages/Calendar';
import { AssignmentsPage } from './pages/AssignmentsPage';
import Grades from './pages/Grades';

// Componente interno que usa el contexto de autenticación
const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
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
              {user?.role === 'admin' ? <Navigate to="/admin" replace /> : (user && <Layout user={user} showSidebar={true}><Dashboard /></Layout>)}
            </ProtectedRoute>
          }
        />

        {/* Admin specific routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              {user && <Layout user={user} showSidebar={true}>
                <AdminDashboard />
              </Layout>}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cursos"
          element={
            <ProtectedRoute requiredRole="admin">
              {user && <Layout user={user} showSidebar={true}>
                <AdminCoursesPage />
              </Layout>}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute requiredRole="admin">
              {user && <Layout user={user} showSidebar={true}>
                <AdminUsersPage />
              </Layout>}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <ProtectedRoute requiredRole="admin">
              {user && <Layout user={user} showSidebar={true}>
                <AdminReportsPage />
              </Layout>}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/configuracion"
          element={
            <ProtectedRoute requiredRole="admin">
              {user && <Layout user={user} showSidebar={true}>
                <AdminSettingsPage />
              </Layout>}
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route path="/cursos" element={<ProtectedRoute>{user && <Layout user={user} showSidebar={true}><Courses /></Layout>}</ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute>{user && <Layout user={user} showSidebar={true}><Calendar /></Layout>}</ProtectedRoute>} />
        <Route path="/tareas" element={<ProtectedRoute>{user && <Layout user={user} showSidebar={true}><AssignmentsPage /></Layout>}</ProtectedRoute>} />
        <Route path="/calificaciones" element={<ProtectedRoute>{user && <Layout user={user} showSidebar={true}><Grades /></Layout>}</ProtectedRoute>} />

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