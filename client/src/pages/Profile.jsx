import React, { useRef, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { useProfile } from '../hooks/useProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faPhone,
    faCalendar,
    faVenusMars,
    faCamera,
    faLock,
    faCoins,
    faCheckCircle,
    faExclamationCircle,
    faEdit,
    faTimes,
    faSave,
    faCrown,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/ui/Loader';
import './Profile.css';
import '../styles/design-system.css';

const Profile = () => {
    const {
        user,
        currencies,
        formData,
        passwordData,
        isLoading,
        isEditing,
        setIsEditing,
        isDirty,
        error,
        success,
        handleInputChange,
        handlePasswordChange,
        updatePersonalInfo,
        handleAvatarUpload,
        updatePassword,
        cancelEdit,
        setSuccess,
        setError
    } = useProfile();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const fileInputRef = useRef(null);

    if (!user && isLoading) {
        return <Loader message="A carregar o seu perfil..." />;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Não definida';
        try {
            return new Date(dateString).toLocaleDateString('pt-PT');
        } catch (e) {
            return dateString;
        }
    };

    const getGenderLabel = (g) => {
        if (!g) return 'Não selecionado';
        const labels = {
            'M': 'Masculino', 'Masculino': 'Masculino',
            'F': 'Feminino', 'Feminino': 'Feminino'
        };
        return labels[g] || g;
    };

    const getCurrencyName = (id) => {
        const currency = currencies.find(c => c.id === parseInt(id));
        return currency ? `${currency.name} (${currency.code})` : 'Kwanza (AOA)';
    };

    return (
        <div className="profile-page-container">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main className="profile-main">
                <div className="profile-content">
                    <header style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            O Teu Perfil
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                            Gere a tua identidade e preferências na plataforma.
                        </p>
                    </header>

                    {success && (
                        <div className="alert alert-success animate-fade-in">
                            <FontAwesomeIcon icon={faCheckCircle} /> {success}
                        </div>
                    )}

                    {error && typeof error === 'object' && error.message && (
                        <div className="alert alert-error animate-fade-in">
                            <FontAwesomeIcon icon={faExclamationCircle} /> {error.message}
                        </div>
                    )}

                    {/* HEADER CARD - AVATAR & BASIC INFO */}
                    <div className="profile-section-card">
                        <div className="profile-header-area">
                            <div className="avatar-upload-wrapper">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="profile-avatar-large" />
                                ) : (
                                    <div className="profile-avatar-large">
                                        <FontAwesomeIcon icon={faUser} />
                                    </div>
                                )}
                                {isEditing && (
                                    <label className="avatar-edit-btn" title="Mudar foto">
                                        <FontAwesomeIcon icon={faCamera} size="xs" />
                                        <input
                                            type="file"
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={(e) => e.target.files[0] && handleAvatarUpload(e.target.files[0])}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="user-meta-info">
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text)' }}>
                                    {user?.name}
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.5rem' }} />
                                    Membro desde {formatDate(user?.membership_since || user?.created_at)}
                                </p>
                            </div>

                            {!isEditing && (
                                <button className="btn-edit-toggle" onClick={() => setIsEditing(true)}>
                                    <FontAwesomeIcon icon={faEdit} /> Editar Perfil
                                </button>
                            )}
                        </div>

                        {/* DISPLAY OR EDIT FORM */}
                        <form onSubmit={updatePersonalInfo}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(var(--accent-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--accent)' }}>
                                    <FontAwesomeIcon icon={faUser} size="sm" />
                                </div>
                                Informações Pessoais
                            </h3>

                            {!isEditing ? (
                                <div className="info-display-grid animate-fade-in">
                                    <div className="info-item">
                                        <span className="info-label">Nome Completo</span>
                                        <span className="info-value">{user?.name}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">E-mail</span>
                                        <span className="info-value">{user?.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Telemóvel</span>
                                        <span className="info-value">{user?.phone || 'Não definido'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Data de Nascimento</span>
                                        <span className="info-value">{formatDate(user?.birthdate)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Género</span>
                                        <span className="info-value">{getGenderLabel(user?.gender)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Moeda Padrão</span>
                                        <span className="info-value">{getCurrencyName(user?.preferred_currency_id)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="profile-form-grid animate-fade-in">
                                    <div className="form-group">
                                        <label className="form-label">Nome Completo</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="text"
                                                name="name"
                                                className={`premium-input ${error?.name ? 'is-invalid' : ''}`}
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="O seu nome"
                                            />
                                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                                        </div>
                                        {error?.name && <span className="error-text" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{error.name[0]}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Endereço de E-mail</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="email"
                                                name="email"
                                                className={`premium-input ${error?.email ? 'is-invalid' : ''}`}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="email@exemplo.com"
                                            />
                                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                        </div>
                                        {error?.email && <span className="error-text" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{error.email[0]}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Telemóvel</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="text"
                                                name="phone"
                                                className={`premium-input ${error?.phone ? 'is-invalid' : ''}`}
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+244"
                                            />
                                            <FontAwesomeIcon icon={faPhone} className="input-icon" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Data de Nascimento</label>
                                        <div className="input-with-icon">
                                            <input
                                                type="date"
                                                name="birthdate"
                                                className={`premium-input ${error?.birthdate ? 'is-invalid' : ''}`}
                                                value={formData.birthdate}
                                                onChange={handleInputChange}
                                            />
                                            <FontAwesomeIcon icon={faCalendar} className="input-icon" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Género</label>
                                        <div className="input-with-icon">
                                            <select
                                                name="gender"
                                                className="premium-input"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                style={{ appearance: 'none' }}
                                            >
                                                <option value="">Selecionar...</option>
                                                <option value="M">Masculino</option>
                                                <option value="F">Feminino</option>
                                            </select>
                                            <FontAwesomeIcon icon={faVenusMars} className="input-icon" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Moeda de Preferência</label>
                                        <div className="input-with-icon">
                                            <select
                                                name="preferred_currency_id"
                                                className="premium-input"
                                                value={formData.preferred_currency_id}
                                                onChange={handleInputChange}
                                                style={{ appearance: 'none' }}
                                            >
                                                <option value="">Moeda Padrão (Kz)</option>
                                                {currencies.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                                ))}
                                            </select>
                                            <FontAwesomeIcon icon={faCoins} className="input-icon" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isEditing && (
                                <div className="profile-actions animate-fade-in">
                                    <button type="button" className="btn-cancel" onClick={cancelEdit}>
                                        <FontAwesomeIcon icon={faTimes} /> Cancelar
                                    </button>
                                    <button type="submit" className="btn-save" disabled={isLoading || !isDirty}>
                                        <FontAwesomeIcon icon={isLoading ? faTimes : faSave} /> {isLoading ? 'A guardar...' : 'Guardar Alterações'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* SECURITY SECTION */}
                    <div className="profile-section-card">
                        <form onSubmit={updatePassword}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#ef4444' }}>
                                    <FontAwesomeIcon icon={faLock} size="sm" />
                                </div>
                                Segurança e Acesso
                            </h3>

                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label className="form-label">Palavra-passe Atual</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="password"
                                            name="current_password"
                                            className={`premium-input ${error?.current_password ? 'is-invalid' : ''}`}
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                        />
                                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                                    </div>
                                    {error?.current_password && <span className="error-text" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{error.current_password[0]}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Nova Palavra-passe</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="password"
                                            name="new_password"
                                            className={`premium-input ${error?.new_password ? 'is-invalid' : ''}`}
                                            value={passwordData.new_password}
                                            onChange={handlePasswordChange}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                                    </div>
                                    {error?.new_password && <span className="error-text" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{error.new_password[0]}</span>}
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button type="submit" className="btn-save" disabled={isLoading || !passwordData.new_password}>
                                    Atualizar Palavra-passe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
