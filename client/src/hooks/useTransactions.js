import { useState } from 'react';
import transactionService from '../services/transactionService';

export const useTransactions = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const createTransaction = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await transactionService.create(data);
            setSuccess('Transação registada com sucesso!');
            return { success: true, data: result };
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao registar transação.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    };

    const performTransfer = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await transactionService.transfer(data);
            setSuccess('Transferência realizada com sucesso!');
            return { success: true, data: result };
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao realizar transferência.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    };

    const cancelTransaction = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            await transactionService.cancel(id);
            setSuccess('Transação anulada com sucesso!');
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao anular transação.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    };

    const getHistory = async (params) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await transactionService.getHistory(params);
            return { success: true, data: result };
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao obter histórico.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    };

    const getStats = async (params) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await transactionService.getStats(params);
            return { success: true, data: result };
        } catch (err) {
            const message = err.response?.data?.message || 'Erro ao obter estatísticas.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    };

    const clearStatus = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        isLoading,
        error,
        success,
        createTransaction,
        performTransfer,
        cancelTransaction,
        getHistory,
        getStats,
        clearStatus
    };
};
