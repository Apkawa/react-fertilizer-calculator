# 2026-10-12_react19-migration: поэтапная миграция React 16 → 17 → 18 → 19

**Created:** 2026-10-12T21:48:48+03:00

## Scope

В scope:
- Поэтапное повышение React в `apps/web` (+ lockstep `packages/ui`, `packages/icons`): 16.13.1 → 17 → 18 → 19 (цель — **19.2.x**, как указал пользователь).
- На каждом этапе — фикс всех багов, выявленных тестами/сборкой/типами; `pnpm full-check` зелёный до коммита.
- Обновление сопутствующих react-зависимостей, без которых миграция невозможна: `@types/react`, `@types/react-dom`, `@testing-library/react` (12.1.5 → 14.x на 17, → 16.x на 18/19).
- Замены в коде, требуемые релизами: `ReactDOM.render` → `createRoot` (обязательно для 19).
- Если найдется зависимость, ломающая миграцию: остановиться и написать отчёт, что именно помешало.

Out of scope:
- Изменение бизнес-логики (`packages/calculator` и т.п.).
- Обновление прочих зависимостей, не связанных с React-миграцией (включая переход на React 19.3.0 — это отдельное решение).
- Переход с classic JSX runtime на automatic (React 19 поддерживает оба; классический runtime остаётся).
- Обязательная миграция `forwardRef` на ref-as-prop (в React 19 оба варианта работают; 3 использования оставим).

## Approach

- Три последовательных этапа, каждый — отдельная стадия плана с коммитом:
  1. **React 17** — релиз не ломает публичный API; проверять через full-check.
  2. **React 18** — по upgrade guide: `createRoot` (замена `ReactDOM.render` в `apps/web/src/index.tsx`), StrictMode (уже включён), automatic batching.
  3. **React 19** — по upgrade guide: removal legacy API, типы 19.x, проверка peer-совместимости.
- Базовая линия: до начала — `pnpm full-check` на React 16 (зелёный baseline).
- Порядок правок на каждом этапе: `pnpm-workspace.yaml` (catalog) + `package.json`-ы → `@types/*` + `@testing-library/react` → `pnpm install` → фиксы кода → `pnpm full-check` → коммит.
- Итоговая стадия: playwright smoke-прогон (запуск приложения) + сводный отчёт о миграции.
- Выполнение автономное (явно разрешено пользователем).

## Constraints

(факты из исследования — research.md)
- pnpm-workspace: catalog `react`/`react-dom: ^16.13.1`; `packages/ui` и `packages/icons` имеют собственные devDeps `react-dom` — всё двигается в lockstep.
- Монтирование: `apps/web/src/index.tsx` — legacy `ReactDOM.render(<React.StrictMode>…)`; StrictMode уже включён.
- Чистый кодbase: 0 class-компонентов, 0 string refs, 0 findDOMNode, 0 legacy context, 0 unmountComponentAtNode. `forwardRef` в 3 файлах (icons/Icon, icons/IconButton, ui/Button) — совместим с 19.
- Peer-совместимы со всеми версиями: react-router(v5) 5.2, @loadable/component 5.13, zustand 4.5.7, react-helmet 6, react-markdown 8, Storybook 10.5.10 (16–19), vite 8 / @vitejs/plugin-react 6 / vite-plugin-pwa, vitest 4, jsdom 30.
- Peer-несовпадения (pnpm предупредит, не сломает установку): `react-sortablejs@6` (peer `^16.9.0`), `mini-create-react-context@0.4` (транзитивка react-router v5), `react-side-effect@2.1` (транзитивка react-helmet). Требуется функциональная проверка на каждом этапе (sortablejs — drag&drop в FertilizerManager).
- `@testing-library/react` зафиксирован на 12.1.5 в трёх package.json (web/ui/icons) — peer `<18`, блокирует 18/19.
- husky pre-commit: `pnpm full-check`; Node ≥24, pnpm 11.22.0.
- Актуальный latest React 19.x = 19.3.0; цель задачи — 19.2.x по явному запросу.

## Open questions

- none (все вопросы черновика закрыты исследованием).

## Changes

- 2026-10-12T21:48:48+03:00 -- v1, initial spec (draft + research)
- 2026-10-13T02:17:37+03:00 -- execution: `@testing-library/react` 14.x оказался несовместим с React 17 (peer `^18`) — bump перенесён на этап React 18 (16.x); в ходе e2e-проверки найдено и исправлено 2 регрессии (duplicate-key в `DropdownList`; потеря history-слушателя react-router v5 из-за StrictMode → `<StrictMode>` убран, trade-off задокументирован); блокирующих зависимостей не обнаружено
