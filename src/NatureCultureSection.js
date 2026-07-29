import React, { useState, useEffect } from 'react';
import { API_URL } from "./config";

export default function NatureCultureSection() {
  const [natures, setNatures] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newNature, setNewNature] = useState({ libelle: '' });
  const [editNature, setEditNature] = useState({ id: '', libelle: '' });

  useEffect(() => {
    fetch(API_URL + '/nature-culture').then(r => r.json()).then(setNatures);
  }, []);

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => { setShowAdd(false); setNewNature({ libelle: '' }); };
  const submitAdd = async (e) => {
    e.preventDefault();
    await fetch(API_URL + '/nature-culture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNature)
    });
    closeAdd();
    fetch(API_URL + '/nature-culture').then(r => r.json()).then(setNatures);
  };

  const openEdit = (nature) => { setEditNature(nature); setShowEdit(true); };
  const closeEdit = () => setShowEdit(false);
  const submitEdit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/nature-culture/${editNature.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editNature)
    });
    closeEdit();
    fetch(API_URL + '/nature-culture').then(r => r.json()).then(setNatures);
  };

  const deleteNature = async (id) => {
    if (window.confirm('Supprimer cette nature ?')) {
      await fetch(`${API_URL}/nature-culture/${id}`, { method: 'DELETE' });
      fetch(API_URL + '/nature-culture').then(r => r.json()).then(setNatures);
    }
  };

  return (
    <div className="users-container">
      <h2>قائمة طبيعة الزراعة</h2>
      <button className="add-btn" onClick={openAdd}>➕ إضافة طبيعة</button>
      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة طبيعة جديدة</h3>
            <form onSubmit={submitAdd}>
              <div className="form-group">
                <label>الطبيعة</label>
                <input className="login__input" value={newNature.libelle} onChange={e => setNewNature({ libelle: e.target.value })} required />
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
            <h3>تعديل الطبيعة</h3>
            <form onSubmit={submitEdit}>
              <div className="form-group">
                <label>الطبيعة</label>
                <input className="login__input" value={editNature.libelle} onChange={e => setEditNature({ ...editNature, libelle: e.target.value })} required />
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
            <th>الطبيعة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {natures.map(n => (
            <tr key={n.id}>
              <td data-label="الطبيعة"><span className="card-label">الطبيعة:</span> <span className="card-value">{n.libelle}</span></td>
              <td data-label="الإجراءات">
                <button className="edit-btn" onClick={() => openEdit(n)}>تعديل</button>
                <button className="delete-btn" onClick={() => deleteNature(n.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
