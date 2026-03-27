import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Search, Loader2, ArrowLeft, X, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminStudenti() {
  const navigate = useNavigate();
  const [studenti, setStudenti] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtri
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScuola, setFilterScuola] = useState('tutte');
  const [filterClasse, setFilterClasse] = useState('tutte');
  const [filterRappresentante, setFilterRappresentante] = useState('tutti');

  const [scuole, setScuole] = useState([]);

  // Modali Edit & Delete
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    nome: '', cognome: '', email: '', classe: '', scuola_id: '', rappresentante_istituto: false
  });

  useEffect(() => {
    setFilterClasse('tutte');
  }, [filterScuola]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stuRes, scuRes] = await Promise.all([
        api.get('/admin/studenti'),
        api.get('/admin/scuole')
      ]);
      setStudenti(stuRes.data.data);
      setScuole(scuRes.data.data);
    } catch (err) {
      toast.error('Errore caricamento dati');
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

  function openEdit(student) {
    setEditingStudent(student.id);
    const schoolObj = scuole.find(sc => sc.nome === student.scuola_nome);
    setForm({
      nome: student.nome,
      cognome: student.cognome,
      email: student.email,
      classe: student.classe || '',
      scuola_id: schoolObj ? schoolObj.id : '',
      rappresentante_istituto: student.rappresentante_istituto === 1
    });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    try {
      await api.put(`/admin/studenti/${editingStudent}`, {
        nome: form.nome,
        cognome: form.cognome,
        email: form.email,
        classe: form.classe,
        scuola_id: form.scuola_id || null,
        rappresentante_istituto: form.rappresentante_istituto
      });
      toast.success('Studente aggiornato');
      setEditingStudent(null);
      fetchData();
    } catch (err) {
      toast.error('Errore aggiornamento studente');
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/admin/studenti/${deleteId}`);
      toast.success('Studente eliminato');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      toast.error('Errore eliminazione studente');
    }
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spinner" size={40} color="var(--color-teal)" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Torna indietro">
          <ArrowLeft size={28} />
        </button>
        <div>
          <h1 className="admin-page-title">
            Iscritti: {studenti.length} {filtered.length !== studenti.length && <span style={{fontSize: '1.2rem', color: 'var(--color-teal-light)'}}>(Filtrati: {filtered.length})</span>}
          </h1>
          <p className="admin-page-subtitle">Gestione tabellare delle registrazioni</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)' }}>
        <div className="responsive-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: 'var(--color-gray-400)' }}>Cerca Testo</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--color-gray-500)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '48px', height: '48px' }}
                placeholder="Nome, email, ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: 'var(--color-gray-400)' }}>Scuola</label>
            <select
              className="form-select"
              style={{ height: '48px' }}
              value={filterScuola}
              onChange={(e) => setFilterScuola(e.target.value)}
            >
              <option value="tutte">Tutte le scuole</option>
              {scuoleUniche.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: 'var(--color-gray-400)' }}>Classe</label>
            <select
              className="form-select"
              style={{ height: '48px' }}
              value={filterClasse}
              onChange={(e) => setFilterClasse(e.target.value)}
            >
              <option value="tutte">Tutte le classi</option>
              {classiDisponibili.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: 'var(--color-gray-400)' }}>Ruolo</label>
            <select
              className="form-select"
              style={{ height: '48px' }}
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

      <div className="clean-table-container">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-gray-400)' }}>Nessun risultato trovato.</p>
          </div>
        ) : (
          <table className="clean-table">
            <thead>
              <tr>
                <th>Nominativo Email</th>
                <th>Ticket</th>
                <th>Scuola / Classe</th>
                <th>Stato Check-in</th>
                <th style={{ width: '80px', textAlign: 'right' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td data-label="Alunno">
                    <div style={{ fontWeight: 600, color: 'var(--color-white)', fontSize: '1.05rem', lineHeight: 1.2 }}>{s.cognome} {s.nome}</div>
                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem', marginTop: '4px' }}>{s.email}</div>
                  </td>
                  <td data-label="Ticket">
                    <span style={{ fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--color-teal-light)', fontWeight: 600 }}>{s.ticket_code}</span>
                  </td>
                  <td data-label="Istituto">
                    <div style={{ color: 'var(--color-gray-200)' }}>{s.scuola_nome || 'Privato'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginTop: '4px' }}>
                      {s.classe ? <span style={{ color: 'var(--color-gray-400)' }}>Classe {s.classe}</span> : null}
                      {s.rappresentante_istituto === 1 && (
                        <span style={{ color: 'var(--color-accent-orange)', fontWeight: 500 }}>Rappresentante</span>
                      )}
                    </div>
                  </td>
                  <td data-label="Stato">
                    <span className={`clean-badge ${s.checkin_effettuato ? 'badge-success' : 'badge-neutral'}`}>
                      {s.checkin_effettuato ? 'Presente' : 'Assente'}
                    </span>
                  </td>
                  <td data-label="Azioni" style={{ textAlign: 'right' }}>
                    <div className="actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm icon-btn" onClick={() => openEdit(s)} title="Modifica">
                        <Edit3 size={16} />
                      </button>
                      <button className="btn btn-secondary btn-sm icon-btn destructive" onClick={() => setDeleteId(s.id)} title="Elimina">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="modal-overlay" onClick={() => setEditingStudent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Modifica Iscrizione</h2>
              <button onClick={() => setEditingStudent(null)} style={{ background: 'none', border: 'none', color: 'var(--color-gray-500)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit}>
              <div className="form-row" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nome</label>
                  <input type="text" className="form-input" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Cognome</label>
                  <input type="text" className="form-input" required value={form.cognome} onChange={e => setForm({...form, cognome: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>

              <div className="form-row" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Scuola (opzionale)</label>
                  <select className="form-select" value={form.scuola_id} onChange={e => setForm({...form, scuola_id: e.target.value})}>
                    <option value="">-- Seleziona (Privato se omesso) --</option>
                    {scuole.filter(sc => sc.attiva).map(sc => (
                      <option key={sc.id} value={sc.id}>{sc.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Classe (es. 5A)</label>
                  <input type="text" className="form-input" value={form.classe} onChange={e => setForm({...form, classe: e.target.value})} />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--color-bg-darker)', borderRadius: 'var(--radius-md)' }}>
                <input type="checkbox" id="rappr" checked={form.rappresentante_istituto} onChange={e => setForm({...form, rappresentante_istituto: e.target.checked})} style={{ width: 18, height: 18 }} />
                <label htmlFor="rappr" style={{ cursor: 'pointer', margin: 0, color: 'var(--color-white)', fontWeight: 500 }}>Rappresentante d'Istituto</label>
              </div>

              <div className="modal-actions" style={{ marginTop: 'var(--space-xl)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingStudent(null)}>Annulla</button>
                <button type="submit" className="btn btn-primary">Salva Dati</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} color="var(--color-error)" />
            </div>
            <h2 className="modal-title" style={{ marginBottom: 8, fontSize: '1.4rem' }}>Eliminare Record?</h2>
            <p style={{ color: 'var(--color-gray-400)', marginBottom: 24, fontSize: '0.95rem' }}>
              L'azione eliminerà il biglietto, il QR e lo log di check-in se presente. Irreversibile.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Annulla</button>
              <button className="btn" style={{ flex: 1, background: 'var(--color-error)', color: 'white', border: 'none' }} onClick={confirmDelete}>Conferma</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
