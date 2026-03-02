import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useDashboard } from '../hooks/useDashboard';
import { useGoals } from '../hooks/useGoals';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faBullseye, faCalendarAlt, faTrophy, faFlag, faLightbulb,
    faHeart, faHome, faCar, faPlane, faGraduationCap, faBriefcase,
    faShoppingBag, faTrash, faEdit, faCheckCircle, faExclamationCircle,
    faSpinner, faChartLine, faUserCircle, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/ui/Loader';
import CardSizeSelector from '../components/ui/CardSizeSelector';
import '../styles/design-system.css';
import './Goals.css';

const ICON_OPTIONS = [
    { id: 'target', icon: faBullseye, label: 'Alvo' },
    { id: 'trophy', icon: faTrophy, label: 'Troféu' },
    { id: 'flag', icon: faFlag, label: 'Bandeira' },
    { id: 'lightbulb', icon: faLightbulb, label: 'Ideia' },
    { id: 'heart', icon: faHeart, label: 'Saúde' },
    { id: 'home', icon: faHome, label: 'Casa' },
    { id: 'car', icon: faCar, label: 'Carro' },
    { id: 'plane', icon: faPlane, label: 'Viagem' },
    { id: 'graduation', icon: faGraduationCap, label: 'Educação' },
    { id: 'briefcase', icon: faBriefcase, label: 'Trabalho' },
    { id: 'shopping', icon: faShoppingBag, label: 'Desejo' },
    { id: 'chart', icon: faChartLine, label: 'Investimento' }
];

const COLOR_OPTIONS = [
    '#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308',
    '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7'
];

const DEFAULT_FORM = {
    name: '',
    description: '',
    target_amount: '',
    current_amount: '0',
    due_date: '',
    color: COLOR_OPTIONS[0],
    icon: 'target'
};

const Goals = () => {
    const {
        user,
        logout,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isProfileOpen,
        setIsProfileOpen,
    } = useDashboard();

    const {
        goals, isLoading, error, success,
        setSuccess, setError, createGoal,
        updateGoal, deleteGoal, calculateProgress, getStatusLabel
    } = useGoals();

    const [cardSize, setCardSize] = useLocalStorage('goals_card_size', 340);
    const [showModal, setShowModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [modalData, setModalData] = useState(DEFAULT_FORM);

    const handleOpenModal = (goal = null) => {
        if (goal) {
            setEditingGoal(goal);
            setModalData({
                name: goal.name,
                description: goal.description || '',
                target_amount: goal.target_amount,
                current_amount: goal.current_amount,
                due_date: goal.due_date ? goal.due_date.split('T')[0] : '',
                color: goal.color || COLOR_OPTIONS[0],
                icon: goal.icon || 'target',
                status: goal.status || 'em_progresso'
            });
        } else {
            setEditingGoal(null);
            setModalData(DEFAULT_FORM);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = editingGoal
            ? await updateGoal(editingGoal.id, modalData)
            : await createGoal(modalData);
        if (result.success) {
            setShowModal(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-PT', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
    const formatCurrency = (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'AOA' }).format(v || 0);
    const getIconById = (id) => ICON_OPTIONS.find(o => o.id === id)?.icon || faBullseye;

    if (isLoading && goals.length === 0) {
        return <Loader message="A carregar metas..." />;
    }

    return (
        <div className="dashboard-container">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main className="main-content">
                {/* HEADER — padrão idêntico ao das outras páginas */}
                <header className="dashboard-header">
                    <div className="header-titles">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Metas Financeiras
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                Acompanha os teus objetivos e a evolução das tuas poupanças.
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

                {/* CONTENT */}
                <div className="goals-content">
                    {/* Alerts */}
                    {success && (
                        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                            <FontAwesomeIcon icon={faCheckCircle} /> {success}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                            <FontAwesomeIcon icon={faExclamationCircle} /> {typeof error === 'string' ? error : 'Ocorreu um erro.'}
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="goals-toolbar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                {goals.length} {goals.length === 1 ? 'meta definida' : 'metas definidas'}
                            </p>
                            <CardSizeSelector value={cardSize} onChange={setCardSize} />
                        </div>
                        <button className="btn-save" onClick={() => handleOpenModal()} style={{ borderRadius: '12px' }}>
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
                            Nova Meta
                        </button>
                    </div>

                    {/* Grid */}
                    {goals.length === 0 ? (
                        <div className="goals-empty-state">
                            <div className="empty-icon"><FontAwesomeIcon icon={faBullseye} /></div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>Sem metas definidas</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '380px', textAlign: 'center' }}>
                                Começa a planear o teu futuro. Cria a primeira meta financeira e acompanha o progresso.
                            </p>
                            <button className="btn-save" onClick={() => handleOpenModal()}>Criar Primeira Meta</button>
                        </div>
                    ) : (
                        <div className="goals-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
                            justifyContent: 'center',
                            gap: '2rem'
                        }}>
                            {goals.map(goal => {
                                const progress = calculateProgress(goal.current_amount, goal.target_amount);
                                return (
                                    <div key={goal.id} className="goal-card">
                                        <div className="goal-card-header">
                                            <div className="goal-icon-wrapper" style={{ backgroundColor: goal.color || COLOR_OPTIONS[0] }}>
                                                <FontAwesomeIcon icon={getIconById(goal.icon)} />
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="goal-menu-btn" onClick={() => handleOpenModal(goal)} title="Editar">
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button className="goal-menu-btn" style={{ color: '#ef4444' }} onClick={() => deleteGoal(goal.id)} title="Eliminar">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="goal-info">
                                            <h3 className="goal-title">{goal.name}</h3>
                                            {goal.description && <p className="goal-description">{goal.description}</p>}
                                        </div>

                                        <div className="goal-progress-container">
                                            <div className="goal-progress-info">
                                                <span className="progress-label">Progresso</span>
                                                <span className="progress-percentage">{progress}%</span>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div className="progress-bar-fill" style={{ width: `${progress}%`, backgroundColor: goal.color || COLOR_OPTIONS[0] }}></div>
                                            </div>
                                        </div>

                                        <div className="goal-amounts">
                                            <div className="amount-item">
                                                <span className="amount-label">Poupado</span>
                                                <span className="amount-value">{formatCurrency(goal.current_amount)}</span>
                                            </div>
                                            <div className="amount-item" style={{ textAlign: 'right' }}>
                                                <span className="amount-label">Alvo</span>
                                                <span className="amount-value">{formatCurrency(goal.target_amount)}</span>
                                            </div>
                                        </div>

                                        <div className="goal-footer">
                                            <div className="goal-due-date">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                                {formatDate(goal.due_date)}
                                            </div>
                                            <div className={`goal-status-badge ${goal.status}`}>
                                                {getStatusLabel(goal.status)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingGoal ? 'Editar Meta' : 'Nova Meta Financeira'}</h2>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Nome da Meta *</label>
                                    <input type="text" className="premium-input" value={modalData.name}
                                        onChange={e => setModalData({ ...modalData, name: e.target.value })}
                                        required placeholder="Ex: Viagem de férias, Reserva de emergência..." />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Descrição (Opcional)</label>
                                    <textarea className="premium-input" rows="2" value={modalData.description}
                                        onChange={e => setModalData({ ...modalData, description: e.target.value })}
                                        placeholder="Pormenores sobre o teu objetivo..." />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Valor Alvo *</label>
                                        <input type="number" step="0.01" min="0.01" className="premium-input"
                                            value={modalData.target_amount}
                                            onChange={e => setModalData({ ...modalData, target_amount: e.target.value })}
                                            required placeholder="0,00" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Valor Poupado</label>
                                        <input type="number" step="0.01" min="0" className="premium-input"
                                            value={modalData.current_amount}
                                            onChange={e => setModalData({ ...modalData, current_amount: e.target.value })}
                                            placeholder="0,00" />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: editingGoal ? '1fr 1fr' : '1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Data Limite *</label>
                                        <input type="date" className="premium-input" value={modalData.due_date}
                                            onChange={e => setModalData({ ...modalData, due_date: e.target.value })}
                                            required />
                                    </div>
                                    {editingGoal && (
                                        <div className="form-group">
                                            <label className="form-label">Estado</label>
                                            <select className="premium-input" value={modalData.status}
                                                onChange={e => setModalData({ ...modalData, status: e.target.value })}>
                                                <option value="em_progresso">Em Progresso</option>
                                                <option value="concluida">Concluída</option>
                                                <option value="cancelada">Cancelada</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Cor</label>
                                    <div className="color-picker-grid">
                                        {COLOR_OPTIONS.map(color => (
                                            <div key={color} className={`color-option ${modalData.color === color ? 'selected' : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setModalData({ ...modalData, color })} />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ícone</label>
                                    <div className="icon-picker-grid">
                                        {ICON_OPTIONS.map(opt => (
                                            <div key={opt.id}
                                                className={`icon-option ${modalData.icon === opt.id ? 'selected' : ''}`}
                                                onClick={() => setModalData({ ...modalData, icon: opt.id })}
                                                title={opt.label}>
                                                <FontAwesomeIcon icon={opt.icon} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-save" disabled={isLoading}>
                                    {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : (editingGoal ? 'Guardar Alterações' : 'Criar Meta')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
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
                    min-width: 0;
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

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 1024px) {
                    .main-content {
                        padding: 2rem;
                    }
                }

                @media (max-width: 768px) {
                    .main-content {
                        padding: 1.5rem;
                    }
                    .dashboard-header {
                        margin-bottom: 2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Goals;
