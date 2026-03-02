import api from './api';

const transactionService = {
    // Listar todas as transações
    getAll: async () => {
        const response = await api.get('/transactions');
        return response.data;
    },

    // Criar uma nova transação (Receita ou Despesa)
    create: async (data) => {
        const response = await api.post('/transactions', data);
        return response.data;
    },

    // Atualizar uma transação
    update: async (id, data) => {
        const response = await api.put(`/transactions/${id}`, data);
        return response.data;
    },

    // Eliminar uma transação
    delete: async (id) => {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    },

    // Realizar uma transferência entre contas
    transfer: async (data) => {
        const response = await api.post('/transactions/transfer', data);
        return response.data;
    },

    // Anular uma transação (dentro de 30 min)
    cancel: async (id) => {
        const response = await api.post(`/transactions/${id}/cancel`);
        return response.data;
    },

    // Obter histórico financeiro (liquidez e ativos)
    getHistory: async (params) => {
        const response = await api.get('/transactions/history', { params });
        return response.data;
    },

    // Obter estatísticas por categoria
    getStats: async (params) => {
        const response = await api.get('/transactions/stats', { params });
        return response.data;
    }
};

export default transactionService;
