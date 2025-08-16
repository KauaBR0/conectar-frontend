import axios from 'axios';

// Configuração da API baseada no ambiente
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://conectar-backend-5teqmsw6n-apianime.vercel.app' // Backend Vercel mais recente
  : 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@Conectar:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('@Conectar:token');
      localStorage.removeItem('@Conectar:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
