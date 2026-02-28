import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faDesktop } from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
    return (
        <section style={{
            padding: '160px 0 100px',
            backgroundColor: 'var(--background)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        color: 'var(--accent)',
                        marginBottom: '1.5rem',
                        display: 'block'
                    }}>
                        SISTEMA DE GESTÃO PATRIMONIAL
                    </span>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                        fontWeight: '800',
                        lineHeight: '0.95',
                        marginBottom: '2.5rem',
                        color: 'var(--primary)',
                        letterSpacing: '-0.02em'
                    }}>
                        Controlo Absoluto da <br />
                        Sua Riqueza Real.
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-muted)',
                        maxWidth: '650px',
                        margin: '0 auto 3.5rem',
                        lineHeight: '1.6'
                    }}>
                        A ferramenta definitiva para segregação de liquidez e ativos financeiros. Desenhada para profissionais que exigem clareza e precisão absoluta.
                    </p>

                    <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem', gap: '0.75rem' }}>
                            <FontAwesomeIcon icon={faArrowTrendUp} /> INICIAR AGORA
                        </Link>
                        <Link to="/demo" className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '1rem', gap: '0.75rem' }}>
                            <FontAwesomeIcon icon={faDesktop} /> CONSULTAR DEMO
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
