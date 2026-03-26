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
echo "🔌 Backend:  porta 3102"
echo "🌐 Frontend: porta 3103"
echo ""

# 1. Git push locale
echo "📤 Push su GitHub..."
git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || echo "   (nessuna modifica da committare)"
git push origin main

# 2. Copia il file .env sul server (non è nel repo)
echo ""
echo "🔑 Upload .env sul server..."
scp "$LOCAL_DIR/backend/.env" "$SERVER_USER@$SERVER_IP:$SERVER_PATH/backend/.env"

# 3. Esegui comandi sul server via SSH
echo ""
echo "🔗 Connessione al server..."
ssh "$SERVER_USER@$SERVER_IP" bash -s << REMOTE_SCRIPT

set -e

SERVER_PATH="$SERVER_PATH"
REPO_URL="$REPO_URL"

# Rimuovi vecchi processi PM2 di questo progetto
echo ""
echo "🧹 Pulizia vecchi processi PM2..."
pm2 delete ethera-backend-eft-26 2>/dev/null || true
pm2 delete ethera-frontend-eft-26 2>/dev/null || true

# Clone o pull
if [ ! -d "\$SERVER_PATH/.git" ]; then
  echo ""
  echo "🆕 Primo deploy — clone del repo..."
  mkdir -p "\$SERVER_PATH"
  git clone "\$REPO_URL" "\$SERVER_PATH"
else
  echo ""
  echo "📥 Git pull..."
  cd "\$SERVER_PATH"
  git pull origin main
fi

# Backend
echo ""
echo "📦 Installazione dipendenze backend..."
cd "\$SERVER_PATH/backend"
npm install
mkdir -p logs

# Frontend
echo ""
echo "📦 Installazione dipendenze frontend..."
cd "\$SERVER_PATH/frontend"
npm install
mkdir -p logs

echo ""
echo "🔨 Build frontend..."
npm run build

# Avvia entrambi i processi con PM2
echo ""
echo "🚀 Avvio PM2..."
cd "\$SERVER_PATH/backend"
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Deploy completato!"
echo ""
echo "🔌 Backend:  http://$SERVER_IP:3102"
echo "🌐 Frontend: http://$SERVER_IP:3103"
echo ""
pm2 status

REMOTE_SCRIPT

echo ""
echo "🎉 Tutto fatto!"
echo "   Backend:  http://$SERVER_IP:3102"
echo "   Frontend: http://$SERVER_IP:3103"
