import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useDashboard } from '../hooks/useDashboard';
import { useCategories } from '../hooks/useCategories';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faPen,
    faTrash,
    faArrowUp,
    faArrowDown,
    faTriangleExclamation,
    faTags,
    faUserCircle,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/ui/Loader';
import CardSizeSelector from '../components/ui/CardSizeSelector';
import '../styles/design-system.css';

const Categories = () => {
    const {
        user,
        logout,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isProfileOpen,
        setIsProfileOpen,
        formatCurrency
    } = useDashboard();

    const {
        categories,
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
        formData,
        handleAddClick,
        handleEditClick,
        handleDeleteClick,
        handleFormChange,
        handleSaveSubmit,
        handleConfirmDelete
    } = useCategories();

    const [cardSize, setCardSize] = useLocalStorage('categories_card_size', 300);

    if (isLoading && categories.length === 0) {
        return <Loader message="A carregar categorias..." />;
    }

    return (
        <div className="dashboard-container">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* MAIN CONTENT */}
            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-titles">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Gestão de Categorias
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                Organize as suas receitas e despesas com precisão.
                            </p>
                        </div>

                        <div className="profile-container">
                            <button
                                className="profile-button"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="profile-text">
                                    <span className="profile-name">{user?.name}</span>
                                    <span className="profile-role">Investidor</span>
                                </div>
                                <div className="profile-avatar">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} />
                                    ) : (
                                        <FontAwesomeIcon icon={faUserCircle} />
                                    )}
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-header">
                                        <p className="dropdown-name">{user?.name}</p>
                                        <p className="dropdown-email">{user?.email}</p>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" onClick={logout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Sair da Conta
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="dashboard-grid" style={{ display: 'block' }}>
                    {/* Header with Filters and Add Button */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        gap: '1.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <div className="filter-group">
                            <button
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Todas
                            </button>
                            <button
                                className={`filter-btn ${filter === 'revenue' ? 'active' : ''}`}
                                onClick={() => setFilter('revenue')}
                            >
                                Receitas
                            </button>
                            <button
                                className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
                                onClick={() => setFilter('expense')}
                            >
                                Despesas
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <CardSizeSelector value={cardSize} onChange={setCardSize} />
                            <button className="btn btn-primary" onClick={handleAddClick} style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
                                <FontAwesomeIcon icon={faPlus} /> Nova Categoria
                            </button>
                        </div>
                    </div>


                    {/* Categories List */}
                    <div className="categories-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
                        justifyContent: 'center',
                        gap: '1.5rem'
                    }}>
                        {categories.map(category => (
                            <div key={category.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s ease', cursor: 'default' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            backgroundColor: category.type === 'revenue' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: category.type === 'revenue' ? '#10b981' : '#ef4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem'
                                        }}>
                                            <FontAwesomeIcon icon={category.type === 'revenue' ? faArrowUp : faArrowDown} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{category.name}</h3>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '20px',
                                                backgroundColor: 'var(--border)',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {category.type === 'revenue' ? 'Receita' : 'Despesa'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEditClick(category)}
                                            className="action-btn edit"
                                            title="Editar"
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(category)}
                                            className="action-btn delete"
                                            title="Eliminar"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>

                                {category.description && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        ))}

                        {categories.length === 0 && !isLoading && (
                            <div className="card" style={{ padding: '4rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                                <FontAwesomeIcon icon={faTags} style={{ fontSize: '3rem', color: 'var(--border-strong)', marginBottom: '1.5rem' }} />
                                <h3 style={{ color: 'var(--text-muted)' }}>Nenhuma categoria encontrada.</h3>
                                <button className="btn btn-primary" onClick={handleAddClick} style={{ marginTop: '1.5rem' }}>
                                    Criar Primeira Categoria
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* MODALS */}
            {isModifyModalOpen && (
                <div className="modal-overlay">
                    <div className="card modal-content" style={{ maxWidth: '500px', padding: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                        </h2>

                        {error && (
                            <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                <span style={{ fontSize: '0.85rem' }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSaveSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Nome da Categoria</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Ex: Alimentação, Salário..."
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipo</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleFormChange}
                                    className="form-input"
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="expense">Despesa</option>
                                    <option value="revenue">Receita</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descrição (Opcional)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="Breve descrição sobre o uso desta categoria..."
                                    className="form-input"
                                    style={{ minHeight: '100px', resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsModifyModalOpen(false)}
                                    style={{ flex: 1, backgroundColor: 'var(--border)', color: 'var(--text)' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'A Guardar...' : 'Guardar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && deletingCategory && (
                <div className="modal-overlay">
                    <div className="card modal-content" style={{ maxWidth: '400px', padding: '2.5rem', textAlign: 'center' }}>
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
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Eliminar Categoria?</h2>

                        {error && (
                            <div className="error-alert" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                <span style={{ fontSize: '0.85rem' }}>{error}</span>
                            </div>
                        )}

                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Esta ação não pode ser desfeita. Para confirmar, escreve <strong>{deletingCategory?.name}</strong> abaixo:
                        </p>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <input
                                type="text"
                                className="form-input"
                                value={deleteConfirmName}
                                onChange={(e) => setDeleteConfirmName(e.target.value)}
                                placeholder="Digita o nome aqui..."
                                style={{ textAlign: 'center', borderStyle: 'dashed' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn"
                                onClick={() => setIsDeleteModalOpen(false)}
                                style={{ flex: 1, backgroundColor: 'var(--border)', color: 'var(--text)' }}
                            >
                                Manter
                            </button>
                            <button
                                className="btn"
                                onClick={handleConfirmDelete}
                                style={{
                                    flex: 1,
                                    backgroundColor: deleteConfirmName === deletingCategory?.name ? '#ef4444' : 'var(--border)',
                                    color: deleteConfirmName === deletingCategory?.name ? 'white' : 'var(--text-muted)',
                                    cursor: deleteConfirmName === deletingCategory?.name ? 'pointer' : 'not-allowed'
                                }}
                                disabled={isLoading || deleteConfirmName !== deletingCategory?.name}
                            >
                                {isLoading ? 'A eliminar...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
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
                    transition: margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .dashboard-header {
                    margin-bottom: 3rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1.5rem;
                }

                .header-titles {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .filter-group {
                    display: flex;
                    gap: 0.5rem;
                    background-color: var(--surface);
                    padding: 0.25rem;
                    borderRadius: 12px;
                    border: 1px solid var(--border);
                }

                .filter-btn {
                    padding: 0.5rem 1.25rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    border: none;
                    background: transparent;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .filter-btn:hover {
                    color: var(--text);
                    background-color: var(--surface-hover);
                }

                .filter-btn.active {
                    background-color: var(--accent);
                    color: white;
                    box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
                }

                .action-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    border: 1px solid var(--border);
                    background-color: var(--surface);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-color: var(--border-strong);
                }

                .action-btn.edit { color: var(--accent); }
                .action-btn.edit:hover { background-color: rgba(var(--accent-rgb), 0.1); }
                
                .action-btn.delete { color: #ef4444; }
                .action-btn.delete:hover { background-color: rgba(239, 68, 68, 0.1); }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(0,0,0,0.8);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 2rem;
                    animation: fade-in 0.3s ease;
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid var(--border-strong);
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-label {
                    font-size: 0.85rem;
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
                    box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.1);
                }
                
                @media (max-width: 768px) {
                    .dashboard-container { flex-direction: column; }
                    
                    .dashboard-header {
                        margin-bottom: 1.5rem;
                        padding: 0;
                    }
                    .main-content {
                        padding: 1rem 1rem 100px 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Categories;
