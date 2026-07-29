import React, { useState, useEffect } from 'react';
import RapportJournalierSection from './RapportJournalierSection';
import ListeRapportsSection from './ListeRapportsSection';
import NavbarAgent from './NavbarAgent';
import './AcceuilAgent.css';

export default function AcceuilAgent() {
  const [section, setSection] = useState('rapport');
  const [rapportCount, setRapportCount] = useState(0);
  const bg = require('./assets/bg-img.jpg');

  const sectionLabels = {
    rapport: 'إدخال تقرير',
    liste: 'قائمة التقارير',
  };

  const sectionLabel = sectionLabels[section] || 'الرئيسية';
  const todayLabel = new Date().toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    fetch(API_URL + '/rapport-journalier')
      .then((res) => res.json())
      .then((data) => setRapportCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  return (
    <div
      className="background_wrapper"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        marginBottom: '50px',
        paddingBottom: '50px',
        width: '100%',
        height: '100%',
        position: 'relative',
        top: 0,
        left: 0,
      }}
    >
      <NavbarAgent onNav={setSection} />

      <div className="agent-container">
        <div className="agent-intro">
          <h2>لوحة تحكم وكيل الإدخال</h2>
          <p>عرض سريع لحالة التقارير اليومية والوضع الحالي للنظام.</p>
        </div>

        <div className="dashboard-panel" style={{ padding: '24px 20px 8px' }}>
          <div className="dashboard-cards">
            <div className="stat-card">
              <span>عدد التقارير اليومية</span>
              <strong>{rapportCount}</strong>
            </div>
            <div className="stat-card">
              <span>القسم النشط</span>
              <strong>{sectionLabel}</strong>
            </div>
            <div className="stat-card">
              <span>آخر تحديث</span>
              <strong>{todayLabel}</strong>
            </div>
          </div>
        </div>
      </div>

      {section === 'rapport' && <RapportJournalierSection />}
      {section === 'liste' && <ListeRapportsSection />}
    </div>
  );
}
