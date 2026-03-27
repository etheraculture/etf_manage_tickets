import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['ticket.etheraculture.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:3102',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3103,
    host: true,
    allowedHosts: ['ticket.etheraculture.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:3102',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
