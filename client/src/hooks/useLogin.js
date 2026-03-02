import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

export const useLogin = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, checkEmail } = useAuth();
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await checkEmail(email);

            if (result.success) {
                setUserData(result.data.user);
                setStep(2);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Ocorreu um erro ao verificar o e-mail. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Fallo ao iniciar sessão. Verifique as suas credenciais.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetStep = () => {
        setStep(1);
        setUserData(null);
        setPassword('');
        setError('');
    };

    return {
        step,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        userData,
        error,
        setError,
        isSubmitting,
        handleEmailSubmit,
        handleLoginSubmit,
        resetStep
    };
};

export default useLogin;
