import { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';

export default function QrScanner({ onScan, enabled = true }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastScanRef = useRef('');
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (!enabled) { stopCamera(); return; }

    let cancelled = false;

    async function startCamera() {
      try {
        // Richiedi accesso diretto alla fotocamera nativa del browser
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });

        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.setAttribute('playsinline', 'true'); // Necessario per iOS
        await video.play();
        setCameraActive(true);

        // Inizia la scansione QR tramite canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Controlla se il browser supporta BarcodeDetector nativo
        let detector = null;
        if ('BarcodeDetector' in window) {
          try {
            detector = new BarcodeDetector({ formats: ['qr_code'] });
          } catch (e) {
            detector = null;
          }
        }

        function scanFrame() {
          if (cancelled || !video || video.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(scanFrame);
            return;
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);

          if (detector) {
            // Usa BarcodeDetector nativo (Chrome/Edge)
            detector.detect(canvas).then(barcodes => {
              if (barcodes.length > 0 && barcodes[0].rawValue !== lastScanRef.current) {
                lastScanRef.current = barcodes[0].rawValue;
                if (onScanRef.current) onScanRef.current(barcodes[0].rawValue);
              }
            }).catch(() => {});
          } else {
            // Fallback per Safari/iOS: usa jsQR
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imgData.data, canvas.width, canvas.height);
            if (code && code.data && code.data !== lastScanRef.current) {
              lastScanRef.current = code.data;
              if (onScanRef.current) onScanRef.current(code.data);
            }
          }

          if (!cancelled) {
            animFrameRef.current = requestAnimationFrame(scanFrame);
          }
        }

        animFrameRef.current = requestAnimationFrame(scanFrame);

      } catch (err) {
        console.error('Errore accesso fotocamera:', err);
        if (err.name === 'NotAllowedError') {
          setError('Permesso fotocamera negato. Vai nelle Impostazioni del browser e abilita la fotocamera per questo sito.');
        } else if (err.name === 'NotFoundError') {
          setError('Nessuna fotocamera trovata su questo dispositivo.');
        } else if (err.name === 'NotReadableError') {
          setError('La fotocamera è in uso da un\'altra applicazione.');
        } else {
          setError('Errore: ' + err.message);
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [enabled, stopCamera]);

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3',
        background: '#0f172a',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid var(--color-border)'
      }}>
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraActive ? 'block' : 'none' }}
          muted
          playsInline
        />
        {!cameraActive && !error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.95rem', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }}></div>
              Avvio fotocamera...
            </div>
          </div>
        )}
        {/* Mirino QR al centro */}
        {cameraActive && (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px', height: '200px',
            border: '3px solid rgba(255,255,255,0.7)',
            borderRadius: '16px',
            pointerEvents: 'none'
          }} />
        )}
      </div>
      {/* Canvas nascosto per scansione */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {error && (
        <div style={{
          color: '#dc2626', marginTop: '16px', textAlign: 'center',
          fontSize: '0.9rem', fontWeight: 600, padding: '12px',
          background: '#fee2e2', borderRadius: '8px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
