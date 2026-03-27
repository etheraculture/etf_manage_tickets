import { useState, useEffect, useRef, useCallback } from 'react';
import { ScanLine, Keyboard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import QrScanner from '../components/QrScanner';
import CheckinResult from '../components/CheckinResult';

export default function AdminCheckin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('qr'); // 'qr' | 'manual'
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const inputRef = useRef(null);
  const resetTimerRef = useRef(null);

  // Focus su input manuale quando cambia modo
  useEffect(() => {
    if (mode === 'manual' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode, result]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const doCheckin = useCallback(async (codice, metodo) => {
    if (processing) return;
    setProcessing(true);

    try {
      const res = await api.post('/admin/checkin', { codice: codice.trim().toUpperCase(), metodo });
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setResult({ status: 'non_trovato' });
      } else {
        setResult({ status: 'errore', error: err.response?.data?.error || 'Errore di rete' });
      }
    } finally {
      setProcessing(false);
      setManualCode('');

      // Auto-reset dopo 3 secondi
      resetTimerRef.current = setTimeout(() => {
        setResult(null);
        if (inputRef.current) inputRef.current.focus();
      }, 3000);
    }
  }, [processing]);

  function handleManualInput(e) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setManualCode(val);

    // Auto-submit dopo 6 caratteri
    if (val.length === 6) {
      doCheckin(val, 'manuale');
    }
  }

  function handleQrScan(text) {
    if (result || processing) return;
    const code = text.trim().toUpperCase();
    if (code.length === 6 && /^[A-Z0-9]{6}$/.test(code)) {
      doCheckin(code, 'qr_scan');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && manualCode.length === 6) {
      doCheckin(manualCode, 'manuale');
    }
  }

  function switchMode(newMode) {
    setMode(newMode);
    setResult(null);
    setManualCode('');
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (newMode === 'qr') {
      setScannerEnabled(true);
    } else {
      setScannerEnabled(false);
    }
  }

  function dismissResult() {
    setResult(null);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'nowrap' }}>
        <img src="/logo-ethera.png" alt="Ethera" className="mobile-only" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <div style={{ flex: 1 }}>
          <h1 className="admin-page-title">CHECK-IN</h1>
          <p className="admin-page-subtitle">{mode === 'qr' ? 'Inquadra il QR Code del biglietto' : 'Inserisci il codice a 6 caratteri'}</p>
        </div>
      </div>

      {/* Scanner QR */}
      {mode === 'qr' && (
        <div className="checkin-scanner-container">
          <QrScanner onScan={handleQrScan} enabled={scannerEnabled && !result} />
        </div>
      )}

      {/* Input manuale */}
      {mode === 'manual' && !result && (
        <div className="manual-input-container">
          <input
            ref={inputRef}
            type="text"
            className="manual-code-input"
            placeholder="CODICE"
            value={manualCode}
            onChange={handleManualInput}
            onKeyDown={handleKeyDown}
            maxLength={6}
            autoFocus
            disabled={processing}
          />
        </div>
      )}

      {/* Mode Toggle Link */}
      {!result && !processing && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          {mode === 'qr' ? (
            <button 
              onClick={() => switchMode('manual')} 
              style={{ background: 'none', border: 'none', color: 'var(--color-teal-light)', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}
            >
              <Keyboard size={16} /> Inserimento Manuale
            </button>
          ) : (
            <button 
              onClick={() => switchMode('qr')} 
              style={{ background: 'none', border: 'none', color: 'var(--color-teal-light)', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}
            >
              <ScanLine size={16} /> Usa lo Scanner QR
            </button>
          )}
        </div>
      )}

      {/* Processing */}
      {processing && (
        <div className="loading-container" style={{ padding: 32 }}>
          <div className="spinner" />
          <p>Verifica in corso...</p>
        </div>
      )}

      {/* Risultato */}
      <CheckinResult result={result} onDismiss={dismissResult} />
    </div>
  );
}
