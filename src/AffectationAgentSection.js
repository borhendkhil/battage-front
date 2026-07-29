import React, { useEffect, useState } from 'react';

export default function AffectationAgentSection() {
  const [agents, setAgents] = useState([]);
  const [agros, setAgros] = useState([]);
  const [parcelles, setParcelles] = useState([]);
  const [campagnes, setCampagnes] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedAgro, setSelectedAgro] = useState('');
  const [selectedParcelles, setSelectedParcelles] = useState([]);
  const [selectedCampagne, setSelectedCampagne] = useState('');
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAffect, setEditAffect] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'agent-saisie' });
  const [userMessage, setUserMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(API_URL + '/utilisateurs')
      .then(r => r.json())
      .then(data => setAgents(Array.isArray(data) ? data.filter(u => u.role === 'agent-saisie') : []));
    fetch(API_URL + '/agro-combinats')
      .then(r => r.json())
      .then(data => setAgros(Array.isArray(data) ? data : []));
    fetch(API_URL + '/parcelles')
      .then(r => r.json())
      .then(data => setParcelles(Array.isArray(data) ? data : []));
    fetch(API_URL + '/campagne')
      .then(r => r.json())
      .then(data => {
        const active = Array.isArray(data) ? data.find(c => c.etat === 'A') : null;
        setCampagnes(active ? [active] : []);
        setSelectedCampagne(active ? active.cod_campagne : '');
      });
    reloadAffectations();
  }, []);

  const reloadAffectations = () => {
    fetch(API_URL + '/affectation-agent')
      .then(async r => {
        let data;
        try {
          data = await r.json();
        } catch {
          data = [];
        }
        setAffectations(Array.isArray(data) ? data : []);
      });
  };

  const parcellesFiltered = agros.length && selectedAgro
    ? parcelles.filter(p => p.COD_SOC === selectedAgro)
    : [];

  const handleParcelleToggle = (cod_par) => {
    setSelectedParcelles(prev =>
      prev.includes(cod_par)
        ? prev.filter(p => p !== cod_par)
        : [...prev, cod_par]
    );
  };

  const handleAffecter = async (e) => {
    e.preventDefault();
    setMessage('');
    // Correction : la campagne doit être prise automatiquement (active)
    const campagneActive = campagnes[0]?.cod_campagne || '';
    if (!selectedAgent) {
      setMessage('يرجى اختيار العون');
      return;
    }
    if (!selectedAgro) {
      setMessage('يرجى اختيار مركب');
      return;
    }
    if (!campagneActive) {
      setMessage('لا يوجد موسم فلاحي نشط');
      return;
    }
    if (!selectedParcelles || selectedParcelles.length === 0) {
      setMessage('يرجى اختيار قطعة واحدة على الأقل');
      return;
    }
    let ok = true;
    for (const cod_par of selectedParcelles) {
      const res = await fetch(API_URL + '/affectation-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedAgent,
          COD_SOC: selectedAgro,
          cod_par,
          cod_campagne: campagneActive
        })
      });
      if (!res.ok) {
        ok = false;
        const err = await res.json();
        setMessage(err.message || 'Erreur lors de l\'affectation');
      }
    }
    if (ok) {
      setMessage('تمت عملية الإسناد بنجاح');
      setSelectedParcelles([]);
      setShowAddModal(false);
      reloadAffectations();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل تريد حذف هذا الإسناد؟')) {
      await fetch(`${API_URL}/affectation-agent/${id}`, { method: 'DELETE' });
      reloadAffectations();
    }
  };

  const openAddModal = () => {
    setSelectedAgent('');
    setSelectedAgro('');
    setSelectedParcelles([]);
    setSelectedCampagne('');
    setMessage('');
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setMessage('');
  };

  // Préremplir le formulaire d'édition
  const openEditModal = (affect) => {
    setEditAffect({
      id: affect.id,
      agent_id: affect.agent_id,
      COD_SOC: affect.COD_SOC,
      cod_par: affect.cod_par,
      cod_campagne: affect.cod_campagne
    });
    setShowEditModal(true);
    setMessage('');
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditAffect(null);
    setMessage('');
  };

  const handleEditChange = (field, value) => {
    setEditAffect(prev => ({ ...prev, [field]: value }));
  };

  const handleEditParcelleToggle = (cod_par) => {
    setEditAffect(prev => ({
      ...prev,
      cod_par: cod_par
    }));
  };

  const submitEditAffect = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!editAffect.agent_id || !editAffect.COD_SOC || !editAffect.cod_par || !editAffect.cod_campagne) {
      setMessage('يرجى اختيار جميع الحقول');
      return;
    }
    const res = await fetch(`${API_URL}/affectation-agent/${editAffect.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editAffect)
    });
    if (!res.ok) {
      const err = await res.json();
      setMessage(err.message || 'Erreur lors de la modification');
      return;
    }
    setShowEditModal(false);
    setEditAffect(null);
    reloadAffectations();
    setMessage('تم التعديل بنجاح');
  };

  // Ajout utilisateur
  const openAddUserModal = () => {
    setNewUser({ username: '', password: '', role: 'agent-saisie' });
    setUserMessage('');
    setShowAddUserModal(true);
  };
  const closeAddUserModal = () => setShowAddUserModal(false);
  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserMessage('');
    if (!newUser.username || !newUser.password || !newUser.role) {
      setUserMessage('يرجى ملء جميع الحقول');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/utilisateurs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) {
        setUserMessage('حدث خطأ أثناء إضافة المستخدم');
        return;
      }
      setUserMessage('تمت إضافة المستخدم بنجاح');
      setShowAddUserModal(false);
    } catch (err) {
      setUserMessage('خطأ في الاتصال بالشبكة');
    }
  };

  return (
    <div className="affectation-container">
      <h2>إسناد أعوان إلى قطع ومركبات</h2>
      <button className="add-btn" onClick={openAddModal}>➕ إضافة إسناد عون</button>
      <button className="add-btn" onClick={openAddUserModal}>➕ إضافة مستخدم</button>
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إسناد عون إلى قطع ومركبات</h3>
            <form onSubmit={handleAffecter}>
              <div className="form-group">
                <label>اختر العون</label>
                <select
                  className="login__input"
                  value={selectedAgent}
                  onChange={e => setSelectedAgent(e.target.value)}
                  required
                >
                  <option value="">اختر العون</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.username}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>الموسم الفلاحي الحالي</label>
                <input
                  className="login__input"
                  value={campagnes[0]?.libelle || ''}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>اختر المركب الفلاحي</label>
                <select
                  className="login__input"
                  value={selectedAgro}
                  onChange={e => {
                    setSelectedAgro(e.target.value);
                    setSelectedParcelles([]);
                  }}
                  required
                >
                  <option value="">اختر المركب</option>
                  {agros.map(a => (
                    <option key={a.COD_SOC} value={a.COD_SOC}>{a.LIB_SOC}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>اختر القطع</label>
                <div className="agro-list">
                  {parcellesFiltered.length === 0 && <span>اختر مركب لعرض القطع</span>}
                  {parcellesFiltered.map(p => (
                    <div key={p.cod_par}>
                      <input
                        type="checkbox"
                        checked={selectedParcelles.includes(p.cod_par)}
                        onChange={() => handleParcelleToggle(p.cod_par)}
                        id={`parcelle-${p.cod_par}`}
                      />
                      <label htmlFor={`parcelle-${p.cod_par}`}>{p.lib_par} (المساحة: {p.surface})</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد الإسناد</button>
                <button type="button" className="delete-btn" onClick={closeAddModal}>إلغاء</button>
              </div>
              {message && <div className="affectation-result">{message}</div>}
            </form>
          </div>
        </div>
      )}
      {showEditModal && editAffect && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>تعديل إسناد العون</h3>
            <form onSubmit={submitEditAffect}>
              <div className="form-group">
                <label>اختر العون</label>
                <select
                  className="login__input"
                  value={editAffect.agent_id}
                  onChange={e => handleEditChange('agent_id', e.target.value)}
                  required
                >
                  <option value="">اختر العون</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.username}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>الموسم الفلاحي الحالي</label>
                <input
                  className="login__input"
                  value={campagnes[0]?.libelle || ''}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>اختر المركب الفلاحي</label>
                <select
                  className="login__input"
                  value={editAffect.COD_SOC}
                  onChange={e => handleEditChange('COD_SOC', e.target.value)}
                  required
                >
                  <option value="">اختر المركب</option>
                  {agros.map(a => (
                    <option key={a.COD_SOC} value={a.COD_SOC}>{a.LIB_SOC}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>اختر القطعة</label>
                <div className="agro-list">
                  {parcelles
                    .filter(p => p.COD_SOC === editAffect.COD_SOC)
                    .map(p => (
                      <div key={p.cod_par}>
                        <input
                          type="radio"
                          checked={editAffect.cod_par === p.cod_par}
                          onChange={() => handleEditParcelleToggle(p.cod_par)}
                          id={`edit-parcelle-${p.cod_par}`}
                        />
                        <label htmlFor={`edit-parcelle-${p.cod_par}`}>{p.lib_par} (المساحة: {p.surface})</label>
                      </div>
                    ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">تأكيد التعديل</button>
                <button type="button" className="delete-btn" onClick={closeEditModal}>إلغاء</button>
              </div>
              {message && <div className="affectation-result">{message}</div>}
            </form>
          </div>
        </div>
      )}
      {showAddUserModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>إضافة مستخدم جديد</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>اسم المستخدم</label>
                <input className="login__input" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>كلمة المرور</label>
                <input className="login__input" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>الدور</label>
                <select className="login__input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} required>
                  <option value="agent-saisie">عون</option>
                  <option value="admin">مدير</option>
                  <option value="super-admin">مدير عام</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="add-btn">إضافة</button>
                <button type="button" className="delete-btn" onClick={closeAddUserModal}>إلغاء</button>
              </div>
              {userMessage && <div className="affectation-result">{userMessage}</div>}
            </form>
          </div>
        </div>
      )}
      <h2 style={{marginTop: 30}}>قائمة الإسنادات</h2>
      <table className="users-table" dir="rtl">
        <thead>
          <tr>
            <th>العون</th>
            <th>الموسم الفلاحي</th>
            <th>المركب</th>
            <th>القطعة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {/* Group by agent_id for rowspan */}
          {(() => {
            if (!Array.isArray(affectations)) return null;
            // Group by agent_id
            const grouped = {};
            affectations.forEach(a => {
              if (!grouped[a.agent_id]) grouped[a.agent_id] = [];
              grouped[a.agent_id].push(a);
            });
            let rows = [];
            Object.entries(grouped).forEach(([agent_id, list]) => {
              list.forEach((a, idx) => {
                rows.push(
                  <tr key={a.id}>
                    {idx === 0 && (
                      <td rowSpan={list.length} data-label="العون"><span className="card-label">العون:</span> <span className="card-value">{a.username}</span></td>
                    )}
                    <td data-label="الموسم الفلاحي"><span className="card-label">الموسم الفلاحي:</span> <span className="card-value">{a.campagne_libelle}</span></td>
                    <td data-label="المركب"><span className="card-label">المركب:</span> <span className="card-value">{a.LIB_SOC}</span></td>
                    <td data-label="القطعة"><span className="card-label">القطعة:</span> <span className="card-value">{a.lib_par}</span></td>
                    <td data-label="الإجراءات">
                      <button className="edit-btn" onClick={() => openEditModal(a)}>تعديل</button>
                      <button className="delete-btn" onClick={() => handleDelete(a.id)}>حذف</button>
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
