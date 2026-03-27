import { useState, useEffect } from 'react';
import { Calendar, ScanLine, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function AdminScansioni() {
  const navigate = useNavigate();
  const [data, setData] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scansioni, setScansioni] = useState([]);
  const [totale, setTotale] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScansioni();
  }, [data]);

  async function loadScansioni() {
    setLoading(true);
    try {
      const res = await api.get(`/admin/scansioni?data=${data}`);
      setScansioni(res.data.scansioni || []);
      setTotale(res.data.totale || 0);
    } catch (err) {
      toast.error('Errore caricamento scansioni');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'nowrap' }}>
        <img src="/logo-ethera.png" alt="Ethera" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="admin-page-title">REGISTRO SCANSIONI</h1>
              <p className="admin-page-subtitle">
                Storico check-in per giornata — {totale} scansion{totale === 1 ? 'e' : 'i'}
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Calendar size={18} style={{ color: 'var(--color-gray-500)' }} />
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Caricamento scansioni...</p>
        </div>
      ) : scansioni.length > 0 ? (
        <>
          <div className="desktop-only clean-table-container">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Ora</th>
                  <th>Codice</th>
                  <th>Nome</th>
                  <th>Scuola</th>
                  <th>Classe</th>
                  <th>Metodo</th>
                </tr>
              </thead>
              <tbody>
                {scansioni.map(s => (
                  <tr key={s.id}>
                    <td data-label="Ora" style={{ whiteSpace: 'nowrap' }}>
                      {new Date(s.scansionato_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td data-label="Codice">
                      <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: 2 }}>
                        {s.codice}
                      </span>
                    </td>
                    <td data-label="Nome"><strong>{s.nome} {s.cognome}</strong></td>
                    <td data-label="Scuola">{s.scuola}</td>
                    <td data-label="Classe">{s.classe}</td>
                    <td data-label="Metodo">
                      <span className={`clean-badge ${s.metodo === 'qr_scan' ? 'badge-teal' : 'badge-warning'}`}>
                        {s.metodo === 'qr_scan' ? 'QR Scan' : 'Manuale'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mobile-only">
            {scansioni.map(s => (
              <div key={s.id} className="modern-card">
                <div className="modern-card-header" style={{ alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'var(--color-gray-400)', fontSize: '0.8rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={12} />
                      {new Date(s.scansionato_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h4 className="modern-card-title">{s.nome} {s.cognome}</h4>
                    <div className="modern-card-subtitle">{s.scuola} {s.classe ? `- Classe ${s.classe}` : ''}</div>
                  </div>
                  <span className={`clean-badge ${s.metodo === 'qr_scan' ? 'badge-teal' : 'badge-warning'}`}>
                    {s.metodo === 'qr_scan' ? 'QR Scan' : 'Manuale'}
                  </span>
                </div>
                <div className="modern-card-body" style={{ alignItems: 'flex-start', borderTop: 'none', paddingTop: 0 }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 8 }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--color-teal-light)', fontSize: '1rem', letterSpacing: 2, fontWeight: 600 }}>
                      {s.codice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <ScanLine size={48} />
          <p>Nessuna scansione per il {new Date(data + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      )}
    </div>
  );
}
