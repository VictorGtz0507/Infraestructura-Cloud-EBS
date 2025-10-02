import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  role: 'student' | 'teacher' | 'admin';
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión guardada al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('ebsalem_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('ebsalem_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Credenciales del administrador
    const adminCredentials = {
      email: 'admin@ebsalem.com',
      password: 'admin123'
    };

    // Credenciales del estudiante
    const studentCredentials = {
      email: 'ivan@ebsalem.com',
      password: 'ivan123'
    };

    // Simular validación con delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === adminCredentials.email && password === adminCredentials.password) {
      const userData: User = {
        name: 'Administrador',
        role: 'admin',
        email: email
      };

      setUser(userData);
      localStorage.setItem('ebsalem_user', JSON.stringify(userData));
      return true;
    }

    if (email === studentCredentials.email && password === studentCredentials.password) {
      const userData: User = {
        name: 'Ivan Alvarez',
        role: 'student',
        email: email
      };

      setUser(userData);
      localStorage.setItem('ebsalem_user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ebsalem_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
