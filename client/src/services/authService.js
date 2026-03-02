import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    checkEmail: async (email) => {
        const response = await api.post('/auth/check-email', { email });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (userData) => {
        // Use FormData if userData contains a file (avatar)
        const response = await api.post('/auth/profile', userData, {
            headers: {
                'Content-Type': userData instanceof FormData ? 'multipart/form-data' : 'application/json'
            }
        });
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.post('/auth/change-password', passwordData);
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/auth/me');
        return response.data;
    },
};

export default authService;
