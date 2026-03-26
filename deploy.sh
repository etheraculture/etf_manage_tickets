#!/bin/bash
# ============================================================
# deploy.sh — Lancia dal Mac per deployare sul server
# Uso:  ./deploy.sh
# ============================================================

set -e

# ============ CONFIGURAZIONE ============
SERVER_USER="root"
SERVER_IP="84.247.135.213"
SERVER_PATH="/var/www/etf_atendance_manager"
APP_NAME="ethera-backend-eft-26"
REPO_URL="https://github.com/etheraculture/etf_manage_tickets.git"
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

# 2. Esegui comandi sul server via SSH
echo ""
echo "🔗 Connessione al server..."
ssh "$SERVER_USER@$SERVER_IP" bash -s << REMOTE_SCRIPT

set -e

SERVER_PATH="$SERVER_PATH"
APP_NAME="$APP_NAME"
REPO_URL="$REPO_URL"

# Se la cartella non esiste, clona il repo (primo deploy)
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

echo ""
echo "📦 Installazione dipendenze backend..."
cd "\$SERVER_PATH/backend"
npm install

echo ""
echo "📦 Installazione dipendenze frontend..."
cd "\$SERVER_PATH/frontend"
npm install

echo ""
echo "🔨 Build frontend..."
npm run build

echo ""
echo "♻️  Restart PM2..."
cd "\$SERVER_PATH/backend"
mkdir -p logs
if pm2 describe "\$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "\$APP_NAME"
else
  pm2 start ecosystem.config.js
fi
pm2 save

echo ""
echo "✅ Deploy completato sul server!"
pm2 status "\$APP_NAME"

REMOTE_SCRIPT

echo ""
echo "🎉 Tutto fatto! Apri http://$SERVER_IP"
