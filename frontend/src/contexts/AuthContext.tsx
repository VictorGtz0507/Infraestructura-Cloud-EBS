import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth } from 'aws-amplify';

interface User {
  id?: string;
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

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const userInfo: User = {
        id: currentUser.attributes.sub,
        email: currentUser.attributes.email,
        name: currentUser.attributes.name || currentUser.attributes.email,
        role: mapCognitoGroups(currentUser.signInUserSession.accessToken.payload['cognito:groups'] || []) as 'student' | 'teacher' | 'admin'
      };
      setUser(userInfo);
    } catch (error) {
      console.log('No authenticated user');
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await Auth.signIn(email, password);
      const userInfo: User = {
        id: user.attributes.sub,
        email: user.attributes.email,
        name: user.attributes.name || user.attributes.email,
        role: mapCognitoGroups(user.signInUserSession?.accessToken.payload['cognito:groups'] || []) as 'student' | 'teacher' | 'admin'
      };
      setUser(userInfo);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const mapCognitoGroups = (groups: string[]) => {
    if (groups.includes('admin')) return 'admin';
    if (groups.includes('teacher')) return 'teacher';
    return 'student';
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
