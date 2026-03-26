import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { codice, qr, email, nome } = location.state || {};

  // Se mancano i dati, torna al form
  if (!codice || !qr) {
    return (
      <div className="success-page">
        <div className="success-container">
          <h1 className="registration-title" style={{ marginBottom: 24 }}>NESSUN BIGLIETTO</h1>
          <p className="success-text">Non hai ancora completato la registrazione.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
            <ArrowLeft size={20} /> Vai alla Registrazione
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">
          <CheckCircle size={40} color="#2ECC71" />
        </div>

        <h1 className="success-title">ISCRIZIONE CONFERMATA!</h1>

        <div className="ticket-code-box">
          <span className="ticket-code">{codice}</span>
        </div>

        <div className="success-qr">
          <img src={qr} alt="QR Code Biglietto" />
        </div>

        <p className="success-text">
          Abbiamo inviato una mail di conferma con il tuo biglietto a{' '}
          <strong>{email}</strong>
        </p>

        <p className="success-highlight">
          ⚡ Presenta questo QR code all'ingresso dell'evento
        </p>

        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Nuova Iscrizione
        </button>
      </div>
    </div>
  );
}
