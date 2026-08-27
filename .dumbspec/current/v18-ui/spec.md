# Спецификация — v18-ui

Источники: [draft.md](./draft.md), [research.md](./research.md).

## Цель

Перевести приложение на React 18 (LTS-линия) и полностью отказаться от CSS-in-JS (styled-components, @emotion/styled, rebass/@rebass, theme-ui, styled-icons) в пользу **vanilla-extract + tailwindcss** (типизация стилей, CSS собирается во время сборки). UI-компоненты из `apps/web/src/components/ui` поэтапно переписываются и переезжают в новый source-пакет **`packages/ui`** (`@fertilizer/ui`).

## Состав (scope)

### 1. React 18 + «связанные компоненты»
- `react` / `react-dom` → **18.3.1** (последняя версия 18.x LTS-линии; `ReactDOM.render` → `createRoot`).
- Обновить связанные зависимости до React-18-совместимых версий:
  - `@types/react` 18.3.x, `@types/react-dom` 18.3.x;
  - `@testing-library/react` 14.3.x (+ `user-event` 14.x) — v12 работает только с React 16/17;
  - `redux-form` 8.3.10 (первая версия с peer react ^18), `redux` 4.0.5 (без изменений), `redux-saga` (без изменений);
  - `react-router-dom` 5.3.4 (API 5.x сохраняется: HashRouter/Route/Switch/NavLink/useRouteMatch);
  - `@loadable/component` 5.16.x; `react-sortablejs` 6.1.x; `react-router-tabs` 1.3.x (без изменений, peer ок);
  - `react-redux` — **остаётся в 7.x (7.2.9)**: redux-form требует react-redux ^6||^7 (8.3.6) / ^6||^7||^8 (8.3.10), а типы `@types/react-redux` (7.1.34) покрывают именно v7;
  - `react-helmet` 6.1.0 — остаётся (peer ок), runtime проверить смоук-тестами;
  - `react-markdown` 8.0.7 — без изменений (peer ok).
- **Удалить** из зависимостей: `styled-components`, `@emotion/styled`, `rebass`, `@rebass/forms`, `@rebass/preset`, `theme-ui`, `@theme-ui/presets`, `@types/rebass`, `@types/theme-ui`, `@types/rebass__forms`, `@types/styled-components`, `react-focus-lock` (прямая зависимость-остаток; реально приходит через theme-ui). `@types/react-redux` остаётся. Мёртвый `yarn.lock` (там же — единственный след `styled-icons`) удаляется.

### 2. Пакет `packages/ui` + поэтапная миграция
- Новый source-пакет `@fertilizer/ui` (как `packages/calculator`/`packages/icons`): `main`/`exports` → `./src/*.ts`, без собственного build-шага; собирается инструментами приложения (Vite/vitest) и `tsc`. Корневой `type`-скрипт расширяется `tsc -p packages/ui`.
- В `packages/ui` переезжают компоненты из `apps/web/src/components/ui`, переписанные на vanilla-extract + tailwindcss:
  - атомы: `Input`, `NumberInput` (из RebassWidgets), `Checkbox`, `Label`, `Radio` (обёртки без @rebass/forms), `Button`, `Card`, текстовые примитивы;
  - составные: `Dropdown` (+Item/List/context), `Modal` (+Container), `Sidebar` (+Container), `TabMenu` (react-router-tabs остаётся), `ForkMeOnGitHub`, `ImportCSV` (заглушка).
- Темы: `polaris`-палитра → CSS-переменные (vanilla-extract `globalStyle` / tailwind `@theme`), тёмный режим (`ColorModeToggle`) — `data-`атрибут + переключение переменных; миграция сохранённого выбора цвета из старого ключа localStorage theme-ui.
- В остальной части проекта (Root, pages/*, Calculator/*, hooks, test-utils) rebass/theme-ui/sx/`styled` заменяются компонентами `packages/ui` и утилитами tailwindcss; `sx={{...}}` (~28 мест) — на классы.
- `packages/icons`: `Icon`/`IconButton` переписать на месте, без rebass/theme-ui.

### 3. Среда сборки
- `@vanilla-extract/css` 1.21.x + `@vanilla-extract/vite-plugin` 5.2.x (peer vite ^5…^8 — ок для Vite 8.2.2);
- `tailwindcss` 4.3.x + `@tailwindcss/vite` 4.3.x (peer vite ^5.2…^8 — ок);
- плагины добавляются в `apps/web/vite.config.ts` (автоматически действуют и для vitest, т.к. vitest.config расширяет vite.config).

## Вне scope

- Удаление redux + redux-form + redux-saga (отдельная задача). Redux-form-обвязка (`Form`, `reduxForm`, `Field`, `FieldArray`, `getFormValues`, `change`, saga) **не трогается** — только UI-примитивы под ней заменяются.
- Переход на React 19, react-router 6/7, пересборка на новом роутинге.
- Рефакторинг логики калькулятора (`packages/calculator` не меняется).
- Новая версионность/деплой/CI — без изменений (full-check, PWA, GitHub Pages).

## Жёсткие ограничения (фиксация исследования)

1. redux-form (остаётся) фиксирует: react ≤ 18 только с 8.3.10; react-redux ≤ 8 (≤7 для 8.3.6). Последовательный набор на React 18.3.1: **redux-form 8.3.10 + react-redux 7.2.9 + redux 4.0.5**.
2. Vite 8.2.2 поддерживается обоими плагинами (vanilla-extract vite-plugin и @tailwindcss/vite) — понижать Vite не нужно.
3. `packages/icons` прямо зависит от rebass/theme-ui — пока их не вырезать там, из workspace их убрать нельзя.
4. Классический JSX (`import React` в каждом файле, tsconfig `jsx: "react"`) сохраняется.
5. Смоук-тесты компонентов (`*.test.tsx`) и `pnpm full-check` должны проходить после каждого этапа (TDD: красный тест → реализация → рефактор).

## Решения (приняты на ревью)

1. **Пин React: 18.3.1.**
2. **Граница packages/ui: атомы + ui-компоненты** (примитивы + составные из `apps/web/src/components/ui`).
3. **ui/ReduxForm переписывается сейчас** на нативные контролы с новым стилем; обвязка redux-form не трогается.
4. **packages/icons переписывается на месте** (без rebass/theme-ui), пакет остаётся автономным.
5. **react-helmet оставляется** (runtime проверяется смоук-тестами; замена — только если сломается).
6. **`yarn.lock` удаляется** в этой задаче отдельным коммитом-очисткой.

## Подход

- Этапная миграция (TDD на каждом шаге): база (React 18 + плагин vanilla-extract + tailwind, без визуальных изменений) → тематический слой + `packages/ui` → атомы → составные ui-компоненты → Root/pages → Calculator → icons + вычистка зависимостей. На каждом этапе — `pnpm full-check`.
- Визуальное поведение сохраняется (playwright smoke/e2e при необходимости); CSS-in-JS исчезает послойно, промежуточные состояния — рабочее приложение.
