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
    if (window.confirm('Supprimer cette   الموسم الفلاحي ?')) {
      await fetch(`${API_URL}/campagne/${cod_campagne}`, { method: 'DELETE' });
      reload();
    }
  };

  return (
    <div className="users-container">
      <h2>قائمة المواسم الفلاحية</h2>
      <button className="add-btn" onClick={openAdd}>➕ إضافة موسم فلاحي</button>
      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة موسم فلاحي جديد</h3>
            <form onSubmit={submitAdd}>
              <div className="form-group">
                <label>رمز الموسم الفلاحي</label>
                <input className="login__input" value={newCampagne.cod_campagne} onChange={e => setNewCampagne({ ...newCampagne, cod_campagne: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>اسم الموسم الفلاحي</label>
                <input className="login__input" value={newCampagne.libelle} onChange={e => setNewCampagne({ ...newCampagne, libelle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الحالة</label>
                <select className="login__input" value={newCampagne.etat} onChange={e => setNewCampagne({ ...newCampagne, etat: e.target.value })}>
                  <option value="A">الحالي</option>
                  <option value="N">الفائت</option>
                </select>
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
            <h3>تعديل الموسم الفلاحي</h3>
            <form onSubmit={submitEdit}>
              <div className="form-group">
                <label>رمز الموسم الفلاحي</label>
                <input className="login__input" value={editCampagne.cod_campagne} disabled />
              </div>
              <div className="form-group">
                <label>اسم الموسم الفلاحي</label>
                <input className="login__input" value={editCampagne.libelle} onChange={e => setEditCampagne({ ...editCampagne, libelle: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الحالة</label>
                <select className="login__input" value={editCampagne.etat} onChange={e => setEditCampagne({ ...editCampagne, etat: e.target.value })}>
                  <option value="A">الحالي</option>
                  <option value="N">الفائت</option>
                </select>
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
            <th>رمز الموسم الفلاحي</th>
            <th>اسم الموسم الفلاحي</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {campagnes.map(c => (
            <tr key={c.cod_campagne}>
              <td data-label="رمز الموسم الفلاحي"><span className="card-label">رمز الموسم الفلاحي:</span> <span className="card-value">{c.cod_campagne}</span></td>
              <td data-label="اسم الموسم الفلاحي"><span className="card-label">اسم الموسم الفلاحي:</span> <span className="card-value">{c.libelle}</span></td>
              <td data-label="الحالة"><span className="card-label">الحالة:</span> <span className="card-value">{c.etat === 'A' ? 'الحالي' : 'الفائت'}</span></td>
              <td data-label="الإجراءات">
                <button className="edit-btn" onClick={() => openEdit(c)}>تعديل</button>
                <button className="delete-btn" onClick={() => deleteCampagne(c.cod_campagne)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
