import api from './api';
import { mockUsers, mockClients, simulateNetworkDelay, simulateNetworkError } from './mockData';

// Interface para detectar se o backend está funcionando
interface BackendStatus {
  isOnline: boolean;
  lastCheck: number;
  retryCount: number;
}

class SmartApiService {
  private backendStatus: BackendStatus = {
    isOnline: true,
    lastCheck: Date.now(),
    retryCount: 0
  };

  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 segundos

  // Verifica se o backend está online
  private async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health', { timeout: 3000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Atualiza o status do backend
  private async updateBackendStatus(): Promise<void> {
    const now = Date.now();
    
    // Só verifica a cada 30 segundos para não sobrecarregar
    if (now - this.backendStatus.lastCheck < 30000) {
      return;
    }

    this.backendStatus.lastCheck = now;
    const isOnline = await this.checkBackendHealth();
    
    if (isOnline) {
      this.backendStatus.isOnline = true;
      this.backendStatus.retryCount = 0;
    } else {
      this.backendStatus.retryCount++;
      if (this.backendStatus.retryCount >= this.MAX_RETRIES) {
        this.backendStatus.isOnline = false;
      }
    }
  }

  // Método genérico para fazer requisições com fallback para mock
  private async makeRequest<T>(
    apiCall: () => Promise<any>,
    mockData: T,
    operation: string = 'operation'
  ): Promise<T> {
    await this.updateBackendStatus();

    if (this.backendStatus.isOnline) {
      try {
        const result = await apiCall();
        return result;
      } catch (error) {
        console.warn(`Backend falhou para ${operation}, usando dados mockados:`, error);
        this.backendStatus.isOnline = false;
        this.backendStatus.retryCount++;
      }
    }

    // Usar dados mockados
    console.log(`Usando dados mockados para ${operation}`);
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) { // 5% de chance de erro
      throw new Error('Erro simulado para teste da interface');
    }

    return mockData;
  }

  // Métodos de autenticação
  async login(email: string, password: string) {
    return this.makeRequest(
      () => api.post('/auth/login', { email, password }),
      {
        user: mockUsers.find(u => u.email === email && u.role === 'admin') || mockUsers[1],
        token: 'mock-jwt-token-' + Date.now()
      },
      'login'
    );
  }

  async register(userData: any) {
    return this.makeRequest(
      () => api.post('/auth/register', userData),
      {
        user: { ...userData, id: Date.now(), createdAt: new Date().toISOString() },
        token: 'mock-jwt-token-' + Date.now()
      },
      'register'
    );
  }

  // Métodos de usuários
  async getUsers() {
    return this.makeRequest(
      () => api.get('/users'),
      mockUsers,
      'getUsers'
    );
  }

  async updateUser(id: number, userData: any) {
    return this.makeRequest(
      () => api.put(`/users/${id}`, userData),
      { ...userData, id, updatedAt: new Date().toISOString() },
      'updateUser'
    );
  }

  async deleteUser(id: number) {
    return this.makeRequest(
      () => api.delete(`/users/${id}`),
      { success: true, message: 'Usuário deletado com sucesso' },
      'deleteUser'
    );
  }

  // Métodos de clientes
  async getClients() {
    return this.makeRequest(
      () => api.get('/clients'),
      mockClients,
      'getClients'
    );
  }

  async getClient(id: number) {
    return this.makeRequest(
      () => api.get(`/clients/${id}`),
      mockClients.find(c => c.id === id.toString()) || mockClients[0],
      'getClient'
    );
  }

  async createClient(clientData: any) {
    return this.makeRequest(
      () => api.post('/clients', clientData),
      { ...clientData, id: Date.now(), createdAt: new Date().toISOString() },
      'createClient'
    );
  }

  async updateClient(id: number, clientData: any) {
    return this.makeRequest(
      () => api.put(`/clients/${id}`, clientData),
      { ...clientData, id, updatedAt: new Date().toISOString() },
      'updateClient'
    );
  }

  async deleteClient(id: number) {
    return this.makeRequest(
      () => api.delete(`/clients/${id}`),
      { success: true, message: 'Cliente deletado com sucesso' },
      'deleteClient'
    );
  }

  // Verifica se está usando dados mockados
  isUsingMockData(): boolean {
    return !this.backendStatus.isOnline;
  }

  // Força uma nova verificação do backend
  async forceBackendCheck(): Promise<boolean> {
    this.backendStatus.lastCheck = 0;
    await this.updateBackendStatus();
    return this.backendStatus.isOnline;
  }
}

export const smartApi = new SmartApiService();
export default smartApi;
