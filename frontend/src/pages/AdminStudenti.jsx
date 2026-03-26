import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Search, Loader2, UserCheck, UserX, School, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminStudenti() {
  const [studenti, setStudenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScuola, setFilterScuola] = useState('tutte');
  const [filterClasse, setFilterClasse] = useState('tutte');
  const [filterRappresentante, setFilterRappresentante] = useState('tutti');

  // Reset class filter when school changes
  useEffect(() => {
    setFilterClasse('tutte');
  }, [filterScuola]);

  useEffect(() => {
    fetchStudenti();
  }, []);

  const fetchStudenti = async () => {
    try {
      const res = await api.get('/admin/studenti');
      setStudenti(res.data.data);
    } catch (err) {
      toast.error('Errore caricamento studenti');
    } finally {
      setLoading(false);
    }
  };

  const scuoleUniche = [...new Set(studenti.map(s => s.scuola_nome))].filter(Boolean).sort();
  
  const classiDisponibili = [...new Set(
    studenti
      .filter(s => filterScuola === 'tutte' || s.scuola_nome === filterScuola)
      .map(s => s.classe)
  )].filter(Boolean).sort();

  const filtered = studenti.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchName = 
      s.nome.toLowerCase().includes(term) || 
      s.cognome.toLowerCase().includes(term) ||
      s.ticket_code.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term);
    
    const matchScuola = filterScuola === 'tutte' || s.scuola_nome === filterScuola;
    const matchClasse = filterClasse === 'tutte' || s.classe === filterClasse;
    
    let matchRappresentante = true;
    if (filterRappresentante === 'si') matchRappresentante = s.rappresentante_istituto === 1;
    if (filterRappresentante === 'no') matchRappresentante = s.rappresentante_istituto === 0;

    return matchName && matchScuola && matchClasse && matchRappresentante;
  });

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spinner" size={40} color="var(--color-teal)" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Iscritti: {studenti.length} {filtered.length !== studenti.length && <span style={{fontSize: '1.2rem', color: 'var(--color-teal-light)'}}>(Filtrati: {filtered.length})</span>}
        </h1>
        <p className="admin-page-subtitle">Elenco dettagliato di tutte le registrazioni</p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="form-row" style={{ alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Cerca (Nome / Ticket / Email)</label>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--color-gray-500)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filtra per Scuola</label>
            <select
              className="form-select"
              value={filterScuola}
              onChange={(e) => setFilterScuola(e.target.value)}
            >
              <option value="tutte">Tutte le scuole / Indipendenti</option>
              {scuoleUniche.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row" style={{ alignItems: 'flex-end', marginBottom: 0 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filtra per Classe</label>
            <select
              className="form-select"
              value={filterClasse}
              onChange={(e) => setFilterClasse(e.target.value)}
            >
              <option value="tutte">Tutte le classi</option>
              {classiDisponibili.map(c => (
                <option key={c} value={c}>Classe {c}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Rappresentante d'Istituto</label>
            <select
              className="form-select"
              value={filterRappresentante}
              onChange={(e) => setFilterRappresentante(e.target.value)}
            >
              <option value="tutti">Tutti</option>
              <option value="si">Solo Rappresentanti</option>
              <option value="no">Escludi Rappresentanti</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Stato</th>
              <th>Studente</th>
              <th>Ticket</th>
              <th>Scuola & Classe</th>
              <th>Registrato il</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                  Nessuno studente trovato.
                </td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    {s.checkin_effettuato ? (
                      <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <UserCheck size={16} /> Presente
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <UserX size={16} /> Assente
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-white)' }}>
                      {s.cognome} {s.nome}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                      {s.email}
                    </div>
                    {s.rappresentante_istituto === 1 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-orange)', marginTop: '4px', fontWeight: 600 }}>
                        ★ Rappresentante d'Istituto
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                      {s.ticket_code}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <School size={14} color="var(--color-teal-light)" />
                      {s.scuola_nome || 'Nessuna (Docente/Privato)'}
                    </div>
                    {s.classe && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                        <GraduationCap size={14} /> Classe {s.classe}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
                    {new Date(s.created_at).toLocaleString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
