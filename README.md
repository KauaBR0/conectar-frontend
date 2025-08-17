# 🎨 Frontend Conéctar

Interface React moderna para o sistema de gestão de clientes da Conéctar, com funcionalidades offline e persistência local.

Teste aqui -> https://thriving-kashata-51f6d3.netlify.app/login

## 🚀 **Execução Local**

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn
- Git

### **1. Instalação**

```bash
# Navegar para o diretório frontend
cd frontend

# Instalar dependências
npm install
```

### **2. Execução em Desenvolvimento**

```bash
# Iniciar servidor de desenvolvimento
npm start
```

**Aplicação rodará em:** http://localhost:3001

### **3. Build de Produção**

```bash
# Build com ESLint (desenvolvimento)
npm run build

# Build sem ESLint (produção - mais rápido)
npm run build:prod

# Testar build localmente
npm install -g serve
serve -s build
```

## 🧪 **Testes**

```bash
# Executar testes em modo watch
npm test

# Executar testes uma vez
npm run test:once

# Cobertura de testes
npm run test:coverage

# Executar testes em modo CI
npm run test:ci
```

## 🎯 **Funcionalidades**

### **✅ Autenticação**
- Login com dados simulados
- Sistema de roles (Admin/User)
- Tokens JWT mockados
- Persistência de sessão

### **✅ Gestão de Usuários**
- Edição de perfil
- Alteração de senha
- Informações do sistema

### **✅ Gestão de Clientes**
- Listagem com filtros avançados
- Criação de novos clientes
- Edição de clientes existentes
- Exclusão de clientes
- Busca por nome, CNPJ, status

### **✅ Modo Offline**
- Dados simulados persistentes
- localStorage para persistência
- CRUD completo funcionando offline
- Sistema de reset de dados

## 🏗️ **Arquitetura**

### **Estrutura de Pastas**

```
frontend/src/
├── components/        # Componentes reutilizáveis
├── contexts/         # Contextos React (Auth, Mock)
├── pages/           # Páginas da aplicação
├── services/        # Serviços de API e mock
├── styles/          # Estilos globais
└── utils/           # Utilitários e helpers
```

### **Tecnologias**

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS
- **React Router v6** - Roteamento
- **React Hook Form** - Formulários
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

### **Padrões de Desenvolvimento**

- **Context API** para estado global
- **Hooks customizados** para lógica reutilizável
- **Componentes funcionais** com TypeScript
- **CSS Modules** para estilos isolados
- **Responsive Design** mobile-first

## 🔧 **Configuração**

### **Variáveis de Ambiente**

Criar arquivo `.env.local`:

```env
# API Backend (opcional - sistema funciona offline)
REACT_APP_API_URL=http://localhost:3000

# Configurações da aplicação
REACT_APP_NAME=Conéctar
REACT_APP_VERSION=1.0.0
```

### **Configuração do TailwindCSS**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'conectar-green': '#10B981',
      },
      fontFamily: {
        'conectar': ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
```

## 🎨 **Sistema de Mock**

### **Como Funciona**

O frontend possui um sistema inteligente de dados simulados:

1. **Carregamento inicial** dos dados padrão
2. **Persistência** no localStorage
3. **CRUD completo** funcionando offline
4. **Filtros locais** para busca
5. **Reset de dados** para estado inicial

### **Arquivos de Mock**

- `src/services/mockData.ts` - Dados estáticos
- `src/services/smartApi.ts` - API simulada
- `src/contexts/MockContext.tsx` - Contexto de mock

### **Credenciais de Teste**

```
Email: admin@conectar.com
Senha: qualquer (sistema mockado)
```

## 📱 **Responsividade**

### **Breakpoints**

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Componentes Responsivos**

- Header com navegação adaptativa
- Sidebar colapsável em mobile
- Tabelas com scroll horizontal
- Formulários adaptativos
- Botões com tamanhos apropriados

## 🔍 **Debugging**

### **Ferramentas de Desenvolvimento**

- **React DevTools** - Inspeção de componentes
- **Redux DevTools** - Estado da aplicação
- **Console** - Logs e erros
- **Network** - Requisições HTTP

### **Logs Úteis**

```javascript
// Verificar dados mockados
console.log('Mock Users:', smartApi.getUsers());
console.log('Mock Clients:', smartApi.getClients());

// Verificar localStorage
console.log('Users:', localStorage.getItem('@Conectar:mockUsers'));
console.log('Clients:', localStorage.getItem('@Conectar:mockClients'));
```

## 📚 **Documentação Adicional**

- [📖 Arquitetura](./ARQUITETURA.md)
- [🔧 Instalação](./INSTALACAO.md)
- [🧪 Testes](./TESTES.md)

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Frontend Conéctar** - Interface moderna e responsiva 🎨
