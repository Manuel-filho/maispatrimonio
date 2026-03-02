import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = Cookies.get('token');
            const savedUser = Cookies.get('user');

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    setIsAuthenticated(true);
                    // Optional: Verify token with backend
                    // const me = await authService.getMe();
                    // setUser(me);
                } catch (error) {
                    console.error('Failed to parse user data', error);
                    logout();
                }
            }
            setLoading(false);
        };

        const handleUnauthorized = () => {
            // Remove cookies and reset state immediately without hitting the backend
            // Because if we call logout(), the backend will return another 401, causing an infinite loop
            Cookies.remove('token');
            Cookies.remove('user');
            setUser(null);
            setIsAuthenticated(false);
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        initializeAuth();

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const checkEmail = async (email) => {
        try {
            const data = await authService.checkEmail(email);
            return { success: true, data };
        } catch (error) {
            console.error('Email check error', error);
            return {
                success: false,
                message: 'Utilizador não encontrado. Verifique o e-mail ou registe-se.'
            };
        }
    };

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            const { access_token, user: userData } = data;

            Cookies.set('token', access_token, { expires: 7 });
            Cookies.set('user', JSON.stringify(userData), { expires: 7 });

            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Login error', error);
            return {
                success: false,
                message: error.response?.data?.error || 'Palavra-passe incorreta'
            };
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            // Backend automatically logs in or returns success?
            // In this specific backend, it returns message and user but no token in register.
            // We might need to call login after register or update backend.
            // For now, let's just return success and let the UI handle redirect to login.
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Register error', error);
            return {
                success: false,
                message: typeof error.response?.data === 'string' ? JSON.parse(error.response.data) : (error.response?.data?.message || 'Erro ao realizar registo')
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            Cookies.remove('token');
            Cookies.remove('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            setUser,
            updateUser,
            checkEmail
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
