import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = ({ handleNavClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const [agroDropdown, setAgroDropdown] = useState(false);
  const [categorieDropdown, setCategorieDropdown] = useState(false);

  const [affectationDropdown, setAffectationDropdown] = useState(false);
  const userRef = useRef();
  const agroRef = useRef();
  const categorieRef = useRef();

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) setCurrentUser(user);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdown(false);
      if (agroRef.current && !agroRef.current.contains(e.target)) setAgroDropdown(false);
      if (categorieRef.current && !categorieRef.current.contains(e.target)) setCategorieDropdown(false);
      
      if (!e.target.closest('.affectation-dropdown-trigger')) setAffectationDropdown(false);
    };
    if (userDropdown || agroDropdown || categorieDropdown || affectationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdown, agroDropdown, categorieDropdown, affectationDropdown]);

  const handleMenuLinkClick = (section, e) => {
    handleNavClick(section, e);
    setMenuOpen(false);
    setAffectationDropdown(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <header className="navbar" dir="ltr">
      <div className="navbar-container">
        <div className="navbar-brand">DIAR</div>
        <button
          className={`navbar-toggle${menuOpen ? ' active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <nav className={`navbar-menu${menuOpen ? ' active' : ''}`}>
          <span
            ref={categorieRef}
            className={categorieDropdown ? 'open' : ''}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <a
              href="#"
              aria-expanded={categorieDropdown}
              onClick={e => {
                e.preventDefault();
                setCategorieDropdown(v => !v);
                setAgroDropdown(false);
              }}
            >
              🗂️ Catégories Agricoles ▼
            </a>
            <div className={`navbar-dropdown${categorieDropdown ? ' visible' : ''}`}>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('categorie-culture', e);
                    setCategorieDropdown(false);
                  }}
                >
                  Filières
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('type-culture', e);
                    setCategorieDropdown(false);
                  }}
                >
                  Types
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('nature-culture', e);
                    setCategorieDropdown(false);
                  }}
                >
                  Nature
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('production', e);
                    setCategorieDropdown(false);
                  }}
                >
                  Production
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('campagne', e);
                    setCategorieDropdown(false);
                  }}
                >
                  Campagne
                </a>
              </div>
          </span>
          {/* Dropdown Complexe Agricole */}
          <span
            ref={agroRef}
            className={agroDropdown ? 'open' : ''}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <a
              href="#"
              aria-expanded={agroDropdown}
              onClick={e => {
                e.preventDefault();
                setAgroDropdown(v => !v);
                setCategorieDropdown(false);
              }}
            >
              🏭 Complexe Agricole ▼
            </a>
            <div className={`navbar-dropdown${agroDropdown ? ' visible' : ''}`} style={{ minWidth: 120 }}>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('agro', e);
                    setAgroDropdown(false);
                  }}
                >
                  Complexe Agricole
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('parcelle', e);
                    setAgroDropdown(false);
                  }}
                >
                  Parcelles
                </a>
              </div>
          </span>
          {/* Dropdown Affectation */}
          <span
            className={`affectation-dropdown-trigger${affectationDropdown ? ' open' : ''}`}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <a
              href="#"
              aria-expanded={affectationDropdown}
              onClick={e => {
                e.preventDefault();
                setAffectationDropdown(v => !v);
                setAgroDropdown(false);
                setCategorieDropdown(false);
              }}
            >
              Affectation ▼
            </a>
            <div className={`navbar-dropdown${affectationDropdown ? ' visible' : ''}`}>
              <a
                href="#"
                onClick={e => handleMenuLinkClick('affectation-culture', e)}
              >
                Affectation Cultures
              </a>
              <a
                href="#"
                onClick={e => handleMenuLinkClick('affectation-agent', e)}
              >
                Affectation Agents
              </a>
            </div>
          </span>
          {currentUser && (
            <span ref={userRef} className={userDropdown ? 'open' : ''} style={{ position: 'relative', display: 'inline-block' }}>
              <a
                href="#"
                aria-expanded={userDropdown}
                onClick={e => {
                  e.preventDefault();
                  setUserDropdown(v => !v);
                }}
              >
               {currentUser} ▼
              </a>
              <div className={`navbar-dropdown${userDropdown ? ' visible' : ''}`} style={{ minWidth: 120 }}>
                <a
                  href="#"
                  className="danger-link"
                  onClick={handleLogout}
                >
                  🚪 Déconnexion
                </a>
              </div>
            </span>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
