import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'revenue', 'expense'

    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
        description: ''
    });

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar categorias:', err);
            setError('Não foi possível carregar as categorias.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddClick = () => {
        setEditingCategory(null);
        setFormData({ name: '', type: 'expense', description: '' });
        setError(null); // Clear error
        setIsModifyModalOpen(true);
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            type: category.type,
            description: category.description || ''
        });
        setError(null); // Clear error
        setIsModifyModalOpen(true);
    };

    const handleDeleteClick = (category) => {
        setDeletingCategory(category);
        setDeleteConfirmName(''); // Reset confirmation on open
        setError(null); // Clear error
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
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            await fetchCategories();
            setIsModifyModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar categoria. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingCategory) return;
        setIsLoading(true);

        try {
            await api.delete(`/categories/${deletingCategory.id}`);
            await fetchCategories();
            setIsDeleteModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao eliminar categoria.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCategories = categories.filter(cat => {
        if (filter === 'all') return true;
        return cat.type === filter;
    });

    return {
        categories: filteredCategories,
        isLoading,
        error,
        filter,
        setFilter,
        isModifyModalOpen,
        setIsModifyModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        editingCategory,
        deletingCategory,
        deleteConfirmName,
        setDeleteConfirmName,
        formData,
        handleAddClick,
        handleEditClick,
        handleDeleteClick,
        handleFormChange,
        handleSaveSubmit,
        handleConfirmDelete
    };
};

export default useCategories;
