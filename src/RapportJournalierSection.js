import React, { useEffect, useState } from 'react';

// Helper pour obtenir la date locale au format YYYY-MM-DD
const getTodayLocal = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// À compléter : formulaire pour ajouter un rapport journalier
export default function RapportJournalierSection() {
  const [parcelles, setParcelles] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [productions, setProductions] = useState([]);
  const [selectedParcelle, setSelectedParcelle] = useState(null);
  const [selectedAffectation, setSelectedAffectation] = useState('');
  const [selectedProduction, setSelectedProduction] = useState('');
  const [surface, setSurface] = useState('');
  const [surfaceMarboota, setSurfaceMarboota] = useState('');
  const [typeMarboota, setTypeMarboota] = useState('');
  const [echanges, setEchanges] = useState('');
  const [stockage, setStockage] = useState('');
  const [commerce, setCommerce] = useState('');
  const [message, setMessage] = useState('');
  const [dateRapport, setDateRapport] = useState(getTodayLocal);
  const [campagne, setCampagne] = useState(null);

  // Récupérer l'utilisateur connecté
  const username = localStorage.getItem('username') || '';
  const [userId, setUserId] = useState('');
  const [productionValue, setProductionValue] = useState('');

  useEffect(() => {
    // Récupérer l'ID utilisateur
    fetch(API_URL + '/utilisateurs')
      .then(r => r.json())
      .then(users => {
        const user = users.find(u => u.username === username);
        if (user) setUserId(user.id);
      });
    // Campagne active
    fetch(API_URL + '/campagne')
      .then(r => r.json())
      .then(data => {
        const active = Array.isArray(data) ? data.find(c => c.etat === 'A') : null;
        setCampagne(active);
      });
    // Parcelles affectées à l'agent pour la campagne active
    fetch(API_URL + '/affectation-agent')
      .then(r => r.json())
      .then(data => setParcelles(Array.isArray(data) ? data.filter(a => a.username === username && a.cod_campagne === (campagne?.cod_campagne || '')) : []));
    // Toutes les affectations culture pour la campagne active
    fetch(API_URL + '/affectation-culture')
      .then(r => r.json())
      .then(setAffectations);
    // Productions
    fetch(API_URL + '/production')
      .then(r => r.json())
      .then(setProductions);
  }, [username, campagne?.cod_campagne]);

  // Affectations culture filtrées pour la parcelle sélectionnée et la campagne active
  const affectationsParcelle = affectations.filter(
    a => {
      // Correction : s'assurer que les types sont cohérents
      const parcelle = parcelles.find(p => String(p.id) === String(selectedParcelle));
      if (!parcelle) return false;
      return (
        a.COD_SOC === parcelle.COD_SOC &&
        a.cod_par === parcelle.cod_par &&
        a.cod_campagne === (campagne?.cod_campagne || '')
      );
    }
  );

  // Pour afficher le libellé du type_culture_id
  const [types, setTypes] = useState([]);
  useEffect(() => {
    fetch(API_URL + '/type-culture')
      .then(r => r.json())
      .then(setTypes);
  }, []);

  const getTypeLibelle = (type_culture_id) => {
    const t = types.find(t => t.id === type_culture_id);
    return t ? t.libelle : type_culture_id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!selectedParcelle || !selectedAffectation || !selectedProduction) {
      setMessage('يرجى اختيار جميع الحقول المطلوبة');
      return;
    }
    const prodId = parseInt(selectedProduction, 10);
    // Vérification production = commerce + stockage + echanges
    const totalParts = (Number(commerce) || 0) + (Number(stockage) || 0) + (Number(echanges) || 0);
    if (productionValue !== '' && Number(productionValue) !== totalParts) {
      setMessage('يرجى التحقق: يجب أن يكون الإنتاج = التسويق + التخزين + المبدلات');
      return;
    }
    let body = {
      date_rapport: dateRapport,
      cod_campagne: campagne.cod_campagne,
      COD_SOC: selectedParcelle.COD_SOC,
      cod_par: selectedParcelle.cod_par,
      affectation_culture_id: selectedAffectation,
      production_id: selectedProduction,
      utilisateur_id: userId,
      echanges,
      stockage,
      commerce,
      production: productionValue 
    };
    if (prodId === 1) {
      body.surface = surface;
      body.surface_marboota = null;
      body.type_marboota = null;
    } else if (prodId === 2) {
      if (!typeMarboota) {
        setMessage("يرجى اختيار نوع الربط");
        return;
      }
      body.surface = null;
      body.surface_marboota = surfaceMarboota;
      body.type_marboota = typeMarboota;
    }
    try {
      const res = await fetch(API_URL + '/rapport-journalier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        setMessage('خطأ في حفظ التقرير');
        return;
      }
      setMessage('تم حفظ التقرير بنجاح');
      setSelectedParcelle(null);
      setSelectedAffectation('');
      setSelectedProduction('');
      setSurface('');
      setSurfaceMarboota('');
      setTypeMarboota('');
      setEchanges('');
      setStockage('');
      setCommerce('');
    } catch {
      setMessage('خطأ في الاتصال بالخادم');
    }
  };

  // DEBUG: Afficher les parcelles pour vérifier leur structure
  useEffect(() => {
    if (parcelles && parcelles.length > 0) {
      console.log('Parcelles chargées:', parcelles);
    }
  }, [parcelles]);

  return (
    <div className="agent-container">
      <h2>إضافة تقرير يومي</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>تاريخ التقرير</label>
          <input
            type="date"
            className="login__input"
            value={dateRapport}
            onChange={e => setDateRapport(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>الموسم الفلاحي الحالي</label>
          <input className="login__input" value={campagne?.libelle || ''} disabled />
        </div>
        <div className="form-group">
          <label>اختر القطعة</label>
          <select
            className="login__input"
            value={selectedParcelle ? selectedParcelle.id : ''}
            onChange={e => {
              const p = parcelles.find(p => String(p.id) === e.target.value);
              setSelectedParcelle(p || null);
              setSelectedAffectation(''); 
            }}
            required
          >
            <option value="">اختر القطعة</option>
            {parcelles && parcelles.length > 0 ? (
              parcelles.map(p => (
                <option key={p.id} value={p.id}>
                  {(p.LIB_SOC || p.lib_soc || p.nom || '؟') + ' - ' + (p.lib_par || p.LIB_PAR || p.nom_par || p.id)}
                </option>
              ))
            ) : (
              <option disabled>لا توجد قطع متاحة</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <label>اختر الزراعة المسندة</label>
          <select
            className="login__input"
            value={selectedAffectation}
            onChange={e => setSelectedAffectation(e.target.value)}
            required
            disabled={!selectedParcelle}
          >
            <option value="">اختر الزراعة</option>
            {affectations
              .filter(a =>
                selectedParcelle &&
                a.COD_SOC === selectedParcelle.COD_SOC &&
                a.cod_par === selectedParcelle.cod_par &&
                a.cod_campagne === (campagne?.cod_campagne || '')
              )
              .map(a => (
                <option key={a.id} value={a.id}>
                  {getTypeLibelle(a.type_culture_id)}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label>اختر الإنتاج</label>
          <select
            className="login__input"
            value={selectedProduction}
            onChange={e => setSelectedProduction(e.target.value)}
            required
          >
            <option value="">اختر الإنتاج</option>
            {productions.map(p => (
              <option key={p.id} value={p.id}>{p.libelle}</option>
            ))}
          </select>
        </div>
        {selectedProduction === '1' && (
          <div className="form-group">
            <label>المساحة المحصودة</label>
            <input
              type="number"
              className="login__input"
              value={surface}
              onChange={e => setSurface(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
        )}
        {selectedProduction === '2' && (
          <>
          <div className="form-group">
            <label>المساحة المربوطة</label>
            <input
              type="number"
              className="login__input"
              value={surfaceMarboota}
              onChange={e => setSurfaceMarboota(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>نوع الربط</label>
            <select
              className="login__input"
              value={typeMarboota}
              onChange={e => setTypeMarboota(e.target.value)}
              required
            >
              <option value="">اختر نوع الربط</option>
              <option value="ربط1">ربط1</option>
              <option value="ربط2">ربط2</option>
            </select>
          </div>
          </>
        )}
        <div className="form-group">
          <label>المبدلات</label>
          <input
            type="number"
            className="login__input"
            value={echanges}
            onChange={e => setEchanges(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>التخزين</label>
          <input
            type="number"
            className="login__input"
            value={stockage}
            onChange={e => setStockage(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>التسويق</label>
          <input
            type="number"
            className="login__input"
            value={commerce}
            onChange={e => setCommerce(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>الإنتاج (الكمية)</label>
          <input
            type="number"
            className="login__input"
            value={productionValue}
            onChange={e => setProductionValue(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="modal-actions">
          <button type="submit" className="add-btn">حفظ التقرير</button>
        </div>
        {message && <div className="affectation-result">{message}</div>}
      </form>
    </div>
  );
}
