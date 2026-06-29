import React from "./vendor/react.js";
import { createRoot } from "./vendor/react-dom-client.js";
import App from "./App.jsx";
import "./styles.css";

const rootElement = document.getElementById("root");

function renderFatalError(message) {
  if (!rootElement) return;
  rootElement.innerHTML = `
    <main class="fatal-error" role="alert">
      <h1>Dashboard tidak dapat dimuat</h1>
      <p>${message}</p>
    </main>
  `;
}

if (!rootElement) {
  console.error('Element root dengan id="root" tidak ditemukan.');
} else {
  try {
    createRoot(rootElement).render(React.createElement(App));
  } catch (error) {
    console.error("Gagal merender dashboard:", error);
    renderFatalError("Terjadi error runtime saat membuka dashboard. Silakan cek console browser untuk detail teknis.");
  }
}
