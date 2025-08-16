import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronUp, ChevronDown, HelpCircle, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import smartApi from '../services/smartApi';

interface Client {
	id: string;
	facadeName: string;
	cnpj: string;
	companyName: string;
	tags: string;
	status: 'Ativo' | 'Inativo' | 'Pendente';
	conectaPlus: 'Sim' | 'Não';
}

const Dashboard: React.FC = () => {
	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState(true);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [filters, setFilters] = useState({
		name: '',
		cnpj: '',
		status: '',
		conectaPlus: '',
	});

	const { user, signOut } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		loadClients();
	}, [filters]);

	const loadClients = async () => {
		try {
			setLoading(true);
			const clientsData = await smartApi.getClients();
			
			// Aplicar filtros localmente
			let filteredClients = clientsData as any;
			
			if (filters.name) {
				filteredClients = filteredClients.filter((client: any) => 
					client.facadeName.toLowerCase().includes(filters.name.toLowerCase())
				);
			}
			if (filters.cnpj) {
				filteredClients = filteredClients.filter((client: any) => 
					client.cnpj.includes(filters.cnpj)
				);
			}
			if (filters.status) {
				filteredClients = filteredClients.filter((client: any) => 
					client.status === filters.status
				);
			}
			if (filters.conectaPlus) {
				filteredClients = filteredClients.filter((client: any) => 
					client.conectaPlus === filters.conectaPlus
				);
			}
			
			setClients(filteredClients);
		} catch (error) {
			console.error('Erro ao carregar clientes:', error);
		} finally {
			setLoading(false);
		}
	};

	const clearFilters = () => {
		setFilters({
			name: '',
			cnpj: '',
			status: '',
			conectaPlus: '',
		});
	};

	const handleLogout = () => {
		signOut();
		navigate('/login');
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-conectar-green text-white shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-8">
							<h1 className="text-2xl font-bold font-conectar">Conéctar</h1>
							<nav className="flex space-x-4">
								<button className="px-3 py-2 rounded-md text-sm font-medium bg-white bg-opacity-20">
									Clientes
								</button>
							</nav>
						</div>
						<div className="flex items-center space-x-2 sm:space-x-4">
							<button
								onClick={() => navigate('/profile')}
								className="p-2 hover:bg-white hover:bg-opacity-20 rounded-md flex items-center space-x-2"
							>
								<User size={20} />
								<span className="hidden sm:inline text-sm">Perfil</span>
							</button>
							<button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-md">
								<HelpCircle size={20} />
							</button>
							<button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-md">
								<Bell size={20} />
							</button>
							<button
								onClick={handleLogout}
								className="p-2 hover:bg-white hover:bg-opacity-20 rounded-md"
							>
								<LogOut size={20} />
							</button>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Básicos</h2>
							<nav className="space-y-2">
								<button className="w-full text-left px-3 py-2 text-sm font-medium text-conectar-green bg-green-50 rounded-md">
									Clientes
								</button>
								<button
									onClick={() => navigate('/profile')}
									className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
								>
									Perfil
								</button>
							</nav>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3">
						{/* Filtros */}
						<div className="bg-white rounded-lg shadow mb-6">
							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center space-x-2">
										<Search size={20} className="text-gray-400" />
										<h3 className="text-lg font-medium text-gray-900">Filtros</h3>
									</div>
									<button
										onClick={() => setFiltersExpanded(!filtersExpanded)}
										className="p-2 hover:bg-gray-100 rounded-md"
									>
										{filtersExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
									</button>
								</div>

								{filtersExpanded && (
									<div className="space-y-4">
										<p className="text-sm text-gray-600">
											Filtre e busque itens na página
										</p>
										
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Buscar por nome
												</label>
												<input
													type="text"
													value={filters.name}
													onChange={(e) => setFilters({ ...filters, name: e.target.value })}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green"
													placeholder="Digite o nome..."
												/>
											</div>
											
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Buscar por CNPJ
												</label>
												<input
													type="text"
													value={filters.cnpj}
													onChange={(e) => setFilters({ ...filters, cnpj: e.target.value })}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green"
													placeholder="Digite o CNPJ..."
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Buscar por status
												</label>
												<select
													value={filters.status}
													onChange={(e) => setFilters({ ...filters, status: e.target.value })}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green"
												>
													<option value="">Selecione</option>
													<option value="Ativo">Ativo</option>
													<option value="Inativo">Inativo</option>
													<option value="Pendente">Pendente</option>
												</select>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Buscar por conectar+
												</label>
												<select
													value={filters.conectaPlus}
													onChange={(e) => setFilters({ ...filters, conectaPlus: e.target.value })}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green"
												>
													<option value="">Selecione</option>
													<option value="Sim">Sim</option>
													<option value="Não">Não</option>
												</select>
											</div>
										</div>

										<div className="flex justify-end space-x-3">
											<button
												onClick={clearFilters}
												className="px-4 py-2 border border-conectar-green text-conectar-green rounded-md hover:bg-green-50"
											>
												Limpar campos
											</button>
											<button
												onClick={loadClients}
												className="px-4 py-2 bg-conectar-green text-white rounded-md hover:bg-green-600"
											>
												Filtrar
											</button>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Lista de Clientes */}
						<div className="bg-white rounded-lg shadow">
							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<div>
										<h2 className="text-lg font-medium text-gray-900">Clientes</h2>
										<p className="text-sm text-gray-600">
											Selecione um usuário para editar suas informações
										</p>
									</div>
									<button
										onClick={() => navigate('/client/new')}
										className="inline-flex items-center px-4 py-2 bg-conectar-green text-white rounded-md hover:bg-green-600"
									>
										<Plus size={20} className="mr-2" />
										Novo
									</button>
								</div>

								{loading ? (
									<div className="flex justify-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-conectar-green"></div>
									</div>
								) : (
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Razão social
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														CNPJ
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Nome na fachada
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Tags
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Status
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Conecta Plus
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{clients.map((client) => (
													<tr
														key={client.id}
														onClick={() => navigate(`/client/${client.id}`)}
														className="hover:bg-gray-50 cursor-pointer"
													>
														<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
															{client.companyName}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															{client.cnpj}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
															{client.facadeName}
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															{client.tags || '-'}
														</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<span
																className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
																	client.status === 'Ativo'
																		? 'bg-green-100 text-green-800'
																	: client.status === 'Inativo'
																	? 'bg-red-100 text-red-800'
																	: 'bg-yellow-100 text-yellow-800'
																}`}
															>
																{client.status}
															</span>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
															{client.conectaPlus}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}

								{!loading && clients.length === 0 && (
									<div className="text-center py-8">
										<p className="text-gray-500">Nenhum cliente encontrado</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;