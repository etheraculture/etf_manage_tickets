const QRCode = require('qrcode');

/**
 * Genera un QR code PNG come stringa base64 data URI.
 * Il contenuto è solo il codice a 6 caratteri.
 */
async function generateQRCode(ticketCode) {
  const dataUri = await QRCode.toDataURL(ticketCode, {
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0A1E2A',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });
  return dataUri;
}

/**
 * Genera un QR code come buffer PNG (per embedding in email).
 */
async function generateQRCodeBuffer(ticketCode) {
  const buffer = await QRCode.toBuffer(ticketCode, {
    type: 'png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0A1E2A',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });
  return buffer;
}

module.exports = { generateQRCode, generateQRCodeBuffer };
