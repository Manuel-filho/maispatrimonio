import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

const Notification = ({ message, type = 'info', onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [onClose, duration]);

    const getIcon = () => {
        switch (type) {
            case 'success': return faCheckCircle;
            case 'error': return faExclamationCircle;
            case 'warning': return faExclamationCircle;
            default: return faInfoCircle;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return 'var(--accent)';
        }
    };

    return (
        <div className={`notification-toast ${type}`} style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            background: 'rgba(var(--surface-rgb), 0.8)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${getColor()}40`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            color: 'var(--text)',
            minWidth: '320px',
            maxWidth: '450px',
            animation: 'toast-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: `${getColor()}20`,
                color: getColor(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
            }}>
                <FontAwesomeIcon icon={getIcon()} />
            </div>

            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>
                    {type === 'error' ? 'Erro' : (type === 'success' ? 'Sucesso' : 'Aviso')}
                </p>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {message}
                </p>
            </div>

            <button onClick={onClose} style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.5rem',
                fontSize: '1rem',
                transition: 'color 0.2s'
            }} className="toast-close-btn">
                <FontAwesomeIcon icon={faTimes} />
            </button>

            <style>{`
                @keyframes toast-in {
                    from { opacity: 0; transform: translateX(100%) scale(0.9); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                
                .toast-close-btn:hover { color: var(--text); }

                .notification-toast::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: ${getColor()};
                    width: 100%;
                    border-radius: 0 0 16px 16px;
                    animation: toast-progress ${duration}ms linear forwards;
                }

                @keyframes toast-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default Notification;
