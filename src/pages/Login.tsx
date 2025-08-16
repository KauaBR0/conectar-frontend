import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou senha incorretos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-conectar-green flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-conectar">
            Conéctar
          </h1>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                type="email"
                id="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite seu email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`w-full px-3 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-conectar-green text-white py-3 px-4 rounded-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-conectar-green focus:ring-offset-2 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Informações de Demo */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Credenciais de Demonstração:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@conectar.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
