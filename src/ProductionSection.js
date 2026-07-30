import React, { useState, useEffect } from 'react';
import { API_URL } from "./config";

export default function ProductionSection() {
  const [productions, setProductions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newProd, setNewProd] = useState({ libelle: '', unite: '' });
  const [editProd, setEditProd] = useState({ id: '', libelle: '', unite: '' });

  useEffect(() => {
    fetch(API_URL + '/production').then(r => r.json()).then(setProductions);
  }, []);

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => { setShowAdd(false); setNewProd({ libelle: '', unite: '' }); };
  const submitAdd = async (e) => {
    e.preventDefault();
    await fetch(API_URL + '/production', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    });
    closeAdd();
    fetch(API_URL + '/production').then(r => r.json()).then(setProductions);
  };

  const openEdit = (prod) => { setEditProd(prod); setShowEdit(true); };
  const closeEdit = () => setShowEdit(false);
  const submitEdit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/production/${editProd.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editProd)
    });
    closeEdit();
    fetch(API_URL + '/production').then(r => r.json()).then(setProductions);
  };

  const deleteProd = async (id) => {
    if (window.confirm('Supprimer cette production ?')) {
      await fetch(`${API_URL}/production/${id}`, { method: 'DELETE' });
      fetch(API_URL + '/production').then(r => r.json()).then(setProductions);
    }
  };

  return (
    <div className="users-container">
      <h2>Liste des productions</h2>
      <button className="add-btn" onClick={openAdd}>➕ Ajouter production</button>
      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Nouvelle production</h3>
            <form onSubmit={submitAdd}>
              <div className="form-group">
                <label>Production</label>
                <input className="login__input" value={newProd.libelle} onChange={e => setNewProd({ ...newProd, libelle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Unité</label>
                <input className="login__input" value={newProd.unite} onChange={e => setNewProd({ ...newProd, unite: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeAdd}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEdit && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Modifier la production</h3>
            <form onSubmit={submitEdit}>
              <div className="form-group">
                <label>Production</label>
                <input className="login__input" value={editProd.libelle} onChange={e => setEditProd({ ...editProd, libelle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Unité</label>
                <input className="login__input" value={editProd.unite} onChange={e => setEditProd({ ...editProd, unite: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeEdit}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>Production</th>
            <th>Unité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productions.map(p => (
            <tr key={p.id}>
              <td data-label="Production"><span className="card-label">Production:</span> <span className="card-value">{p.libelle}</span></td>
              <td data-label="Unité"><span className="card-label">Unité:</span> <span className="card-value">{p.unite}</span></td>
              <td data-label="Actions">
                <button className="edit-btn" onClick={() => openEdit(p)}>Modifier</button>
                <button className="delete-btn" onClick={() => deleteProd(p.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
