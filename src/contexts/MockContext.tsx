import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import smartApi from '../services/smartApi';

interface MockContextData {
  isUsingMock: boolean;
  checkBackendStatus: () => Promise<void>;
  loading: boolean;
}

const MockContext = createContext<MockContextData>({} as MockContextData);

interface MockProviderProps {
  children: ReactNode;
}

export const MockProvider: React.FC<MockProviderProps> = ({ children }) => {
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkBackendStatus = async () => {
    try {
      setLoading(true);
      const isOnline = await smartApi.forceBackendCheck();
      setIsUsingMock(!isOnline);
    } catch (error) {
      console.error('Erro ao verificar status do backend:', error);
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <MockContext.Provider
      value={{
        isUsingMock,
        checkBackendStatus,
        loading,
      }}
    >
      {children}
    </MockContext.Provider>
  );
};

export const useMock = (): MockContextData => {
  const context = useContext(MockContext);

  if (!context) {
    throw new Error('useMock must be used within a MockProvider');
  }

  return context;
};
