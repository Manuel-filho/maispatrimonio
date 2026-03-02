import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartPie,
    faWallet,
    faBuildingColumns,
    faTrophy,
    faTags,
    faGear,
    faChevronLeft,
    faChevronRight,
    faUserCircle,
    faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: faChartPie, label: 'Dashboard' },
        { path: '/transactions', icon: faExchangeAlt, label: 'Transações & Analítica' },
        { path: '/accounts', icon: faWallet, label: 'Contas & Liquidez' },
        { path: '/assets', icon: faBuildingColumns, label: 'Património Ativo' },
        { path: '/goals', icon: faTrophy, label: 'Metas Financeiras' },
        { path: '/categories', icon: faTags, label: 'Categorias' },
        { path: '/profile', icon: faUserCircle, label: 'Perfil' },
        { path: '/settings', icon: faGear, label: 'Configurações' }
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {!isCollapsed && (
                <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                    <Link to="/dashboard">
                        <img src="/logo_v2.png" alt="+ Património" style={{ height: '32px', objectFit: 'contain' }} />
                    </Link>
                </div>
            )}

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <FontAwesomeIcon icon={item.icon} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <button
                onClick={onToggle}
                className="nav-item text-muted"
                style={{
                    marginTop: 'auto',
                    textAlign: isCollapsed ? 'center' : 'left',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    padding: isCollapsed ? '0.85rem 0' : '0.85rem 1rem'
                }}
            >
                <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
                {!isCollapsed && <span>Esconder Menu</span>}
            </button>
        </aside>
    );
};

export default Sidebar;
