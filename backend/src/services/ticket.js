const { customAlphabet } = require('nanoid');
const pool = require('../config/db');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const generate = customAlphabet(alphabet, 6);

/**
 * Genera un codice biglietto univoco a 6 caratteri (A-Z, 0-9).
 * Verifica unicità su DB con loop retry.
 */
async function generateUniqueTicketCode() {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const code = generate();
    const [rows] = await pool.execute(
      'SELECT id FROM registrazioni WHERE codice_biglietto = ?',
      [code]
    );
    if (rows.length === 0) {
      return code;
    }
    attempts++;
  }

  throw new Error('Impossibile generare un codice biglietto univoco dopo ' + maxAttempts + ' tentativi');
}

module.exports = { generateUniqueTicketCode };
