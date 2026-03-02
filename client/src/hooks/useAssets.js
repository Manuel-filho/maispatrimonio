import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useDashboard } from './useDashboard';

export const useAssets = () => {
    const { formatCurrency, user } = useDashboard();
    const [assets, setAssets] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [deletingAsset, setDeletingAsset] = useState(null);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        type: 'real_estate',
        estimated_value: '',
        currency_id: ''
    });

    const fetchAssets = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/assets');
            setAssets(response.data);
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar ativos:', err);
            setError('Não foi possível carregar os ativos.');
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
        fetchAssets();
        fetchCurrencies();
    }, [fetchAssets, fetchCurrencies]);

    // Ensure currency_id is set once currencies are loaded if it's still empty
    useEffect(() => {
        if (!isModalOpen && !editingAsset && currencies.length > 0 && formData.currency_id === '') {
            setFormData(prev => ({
                ...prev,
                currency_id: user?.preferred_currency?.id || currencies[0].id
            }));
        }
    }, [currencies, user, isModalOpen, editingAsset, formData.currency_id]);

    const handleAddClick = () => {
        setEditingAsset(null);
        const defaultCurrencyId = user?.preferred_currency?.id || (currencies.length > 0 ? currencies[0].id : '');
        setFormData({
            name: '',
            type: 'real_estate',
            estimated_value: '',
            currency_id: defaultCurrencyId
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (asset) => {
        setEditingAsset(asset);
        setFormData({
            name: asset.name,
            type: asset.type,
            estimated_value: asset.estimated_value,
            currency_id: asset.currency_id
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (asset) => {
        setDeletingAsset(asset);
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
            if (editingAsset) {
                await api.put(`/assets/${editingAsset.id}`, formData);
            } else {
                await api.post('/assets', formData);
            }
            await fetchAssets();
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar ativo. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingAsset) return;
        setIsLoading(true);

        try {
            await api.delete(`/assets/${deletingAsset.id}`);
            await fetchAssets();
            setIsDeleteModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao eliminar ativo.');
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        totalAssets: assets.reduce((acc, curr) => acc + parseFloat(curr.estimated_value), 0),
        assetCount: assets.length,
        mostValuable: assets.sort((a, b) => b.estimated_value - a.estimated_value)[0]?.name || 'Nenhum'
    };

    return {
        assets,
        currencies,
        isLoading,
        error,
        stats,
        isModalOpen,
        setIsModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        editingAsset,
        deletingAsset,
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

export default useAssets;
