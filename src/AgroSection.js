import React from 'react';

export default function AgroSection({
  agroCombinats,
  showAddAgroModal,
  openAddAgroModal,
  closeAddAgroModal,
  submitAddAgro,
  newAgro,
  setNewAgro,
  showEditAgroModal,
  openEditAgroModal,
  closeEditAgroModal,
  submitEditAgro,
  editAgro,
  setEditAgro,
  deleteAgro
}) {
  return (
    <div className="users-container">
      <h2>Liste des Exploitations Agricoles</h2>
      <button className="add-btn" onClick={openAddAgroModal}>➕ Ajouter une exploitation</button>
      {showAddAgroModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Nouvelle exploitation agricole</h3>
            <form onSubmit={submitAddAgro}>
              <div className="form-group">
                <label>Code</label>
                <input type="text" value={newAgro.COD_SOC} onChange={e => setNewAgro({ ...newAgro, COD_SOC: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>Nom de l'exploitation</label>
                <input type="text" value={newAgro.LIB_SOC} onChange={e => setNewAgro({ ...newAgro, LIB_SOC: e.target.value })} required className="login__input" />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeAddAgroModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditAgroModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Modifier l'exploitation agricole</h3>
            <form onSubmit={submitEditAgro}>
              <div className="form-group">
                <label>Code</label>
                <input type="text" value={editAgro.COD_SOC} readOnly className="login__input" />
              </div>
              <div className="form-group">
                <label>Nom de l'exploitation</label>
                <input type="text" value={editAgro.LIB_SOC} onChange={e => setEditAgro({ ...editAgro, LIB_SOC: e.target.value })} required className="login__input" />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeEditAgroModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom de l'exploitation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agroCombinats.map(agro => (
            <tr key={agro.COD_SOC}>
              <td data-label="Code"><span className="card-label">Code:</span> <span className="card-value">{agro.COD_SOC}</span></td>
              <td data-label="Nom"><span className="card-label">Nom:</span> <span className="card-value">{agro.LIB_SOC}</span></td>
              <td data-label="Actions">
                <button className="edit-btn" onClick={() => openEditAgroModal(agro)}>Modifier</button>
                <button className="delete-btn" onClick={() => deleteAgro(agro.COD_SOC)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
