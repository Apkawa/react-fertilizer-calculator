# 2026-10-16_style-modules: style modules

**Created:** 2026-10-16T20:27:27+03:00

## Scope

- Перевести все компонентные `.css` файлы (`packages/ui` ×10, `apps/web` ×3) на CSS Modules (`*.module.css`), заменить глобальные классы на `css.<name>`.
- Сделать компоненты `@fertilizer/ui` изолированными: каждый компонент использует собственный scoped module; все 18 глобальных `ui-*` классов исчезают из глобального пространства.
- Минимизировать глобальные CSS-классы; остаются глобальными только: Tailwind CSS (v4), `theme.css` (CSS-переменные `:root`/`body`), `app.css` (импорты tailwind + theme + `@source`).
- Не трогаем значения стилей (правила, свойства) — только имена классов, имена файлов и импорты.

Вне scope: `packages/icons` (CSS-файлов нет, только Tailwind), `packages/calculator` (UI-зависимостей нет), `packages/ui/.storybook/style.css` (только импорты tailwind+theme, классов нет), рефакторинг `cx`/пропсов, новые фичи.

## Approach

- **`packages/ui`:** переименовать `style.css` → `style.module.css` в 10 компонентах; классы переименовать без префикса `ui-` (`.button`, `.card`, ...); в `index.tsx` — `import css from "./style.module.css"` + `cx(css.button, className)`.
  - Пересечения между компонентами разрешаются импортом нужного модуля в потребителе (Vite поддерживает): `Dropdown` и `NumberInput` импортируют `../Input/style.module.css`; `Modal` и `Sidebar` — `../Text/style.module.css`.
  - `@layer components` в модулях **убрать**: не-layer-ованные модульные классы всегда выше preflight'а (base) Tailwind, что снимает хрупкую зависимость от порядка импортов в `apps/web/src/index.tsx` (комментарий о порядке можно оставить/обновить).
- **`apps/web`:** `navigation/style.css`, `pages/App/App.css`, `pages/Help/style.css` → `*.module.css`. Глобальный селектор `html[data-theme="dark"] .nav-tab:hover` → `:global(html)[data-theme="dark"] .navTab:hover`. `@import` Google Fonts в navigation остаётся первой строкой модуля (Vite/PostCSS обрабатывает).
- **`global.d.ts`:** добавить `declare module "*.module.css"` (оставить `*.css` для глобальных файлов).
- Тесты/Storybook/e2e не зависят от имён классов (проверено: только role/text/aria/id-локаторы) — менять не нужно.
- Tailwind-утилиты внутри компонентов Modal/Sidebar/Dropdown/IconButton остаются (разрешено пользователем).

## Constraints

- React 16 + TypeScript strict + Vite (нативная поддержка CSS Modules); pnpm-воркспейс, source-пакеты без build.
- Tailwind v4 + `@tailwindcss/vite`; `@source` на `packages/ui/src` остаётся.
- `pnpm full-check` (test + lint + type + build) обязателен; husky pre-commit.
- Порталы Modal/Sidebar (`#modal-root`, `#sidebar-root`) — имена id не меняются (e2e ссылается на `#sidebar-root`).
- Тёмная тема — `:root[data-theme="dark"]` в `theme.css` (остается глобальным).

## Open questions

- none

## Changes

- 2026-10-16T20:27:27+03:00 -- v1, initial spec (draft + research)
