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
    <header className="navbar" dir="rtl" style={{marginBottom: 30}}>
      <div className="navbar-container" style={{justifyContent: 'center'}}>
        <div className="navbar-brand">ديوان الاراضي الدولية</div>
        <button
          className="navbar-toggle"
          aria-label="فتح القائمة"
          onClick={() => setMobileOpen(v => !v)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            marginRight: 10,
            fontSize: 28,
            color: '#fff'
          }}
        >
          <span className="bar" style={{display: 'block', width: 24, height: 3, background: '#fff', margin: '4px 0', borderRadius: 2}}></span>
          <span className="bar" style={{display: 'block', width: 24, height: 3, background: '#fff', margin: '4px 0', borderRadius: 2}}></span>
          <span className="bar" style={{display: 'block', width: 24, height: 3, background: '#fff', margin: '4px 0', borderRadius: 2}}></span>
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
            📝 إضافة تقرير يومي
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
            📋 قائمة التقارير
          </a>
          <span ref={userRef} style={{ position: 'relative', display: 'inline-block' }}>
            <a
              href="#"
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
            {userDropdown && (
              <div className="navbar-dropdown" style={{ minWidth: 120, left: 0, right: 'auto' }}>
                <a
                  href="#"
                  style={{
                    display: 'block',
                    color: '#e53935',
                    padding: '8px 16px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    textAlign: 'right'
                  }}
                  onClick={handleLogout}
                >
                  🚪 الخروج
                </a>
              </div>
            )}
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
