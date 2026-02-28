import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faArrowRight, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import '../../styles/design-system.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      backgroundColor: 'var(--background)',
      borderBottom: '1px solid var(--border)',
      height: '72px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo_v2.png"
            alt="+ Património"
            style={{
              height: '40px',
              filter: theme === 'light' ? 'invert(1) contrast(1.2)' : 'none'
            }}
          />
        </Link>

        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <Link to="/features" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)' }}>RECURSOS</Link>
          <Link to="/about" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)' }}>SOBRE</Link>

          <button
            onClick={toggleTheme}
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
              padding: '0.5rem',
              width: '40px',
              display: 'flex',
              justifyContent: 'center'
            }}
            aria-label="Toggle Theme"
          >
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </button>

          <Link to="/login" style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FontAwesomeIcon icon={faSignInAlt} style={{ fontSize: '0.8rem' }} /> LOGIN
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem', gap: '0.5rem' }}>
            REGISTO <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.75rem' }} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
