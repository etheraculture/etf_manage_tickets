const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { loginLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * POST /api/admin/login
 * Autenticazione admin con username/password hardcoded.
 */
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password richiesti' });
    }

    // Confronto diretto con credenziali in .env
    if (username !== config.admin.username || password !== config.admin.password) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Genera JWT
    const token = jwt.sign(
      { role: 'admin', username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      token,
      expiresIn: config.jwt.expiresIn,
    });
  } catch (err) {
    console.error('Errore POST /api/admin/login:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

module.exports = router;
