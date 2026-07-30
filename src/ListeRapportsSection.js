import React, { useEffect, useState } from 'react';
import { API_URL } from "./config";

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
      if (loading) setError('Impossible de se connecter au serveur. Vérifiez votre connexion Internet ou réessayez.');
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
        setError('Impossible de se connecter au serveur. Vérifiez votre connexion Internet ou réessayez.');
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
        <title>Rapport journalier</title>
        <style>
          body { font-family: Tahoma, Arial, sans-serif; direction: rtl; padding: 30px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td, th { border: 1px solid #888; padding: 8px; text-align: center; }
        </style>
      </head>
      <body>
        <h2>Rapport journalier</h2>
        <table>
          <tr><th>Date</th><td>${formatDate(rapport.date_rapport)}</td></tr>
          <tr><th>Exploitation</th><td>${rapport.LIB_SOC}</td></tr>
          <tr><th>Parcelle</th><td>${rapport.lib_par}</td></tr>
          <tr><th>Production</th><td>${rapport.production_libelle}</td></tr>
          <tr><th>Surface récoltée</th><td>${rapport.surface ?? '-'}</td></tr>
          <tr><th>Surface liée</th><td>${rapport.surface_marboota ?? '-'}</td></tr>
          <tr><th>Type de liaison</th><td>${rapport.type_marboota ?? '-'}</td></tr>
          <tr><th>Production (quantité)</th><td>${rapport.production ?? '-'}</td></tr>
          <tr><th>Échanges</th><td>${rapport.echanges ?? '-'}</td></tr>
          <tr><th>Stockage</th><td>${rapport.stockage ?? '-'}</td></tr>
          <tr><th>Commercialisation</th><td>${rapport.commerce ?? '-'}</td></tr>
          <tr><th>Utilisateur</th><td>${rapport.username}</td></tr>
        </table>
        <br/><br/>
        <div style="text-align:center;">Signature de l'agent : _______________</div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="agent-container">
      <h2>Liste des rapports journaliers</h2>
      {error ? (
        <div style={{textAlign: 'center', color: 'red', marginTop: 40}}>{error}</div>
      ) : loading ? (
        <div style={{textAlign: 'center', color: '#888', marginTop: 40}}>Chargement...</div>
      ) : rapports.length === 0 ? (
        <div style={{textAlign: 'center', color: '#888', marginTop: 40}}>
          <span>Aucun rapport journalier</span>
        </div>
      ) : (
        <div className="table-responsive" style={{width: '100%', overflowX: 'auto', marginTop: 30}}>
          <table className="users-table rapport-table" dir="rtl" style={{minWidth: 900, width: '100%'}}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Exploitation</th>
                <th>Parcelle</th>
                <th>Production</th>
                <th>Surface récoltée</th>
                <th>Surface liée</th>
                <th>Type de liaison</th>
                <th>Production (quantité)</th>
                <th>Échanges</th>
                <th>Stockage</th>
                <th>Commercialisation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rapports.map(r => (
                <tr key={r.id}>
                  <td data-label="Date"><span className="card-label">Date:</span> <span className="card-value">{formatDate(r.date_rapport)}</span></td>
                  <td data-label="Exploitation"><span className="card-label">Exploitation:</span> <span className="card-value">{r.LIB_SOC}</span></td>
                  <td data-label="Parcelle"><span className="card-label">Parcelle:</span> <span className="card-value">{r.lib_par}</span></td>
                  <td data-label="Production"><span className="card-label">Production:</span> <span className="card-value">{r.production_libelle}</span></td>
                  <td data-label="Surface récoltée"><span className="card-label">Surface récoltée:</span> <span className="card-value">{r.surface ?? '-'}</span></td>
                  <td data-label="Surface liée"><span className="card-label">Surface liée:</span> <span className="card-value">{r.surface_marboota ?? '-'}</span></td>
                  <td data-label="Type de liaison"><span className="card-label">Type de liaison:</span> <span className="card-value">{r.type_marboota ?? '-'}</span></td>
                  <td data-label="Production (quantité)"><span className="card-label">Production (quantité):</span> <span className="card-value">{r.production ?? '-'}</span></td>
                  <td data-label="Échanges"><span className="card-label">Échanges:</span> <span className="card-value">{r.echanges ?? '-'}</span></td>
                  <td data-label="Stockage"><span className="card-label">Stockage:</span> <span className="card-value">{r.stockage ?? '-'}</span></td>
                  <td data-label="Commercialisation"><span className="card-label">Commercialisation:</span> <span className="card-value">{r.commerce ?? '-'}</span></td>
                  <td data-label="Actions">
                    <button className="add-btn" onClick={() => handlePrint(r)}>🖨️ Imprimer</button>
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
