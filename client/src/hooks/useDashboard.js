import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

export const useDashboard = () => {
    const { user, logout } = useAuth();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalNetWorth: 0,
        maxNetWorth: 0,
        liquidity: 0,
        assetsValue: 0,
        recentTransactions: [],
        accounts: [],
        categories: [],
        currency: 'Kz',
        history: []
    });

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [userRes, transRes, accRes, catRes, historyRes] = await Promise.all([
                api.get('/auth/me'),
                api.get('/transactions'),
                api.get('/accounts'),
                api.get('/categories'),
                api.get('/transactions/history?days=7')
            ]);

            const userData = userRes.data;
            const transactions = transRes.data;
            const accounts = accRes.data;
            const categories = catRes.data;
            const history = historyRes.data;

            setDashboardData({
                totalNetWorth: parseFloat(userData.total_net_worth || 0),
                maxNetWorth: parseFloat(userData.max_net_worth || 0),
                liquidity: parseFloat(userData.liquidity || 0),
                assetsValue: parseFloat(userData.assets_value || 0),
                recentTransactions: transactions || [],
                accounts: accounts || [],
                categories: categories || [],
                currency: userData.preferred_currency?.symbol || 'Kz',
                history: history || []
            });
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formattedData = {
        totalNetWorth: dashboardData.totalNetWorth,
        maxNetWorth: dashboardData.maxNetWorth,
        liquidity: dashboardData.liquidity,
        assets: dashboardData.assetsValue,
        currency: dashboardData.currency,
        accounts: dashboardData.accounts,
        categories: dashboardData.categories,
        history: dashboardData.history,
        recentTransactions: dashboardData.recentTransactions.slice(0, 5).map(t => ({
            id: t.id,
            description: t.description,
            amount: parseFloat(t.amount),
            type: t.type === 'revenue' ? 'revenue' : (t.type === 'expense' ? 'expense' : 'transfer'),
            date: new Date(t.date).toLocaleDateString('pt-PT'),
            category: t.category?.name || 'Geral'
        }))
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' })
            .format(value || 0)
            .replace('AOA', formattedData.currency)
            .trim();
    };

    return {
        user,
        logout,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isProfileOpen,
        setIsProfileOpen,
        isLoading,
        mockData: formattedData,
        formatCurrency,
        refreshData: fetchDashboardData
    };
};

export default useDashboard;
