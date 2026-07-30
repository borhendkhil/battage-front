import React from 'react';

export default function CategorieCultureSection({
  categories,
  showAddCategorieModal,
  openAddCategorieModal,
  closeAddCategorieModal,
  submitAddCategorie,
  newCategorie,
  setNewCategorie,
  showEditCategorieModal,
  openEditCategorieModal,
  closeEditCategorieModal,
  submitEditCategorie,
  editCategorie,
  setEditCategorie,
  deleteCategorie
}) {
  return (
    <div className="users-container">
      <h2>Liste des Catégories Agricoles</h2>
      <button className="add-btn" onClick={openAddCategorieModal}>➕ Ajouter une catégorie agricole</button>
      {showAddCategorieModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Nouvelle catégorie agricole</h3>
            <form onSubmit={submitAddCategorie}>
              <div className="form-group">
                <label>Nom de la catégorie</label>
                <input
                  type="text"
                  className="login__input"
                  value={newCategorie.libelle}
                  onChange={e => setNewCategorie({ ...newCategorie, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeAddCategorieModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditCategorieModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Modifier la catégorie agricole</h3>
            <form onSubmit={submitEditCategorie}>
              <div className="form-group">
                <label>Nom de la catégorie</label>
                <input
                  type="text"
                  className="login__input"
                  value={editCategorie.libelle}
                  onChange={e => setEditCategorie({ ...editCategorie, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeEditCategorieModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom de la catégorie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td data-label="ID"><span className="card-label">ID:</span> <span className="card-value">{cat.id}</span></td>
              <td data-label="Nom"><span className="card-label">Nom:</span> <span className="card-value">{cat.libelle}</span></td>
              <td data-label="Actions">
                <button className="edit-btn" onClick={() => openEditCategorieModal(cat)}>Modifier</button>
                <button className="delete-btn" onClick={() => deleteCategorie(cat.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
