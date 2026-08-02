import React, { useState, useEffect } from 'react';
import { API_URL } from "./config";
import './App.css';
import './AcceuilSupAdmin.css';
import bg from './assets/bg-img.jpg';
import UtilisateurSection from './UtilisateurSection';

export default function AcceuilSupAdmin() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });
  const [editUser, setEditUser] = useState({ id: '', username: '', password: '', role: '' });
  const roleStats = utilisateurs.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  const totalAdmins = roleStats['admin'] || 0;
  const totalSuperAdmins = roleStats['super-admin'] || 0;
  const totalAgents = roleStats['agent-saisie'] || 0;

  const refreshUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/utilisateurs`);
      const users = await res.json();
      setUtilisateurs(users);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const openAddUserModal = () => setShowAddUserModal(true);
  const closeAddUserModal = () => setShowAddUserModal(false);

  const submitAddUser = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/utilisateurs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    setShowAddUserModal(false);
    setNewUser({ username: '', password: '', role: '' });
    refreshUsers();
  };

  const openEditUserModal = (user) => {
    setEditUser({ ...user });
    setShowEditUserModal(true);
  };
  const closeEditUserModal = () => setShowEditUserModal(false);

  const submitEditUser = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/utilisateurs/${editUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser)
    });
    setShowEditUserModal(false);
    refreshUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    await fetch(`${API_URL}/utilisateurs/${id}`, { method: 'DELETE' });
    refreshUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <div
      className="background_wrapper superadmin-background"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="superadmin-page">
        <header className="superadmin-header">
          <div>
            <p className="superadmin-badge">Super Admin</p>
            <h1>Table de bord système</h1>
            <p className="superadmin-subtitle">Gestion centralisée des utilisateurs et des accès.</p>
          </div>
          <div className="superadmin-actions">
            <button className="add-btn" onClick={openAddUserModal}>➕ Nouvel utilisateur</button>
            <button className="logout-btn" onClick={handleLogout}>🚪 Déconnexion</button>
          </div>
        </header>

        <div className="dashboard-panel">
          <div className="dashboard-cards">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <span>Total Utilisateurs</span>
              <strong>{utilisateurs.length}</strong>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <span>Administrateurs</span>
              <strong>{totalAdmins}</strong>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <span>Super-Administrateurs</span>
              <strong>{totalSuperAdmins}</strong>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <span>Agents de Saisie</span>
              <strong>{totalAgents}</strong>
            </div>
          </div>
        </div>

        <div className="superadmin-summary">
          <div className="summary-card summary-card--primary">
            <span>Utilisateurs</span>
            <strong>{utilisateurs.length}</strong>
          </div>
          <div className="summary-card summary-card--secondary">
            <span>Mode de gestion</span>
            <strong>Complet</strong>
          </div>
          <div className="summary-card summary-card--accent">
            <span>Accès</span>
            <strong>Administration</strong>
          </div>
        </div>

        <div className="superadmin-content">
          <UtilisateurSection
            utilisateurs={utilisateurs}
            showAddUserModal={showAddUserModal}
            openAddUserModal={openAddUserModal}
            closeAddUserModal={closeAddUserModal}
            submitAddUser={submitAddUser}
            newUser={newUser}
            setNewUser={setNewUser}
            showEditUserModal={showEditUserModal}
            openEditUserModal={openEditUserModal}
            closeEditUserModal={closeEditUserModal}
            submitEditUser={submitEditUser}
            editUser={editUser}
            setEditUser={setEditUser}
            deleteUser={deleteUser}
          />
        </div>
      </div>
    </div>
  );
}
