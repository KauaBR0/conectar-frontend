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
  private users: User[] = [];
  private clients: Client[] = [];
  private nextUserId: number = 1;
  private nextClientId: number = 1;

  constructor() {
    this.loadDataFromStorage();
  }

  // Carrega dados do localStorage ou usa dados padrão
  private loadDataFromStorage() {
    try {
      // Carregar usuários
      const storedUsers = localStorage.getItem('@Conectar:mockUsers');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = [...mockUsers];
        this.saveUsersToStorage();
      }

      // Carregar clientes
      const storedClients = localStorage.getItem('@Conectar:mockClients');
      if (storedClients) {
        this.clients = JSON.parse(storedClients);
      } else {
        this.clients = [...mockClients];
        this.saveClientsToStorage();
      }

      // Calcular próximos IDs
      this.nextUserId = Math.max(...this.users.map(u => u.id)) + 1;
      this.nextClientId = Math.max(...this.clients.map(c => c.id)) + 1;
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      // Fallback para dados padrão
      this.users = [...mockUsers];
      this.clients = [...mockClients];
      this.nextUserId = Math.max(...mockUsers.map(u => u.id)) + 1;
      this.nextClientId = Math.max(...mockClients.map(c => c.id)) + 1;
    }
  }

  // Salva usuários no localStorage
  private saveUsersToStorage() {
    try {
      localStorage.setItem('@Conectar:mockUsers', JSON.stringify(this.users));
    } catch (error) {
      console.error('Erro ao salvar usuários no localStorage:', error);
    }
  }

  // Salva clientes no localStorage
  private saveClientsToStorage() {
    try {
      localStorage.setItem('@Conectar:mockClients', JSON.stringify(this.clients));
    } catch (error) {
      console.error('Erro ao salvar clientes no localStorage:', error);
    }
  }

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
    this.saveUsersToStorage();

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
    this.saveUsersToStorage();
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
    this.saveUsersToStorage();
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
    this.saveClientsToStorage();
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
    this.saveClientsToStorage();
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
    this.saveClientsToStorage();
    return { success: true, message: 'Cliente deletado com sucesso' };
  }

  // Método para resetar dados para o estado inicial
  resetToDefaultData() {
    this.users = [...mockUsers];
    this.clients = [...mockClients];
    this.nextUserId = Math.max(...mockUsers.map(u => u.id)) + 1;
    this.nextClientId = Math.max(...mockClients.map(c => c.id)) + 1;
    
    this.saveUsersToStorage();
    this.saveClientsToStorage();
    
    return { success: true, message: 'Dados resetados para o estado inicial' };
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
