-- ============================================================
-- Ethera Future Talks — Schema Database
-- Esegui con: sudo mysql -u root -p ethera_futuretalks < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS ethera_futuretalks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ethera_futuretalks;

-- ============================================================
-- TABELLA: scuole
-- ============================================================
CREATE TABLE IF NOT EXISTS scuole (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  citta VARCHAR(100) DEFAULT NULL,
  attiva BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_attiva (attiva)
) ENGINE=InnoDB;

-- ============================================================
-- TABELLA: registrazioni
-- ============================================================
CREATE TABLE IF NOT EXISTS registrazioni (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codice_biglietto CHAR(6) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  cognome VARCHAR(100) NOT NULL,
  eta INT NOT NULL,
  citta VARCHAR(100) NOT NULL,
  scuola_id INT NOT NULL,
  classe VARCHAR(20) NOT NULL,
  rappresentante_istituto BOOLEAN NOT NULL DEFAULT FALSE,
  email VARCHAR(255) NOT NULL,
  qr_code_data TEXT NOT NULL,
  email_inviata BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (scuola_id) REFERENCES scuole(id),
  INDEX idx_codice (codice_biglietto),
  INDEX idx_scuola (scuola_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- TABELLA: checkins
-- ============================================================
CREATE TABLE IF NOT EXISTS checkins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registrazione_id INT NOT NULL,
  scansionato_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metodo ENUM('qr_scan', 'manuale') NOT NULL DEFAULT 'qr_scan',
  operatore VARCHAR(50) DEFAULT 'admin',
  FOREIGN KEY (registrazione_id) REFERENCES registrazioni(id),
  INDEX idx_scan_date (scansionato_at),
  INDEX idx_registrazione (registrazione_id)
) ENGINE=InnoDB;

-- ============================================================
-- DATI INIZIALI: scuole
-- ============================================================
INSERT IGNORE INTO scuole (nome, citta) VALUES
  ('Liceo Scientifico "E. Fermi"', 'Bari'),
  ('Liceo Classico "Q. Orazio Flacco"', 'Bari'),
  ('IISS "Marco Polo"', 'Bari'),
  ('Liceo Scientifico "A. Scacchi"', 'Bari'),
  ('ITIS "Marconi"', 'Bari'),
  ('Liceo Artistico "De Nittis-Pascali"', 'Bari'),
  ('Liceo Scientifico "G. Salvemini"', 'Bari'),
  ('IISS "Romanazzi"', 'Bari'),
  ('Liceo Classico "Socrate"', 'Bari'),
  ('Liceo Scientifico "Canudo"', 'Molfetta');
