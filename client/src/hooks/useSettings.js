import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export const useSettings = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.deleteAccount();
            setSuccess('Conta eliminada com sucesso. A redirecionar...');

            // Give the user 3 seconds to see the success message
            setTimeout(() => {
                logout();
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao eliminar conta. Tente novamente.');
            setIsLoading(false);
        }
    };

    const clearStatus = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        theme,
        toggleTheme,
        isLoading,
        error,
        success,
        clearStatus,
        showDeleteModal,
        setShowDeleteModal,
        handleDeleteAccount
    };
};

export default useSettings;
