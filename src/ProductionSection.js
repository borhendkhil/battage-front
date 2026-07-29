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
      <h2>قائمة الإنتاج</h2>
      <button className="add-btn" onClick={openAdd}>➕ إضافة إنتاج</button>
      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة إنتاج جديد</h3>
            <form onSubmit={submitAdd}>
              <div className="form-group">
                <label>الإنتاج</label>
                <input className="login__input" value={newProd.libelle} onChange={e => setNewProd({ ...newProd, libelle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الوحدة</label>
                <input className="login__input" value={newProd.unite} onChange={e => setNewProd({ ...newProd, unite: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeAdd}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEdit && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>تعديل الإنتاج</h3>
            <form onSubmit={submitEdit}>
              <div className="form-group">
                <label>الإنتاج</label>
                <input className="login__input" value={editProd.libelle} onChange={e => setEditProd({ ...editProd, libelle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الوحدة</label>
                <input className="login__input" value={editProd.unite} onChange={e => setEditProd({ ...editProd, unite: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeEdit}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>الإنتاج</th>
            <th>الوحدة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {productions.map(p => (
            <tr key={p.id}>
              <td data-label="الإنتاج"><span className="card-label">الإنتاج:</span> <span className="card-value">{p.libelle}</span></td>
              <td data-label="الوحدة"><span className="card-label">الوحدة:</span> <span className="card-value">{p.unite}</span></td>
              <td data-label="الإجراءات">
                <button className="edit-btn" onClick={() => openEdit(p)}>تعديل</button>
                <button className="delete-btn" onClick={() => deleteProd(p.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
