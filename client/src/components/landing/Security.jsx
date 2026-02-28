import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faStamp, faNetworkWired, faUserShield } from '@fortawesome/free-solid-svg-icons';

const Security = () => {
    return (
        <section style={{
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                    <div>
                        <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                            Segurança e <br />Privacidade
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.5' }}>
                            Tratamos o seu património com o rigor institucional necessário. Sem distrações, apenas proteção rigorosa de dados.
                        </p>

                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {[
                                { icon: faLock, title: 'ENCRIPTAÇÃO AES-256', detail: 'Dados em repouso e trânsito protegidos por padrões de nível militar.' },
                                { icon: faStamp, title: 'AUTENTICAÇÃO JWT', detail: 'Sessões seguras com tokens atómicos de tempo limitado.' },
                                { icon: faNetworkWired, title: 'ISOLAMENTO DE DADOS', detail: 'Arquitetura que garante a privacidade total de cada utilizador.' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ borderLeft: '1px solid var(--border-strong)', paddingLeft: '1.5rem', position: 'relative' }}>
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        style={{
                                            position: 'absolute',
                                            left: '-0.5rem',
                                            top: '0.1rem',
                                            background: 'var(--surface)',
                                            padding: '0.2rem',
                                            color: 'var(--accent)',
                                            fontSize: '0.8rem'
                                        }}
                                    />
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.25rem', marginLeft: '0.5rem' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>{item.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        border: '1px solid var(--border)',
                        padding: '3rem',
                        backgroundColor: 'var(--background)',
                        textAlign: 'left'
                    }}>
                        <div style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>
                            <FontAwesomeIcon icon={faUserShield} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>GARANTIA DE INTEGRIDADE</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                            O sistema +Património foi desenhado para profissionais que não toleram erros. Cada transação é verificada através de protocolos de consistência ACID.
                        </p>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: 'var(--text-muted)',
                            letterSpacing: '0.05em',
                            border: '1px solid var(--border)',
                            padding: '0.5rem 1rem',
                            display: 'inline-block'
                        }}>
                            CERTIFIED SECURE SYSTEM
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Security;
