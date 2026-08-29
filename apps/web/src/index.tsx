import React from "react";
import ReactDOM from "react-dom";

// Базовые стили: tailwindcss v4 + переменные темы @fertilizer/ui (packages/ui).
// ВАЖНО: импортировать ПЕРЕД ./Root — Root тянет атомы @fertilizer/ui
// (vanilla-extract, @layer components). Тогда у tailwindcss v4
// `@layer theme, base, components, utilities;` оказывается в начале CSS,
// и minify сортирует слои в этом порядке (base=preflight не затирает атомы).
import "./styles/app.css";

import Root from "./Root";

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root"),
);

// PWA: регистрацию service worker теперь делает vite-plugin-pwa (injectRegister: 'auto')
// при сборке — он подставляет сниппет в index.html (см. vite.config.ts).
// Старый ручной register() (src/serviceWorker.ts) удалён.
