import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function CheckinResult({ result, onDismiss }) {
  if (!result) return null;

  const config = {
    nuovo: {
      className: 'success',
      icon: CheckCircle,
      title: 'CHECK-IN OK',
    },
    gia_scansionato: {
      className: 'warning',
      icon: AlertTriangle,
      title: 'GIÀ SCANSIONATO',
    },
    non_trovato: {
      className: 'error',
      icon: XCircle,
      title: 'CODICE NON TROVATO',
    },
    errore: {
      className: 'error',
      icon: XCircle,
      title: 'ERRORE',
    },
  };

  const c = config[result.status] || config.errore;
  const Icon = c.icon;

  return (
    <div className={`checkin-result ${c.className}`} onClick={onDismiss}>
      <div className="checkin-result-icon">
        <Icon size={30} />
      </div>
      <div className="checkin-result-title">{c.title}</div>
      <div className="checkin-result-details">
        {result.studente && (
          <>
            <p><strong>{result.studente.nome} {result.studente.cognome}</strong></p>
            <p>{result.studente.scuola} — {result.studente.classe}</p>
            {result.studente.rappresentante && (
              <p style={{ marginTop: 8 }}>
                <span className="badge badge-teal">Rappresentante di Istituto</span>
              </p>
            )}
          </>
        )}
        {result.status === 'gia_scansionato' && result.primo_checkin && (
          <p style={{ marginTop: 8, fontSize: '0.85rem', opacity: 0.8 }}>
            Primo check-in: {new Date(result.primo_checkin).toLocaleString('it-IT')}
          </p>
        )}
        {result.status === 'non_trovato' && (
          <p>Il codice inserito non corrisponde a nessun biglietto registrato.</p>
        )}
        {result.error && <p>{result.error}</p>}
      </div>
    </div>
  );
}
