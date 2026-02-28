import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faMicrochip, faShieldAlt, faHistory } from '@fortawesome/free-solid-svg-icons';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: faWallet,
            title: 'REGISTO DE LIQUIDEZ',
            description: 'Configuração de contas bancárias e ativos de alta liquidez em múltiplas moedas (AOA, USD, EUR).'
        },
        {
            number: '02',
            icon: faMicrochip,
            title: 'MAPEAMENTO PATRIMONIAL',
            description: 'Inventário rigoroso de bens imobilizados, veículos e participações societárias.'
        },
        {
            number: '03',
            icon: faShieldAlt,
            title: 'GESTÃO ATÓMICA',
            description: 'Lançamento de transações com atualização de saldo em tempo real e integridade de dados.'
        },
        {
            number: '04',
            icon: faHistory,
            title: 'ANÁLISE DE PERFORMANCE',
            description: 'Monitorização do Net Worth e acompanhamento de recordes históricos de património.'
        }
    ];

    return (
        <section style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="container">
                <div className="section-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>Metodologia de Gestão</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.5' }}>Um processo estruturado para a claridade financeira absoluta.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '4rem'
                }}>
                    {steps.map((step, index) => (
                        <div key={index}>
                            <div style={{
                                fontSize: '0.85rem',
                                fontWeight: '800',
                                color: 'var(--accent)',
                                marginBottom: '1rem',
                                borderBottom: '2px solid var(--accent)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                paddingBottom: '0.25rem'
                            }}>
                                <FontAwesomeIcon icon={step.icon} style={{ fontSize: '0.75rem' }} /> STEP {step.number}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--primary)' }}>
                                {step.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.4' }}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
