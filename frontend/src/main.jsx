import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0E1E2E',
            color: '#F0F4F5',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif",
          },
          success: { iconTheme: { primary: '#2ECC71', secondary: '#0E1E2E' } },
          error: { iconTheme: { primary: '#E74C3C', secondary: '#0E1E2E' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
