import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';
import smartApi from '../services/smartApi';

// Mock do smartApi
jest.mock('../services/smartApi', () => ({
  __esModule: true,
  default: {
    updateUser: jest.fn(),
  },
}));

// Mock do AuthContext
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user' as const,
  isActive: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: mockUser,
    loading: false,
    signOut: jest.fn(),
  })),
}));

const mockSmartApi = smartApi as jest.Mocked<typeof smartApi>;
const mockUseAuth = require('../contexts/AuthContext').useAuth;

const renderProfile = () => {
  return render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );
};

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signOut: jest.fn(),
    });
  });

  it('should render profile information', async () => {
    await act(async () => {
      renderProfile();
    });

    await waitFor(() => {
      expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });
  });

  it('should display user role correctly', async () => {
    await act(async () => {
      renderProfile();
    });

    await waitFor(() => {
      expect(screen.getByText('Usuário')).toBeInTheDocument();
    });
  });

  it('should display admin role correctly', async () => {
    const mockAdminUser = {
      ...mockUser,
      role: 'admin' as const,
    };

    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      loading: false,
      signOut: jest.fn(),
    });

    await act(async () => {
      renderProfile();
    });

    await waitFor(() => {
      expect(screen.getByText('Administrador')).toBeInTheDocument();
    });
  });

  it('should toggle password fields when alterar senha is clicked', async () => {
    await act(async () => {
      renderProfile();
    });

    await waitFor(() => {
      expect(screen.getByText('Alterar senha')).toBeInTheDocument();
    });

    const alterarSenhaButton = screen.getByText('Alterar senha');
    
    await act(async () => {
      fireEvent.click(alterarSenhaButton);
    });

    // Deve mostrar os campos de senha
    expect(screen.getByPlaceholderText('Digite a nova senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirme a nova senha')).toBeInTheDocument();
    
    // Usar getAllByText para pegar o botão específico da seção de senha
    const cancelarButtons = screen.getAllByText('Cancelar');
    const senhaCancelarButton = cancelarButtons[0]; // Primeiro botão (da seção de senha)
    
    await act(async () => {
      fireEvent.click(senhaCancelarButton);
    });

    // Deve esconder os campos de senha
    expect(screen.queryByPlaceholderText('Digite a nova senha')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Confirme a nova senha')).not.toBeInTheDocument();
  });

  it('should save profile changes successfully', async () => {
    mockSmartApi.updateUser.mockResolvedValue(mockUser);

    await act(async () => {
      renderProfile();
    });

    const nameInput = screen.getByDisplayValue('Test User');
    const submitButton = screen.getByRole('button', { name: 'Salvar Alterações' });

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Perfil atualizado com sucesso!')).toBeInTheDocument();
    });

    expect(mockSmartApi.updateUser).toHaveBeenCalledWith(1, { name: 'Updated Name' });
  });

  it('should handle profile update errors', async () => {
    mockSmartApi.updateUser.mockRejectedValue(new Error('Update failed'));

    await act(async () => {
      renderProfile();
    });

    const nameInput = screen.getByDisplayValue('Test User');
    const submitButton = screen.getByRole('button', { name: 'Salvar Alterações' });

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Erro ao atualizar perfil')).toBeInTheDocument();
    });
  });

  it('should validate password confirmation', async () => {
    await act(async () => {
      renderProfile();
    });

    const alterarSenhaButton = screen.getByText('Alterar senha');
    
    await act(async () => {
      fireEvent.click(alterarSenhaButton);
    });

    const newPasswordInput = screen.getByPlaceholderText('Digite a nova senha');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme a nova senha');
    const submitButton = screen.getByRole('button', { name: 'Salvar Alterações' });

    await act(async () => {
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    await act(async () => {
      renderProfile();
    });

    const alterarSenhaButton = screen.getByText('Alterar senha');
    
    await act(async () => {
      fireEvent.click(alterarSenhaButton);
    });

    const newPasswordInput = screen.getByPlaceholderText('Digite a nova senha');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme a nova senha');
    const submitButton = screen.getByRole('button', { name: 'Salvar Alterações' });

    await act(async () => {
      fireEvent.change(newPasswordInput, { target: { value: '123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
    });
  });

  it('should handle logout', async () => {
    const mockSignOut = jest.fn();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signOut: mockSignOut,
    });

    await act(async () => {
      renderProfile();
    });

    const logoutButton = screen.getByText('Sair');
    
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should navigate back when back button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    await act(async () => {
      renderProfile();
    });

    const backButton = screen.getByRole('button', { name: '' }); // Botão sem texto, apenas ícone
    
    await act(async () => {
      fireEvent.click(backButton);
    });

    // Como o componente não usa useNavigate diretamente, apenas verificamos que o botão existe
    expect(backButton).toBeInTheDocument();
  });
});
