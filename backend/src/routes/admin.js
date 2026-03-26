const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Tutti gli endpoint richiedono autenticazione
router.use(authMiddleware);

/**
 * GET /api/admin/stats
 * Statistiche iscrizioni aggregate per scuola e classe.
 */
router.get('/stats', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        s.id AS scuola_id,
        s.nome AS scuola_nome,
        r.classe,
        COUNT(r.id) AS totale,
        SUM(r.rappresentante_istituto) AS rappresentanti,
        COUNT(c.id) AS checkins
      FROM registrazioni r
      JOIN scuole s ON r.scuola_id = s.id
      LEFT JOIN checkins c ON c.registrazione_id = r.id
      GROUP BY s.id, s.nome, r.classe
      ORDER BY s.nome, r.classe
    `);

    // Aggrega in struttura nested
    let totaleIscritti = 0;
    let totaleCheckins = 0;
    let totaleRappresentanti = 0;
    const scuoleMap = new Map();

    for (const row of rows) {
      totaleIscritti += parseInt(row.totale);
      totaleCheckins += parseInt(row.checkins);
      totaleRappresentanti += parseInt(row.rappresentanti || 0);

      if (!scuoleMap.has(row.scuola_id)) {
        scuoleMap.set(row.scuola_id, {
          scuola_id: row.scuola_id,
          scuola_nome: row.scuola_nome,
          totale: 0,
          checkins: 0,
          per_classe: [],
        });
      }

      const scuola = scuoleMap.get(row.scuola_id);
      scuola.totale += parseInt(row.totale);
      scuola.checkins += parseInt(row.checkins);
      scuola.per_classe.push({
        classe: row.classe,
        totale: parseInt(row.totale),
        checkins: parseInt(row.checkins),
      });
    }

    res.json({
      totale_iscritti: totaleIscritti,
      totale_checkins: totaleCheckins,
      per_scuola: Array.from(scuoleMap.values()),
      rappresentanti_istituto: totaleRappresentanti,
    });
  } catch (err) {
    console.error('Errore GET /api/admin/stats:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

/**
 * GET /api/admin/scuole
 * Lista tutte le scuole (anche disattivate).
 */
router.get('/scuole', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nome, citta, attiva, created_at FROM scuole ORDER BY nome'
    );
    res.json({ data: rows });
  } catch (err) {
    console.error('Errore GET /api/admin/scuole:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

/**
 * POST /api/admin/scuole
 * Aggiunge una nuova scuola.
 */
router.post(
  '/scuole',
  [
    body('nome').trim().isLength({ min: 2, max: 255 }).withMessage('Nome scuola: 2-255 caratteri'),
    body('citta').optional().trim().isLength({ max: 100 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Dati non validi', details: errors.array() });
    }

    try {
      const { nome, citta } = req.body;
      const [result] = await pool.execute(
        'INSERT INTO scuole (nome, citta) VALUES (?, ?)',
        [nome.trim(), citta ? citta.trim() : null]
      );
      res.status(201).json({
        success: true,
        data: { id: result.insertId, nome: nome.trim(), citta: citta?.trim() || null, attiva: true },
      });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Scuola con questo nome già esistente' });
      }
      console.error('Errore POST /api/admin/scuole:', err);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }
);

/**
 * PUT /api/admin/scuole/:id
 * Modifica una scuola.
 */
router.put('/scuole/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, citta, attiva } = req.body;

    const updates = [];
    const values = [];

    if (nome !== undefined) {
      updates.push('nome = ?');
      values.push(nome.trim());
    }
    if (citta !== undefined) {
      updates.push('citta = ?');
      values.push(citta.trim());
    }
    if (attiva !== undefined) {
      updates.push('attiva = ?');
      values.push(attiva ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    values.push(id);
    await pool.execute(
      `UPDATE scuole SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ success: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Scuola con questo nome già esistente' });
    }
    console.error('Errore PUT /api/admin/scuole:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

/**
 * DELETE /api/admin/scuole/:id
 * Soft delete: disattiva la scuola.
 */
router.delete('/scuole/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE scuole SET attiva = FALSE WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Errore DELETE /api/admin/scuole:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// ============================================================
// STUDENTI
// ============================================================

// Ottieni tutti gli studenti registrati con le loro scuole
router.get('/studenti', authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id, 
        r.nome, 
        r.cognome, 
        r.email, 
        r.codice_biglietto as ticket_code, 
        r.rappresentante_istituto,
        IF(c.id IS NOT NULL, 1, 0) as checkin_effettuato, 
        c.scansionato_at as checkin_timestamp,
        r.created_at,
        r.classe,
        s.nome as scuola_nome
      FROM registrazioni r
      LEFT JOIN scuole s ON r.scuola_id = s.id
      LEFT JOIN checkins c ON r.id = c.registrazione_id
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    res.json({ data: rows });
  } catch (error) {
    console.error('Errore get studenti:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

module.exports = router;
