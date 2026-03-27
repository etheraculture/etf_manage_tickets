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
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Torna indietro">
          <ArrowLeft size={28} />
        </button>
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
        <div className="clean-table-container">
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
      ) : (
        <div className="empty-state">
          <ScanLine size={48} />
          <p>Nessuna scansione per il {new Date(data + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      )}
    </div>
  );
}
