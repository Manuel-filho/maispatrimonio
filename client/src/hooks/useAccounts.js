import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useDashboard } from './useDashboard';

export const useAccounts = () => {
    const { formatCurrency, user } = useDashboard();
    const [accounts, setAccounts] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [deletingAccount, setDeletingAccount] = useState(null);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        type: 'cash',
        balance: '',
        currency_id: ''
    });

    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/accounts');
            setAccounts(response.data);
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar contas:', err);
            setError('Não foi possível carregar as contas.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCurrencies = useCallback(async () => {
        try {
            const response = await api.get('/currencies');
            setCurrencies(response.data);
        } catch (err) {
            console.error('Erro ao carregar moedas:', err);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
        fetchCurrencies();
    }, [fetchAccounts, fetchCurrencies]);

    const handleAddClick = () => {
        setEditingAccount(null);
        setFormData({
            name: '',
            type: 'cash',
            balance: '',
            currency_id: user?.preferred_currency?.id || ''
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (account) => {
        setEditingAccount(account);
        setFormData({
            name: account.name,
            type: account.type,
            balance: account.balance,
            currency_id: account.currency_id
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (account) => {
        setDeletingAccount(account);
        setDeleteConfirmName('');
        setError(null);
        setIsDeleteModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);

        try {
            if (editingAccount) {
                await api.put(`/accounts/${editingAccount.id}`, formData);
            } else {
                await api.post('/accounts', formData);
            }
            await fetchAccounts();
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar conta. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingAccount) return;
        setIsLoading(true);

        try {
            await api.delete(`/accounts/${deletingAccount.id}`);
            await fetchAccounts();
            setIsDeleteModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao eliminar conta.');
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        totalLiquidity: accounts.reduce((acc, curr) => acc + parseFloat(curr.balance), 0),
        accountCount: accounts.length,
        mainAccount: accounts.sort((a, b) => b.balance - a.balance)[0]?.name || 'Nenhuma'
    };

    return {
        accounts,
        currencies,
        isLoading,
        error,
        stats,
        isModalOpen,
        setIsModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        editingAccount,
        deletingAccount,
        deleteConfirmName,
        setDeleteConfirmName,
        formData,
        formatCurrency,
        handleAddClick,
        handleEditClick,
        handleDeleteClick,
        handleFormChange,
        handleSaveSubmit,
        handleConfirmDelete
    };
};

export default useAccounts;
