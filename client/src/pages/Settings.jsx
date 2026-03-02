import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useDashboard } from '../hooks/useDashboard';
import { useSettings } from '../hooks/useSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPalette,
    faMoon,
    faSun,
    faUserSlash,
    faExclamationTriangle,
    faChevronRight,
    faTrash,
    faSignOutAlt,
    faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/ui/Loader';
import Notification from '../components/ui/Notification';
import '../styles/design-system.css';

const Settings = () => {
    const {
        user,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isProfileOpen,
        setIsProfileOpen,
        logout
    } = useDashboard();

    const {
        theme,
        toggleTheme,
        isLoading,
        error,
        success,
        clearStatus,
        showDeleteModal,
        setShowDeleteModal,
        handleDeleteAccount
    } = useSettings();

    if (isLoading) return <Loader message="A processar..." />;

    return (
        <div className="dashboard-container">
            {success && <Notification message={success} type="success" onClose={clearStatus} />}
            {error && <Notification message={error} type="error" onClose={clearStatus} />}

            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-titles">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Configurações</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }} className="hide-on-mobile">Personaliza a tua experiência e gere a tua conta.</p>
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

                <div className="settings-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
                    {/* INTERFACE SECTION */}
                    <section className="settings-section mb-8">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FontAwesomeIcon icon={faPalette} style={{ color: 'var(--accent)' }} />
                            Interface e Estilo
                        </h2>

                        <div className="settings-card" onClick={toggleTheme} style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    backgroundColor: theme === 'dark' ? 'rgba(var(--accent-rgb), 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                    color: theme === 'dark' ? 'var(--accent)' : '#eab308',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem'
                                }}>
                                    <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Tema do Sistema</h3>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        Atualmente em modo {theme === 'dark' ? 'escuro' : 'claro'}
                                    </p>
                                </div>
                            </div>

                            <div className="theme-toggle-switch" style={{
                                width: '56px',
                                height: '30px',
                                background: theme === 'dark' ? 'var(--accent)' : 'var(--border-strong)',
                                borderRadius: '30px',
                                padding: '4px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    left: theme === 'dark' ? '28px' : '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}></div>
                            </div>
                        </div>
                    </section>

                    {/* ACCOUNT SECTION */}
                    <section className="settings-section">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FontAwesomeIcon icon={faUserCircle} style={{ color: 'var(--accent)' }} />
                            Segurança da Conta
                        </h2>

                        <div className="settings-card delete-account-card" onClick={() => setShowDeleteModal(true)} style={{
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem'
                                }}>
                                    <FontAwesomeIcon icon={faUserSlash} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#ef4444' }}>Eliminar Conta</h3>
                                    <p style={{ margin: 0, color: 'rgba(239, 68, 68, 0.7)', fontSize: '0.85rem' }}>
                                        Esta ação é permanente e removerá todos os teus dados.
                                    </p>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} style={{ color: '#ef4444', opacity: 0.5 }} />
                        </div>
                    </section>
                </div>

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content premium-card-modal" style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '20px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                margin: '0 auto 1.5rem'
                            }}>
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Tens a certeza?</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Estás prestes a eliminar a tua conta. Esta ação não pode ser revertida e irás perder todo o teu histórico de património, transações e metas.
                            </p>
                            <div className="modal-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)} style={{ padding: '0.8rem' }}>
                                    Cancelar
                                </button>
                                <button className="btn" onClick={handleDeleteAccount} style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.8rem' }}>
                                    <FontAwesomeIcon icon={faTrash} style={{ marginRight: '0.5rem' }} /> Eliminar Permanentemente
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                .settings-content {
                    animation: fade-in 0.6s ease-out;
                }
                .settings-card:hover {
                    box-shadow: var(--shadow-md);
                    transform: translateY(-2px);
                    border-color: var(--accent);
                }
                .delete-account-card:hover {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: #ef4444;
                }
                .settings-section h2 { letter-spacing: -0.01em; }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 1024px) {
                    .hide-on-tablet { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Settings;
