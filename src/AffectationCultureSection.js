import React, { useState, useEffect } from 'react';

export default function AffectationCultureSection() {
  const [affectations, setAffectations] = useState([]);
  const [agros, setAgros] = useState([]);
  const [parcelles, setParcelles] = useState([]);
  const [campagnes, setCampagnes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [natures, setNatures] = useState([]);
  const [productions, setProductions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newAffect, setNewAffect] = useState({
    COD_SOC: '',
    cod_par: '',
    cod_campagne: '',
    categorie_id: '',
    type_culture_id: '',
    nature_culture_id: '',
    production_id: '',
    surface_affectee: ''
  });
  const [editAffect, setEditAffect] = useState({
    id: '',
    COD_SOC: '',
    cod_par: '',
    cod_campagne: '',
    categorie_id: '',
    type_culture_id: '',
    nature_culture_id: '',
    production_id: '',
    surface_affectee: ''
  });

  // Chargement des données nécessaires
  useEffect(() => {
    fetch(API_URL + '/affectation-culture').then(r => r.json()).then(setAffectations);
    fetch(API_URL + '/agro-combinats').then(r => r.json()).then(setAgros);
    fetch(API_URL + '/parcelles').then(r => r.json()).then(setParcelles);
    fetch(API_URL + '/campagne').then(r => r.json()).then(data => {
      setCampagnes(data);
      // Préselectionner la campagne active pour ajout (clé technique !)
      const active = data.find(c => c.etat === 'A');
      if (active) {
        setNewAffect(na => ({ ...na, cod_campagne: active.cod_campagne }));
      }
    });
    fetch(API_URL + '/categorie-culture').then(r => r.json()).then(setCategories);
    fetch(API_URL + '/type-culture').then(r => r.json()).then(setTypes);
    fetch(API_URL + '/nature-culture').then(r => r.json()).then(setNatures);
    fetch(API_URL + '/production').then(r => r.json()).then(setProductions);
  }, []);

  const reload = () => {
    fetch(API_URL + '/affectation-culture').then(r => r.json()).then(setAffectations);
  };

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => { setShowAdd(false); setNewAffect({
    COD_SOC: '', cod_par: '', cod_campagne: '', categorie_id: '', type_culture_id: '', nature_culture_id: '', production_id: '', surface_affectee: ''
  }); };
  const submitAdd = async (e) => {
    e.preventDefault();
    // Vérification côté client : surface_affectee <= surface de la parcelle sélectionnée
    const parcelle = parcelles.find(
      p =>
        p.COD_SOC === newAffect.COD_SOC &&
        p.cod_par === newAffect.cod_par
    );
    if (parcelle && parseFloat(newAffect.surface_affectee) > parseFloat(parcelle.surface)) {
      alert('المساحة المبذورة  يجب أن لا تتجاوز مساحة القطعة المختارة');
      return;
    }
    // Si production_id n'est pas utilisé côté backend, retirez-le de l'objet envoyé
    const affectToSend = { ...newAffect };
    delete affectToSend.production_id;
    try {
      const res = await fetch(API_URL + '/affectation-culture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(affectToSend)
      });
      if (!res.ok) {
        const err = await res.text();
        alert('Erreur serveur: ' + err);
        return;
      }
      closeAdd();
      reload();
    } catch (err) {
      alert('Erreur réseau lors de l\'ajout');
    }
  };

  const openEdit = (aff) => { setEditAffect(aff); setShowEdit(true); };
  const closeEdit = () => setShowEdit(false);
  const submitEdit = async (e) => {
    e.preventDefault();
    // Vérification côté client : surface_affectee <= surface de la parcelle sélectionnée
    const parcelle = parcelles.find(
      p =>
        p.COD_SOC === editAffect.COD_SOC &&
        p.cod_par === editAffect.cod_par
    );
    if (parcelle && parseFloat(editAffect.surface_affectee) > parseFloat(parcelle.surface)) {
      alert('المساحة المبذورة  يجب أن لا تتجاوز مساحة القطعة المختارة');
      return;
    }
    // Si production_id n'est pas utilisé côté backend, retirez-le de l'objet envoyé
    const affectToSend = { ...editAffect };
    delete affectToSend.production_id;
    try {
      const res = await fetch(`${API_URL}/affectation-culture/${editAffect.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(affectToSend)
      });
      if (!res.ok) {
        const err = await res.text();
        alert('Erreur serveur: ' + err);
        return;
      }
      closeEdit();
      reload();
    } catch (err) {
      alert('Erreur réseau lors de la modification');
    }
  };

  const deleteAffect = async (id) => {
    if (window.confirm('Supprimer cette affectation ?')) {
      await fetch(`${API_URL}/affectation-culture/${id}`, { method: 'DELETE' });
      reload();
    }
  };

  // Filtrer les parcelles selon le COD_SOC sélectionné
  const parcellesFiltered = (COD_SOC) => parcelles.filter(p => p.COD_SOC === COD_SOC);

  return (
    <div className="users-container">
      <h2>إسناد زراعات للقطع</h2>
      <button className="add-btn" onClick={openAdd}>➕ إضافة إسناد</button>
      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة إسناد جديد</h3>
            <form onSubmit={submitAdd}>
              <div className="form-group">
                <label>المركب الفلاحي</label>
                <select
                  className="login__input"
                  value={newAffect.COD_SOC}
                  onChange={e => setNewAffect({ ...newAffect, COD_SOC: e.target.value, cod_par: '' })}
                  required
                >
                  <option value="">اختر المركب</option>
                  {agros.map(a => <option key={a.COD_SOC} value={a.COD_SOC}>{a.LIB_SOC}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>القطعة</label>
                <select
                  className="login__input"
                  value={newAffect.cod_par}
                  onChange={e => setNewAffect({ ...newAffect, cod_par: e.target.value })}
                  required
                >
                  <option value="">اختر القطعة</option>
                  {parcellesFiltered(newAffect.COD_SOC).map(p => <option key={p.cod_par} value={p.cod_par}>{p.lib_par}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>مساحة القطعة المختارة</label>
                <input
                  className="login__input"
                  type="number"
                  value={
                    parcelles.find(
                      p =>
                        p.COD_SOC === newAffect.COD_SOC &&
                        p.cod_par === newAffect.cod_par
                    )?.surface || ''
                  }
                  disabled
                />
              </div>
              <div className="form-group">
                <label>الموسم الفلاحي</label>
                {/* Affiche la campagne active seulement, non modifiable */}
                <input
                  className="login__input"
                  value={
                    campagnes.find(c => c.etat === 'A')?.libelle || ''
                  }
                  disabled
                />
              </div>
              <div className="form-group">
                <label>الفئة الزراعية</label>
                <select className="login__input" value={newAffect.categorie_id} onChange={e => setNewAffect({ ...newAffect, categorie_id: e.target.value })} required>
                  <option value="">اختر الفئة</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.libelle}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>النوع الزراعي</label>
                <select className="login__input" value={newAffect.type_culture_id} onChange={e => setNewAffect({ ...newAffect, type_culture_id: e.target.value })} required>
                  <option value="">اختر النوع</option>
                  {types.filter(t => String(t.categorie_id) === String(newAffect.categorie_id)).map(t => (
                    <option key={t.id} value={t.id}>{t.libelle}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>طبيعة الزراعة</label>
                <select className="login__input" value={newAffect.nature_culture_id} onChange={e => setNewAffect({ ...newAffect, nature_culture_id: e.target.value })} required>
                  <option value="">اختر الطبيعة</option>
                  {natures.map(n => <option key={n.id} value={n.id}>{n.libelle}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>المساحة المبذورة </label>
                <input className="login__input" type="number" value={newAffect.surface_affectee} onChange={e => setNewAffect({ ...newAffect, surface_affectee: e.target.value })} required min="0" step="0.01" />
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
            <h3>تعديل الإسناد</h3>
            <form onSubmit={submitEdit}>
              <div className="form-group">
                <label>المركب الفلاحي</label>
                <select className="login__input" value={editAffect.COD_SOC} onChange={e => setEditAffect({ ...editAffect, COD_SOC: e.target.value, cod_par: '' })} required>
                  <option value="">اختر المركب</option>
                  {agros.map(a => <option key={a.COD_SOC} value={a.COD_SOC}>{a.LIB_SOC}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>القطعة</label>
                <select className="login__input" value={editAffect.cod_par} onChange={e => setEditAffect({ ...editAffect, cod_par: e.target.value })} required>
                  <option value="">اختر القطعة</option>
                  {parcellesFiltered(editAffect.COD_SOC).map(p => <option key={p.cod_par} value={p.cod_par}>{p.lib_par}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>الموسم الفلاحي</label>
                {/* Affiche la campagne active seulement, non modifiable */}
                <input
                  className="login__input"
                  value={
                    campagnes.find(c => c.etat === 'A')?.libelle || ''
                  }
                  disabled
                />
              </div>
              <div className="form-group">
                <label>الفئة الزراعية</label>
                <select className="login__input" value={editAffect.categorie_id} onChange={e => setEditAffect({ ...editAffect, categorie_id: e.target.value })} required>
                  <option value="">اختر الفئة</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.libelle}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>النوع الزراعي</label>
                <select className="login__input" value={editAffect.type_culture_id} onChange={e => setEditAffect({ ...editAffect, type_culture_id: e.target.value })} required>
                  <option value="">اختر النوع</option>
                  {types.filter(t => String(t.categorie_id) === String(editAffect.categorie_id)).map(t => (
                    <option key={t.id} value={t.id}>{t.libelle}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>طبيعة الزراعة</label>
                <select className="login__input" value={editAffect.nature_culture_id} onChange={e => setEditAffect({ ...editAffect, nature_culture_id: e.target.value })} required>
                  <option value="">اختر الطبيعة</option>
                  {natures.map(n => <option key={n.id} value={n.id}>{n.libelle}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>مساحة القطعة المختارة</label>
                <input
                  className="login__input"
                  type="number"
                  value={
                    parcelles.find(
                      p =>
                        p.COD_SOC === editAffect.COD_SOC &&
                        p.cod_par === editAffect.cod_par
                    )?.surface || ''
                  }
                  disabled
                />
              </div>
              <div className="form-group">
                <label>المساحة المبذورة </label>
                <input
                  className="login__input"
                  type="number"
                  value={editAffect.surface_affectee}
                  onChange={e => setEditAffect({ ...editAffect, surface_affectee: e.target.value })}
                  required
                  min="0"
                  max={
                    parcelles.find(
                      p =>
                        p.COD_SOC === editAffect.COD_SOC &&
                        p.cod_par === editAffect.cod_par
                    )?.surface || undefined
                  }
                  step="0.01"
                />
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
            <th>المركب</th>
            <th>القطعة</th>
            <th>الموسم الفلاحي</th>
            <th>الفئة</th>
            <th>النوع</th>
            <th>الطبيعة</th>
            {/* <th>الإنتاج</th> */}
            <th>المساحة المبذورة </th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {affectations.map(a => (
            <tr key={a.id}>
              <td data-label="المركب"><span className="card-label">المركب:</span> <span className="card-value">{agros.find(x => x.COD_SOC === a.COD_SOC)?.LIB_SOC || a.COD_SOC}</span></td>
              <td data-label="القطعة"><span className="card-label">القطعة:</span> <span className="card-value">{parcelles.find(p => p.COD_SOC === a.COD_SOC && p.cod_par === a.cod_par)?.lib_par || a.cod_par}</span></td>
              <td data-label="الموسم الفلاحي"><span className="card-label">الموسم الفلاحي:</span> <span className="card-value">{campagnes.find(c => c.cod_campagne === a.cod_campagne)?.libelle || a.cod_campagne}</span></td>
              <td data-label="الفئة"><span className="card-label">الفئة:</span> <span className="card-value">{categories.find(c => c.id === a.categorie_id)?.libelle || a.categorie_id}</span></td>
              <td data-label="النوع">
                <span className="card-label">النوع:</span>
                <span className="card-value">
                  {types.find(t => t.id === a.type_culture_id && t.categorie_id === a.categorie_id)?.libelle || '-'}
                </span>
              </td>
              <td data-label="الطبيعة"><span className="card-label">الطبيعة:</span> <span className="card-value">{natures.find(n => n.id === a.nature_culture_id)?.libelle || a.nature_culture_id}</span></td>
              {/* <td>{productions.find(p => p.id === a.production_id)?.libelle || a.production_id}</td> */}
              <td data-label="المساحة المبذورة "><span className="card-label">المساحة المبذورة :</span> <span className="card-value">{a.surface_affectee}</span></td>
              <td data-label="الإجراءات">
                <button className="edit-btn" onClick={() => openEdit(a)}>تعديل</button>
                <button className="delete-btn" onClick={() => deleteAffect(a.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
