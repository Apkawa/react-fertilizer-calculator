# Рефакторинг packages/ui — спецификация

## Цель (из draft.md)

1. Каждый компонент `packages/ui` — в своей папке вместе с тестами и стилями.
2. Улучшить тесты: регрессионные тесты в реальном браузере на `vitest/browser` + `@vitest/browser-playwright` (+ `vitest-browser-react`).
3. Storybook для всех компонентов `packages/ui`.

## Решения (по research.md; вопросы из черновика закрыты)

### Структура папки компонента

```
packages/ui/src/<Component>/
  index.tsx              — сам компонент (classic JSX, как сейчас)
  style.css              — стили компонента: plain CSS, нативные @layer
  test.tsx               — jsdom-юнит-тесты (@testing-library/react, как сейчас)
  browser.test.tsx       — регрессионные тесты (vitest browser mode, chromium)
  <Component>.stories.tsx— stories для Storybook
```

- Папки для 12 компонентов: `Button`, `Card`, `Checkbox`, `Dropdown`, `ForkMeOnGitHub`, `Input`, `Label`, `Modal`, `NumberInput`, `Radio`, `Sidebar`, `Text` (по текущим 12 компонентным файлам; `Dropdown`/`Modal`/`NumberInput`/`Sidebar` забирают все свои классы).
- `src/index.ts` (баррел), `cx.ts`, `number-utils.ts`, `use-color-mode.ts`, `use-window-size.ts`, `theme.css` остаются в корне `src/`; публичный API баррела **не меняется** (приложение не чувствует).
- Стили: `styles.css.ts` (vanilla-extract, 18 классов) раскладывается по `style.css` каждого компонента. Имена классов — стабильные, читаемые, префикс `ui-` (`ui-button`, `ui-card`, …), маппинг 1:1 с текущими class-константами. Каждый файл оборачивается в `@layer components { … }` (нативные cascade layers) — утилиты tailwind по-прежнему переопределяют атомы, как и сейчас (закомментировано в `styles.css.ts`).
- **vanilla-extract выводится** из `packages/ui` и `apps/web` (`@vanilla-extract/css`, `@vanilla-extract/vite-plugin` — из зависимостей; плагин из `apps/web/vite.config.ts`; plugin-order tailwind→react остаётся). После этого `.css.ts` в проекте не остаётся.
- Для tsc — `global.d.ts` с `declare module "*.css"`.
- `theme.css` (CSS-переменные, тёмная тема `data-theme`) — без изменений.

### Браузерные регрессионные тесты

- Зависимости: `vitest` 4.1.11 + `@vitest/browser-playwright` **4.1.11** (строгой peer-закрепкой к vitest) + `@playwright/test` 1.62.1 (playwright `*` → 1.62.1) → chromium-1234 (уже в `~/.cache/ms-playwright`).
- **Отклонение от дословного draft'а:** `vitest-browser-react`@2.2.0 несовместим с React 16.13.1 (peers `react ^18||^19`, `react-dom/client` в 16 нет). Решение — документированный fallback из собственных docs задачи (`component-testing.md`): `render` из `@testing-library/react` (React 16 совместим, уже в devDeps) + `screen = page.elementLocator(baseElement)`; действия — лоценаторы screen (`click`/`fill`), ассерты — `await expect.element(…).toBeVisible()/toHaveTextContent()/toHaveFocus()/toHaveAttribute()`, `userEvent` из `vitest/browser`.
- `packages/ui/vitest.config.ts` — `test.projects`:
  - `node` — jsdom, юнит-тесты (`src/**/*.test.tsx` + `src/**/test.tsx`, исключая `browser.test.tsx`);
  - `browser` — chromium, `headless`, `provider: playwright()`, `instances: [{ browser: 'chromium' }]`, фиксированный viewport 1280×720, include `src/**/browser.test.tsx`.
- Скрипты пакета: `"test": "vitest run --project node"` (его крутит корневой `pnpm test` / `full-check` / CI), `"test:browser": "vitest run --project browser"` и `"test:watch": "vitest"` (все проекты). **Браузерные тесты — локально/руками**, статус как у e2e (`test:smoke`/`test:e2e` вне full-check/CI).
- Ассерты регрессии: поведение (клик/фокус/ввод) + **ARIA-снапшот** `await expect.element(…).toMatchAriaSnapshot()` на базовое состояние каждого компонента (поддержано в vitest ≥4.1.4, у нас 4.1.11); `.snap`-базлайны коммитятся. Пиксельные скриншоты (VRT) — не сейчас: docs сами указывают на чувствительность к шрифтам/GPU/OC; возможность остаётся (в infra viewport уже зафиксирован).

### Storybook 10.5

- `storybook@10.5.10` + `@storybook/react-vite@10.5.10` (peers: react `^16.8+`, vite `^5..^8`, TS `≥4.9`) — совместимо с 16.13.1 / vite 8.2.2 / TS 7.0.2.
- `packages/ui/.storybook/`: `main.ts` (`framework: '@storybook/react-vite'`, stories `../src/**/*.stories.tsx`, vite-опции — classic JSX, импорт `theme.css` для preview) + `preview.ts`.
- Stories для всех 12 компонентов: базовое состояние + основные варианты (props-варианты, open-состояния).
- Скрипты пакета: `"storybook": "storybook dev -p 6006"`, `"build-storybook": "storybook build"`. **Не в full-check/CI** (локальный инструмент, как e2e и browser-тесты).
- `pnpm-workspace.yaml`: при необходимости — новые build-скрипты зависимостей в `onlyBuiltDependencies` (esbuild уже в списке).

## Вне охвата

- Пиксельные VRT-базлайны (возможность сохранена).
- Рефакторинг компонентов самого приложения (только `packages/ui`).
- Апгрейд React / vitest / других версий.

## Риски (из research.md) и их статус

| Риск | Статус |
| --- | --- |
| Storybook 10.5 + React 16 | проверяется на этапе: `build-storybook` + dev-сервер (playwright-cli) |
| точный peer `@vitest/browser-playwright` → vitest 4.1.11 | не трогаем версию vitest |
| peer-конфликты pnpm при установке | решаются workspace-версиями (одна на всю воркспейс) |
| бинарь chromium | chromium-1234 установлен в `~/.cache/ms-playwright` (bind-mount) |
| слои CSS в browser-тестах | browser-тесты не зависят от CSS (aria/поведение); theme.css в preview Storybook |

## Приёмка

- `pnpm full-check` зелёный (jsdom-тесты всех пакетов + lint + type + build).
- `pnpm -C packages/ui test:browser` зелёный в chromium (все 12 компонентов).
- `pnpm -C packages/ui build-storybook` завершается успешно; dev-сервер показывает stories всех компонентов.
- Приложение не изменено поведением: публичный API `@fertilizer/ui` прежний; `apps/web` собирается и его тесты зелёные.
