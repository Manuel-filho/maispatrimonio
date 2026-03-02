import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useDashboard } from '../hooks/useDashboard';
import { useAssets } from '../hooks/useAssets';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faPen,
    faTrash,
    faBuilding,
    faCar,
    faGem,
    faBriefcase,
    faUserCircle,
    faSignOutAlt,
    faTriangleExclamation,
    faMagnifyingGlass,
    faHouse
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/ui/Loader';
import CardSizeSelector from '../components/ui/CardSizeSelector';
import '../styles/design-system.css';

const Assets = () => {
    const {
        user,
        logout,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isProfileOpen,
        setIsProfileOpen
    } = useDashboard();

    const {
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
    } = useAssets();

    const [cardSize, setCardSize] = useLocalStorage('assets_card_size', 320);

    const getAssetIcon = (type) => {
        switch (type) {
            case 'real_estate': return faHouse;
            case 'vehicle': return faCar;
            case 'jewelry': return faGem;
            case 'business': return faBriefcase;
            case 'land': return faBuilding;
            default: return faBuilding;
        }
    };

    const getAssetTypeName = (type) => {
        switch (type) {
            case 'real_estate': return 'Imóvel';
            case 'vehicle': return 'Veículo';
            case 'jewelry': return 'Joias/Metais Preciosos';
            case 'business': return 'Negócio/Empresa';
            case 'land': return 'Terreno';
            default: return 'Outro Ativo';
        }
    };

    if (isLoading && assets.length === 0) {
        return <Loader message="A carregar o seu património..." />;
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
                                Património Ativo
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                Gestão de bens imobiliários, veículos e outros ativos de valor.
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
                                    {user?.name ? (user.name.split(' ').length > 0 ? user.name.split(' ')[0] : user.name) : 'Perfil'}
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
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Valor Total Estimado
                            </p>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
                                {formatCurrency(stats.totalAssets)}
                            </h2>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Nº de Ativos
                            </p>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
                                {stats.assetCount}
                            </h2>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Ativo Mais Valioso
                            </p>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {stats.mostValuable}
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
                                placeholder="Procurar ativo..."
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
                                <FontAwesomeIcon icon={faPlus} /> Novo Ativo
                            </button>
                        </div>
                    </div>

                    {/* Assets Grid */}
                    <div className="assets-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
                        justifyContent: 'center',
                        gap: '1.5rem'
                    }}>
                        {assets.map(asset => (
                            <div key={asset.id} className="card" style={{ padding: '1.5rem', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                        color: '#8b5cf6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.1rem'
                                    }}>
                                        <FontAwesomeIcon icon={getAssetIcon(asset.type)} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEditClick(asset)} className="action-btn edit" title="Editar">
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(asset)} className="action-btn delete" title="Eliminar">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.25rem' }}>{asset.name}</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                                        {getAssetTypeName(asset.type)}
                                    </span>
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '700' }}>VALOR ESTIMADO</p>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>
                                        {formatCurrency(asset.estimated_value)}
                                    </h2>
                                </div>
                            </div>
                        ))}

                        {assets.length === 0 && !isLoading && (
                            <div className="card" style={{ padding: '5rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                                <div style={{ fontSize: '4rem', color: 'var(--border-strong)', marginBottom: '1.5rem', opacity: 0.3 }}>
                                    <FontAwesomeIcon icon={faHouse} />
                                </div>
                                <h3 style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Ainda não registaste nenhum ativo.</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Começa a registar os teus imóveis, veículos e outros bens.</p>
                                <button className="btn btn-primary" onClick={handleAddClick}>
                                    Adicionar Primeiro Ativo
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
                            {editingAsset ? 'Editar Ativo' : 'Novo Ativo'}
                        </h2>

                        {error && (
                            <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                <span style={{ fontSize: '0.85rem' }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSaveSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Nome do Ativo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Ex: Apartamento T3, Toyota Hilux..."
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipo de Ativo</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="real_estate">Imóvel / Habitação</option>
                                    <option value="vehicle">Veículo (Carro, Moto...)</option>
                                    <option value="land">Terreno / Lote</option>
                                    <option value="business">Negócio / Participação Social</option>
                                    <option value="jewelry">Joias / Metais Preciosos</option>
                                    <option value="other">Outro Bem de Valor</option>
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
                                <label className="form-label">Valor Estimado</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="estimated_value"
                                        value={formData.estimated_value}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="0.00"
                                        className="form-input"
                                        style={{ paddingRight: '4rem' }}
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
                                    {isLoading ? 'A Guardar...' : 'Guardar Ativo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && deletingAsset && (
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
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Eliminar Ativo?</h2>

                        {error && (
                            <div className="error-alert" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                <span style={{ fontSize: '0.85rem' }}>{error}</span>
                            </div>
                        )}

                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Confirma escrevendo <strong>{deletingAsset?.name}</strong> abaixo:
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
                                    backgroundColor: deleteConfirmName === deletingAsset?.name ? '#ef4444' : 'var(--border)',
                                    color: deleteConfirmName === deletingAsset?.name ? 'white' : 'var(--text-muted)',
                                    cursor: deleteConfirmName === deletingAsset?.name ? 'pointer' : 'not-allowed'
                                }}
                                disabled={isLoading || deleteConfirmName !== deletingAsset?.name}
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

export default Assets;
