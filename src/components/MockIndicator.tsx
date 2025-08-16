import React from 'react';
import { Database } from 'lucide-react';

interface MockIndicatorProps {
  isUsingMock: boolean;
  onRetry: () => void;
}

const MockIndicator: React.FC<MockIndicatorProps> = ({ isUsingMock, onRetry }) => {
  if (!isUsingMock) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start space-x-3">
          <Database className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Modo Demo
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Usando dados simulados para demonstração. Todas as funcionalidades funcionam offline.
            </p>
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-blue-800 hover:text-blue-900 underline"
            >
              Recarregar dados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockIndicator;
