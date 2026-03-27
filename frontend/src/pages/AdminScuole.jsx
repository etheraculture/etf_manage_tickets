import { useState, useEffect } from 'react';
import { Plus, X, ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import SchoolTable from '../components/SchoolTable';

export default function AdminScuole() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formNome, setFormNome] = useState('');
  const [formCitta, setFormCitta] = useState('');

  useEffect(() => { loadSchools(); }, []);

  async function loadSchools() {
    try {
      const res = await api.get('/admin/scuole');
      setSchools(res.data.data || []);
    } catch (err) {
      toast.error('Errore caricamento scuole');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditingSchool(null);
    setFormNome('');
    setFormCitta('');
    setShowModal(true);
  }

  function openEdit(school) {
    setEditingSchool(school);
    setFormNome(school.nome);
    setFormCitta(school.citta || '');
    setShowModal(true);
  }

  async function handleSave() {
    if (!formNome.trim()) {
      toast.error('Nome scuola richiesto');
      return;
    }

    try {
      if (editingSchool) {
        await api.put(`/admin/scuole/${editingSchool.id}`, {
          nome: formNome.trim(),
          citta: formCitta.trim() || null,
        });
        toast.success('Scuola aggiornata');
      } else {
        await api.post('/admin/scuole', {
          nome: formNome.trim(),
          citta: formCitta.trim() || null,
        });
        toast.success('Scuola aggiunta');
      }
      setShowModal(false);
      loadSchools();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Errore salvataggio');
    }
  }

  async function handleToggle(school) {
    try {
      await api.put(`/admin/scuole/${school.id}`, { attiva: !school.attiva });
      toast.success(school.attiva ? 'Scuola disattivata' : 'Scuola riattivata');
      loadSchools();
    } catch (err) {
      toast.error('Errore aggiornamento stato');
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/admin/scuole/${deleteId}`);
      toast.success('Scuola eliminata definitivamente');
      setDeleteId(null);
      loadSchools();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Impossibile eliminare: ci sono studenti iscritti a questa scuola.');
      } else {
        toast.error('Errore eliminazione scuola');
      }
      setDeleteId(null);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Caricamento scuole...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')} aria-label="Torna indietro">
          <ArrowLeft size={28} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="admin-page-title">SCUOLE</h1>
              <p className="admin-page-subtitle">Gestisci l'elenco delle scuole partecipanti</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={18} /> Aggiungi Scuola
            </button>
          </div>
        </div>
      </div>

      <SchoolTable
        schools={schools}
        onEdit={openEdit}
        onToggle={handleToggle}
        onDelete={(school) => setDeleteId(school.id)}
      />

      {/* Modal Aggiungi/Modifica */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="modal-title" style={{ margin: 0 }}>
                {editingSchool ? 'Modifica Scuola' : 'Nuova Scuola'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-gray-500)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Nome Scuola</label>
              <input
                type="text"
                className="form-input"
                placeholder="Es: Liceo Scientifico 'E. Fermi'"
                value={formNome}
                onChange={e => setFormNome(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Città</label>
              <input
                type="text"
                className="form-input"
                placeholder="Es: Bari"
                value={formCitta}
                onChange={e => setFormCitta(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annulla</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editingSchool ? 'Salva Modifiche' : 'Aggiungi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <Trash2 size={48} color="var(--color-error)" style={{ margin: '0 auto 16px auto' }} />
            <h2 className="modal-title" style={{ marginBottom: 8 }}>Eliminare scuola?</h2>
            <p style={{ color: 'var(--color-gray-400)', marginBottom: 24 }}>
              Questa operazione elimina definitivamente la scuola dal database. Manda in errore se ci sono studenti assocati.
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
