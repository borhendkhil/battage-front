import React, { useState, useRef, useEffect } from 'react';
import './NavbarAgent.css';

export default function NavbarAgent({ onNav }) {
  const [menu, setMenu] = useState('rapport');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const username = localStorage.getItem('username') || '';
  const userRef = useRef();

  const handleNav = (section, e) => {
    e && e.preventDefault();
    setMenu(section);
    onNav(section);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdown(false);
    };
    if (userDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdown]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <header className="navbar" dir="ltr" style={{marginBottom: 30}}>
      <div className="navbar-container" style={{justifyContent: 'center'}}>
        <div className="navbar-brand">DIAR</div>
        <button
          className={`navbar-toggle${mobileOpen ? ' active' : ''}`}
          aria-label="Ouvrir le menu"
          onClick={() => setMobileOpen(v => !v)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <nav className={`navbar-menu${mobileOpen ? ' active' : ''}`} style={{gap: '1.2rem'}}>
          <a
            href="#"
            className={menu === 'rapport' ? 'active' : ''}
            onClick={e => handleNav('rapport', e)}
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              padding: '0.5rem 1.2rem'
            }}
          >
            📝 Ajouter un rapport
          </a>
          <a
            href="#"
            className={menu === 'liste' ? 'active' : ''}
            onClick={e => handleNav('liste', e)}
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              padding: '0.5rem 1.2rem'
            }}
          >
            📋 Liste des rapports
          </a>
          <span ref={userRef} className={userDropdown ? 'open' : ''} style={{ position: 'relative', display: 'inline-block' }}>
            <a
              href="#"
              aria-expanded={userDropdown}
              onClick={e => {
                e.preventDefault();
                setUserDropdown(v => !v);
              }}
              style={{
                color: '#fff',
                fontWeight: 700,
                margin: '0 1rem',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              {username} ▼
            </a>
            <div className={`navbar-dropdown${userDropdown ? ' visible' : ''}`} style={{ minWidth: 120, left: 0, right: 'auto' }}>
              <a
                href="#"
                className="danger-link"
                onClick={handleLogout}
              >
                🚪 Déconnexion
              </a>
            </div>
          </span>
        </nav>
      </div>
      <style>
        {`
        @media (max-width: 768px) {
          .navbar-toggle {
            display: block !important;
          }
          .navbar-menu {
            display: ${mobileOpen ? 'flex' : 'none'};
            flex-direction: column;
            gap: 0.7rem;
            width: 100%;
            align-items: flex-start;
            background: linear-gradient(90deg, #8c5e36 0%, #3a2f25 100%);
            position: absolute;
            top: 60px;
            right: 0;
            z-index: 2000;
            padding: 1rem 0.5rem;
            border-radius: 0 0 1rem 1rem;
          }
        }
        .navbar-menu a.active {
          background: #a97c50;
          border-radius: 0.4rem;
        }
        `}
      </style>
    </header>
  );
}
