const mysql = require('mysql2/promise');
const config = require('./env');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+00:00',
});

// Test connessione all'avvio
pool.getConnection()
  .then(conn => {
    console.log('✅ Connessione MySQL stabilita');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Errore connessione MySQL:', err.message);
  });

module.exports = pool;
