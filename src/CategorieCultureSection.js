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
      <h2>قائمة الفئات الزراعية</h2>
      <button className="add-btn" onClick={openAddCategorieModal}>➕ إضافة فئة زراعية</button>
      {showAddCategorieModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة فئة زراعية جديدة</h3>
            <form onSubmit={submitAddCategorie}>
              <div className="form-group">
                <label>اسم الفئة</label>
                <input
                  type="text"
                  className="login__input"
                  value={newCategorie.libelle}
                  onChange={e => setNewCategorie({ ...newCategorie, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeAddCategorieModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditCategorieModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>تعديل الفئة الزراعية</h3>
            <form onSubmit={submitEditCategorie}>
              <div className="form-group">
                <label>اسم الفئة</label>
                <input
                  type="text"
                  className="login__input"
                  value={editCategorie.libelle}
                  onChange={e => setEditCategorie({ ...editCategorie, libelle: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeEditCategorieModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>المعرف</th>
            <th>اسم الفئة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td data-label="المعرف"><span className="card-label">المعرف:</span> <span className="card-value">{cat.id}</span></td>
              <td data-label="اسم الفئة"><span className="card-label">اسم الفئة:</span> <span className="card-value">{cat.libelle}</span></td>
              <td data-label="الإجراءات">
                <button className="edit-btn" onClick={() => openEditCategorieModal(cat)}>تعديل</button>
                <button className="delete-btn" onClick={() => deleteCategorie(cat.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
