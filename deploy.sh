#!/bin/bash
# ============================================================
# deploy.sh — Lancia dal Mac per deployare sul server
# Backend → porta 3102 | Frontend → porta 3103
# ============================================================

set -e

# ============ CONFIGURAZIONE ============
SERVER_USER="root"
SERVER_IP="84.247.135.213"
SERVER_PATH="/var/www/etf_atendance_manager"
REPO_URL="https://github.com/etheraculture/etf_manage_tickets.git"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"
# ========================================

echo "🚀 Deploy Ethera Future Talks..."
echo "================================"
echo "📡 Server: $SERVER_USER@$SERVER_IP"
echo "📁 Path:   $SERVER_PATH"
echo ""

# 1. Git push locale
echo "📤 Push su GitHub..."
git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || echo "   (nessuna modifica da committare)"
git push origin main

# 2. Leggi il file .env locale e codificalo in base64
ENV_CONTENT=""
if [ -f "$LOCAL_DIR/backend/.env" ]; then
  ENV_CONTENT=$(base64 < "$LOCAL_DIR/backend/.env")
  echo ""
  echo "🔑 File .env trovato, verrà caricato sul server"
else
  echo ""
  echo "⚠️  File .env non trovato in backend/.env"
fi

# 3. Tutto in UNA SOLA sessione SSH
echo ""
echo "🔗 Connessione al server..."
ssh "$SERVER_USER@$SERVER_IP" bash -s "$ENV_CONTENT" << 'REMOTE_SCRIPT'

set -e

ENV_BASE64="$1"
SERVER_PATH="/var/www/etf_atendance_manager"
REPO_URL="https://github.com/etheraculture/etf_manage_tickets.git"

# Rimuovi vecchi processi PM2
echo ""
echo "🧹 Pulizia vecchi processi PM2..."
pm2 delete ethera-backend-eft-26 2>/dev/null || true
pm2 delete ethera-frontend-eft-26 2>/dev/null || true

# Clone o pull
if [ ! -d "$SERVER_PATH/.git" ]; then
  echo ""
  echo "🆕 Primo deploy — clone del repo..."
  mkdir -p "$SERVER_PATH"
  git clone "$REPO_URL" "$SERVER_PATH"
else
  echo ""
  echo "📥 Git pull..."
  cd "$SERVER_PATH"
  git pull origin main
fi

# Scrivi il file .env dal contenuto base64
if [ -n "$ENV_BASE64" ]; then
  echo ""
  echo "🔑 Scrittura .env sul server..."
  echo "$ENV_BASE64" | base64 -d > "$SERVER_PATH/backend/.env"
  echo "   ✅ .env scritto con successo"
fi

# Backend
echo ""
echo "📦 Installazione dipendenze backend..."
cd "$SERVER_PATH/backend"
npm install
mkdir -p logs

# Frontend
echo ""
echo "📦 Installazione dipendenze frontend..."
cd "$SERVER_PATH/frontend"
npm install
mkdir -p logs

echo ""
echo "🔨 Build frontend..."
npm run build

# Avvia entrambi i processi con PM2
echo ""
echo "🚀 Avvio PM2..."
cd "$SERVER_PATH/backend"
pm2 start ecosystem.config.js
pm2 save

# Verifica backend
echo ""
echo "⏳ Attendo avvio backend..."
sleep 3
echo "🔍 Test API health..."
curl -s http://localhost:3102/api/health || echo "   ⚠️ Backend non risponde"
echo ""
echo "🔍 Test API scuole..."
curl -s http://localhost:3102/api/scuole || echo "   ⚠️ API scuole non risponde"
echo ""

echo ""
echo "✅ Deploy completato!"
pm2 status

REMOTE_SCRIPT

echo ""
echo "🎉 Tutto fatto!"
echo "   Backend:  http://$SERVER_IP:3102/api/health"
echo "   Frontend: http://$SERVER_IP:3103"
