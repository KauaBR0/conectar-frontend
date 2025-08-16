import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do AuthContext
const mockSignIn = jest.fn();
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', async () => {
    await act(async () => {
      renderLogin();
    });
    
    expect(screen.getByText('Conéctar')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('should handle form submission successfully', async () => {
    mockSignIn.mockResolvedValue(undefined);
    
    await act(async () => {
      renderLogin();
    });
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should display loading state during submission', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    mockSignIn.mockReturnValue(promise);
    
    await act(async () => {
      renderLogin();
    });
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });
    
    // Aguardar o estado de loading ser aplicado
    await waitFor(() => {
      expect(screen.getByText('Entrando...')).toBeInTheDocument();
    });
    expect(submitButton).toBeDisabled();
    
    // Resolver a promise para limpar o estado
    resolvePromise!(undefined);
  });

  it('should display error message on login failure', async () => {
    const errorMessage = 'Email ou senha incorretos';
    mockSignIn.mockRejectedValue(new Error('Login failed'));
    
    await act(async () => {
      renderLogin();
    });
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should show and hide password when toggle is clicked', async () => {
    await act(async () => {
      renderLogin();
    });
    
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: '' }); // Botão sem texto, apenas ícone
    
    expect(passwordInput.type).toBe('password');
    
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(passwordInput.type).toBe('text');
    
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(passwordInput.type).toBe('password');
  });

  it('should display demo credentials', async () => {
    await act(async () => {
      renderLogin();
    });
    
    expect(screen.getByText('Credenciais de Demonstração:')).toBeInTheDocument();
    expect(screen.getByText(/Admin:/)).toBeInTheDocument();
    expect(screen.getByText(/Usuário:/)).toBeInTheDocument();
    expect(screen.getByText(/admin@conectar.com/)).toBeInTheDocument();
    expect(screen.getByText(/user@conectar.com/)).toBeInTheDocument();
  });
});
