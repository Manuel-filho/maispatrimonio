import React from 'react';

const Loader = ({ message = 'A carregar...' }) => {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--background)',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    border: '3px solid var(--border)',
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 0 15px rgba(var(--accent-rgb), 0.1)'
                }}></div>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    letterSpacing: '0.02em'
                }}>
                    {message}
                </p>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;
