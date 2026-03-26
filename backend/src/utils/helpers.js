/**
 * Utility: validazione e sanitizzazione input.
 */

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidAge(eta) {
  const n = parseInt(eta, 10);
  return !isNaN(n) && n >= 13 && n <= 99;
}

function isValidClasse(classe) {
  return typeof classe === 'string' && classe.trim().length > 0 && classe.trim().length <= 20;
}

module.exports = { sanitizeString, isValidEmail, isValidAge, isValidClasse };
