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
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,0.1);">
          <!-- Header (Dark) -->
          <tr>
            <td style="padding:40px;text-align:center;background-color:#0b1120;">
              <img src="https://ticket.etheraculture.com/logo-eft.png" alt="EFT Logo" width="60" style="display:block;margin:0 auto 20px;filter:brightness(0) invert(1);" />
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">
                ETHERA FUTURE TALKS
              </h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
                Seconda Edizione 2026
              </p>
            </td>
          </tr>

          <!-- Body (Light) -->
          <tr>
            <td style="padding:40px;text-align:center;">
              <p style="color:#0f172a;font-size:20px;font-weight:600;margin:0 0 16px;">
                Ciao ${nome}, la tua iscrizione è confermata!
              </p>
              <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 32px;">
                Sei ufficialmente registrato per partecipare a <strong>Ethera Future Talks 2026</strong>. Non vediamo l'ora di immaginare il futuro insieme a te.
              </p>

              <!-- Ticket Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:24px;border:2px solid #e2e8f0;margin-bottom:32px;overflow:hidden;">
                <tr>
                  <td style="padding:24px;text-align:center;border-bottom:2px solid #e2e8f0;">
                    <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;font-weight:700;letter-spacing:2px;">CODICE ACCESSO</p>
                    <p style="margin:0;color:#0f172a;font-size:36px;font-weight:800;letter-spacing:4px;">${codiceBiglietto}</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:32px 24px;">
                    <div style="background:#ffffff;padding:16px;border-radius:16px;border:2px solid #f1f5f9;display:inline-block;">
                      <img src="cid:qrcode" alt="QR Code" width="200" height="200" style="display:block;" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:linear-gradient(135deg, #f97316, #fb923c);padding:16px;">
                    <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;letter-spacing:1px;text-align:center;">
                      ⚡ MOSTRA QUESTO QR ALL'INGRESSO ⚡
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Dettagli evento -->
              <table width="100%" cellpadding="16" cellspacing="0" style="background-color:#ffffff;border:2px solid #f1f5f9;border-radius:12px;margin-bottom:16px;">
                <tr>
                  <td width="50%" style="border-right:2px solid #f1f5f9;text-align:center;">
                    <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;font-weight:700;letter-spacing:1px;">DATA</p>
                    <p style="margin:0;color:#0f172a;font-size:14px;font-weight:700;">8-10 Aprile 2026</p>
                  </td>
                  <td width="50%" style="text-align:center;">
                    <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;font-weight:700;letter-spacing:1px;">LUOGO</p>
                    <p style="margin:0;color:#0f172a;font-size:14px;font-weight:700;">Molfetta (BA)</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px;text-align:center;background-color:#f8fafc;border-top:2px solid #e2e8f0;">
              <p style="color:#64748b;font-size:12px;margin:0;">
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
