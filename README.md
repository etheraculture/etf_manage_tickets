# Ethera Future Talks — Seconda Edizione 2026

Piattaforma web per la registrazione e il check-in degli studenti all'evento Ethera Future Talks.

## Stack

- **Frontend:** React 18 (Vite)
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Email:** Microsoft Graph API
- **Deploy:** PM2 + Nginx

## Setup Locale

```bash
# Backend
cd backend
cp .env.example .env   # ← configura le variabili
npm install
npm run dev             # → http://localhost:3102

# Frontend
cd frontend
npm install
npm run dev             # → http://localhost:5173
```

## Deploy sul Server

```bash
chmod +x deploy.sh
./deploy.sh
```

Il deploy script esegue:
1. `git pull` delle ultime modifiche
2. `npm install` su backend e frontend
3. `npm run build` del frontend
4. Restart/avvio PM2 sulla porta 3102

## Schema Database

Importa lo schema MySQL:
```bash
sudo mysql -u root -p ethera_futuretalks < schema.sql
```

## Struttura API

| Endpoint | Metodo | Auth | Descrizione |
|---|---|---|---|
| `/api/scuole` | GET | No | Lista scuole attive |
| `/api/registrazione` | POST | No | Registra studente |
| `/api/admin/login` | POST | No | Login admin → JWT |
| `/api/admin/stats` | GET | JWT | Statistiche iscrizioni |
| `/api/admin/scuole` | GET/POST | JWT | Lista/Aggiungi scuole |
| `/api/admin/scuole/:id` | PUT/DELETE | JWT | Modifica/Disattiva scuola |
| `/api/admin/checkin` | POST | JWT | Check-in biglietto |
| `/api/admin/scansioni` | GET | JWT | Registro scansioni per giorno |
