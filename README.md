# 🚀 Conéctar - Sistema de Gestão de Clientes

Sistema interno para gerenciamento de clientes da Conéctar, desenvolvido com arquitetura full-stack moderna e funcionalidades offline.

## 🏗️ **Arquitetura**

```
conectar/
├── backend/          # API NestJS + TypeScript + PostgreSQL
├── frontend/         # React + TypeScript + TailwindCSS
└── docs/            # Documentação do projeto
```

## 🎯 **Funcionalidades**

- ✅ **Autenticação JWT** com roles (Admin/User)
- ✅ **Gestão de Usuários** (CRUD completo)
- ✅ **Gestão de Clientes** (CRUD completo)
- ✅ **Sistema de Filtros** avançados
- ✅ **Modo Offline** com dados simulados
- ✅ **Persistência Local** com localStorage
- ✅ **Interface Responsiva** para todos os dispositivos

## 🚀 **Execução Local**

### **Pré-requisitos**

- Node.js 18+ 
- npm ou yarn
- Git

### **1. Clone o repositório**

```bash
git clone https://github.com/KauaBR0/conectar.git
cd conectar
```

### **2. Backend (NestJS)**

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar em desenvolvimento
npm run start:dev

# Executar testes
npm run test
```

**Backend rodará em:** http://localhost:3000

### **3. Frontend (React)**

```bash
cd frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Executar testes
npm test

# Build de produção
npm run build
```

**Frontend rodará em:** http://localhost:3001

## 🔧 **Configuração do Backend**

### **Variáveis de Ambiente (.env)**

```env
# Banco de Dados
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=conectar_db

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro

# CORS
CORS_ORIGIN=http://localhost:3001
```

### **Banco de Dados**

O projeto suporta:
- **SQLite** (desenvolvimento)
- **PostgreSQL** (produção)

## 🎨 **Modo Demo/Offline**

O frontend possui um sistema de dados simulados que funciona completamente offline:

- **Dados persistentes** no localStorage
- **CRUD completo** funcionando offline
- **Filtros e busca** locais
- **Sem dependência** do backend

### **Credenciais de Teste**

```
Email: admin@conectar.com
Senha: qualquer (sistema mockado)
```

## 🧪 **Testes**

### **Backend**
```bash
cd backend
npm run test          # Testes unitários
npm run test:e2e      # Testes E2E
npm run test:cov      # Cobertura de testes
```

### **Frontend**
```bash
cd frontend
npm test              # Testes unitários
npm run test:coverage # Cobertura de testes
```

## 📦 **Deploy**

### **Frontend (Vercel)**
```bash
cd frontend
npm run build
vercel --prod
```

### **Backend (Vercel/Render)**
```bash
cd backend
npm run build
# Deploy via Vercel CLI ou Render
```

## 🛠️ **Tecnologias**

### **Backend**
- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem principal
- **TypeORM** - ORM para banco de dados
- **PostgreSQL/SQLite** - Banco de dados
- **JWT** - Autenticação
- **Jest** - Testes

### **Frontend**
- **React 18** - Biblioteca UI
- **TypeScript** - Linguagem principal
- **TailwindCSS** - Framework CSS
- **React Hook Form** - Formulários
- **React Testing Library** - Testes

## 📚 **Documentação Adicional**

- [📖 Arquitetura](./docs/ARQUITETURA.md)
- [🔧 Instalação](./docs/INSTALACAO.md)
- [🧪 Testes](./docs/TESTES.md)
- [🚀 Deploy](./docs/DEPLOY.md)

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto é privado e de uso interno da Conéctar.

## 👥 **Equipe**

- **Desenvolvimento:** [Seu Nome]
- **Design:** [Designer]
- **Product Owner:** [PO]

---

**Conéctar** - Transformando a gestão de clientes 🚀
