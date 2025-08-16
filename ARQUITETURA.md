# 🏗️ Arquitetura do Sistema Conéctar

## 📋 Visão Geral

O sistema Conéctar foi desenvolvido seguindo os princípios de **Arquitetura Limpa** e **Separação de Responsabilidades**, utilizando tecnologias modernas e boas práticas de desenvolvimento.

## 🎯 Decisões de Design

### 1. **Arquitetura em Camadas**
```
┌─────────────────────────────────────┐
│           Frontend (React)          │ ← Interface do usuário
├─────────────────────────────────────┤
│           API Gateway               │ ← NestJS + Controllers
├─────────────────────────────────────┤
│         Business Logic              │ ← Services + DTOs
├─────────────────────────────────────┤
│         Data Access                 │ ← TypeORM + Entities
├─────────────────────────────────────┤
│         Database (SQLite)           │ ← Persistência
└─────────────────────────────────────┘
```

### 2. **Separação de Responsabilidades**
- **Controllers**: Responsáveis apenas pela entrada/saída HTTP
- **Services**: Contêm toda a lógica de negócio
- **DTOs**: Validação e transferência de dados
- **Entities**: Modelos do banco de dados
- **Guards**: Controle de acesso e autenticação

### 3. **Padrões Utilizados**
- **Repository Pattern**: Para acesso a dados
- **Dependency Injection**: Para injeção de dependências
- **Factory Pattern**: Para configurações
- **Strategy Pattern**: Para diferentes estratégias de autenticação

## 🔐 Sistema de Autenticação

### **JWT (JSON Web Token)**
```typescript
// Estrutura do Token
{
  "sub": "user-id",
  "email": "user@email.com",
  "role": "admin|user",
  "iat": "issued-at",
  "exp": "expiration-time"
}
```

### **Fluxo de Autenticação**
1. Usuário faz login com email/senha
2. Sistema valida credenciais
3. Gera JWT com claims do usuário
4. Token é enviado para o frontend
5. Frontend armazena token no localStorage
6. Token é enviado em todas as requisições subsequentes

### **Segurança**
- Senhas criptografadas com bcrypt (salt rounds: 10)
- JWT com expiração de 1 hora
- Validação de token em todas as rotas protegidas
- Controle de acesso baseado em roles

## 🗄️ Banco de Dados

### **SQLite como Escolha**
- **Vantagens**:
  - Não requer instalação de servidor
  - Arquivo único para desenvolvimento
  - Suporte nativo no Node.js
  - Ideal para prototipagem e desenvolvimento

- **Desvantagens**:
  - Limitações de concorrência
  - Não ideal para produção com alto volume

### **Estrutura das Tabelas**

#### **Users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastLoginAt TIMESTAMP NULL
);
```

#### **Clients**
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  facadeName VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  companyName VARCHAR(255) NOT NULL,
  tags TEXT,
  status ENUM('Ativo', 'Inativo', 'Pendente') DEFAULT 'Pendente',
  conectaPlus ENUM('Sim', 'Não') DEFAULT 'Não',
  cep VARCHAR(9) NOT NULL,
  street VARCHAR(255) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(255),
  neighborhood VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(2) NOT NULL,
  internalNotes TEXT,
  assignedUserId UUID REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Frontend Architecture

### **Context API vs Redux**
**Escolha: Context API**

**Justificativa:**
- **Simplicidade**: API nativa do React, sem dependências externas
- **Performance**: Adequada para aplicações de médio porte
- **Manutenibilidade**: Código mais limpo e fácil de entender
- **Escalabilidade**: Pode ser facilmente migrado para Redux se necessário

### **Estrutura de Componentes**
```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos de estado global
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── hooks/              # Custom hooks
└── utils/              # Utilitários
```

### **Gerenciamento de Estado**
```typescript
// AuthContext - Exemplo de implementação
interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
```

## 🔒 Controle de Acesso

### **Sistema de Roles**
- **Admin**: Acesso total ao sistema
- **User**: Acesso limitado aos próprios clientes

### **Implementação**
```typescript
// Guard para verificar permissões
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
```

## 📱 Responsividade

### **Mobile-First Approach**
- Design responsivo com TailwindCSS
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Componentes adaptáveis para diferentes tamanhos de tela

### **Componentes Responsivos**
```typescript
// Exemplo de grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Conteúdo se adapta automaticamente */}
</div>
```

## 🧪 Testes

### **Estratégia de Testes**
- **Unitários**: Testes isolados de funções e métodos
- **Integração**: Testes de APIs e banco de dados
- **E2E**: Testes de fluxos completos (futuro)

### **Ferramentas**
- **Backend**: Jest + Supertest
- **Frontend**: React Testing Library + Jest

## 🚀 Performance

### **Otimizações Implementadas**
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: React.memo para componentes pesados
- **Debounce**: Para filtros de busca
- **Pagination**: Para listas grandes (futuro)

### **Métricas de Performance**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

## 🔧 Configuração e Deploy

### **Variáveis de Ambiente**
```bash
# Backend
DB_PATH=./conectar.db
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

### **Scripts de Deploy**
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "build:frontend": "react-scripts build"
  }
}
```

## 📊 Monitoramento

### **Logs**
- Logs estruturados com Winston (futuro)
- Logs de erro centralizados
- Métricas de performance

### **Health Checks**
```typescript
@Get('health')
getHealth() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  };
}
```

## 🔮 Roadmap e Melhorias

### **Curto Prazo**
- [ ] Testes unitários e de integração
- [ ] Validação de CNPJ
- [ ] Upload de arquivos
- [ ] Notificações em tempo real

### **Médio Prazo**
- [ ] Migração para PostgreSQL
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Logs de auditoria

### **Longo Prazo**
- [ ] Microserviços
- [ ] Kubernetes
- [ ] CI/CD pipeline
- [ ] Monitoramento com Prometheus/Grafana

## 🎯 Conclusões

### **Pontos Fortes**
- Arquitetura limpa e bem estruturada
- Código modular e reutilizável
- Segurança implementada corretamente
- Interface responsiva e intuitiva
- Documentação completa

### **Áreas de Melhoria**
- Cobertura de testes
- Performance para grandes volumes
- Monitoramento e observabilidade
- Deploy automatizado

### **Escalabilidade**
O sistema foi projetado para ser facilmente escalável:
- Separação clara de responsabilidades
- Interfaces bem definidas
- Configurações externalizadas
- Padrões consistentes em todo o código
