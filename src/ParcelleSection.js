import React from 'react';

export default function ParcelleSection({
  agroCombinats,
  parcelles,
  showAddParcelleModal,
  openAddParcelleModal,
  closeAddParcelleModal,
  submitAddParcelle,
  newParcelle,
  setNewParcelle,
  openEditParcelleModal, // à passer depuis AcceuilAdmin
  deleteParcelle         // à passer depuis AcceuilAdmin
}) {
  return (
    <div className="users-container">
      <h2>قائمة الضيعة او القطع</h2>
      <button className="add-btn" onClick={openAddParcelleModal}>➕ إضافة ضيعة أو قطعة</button>
      {showAddParcelleModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة ضيعة أو قطعة جديدة</h3>
            <form onSubmit={submitAddParcelle}>
              <div className="form-group">
                <label>المركب الفلاحي</label>
                <select
                  className="login__input"
                  value={newParcelle.COD_SOC}
                  onChange={e => setNewParcelle({ ...newParcelle, COD_SOC: e.target.value })}
                  required
                >
                  <option value="" disabled>اختر المركب</option>
                  {agroCombinats.map(agro => (
                    <option key={agro.COD_SOC} value={agro.COD_SOC}>{agro.LIB_SOC}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>اسم القطعة</label>
                <input
                  type="text"
                  className="login__input"
                  value={newParcelle.lib_par}
                  onChange={e => setNewParcelle({ ...newParcelle, lib_par: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>المساحة</label>
                <input
                  type="number"
                  className="login__input"
                  value={newParcelle.surface}
                  onChange={e => setNewParcelle({ ...newParcelle, surface: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد</button>
                <button type="button" className="delete-btn" onClick={closeAddParcelleModal}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            {/* <th>المركب الفلاحي</th> */}
            <th>اسم المركب</th>
            {/* <th>كود القطعة</th> */}
            <th>اسم القطعة</th>
            <th>المساحة</th>
            <th>المساحة الجملية</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const grouped = {};
            parcelles.forEach(p => {
              if (!grouped[p.COD_SOC]) grouped[p.COD_SOC] = [];
              grouped[p.COD_SOC].push(p);
            });
            const getLibSoc = codSoc => {
              const found = agroCombinats.find(a => a.COD_SOC === codSoc);
              return found ? found.LIB_SOC : '';
            };
            let rows = [];
            Object.entries(grouped).forEach(([codSoc, parcellesSoc]) => {
              const totalSurface = parcellesSoc.reduce((sum, p) => sum + (parseFloat(p.surface) || 0), 0);
              parcellesSoc.forEach((parcelle, idx) => {
                rows.push(
                  <tr key={parcelle.COD_SOC + '-' + parcelle.cod_par}>
                    {idx === 0 && (
                      <td rowSpan={parcellesSoc.length} data-label="اسم المركب"><span className="card-label">اسم المركب:</span> <span className="card-value">{getLibSoc(parcelle.COD_SOC)}</span></td>
                    )}
                    <td data-label="اسم القطعة"><span className="card-label">اسم القطعة:</span> <span className="card-value">{parcelle.lib_par}</span></td>
                    <td data-label="المساحة"><span className="card-label">المساحة:</span> <span className="card-value">{parcelle.surface}</span></td>
                    {idx === 0 && (
                      <td rowSpan={parcellesSoc.length} data-label="المساحة الجملية" style={{fontWeight: 'bold', color: '#8c5e36'}}>
                        <span className="card-label">المساحة الجملية:</span> <span className="card-value">{totalSurface}</span>
                      </td>
                    )}
                    <td data-label="الإجراءات">
                      <button className="edit-btn" onClick={() => openEditParcelleModal && openEditParcelleModal(parcelle)}>تعديل</button>
                      <button className="delete-btn" onClick={() => deleteParcelle && deleteParcelle(parcelle.COD_SOC, parcelle.cod_par)}>حذف</button>
                    </td>
                  </tr>
                );
              });
            });
            return rows;
          })()}
        </tbody>
      </table>
    </div>
  );
}
