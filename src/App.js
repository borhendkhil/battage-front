import React, { useState } from 'react';
import { API_URL } from "./config";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import bg from './assets/bg-img.jpg';
import AcceuilAdmin from './AcceuilAdmin';
import AcceuilAgent from './AcceuilAgent';
import AcceuilSupAdmin from './AcceuilSupAdmin';

/* Épi de blé — signature visuelle, dégradé blé -> bronze */
function WheatSheaf() {
  return (
    <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="stalkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7e6" />
          <stop offset="60%" stopColor="#c9954c" />
          <stop offset="100%" stopColor="#5b3714" />
        </linearGradient>
      </defs>

      {/* tige centrale */}
      <g className="wheat-stalk">
        <path d="M100 210 V60" stroke="#5b3714" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="100" cy="40" rx="10" ry="24" fill="url(#stalkGrad)" />
        {[...Array(6)].map((_, i) => (
          <line
            key={i}
            x1="100"
            y1={30 + i * 8}
            x2={i % 2 === 0 ? 78 : 122}
            y2={20 + i * 8}
            stroke="#8c5e33"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* tige gauche */}
      <g className="wheat-stalk">
        <path d="M70 210 V90" stroke="#5b3714" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="70" cy="72" rx="8" ry="19" fill="url(#stalkGrad)" />
      </g>

      {/* tige droite */}
      <g className="wheat-stalk">
        <path d="M130 210 V90" stroke="#5b3714" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="130" cy="72" rx="8" ry="19" fill="url(#stalkGrad)" />
      </g>

      {/* lien */}
      <rect x="82" y="150" width="36" height="10" rx="5" fill="#8c5e33" />
    </svg>
  );
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const user = await res.json();
      if (user.success) {
        localStorage.setItem('username', username);
        if (user.role === 'admin') {
          navigate('/acceuil-admin');
        } else if (user.role === 'super-admin') {
          navigate('/acceuil-superadmin');
        } else if (user.role === 'agent-saisie') {
          navigate('/acceuil-agent');
        } else {
          navigate('/acceuil');
        }
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur, réessayez');
    }
  };

  return (
    <div className="login-page" dir="ltr" lang="fr">
      <div className="login-shell">
        <div className="login-visual">
          <img src={bg} alt="" className="login-visual__bg" />
          <div className="wheat-sheaf">
            <WheatSheaf />
          </div>
          <div className="login-visual__caption">
            <p>Application Battage</p>
            <span></span>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-wrap">
            <span className="login-eyebrow">Connexion</span>
            <h1 className="login-title">Application Battage</h1>
            <p className="login-subtitle">
            Gestion des opérations de récolte et de stockage
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="username">Nom d'utilisateur</label>
                <div className="login-input-wrap">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Entrez votre nom d'utilisateur"
                  />
                  <span className="login-input-icon">✉️</span>
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password">Mot de passe</label>
                <div className="login-input-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Entrez votre mot de passe"
                  />
                  <span className="login-input-icon">🔒</span>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit">
                Se connecter
              </button>

              {error && <div className="login-error">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/acceuil-admin" element={<AcceuilAdmin />} />
        <Route path="/acceuil-superadmin" element={<AcceuilSupAdmin />} />
        <Route path="/acceuil-agent" element={<AcceuilAgent />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;