import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = ({ handleNavClick, activeSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [openGroups, setOpenGroups] = useState({ agro: true, categorie: true, affectation: false });
  const sidebarRef = useRef();

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) setCurrentUser(user);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const toggleGroup = (key) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMenuLinkClick = (section, e) => {
    e.preventDefault();
    handleNavClick(section, e);
    setMenuOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const renderLink = (section, icon, label, cls = '') => (
    <a
      href="#"
      className={`sidebar-link${activeSection === section ? ' active' : ''}${cls ? ' ' + cls : ''}`}
      onClick={e => handleMenuLinkClick(section, e)}
    >
      <span className="sidebar-link-icon">{icon}</span>
      <span className="sidebar-link-label">{label}</span>
    </a>
  );

  const renderGroup = (key, icon, label, children, isOpen) => (
    <div className={`sidebar-group${isOpen ? ' open' : ''}`}>
      <button
        type="button"
        className="sidebar-group-btn"
        onClick={() => toggleGroup(key)}
        aria-expanded={isOpen}
      >
        <span className="sidebar-link-icon">{icon}</span>
        <span className="sidebar-link-label">{label}</span>
        <span className="sidebar-group-caret">▾</span>
      </button>
      <div className="sidebar-submenu">
        <div className="sidebar-submenu-inner">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className={`sidebar-hamburger${menuOpen ? ' hidden' : ''}`}
        onClick={() => setMenuOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <button
        className={`sidebar-overlay${menuOpen ? ' visible' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-label="Fermer le menu"
      />
      <aside className={`sidebar${menuOpen ? ' open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-mark">🌾</span>
            <div className="sidebar-brand-text">
              <strong>Application battage</strong>
              <small>Gestion agricole</small>
            </div>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {renderLink('dashboard', '📊', 'Tableau de bord')}

          {renderGroup(
            'agro',
            '🏭',
            'Complexe Agricole',
            <>
              {renderLink('agro', '🏢', 'Complexes')}
              {renderLink('parcelle', '🌍', 'Parcelles')}
            </>,
            openGroups.agro
          )}

          {renderGroup(
            'categorie',
            '🗂️',
            'Catégories Agricoles',
            <>
              {renderLink('categorie-culture', '🌱', 'Filières')}
              {renderLink('type-culture', '🏷️', 'Types')}
              {renderLink('nature-culture', '🍃', 'Nature')}
              {renderLink('production', '📦', 'Production')}
              {renderLink('campagne', '📅', 'Campagne')}
            </>,
            openGroups.categorie
          )}

          {renderGroup(
            'affectation',
            '📋',
            'Affectation',
            <>
              {renderLink('affectation-culture', '🌾', 'Affectation Cultures')}
              {renderLink('affectation-agent', '👷', 'Affectation Agents')}
            </>,
            openGroups.affectation
          )}

          {renderLink('users', '👥', 'Utilisateurs')}
        </nav>

        <div className="sidebar-footer">
          {currentUser && (
            <>
              <div className="sidebar-user">
                <span className="sidebar-user-avatar">{currentUser.charAt(0).toUpperCase()}</span>
                <div className="sidebar-user-info">
                  <strong>{currentUser}</strong>
                  <small>Connecté</small>
                </div>
              </div>
              <button
                type="button"
                className="sidebar-logout"
                onClick={handleLogout}
              >
                <span className="sidebar-logout-icon">🚪</span>
                <span className="sidebar-logout-label">Se déconnecter</span>
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
