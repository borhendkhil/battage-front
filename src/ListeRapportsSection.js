import React, { useEffect, useState } from 'react';

// À compléter : affichage de la liste des rapports journaliers de l'agent connecté
export default function ListeRapportsSection() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username') || '';
  const [userId, setUserId] = useState('');

  // Timeout pour détecter un problème réseau
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (loading) setError('تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت أو أعد المحاولة.');
    }, 10000); // 10 secondes
    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    // Get userId for the connected user
    fetch(API_URL + '/utilisateurs')
      .then(r => r.json())
      .then(users => {
        const user = users.find(u => u.username === username);
        if (user) setUserId(user.id);
      });
  }, [username]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    fetch(`${API_URL}/rapport-journalier?utilisateur_id=${userId}`)
      .then(r => r.json())
      .then(data => {
        let arr = Array.isArray(data) ? data : [];
        // Sort by date_rapport descending
        arr.sort((a, b) => (b.date_rapport || '').localeCompare(a.date_rapport || ''));
        setRapports(arr);
        setLoading(false);
      })
      .catch((e) => {
        setError('تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت أو أعد المحاولة.');
        setLoading(false);
      });
  }, [userId]);

  // Helper to format date (YYYY-MM-DD, sans timezone)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return String(dateStr).slice(0, 10);
  };

  const handlePrint = (rapport) => {
    // Open a new window with printable content
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(`
      <html>
      <head>
        <title>تقرير يومي</title>
        <style>
          body { font-family: Tahoma, Arial, sans-serif; direction: rtl; padding: 30px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td, th { border: 1px solid #888; padding: 8px; text-align: center; }
        </style>
      </head>
      <body>
        <h2>تقرير يومي</h2>
        <table>
          <tr><th>التاريخ</th><td>${formatDate(rapport.date_rapport)}</td></tr>
          <tr><th>المركب</th><td>${rapport.LIB_SOC}</td></tr>
          <tr><th>القطعة</th><td>${rapport.lib_par}</td></tr>
          <tr><th>الإنتاج</th><td>${rapport.production_libelle}</td></tr>
          <tr><th>المساحة المحصودة</th><td>${rapport.surface ?? '-'}</td></tr>
          <tr><th>المساحة المربوطة</th><td>${rapport.surface_marboota ?? '-'}</td></tr>
          <tr><th>نوع الربط</th><td>${rapport.type_marboota ?? '-'}</td></tr>
          <tr><th>الإنتاج (الكمية)</th><td>${rapport.production ?? '-'}</td></tr>
          <tr><th>المبدلات</th><td>${rapport.echanges ?? '-'}</td></tr>
          <tr><th>التخزين</th><td>${rapport.stockage ?? '-'}</td></tr>
          <tr><th>التسويق</th><td>${rapport.commerce ?? '-'}</td></tr>
          <tr><th>المستخدم</th><td>${rapport.username}</td></tr>
        </table>
        <br/><br/>
        <div style="text-align:center;">توقيع العون: _______________</div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="agent-container">
      <h2>قائمة التقارير اليومية</h2>
      {error ? (
        <div style={{textAlign: 'center', color: 'red', marginTop: 40}}>{error}</div>
      ) : loading ? (
        <div style={{textAlign: 'center', color: '#888', marginTop: 40}}>جاري التحميل...</div>
      ) : rapports.length === 0 ? (
        <div style={{textAlign: 'center', color: '#888', marginTop: 40}}>
          <span>لا توجد تقارير يومية</span>
        </div>
      ) : (
        <div className="table-responsive" style={{width: '100%', overflowX: 'auto', marginTop: 30}}>
          <table className="users-table rapport-table" dir="rtl" style={{minWidth: 900, width: '100%'}}>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>المركب</th>
                <th>القطعة</th>
                <th>الإنتاج</th>
                <th>المساحة المحصودة</th>
                <th>المساحة المربوطة</th>
                <th>نوع الربط</th>
                <th>الإنتاج (الكمية)</th>
                <th>المبدلات</th>
                <th>التخزين</th>
                <th>التسويق</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rapports.map(r => (
                <tr key={r.id}>
                  <td data-label="التاريخ"><span className="card-label">التاريخ:</span> <span className="card-value">{formatDate(r.date_rapport)}</span></td>
                  <td data-label="المركب"><span className="card-label">المركب:</span> <span className="card-value">{r.LIB_SOC}</span></td>
                  <td data-label="القطعة"><span className="card-label">القطعة:</span> <span className="card-value">{r.lib_par}</span></td>
                  <td data-label="الإنتاج"><span className="card-label">الإنتاج:</span> <span className="card-value">{r.production_libelle}</span></td>
                  <td data-label="المساحة المحصودة"><span className="card-label">المساحة المحصودة:</span> <span className="card-value">{r.surface ?? '-'}</span></td>
                  <td data-label="المساحة المربوطة"><span className="card-label">المساحة المربوطة:</span> <span className="card-value">{r.surface_marboota ?? '-'}</span></td>
                  <td data-label="نوع الربط"><span className="card-label">نوع الربط:</span> <span className="card-value">{r.type_marboota ?? '-'}</span></td>
                  <td data-label="الإنتاج (الكمية)"><span className="card-label">الإنتاج (الكمية):</span> <span className="card-value">{r.production ?? '-'}</span></td>
                  <td data-label="المبدلات"><span className="card-label">المبدلات:</span> <span className="card-value">{r.echanges ?? '-'}</span></td>
                  <td data-label="التخزين"><span className="card-label">التخزين:</span> <span className="card-value">{r.stockage ?? '-'}</span></td>
                  <td data-label="التسويق"><span className="card-label">التسويق:</span> <span className="card-value">{r.commerce ?? '-'}</span></td>
                  <td data-label="إجراءات">
                    <button className="add-btn" onClick={() => handlePrint(r)}>🖨️ طباعة</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
