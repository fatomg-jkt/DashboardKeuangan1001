import React from './vendor/react.js';
import { createRoot } from './vendor/react-dom-client.js';
import App from './App.js';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element dengan id="root" tidak ditemukan di index.html');
}

createRoot(rootElement).render(React.createElement(App));
