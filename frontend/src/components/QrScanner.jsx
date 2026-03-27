import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QrScanner({ onScan, enabled = true }) {
  useEffect(() => {
    if (!enabled) return;

    // Inizializza lo scanner ad alto livello con UI nativa
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader-box",
      { 
        fps: 15, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        if (onScan) onScan(decodedText);
      },
      (errorMessage) => {
        // Ignora gli errori di parsing continui (jitter)
      }
    );

    // Cleanup alla distruzione del componente
    return () => {
      try {
        html5QrcodeScanner.clear().catch(console.error);
      } catch (err) {
        console.error(err);
      }
    };
  }, [enabled]); // Omit onScan from dependencies to avoid loop re-renders if the parent passes a new function

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
      <div id="qr-reader-box" style={{ width: '100%' }}></div>
      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--color-gray-400)' }}>
        Clicca il pulsante sopra per attivare lo scanner.
      </p>
    </div>
  );
}
