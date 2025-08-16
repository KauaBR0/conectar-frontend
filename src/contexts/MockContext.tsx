import React, { createContext, useContext, ReactNode } from 'react';

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
  // Sempre usando mock, não há backend
  const isUsingMock = true;
  const loading = false;

  const checkBackendStatus = async () => {
    // Não faz nada, sempre usa mock
    console.log('Sempre usando dados mockados - sem backend');
  };

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
