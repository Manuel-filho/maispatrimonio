import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import api from '../services/api';

export const useProfile = () => {
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [currencies, setCurrencies] = useState([]);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        birthdate: user?.birthdate ? user.birthdate.split('T')[0] : '',
        gender: user?.gender || '',
        preferred_currency_id: user?.preferred_currency_id || '',
    });

    const [initialData, setInitialData] = useState({ ...formData });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    useEffect(() => {
        if (user) {
            const data = {
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                birthdate: user.birthdate ? user.birthdate.split('T')[0] : '',
                gender: user.gender || '',
                preferred_currency_id: user.preferred_currency_id || '',
            };
            setFormData(data);
            setInitialData(data);
        }
    }, [user]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await authService.getMe();
                updateUser(data);
            } catch (err) {
                console.error('Erro ao buscar dados do usuário', err);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await api.get('/currencies');
                setCurrencies(response.data);
            } catch (err) {
                console.error('Erro ao carregar moedas', err);
            }
        };

        fetchCurrencies();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const updatePersonalInfo = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await authService.updateProfile(formData);
            updateUser(data.user);
            setSuccess('Perfil atualizado com sucesso!');
        } catch (err) {
            console.error('Update profile error', err);
            setError(err.response?.data || { message: 'Erro ao atualizar perfil' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarUpload = async (file) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const form = new FormData();
            form.append('avatar', file);
            form.append('name', formData.name);
            form.append('email', formData.email);

            const data = await authService.updateProfile(form);
            updateUser(data.user);
            setSuccess('Foto de perfil atualizada!');
        } catch (err) {
            console.error('Avatar upload error', err);
            setError(err.response?.data || { message: 'Erro ao carregar avatar' });
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await authService.changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                new_password_confirmation: passwordData.new_password_confirmation,
            });
            setSuccess(data.message);
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        } catch (err) {
            console.error('Change password error', err);
            setError(err.response?.data || { message: 'Erro ao alterar palavra-passe' });
        } finally {
            setIsLoading(false);
        }
    };

    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

    const cancelEdit = () => {
        setFormData(initialData);
        setIsEditing(false);
        setError(null);
    };

    return {
        user,
        currencies,
        formData,
        passwordData,
        isLoading,
        isEditing,
        setIsEditing,
        isDirty,
        error,
        success,
        handleInputChange,
        handlePasswordChange,
        updatePersonalInfo,
        handleAvatarUpload,
        updatePassword,
        cancelEdit,
        setSuccess,
        setError
    };
};

export default useProfile;
