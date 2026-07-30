import React from 'react';

export default function UtilisateurSection({
  utilisateurs,
  showAddUserModal,
  openAddUserModal,
  closeAddUserModal,
  submitAddUser,
  newUser,
  setNewUser,
  showEditUserModal,
  openEditUserModal,
  closeEditUserModal,
  submitEditUser,
  editUser,
  setEditUser,
  deleteUser
}) {
  return (
    <div className="users-container">
      <h2>Liste des utilisateurs</h2>
      <button className="add-btn" onClick={openAddUserModal}>➕ Ajouter un utilisateur</button>
      {showAddUserModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Nouvel utilisateur</h3>
            <form onSubmit={submitAddUser}>
              <div className="form-group">
                <label>Nom d'utilisateur</label>
                <input type="text" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>Rôle</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} required className="login__input">
                  <option value="" disabled>Sélectionner le rôle</option>
                  <option value="admin">Administrateur</option>
                  <option value="super-admin">Super Administrateur</option>
                  <option value="agent-saisie">Agent de saisie</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeAddUserModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditUserModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Modifier l'utilisateur</h3>
            <form onSubmit={submitEditUser}>
              <div className="form-group">
                <label>Nom d'utilisateur</label>
                <input type="text" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>Rôle</label>
                <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })} required className="login__input">
                  <option value="" disabled>Sélectionner le rôle</option>
                  <option value="admin">Administrateur</option>
                  <option value="super-admin">Super Administrateur</option>
                  <option value="agent-saisie">Agent de saisie</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeEditUserModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom d'utilisateur</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(user => (
            <tr key={user.id}>
              <td data-label="ID"><span className="card-label">ID:</span> <span className="card-value">{user.id}</span></td>
              <td data-label="Nom d'utilisateur"><span className="card-label">Nom d'utilisateur:</span> <span className="card-value">{user.username}</span></td>
              <td data-label="Rôle"><span className="card-label">Rôle:</span> <span className="card-value">{user.role === 'admin'
                  ? 'Administrateur'
                  : user.role === 'super-admin'
                  ? 'Super Administrateur'
                  : user.role === 'agent-saisie'
                  ? 'Agent de saisie'
                  : user.role}</span></td>
              <td data-label="Actions">
                <button className="edit-btn" onClick={() => openEditUserModal(user)}>Modifier</button>
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
