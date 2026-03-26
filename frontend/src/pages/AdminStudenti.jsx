import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Search, Loader2, UserCheck, UserX, School, GraduationCap, Edit3, Trash2, ArrowLeft, X, Mail, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminStudenti() {
  const navigate = useNavigate();
  const [studenti, setStudenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScuola, setFilterScuola] = useState('tutte');
  const [filterClasse, setFilterClasse] = useState('tutte');
  const [filterRappresentante, setFilterRappresentante] = useState('tutti');

  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Edit form state
  const [form, setForm] = useState({
    nome: '', cognome: '', email: '', classe: '', scuola_id: '', rappresentante_istituto: false
  });

  const [scuole, setScuole] = useState([]);

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
    // Troviamo l'id della scuola dal nome
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
      toast.success('Studente eliminato definitivamente');
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
          <p className="admin-page-subtitle">Gestione completa delle registrazioni</p>
        </div>
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

      {filtered.length === 0 ? (
        <div className="empty-state">
           <p>Nessuno studente trovato per i filtri selezionati.</p>
        </div>
      ) : (
        <div className="data-grid">
          {filtered.map(s => (
            <div className="data-card" key={s.id}>
              <div className="data-card-header">
                <div style={{ overflow: 'hidden' }}>
                  <h3 className="data-card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.cognome} {s.nome}</h3>
                  <div className="data-card-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Mail size={12} style={{ flexShrink: 0 }} /> <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.email}</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, paddingLeft: 8 }}>
                  {s.checkin_effettuato ? (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <UserCheck size={12} /> Presente
                    </span>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <UserX size={12} /> Assente
                    </span>
                  )}
                </div>
              </div>

              <div className="data-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ticket size={14} color="var(--color-teal-light)" />
                  <span style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '1px' }}>{s.ticket_code}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <School size={14} color="var(--color-gray-500)" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.scuola_nome || 'Nessuna (Docente/Privato)'}</span>
                </div>
                {s.classe && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GraduationCap size={14} color="var(--color-gray-500)" />
                    <span>Classe {s.classe}</span>
                  </div>
                )}
                {s.rappresentante_istituto === 1 && (
                  <div style={{ color: 'var(--color-accent-orange)', fontWeight: 600, fontSize: '0.8rem', marginTop: '4px' }}>
                    ★ Rappresentante d'Istituto
                  </div>
                )}
              </div>

              <div className="data-card-footer">
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)' }}>
                  {new Date(s.created_at).toLocaleString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric' })}
                </span>
                <div className="data-card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)} title="Modifica">
                    <Edit3 size={16} />
                  </button>
                  <button className="btn btn-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)' }} onClick={() => setDeleteId(s.id)} title="Elimina">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <div className="modal-overlay" onClick={() => setEditingStudent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Modifica Studente</h2>
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
                  <label className="form-label">Scuola</label>
                  <select className="form-select" required value={form.scuola_id} onChange={e => setForm({...form, scuola_id: e.target.value})}>
                    <option value="">Nessuna / Privato</option>
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

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="rappr" checked={form.rappresentante_istituto} onChange={e => setForm({...form, rappresentante_istituto: e.target.checked})} style={{ width: 18, height: 18 }} />
                <label htmlFor="rappr" style={{ cursor: 'pointer', margin: 0, color: 'var(--color-white)' }}>Rappresentante d'Istituto</label>
              </div>

              <div className="modal-actions" style={{ marginTop: 'var(--space-xl)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingStudent(null)}>Annulla</button>
                <button type="submit" className="btn btn-primary">Salva Modifiche</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <Trash2 size={48} color="var(--color-error)" style={{ margin: '0 auto 16px auto' }} />
            <h2 className="modal-title" style={{ marginBottom: 8 }}>Eliminare registrazione?</h2>
            <p style={{ color: 'var(--color-gray-400)', marginBottom: 24 }}>
              Questa operazione è irreversibile. Verranno eliminati anche tutti i log di check-in associati a questo studente.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Annulla</button>
              <button className="btn" style={{ background: 'var(--color-error)', color: 'white' }} onClick={confirmDelete}>Conferma Eliminazione</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
