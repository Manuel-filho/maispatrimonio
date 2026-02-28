import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const COMMON_DOMAINS = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'yahoo.com',
    'protonmail.com',
    'me.com'
];

const EmailInput = ({ value, onChange, placeholder, className, autoFocus, required }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        onChange(e);

        if (!val) {
            setShowSuggestions(false);
            return;
        }

        if (val.includes('@')) {
            const [local, domain] = val.split('@');
            if (domain !== undefined) {
                const filtered = COMMON_DOMAINS.filter(d => d.startsWith(domain));
                setSuggestions(filtered.map(d => `${local}@${d}`));
                setShowSuggestions(filtered.length > 0);
            } else {
                // Just local part + @
                setSuggestions(COMMON_DOMAINS.map(d => `${local}@${d}`));
                setShowSuggestions(true);
            }
        } else {
            // Proactive: show all domains with the current text as local part
            setSuggestions(COMMON_DOMAINS.map(d => `${val}@${d}`));
            setShowSuggestions(true);
        }
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion) => {
        const event = {
            target: {
                name: 'email',
                value: suggestion
            }
        };
        onChange(event);
        setShowSuggestions(false);
        setSelectedIndex(-1);
    };

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <FontAwesomeIcon icon={faEnvelope} className="form-icon" />
            <input
                type="email"
                name="email"
                required={required}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={className}
                autoFocus={autoFocus}
                autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--accent)',
                    borderRadius: '0 0 4px 4px',
                    zIndex: 100,
                    marginTop: '-1px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion}
                            onClick={() => selectSuggestion(suggestion)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            style={{
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                backgroundColor: index === selectedIndex ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                                color: index === selectedIndex ? 'var(--accent)' : 'var(--text)',
                                borderLeft: index === selectedIndex ? '2px solid var(--accent)' : '2px solid transparent',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span>{suggestion}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.5 }}>TAB</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmailInput;
