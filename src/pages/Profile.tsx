import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface ProfileFormData {
	name: string;
	email: string;
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const Profile: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [showPasswordFields, setShowPasswordFields] = useState(false);
	const [createdAt, setCreatedAt] = useState<string | null>(null);
	
	const { user, signOut } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		watch,
		reset,
	} = useForm<ProfileFormData>({
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
		},
	});

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const res = await api.get('/users/me');
				const me = res.data;
				setCreatedAt(me.createdAt);
				reset({ name: me.name, email: me.email, currentPassword: '', newPassword: '', confirmPassword: '' });
			} catch (e) {
				// silencioso
			}
		};
		fetchMe();
	}, [reset]);

	const newPassword = watch('newPassword');

	const onSubmit = async (data: ProfileFormData) => {
		try {
			setLoading(true);
			setMessage('');

			// Se está alterando a senha, validar
			if (showPasswordFields && data.newPassword) {
				if (data.newPassword !== data.confirmPassword) {
					setMessage('As senhas não coincidem');
					return;
				}
				if (data.newPassword.length < 6) {
					setMessage('A nova senha deve ter pelo menos 6 caracteres');
					return;
				}
			}

			// Preparar dados para envio
			const updateData: any = {
				name: data.name,
			};

			if (showPasswordFields && data.newPassword) {
				updateData.password = data.newPassword;
			}

			await api.patch(`/users/${user?.id}`, updateData);
			setMessage('Perfil atualizado com sucesso!');
			setShowPasswordFields(false);
		} catch (error: any) {
			setMessage(error.response?.data?.message || 'Erro ao atualizar perfil');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		signOut();
		navigate('/login');
	};

	if (!user) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-4">
							<button
								onClick={() => navigate('/dashboard')}
								className="p-2 hover:bg-gray-100 rounded-md"
							>
								<ArrowLeft size={20} />
							</button>
							<h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
						</div>
						<button
							onClick={handleLogout}
							className="px-4 py-2 text-gray-600 hover:text-gray-900"
						>
							Sair
						</button>
					</div>
				</div>
			</header>

			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white rounded-lg shadow">
					<div className="p-6">
						<h2 className="text-lg font-medium text-gray-900 mb-6">Informações do Perfil</h2>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Informações Básicas */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Nome Completo *
									</label>
									<div className="relative">
										<input
											{...register('name', { required: 'Nome é obrigatório' })}
											type="text"
											className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
												errors.name ? 'border-red-500' : 'border-gray-300'
											}`}
											placeholder="Digite seu nome completo"
										/>
										<User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
									</div>
									{errors.name && (
										<p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email
									</label>
									<div className="relative">
										<input
											{...register('email')}
											type="email"
											disabled
											className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
											value={user.email}
										/>
										<Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
									</div>
									<p className="mt-1 text-sm text-gray-500">O email não pode ser alterado</p>
								</div>
							</div>

							{/* Informações do Sistema */}
							<div className="border-t pt-6">
								<h3 className="text-md font-medium text-gray-900 mb-4">Informações do Sistema</h3>
								
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-gray-50 p-4 rounded-md">
										<div className="flex items-center space-x-2 mb-2">
											<Shield size={20} className="text-gray-400" />
											<span className="text-sm font-medium text-gray-700">Função</span>
										</div>
										<p className="text-lg font-semibold text-gray-900 capitalize">
											{user.role === 'admin' ? 'Administrador' : 'Usuário'}
										</p>
									</div>

									<div className="bg-gray-50 p-4 rounded-md">
										<div className="flex items-center space-x-2 mb-2">
											<Calendar size={20} className="text-gray-400" />
											<span className="text-sm font-medium text-gray-700">Membro desde</span>
										</div>
										<p className="text-lg font-semibold text-gray-900">
											{createdAt ? new Date(createdAt).toLocaleDateString('pt-BR') : '-'}
										</p>
									</div>

									<div className="bg-gray-50 p-4 rounded-md">
										<div className="flex items-center space-x-2 mb-2">
											<User size={20} className="text-gray-400" />
											<span className="text-sm font-medium text-gray-700">Status</span>
										</div>
										<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
											Ativo
										</span>
									</div>
								</div>
							</div>

							{/* Alteração de Senha */}
							<div className="border-t pt-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-md font-medium text-gray-900">Alterar Senha</h3>
									<button
										type="button"
										onClick={() => setShowPasswordFields(!showPasswordFields)}
										className="text-sm text-conectar-green hover:text-green-600"
									>
										{showPasswordFields ? 'Cancelar' : 'Alterar senha'}
									</button>
								</div>

								{showPasswordFields && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Nova Senha *
											</label>
											<input
												{...register('newPassword', {
													required: showPasswordFields ? 'Nova senha é obrigatória' : false,
													minLength: {
														value: 6,
														message: 'A senha deve ter pelo menos 6 caracteres',
													},
												})}
												type="password"
												className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
													errors.newPassword ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="Digite a nova senha"
											/>
											{errors.newPassword && (
												<p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Confirmar Nova Senha *
											</label>
											<input
												{...register('confirmPassword', {
													required: showPasswordFields ? 'Confirmação é obrigatória' : false,
													validate: (value) =>
														value === newPassword || 'As senhas não coincidem',
												})}
												type="password"
												className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
													errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
												}`}
												placeholder="Confirme a nova senha"
											/>
											{errors.confirmPassword && (
												<p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
											)}
										</div>
									</div>
								)}
							</div>

							{/* Mensagem */}
							{message && (
								<div className={`p-4 rounded-md ${
									message.includes('sucesso') 
										? 'bg-green-50 border border-green-200 text-green-700'
										: 'bg-red-50 border border-red-200 text-red-700'
								}` }>
									{message}
								</div>
							)}

							{/* Botões */}
							<div className="flex justify-end space-x-3 pt-6 border-t">
								<button
									type="button"
									onClick={() => navigate('/dashboard')}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={loading || !isDirty}
									className={`inline-flex items-center px-4 py-2 rounded-md font-medium ${
										loading || !isDirty
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-conectar-green text-white hover:bg-green-600'
									}`}
							>
								<Save size={20} className="mr-2" />
								{loading ? 'Salvando...' : 'Salvar Alterações'}
							</button>
						</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
