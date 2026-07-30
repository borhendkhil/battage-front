import React from 'react';

export default function TypeCultureSection({
  types,
  categories,
  showAddTypeModal,
  openAddTypeModal,
  closeAddTypeModal,
  submitAddType,
  newType,
  setNewType,
  showEditTypeModal,
  openEditTypeModal,
  closeEditTypeModal,
  submitEditType,
  editType,
  setEditType,
  deleteType
}) {
  return (
    <div className="users-container">
      <h2>Liste des types agricoles</h2>
      <button className="add-btn" onClick={openAddTypeModal}>➕ Ajouter un type agricole</button>
      {showAddTypeModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Nouveau type agricole</h3>
            <form onSubmit={submitAddType}>
              <div className="form-group">
                <label>Nom du type</label>
                <input
                  type="text"
                  className="login__input"
                  value={newType.libelle}
                  onChange={e => setNewType({ ...newType, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Catégorie agricole</label>
                <select
                  className="login__input"
                  value={newType.categorie_id || ''}
                  onChange={e => setNewType({ ...newType, categorie_id: e.target.value })}
                  required
                >
                  <option value="" disabled>Sélectionner la catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.libelle}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeAddTypeModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditTypeModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Modifier le type agricole</h3>
            <form onSubmit={submitEditType}>
              <div className="form-group">
                <label>Nom du type</label>
                <input
                  type="text"
                  className="login__input"
                  value={editType.libelle}
                  onChange={e => setEditType({ ...editType, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Catégorie agricole</label>
                <select
                  className="login__input"
                  value={editType.categorie_id || ''}
                  onChange={e => setEditType({ ...editType, categorie_id: e.target.value })}
                  required
                >
                  <option value="" disabled>Sélectionner la catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.libelle}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeEditTypeModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du type</th>
            <th>Catégorie agricole</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map(type => (
            <tr key={type.id}>
              <td data-label="ID"><span className="card-label">ID:</span> <span className="card-value">{type.id}</span></td>
              <td data-label="Nom du type"><span className="card-label">Nom du type:</span> <span className="card-value">{type.libelle}</span></td>
              <td data-label="Catégorie agricole"><span className="card-label">Catégorie agricole:</span> <span className="card-value">{categories.find(cat => cat.id === type.categorie_id)
                  ? categories.find(cat => cat.id === type.categorie_id).libelle
                  : ''}</span></td>
              <td data-label="Actions">
                <button className="edit-btn" onClick={() => openEditTypeModal(type)}>Modifier</button>
                <button className="delete-btn" onClick={() => deleteType(type.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
