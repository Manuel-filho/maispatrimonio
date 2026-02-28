import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import Security from '../components/landing/Security';
import FAQ from '../components/landing/FAQ';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faCoins, faDatabase, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useReveal } from '../hooks/useReveal';

const Home = () => {
    useReveal();

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <Navbar />
            <Hero />

            {/* Refined Features/Introduction */}
            <section className="reveal" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
                        <h2 style={{ textTransform: 'uppercase', fontSize: '1.75rem', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>Proposta Técnica</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.5' }}>O + Património é uma ferramenta de alta precisão para a gestão de ativos financeiros e liquidez.</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {[
                            {
                                icon: faGem,
                                title: 'SEGREGAÇÃO DE ATIVOS',
                                desc: 'Diferenciação rigorosa entre liquidez imediata e património imobilizado para uma visão real de Net Worth.'
                            },
                            {
                                icon: faCoins,
                                title: 'CONTROLO MULTIMOEDA',
                                desc: 'Gestão nativa em AOA, USD e EUR, garantindo precisão em ambientes financeiros globais.'
                            },
                            {
                                icon: faDatabase,
                                title: 'INTEGRIDADE DE DADOS',
                                desc: 'Arquitetura desenhada para consistência total, eliminando erros comuns em folhas de cálculo.'
                            },
                            {
                                icon: faChartLine,
                                title: 'ANÁLISE HISTÓRICA',
                                desc: 'Acompanhamento rigoroso da evolução do seu capital com métricas de recordes de património líquido.'
                            }
                        ].map((f, i) => (
                            <div key={i} className="card" style={{ padding: '2rem' }}>
                                <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                                    <FontAwesomeIcon icon={f.icon} />
                                </div>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '0.05em' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="reveal"><HowItWorks /></div>
            <div className="reveal"><Security /></div>
            <div className="reveal"><FAQ /></div>

            {/* CTA Section - Minimalist */}
            <section className="reveal" style={{ textAlign: 'center' }}>
                <div className="container">
                    <div style={{ padding: '6rem 0', borderTop: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Aceda à Ferramenta</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                            Crie a sua estrutura de gestão patrimonial hoje e tenha claridade absoluta sobre a sua evolução financeira.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-primary" style={{ padding: '1rem 3rem' }}>CRIAR CONTA</button>
                            <button className="btn btn-outline" style={{ padding: '1rem 3rem' }}>CONTACTAR SUPORTE</button>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{
                padding: '100px 0 60px',
                backgroundColor: 'var(--surface)',
                borderTop: '1px solid var(--border)'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem' }}>
                        <div>
                            <img src="/logo_v2.png" alt="Logo" style={{ height: '32px', filter: 'grayscale(1)', opacity: 0.6, marginBottom: '1.5rem' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gestão de Riqueza Profissional.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '4rem' }}>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>LEGAL</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <a href="#">Privacidade</a>
                                    <a href="#">Termos de Uso</a>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>SISTEMA</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <a href="#">Documentação</a>
                                    <a href="#">API</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>© 2024 + PATRIMÓNIO. TODOS OS DIREITOS RESERVADOS.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default Home;
