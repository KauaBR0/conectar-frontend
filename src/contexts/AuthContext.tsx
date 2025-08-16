import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import smartApi from '../services/smartApi';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem('@Conectar:token');
    const userData = localStorage.getItem('@Conectar:user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await smartApi.login(email, password);
      const { token, user: userData } = response as any;

      localStorage.setItem('@Conectar:token', token);
      localStorage.setItem('@Conectar:user', JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  };

  const signOut = () => {
    localStorage.removeItem('@Conectar:token');
    localStorage.removeItem('@Conectar:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
