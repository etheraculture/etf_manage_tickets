const rateLimit = require('express-rate-limit');

const registrationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  message: { error: 'Troppe richieste. Riprova tra un minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10,
  message: { error: 'Troppi tentativi di login. Riprova più tardi.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { registrationLimiter, loginLimiter };
