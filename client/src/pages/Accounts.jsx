import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useDashboard } from '../hooks/useDashboard';
import { useAccounts } from '../hooks/useAccounts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faPen,
    faTrash,
    faWallet,
    faCreditCard,
    faPiggyBank,
    faBuildingColumns,
    faUserCircle,
    faSignOutAlt,
    faTriangleExclamation,
    faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/ui/Loader';
import CardSizeSelector from '../components/ui/CardSizeSelector';
import '../styles/design-system.css';

const Accounts = () => {
    const {
        user,
        logout,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isProfileOpen,
        setIsProfileOpen
    } = useDashboard();

    const {
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
    } = useAccounts();

    const [cardSize, setCardSize] = useLocalStorage('accounts_card_size', 320);

    const getAccountIcon = (type) => {
        switch (type) {
            case 'cash': return faWallet;
            case 'current': return faCreditCard;
            case 'savings': return faPiggyBank;
            case 'investment': return faBuildingColumns;
            default: return faWallet;
        }
    };

    const getAccountTypeName = (type) => {
        switch (type) {
            case 'cash': return 'Numerário';
            case 'current': return 'Conta Corrente';
            case 'savings': return 'Poupança';
            case 'investment': return 'Investimento';
            default: return 'Outros';
        }
    };

    if (isLoading && accounts.length === 0) {
        return <Loader message="A carregar as suas contas..." />;
    }

    return (
        <div className="dashboard-container">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-titles">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Contas & Liquidez
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                Acompanhe o seu dinheiro disponível em tempo real.
                            </p>
                        </div>

                        <div className="profile-container">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="profile-btn">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '32px', color: 'var(--border-strong)' }} />
                                )}
                                <span className="hide-on-tablet">
                                    {user?.name ? (user.name.split(' ').length > 1 ? `${user.name.split(' ')[0]} ${user.name.split(' ').pop()}` : user.name) : 'Perfil'}
                                </span>
                            </button>

                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                        <p style={{ fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'Usuário'}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</p>
                                    </div>
                                    <button onClick={logout} className="dropdown-item" style={{ color: '#ef4444' }}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="dashboard-grid" style={{ display: 'block' }}>
                    {/* Summary Widgets */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2.5rem'
                    }}>
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Liquidez Total
                            </p>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
                                {formatCurrency(stats.totalLiquidity)}
                            </h2>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Nº de Contas
                            </p>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
                                {stats.accountCount}
                            </h2>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Conta Principal
                            </p>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {stats.mainAccount}
                            </h2>
                        </div>
                    </div>

                    {/* Actions Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        gap: '1.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            />
                            <input
                                type="text"
                                placeholder="Procurar conta..."
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>

                        <div className="quick-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <CardSizeSelector value={cardSize} onChange={setCardSize} />
                            <button
                                className="btn btn-primary"
                                onClick={handleAddClick}
                                style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Nova Conta
                            </button>
                        </div>
                    </div>


                    {/* Accounts Grid */}
                    <div className="accounts-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
                        justifyContent: 'center',
                        gap: '1.5rem'
                    }}>
                        {accounts.map(account => (
                            <div key={account.id} className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                                        color: 'var(--accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.1rem'
                                    }}>
                                        <FontAwesomeIcon icon={getAccountIcon(account.type)} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEditClick(account)} className="action-btn edit" title="Editar">
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(account)} className="action-btn delete" title="Eliminar">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.25rem' }}>{account.name}</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                                        {getAccountTypeName(account.type)}
                                    </span>
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '700' }}>SALDO DISPONÍVEL</p>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>
                                        {formatCurrency(account.balance)}
                                    </h2>
                                </div>
                            </div>
                        ))}

                        {accounts.length === 0 && !isLoading && (
                            <div className="card" style={{ padding: '5rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                                <div style={{ fontSize: '4rem', color: 'var(--border-strong)', marginBottom: '1.5rem', opacity: 0.3 }}>
                                    <FontAwesomeIcon icon={faWallet} />
                                </div>
                                <h3 style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Não tens nenhuma conta registada.</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Regista a tua carteira ou contas bancárias para gestão.</p>
                                <button className="btn btn-primary" onClick={handleAddClick}>
                                    Adicionar Primeira Conta
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* MODALS */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="card modal-content">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
                            {editingAccount ? 'Editar Conta' : 'Nova Conta'}
                        </h2>

                        {error && (
                            <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                <span style={{ fontSize: '0.85rem' }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSaveSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Nome da Conta</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Ex: Conta BFA, Carteira..."
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipo de Conta</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="cash">Numerário (Dinheiro Vivo)</option>
                                    <option value="current">Conta Corrente</option>
                                    <option value="savings">Poupança</option>
                                    <option value="investment">Investimento (Corretora)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Moeda</label>
                                <select
                                    name="currency_id"
                                    value={formData.currency_id}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    style={{ appearance: 'none' }}
                                >
                                    {currencies.map(currency => (
                                        <option key={currency.id} value={currency.id}>
                                            {currency.name} ({currency.symbol})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Saldo Inicial</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="balance"
                                        value={formData.balance}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="0.00"
                                        className="form-input"
                                        style={{ paddingRight: '3rem' }}
                                    />
                                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: 'var(--text-muted)' }}>
                                        {currencies.find(c => c.id == formData.currency_id)?.symbol || 'Kz'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ flex: 1, backgroundColor: 'var(--border)' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'A Guardar...' : 'Guardar Conta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && deletingAccount && (
                <div className="modal-overlay">
                    <div className="card modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            margin: '0 auto 1.5rem'
                        }}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Eliminar Conta?</h2>

                        {error && (
                            <div className="error-alert" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                <span style={{ fontSize: '0.85rem' }}>{error}</span>
                            </div>
                        )}

                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Confirma escrevendo <strong>{deletingAccount?.name}</strong> abaixo:
                        </p>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <input
                                type="text"
                                className="form-input"
                                value={deleteConfirmName}
                                onChange={(e) => setDeleteConfirmName(e.target.value)}
                                placeholder="Digita o nome..."
                                style={{ textAlign: 'center', borderStyle: 'dashed' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn" onClick={() => setIsDeleteModalOpen(false)} style={{ flex: 1, backgroundColor: 'var(--border)' }}>
                                Manter
                            </button>
                            <button
                                className="btn"
                                onClick={handleConfirmDelete}
                                style={{
                                    flex: 1,
                                    backgroundColor: deleteConfirmName === deletingAccount?.name ? '#ef4444' : 'var(--border)',
                                    color: deleteConfirmName === deletingAccount?.name ? 'white' : 'var(--text-muted)',
                                    cursor: deleteConfirmName === deletingAccount?.name ? 'pointer' : 'not-allowed'
                                }}
                                disabled={isLoading || deleteConfirmName !== deletingAccount?.name}
                            >
                                {isLoading ? 'A eliminar...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .spin-loader {
                    width: 40px;
                    height: 40px;
                    border: 3px solid var(--border);
                    border-top-color: var(--accent);
                    borderRadius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .dashboard-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: var(--background);
                }

                .main-content {
                    flex: 1;
                    padding: 2.5rem 3rem;
                    animation: fade-in 0.6s ease-out;
                }

                .dashboard-header {
                    margin-bottom: 3rem;
                    display: flex;
                    justify-content: space-between;
                }

                .header-titles {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-label {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .form-input {
                    width: 100%;
                    padding: 0.85rem 1rem;
                    background: var(--surface-hover);
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    color: var(--text);
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--accent);
                    background: var(--surface);
                }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 2rem;
                }

                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    background: var(--surface);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    transition: all 0.2s;
                }

                .action-btn:hover { background: var(--surface-hover); transform: translateY(-2px); }
                .action-btn.edit { color: var(--accent); }
                .action-btn.delete { color: #ef4444; }

                .error-alert {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid #ef4444;
                    color: #ef4444;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .dashboard-container { flex-direction: column; }
                    .main-content { padding: 1.5rem 1.5rem 100px 1.5rem; }
                    .dashboard-header { margin-bottom: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default Accounts;
