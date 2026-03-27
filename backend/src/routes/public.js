const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { generateUniqueTicketCode } = require('../services/ticket');
const { generateQRCode } = require('../services/qrcode');
const { sendConfirmationEmail } = require('../services/email');
const { registrationLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * GET /api/scuole
 * Lista scuole attive per il dropdown del form.
 */
router.get('/scuole', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nome, citta FROM scuole WHERE attiva = TRUE ORDER BY nome'
    );
    res.json({ data: rows });
  } catch (err) {
    console.error('Errore GET /api/scuole:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

/**
 * POST /api/registrazione
 * Registra uno studente all'evento.
 */
router.post(
  '/registrazione',
  registrationLimiter,
  [
    body('nome').trim().isLength({ min: 2, max: 100 }).withMessage('Nome: 2-100 caratteri'),
    body('cognome').trim().isLength({ min: 2, max: 100 }).withMessage('Cognome: 2-100 caratteri'),
    body('eta').isInt({ min: 13, max: 99 }).withMessage('Età: 13-99'),
    body('citta').trim().isLength({ min: 2, max: 100 }).withMessage('Città non valida'),
    body('email').trim().toLowerCase().isEmail().withMessage('Email non valida'),
    body('isStudente').isBoolean().withMessage('Specifica se sei studente'),
    body('scuola_id').custom((value, { req }) => {
      if (req.body.isStudente === true && (!value || isNaN(value) || value < 1)) {
        throw new Error('Scuola non selezionata');
      }
      return true;
    }),
    body('classe').custom((value, { req }) => {
      if (req.body.isStudente === true && (!value || value.trim().length === 0)) {
        throw new Error('Classe non valida');
      }
      return true;
    }),
    body('rappresentante_istituto').optional().isBoolean(),
  ],
  async (req, res) => {
    // Validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Dati non validi', details: errors.array() });
    }

    try {
      const { nome, cognome, eta, citta, email, isStudente, scuola_id, classe, rappresentante_istituto } = req.body;

      let finalScuola = null;
      let finalClasse = null;

      if (isStudente) {
        finalScuola = parseInt(scuola_id, 10);
        finalClasse = classe.trim().toUpperCase();

        // Verifica che la scuola esista e sia attiva solo se studente
        const [scuole] = await pool.execute(
          'SELECT id FROM scuole WHERE id = ? AND attiva = TRUE',
          [finalScuola]
        );
        if (scuole.length === 0) {
          return res.status(400).json({ error: 'Scuola non valida o non attiva' });
        }
      }

      // Genera codice univoco
      const codiceBiglietto = await generateUniqueTicketCode();

      // Genera QR code
      const qrCodeBase64 = await generateQRCode(codiceBiglietto);

      // Inserisci registrazione
      await pool.execute(
        `INSERT INTO registrazioni 
         (codice_biglietto, nome, cognome, eta, citta, scuola_id, classe, rappresentante_istituto, email, qr_code_data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          codiceBiglietto,
          nome.trim(),
          cognome.trim(),
          parseInt(eta, 10),
          citta.trim(),
          finalScuola,
          finalClasse,
          (isStudente && rappresentante_istituto) ? 1 : 0,
          email,
          qrCodeBase64,
        ]
      );

      // Invia email in background (non blocca la response)
      sendConfirmationEmail(email, nome.trim(), codiceBiglietto, qrCodeBase64)
        .then(sent => {
          if (sent) {
            pool.execute(
              'UPDATE registrazioni SET email_inviata = TRUE WHERE codice_biglietto = ?',
              [codiceBiglietto]
            ).catch(err => console.error('Errore update email_inviata:', err));
          }
        })
        .catch(err => console.error('Errore email background:', err));

      // Rispondi immediatamente
      res.status(201).json({
        success: true,
        data: {
          codice_biglietto: codiceBiglietto,
          qr_code_base64: qrCodeBase64,
        },
      });
    } catch (err) {
      console.error('Errore POST /api/registrazione:', err);
      res.status(500).json({ error: 'Errore interno del server' });
    }
  }
);

module.exports = router;
