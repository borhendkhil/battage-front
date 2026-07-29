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
    <header className="navbar" dir="rtl">
      <div className="navbar-container">
        <div className="navbar-brand">د</div>
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <nav className={`navbar-menu${menuOpen ? ' active' : ''}`}>
          {/* Dropdown catégorie-culture séparé */}
          <span ref={categorieRef} style={{ position: 'relative', display: 'inline-block' }}>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setCategorieDropdown(v => !v);
                setAgroDropdown(false); 
              }}
              style={{ cursor: 'pointer' }}
            >
              🗂️ التصنيفات الزراعية ▼
            </a>
            {categorieDropdown && (
              <div className="navbar-dropdown">
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('categorie-culture', e);
                    setCategorieDropdown(false);
                  }}
                >
                  الفئات الزراعية
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('type-culture', e);
                    setCategorieDropdown(false);
                  }}
                >
                  الأنواع الزراعية
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('nature-culture', e);
                    setCategorieDropdown(false);
                  }}
                >
                  طبيعة الزراعة
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('production', e);
                    setCategorieDropdown(false);
                  }}
                >
                  الإنتاج
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('campagne', e);
                    setCategorieDropdown(false);
                  }}
                >
                  الموسم الفلاحي
                </a>
              </div>
            )}
          </span>
          {/* Dropdown pour المركب الفلاحي */}
          <span ref={agroRef} style={{ position: 'relative', display: 'inline-block' }}>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setAgroDropdown(v => !v);
                setCategorieDropdown(false); 
              }}
              style={{ cursor: 'pointer' }}
            >
              🏭 المركب الفلاحي ▼
            </a>
            {agroDropdown && (
              <div className="navbar-dropdown" style={{ minWidth: 120 }}>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('agro', e);
                    setAgroDropdown(false);
                  }}
                >
                  المركب الفلاحي
                </a>
                <a
                  href="#"
                  onClick={e => {
                    handleMenuLinkClick('parcelle', e);
                    setAgroDropdown(false);
                  }}
                >
                  الضيعة او القطع
                </a>
              </div>
            )}
          </span>
          {/* Dropdown إسناد */}
          <span className="affectation-dropdown-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setAffectationDropdown(v => !v);
                setAgroDropdown(false);
                setCategorieDropdown(false);
              }}
              style={{ cursor: 'pointer' }}
            >
              إسناد ▼
            </a>
            {affectationDropdown && (
              <div className="navbar-dropdown">
                <a
                  href="#"
                  onClick={e => handleMenuLinkClick('affectation-culture', e)}
                >
                  إسناد زراعات
                </a>
                <a
                  href="#"
                  onClick={e => handleMenuLinkClick('affectation-agent', e)}
                >
                  إسناد أعوان
                </a>
              </div>
            )}
          </span>
          {currentUser && (
            <span ref={userRef} style={{ position: 'relative', display: 'inline-block' }}>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setUserDropdown(v => !v);
                }}
              >
               {currentUser} ▼
              </a>
              {userDropdown && (
                <div className="navbar-dropdown" style={{ minWidth: 120 }}>
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
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
