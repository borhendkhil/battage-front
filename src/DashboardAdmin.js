import React, { useState, useEffect } from 'react';
import { API_URL } from "./config";
import './DashboardAdmin.css';

function Bar({ value, max, color }) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="dash-bar">
      <div className="dash-bar-fill" style={{ width: width + '%', background: color }}></div>
    </div>
  );
}

function formatNumber(v) {
  const n = parseFloat(v);
  if (isNaN(n)) return '0';
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

export default function DashboardAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch(API_URL + '/dashboard-stats')
      .then(r => r.json())
      .then(json => {
        if (!mounted) return;
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError('Impossible de charger les statistiques.');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="dash-loading">Chargement des statistiques…</div>;
  }
  if (error) {
    return <div className="dash-error">{error}</div>;
  }
  if (!data) return null;

  const parCulture = data.superficieParCulture || [];
  const parAgro = data.superficieParAgro || [];
  const nonCultivee = data.superficieNonCultivee || [];
  const cultureAgro = data.superficieCultureAgro || [];

  const maxCulture = Math.max(...parCulture.map(x => parseFloat(x.superficie) || 0), 1);
  const maxAgro = Math.max(...parAgro.map(x => parseFloat(x.superficie) || 0), 1);

  const totalNonCultivee = nonCultivee.reduce((s, x) => s + (parseFloat(x.superficie_non_cultivee) || 0), 0);

  const statTotals = [
    {
      label: 'Superficie cultivée',
      value: formatNumber(cultureAgro.reduce((s, x) => s + (parseFloat(x.superficie) || 0), 0)),
      unit: 'ha',
      icon: '🌾',
      color: 'linear-gradient(135deg, #e3be6e, #c9954c)'
    },
    {
      label: 'Superficie non cultivée',
      value: formatNumber(totalNonCultivee),
      unit: 'ha',
      icon: '⛰️',
      color: 'linear-gradient(135deg, #8c5e33, #5b3714)'
    },
    {
      label: 'Cultures',
      value: parCulture.length,
      unit: '',
      icon: '🧑‍🌾',
      color: 'linear-gradient(135deg, #ffeb97, #e3be6e)'
    },
    {
      label: 'Complexes agricoles',
      value: parAgro.length,
      unit: '',
      icon: '🏭',
      color: 'linear-gradient(135deg, #c9954c, #8c5e33)'
    }
  ];

  return (
    <div className="dash-root">
      <div className="dash-hero">
        <div className="dash-hero-text">
          <span className="dash-eyebrow">Vue d'ensemble</span>
          <h2>Tableau de bord des superficies</h2>
          <p>Suivi des surfaces cultivées et non cultivées par culture et par complexe agricole.</p>
        </div>
        <div className="dash-hero-badge">Campagne en cours</div>
      </div>

      <div className="dash-totals">
        {statTotals.map(t => (
          <div key={t.label} className="dash-total-card" style={{ background: t.color }}>
            <div className="dash-total-icon">{t.icon}</div>
            <div className="dash-total-meta">
              <span>{t.label}</span>
              <strong>{t.value} <small>{t.unit}</small></strong>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Superficie par culture</h3>
            <span className="dash-card-unit">hectares</span>
          </div>
          {parCulture.length === 0 ? (
            <p className="dash-empty">Aucune donnée.</p>
          ) : (
            <ul className="dash-bars">
              {parCulture.map((x, i) => (
                <li key={i}>
                  <div className="dash-bar-row">
                    <span className="dash-bar-label">{x.culture}</span>
                    <span className="dash-bar-value">{formatNumber(x.superficie)} ha</span>
                  </div>
                  <Bar value={parseFloat(x.superficie) || 0} max={maxCulture} color="linear-gradient(90deg, #ffeb97, #c9954c)" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Superficie par complexe agricole</h3>
            <span className="dash-card-unit">hectares</span>
          </div>
          {parAgro.length === 0 ? (
            <p className="dash-empty">Aucune donnée.</p>
          ) : (
            <ul className="dash-bars">
              {parAgro.map((x, i) => (
                <li key={i}>
                  <div className="dash-bar-row">
                    <span className="dash-bar-label">{x.LIB_SOC || x.COD_SOC}</span>
                    <span className="dash-bar-value">{formatNumber(x.superficie)} ha</span>
                  </div>
                  <Bar value={parseFloat(x.superficie) || 0} max={maxAgro} color="linear-gradient(90deg, #e3be6e, #5b3714)" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="dash-card dash-card-full">
        <div className="dash-card-header">
          <h3>Superficie non cultivée par complexe agricole</h3>
          <span className="dash-card-unit">hectares</span>
        </div>
        {nonCultivee.length === 0 ? (
          <p className="dash-empty">Aucune donnée.</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Complexe agricole</th>
                  <th>Superficie totale</th>
                  <th>Superficie cultivée</th>
                  <th>Non cultivée</th>
                  <th>% cultivé</th>
                </tr>
              </thead>
              <tbody>
                {nonCultivee.map((x, i) => {
                  const total = parseFloat(x.superficie_totale) || 0;
                  const cultivee = parseFloat(x.superficie_cultivee) || 0;
                  const nonCult = parseFloat(x.superficie_non_cultivee) || 0;
                  const pct = total > 0 ? Math.round((cultivee / total) * 100) : 0;
                  return (
                    <tr key={i}>
                      <td><strong>{x.LIB_SOC || x.COD_SOC}</strong></td>
                      <td>{formatNumber(total)}</td>
                      <td>{formatNumber(cultivee)}</td>
                      <td className="dash-cell-warn">{formatNumber(nonCult)}</td>
                      <td>
                        <div className="dash-pct">
                          <span>{pct}%</span>
                          <div className="dash-pct-bar">
                            <div className="dash-pct-fill" style={{ width: pct + '%' }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dash-card dash-card-full">
        <div className="dash-card-header">
          <h3>Superficie par culture et par complexe agricole</h3>
          <span className="dash-card-unit">hectares</span>
        </div>
        {cultureAgro.length === 0 ? (
          <p className="dash-empty">Aucune donnée.</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Complexe agricole</th>
                  <th>Culture</th>
                  <th>Superficie</th>
                </tr>
              </thead>
              <tbody>
                {cultureAgro.map((x, i) => (
                  <tr key={i}>
                    <td><strong>{x.agrocombinat}</strong></td>
                    <td>{x.culture}</td>
                    <td>{formatNumber(x.superficie)} ha</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
