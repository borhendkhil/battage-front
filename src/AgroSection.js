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
      <h2>قائمة المركبات الفلاحية</h2>
      <button className="add-btn" onClick={openAddAgroModal}>➕ إضافة مركب فلاحي</button>
      {showAddAgroModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة مركب فلاحي جديد</h3>
            <form onSubmit={submitAddAgro}>
              <div className="form-group">
                <label>الكود</label>
                <input type="text" value={newAgro.COD_SOC} onChange={e => setNewAgro({ ...newAgro, COD_SOC: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>اسم المركب</label>
                <input type="text" value={newAgro.LIB_SOC} onChange={e => setNewAgro({ ...newAgro, LIB_SOC: e.target.value })} required className="login__input" />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeAddAgroModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditAgroModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>تعديل المركب الفلاحي</h3>
            <form onSubmit={submitEditAgro}>
              <div className="form-group">
                <label>الكود</label>
                <input type="text" value={editAgro.COD_SOC} readOnly className="login__input" />
              </div>
              <div className="form-group">
                <label>اسم المركب</label>
                <input type="text" value={editAgro.LIB_SOC} onChange={e => setEditAgro({ ...editAgro, LIB_SOC: e.target.value })} required className="login__input" />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeEditAgroModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>الكود</th>
            <th>اسم المركب</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {agroCombinats.map(agro => (
            <tr key={agro.COD_SOC}>
              <td data-label="الكود"><span className="card-label">الكود:</span> <span className="card-value">{agro.COD_SOC}</span></td>
              <td data-label="اسم المركب"><span className="card-label">اسم المركب:</span> <span className="card-value">{agro.LIB_SOC}</span></td>
              <td data-label="الإجراءات">
                <button className="edit-btn" onClick={() => openEditAgroModal(agro)}>تعديل</button>
                <button className="delete-btn" onClick={() => deleteAgro(agro.COD_SOC)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
