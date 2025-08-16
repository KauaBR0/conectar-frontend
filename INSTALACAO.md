# 🚀 Instruções de Instalação - Conéctar

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn instalado
- Git instalado

## 🛠️ Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd conectar
```

### 2. Configuração do Backend

```bash
cd backend

# Instalar dependências
npm install

# O arquivo config.env já está configurado e pronto para uso
# (opcional: copie config.env para .env se preferir)

# Iniciar o servidor de desenvolvimento
npm run start:dev
```

O backend estará rodando em: `http://localhost:3001`
Documentação da API: `http://localhost:3001/api`

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start
```

O frontend estará rodando em: `http://localhost:3000`

## 🔑 Credenciais de Acesso

### Usuário Administrador
- **Email:** admin@conectar.com
- **Senha:** admin123

### Usuário Regular
- **Email:** user@conectar.com
- **Senha:** user123

## 📱 Funcionalidades Implementadas

### ✅ Backend (NestJS)
- [x] Autenticação JWT
- [x] CRUD de usuários
- [x] CRUD de clientes
- [x] Filtros e ordenação
- [x] Controle de acesso baseado em roles
- [x] Validação de dados
- [x] Documentação Swagger
- [x] Banco SQLite com seeds automáticos

### ✅ Frontend (React)
- [x] Tela de login idêntica ao screenshot
- [x] Dashboard com listagem de clientes
- [x] Filtros avançados expansíveis
- [x] Formulário de cliente com múltiplas abas
- [x] Perfil do usuário
- [x] Interface responsiva
- [x] Gerenciamento de estado com Context API
- [x] Validação de formulários

## 🧪 Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 🚀 Deploy

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
# Os arquivos estarão em build/ para deploy
```

## 🔧 Configurações Adicionais

### Variáveis de Ambiente (Backend)
- `DB_PATH`: Caminho do banco SQLite
- `JWT_SECRET`: Chave secreta para JWT
- `PORT`: Porta do servidor
- `NODE_ENV`: Ambiente de execução

### Personalização
- Cores: Editar `frontend/tailwind.config.js`
- Logo: Substituir arquivos em `frontend/public/`
- Configurações: Editar arquivos `.env`

## 📊 Estrutura do Banco

### Tabela Users
- id, name, email, password, role, createdAt, updatedAt, lastLoginAt

### Tabela Clients
- id, facadeName, cnpj, companyName, tags, status, conectaPlus
- cep, street, number, complement, neighborhood, city, state
- internalNotes, assignedUserId, createdAt, updatedAt

## 🆘 Solução de Problemas

### Erro de CORS
- Verificar se o backend está rodando na porta 3001
- Verificar configurações CORS no backend

### Erro de Banco
- Verificar se o arquivo `.env` foi criado
- Verificar permissões de escrita na pasta

### Erro de Dependências
- Deletar `node_modules` e `package-lock.json`
- Executar `npm install` novamente

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do console
2. Verificar documentação da API em `/api`
3. Verificar arquivos de configuração

## 🎯 Próximos Passos

- [ ] Integração com OAuth (Google/Microsoft)
- [ ] Notificações em tempo real
- [ ] Relatórios e analytics
- [ ] Backup automático
- [ ] Logs de auditoria
- [ ] API rate limiting
