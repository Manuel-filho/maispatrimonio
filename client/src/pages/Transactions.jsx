import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faFilter, faCalendarAlt, faUndo,
    faSearch, faChartPie, faHistory, faUserCircle,
    faSignOutAlt, faArrowUp, faArrowDown, faExchangeAlt,
    faWallet, faReceipt, faCoins, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Loader from '../components/ui/Loader';
import Notification from '../components/ui/Notification';
import useDashboard from '../hooks/useDashboard';
import { useTransactions } from '../hooks/useTransactions';
import transactionService from '../services/transactionService';

const Transactions = () => {
    const { user, logout, isSidebarCollapsed, setIsSidebarCollapsed, isProfileOpen, setIsProfileOpen } = useDashboard();
    const { cancelTransaction, getStats, isLoading: isActionLoading, error: actionError, success: actionSuccess, clearStatus } = useTransactions();

    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        categories: [],
        total_revenue: 0,
        total_expense: 0,
        net_flow: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [txsData, statsData] = await Promise.all([
                transactionService.getAll(),
                transactionService.getStats({ start_date: dateRange.start, end_date: dateRange.end })
            ]);
            setTransactions(txsData);
            setStats(statsData);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const handleCancel = async (id) => {
        if (window.confirm('Tens a certeza que desejas anular esta transação? O saldo será revertido.')) {
            const result = await cancelTransaction(id);
            if (result.success) {
                fetchData();
            }
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || tx.type === filterType;
        const matchesCategory = filterCategory === '' || tx.category_id?.toString() === filterCategory;
        const matchesDate = tx.date >= dateRange.start && tx.date <= dateRange.end;
        return matchesSearch && matchesType && matchesCategory && matchesDate;
    });

    const isWithin30Min = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffInMinutes = (now - created) / 1000 / 60;
        return diffInMinutes <= 30;
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(val);
    };

    // Helper to get categories by type (backend already sorted and filtered)
    const getCategoriesByType = (type) => {
        return (stats.categories || []).filter(c => c.type === type);
    };

    if (isLoading && transactions.length === 0) return <Loader message="A preparar a tua análise financeira..." />;

    return (
        <div className="dashboard-container">
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

            <main className="main-content">
                <header className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <div className="header-titles">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <Link to="/dashboard" className="back-btn">
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </Link>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Análise de Fluxo e Património</h1>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }} className="hide-on-mobile">
                                Entende exatamente como o teu dinheiro flui: de onde vem e para onde vai.
                            </p>
                        </div>

                        <div className="profile-container">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="profile-btn">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '32px', color: 'var(--border-strong)' }} />
                                )}
                                <span className="hide-on-tablet">{user?.name?.split(' ')[0] || 'Perfil'}</span>
                            </button>
                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                        <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.email}</p>
                                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Património Líquido</p>
                                            <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent)' }}>{formatCurrency(user?.total_net_worth || 0)}</p>
                                        </div>
                                    </div>
                                    <button onClick={logout} className="dropdown-item" style={{ color: '#ef4444' }}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {(actionError || actionSuccess) && (
                    <Notification
                        type={actionError ? 'error' : 'success'}
                        message={actionError || actionSuccess}
                        onClose={clearStatus}
                    />
                )}


                {/* MAIN CYCLE OVERVIEW */}
                <div className="cycle-overview-section" style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="card summary-card gradient-revenue">
                            <p className="card-label">Total Ganhos</p>
                            <h2 className="card-value">{formatCurrency(stats.total_revenue)}</h2>
                            <div className="card-icon"><FontAwesomeIcon icon={faArrowUp} /></div>
                        </div>
                        <div className="card summary-card gradient-expense">
                            <p className="card-label">Total Gastos</p>
                            <h2 className="card-value">{formatCurrency(stats.total_expense)}</h2>
                            <div className="card-icon"><FontAwesomeIcon icon={faArrowDown} /></div>
                        </div>
                        <div className={`card summary-card ${stats.net_flow_status === 'surplus' ? 'gradient-balance-pos' : 'gradient-balance-neg'}`}>
                            <p className="card-label">{stats.net_flow_label || 'Equilíbrio Líquido'}</p>
                            <h2 className="card-value">{formatCurrency(stats.net_flow)}</h2>
                            <div className="card-icon"><FontAwesomeIcon icon={faCoins} /></div>
                        </div>
                    </div>

                    {/* CATEGORY FLOW ANALYSIS */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FontAwesomeIcon icon={faChartPie} style={{ color: 'var(--accent)' }} />
                            Ciclo de Categorias
                        </h3>

                        <div className="flow-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                            {['revenue', 'expense'].map(type => {
                                const categories = getCategoriesByType(type);
                                const typeTotal = type === 'revenue' ? stats.total_revenue : stats.total_expense;

                                return (
                                    <div key={type} className="flow-column">
                                        <h4 style={{
                                            fontSize: '0.85rem',
                                            fontWeight: '800',
                                            color: type === 'revenue' ? '#10b981' : '#f43f5e',
                                            textTransform: 'uppercase',
                                            marginBottom: '1.5rem',
                                            letterSpacing: '0.1em'
                                        }}>
                                            {type === 'revenue' ? 'Principais Fontes' : 'Principais Destinos'}
                                            ({formatCurrency(typeTotal)})
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            {categories.length > 0 ? categories.map(cat => (
                                                <div key={cat.category_id} className="cat-flow-item">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{cat.category?.name}</span>
                                                        <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>{formatCurrency(cat.total)}</span>
                                                    </div>
                                                    <div className="bar-container">
                                                        <div className="bar-fill" style={{ width: `${cat.percentage}%`, background: cat.category?.color || (type === 'revenue' ? '#10b981' : '#f43f5e') }}></div>
                                                    </div>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                        {cat.percentage}% do total {type === 'revenue' ? 'recebido' : 'gasto'}
                                                    </span>
                                                </div>
                                            )) : <p className="empty-text">Sem {type === 'revenue' ? 'receitas' : 'despesas'} no período.</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* TRANSACTIONS TABLE SECTION */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Movimentações do Período</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{filteredTransactions.length} registos encontrados</span>
                    </div>

                    {/* NEW FILTERS BAR DIRECTLY ABOVE TRANSACTIONS */}
                    <div className="filters-top card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div className="search-box" style={{ position: 'relative', flex: '1 1 200px', minWidth: '200px' }}>
                            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Procurar transação..."
                                className="premium-input-field"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', paddingLeft: '2.5rem' }}
                            />
                        </div>

                        <select
                            className="premium-input-field"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{ flex: '0 1 180px' }}
                        >
                            <option value="all">Todos os Tipos</option>
                            <option value="revenue">Receitas</option>
                            <option value="expense">Despesas</option>
                        </select>

                        <select
                            className="premium-input-field"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            style={{ flex: '0 1 200px' }}
                        >
                            <option value="">Todas as Categorias</option>
                            {stats.categories?.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.category?.name}</option>
                            ))}
                        </select>

                        <div className="date-filter-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--surface-hover)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', flex: '0 1 auto' }}>
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'var(--accent)' }} />
                            <input
                                type="date"
                                className="date-input-minimal"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }} />
                            <input
                                type="date"
                                className="date-input-minimal"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="table-wrapper">
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Descrição</th>
                                        <th>Categoria</th>
                                        <th>Conta</th>
                                        <th style={{ textAlign: 'right' }}>Valor</th>
                                        <th style={{ textAlign: 'center' }}>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map(tx => (
                                        <tr key={tx.id} className={tx.cancelled_at ? 'row-cancelled' : ''}>
                                            <td className="td-date">{new Date(tx.date).toLocaleDateString('pt-PT')}</td>
                                            <td className="td-desc">
                                                <div style={{ fontWeight: '600' }}>{tx.description}</div>
                                            </td>
                                            <td>
                                                <span className="badge" style={{ background: `${tx.category?.color}15`, color: tx.category?.color, borderColor: `${tx.category?.color}30` }}>
                                                    {tx.category?.name}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.85rem', opacity: 0.8 }}>{tx.account?.name}</td>
                                            <td className={`td-amount ${tx.type === 'revenue' ? 'positive' : 'negative'}`}>
                                                {tx.type === 'revenue' ? '+' : '-'} {formatCurrency(tx.amount)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {!tx.cancelled_at && isWithin30Min(tx.created_at) && (
                                                    <button onClick={() => handleCancel(tx.id)} className="btn-revert" title="Anular transação" disabled={isActionLoading}>
                                                        <FontAwesomeIcon icon={faUndo} />
                                                    </button>
                                                )}
                                                {tx.cancelled_at && <span className="label-cancelled">Anulada</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredTransactions.length === 0 && (
                                <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Nenhuma transação registada para este intervalo.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .back-btn {
                    width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    background: var(--surface); border: 1px solid var(--border); color: var(--text); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .back-btn:hover { background: var(--surface-hover); transform: scale(1.1); color: var(--accent); }

                .premium-input-field {
                    padding: 0.85rem 1.25rem; border-radius: 12px; border: 1px solid var(--border); background: var(--background); color: var(--text);
                    transition: all 0.2s; font-weight: 500; font-family: inherit; font-size: 0.95rem;
                }
                .premium-input-field:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.1); }
                .premium-input-field:hover { border-color: var(--border-strong); }

                .date-input-minimal {
                    background: transparent; border: none; color: var(--text); font-weight: 700; font-size: 0.9rem; cursor: pointer; outline: none;
                }

                .summary-card { position: relative; padding: 1.5rem; overflow: hidden; height: 160px; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; }
                .card-label { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.7); margin: 0 0 0.5rem 0; width: 100%; text-align: left; }
                .card-value { font-size: 1.6rem; font-weight: 900; color: white; margin: 0; width: 100%; text-align: left; word-break: break-word; line-height: 1.1; }
                .card-icon { position: absolute; right: 1.5rem; bottom: 1.5rem; font-size: 3.5rem; opacity: 0.15; color: white; }

                .gradient-revenue { background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; }
                .gradient-expense { background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); border: none; }
                .gradient-balance-pos { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: none; }
                .gradient-balance-neg { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: none; }

                .cat-flow-item { padding: 0.5rem 0; }
                .bar-container { height: 8px; width: 100%; background: var(--surface-hover); border-radius: 10px; overflow: hidden; margin-bottom: 0.4rem; }
                .bar-fill { height: 100%; border-radius: 10px; transition: width 1.2s cubic-bezier(0.19, 1, 0.22, 1); }

                .table-wrapper { width: 100%; overflow-x: auto; }
                .transactions-table { width: 100%; border-collapse: separate; border-spacing: 0; }
                .transactions-table th { padding: 1.25rem 1.5rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); font-weight: 800; border-bottom: 2px solid var(--border); }
                .transactions-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); transition: all 0.2s; vertical-align: middle; }
                .transactions-table tr:hover td { background: var(--surface-hover); }
                .transactions-table tr.row-cancelled td { opacity: 0.5; }

                .badge { padding: 0.4rem 0.9rem; border-radius: 10px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; border: 1px solid transparent; }
                .td-amount { text-align: right; font-weight: 800; font-size: 1.05rem; }
                .positive { color: #10b981; }
                .negative { color: #f43f5e; }

                .btn-revert { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border); background: none; color: var(--text-muted); transition: all 0.3s; }
                .btn-revert:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); transform: rotate(-45deg); }
                .label-cancelled { background: #f43f5e15; color: #f43f5e; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; }

                .empty-text { font-style: italic; color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem; }

                @media (max-width: 1024px) {
                    .flow-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
                    .summary-card { padding: 1.2rem; height: auto; min-height: 130px; }
                    .card-value { font-size: 1.35rem; }
                }
                
                @media (max-width: 768px) {
                    .filters-top { flex-direction: column; align-items: stretch; gap: 1rem; }
                    .filters-top > * { width: 100% !important; flex: none !important; }
                    .date-filter-group { justify-content: space-between; }
                }
            `}</style>
        </div>
    );
};

export default Transactions;
