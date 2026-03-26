import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    eta: '',
    citta: '',
    email: '',
    scuola_id: '',
    classe: '',
    rappresentante_istituto: false,
  });

  useEffect(() => {
    api.get('/scuole')
      .then(res => setSchools(res.data.data || []))
      .catch(() => toast.error('Errore caricamento scuole'));
  }, []);

  function validate() {
    const e = {};
    if (!form.nome.trim() || form.nome.trim().length < 2) e.nome = 'Nome richiesto (min 2 caratteri)';
    if (!form.cognome.trim() || form.cognome.trim().length < 2) e.cognome = 'Cognome richiesto (min 2 caratteri)';
    const eta = parseInt(form.eta);
    if (!form.eta || isNaN(eta) || eta < 13 || eta > 99) e.eta = 'Età non valida (13-99)';
    if (!form.citta.trim()) e.citta = 'Città richiesta';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email non valida';
    if (!form.scuola_id) e.scuola_id = 'Seleziona una scuola';
    if (!form.classe.trim()) e.classe = 'Classe richiesta';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        eta: parseInt(form.eta),
        scuola_id: parseInt(form.scuola_id),
        classe: form.classe.trim().toUpperCase(),
      };

      const res = await api.post('/registrazione', payload);

      if (res.data.success) {
        navigate('/success', {
          state: {
            codice: res.data.data.codice_biglietto,
            qr: res.data.data.qr_code_base64,
            email: form.email,
            nome: form.nome,
          },
        });
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Errore durante la registrazione';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <img src="/logo-ethera.png" alt="Ethera" className="registration-logo" />
          <h1 className="registration-title">ISCRIVITI ALL'EVENTO</h1>
          <p className="registration-subtitle">
            Seconda Edizione 2026 — <span>27 / 28 / 29 Giugno</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            {/* Sezione 1: Dati Personali */}
            <div className="form-section">
              <div className="form-section-title">Dati Personali</div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="nome">Nome</label>
                  <input
                    id="nome"
                    type="text"
                    className={`form-input ${errors.nome ? 'error' : ''}`}
                    placeholder="Il tuo nome"
                    value={form.nome}
                    onChange={e => handleChange('nome', e.target.value)}
                    maxLength={100}
                  />
                  {errors.nome && <span className="form-error-text">{errors.nome}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="cognome">Cognome</label>
                  <input
                    id="cognome"
                    type="text"
                    className={`form-input ${errors.cognome ? 'error' : ''}`}
                    placeholder="Il tuo cognome"
                    value={form.cognome}
                    onChange={e => handleChange('cognome', e.target.value)}
                    maxLength={100}
                  />
                  {errors.cognome && <span className="form-error-text">{errors.cognome}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="eta">Età</label>
                  <input
                    id="eta"
                    type="number"
                    className={`form-input ${errors.eta ? 'error' : ''}`}
                    placeholder="Es: 17"
                    value={form.eta}
                    onChange={e => handleChange('eta', e.target.value)}
                    min={13}
                    max={99}
                  />
                  {errors.eta && <span className="form-error-text">{errors.eta}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="citta">Città</label>
                  <input
                    id="citta"
                    type="text"
                    className={`form-input ${errors.citta ? 'error' : ''}`}
                    placeholder="La tua città"
                    value={form.citta}
                    onChange={e => handleChange('citta', e.target.value)}
                    maxLength={100}
                  />
                  {errors.citta && <span className="form-error-text">{errors.citta}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="la.tua@email.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  maxLength={255}
                />
                {errors.email && <span className="form-error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="divider" />

            {/* Sezione 2: Scuola */}
            <div className="form-section">
              <div className="form-section-title">Scuola di Provenienza</div>

              <div className="form-group">
                <label className="form-label" htmlFor="scuola">Scuola</label>
                <select
                  id="scuola"
                  className={`form-select ${errors.scuola_id ? 'error' : ''}`}
                  value={form.scuola_id}
                  onChange={e => handleChange('scuola_id', e.target.value)}
                >
                  <option value="">Seleziona la tua scuola</option>
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.nome} — {s.citta}</option>
                  ))}
                </select>
                {errors.scuola_id && <span className="form-error-text">{errors.scuola_id}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="classe">Classe</label>
                <input
                  id="classe"
                  type="text"
                  className={`form-input ${errors.classe ? 'error' : ''}`}
                  placeholder="Es: 4A"
                  value={form.classe}
                  onChange={e => handleChange('classe', e.target.value)}
                  maxLength={20}
                />
                {errors.classe && <span className="form-error-text">{errors.classe}</span>}
              </div>

              <div className="form-group">
                <label className="form-checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={form.rappresentante_istituto}
                    onChange={e => handleChange('rappresentante_istituto', e.target.checked)}
                  />
                  <span>Sono Rappresentante di Istituto</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={20} className="spinner" style={{ border: 'none', width: 20, height: 20 }} />
                  Registrazione in corso...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Iscriviti all'Evento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
