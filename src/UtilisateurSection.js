import React from 'react';

export default function UtilisateurSection({
  utilisateurs,
  showAddUserModal,
  openAddUserModal,
  closeAddUserModal,
  submitAddUser,
  newUser,
  setNewUser,
  showEditUserModal,
  openEditUserModal,
  closeEditUserModal,
  submitEditUser,
  editUser,
  setEditUser,
  deleteUser
}) {
  return (
    <div className="users-container">
      <h2>قائمة المستخدمين</h2>
      <button className="add-btn" onClick={openAddUserModal}>➕ إضافة مستخدم</button>
      {showAddUserModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة مستخدم جديد</h3>
            <form onSubmit={submitAddUser}>
              <div className="form-group">
                <label>اسم المستخدم</label>
                <input type="text" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>كلمة المرور</label>
                <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>الدور</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} required className="login__input">
                  <option value="" disabled>اختر الدور</option>
                  <option value="admin">مدير النظام</option>
                  <option value="super-admin">مدير مركزي</option>
                  <option value="agent-saisie">عون إدخال البيانات</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeAddUserModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditUserModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>تعديل المستخدم</h3>
            <form onSubmit={submitEditUser}>
              <div className="form-group">
                <label>اسم المستخدم</label>
                <input type="text" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>كلمة المرور</label>
                <input type="password" value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} required className="login__input" />
              </div>
              <div className="form-group">
                <label>الدور</label>
                <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })} required className="login__input">
                  <option value="" disabled>اختر الدور</option>
                  <option value="admin">مدير</option>
                  <option value="super-admin">مدير مركزي</option>
                  <option value="agent-saisie">عون إدخال</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeEditUserModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>المعرف</th>
            <th>اسم المستخدم</th>
            <th>الدور</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(user => (
            <tr key={user.id}>
              <td data-label="المعرف"><span className="card-label">المعرف:</span> <span className="card-value">{user.id}</span></td>
              <td data-label="اسم المستخدم"><span className="card-label">اسم المستخدم:</span> <span className="card-value">{user.username}</span></td>
              <td data-label="الدور"><span className="card-label">الدور:</span> <span className="card-value">{user.role === 'admin'
                  ? 'مدير النظام'
                  : user.role === 'super-admin'
                  ? 'مدير مركزي'
                  : user.role === 'agent-saisie'
                  ? 'عون إدخال البيانات'
                  : user.role}</span></td>
              <td data-label="الإجراءات">
                <button className="edit-btn" onClick={() => openEditUserModal(user)}>تعديل</button>
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
