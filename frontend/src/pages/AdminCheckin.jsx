import { useState, useEffect, useRef, useCallback } from 'react';
import { ScanLine, Keyboard } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import QrScanner from '../components/QrScanner';
import CheckinResult from '../components/CheckinResult';

export default function AdminCheckin() {
  const [mode, setMode] = useState('manual'); // 'qr' | 'manual'
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
      <div className="admin-page-header">
        <h1 className="admin-page-title">CHECK-IN</h1>
        <p className="admin-page-subtitle">Scansiona QR code o inserisci il codice manualmente</p>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
        <button
          className={`btn ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => switchMode('manual')}
        >
          <Keyboard size={18} /> Inserimento Manuale
        </button>
        <button
          className={`btn ${mode === 'qr' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => switchMode('qr')}
        >
          <ScanLine size={18} /> Scanner QR
        </button>
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
          <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', fontSize: '0.85rem', marginTop: 12 }}>
            Inserisci il codice a 6 caratteri — invio automatico
          </p>
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
