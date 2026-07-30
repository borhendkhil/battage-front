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
      <h2>Liste des parcelles</h2>
      <button className="add-btn" onClick={openAddParcelleModal}>➕ Ajouter une parcelle</button>
      {showAddParcelleModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Nouvelle parcelle</h3>
            <form onSubmit={submitAddParcelle}>
              <div className="form-group">
                <label>Exploitation</label>
                <select
                  className="login__input"
                  value={newParcelle.COD_SOC}
                  onChange={e => setNewParcelle({ ...newParcelle, COD_SOC: e.target.value })}
                  required
                >
                  <option value="" disabled>Sélectionner l'exploitation</option>
                  {agroCombinats.map(agro => (
                    <option key={agro.COD_SOC} value={agro.COD_SOC}>{agro.LIB_SOC}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Nom de la parcelle</label>
                <input
                  type="text"
                  className="login__input"
                  value={newParcelle.lib_par}
                  onChange={e => setNewParcelle({ ...newParcelle, lib_par: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Surface</label>
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
                <button type="submit" className="add-btn">Confirmer</button>
                <button type="button" className="delete-btn" onClick={closeAddParcelleModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            {/* <th>Exploitation</th> */}
            <th>Nom de l'exploitation</th>
            {/* <th>Code parcelle</th> */}
            <th>Nom de la parcelle</th>
            <th>Surface</th>
            <th>Surface totale</th>
            <th>Actions</th>
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
                      <td rowSpan={parcellesSoc.length} data-label="Nom de l'exploitation"><span className="card-label">Nom de l'exploitation:</span> <span className="card-value">{getLibSoc(parcelle.COD_SOC)}</span></td>
                    )}
                    <td data-label="Nom de la parcelle"><span className="card-label">Nom de la parcelle:</span> <span className="card-value">{parcelle.lib_par}</span></td>
                    <td data-label="Surface"><span className="card-label">Surface:</span> <span className="card-value">{parcelle.surface}</span></td>
                    {idx === 0 && (
                      <td rowSpan={parcellesSoc.length} data-label="Surface totale" style={{fontWeight: 'bold', color: '#8c5e36'}}>
                        <span className="card-label">Surface totale:</span> <span className="card-value">{totalSurface}</span>
                      </td>
                    )}
                    <td data-label="Actions">
                      <button className="edit-btn" onClick={() => openEditParcelleModal && openEditParcelleModal(parcelle)}>Modifier</button>
                      <button className="delete-btn" onClick={() => deleteParcelle && deleteParcelle(parcelle.COD_SOC, parcelle.cod_par)}>Supprimer</button>
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
