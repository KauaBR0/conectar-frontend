import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MockProvider, useMock } from './contexts/MockContext';
import MockIndicator from './components/MockIndicator';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientForm from './pages/ClientForm';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <MockProvider>
        <Router>
          <div className="App">
            <MockIndicatorWrapper />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/client/new"
                element={
                  <PrivateRoute>
                    <ClientForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/client/:id"
                element={
                  <PrivateRoute>
                    <ClientForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </MockProvider>
    </AuthProvider>
  );
}

// Componente wrapper para usar o contexto Mock
const MockIndicatorWrapper: React.FC = () => {
  const { isUsingMock, checkBackendStatus } = useMock();
  
  return (
    <MockIndicator 
      isUsingMock={isUsingMock} 
      onRetry={checkBackendStatus} 
    />
  );
};

export default App;
