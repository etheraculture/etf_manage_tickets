import { useState, useEffect, Fragment } from 'react';
import { Users, ScanLine, Award, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import StatsCard from '../components/StatsCard';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      toast.error('Errore caricamento statistiche');
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(scuolaId) {
    setExpanded(prev => ({ ...prev, [scuolaId]: !prev[scuolaId] }));
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Caricamento statistiche...</p>
      </div>
    );
  }

  const percentuale = stats && stats.totale_iscritti > 0
    ? Math.round((stats.totale_checkins / stats.totale_iscritti) * 100)
    : 0;

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'nowrap' }}>
        <img src="/logo-ethera.png" alt="Ethera" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <div style={{ flex: 1 }}>
          <h1 className="admin-page-title">DASHBOARD</h1>
          <p className="admin-page-subtitle">Panoramica iscrizioni e presenze</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard icon={Users} value={stats?.totale_iscritti || 0} label="Iscritti totali" />
        <StatsCard icon={ScanLine} value={stats?.totale_checkins || 0} label="Check-in effettuati" color="#2ECC71" />
        <StatsCard icon={Award} value={`${percentuale}%`} label="Tasso presenze" color="#F39C12" />
        <StatsCard icon={Award} value={stats?.rappresentanti_istituto || 0} label="Rappresentanti" color="#E8842C" />
      </div>

      <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-gray-300)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
        Dettaglio per Scuola
      </h2>

      {stats?.per_scuola?.length > 0 ? (
        <>
          {/* DESKTOP VIEW */}
          <div className="desktop-only clean-table-container">
            <table className="clean-table">
              <thead>
                <tr>
                  <th style={{ width: 30 }}></th>
                  <th>Scuola</th>
                  <th>Iscritti</th>
                  <th>Check-in</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {stats.per_scuola.map(scuola => {
                  const isOpen = expanded[scuola.scuola_id];
                  const pct = scuola.totale > 0 ? Math.round((scuola.checkins / scuola.totale) * 100) : 0;
                  return (
                    <Fragment key={scuola.scuola_id}>
                      <tr className="expandable-row" onClick={() => toggleExpand(scuola.scuola_id)} style={{ cursor: 'pointer' }}>
                        <td data-label="">
                          <span className={`expand-icon ${isOpen ? 'open' : ''}`}>
                            <ChevronRight size={16} />
                          </span>
                        </td>
                        <td data-label="Scuola"><strong style={{ color: 'var(--color-white)' }}>{scuola.scuola_nome}</strong></td>
                        <td data-label="Iscritti">{scuola.totale}</td>
                        <td data-label="Check-in">{scuola.checkins}</td>
                        <td data-label="%">
                          <span className={`clean-badge ${pct >= 70 ? 'badge-success' : pct >= 40 ? 'badge-warning' : 'badge-error'}`}>
                            {pct}%
                          </span>
                        </td>
                      </tr>
                      {isOpen && scuola.per_classe.map(cl => {
                        const clPct = cl.totale > 0 ? Math.round((cl.checkins / cl.totale) * 100) : 0;
                        return (
                          <tr key={`${scuola.scuola_id}-${cl.classe}`} className="sub-row" style={{ background: 'rgba(255,255,255,0.01)' }}>
                            <td data-label=""></td>
                            <td data-label="Classe"><div style={{ paddingLeft: '24px', color: 'var(--color-gray-400)' }}>Classe {cl.classe}</div></td>
                            <td data-label="Iscritti">{cl.totale}</td>
                            <td data-label="Check-in">{cl.checkins}</td>
                            <td data-label="%">
                              <span className={`clean-badge ${clPct >= 70 ? 'badge-success' : clPct >= 40 ? 'badge-warning' : 'badge-error'}`}>
                                {clPct}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="mobile-only">
            {stats.per_scuola.map(scuola => {
              const isOpen = expanded[scuola.scuola_id];
              const pct = scuola.totale > 0 ? Math.round((scuola.checkins / scuola.totale) * 100) : 0;
              return (
                <div key={scuola.scuola_id} className="modern-card">
                  <div className="modern-card-header" onClick={() => toggleExpand(scuola.scuola_id)} style={{ cursor: 'pointer' }}>
                    <div style={{ flex: 1 }}>
                      <h4 className="modern-card-title">{scuola.scuola_nome}</h4>
                      <div className="modern-card-info" style={{ marginTop: 6, fontSize: '0.85rem' }}>
                        <span>Iscritti: <strong style={{color:'var(--color-white)'}}>{scuola.totale}</strong></span>
                        <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
                        <span>Check-in: <strong style={{color:'var(--color-teal-light)'}}>{scuola.checkins}</strong></span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                      <span className={`clean-badge ${pct >= 70 ? 'badge-success' : pct >= 40 ? 'badge-warning' : 'badge-error'}`}>
                        {pct}%
                      </span>
                      <ChevronRight size={18} style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s', color: 'var(--color-gray-400)' }} />
                    </div>
                  </div>
                  {isOpen && (
                    <div className="modern-card-body" style={{ marginTop: 8 }}>
                      {scuola.per_classe.map(cl => {
                        const clPct = cl.totale > 0 ? Math.round((cl.checkins / cl.totale) * 100) : 0;
                        return (
                          <div key={`${scuola.scuola_id}-${cl.classe}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <span style={{ color: 'var(--color-gray-300)', fontWeight: 500 }}>Classe {cl.classe}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ color: 'var(--color-gray-400)', fontSize: '0.85rem' }}>{cl.checkins}/{cl.totale}</span>
                              <span className={`clean-badge ${clPct >= 70 ? 'badge-success' : clPct >= 40 ? 'badge-warning' : 'badge-error'}`} style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
                                {clPct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Users size={48} />
          <p>Nessuna iscrizione registrata.</p>
        </div>
      )}
    </div>
  );
}
