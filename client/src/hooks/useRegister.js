import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export const useRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        birthdate: '',
        gender: 'M',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setPhone = (phone) => {
        setFormData({ ...formData, phone });
    };

    const setEmail = (email) => {
        setFormData({ ...formData, email });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const result = await register(formData);

            if (result.success) {
                setSuccess('Conta criada com sucesso! Redirecionando para o login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                if (typeof result.message === 'object') {
                    const firstError = Object.values(result.message)[0];
                    setError(firstError);
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError('Ocorreu um erro ao criar a conta. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        setFormData,
        error,
        setError,
        success,
        setSuccess,
        showPassword,
        setShowPassword,
        isSubmitting,
        handleChange,
        setPhone,
        setEmail,
        handleSubmit
    };
};

export default useRegister;
