import React from "react";
import ReactDOM from "react-dom";

import Root from "./Root";

// Базовые стили: tailwindcss v4 + переменные темы @fertilizer/ui (packages/ui)
import "./styles/app.css";

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root"),
);

// PWA: регистрацию service worker теперь делает vite-plugin-pwa (injectRegister: 'auto')
// при сборке — он подставляет сниппет в index.html (см. vite.config.ts).
// Старый ручной register() (src/serviceWorker.ts) удалён.
