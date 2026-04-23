import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Enregistrement du Service Worker pour PWA (installation sur l'écran d'accueil)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => {}); // silencieux si échec
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
