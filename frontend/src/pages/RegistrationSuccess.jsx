import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import styles from './RegistrationForm.module.css';

export default function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { codice, qr, email, nome } = location.state || {};

  // Se mancano i dati, torna al form
  if (!codice || !qr) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.heroSection} style={{ minHeight: '30vh', paddingBottom: '40px' }}>
          <div className={styles.heroVectors}></div>
          <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            NESSUN<br />BIGLIETTO
          </h1>
        </div>
        <div className={styles.formBody}>
          <div className={styles.formContainer} style={{ textAlign: 'center' }}>
            <p className={styles.formMainSubHeading} style={{ margin: '0 auto 40px', borderLeft: 'none', borderTop: '2px solid #e2e8f0', paddingTop: '24px' }}>
              Non hai ancora completato la registrazione o i dati della sessione sono scaduti.
            </p>
            <button className={styles.submitBtn} style={{ maxWidth: '300px', margin: '0 auto' }} onClick={() => navigate('/')}>
              <ArrowLeft size={20} /> VAI AL FORM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      
      {/* Navbar overlay */}
      <div className={styles.navbar}>
        <div style={{ color: '#fff', fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 600 }}>ETHERA CULTURE</div>
        <img src="/logo-eft.png" alt="EFT Logo" />
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection} style={{ minHeight: '35vh', paddingBottom: '40px' }}>
        <div className={styles.heroVectors}></div>
        <div className={styles.heroPreTitle}>SUCCESS!</div>
        <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
          ISCRIZIONE<br />
          CONFERMATA
        </h1>
        <div className={styles.heroSubtitle}>
          CIAO <span>{nome?.toUpperCase() || 'PARTECIPANTE'}</span>
        </div>
      </div>

      {/* Body Section */}
      <div className={styles.formBody}>
        <div className={styles.formContainer} style={{ maxWidth: '600px', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <CheckCircle size={64} color="#f97316" />
          </div>

          <p className={styles.formMainSubHeading} style={{ margin: '0 auto 32px', borderLeft: 'none', textAlign: 'center' }}>
            Abbiamo inviato una mail di conferma con il tuo biglietto a <strong>{email}</strong>
          </p>

          {/* Ticket Layout */}
          <div style={{ 
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '24px',
            padding: '40px 24px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '40px'
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '0.1em',
              marginBottom: '8px'
            }}>CODICE ACCESSO</div>
            
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '0.05em',
              marginBottom: '32px'
            }}>{codice}</div>

            <div style={{
              background: '#fff',
              padding: '16px',
              borderRadius: '16px',
              display: 'inline-block',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
            }}>
              <img src={qr} alt="QR Code Biglietto" style={{ width: '200px', height: '200px', display: 'block' }} />
            </div>

            <div style={{
              marginTop: '24px',
              color: '#0f172a',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              ⚡ Presenta questo QR code all'ingresso
            </div>
          </div>

          <button 
            className={styles.submitBtn} 
            style={{ 
              background: '#f8fafc', 
              color: '#0f172a', 
              border: '2px solid #e2e8f0',
              boxShadow: 'none'
            }} 
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} /> Nuova Registrazione
          </button>

        </div>
      </div>
    </div>
  );
}
