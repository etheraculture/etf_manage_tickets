import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QrScanner({ onScan, enabled = true }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    let html5Qr = new Html5Qrcode("qr-reader-box");
    let isStarted = false;

    Html5Qrcode.getCameras().then(cameras => {
      if (cameras && cameras.length > 0) {
        // Cerca fotocamera posteriore altrimenti usa la prima (es. webcam)
        let camId = cameras[0].id;
        for (let c of cameras) {
          if (c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('environment') || c.label.toLowerCase().includes('posteriore')) {
            camId = c.id;
            break;
          }
        }
        
        html5Qr.start(
          camId, 
          { fps: 15, qrbox: { width: 250, height: 250 } },
          (text) => { if (onScan) onScan(text); },
          (err) => {} // ignore scan jitter
        ).then(() => {
          isStarted = true;
        }).catch(err => {
          console.error(err);
          setError("Errore apertura otturatore: " + err.message);
        });

      } else {
        setError("Nessuna videocamera fisicamente trovata su questo dispositivo.");
      }
    }).catch(err => {
      console.error(err);
      setError("ACCESSO NEGATO: Il browser blocca la fotocamera se non sei in HTTPS o se non accetti i permessi.");
    });

    return () => {
      if (isStarted) {
        html5Qr.stop().then(() => html5Qr.clear()).catch(() => {});
      }
    };
  }, [enabled, onScan]);

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div id="qr-reader-box" style={{ width: '100%', minHeight: '300px', background: '#e2e8f0', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#94a3b8', fontWeight: 500 }}>Inizializzazione Camera...</span>
      </div>
      {error && (
        <div style={{ color: 'var(--color-error)', marginTop: '16px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, padding: '12px', background: '#fee2e2', borderRadius: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
