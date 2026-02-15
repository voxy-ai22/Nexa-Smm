
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical: Could not find root element '#root' in DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Critical error during React initialization:", err);
    rootElement.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: red;">
      <h2>Application Failed to Load</h2>
      <p>${err instanceof Error ? err.message : String(err)}</p>
      <p>Check console for details.</p>
    </div>`;
  }
}
