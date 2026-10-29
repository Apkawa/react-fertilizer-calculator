import { applyScheme, applyTheme } from "@fertilizer/ui";
import React from "react";
import { createRoot } from "react-dom/client";

// Базовые стили: tailwindcss v4 + переменные темы @fertilizer/ui (packages/ui).
// ВАЖНО: импортировать ПЕРЕД ./Root — сначала должен загрузиться tailwindcss v4,
// чтобы preflight (слой `base`) и переменные темы были доступны. Атомы
// @fertilizer/ui используют CSS-модули, объявленные ВНУТРИ @layer components
// (каждый модуль начинается с `@layer theme, base, components, utilities;`) —
// порядок слоёв задаёт приоритет: components > base, поэтому атомы перебивают
// preflight независимо от порядка импорта файлов.
import "./styles/app.css";

import Root from "./Root";

// Boot до монтирования React (stage 5A): сохранённые намерение темы и схема
// оформления применяются к <html> синхронно, до createRoot/render — иначе
// первая отрисовка на один кадр «вспыхивает» дефолтной темой (FOUC).
// normalizeStored-логика хуков: «default»/пустое/неизвестное → light,
// иначе light|dark|system. applyTheme сам резолвит system через
// prefers-color-scheme; applyScheme нормализует неизвестный id в default.
const savedMode = localStorage.getItem("ui:color-mode");
applyTheme(savedMode === "dark" || savedMode === "system" ? savedMode : "light");
applyScheme(localStorage.getItem("ui:color-scheme") ?? "default");

// React 19: монтирование через createRoot (ReactDOM.render удалён в React 19).
// ВАЖНО: без <React.StrictMode>. react-router v5 подписывается на history в
// КОНСТРУКТОРЕ <Router> (this.unlisten = history.listen(...)). React 16 в
// StrictMode вызывал конструктор дважды (две подписки — работало), а
// React 18/19 (только dev) симулирует размонтирование класс-компонента:
// componentWillUnmount снимает подписку (unlisten), а конструктор повторно не
// вызывается — <Router> перестаёт получать изменения location. Клики по
// ссылкам меняют URL (history.push), но страницу не ререндерит. Убираем
// StrictMode, чтобы миграция на React 19 не ломала клиентский роутинг
// (react-router v6 решает это иначе, но его апгрейд — не KISS для этой задачи).
const root = createRoot(document.getElementById("root")!);
root.render(<Root />);

// PWA: регистрацию service worker теперь делает vite-plugin-pwa (injectRegister: 'auto')
// при сборке — он подставляет сниппет в index.html (см. vite.config.ts).
// Старый ручной register() (src/serviceWorker.ts) удалён.
