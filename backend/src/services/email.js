const axios = require('axios');
const config = require('../config/env');

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Ottiene un access token via OAuth2 client credentials flow.
 */
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  const { tenantId, clientId, clientSecret } = config.azure;

  if (!tenantId || !clientId || !clientSecret) {
    console.warn('⚠️  Credenziali Azure non configurate — email non verrà inviata');
    return null;
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  const response = await axios.post(tokenUrl, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;

  return cachedToken;
}

/**
 * Genera il template HTML dell'email di conferma.
 */
function buildEmailHtml(nome, codiceBiglietto) {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0A1E2A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A1E2A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0E1E2E;border-radius:16px;overflow:hidden;border:1px solid rgba(26,107,122,0.3);">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;background:linear-gradient(135deg,#0E4D5A,#1A6B7A);">
              <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:700;letter-spacing:2px;">
                ETHERA FUTURE TALKS
              </h1>
              <p style="margin:8px 0 0;color:#B0BEC5;font-size:14px;letter-spacing:1px;">
                Seconda Edizione 2026
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#F0F4F5;font-size:18px;margin:0 0 20px;">
                Ciao <strong>${nome}</strong>,
              </p>
              <p style="color:#B0BEC5;font-size:15px;line-height:1.6;margin:0 0 30px;">
                La tua iscrizione all'evento <strong style="color:#2A8B9A;">Ethera Future Talks — Seconda Edizione 2026</strong> è confermata!
              </p>

              <!-- Dettagli evento -->
              <table width="100%" cellpadding="12" cellspacing="0" style="background-color:rgba(26,107,122,0.15);border-radius:10px;margin-bottom:30px;border:1px solid rgba(26,107,122,0.2);">
                <tr>
                  <td style="color:#B0BEC5;font-size:13px;border-bottom:1px solid rgba(26,107,122,0.15);">📅 Data</td>
                  <td style="color:#F0F4F5;font-size:14px;font-weight:600;border-bottom:1px solid rgba(26,107,122,0.15);">27 — 28 — 29 Giugno 2026</td>
                </tr>
                <tr>
                  <td style="color:#B0BEC5;font-size:13px;">📍 Luogo</td>
                  <td style="color:#F0F4F5;font-size:14px;font-weight:600;">Da comunicare</td>
                </tr>
              </table>

              <!-- Codice Biglietto -->
              <div style="text-align:center;margin-bottom:30px;">
                <p style="color:#B0BEC5;font-size:13px;margin:0 0 10px;text-transform:uppercase;letter-spacing:2px;">
                  Il tuo codice biglietto
                </p>
                <div style="display:inline-block;background:linear-gradient(135deg,#1A6B7A,#0E4D5A);padding:16px 40px;border-radius:10px;border:2px solid #2A8B9A;">
                  <span style="color:#FFFFFF;font-size:36px;font-weight:700;letter-spacing:8px;font-family:'Courier New',monospace;">
                    ${codiceBiglietto}
                  </span>
                </div>
              </div>

              <!-- QR Code -->
              <div style="text-align:center;margin-bottom:30px;">
                <p style="color:#B0BEC5;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:2px;">
                  QR Code di accesso
                </p>
                <div style="display:inline-block;background:#FFFFFF;padding:12px;border-radius:12px;">
                  <img src="cid:qrcode" alt="QR Code" width="200" height="200" style="display:block;" />
                </div>
              </div>

              <p style="color:#E8842C;font-size:14px;font-weight:600;text-align:center;margin:0 0 10px;">
                ⚡ Presenta questo QR code all'ingresso dell'evento
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;text-align:center;border-top:1px solid rgba(26,107,122,0.2);">
              <p style="color:#546E7A;font-size:12px;margin:0;">
                Ethera Culture APS — etheraculture.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Invia l'email di conferma iscrizione via Microsoft Graph.
 * Fallisce silenziosamente se le credenziali non sono configurate.
 */
async function sendConfirmationEmail(toEmail, nome, codiceBiglietto, qrBase64) {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.log('ℹ️  Email non inviata (credenziali Azure mancanti)');
      return false;
    }

    const htmlContent = buildEmailHtml(nome, codiceBiglietto);
    
    // Extract base64 raw data (remove "data:image/png;base64,")
    const base64Data = qrBase64.split(',')[1];

    const mailPayload = {
      message: {
        subject: 'Conferma Iscrizione — Ethera Future Talks 2026',
        body: {
          contentType: 'HTML',
          content: htmlContent,
        },
        toRecipients: [
          { emailAddress: { address: toEmail } },
        ],
        attachments: [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: "qrcode.png",
            contentType: "image/png",
            contentBytes: base64Data,
            isInline: true,
            contentId: "qrcode"
          }
        ]
      },
    };

    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${config.azure.mailFrom}/sendMail`,
      mailPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ Email inviata a ${toEmail}`);
    return true;
  } catch (err) {
    console.error('❌ Errore invio email:', err.response?.data || err.message);
    return false;
  }
}

module.exports = { sendConfirmationEmail };
