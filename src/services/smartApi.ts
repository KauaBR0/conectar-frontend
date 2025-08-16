import { mockUsers, mockClients, simulateNetworkDelay, simulateNetworkError } from './mockData';

// Interface para simular dados de usuário
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface para simular dados de cliente
interface Client {
  id: number;
  facadeName: string;
  cnpj: string;
  companyName: string;
  tags: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  conectaPlus: 'Sim' | 'Não';
  assignedTo: string;
  assignedToId: number;
  createdAt: string;
  updatedAt: string;
}

class MockApiService {
  private users: User[] = [...mockUsers];
  private clients: Client[] = [...mockClients];
  private nextUserId = Math.max(...mockUsers.map(u => u.id)) + 1;
  private nextClientId = Math.max(...mockClients.map(c => c.id)) + 1;

  // Métodos de autenticação
  async login(email: string, password: string) {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      user: user,
      token: 'mock-jwt-token-' + Date.now()
    };
  }

  async register(userData: any) {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    const newUser: User = {
      ...userData,
      id: this.nextUserId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(newUser);

    return {
      user: newUser,
      token: 'mock-jwt-token-' + Date.now()
    };
  }

  // Métodos de usuários
  async getUsers() {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    return this.users;
  }

  async updateUser(id: number, userData: any) {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const updatedUser: User = {
      ...this.users[userIndex],
      ...userData,
      id,
      updatedAt: new Date().toISOString()
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: number) {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    this.users.splice(userIndex, 1);
    return { success: true, message: 'Usuário deletado com sucesso' };
  }

  // Métodos de clientes
  async getClients() {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    return this.clients;
  }

  async getClient(id: number) {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    const client = this.clients.find(c => c.id === id);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    return client;
  }

  async createClient(clientData: any) {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    const newClient: Client = {
      ...clientData,
      id: this.nextClientId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.clients.push(newClient);
    return newClient;
  }

  async updateClient(id: number, clientData: any) {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    const clientIndex = this.clients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      throw new Error('Cliente não encontrado');
    }

    const updatedClient: Client = {
      ...this.clients[clientIndex],
      ...clientData,
      id: id,
      updatedAt: new Date().toISOString()
    };

    this.clients[clientIndex] = updatedClient;
    return updatedClient;
  }

  async deleteClient(id: number) {
    await simulateNetworkDelay();
    
    if (simulateNetworkError(0.05)) {
      throw new Error('Erro simulado para teste da interface');
    }

    const clientIndex = this.clients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      throw new Error('Cliente não encontrado');
    }

    this.clients.splice(clientIndex, 1);
    return { success: true, message: 'Cliente deletado com sucesso' };
  }

  // Sempre retorna true pois estamos sempre usando mock
  isUsingMockData(): boolean {
    return true;
  }

  // Sempre retorna false pois não há backend
  async forceBackendCheck(): Promise<boolean> {
    return false;
  }
}

export const smartApi = new MockApiService();
export default smartApi;
