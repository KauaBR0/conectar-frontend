import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MockIndicatorProps {
  isUsingMock: boolean;
  onRetry: () => void;
}

const MockIndicator: React.FC<MockIndicatorProps> = ({ isUsingMock, onRetry }) => {
  if (!isUsingMock) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Modo Offline
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              O backend não está disponível. Usando dados simulados para demonstração.
            </p>
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline"
            >
              Tentar reconectar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockIndicator;
