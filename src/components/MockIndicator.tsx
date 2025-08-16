import React from 'react';

interface MockIndicatorProps {
  isUsingMock: boolean;
  onRetry: () => void;
}

const MockIndicator: React.FC<MockIndicatorProps> = ({ isUsingMock, onRetry }) => {
  // Não exibir mais o indicador para não cobrir o botão de logout
  return null;

  // Código comentado para referência futura se necessário
  /*
  if (!isUsingMock) return null;

  const handleResetData = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados para o estado inicial? Esta ação não pode ser desfeita.')) {
      smartApi.resetToDefaultData();
      window.location.reload(); // Recarrega a página para mostrar os dados resetados
    }
  };

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
              Usando dados simulados com persistência local. Todas as funcionalidades funcionam offline.
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={onRetry}
                className="text-sm text-blue-800 hover:text-blue-900 underline"
              >
                Recarregar dados
              </button>
              <button
                onClick={handleResetData}
                className="text-sm text-red-600 hover:text-red-700 underline flex items-center"
              >
                <RotateCcw size={14} className="mr-1" />
                Resetar dados
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  */
};

export default MockIndicator;
