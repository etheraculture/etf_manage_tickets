const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Tutti gli endpoint richiedono autenticazione
router.use(authMiddleware);

/**
 * POST /api/admin/checkin
 * Effettua check-in di un biglietto (QR scan o manuale).
 */
router.post('/checkin', async (req, res) => {
  try {
    const { codice, metodo } = req.body;

    if (!codice || typeof codice !== 'string' || codice.trim().length !== 6) {
      return res.status(400).json({ error: 'Codice biglietto non valido (6 caratteri richiesti)' });
    }

    const codiceUpper = codice.trim().toUpperCase();
    const metodoValido = metodo === 'manuale' ? 'manuale' : 'qr_scan';

    // 1. Cerca registrazione per codice (usa indice, O(1))
    const [registrazioni] = await pool.execute(
      'SELECT id, nome, cognome, scuola_id, classe, rappresentante_istituto, codice_biglietto FROM registrazioni WHERE codice_biglietto = ?',
      [codiceUpper]
    );

    if (registrazioni.length === 0) {
      return res.status(404).json({
        success: false,
        status: 'non_trovato',
        error: 'Codice biglietto non trovato',
      });
    }

    const registrazione = registrazioni[0];

    // 2. Controlla se già scansionato
    const [existingCheckins] = await pool.execute(
      'SELECT id, scansionato_at FROM checkins WHERE registrazione_id = ? ORDER BY scansionato_at ASC LIMIT 1',
      [registrazione.id]
    );

    // 3. Ottieni nome scuola
    const [scuole] = await pool.execute(
      'SELECT nome FROM scuole WHERE id = ?',
      [registrazione.scuola_id]
    );

    const studenteData = {
      nome: registrazione.nome,
      cognome: registrazione.cognome,
      scuola: scuole[0]?.nome || 'N/A',
      classe: registrazione.classe,
      rappresentante: registrazione.rappresentante_istituto === 1,
      codice: registrazione.codice_biglietto,
    };

    if (existingCheckins.length > 0) {
      return res.json({
        success: true,
        status: 'gia_scansionato',
        primo_checkin: existingCheckins[0].scansionato_at,
        studente: studenteData,
      });
    }

    // 4. Nuovo check-in
    await pool.execute(
      'INSERT INTO checkins (registrazione_id, metodo, operatore) VALUES (?, ?, ?)',
      [registrazione.id, metodoValido, req.user?.username || 'admin']
    );

    res.json({
      success: true,
      status: 'nuovo',
      studente: studenteData,
    });
  } catch (err) {
    console.error('Errore POST /api/admin/checkin:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

/**
 * GET /api/admin/scansioni?data=YYYY-MM-DD
 * Registro scansioni filtrato per giorno (default: oggi).
 */
router.get('/scansioni', async (req, res) => {
  try {
    let data = req.query.data;

    // Default: oggi
    if (!data) {
      const today = new Date();
      data = today.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    // Valida formato data
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return res.status(400).json({ error: 'Formato data non valido (YYYY-MM-DD)' });
    }

    const [rows] = await pool.execute(
      `SELECT 
        c.id,
        r.codice_biglietto AS codice,
        r.nome,
        r.cognome,
        s.nome AS scuola,
        r.classe,
        c.metodo,
        c.scansionato_at
       FROM checkins c
       JOIN registrazioni r ON c.registrazione_id = r.id
       JOIN scuole s ON r.scuola_id = s.id
       WHERE DATE(c.scansionato_at) = ?
       ORDER BY c.scansionato_at DESC`,
      [data]
    );

    res.json({
      data,
      totale: rows.length,
      scansioni: rows,
    });
  } catch (err) {
    console.error('Errore GET /api/admin/scansioni:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

module.exports = router;
