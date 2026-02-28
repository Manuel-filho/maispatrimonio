import React, { useEffect, useState } from 'react';
import '../../styles/design-system.css';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('INICIALIZANDO SISTEMA');

    const statuses = [
        'MAPEAR ATIVOS...',
        'CONFIGURAR ENCRIPTAÇÃO...',
        'VERIFICAR INTEGRIDADE...',
        'ESTABELECER CONEXÃO SEGURA...',
        'EXCELÊNCIA FINANCEIRA'
    ];

    useEffect(() => {
        // Progress bar and status text simulation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 20);

        // Status text rotation
        statuses.forEach((text, index) => {
            setTimeout(() => setStatusText(text), index * 600);
        });

        // Exit timer
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 1000);
        }, 3800);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [onFinish]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#05070a', // Deeper black for premium feel
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transition: 'all 1s cubic-bezier(0.85, 0, 0.15, 1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(1.1)',
            pointerEvents: isVisible ? 'auto' : 'none',
            overflow: 'hidden'
        }}>
            {/* Background Grid - Subtle Industrial feel */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), 
                          linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                opacity: 0.5
            }}></div>

            {/* Animated Precision Lines */}
            <div className="blueprint-line" style={{ top: '20%' }}></div>
            <div className="blueprint-line" style={{ bottom: '20%' }}></div>
            <div className="blueprint-line-vert" style={{ left: '15%' }}></div>
            <div className="blueprint-line-vert" style={{ right: '15%' }}></div>

            {/* Central Content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Logo with Glitch/Precision reveal */}
                <div style={{
                    marginBottom: '2.5rem',
                    animation: 'logo-reveal 1.2s ease-out forwards'
                }}>
                    <img
                        src="/logo_v2.png"
                        alt="+ Património"
                        style={{ width: '180px', height: 'auto', filter: 'brightness(1.2)' }}
                    />
                </div>

                {/* Thematic Text */}
                <div style={{ textAlign: 'center', height: '1.5rem', marginBottom: '4rem' }}>
                    <p className="status-text">
                        {statusText}
                    </p>
                </div>

                {/* Counter & Progress */}
                <div style={{ width: '300px', textAlign: 'center' }}>
                    <div style={{
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        color: 'var(--accent)',
                        marginBottom: '0.5rem',
                        letterSpacing: '0.2em'
                    }}>
                        SECURITY LEVEL: ATOMIC [0x{progress.toString(16).toUpperCase()}]
                    </div>

                    <div style={{
                        width: '100%',
                        height: '1px',
                        background: 'rgba(255,255,255,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${progress}%`,
                            background: 'var(--accent)',
                            boxShadow: '0 0 15px var(--accent)',
                            transition: 'width 0.1s linear'
                        }}></div>
                    </div>

                    <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'monospace'
                    }}>
                        {progress}%
                    </div>
                </div>
            </div>

            <style>{`
        .blueprint-line {
          position: absolute;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
          animation: draw-horizontal 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .blueprint-line-vert {
          position: absolute;
          top: 0;
          width: 1px;
          height: 0;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
          animation: draw-vertical 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .status-text {
          color: white;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.3rem;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(10px);
          animation: status-reveal 0.5s ease-out forwards;
        }

        @keyframes draw-horizontal {
          to { width: 100%; }
        }
        @keyframes draw-vertical {
          to { height: 100%; }
        }
        @keyframes logo-reveal {
          from { opacity: 0; filter: blur(10px) brightness(0); transform: scale(0.95); }
          to { opacity: 1; filter: blur(0) brightness(1.2); transform: scale(1); }
        }
        @keyframes status-reveal {
          to { opacity: 0.8; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default SplashScreen;
