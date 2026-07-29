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
      <h2>قائمة الأنواع الزراعية</h2>
      <button className="add-btn" onClick={openAddTypeModal}>➕ إضافة نوع زراعي</button>
      {showAddTypeModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة نوع زراعي جديد</h3>
            <form onSubmit={submitAddType}>
              <div className="form-group">
                <label>اسم النوع</label>
                <input
                  type="text"
                  className="login__input"
                  value={newType.libelle}
                  onChange={e => setNewType({ ...newType, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>الفئة الزراعية</label>
                <select
                  className="login__input"
                  value={newType.categorie_id || ''}
                  onChange={e => setNewType({ ...newType, categorie_id: e.target.value })}
                  required
                >
                  <option value="" disabled>اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.libelle}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeAddTypeModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditTypeModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>تعديل النوع الزراعي</h3>
            <form onSubmit={submitEditType}>
              <div className="form-group">
                <label>اسم النوع</label>
                <input
                  type="text"
                  className="login__input"
                  value={editType.libelle}
                  onChange={e => setEditType({ ...editType, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>الفئة الزراعية</label>
                <select
                  className="login__input"
                  value={editType.categorie_id || ''}
                  onChange={e => setEditType({ ...editType, categorie_id: e.target.value })}
                  required
                >
                  <option value="" disabled>اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.libelle}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeEditTypeModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>المعرف</th>
            <th>اسم النوع</th>
            <th>الفئة الزراعية</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {types.map(type => (
            <tr key={type.id}>
              <td data-label="المعرف"><span className="card-label">المعرف:</span> <span className="card-value">{type.id}</span></td>
              <td data-label="اسم النوع"><span className="card-label">اسم النوع:</span> <span className="card-value">{type.libelle}</span></td>
              <td data-label="الفئة الزراعية"><span className="card-label">الفئة الزراعية:</span> <span className="card-value">{categories.find(cat => cat.id === type.categorie_id)
                  ? categories.find(cat => cat.id === type.categorie_id).libelle
                  : ''}</span></td>
              <td data-label="الإجراءات">
                <button className="edit-btn" onClick={() => openEditTypeModal(type)}>تعديل</button>
                <button className="delete-btn" onClick={() => deleteType(type.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
