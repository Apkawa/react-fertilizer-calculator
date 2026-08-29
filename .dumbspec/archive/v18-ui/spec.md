# Спецификация — v18-ui

Источники: [draft.md](./draft.md), [research.md](./research.md).

## Цель

Полностью отказаться от CSS-in-JS (styled-components, @emotion/styled, rebass/@rebass, theme-ui, styled-icons) в пользу **vanilla-extract + tailwindcss** (типизация стилей, CSS собирается во время сборки). UI-компоненты из `apps/web/src/components/ui` поэтапно переписываются и переезжают в новый source-пакет **`packages/ui`** (`@fertilizer/ui`).

React **остаётся на 16.13.1** (закреплён пnpm-catalog'ом) — требование миграции на React 18 выпилено из черновика (scope change 2026-08-28).

## Состав (scope)

### 1. Пакет `packages/ui` + поэтапная миграция
- Новый source-пакет `@fertilizer/ui` (по образцу `packages/calculator`/`packages/icons`): `main`/`exports` → `./src/*.ts`, без собственного build-шага; собирается инструментами приложения (Vite/vitest) и `tsc`. Корневой `type`-скрипт расширяется `tsc -p packages/ui`.
- В `packages/ui` переезжают компоненты из `apps/web/src/components/ui`, переписанные на vanilla-extract + tailwindcss:
  - атомы (презентационные): `Input`, `NumberInput` (из RebassWidgets), `Checkbox`, `Label`, `Radio`, `Button`, `Card`, текстовые примитивы;
  - составные: `Dropdown` (+Item/List/context), `Modal` (+Container), `Sidebar` (+Container), `TabMenu` (react-router-tabs остаётся), `ForkMeOnGitHub`, `ImportCSV` (заглушка).
- Форм-контроли (`ui/Form`, zustand/form-context): презентационная база → атомы `packages/ui`; контролируемые обёртки (`name`/`normalize`/`useFormField`) остаются в `apps/web` как тонкий glue — `FormProvider`/`useFormField` не меняются.
- Темы: `polaris`-палитра → CSS-переменные (`:root` + тёмный вариант через `data-`атрибут), тёмный режим (`ColorModeToggle`) — хук `useColorMode` в `packages/ui` (localStorage, однократная миграция с legacy-ключа theme-ui).
- В остальной части проекта (Root, pages/*, Calculator/*, test-utils) rebass/theme-ui/sx/`styled` заменяются компонентами `packages/ui` и утилитами tailwindcss; `sx={{...}}` (16 мест в Calculator) — на классы.
- **`Box`/`Flex` НЕ создаются как компоненты**: layout-обёртки (119 мест в Calculator) заменяются прямым `<div>`/`<span>` с tailwind-классами на элементе (чистый tailwind, без новой API). Замена «выкинуть rebass» понимается как: писать свои компоненты/классы в стиле tailwind, **не подглядывая в исходники rebass** — API `@fertilizer/ui` не клонирует пропсы rebass.
- `packages/icons`: `Icon`/`IconButton` переписать на месте, без rebass/theme-ui.

### 2. Среда сборки
- `@vanilla-extract/css` 1.21.x + `@vanilla-extract/vite-plugin` 5.2.x (peer vite ^5…^8 — ок для Vite 8.2.2);
- `tailwindcss` 4.3.x + `@tailwindcss/vite` 4.3.x (peer vite ^5.2…^8 — ок);
- плагины добавляются в `apps/web/vite.config.ts` (автоматически действуют и для vitest, т.к. vitest.config расширяет vite.config);
- стили компонентов — в cascade-layer ниже tailwind `utilities` (vanilla-extract `layer()`), чтобы tailwind-утилиты всё ещё переопределяли классы компонентов.

### 3. Очистка зависимостей
- Удалить: `styled-components`, `@emotion/styled`, `rebass`, `@rebass/forms`, `@rebass/preset`, `theme-ui`, `@theme-ui/presets`, `react-focus-lock` (прямая зависимость-остаток; реально приходит через theme-ui), `@types/rebass`, `@types/theme-ui`, `@types/rebass__forms`, `@types/styled-components`.
- Удалить мёртвый `yarn.lock` (pre-pnpm; единственный след `styled-icons`) и закомментированный `apps/web/src/react18-types-compat.d.ts` (остаток выпиленной пробы React 18).

## Вне scope

- Апгрейд React: остаётся **16.13.1** (catalog), `@types/react(-dom)` 16.9.x, `ReactDOM.render`, `@testing-library/react` 12.1.5 — никаких обновлений версий.
- Переход на react-router 6/7, пересборка на новом роутинге.
- Рефакторинг логики калькулятора (`packages/calculator` не меняется).
- Стор и формы (zustand + form-context) — логика без изменений; меняется только презентационная база под ней.
- Новая версионность/деплой/CI — без изменений (full-check, PWA, GitHub Pages).

## Жёсткие ограничения (фиксация исследования)

1. React 16.13.1 закреплён пnpm-catalog'ом (`pnpm-workspace.yaml`) — без обновления версий react/react-dom; `@testing-library/react` остаётся 12.1.5 (RTL 14+ требует React 18).
2. Vite 8.2.2 поддерживается обоими плагинами (`@vanilla-extract/vite-plugin` peer ^8, `@tailwindcss/vite` peer ^8) — понижать Vite не нужно.
3. `packages/icons` прямо зависит от rebass/theme-ui — пока их не вырезать там, из workspace их убрать нельзя.
4. Классический JSX (`import React` в каждом файле, tsconfig `jsx: "react"`) сохраняется.
5. Смоук-тесты компонентов (`*.test.tsx`) и `pnpm full-check` должны проходить после каждого этапа (TDD: красный тест → реализация → рефактор).

## Решения (приняты на ревью)

1. **React: остаётся 16.13.1** (требование про React 18 выпилили из черновика).
2. **Граница packages/ui: атомы + ui-компоненты** (презентационные примитивы + составные из `apps/web/src/components/ui`).
3. **`ui/Form` мигрирует**: презентационная база — новые атомы; `FormProvider`/`useFormField` (zustand) остаются в приложении. Старое исключение (redux-form) устарело.
4. **packages/icons переписывается на месте** (без rebass/theme-ui), пакет остаётся автономным.
5. **react-helmet оставляется** (body-overflow Modal/Sidebar; peer ок на React 16; runtime проверяется смоук-тестами).
6. **`yarn.lock` и `react18-types-compat.d.ts` удаляются** на этапе очистки.
7. **Box/Flex — не компоненты** (решено 2026-08-29): 119 мест в Calculator переписываются на `<div className="flex ...">` с tailwind-классами (`flex-col`/`items-*`/`justify-*`/`flex-wrap`/`flex-1`/`w-full`/`max-w-*`/`m-*`/`p-*`, арбитражные значения). Новый импорт в Calculator: `from "@fertilizer/ui"` — только `Button`/`Card`/`Heading`/`Text`.
8. **Text/Heading остаются минимальные** (`div`/тег + `className`): rebass-пропсы коллсайтов (`fontSize`, `flex`, `textAlign`, `minWidth`, `sx`) → tailwind-классы (`text-base`/`text-[2rem]`, `flex-1`, `text-center`, `min-w-[3em]`, `whitespace-nowrap`); числовые `fontSize`/m-p — по индексным шкалам темы polaris (`space [0,4,8,16,32,64,128]` px, `fontSizes [12,14,16,20,24,32,48,64,96]` px).
9. **sx → tailwind**: 16 мест `sx={{...}}` → className (arbitrary values где нужно); `mobileStyles(...)` (media ≤800px) → вариант `max-[800px]:`; `apps/web/src/components/ui/styled.ts` удаляется.

## Подход

- Этапная миграция (TDD на каждом шаге): среда сборки (vanilla-extract + tailwind + тема, без визуальных изменений) → атомы + форм-контроли → составные ui-компоненты → Root/pages → Calculator → icons + вычистка зависимостей. На каждом этапе — `pnpm full-check`.
- Визуальное поведение сохраняется (playwright smoke/e2e при необходимости); пиксель-перфект не обязателен, но желателен. CSS-in-JS исчезает послойно; промежуточные состояния — рабочее приложение.
