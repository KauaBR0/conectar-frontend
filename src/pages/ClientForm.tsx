import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, User, Building, MapPin } from 'lucide-react';
import { api } from '../services/api';

interface ClientFormData {
  facadeName: string;
  cnpj: string;
  companyName: string;
  tags: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  conectaPlus: 'Sim' | 'Não';
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  internalNotes: string;
}

const ClientForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dados');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [client, setClient] = useState<ClientFormData | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<ClientFormData>({
    defaultValues: {
      facadeName: '',
      cnpj: '',
      companyName: '',
      tags: '',
      status: 'Pendente',
      conectaPlus: 'Não',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      internalNotes: '',
    },
  });

  useEffect(() => {
    if (id && id !== 'new') {
      loadClient();
      setIsEditing(true);
    }
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/clients/${id}`);
      const clientData = response.data as Partial<ClientFormData> & Record<string, any>;
      setClient(clientData as ClientFormData);
      
      // Preencher SOMENTE campos conhecidos do formulário
      const allowedKeys: (keyof ClientFormData)[] = [
        'facadeName',
        'cnpj',
        'companyName',
        'tags',
        'status',
        'conectaPlus',
        'cep',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'internalNotes',
      ];

      allowedKeys.forEach((key) => {
        if (clientData[key] !== undefined && clientData[key] !== null) {
          setValue(key, clientData[key] as any);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      setLoading(true);
      
      // Filtrar campos vazios e garantir que valores obrigatórios estejam presentes
      const cleanData: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== '' && value !== null && value !== undefined && value !== 'undefined') {
          cleanData[key] = value;
        }
      }
      // Garantir que campos proibidos não sejam enviados
      delete (cleanData as any).id;
      delete (cleanData as any).createdAt;
      delete (cleanData as any).updatedAt;

      console.log('Dados originais do formulário:', data);
      console.log('Dados limpos a serem enviados:', cleanData);
      console.log('Modo edição:', isEditing);
      console.log('ID do cliente:', id);

      // Validar campos obrigatórios para criação
      if (!isEditing) {
        const requiredFields = ['facadeName', 'cnpj', 'companyName', 'status', 'conectaPlus', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'];
        const missingFields = requiredFields.filter(field => !cleanData[field]);
        
        if (missingFields.length > 0) {
          alert(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
          return;
        }
      }

      if (isEditing) {
        await api.patch(`/clients/${id}`, cleanData);
      } else {
        await api.post('/clients', cleanData);
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      console.error('Erro detalhado:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Erro desconhecido ao salvar cliente';
      alert(`Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dados', label: 'Dados Cadastrais', icon: Building },
    { id: 'internos', label: 'Informações Internas', icon: User },
    { id: 'usuarios', label: 'Usuários', icon: User },
  ];

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-conectar-green"></div>
      </div>
    );
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
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
              </h1>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !isDirty}
              className={`inline-flex items-center px-4 py-2 rounded-md font-medium ${
                loading || !isDirty
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-conectar-green text-white hover:bg-green-600'
              }`}
            >
              <Save size={20} className="mr-2" />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-conectar-green text-conectar-green'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={20} className="inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Dados Cadastrais */}
            {activeTab === 'dados' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informações Cadastrais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome na fachada *
                    </label>
                    <input
                      {...register('facadeName', { required: 'Campo obrigatório' })}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                        errors.facadeName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Digite o nome na fachada"
                    />
                    {errors.facadeName && (
                      <p className="mt-1 text-sm text-red-600">{errors.facadeName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNPJ *
                    </label>
                    <input
                      {...register('cnpj', { required: 'Campo obrigatório' })}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                        errors.cnpj ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="00.000.000/0000-00"
                    />
                    {errors.cnpj && (
                      <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razão Social *
                    </label>
                    <input
                      {...register('companyName', { required: 'Campo obrigatório' })}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Digite a razão social"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      {...register('tags')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green"
                      placeholder="Digite as tags separadas por vírgula"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      {...register('status', { required: 'Campo obrigatório' })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                        errors.status ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione o status</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block textsm font-medium text-gray-700 mb-2">
                      Conecta Plus *
                    </label>
                    <select
                      {...register('conectaPlus', { required: 'Campo obrigatório' })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                        errors.conectaPlus ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                    {errors.conectaPlus && (
                      <p className="mt-1 text-sm text-red-600">{errors.conectaPlus.message}</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                    <MapPin size={20} className="mr-2" />
                    Endereço
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        {...register('cep', { required: 'Campo obrigatório' })}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                          errors.cep ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="00000-000"
                      />
                      {errors.cep && (
                        <p className="mt-1 text-sm text-red-600">{errors.cep.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua *
                      </label>
                      <input
                        {...register('street', { required: 'Campo obrigatório' })}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Digite o nome da rua"
                      />
                      {errors.street && (
                        <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        {...register('number', { required: 'Campo obrigatório' })}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                          errors.number ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Digite o número"
                      />
                      {errors.number && (
                        <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        {...register('complement')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green"
                        placeholder="Apartamento, sala, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro *
                      </label>
                      <input
                        {...register('neighborhood', { required: 'Campo obrigatório' })}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                          errors.neighborhood ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Digite o bairro"
                      />
                      {errors.neighborhood && (
                        <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        {...register('city', { required: 'Campo obrigatório' })}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Digite a cidade"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <input
                        {...register('state', { required: 'Campo obrigatório' })}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="UF"
                        maxLength={2}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informações Internas */}
            {activeTab === 'internos' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informações Internas
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Internas
                  </label>
                  <textarea
                    {...register('internalNotes')}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-conectar-green"
                    placeholder="Digite observações internas sobre o cliente..."
                  />
                </div>
              </div>
            )}

            {/* Usuários */}
            {activeTab === 'usuarios' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Usuários
                </h3>
                
                <div className="text-center py-12 text-gray-500">
                  <User size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Funcionalidade de usuários será implementada em breve</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
