import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Mail, Calendar, MapPin } from 'lucide-react';
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
      
      {/* Hero Section */}
      <div className={styles.heroSection} style={{ minHeight: '40vh', paddingBottom: '40px' }}>
        <div className={styles.heroVectors}></div>
        
        <div style={{ zIndex: 2, position: 'absolute', top: '40px', left: '24px' }}>
          <img src="/logo-eft.png" alt="EFT Logo" style={{ height: '60px', filter: 'brightness(0) invert(1)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', zIndex: 2, marginTop: 'auto' }}>
          <div style={{ background: 'rgba(46, 204, 113, 0.2)', padding: '12px', borderRadius: '50%' }}>
            <CheckCircle size={32} color="#2ECC71" />
          </div>
          <div className={styles.heroPreTitle} style={{ margin: 0, color: '#2ECC71' }}>ISCRIZIONE CONFERMATA</div>
        </div>
        <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
          CI VEDIAMO<br />
          PRESTO, {nome?.toUpperCase() || 'PARTECIPANTE'}.
        </h1>
      </div>

      {/* Body Section */}
      <div className={styles.formBody}>
        <div className={styles.formContainer} style={{ maxWidth: '600px', textAlign: 'center' }}>
          
          <p className={styles.formMainSubHeading} style={{ margin: '0 auto 40px', borderLeft: 'none', textAlign: 'center', fontSize: '1.2rem' }}>
            Abbiamo inviato una mail ufficiale con il tuo biglietto a <strong style={{ color: '#0f172a' }}>{email}</strong>
          </p>

          {/* Ticket Layout Premium */}
          <div style={{ 
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '40px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.05)'
          }}>
            {/* Ticket Header */}
            <div style={{ background: '#f8fafc', padding: '24px', borderBottom: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '4px' }}>EVENTO</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Space Grotesk', sans-serif" }}>EFT 2026</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '4px' }}>CODICE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Space Grotesk', sans-serif" }}>{codice}</div>
              </div>
            </div>

            {/* Ticket Body */}
            <div style={{ padding: '40px 24px' }}>
              <div style={{
                background: '#fff',
                padding: '16px',
                borderRadius: '16px',
                display: 'inline-block',
                border: '2px solid #f1f5f9',
                boxShadow: '0 10px 25px rgba(0,0,0,0.02)'
              }}>
                <img src={qr} alt="QR Code Biglietto" style={{ width: '220px', height: '220px', display: 'block' }} />
              </div>

              <div style={{
                marginTop: '32px',
                display: 'flex',
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                  <Calendar size={20} color="#f97316" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>DATA</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>8-10 APR</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <MapPin size={20} color="#f97316" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>LUOGO</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>MOLFETTA</div>
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', padding: '16px', color: '#fff' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em' }}>
                ⚡ MOSTRA QUESTO QR ALL'INGRESSO
              </div>
            </div>
          </div>

          <button 
            className={styles.submitBtn} 
            style={{ 
              background: '#ffffff', 
              color: '#0f172a', 
              border: '2px solid #e2e8f0',
              boxShadow: 'none'
            }} 
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} /> Torna alla Home
          </button>

        </div>
      </div>
    </div>
  );
}
