/**
 * Ponto de entrada principal que renderiza o componente App.
 * Configura o ambiente de execução e registra o componente na árvore de DOM.
 *
 * @module index
 */

import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);

/**
 * Renderiza o componente App na árvore de DOM.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Registra o relatório de métricas de desempenho.
 */
reportWebVitals();
