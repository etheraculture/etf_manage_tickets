import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import SchoolTable from '../components/SchoolTable';

export default function AdminScuole() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
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
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="admin-page-title">SCUOLE</h1>
          <p className="admin-page-subtitle">Gestisci l'elenco delle scuole partecipanti</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Aggiungi Scuola
        </button>
      </div>

      <SchoolTable
        schools={schools}
        onEdit={openEdit}
        onToggle={handleToggle}
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
    </div>
  );
}
