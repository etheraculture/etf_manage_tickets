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
 * Hard delete: rimuove la scuola SOLO se non ci sono registrazioni collegate.
 */
router.delete('/scuole/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check for existing students
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM registrazioni WHERE scuola_id = ?', [id]);
    if (rows[0].count > 0) {
      return res.status(409).json({ error: 'Impossibile eliminare: ci sono studenti iscritti a questa scuola.' });
    }

    await pool.execute('DELETE FROM scuole WHERE id = ?', [id]);
    res.json({ success: true, message: 'Scuola eliminata definitivamente' });
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

/**
 * PUT /api/admin/studenti/:id
 * Modifica dati studente
 */
router.put('/studenti/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cognome, email, classe, scuola_id, rappresentante_istituto } = req.body;

    const updates = [];
    const values = [];

    if (nome !== undefined) { updates.push('nome = ?'); values.push(nome.trim()); }
    if (cognome !== undefined) { updates.push('cognome = ?'); values.push(cognome.trim()); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email.trim()); }
    if (classe !== undefined) { updates.push('classe = ?'); values.push(classe.trim()); }
    if (scuola_id !== undefined) { updates.push('scuola_id = ?'); values.push(scuola_id ? parseInt(scuola_id) : null); }
    if (rappresentante_istituto !== undefined) { updates.push('rappresentante_istituto = ?'); values.push(rappresentante_istituto ? 1 : 0); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    values.push(id);
    await pool.execute(
      `UPDATE registrazioni SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Errore PUT /api/admin/studenti:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

/**
 * DELETE /api/admin/studenti/:id
 * Elimina studente (prima cancella eventuali check-in)
 */
router.delete('/studenti/:id', authMiddleware, async (req, res) => {
  // Use connection to ensure atomicity if needed, or simple sequential executes
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    await connection.beginTransaction();

    // Elimina i check-in collegati per evitare vincoli di foreign key
    await connection.execute('DELETE FROM checkins WHERE registrazione_id = ?', [id]);
    
    // Elimina la registrazione
    await connection.execute('DELETE FROM registrazioni WHERE id = ?', [id]);

    await connection.commit();
    res.json({ success: true, message: 'Studente eliminato' });
  } catch (error) {
    await connection.rollback();
    console.error('Errore DELETE /api/admin/studenti:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  } finally {
    connection.release();
  }
});

module.exports = router;
