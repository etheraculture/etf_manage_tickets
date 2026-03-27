import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import styles from './RegistrationForm.module.css';

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
    isStudente: true,
    scuola_id: '',
    classe: '',
    rappresentante_istituto: false,
    privacy_accepted: false,
  });

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    api.get('/scuole')
      .then(res => setSchools(res.data.data || []))
      .catch(() => toast.error('Errore caricamento scuole'));
      
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  function validate() {
    const e = {};
    if (!form.nome.trim() || form.nome.trim().length < 2) e.nome = 'Nome richiesto (min 2 caratteri)';
    if (!form.cognome.trim() || form.cognome.trim().length < 2) e.cognome = 'Cognome richiesto (min 2 caratteri)';
    const eta = parseInt(form.eta);
    if (!form.eta || isNaN(eta) || eta < 13 || eta > 99) e.eta = 'Età non valida (13-99)';
    if (!form.citta.trim()) e.citta = 'Città richiesta';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email non valida';
    
    if (form.isStudente) {
      if (!form.scuola_id) e.scuola_id = 'Seleziona una scuola';
      if (!form.classe.trim()) e.classe = 'Classe richiesta';
    }

    if (!form.privacy_accepted) e.privacy_accepted = 'Devi accettare l\'informativa privacy';
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
        isStudente: form.isStudente,
        scuola_id: form.isStudente ? parseInt(form.scuola_id) : null,
        classe: form.isStudente ? form.classe.trim().toUpperCase() : null,
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
    <div className={styles.pageWrapper}>
      
      {/* Hero Section (Dark Theme) */}
      <div className={styles.heroSection}>
        <div className={styles.heroVectors}></div>
        
        <div style={{ position: 'absolute', top: '30px', left: '0', width: '100%', textAlign: 'center', zIndex: 10 }}>
          <img src="/logo-eft.png" alt="EFT Logo" style={{ height: '70px', filter: 'brightness(0) invert(1)' }} />
        </div>

        <h1 className={styles.heroTitle}>
          ETHERA<br />
          FUTURE TALKS
        </h1>
        <div className={styles.heroSubtitle}>
          NEXT EDITION <span>8-9-10 APRILE 2026</span>
        </div>
      </div>

      {/* Form Section (Light Theme) */}
      <div className={styles.formBody}>
        <div className={styles.formContainer}>
          <h2 className={styles.formMainHeading}>IL TUO<br/>DOMANI<br/>INIZIA QUI.</h2>
          <p className={styles.formMainSubHeading}>
            Compila il modulo per confermare la tua partecipazione alla seconda edizione di Ethera Future Talks. 
            L'accesso è nominale e richiede la registrazione.
          </p>

          <form onSubmit={handleSubmit}>
            
            <div className={styles.formSectionTitle}>
              <span className={styles.formSectionBadge}>STEP 01</span>
              Dati Personali
            </div>
            
            <div className={styles.formGridRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nome</label>
                <input
                  type="text"
                  className={`${styles.formInput} ${errors.nome ? styles.formInputError : ''}`}
                  placeholder="Es: Mario"
                  value={form.nome}
                  onChange={e => handleChange('nome', e.target.value)}
                  maxLength={50}
                />
                {errors.nome && <span className={styles.errorText}>{errors.nome}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Cognome</label>
                <input
                  type="text"
                  className={`${styles.formInput} ${errors.cognome ? styles.formInputError : ''}`}
                  placeholder="Es: Rossi"
                  value={form.cognome}
                  onChange={e => handleChange('cognome', e.target.value)}
                  maxLength={50}
                />
                {errors.cognome && <span className={styles.errorText}>{errors.cognome}</span>}
              </div>
            </div>

            <div className={styles.formGridRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Età</label>
                <input
                  type="number"
                  className={`${styles.formInput} ${errors.eta ? styles.formInputError : ''}`}
                  placeholder="Es: 17"
                  value={form.eta}
                  onChange={e => handleChange('eta', e.target.value)}
                  min="13" max="99"
                />
                {errors.eta && <span className={styles.errorText}>{errors.eta}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Città di Residenza</label>
                <input
                  type="text"
                  className={`${styles.formInput} ${errors.citta ? styles.formInputError : ''}`}
                  placeholder="Es: Bari"
                  value={form.citta}
                  onChange={e => handleChange('citta', e.target.value)}
                  maxLength={50}
                />
                {errors.citta && <span className={styles.errorText}>{errors.citta}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Indirizzo E-mail</label>
              <input
                type="email"
                className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
                placeholder="mario.rossi@email.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                maxLength={100}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formSectionTitle}>
              <span className={styles.formSectionBadge}>STEP 02</span>
              Qualifica
            </div>

            <label className={styles.checkboxWrapper} style={{ marginBottom: form.isStudente ? '24px' : '40px' }}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={form.isStudente}
                onChange={e => handleChange('isStudente', e.target.checked)}
              />
              <span className={styles.checkboxLabel}>
                <strong>Sono attualmente uno studente di scuola superiore</strong>
                <br /><small>Seleziona questa casella per inserire i dati del tuo istituto.</small>
              </span>
            </label>

            {form.isStudente && (
              <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '40px' }}>
                <div className={styles.formGridRow}>
                  <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                    <label className={styles.formLabel}>Scuola</label>
                    <select
                      className={`${styles.formSelect} ${errors.scuola_id ? styles.formSelectError : ''}`}
                      style={{ background: '#ffffff' }}
                      value={form.scuola_id}
                      onChange={e => handleChange('scuola_id', e.target.value)}
                    >
                      <option value="">-- Seleziona il tuo o un altro istituto --</option>
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.nome} - {s.citta}</option>
                      ))}
                    </select>
                    {errors.scuola_id && <span className={styles.errorText}>{errors.scuola_id}</span>}
                  </div>

                  <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                    <label className={styles.formLabel}>Classe</label>
                    <input
                      type="text"
                      className={`${styles.formInput} ${errors.classe ? styles.formInputError : ''}`}
                      style={{ background: '#ffffff' }}
                      placeholder="Es: 4A"
                      value={form.classe}
                      onChange={e => handleChange('classe', e.target.value)}
                      maxLength={20}
                    />
                    {errors.classe && <span className={styles.errorText}>{errors.classe}</span>}
                  </div>
                </div>

                <label className={styles.checkboxWrapper} style={{ marginTop: 0, background: '#ffffff' }}>
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={form.rappresentante_istituto}
                    onChange={e => handleChange('rappresentante_istituto', e.target.checked)}
                  />
                  <span className={styles.checkboxLabel}>Sono Rappresentante di Classe</span>
                </label>
              </div>
            )}

            <div>
              <label 
                className={styles.checkboxWrapper} 
                style={{ 
                  borderColor: errors.privacy_accepted ? '#ef4444' : '#e2e8f0', 
                  background: errors.privacy_accepted ? '#fef2f2' : '#f8fafc' 
                }}
              >
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={form.privacy_accepted}
                  onChange={e => handleChange('privacy_accepted', e.target.checked)}
                />
                <span className={styles.checkboxLabel}>
                  Ho letto l'<a href="/privacy" target="_blank" rel="noopener noreferrer">Informativa Privacy</a> e accetto il trattamento dei miei dati per l'iscrizione all'evento. Se ho meno di 14 anni, un genitore o tutore ha autorizzato questa iscrizione.
                </span>
              </label>
              {errors.privacy_accepted && <span className={styles.errorText} style={{ display: 'block', marginTop: '8px', paddingLeft: '16px' }}>{errors.privacy_accepted}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  IN ELABORAZIONE...
                </>
              ) : (
                "CONFERMA E OTTIENI PASS"
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '40px 0', paddingBottom: '24px' }}>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'underline' }}>
              Informativa completa sul Trattamento dei Dati (GDPR)
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
