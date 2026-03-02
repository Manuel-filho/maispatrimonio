import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faTh } from '@fortawesome/free-solid-svg-icons';

const CardSizeSelector = ({ value, onChange }) => {
    return (
        <div className="card-size-selector" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'var(--surface)',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginLeft: 'auto'
        }}>
            <FontAwesomeIcon icon={faThLarge} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} />
            <input
                type="range"
                min="280"
                max="500"
                step="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                style={{
                    width: '100px',
                    height: '4px',
                    borderRadius: '2px',
                    appearance: 'none',
                    background: 'var(--border-strong)',
                    cursor: 'pointer',
                    outline: 'none'
                }}
                className="premium-range"
            />
            <FontAwesomeIcon icon={faTh} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} />

            <style>{`
                .premium-range::-webkit-slider-thumb {
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: var(--accent);
                    cursor: pointer;
                    border: 2px solid var(--surface);
                    box-shadow: 0 0 0 2px var(--accent);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                .premium-range::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.2);
                }
            `}</style>
        </div>
    );
};

export default CardSizeSelector;
