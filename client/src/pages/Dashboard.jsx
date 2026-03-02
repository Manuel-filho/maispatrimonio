import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useDashboard } from '../hooks/useDashboard';
import { useTransactions } from '../hooks/useTransactions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowTrendUp,
    faArrowTrendDown,
    faBuildingColumns,
    faWallet,
    faPlus,
    faMinus,
    faArrowRightArrowLeft,
    faTrophy,
    faChartPie,
    faSignOutAlt,
    faUserCircle,
    faTags,
    faGear
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import Loader from '../components/ui/Loader';
import Notification from '../components/ui/Notification';
import '../styles/design-system.css';

const Dashboard = () => {
    const {
        user,
        logout,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isProfileOpen,
        setIsProfileOpen,
        isLoading,
        mockData,
        formatCurrency,
        refreshData
    } = useDashboard();

    const {
        createTransaction,
        performTransfer,
        isLoading: isActionLoading,
        error: actionError,
        success: actionSuccess,
        clearStatus
    } = useTransactions();

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'income', 'expense', 'transfer'
    const [formData, setFormData] = useState({
        account_id: '',
        category_id: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        from_account_id: '',
        to_account_id: ''
    });

    const [notification, setNotification] = useState(null);

    const handleOpenModal = (type) => {
        clearStatus();
        setFormData({
            account_id: mockData.accounts[0]?.id || '',
            category_id: '',
            description: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            from_account_id: mockData.accounts[0]?.id || '',
            to_account_id: mockData.accounts[1]?.id || ''
        });
        setActiveModal(type);
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        clearStatus();
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;

        // Frontend Validations
        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            setNotification({ message: 'Por favor, insira um valor válido.', type: 'warning' });
            return;
        }

        if (activeModal === 'transfer') {
            if (formData.from_account_id === formData.to_account_id) {
                setNotification({ message: 'A conta de origem e destino não podem ser a mesma.', type: 'warning' });
                return;
            }

            const fromAccount = mockData.accounts.find(a => a.id === parseInt(formData.from_account_id));
            if (fromAccount && fromAccount.balance < amount) {
                setNotification({ message: `Saldo insuficiente na conta ${fromAccount.name}.`, type: 'error' });
                return;
            }

            result = await performTransfer({
                from_account_id: formData.from_account_id,
                to_account_id: formData.to_account_id,
                amount: formData.amount,
                date: formData.date
            });
        } else {
            if (activeModal === 'expense') {
                const account = mockData.accounts.find(a => a.id === parseInt(formData.account_id));
                if (account && account.balance < amount) {
                    setNotification({ message: `Saldo insuficiente na conta ${account.name} para esta despesa.`, type: 'error' });
                    return;
                }
            }

            result = await createTransaction({
                account_id: formData.account_id,
                category_id: formData.category_id,
                description: formData.description,
                amount: formData.amount,
                type: activeModal === 'income' ? 'revenue' : 'expense',
                date: formData.date
            });
        }

        if (result.success) {
            refreshData();
            setTimeout(() => handleCloseModal(), 1500);
        }
    };

    const getCountDuration = (value) => {
        const absValue = Math.abs(value);
        if (absValue > 1000000) return 3;
        if (absValue > 100000) return 2.5;
        if (absValue > 10000) return 2.2;
        return 2;
    };

    if (isLoading) {
        return <Loader message="A sincronizar o seu património..." />;
    }

    return (
        <div className="dashboard-container">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* MAIN CONTENT */}
            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-titles">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Visão Geral</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }} className="hide-on-mobile">Acompanhe a evolução do seu património e liquidez.</p>
                        </div>

                        <div className="profile-container">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="profile-btn">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '36px', color: 'var(--border-strong)' }} />
                                )}
                                <span className="hide-on-tablet" style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                    {user?.name ? (user.name.split(' ').length > 1 ? `${user.name.split(' ')[0]} ${user.name.split(' ').pop()}` : user.name) : 'Perfil'}
                                </span>
                            </button>

                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                        <p style={{ fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {user?.name || 'Usuário'}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {user?.email || 'email@exemplo.com'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => logout()}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '0.75rem 1rem',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            color: '#ef4444', fontWeight: '600', cursor: 'pointer',
                                            background: 'none', border: 'none'
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Terminar Sessão
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="header-actions">
                        <div className="quick-actions-btns">
                            <button
                                onClick={() => handleOpenModal('income')}
                                className="btn btn-primary" title="Nova Receita" style={{ gap: '0.5rem', backgroundColor: '#10b981', flex: 1, minWidth: 'fit-content' }}>
                                <FontAwesomeIcon icon={faPlus} /> <span className="mobile-action-text">Receita</span>
                            </button>
                            <button
                                onClick={() => handleOpenModal('expense')}
                                className="btn btn-primary" title="Nova Despesa" style={{ gap: '0.5rem', backgroundColor: '#ef4444', flex: 1, minWidth: 'fit-content' }}>
                                <FontAwesomeIcon icon={faMinus} /> <span className="mobile-action-text">Despesa</span>
                            </button>
                            <button
                                onClick={() => handleOpenModal('transfer')}
                                className="btn btn-outline" title="Transferência" style={{ gap: '0.5rem', flex: 1, minWidth: 'fit-content' }}>
                                <FontAwesomeIcon icon={faArrowRightArrowLeft} /> <span className="mobile-action-text">Transferir</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* TOP METRICS GRID */}
                <div className="metrics-grid mb-8">
                    <div className="card metric-card premium-card" style={{ gridColumn: 'span 2', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                Património Líquido Total
                            </p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ fontSize: '1.75rem', opacity: 0.8 }}>{mockData.currency}</span>
                                <CountUp end={mockData.totalNetWorth} duration={getCountDuration(mockData.totalNetWorth)} separator=" " decimal="," decimals={2} />
                            </h2>
                            <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', color: 'white', fontWeight: '600' }}>
                                <FontAwesomeIcon icon={faArrowTrendUp} /> +2.4% este mês
                            </div>
                        </div>
                        <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', fontSize: '12rem', color: 'rgba(255,255,255,0.05)', zIndex: 1, transform: 'rotate(-15deg)' }}>
                            <FontAwesomeIcon icon={faTrophy} />
                        </div>
                    </div>

                    <div className="card metric-card">
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <FontAwesomeIcon icon={faTrophy} size="lg" />
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                            Recorde Histórico
                        </p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{mockData.currency}</span>
                            <CountUp end={mockData.maxNetWorth} duration={getCountDuration(mockData.maxNetWorth)} separator=" " decimal="," decimals={2} />
                        </h3>
                    </div>

                    <div className="card metric-card">
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--surface-hover)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <FontAwesomeIcon icon={faChartPie} size="lg" />
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                            Distribuição
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Liquidez</span>
                                <span style={{ fontWeight: '600' }}>{mockData.totalNetWorth > 0 ? ((mockData.liquidity / mockData.totalNetWorth) * 100).toFixed(1) : 0}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Ativos Imob.</span>
                                <span style={{ fontWeight: '600' }}>{mockData.totalNetWorth > 0 ? ((mockData.assets / mockData.totalNetWorth) * 100).toFixed(1) : 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECONDARY METRICS */}
                <div className="secondary-metrics-grid mb-8">
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                            <FontAwesomeIcon icon={faWallet} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                Liquidez Imediata (Contas)
                            </p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{mockData.currency}</span>
                                <CountUp end={mockData.liquidity} duration={getCountDuration(mockData.liquidity)} separator=" " decimal="," decimals={2} />
                            </h3>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                            <FontAwesomeIcon icon={faBuildingColumns} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                Ativos Imobilizados
                            </p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{mockData.currency}</span>
                                <CountUp end={mockData.assets} duration={getCountDuration(mockData.assets)} separator=" " decimal="," decimals={2} />
                            </h3>
                        </div>
                    </div>
                </div>

                {/* RECENT TRANSACTIONS */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Transações Recentes</h3>
                        <Link to="/transactions" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            Ver Analítica <FontAwesomeIcon icon={faChartPie} />
                        </Link>
                    </div>

                    <div className="card" style={{ padding: '0' }}>
                        {mockData.recentTransactions.length > 0 ? mockData.recentTransactions.map((tx, index) => (
                            <div key={tx.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem 2rem',
                                borderBottom: index < mockData.recentTransactions.length - 1 ? '1px solid var(--border)' : 'none'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: tx.type === 'revenue' ? 'rgba(16, 185, 129, 0.1)' : tx.type === 'expense' ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-hover)',
                                        color: tx.type === 'revenue' ? '#10b981' : tx.type === 'expense' ? '#ef4444' : 'var(--text-muted)'
                                    }}>
                                        <FontAwesomeIcon icon={tx.type === 'revenue' ? faArrowTrendUp : tx.type === 'expense' ? faArrowTrendDown : faArrowRightArrowLeft} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', marginBottom: '0.1rem' }}>{tx.description}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <div style={{
                                    fontWeight: '700', fontSize: '1.1rem',
                                    color: tx.type === 'revenue' ? '#10b981' : tx.type === 'expense' ? '#ef4444' : 'var(--text)'
                                }}>
                                    {tx.type === 'expense' ? '-' : tx.type === 'revenue' ? '+' : ''}
                                    {formatCurrency(tx.amount)}
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Nenhuma transação recente encontrada.
                            </div>
                        )}
                    </div>
                </div>

                {/* MODALS */}
                {activeModal && (
                    <div className="modal-overlay">
                        <div className="modal-content premium-card-modal">
                            <div className="modal-header">
                                <h3 style={{ margin: 0 }}>
                                    {activeModal === 'income' && 'Registar Nova Receita'}
                                    {activeModal === 'expense' && 'Registar Nova Despesa'}
                                    {activeModal === 'transfer' && 'Realizar Transferência'}
                                </h3>
                                <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="premium-form">
                                {actionError && <div className="alert alert-error">{actionError}</div>}
                                {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

                                {activeModal === 'transfer' ? (
                                    <>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Conta de Origem</label>
                                                <select
                                                    name="from_account_id"
                                                    value={formData.from_account_id}
                                                    onChange={handleFormChange}
                                                    required
                                                >
                                                    {mockData.accounts.map(acc => (
                                                        <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.balance)})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Conta de Destino</label>
                                                <select
                                                    name="to_account_id"
                                                    value={formData.to_account_id}
                                                    onChange={handleFormChange}
                                                    required
                                                >
                                                    {mockData.accounts.map(acc => (
                                                        <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.balance)})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label>Descrição</label>
                                            <input
                                                type="text"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleFormChange}
                                                placeholder="Ex: Salário, Supermercado..."
                                                required
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Conta</label>
                                                <select
                                                    name="account_id"
                                                    value={formData.account_id}
                                                    onChange={handleFormChange}
                                                    required
                                                >
                                                    {mockData.accounts.map(acc => (
                                                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Categoria</label>
                                                <select
                                                    name="category_id"
                                                    value={formData.category_id}
                                                    onChange={handleFormChange}
                                                    required
                                                >
                                                    <option value="">Selecionar...</option>
                                                    {mockData.categories
                                                        .filter(cat => cat.type === (activeModal === 'income' ? 'revenue' : 'expense'))
                                                        .map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Valor</label>
                                        <div className="amount-input-wrapper">
                                            <span className="currency-prefix">{mockData.currency}</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleFormChange}
                                                placeholder="0,00"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Data</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary" disabled={isActionLoading}>
                                        {isActionLoading ? 'A processar...' : 'Confirmar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .quick-actions-btns {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }

                .secondary-metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }
                
                @media (max-width: 900px) {
                    .secondary-metrics-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .metric-card {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .premium-card {
                    background: linear-gradient(135deg, var(--accent) 0%, #4c1d95 100%);
                    box-shadow: 0 10px 25px -5px rgba(var(--accent-rgb), 0.4);
                    border: none;
                }

                [data-theme='dark'] .premium-card {
                    background: linear-gradient(135deg, #4c1d95 0%, #2e1065 100%);
                }

                @media (max-width: 1280px) {
                    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
                    .premium-card { grid-column: span 2; }
                }

                @media (max-width: 1024px) {
                    .hide-on-tablet { display: none !important; }
                }

                @media (max-width: 768px) {
                    .dashboard-container { flex-direction: column; }

                    .main-content {
                        margin-left: 0 !important;
                        padding: 1rem 1rem 100px 1rem !important;
                    }

                    .dashboard-header {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                        margin-bottom: 1.5rem;
                    }

                    .header-titles {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: relative;
                        width: 100%;
                    }

                    .header-actions {
                        width: 100%;
                        flex-direction: column;
                        align-items: stretch;
                        gap: 0.75rem;
                    }

                    .quick-actions-btns {
                        width: 100%;
                        display: flex;
                        gap: 0.5rem;
                    }

                    .quick-actions-btns .btn {
                        padding: 0.6rem 0.25rem;
                        font-size: 0.75rem;
                        justify-content: center;
                        flex: 1;
                    }

                    .profile-container {
                        position: relative !important;
                        margin-left: 1rem;
                    }

                    .mobile-action-text { display: block; font-size: 0.7rem; }
                    
                    .metrics-grid { grid-template-columns: 1fr; }
                    .premium-card { grid-column: span 1; }
                }

                @media (min-width: 769px) {
                    .mobile-action-text { display: none; }
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fade-in 0.3s ease-out;
                }

                .premium-card-modal {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    width: 100%;
                    max-width: 500px;
                    padding: 2rem;
                    box-shadow: var(--shadow-2xl);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .modal-header h3 {
                    font-size: 1.25rem;
                    fontWeight: 800;
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-muted);
                    transition: color 0.2s;
                }

                .close-btn:hover { color: var(--text); }

                .premium-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    letter-spacing: 0.05em;
                }

                .premium-form input, .premium-form select {
                    background: var(--background);
                    border: 1px solid var(--border);
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    color: var(--text);
                    font-size: 0.95rem;
                    transition: all 0.2s;
                }

                .premium-form input:focus, .premium-form select:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
                }

                .amount-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .currency-prefix {
                    position: absolute;
                    left: 1rem;
                    font-weight: 700;
                    color: var(--text-muted);
                }

                .amount-input-wrapper input { padding-left: 2.5rem; width: 100%; font-weight: 700; font-size: 1.1rem; }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .alert {
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .alert-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
                .alert-success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
            `}</style>
        </div>
    );
};

export default Dashboard;
