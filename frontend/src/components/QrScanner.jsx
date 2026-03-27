import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QrScanner({ onScan, enabled = true }) {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const scannerId = 'qr-reader-' + Date.now();
    if (scannerRef.current) {
      scannerRef.current.id = scannerId;
    }

    let html5Qr = null;
    let running = false;

    async function startScanner() {
      try {
        html5Qr = new Html5Qrcode(scannerId);
        html5QrRef.current = html5Qr;

        const config = { fps: 15, qrbox: { width: 250, height: 250 } };
        const onSuccess = (decodedText) => {
          if (onScan) onScan(decodedText);
        };
        const onFail = () => {}; // ignore read errors

        try {
          // Tentativo 1: Fotocamera Posteriore (Mobile)
          await html5Qr.start({ facingMode: 'environment' }, config, onSuccess, onFail);
        } catch (errEnvironment) {
          console.log('Fotocamera posteriore non trovata o negata, tento fotocamera frontale/webcam...', errEnvironment);
          // Tentativo 2: WebCam frontale (Laptops/Macbook)
          await html5Qr.start({ facingMode: 'user' }, config, onSuccess, onFail);
        }
        
        running = true;
      } catch (err) {
        console.error('Errore avvio scanner fotocamere:', err);
        setError('Impossibile accedere alla fotocamera. Verifica i permessi e di essere su rete HTTPS/localhost.');
      }
    }

    startScanner();

    return () => {
      if (html5QrRef.current && running) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, [enabled]);

  return (
    <div>
      <div className="scanner-box">
        <div ref={scannerRef} style={{ width: '100%', height: '100%' }} />
      </div>
      {error && (
        <p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: 12, fontSize: '0.85rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
