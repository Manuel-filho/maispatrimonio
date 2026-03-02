import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faCalendarAlt, faVenusMars, faArrowRight, faTriangleExclamation, faCheckCircle, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRegister } from '../../hooks/useRegister';
import EmailInput from '../../components/ui/EmailInput';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../../styles/design-system.css';

const Register = () => {
    const {
        formData,
        error,
        success,
        showPassword,
        setShowPassword,
        isSubmitting,
        handleChange,
        setPhone,
        setEmail,
        handleSubmit
    } = useRegister();

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--background)',
            padding: '4rem 2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '550px',
                animation: 'fade-in 0.8s ease-out'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Link to="/">
                        <img src="/logo_v2.png" alt="+ Património" style={{ height: '40px' }} />
                    </Link>
                </div>

                <div className="card" style={{ padding: '3.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Criar Conta</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                        Inicie o mapeamento do seu património hoje.
                    </p>

                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            padding: '1rem',
                            borderRadius: '4px',
                            marginBottom: '2rem',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid #10b981',
                            color: '#10b981',
                            padding: '1rem',
                            borderRadius: '4px',
                            marginBottom: '2rem',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* Full Name */}
                        <div>
                            <label className="form-label">Nome Completo</label>
                            <div style={{ position: 'relative' }}>
                                <FontAwesomeIcon icon={faUser} className="form-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Seu nome"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="form-label">Endereço de E-mail</label>
                            <EmailInput
                                value={formData.email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                                className="form-input"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="form-label">Número de Telefone</label>
                            <PhoneInput
                                country={'ao'}
                                value={formData.phone || ''}
                                onChange={(phone) => setPhone(phone)}
                                inputStyle={{
                                    width: '100%',
                                    height: '54px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--surface)',
                                    color: 'var(--text)',
                                    fontSize: '1rem',
                                }}
                                buttonStyle={{
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--surface)',
                                    borderRadius: '4px 0 0 4px',
                                }}
                                dropdownStyle={{
                                    backgroundColor: 'var(--surface)',
                                    color: 'var(--text)',
                                }}
                                containerStyle={{
                                    width: '100%',
                                }}
                            />
                        </div>

                        {/* Birthdate & Gender Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label className="form-label">Data de Nascimento</label>
                                <div style={{ position: 'relative' }}>
                                    <FontAwesomeIcon icon={faCalendarAlt} className="form-icon" />
                                    <input
                                        type="date"
                                        name="birthdate"
                                        required
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Género</label>
                                <div style={{ position: 'relative' }}>
                                    <FontAwesomeIcon icon={faVenusMars} className="form-icon" />
                                    <select
                                        name="gender"
                                        required
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-input"
                                        style={{ appearance: 'none' }}
                                    >
                                        <option value="M">Masculino</option>
                                        <option value="F">Feminino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="form-label">Palavra-passe</label>
                            <div style={{ position: 'relative' }}>
                                <FontAwesomeIcon icon={faLock} className="form-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mínimo 6 caracteres"
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)',
                                        padding: '0.25rem',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '1.1rem',
                                fontSize: '1rem',
                                marginTop: '1rem',
                                gap: '0.75rem',
                                opacity: isSubmitting ? 0.7 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {isSubmitting ? (
                                <>A PROCESSAR... <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '1rem' }} /></>
                            ) : (
                                <>CRIAR CONTA PROFISSIONAL <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} /></>
                            )}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Já tem uma conta? <Link to="/login" style={{ color: 'var(--text)', fontWeight: '700' }}>Inicie sessão</Link>
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-label {
          display: block; 
          font-size: 0.75rem; 
          font-weight: 700; 
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          color: var(--text-muted);
        }
        .form-icon {
          position: absolute; 
          left: 1rem; 
          top: 50%; 
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 0.9rem;
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background-color: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text);
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.1);
        }
      `}</style>
        </main>
    );
};

export default Register;
