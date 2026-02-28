import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    color: 'var(--primary)',
                    padding: '1.25rem 0',
                    boxSizing: 'border-box'
                }}
            >
                <span style={{ fontWeight: '600', fontSize: '1rem', letterSpacing: '0.05em' }}>{question.toUpperCase()}</span>
                <span style={{ fontSize: '1.2rem', opacity: 0.5, transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    {isOpen ? '—' : '+'}
                </span>
            </button>
            <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                <p style={{ paddingBottom: '1rem' }}>{answer}</p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "Diferença entre Liquidez e Ativos?",
            answer: "Liquidez é o dinheiro imediato em contas e carteiras. Ativos são bens como imóveis e veículos que compõem o seu valor total mas não são prontamente utilizáveis."
        },
        {
            question: "Suporte Multimoeda?",
            answer: "Operação nativa em AOA, USD e EUR com campos dedicados para cada tipo de conta e ativo."
        },
        {
            question: "Cálculo de Net Worth?",
            answer: "Soma automática do saldo disponível em todas as contas de liquidez somada ao valor estimado de mercado de todos os ativos registados."
        }
    ];

    return (
        <section>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>QUESTÕES GERAIS</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Esclarecimentos sobre a metodologia e operação técnica do sistema.</p>
                </div>
                <div>
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
