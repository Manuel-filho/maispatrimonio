import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faArrowRight, faArrowLeft, faTriangleExclamation, faUserCircle, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useLogin } from '../../hooks/useLogin';
import EmailInput from '../../components/ui/EmailInput';
import '../../styles/design-system.css';

const Login = () => {
    const {
        step,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        userData,
        error,
        isSubmitting,
        handleEmailSubmit,
        handleLoginSubmit,
        resetStep
    } = useLogin();

    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--background)',
            padding: '2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                animation: 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Logo Link to Home */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Link to="/">
                        <img src="/logo_v2.png" alt="+ Património" style={{ height: '40px' }} />
                    </Link>
                </div>

                <div className="card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden' }}>

                    {step === 2 && (
                        <button
                            onClick={resetStep}
                            style={{
                                position: 'absolute',
                                top: '2rem',
                                left: '2rem',
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem',
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                zIndex: 10,
                                cursor: 'pointer'
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                        </button>
                    )}

                    <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: step === 2 ? '1.5rem' : '0' }}>
                        {step === 1 ? (
                            <>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Login</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    Identifique a sua conta para continuar.
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{ marginBottom: '1.5rem', position: 'relative', display: 'inline-block' }}>
                                    {userData?.avatar ? (
                                        <img
                                            src={userData.avatar}
                                            alt={userData.name}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid var(--accent)'
                                            }}
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '80px', color: 'var(--border-strong)' }} />
                                    )}
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                                    Olá, {userData?.name ? (userData.name.split(' ').length > 1 ? `${userData.name.split(' ')[0]} ${userData.name.split(' ').pop()}` : userData.name) : ''}
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{email}</p>
                            </>
                        )}
                    </div>

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
                            gap: '0.75rem',
                            animation: 'shake 0.4s ease-in-out'
                        }}>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleEmailSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label className="form-label">Endereço de E-mail</label>
                                <EmailInput
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="exemplo@email.com"
                                    className="form-input"
                                    autoFocus
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '1.1rem',
                                    fontSize: '1rem',
                                    marginTop: '0.5rem',
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
                                    <>PRÓXIMO PASSO <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} /></>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label className="form-label">Palavra-passe</label>
                                <div style={{ position: 'relative' }}>
                                    <FontAwesomeIcon icon={faLock} className="form-icon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="form-input"
                                        autoFocus
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

                            <div style={{ textAlign: 'right' }}>
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>
                                    Esqueceu a palavra-passe?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '1.1rem',
                                    fontSize: '1rem',
                                    marginTop: '0.5rem',
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
                                    <>ENTRAR NO SISTEMA <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Não tem uma conta? <Link to="/register" style={{ color: 'var(--text)', fontWeight: '700' }}>Registe-se aqui</Link>
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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

export default Login;
