import React, { useState, useEffect } from 'react';
import { API_URL } from "./config";

export default function CampagneSection() {
  const [campagnes, setCampagnes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newCampagne, setNewCampagne] = useState({ cod_campagne: '', libelle: '', etat: 'N' });
  const [editCampagne, setEditCampagne] = useState({ cod_campagne: '', libelle: '', etat: 'N' });

  useEffect(() => {
    fetch(API_URL + '/campagne').then(r => r.json()).then(setCampagnes);
  }, []);

  const reload = () => {
    fetch(API_URL + '/campagne').then(r => r.json()).then(setCampagnes);
  };

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => { setShowAdd(false); setNewCampagne({ cod_campagne: '', libelle: '', etat: 'N' }); };
  const submitAdd = async (e) => {
    e.preventDefault();
    await fetch(API_URL + '/campagne', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCampagne)
    });
    closeAdd();
    reload();
  };

  const openEdit = (campagne) => { setEditCampagne(campagne); setShowEdit(true); };
  const closeEdit = () => setShowEdit(false);
  const submitEdit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/campagne/${editCampagne.cod_campagne}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCampagne)
    });
    closeEdit();
    reload();
  };

  const deleteCampagne = async (cod_campagne) => {
    if (window.confirm('Supprimer cette campagne agricole ?')) {
      await fetch(`${API_URL}/campagne/${cod_campagne}`, { method: 'DELETE' });
      reload();
    }
  };

  return (
    <div className="users-container">
      <h2>Liste des Campagnes Agricoles</h2>
      <button className="add-btn" onClick={openAdd}>➕ Ajouter une campagne</button>
      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Nouvelle campagne agricole</h3>
            <form onSubmit={submitAdd}>
              <div className="form-group">
                <label>Code campagne</label>
                <input className="login__input" value={newCampagne.cod_campagne} onChange={e => setNewCampagne({ ...newCampagne, cod_campagne: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Nom de la campagne</label>
                <input className="login__input" value={newCampagne.libelle} onChange={e => setNewCampagne({ ...newCampagne, libelle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select className="login__input" value={newCampagne.etat} onChange={e => setNewCampagne({ ...newCampagne, etat: e.target.value })}>
                  <option value="A">Active</option>
                  <option value="N">Passée</option>
                </select>
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
            <h3>Modifier la campagne</h3>
            <form onSubmit={submitEdit}>
              <div className="form-group">
                <label>Code campagne</label>
                <input className="login__input" value={editCampagne.cod_campagne} disabled />
              </div>
              <div className="form-group">
                <label>Nom de la campagne</label>
                <input className="login__input" value={editCampagne.libelle} onChange={e => setEditCampagne({ ...editCampagne, libelle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select className="login__input" value={editCampagne.etat} onChange={e => setEditCampagne({ ...editCampagne, etat: e.target.value })}>
                  <option value="A">Active</option>
                  <option value="N">Passée</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeEdit}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="ltr">
        <thead>
          <tr>
            <th>Code campagne</th>
            <th>Nom de la campagne</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campagnes.map(c => (
            <tr key={c.cod_campagne}>
              <td data-label="Code campagne"><span className="card-label">Code campagne:</span> <span className="card-value">{c.cod_campagne}</span></td>
              <td data-label="Nom campagne"><span className="card-label">Nom campagne:</span> <span className="card-value">{c.libelle}</span></td>
              <td data-label="Statut"><span className="card-label">Statut:</span> <span className="card-value">{c.etat === 'A' ? 'Active' : 'Passée'}</span></td>
              <td data-label="Actions">
                <button className="edit-btn" onClick={() => openEdit(c)}>Modifier</button>
                <button className="delete-btn" onClick={() => deleteCampagne(c.cod_campagne)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
