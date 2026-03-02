import { useState, useEffect, useCallback } from 'react';
import goalService from '../services/goalService';

export const useGoals = () => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchGoals = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await goalService.getAll();
            setGoals(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar metas. Tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const createGoal = async (goalData) => {
        setIsLoading(true);
        try {
            const newGoal = await goalService.create(goalData);
            setGoals(prev => [...prev, newGoal.goal]);
            setSuccess('Meta criada com sucesso!');
            return { success: true };
        } catch (err) {
            const message = err.response?.data || 'Erro ao criar meta.';
            setError(message);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    };

    const updateGoal = async (id, goalData) => {
        setIsLoading(true);
        try {
            const updated = await goalService.update(id, goalData);
            setGoals(prev => prev.map(g => g.id === id ? updated.goal : g));
            setSuccess('Meta atualizada com sucesso!');
            return { success: true };
        } catch (err) {
            const message = err.response?.data || 'Erro ao atualizar meta.';
            setError(message);
            return { success: false, message };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteGoal = async (id) => {
        setIsLoading(true);
        try {
            await goalService.delete(id);
            setGoals(prev => prev.filter(g => g.id !== id));
            setSuccess('Meta eliminada com sucesso!');
            return { success: true };
        } catch (err) {
            setError('Erro ao eliminar meta.');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const calculateProgress = (current, target) => {
        if (!target || target === 0) return 0;
        const progress = (current / target) * 100;
        return Math.min(Math.round(progress), 100);
    };

    const getStatusLabel = (status) => {
        const labels = {
            'em_progresso': 'Em Progresso',
            'concluida': 'Concluída',
            'cancelada': 'Cancelada'
        };
        return labels[status] || status;
    };

    return {
        goals,
        isLoading,
        error,
        success,
        setSuccess,
        setError,
        createGoal,
        updateGoal,
        deleteGoal,
        fetchGoals,
        calculateProgress,
        getStatusLabel
    };
};
