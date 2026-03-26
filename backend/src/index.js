const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const config = require('./config/env');

// Routes
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const checkinRoutes = require('./routes/checkin');

const app = express();

// ============================================================
// Middleware globali
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disabilitato per permettere inline styles nelle email
}));

app.use(cors({
  origin: [
    config.server.frontendUrl,
    'http://localhost:3103',
    'http://84.247.135.213:3103',
    'http://84.247.135.213',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================================
// API Routes
// ============================================================
app.use('/api', publicRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', checkinRoutes);

// ============================================================
// Health check
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Frontend servito separatamente su porta 3103

// ============================================================
// Error handler globale
// ============================================================
app.use((err, req, res, next) => {
  console.error('Errore non gestito:', err);
  res.status(500).json({ error: 'Errore interno del server' });
});

// ============================================================
// Avvio server
// ============================================================
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Server Ethera Future Talks avviato sulla porta ${PORT}`);
  console.log(`   Ambiente: ${config.server.nodeEnv}`);
});

module.exports = app;
