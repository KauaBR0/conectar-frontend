// Dados mockados para quando o backend não estiver disponível
export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@conectar.com',
    role: 'admin' as const,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'João Silva',
    email: 'joao@conectar.com',
    role: 'user' as const,
    isActive: true,
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 3,
    name: 'Maria Santos',
    email: 'maria@conectar.com',
    role: 'user' as const,
    isActive: false,
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  }
];

export const mockClients = [
  {
    id: 1,
    facadeName: 'Empresa ABC Ltda',
    cnpj: '12.345.678/0001-90',
    companyName: 'Empresa ABC Comércio e Serviços Ltda',
    tags: 'tecnologia, software, consultoria',
    status: 'Ativo' as const,
    conectaPlus: 'Sim' as const,
    assignedTo: 'João Silva',
    assignedToId: 2,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z'
  },
  {
    id: 2,
    facadeName: 'Tech Solutions',
    cnpj: '98.765.432/0001-10',
    companyName: 'Tech Solutions Tecnologia Ltda',
    tags: 'desenvolvimento, mobile, web',
    status: 'Ativo' as const,
    conectaPlus: 'Sim' as const,
    assignedTo: 'Maria Santos',
    assignedToId: 3,
    createdAt: '2024-01-12T10:30:00Z',
    updatedAt: '2024-01-14T11:45:00Z'
  },
  {
    id: 3,
    facadeName: 'Consultoria XYZ',
    cnpj: '11.222.333/0001-44',
    companyName: 'Consultoria XYZ Assessoria Empresarial Ltda',
    tags: 'consultoria, estratégia, negócios',
    status: 'Inativo' as const,
    conectaPlus: 'Não' as const,
    assignedTo: 'João Silva',
    assignedToId: 2,
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-13T09:10:00Z'
  },
  {
    id: 4,
    facadeName: 'Startup Inovação',
    cnpj: '55.666.777/0001-88',
    companyName: 'Startup Inovação Tecnológica Ltda',
    tags: 'startup, inovação, fintech',
    status: 'Pendente' as const,
    conectaPlus: 'Não' as const,
    assignedTo: 'Admin User',
    assignedToId: 1,
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-01-20T13:00:00Z'
  }
];

// Simula delay de rede
export const simulateNetworkDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Simula erro de rede
export const simulateNetworkError = (probability: number = 0.1) => 
  Math.random() < probability;
