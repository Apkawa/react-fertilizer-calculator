# Spec: pnpm-workspace — расщепление репозитория на pnpm workspace

> Обновлённая версия: draft.md + research.md (исследование завершено).

## Цель

Превратить monolith в pnpm workspace:

```
<root>
  apps/
    web/            # текущее реакт-приложение (всё, что было в src — кроме вынесенного)
  packages/
    calculator/     # @fertilizer/calculator — расчётное ядро (текущее src/calculator)
    test-utils/     # @fertilizer/test-utils — тестовые утилиты (текущее src/test-utils)
```

## Ключевое ограничение

**Результат сборки не должен меняться — всё по-старому.** Функционально идентичная сборка: те же артефакты, та же PWA-обвязка, те же страницы; строковые пути внутри бандла/карточки могут отличаться.

> Решение (пользователь, 2026-08-27): **побайтовое** совпадение ассетов не требуется — достаточно, чтобы сборка запускалась и приложение работало (разница — перегруппировка shared-чанков rollup в workspace-раскладке: те же модули, другие content-hash имена).

## Структура и содержимое

### `apps/web` (`@fertilizer/web`)
- Всё из `src/`, кроме `calculator/` и `test-utils/` (см. ниже).
- `vite.config.ts`, `vitest.config.ts`, `index.html`, `public/`, `tsconfig*.json`, `types/globals.d.ts` (кроме декларации `cubic-spline` → уходит в пакет), `src/setupTests.ts`.
- `version` (0.2.1) переезжает в `apps/web/package.json` (отсюда `__VERSION__`).
- Все текущие runtime/dev зависимости корня (react 16, redux-стек, theme-ui, vite, vitest, testing-library, ...).
- `@fertilizer/calculator: workspace:*` (dependency), `@fertilizer/test-utils: workspace:*` (devDependency).

### `packages/calculator` (`@fertilizer/calculator`)
- Всё содержимое `src/calculator/` (включая колоцированные тесты `__tests__/`, `*.test.ts`).
- **Source-пакет без шага сборки**: `main`/`exports` указывают на `src/*.ts`; app бандлит исходники через vite, `tsc` ходит по exports (moduleResolution: bundler).
- `dependencies`: `js-combinatorics`, `cubic-spline`. `devDependencies`: `vitest`, `typescript`.
- Файлы `types.d.ts` → `types.ts`, `format/types.d.ts` → `format/types.ts` (exports-паттерн `"./*": "./src/*.ts"` не ловит `.d.ts`).
- Внутренние `@/calculator/...` → относительные импорты.

### `packages/test-utils` (`@fertilizer/test-utils`)
- Реализация обвязки для тестов (см. «Расцепка циклов»): `createRenderApp(store, theme)`, `createFormWrapper(formName)`.
- `peerDependencies`: react, react-dom, react-redux, react-router-dom, redux, redux-form, theme-ui, @testing-library/react — все обеспечиваются приложением; один lockfile → одна версия → один экземпляр модуля (React не дублируется).
- `devDependencies`: typescript, @types/* (react, redux-form, react-router-dom, theme-ui, react-redux).

## Расцепка циклов (по итогам research)

1. **`src/utils`** → 7 функций, потребляемых calculator'ом (`countDecimals, entries, keys, round, sum, values, tryParseFloat`), переезжают в `packages/calculator/src/utils.ts`; app-файл `src/utils/index.ts` их ре-экспортирует из пакета (единый источник), локально остаются `toMap/update/updateOrPush/equal` + `csv.ts` + `downloads.ts` + их тесты. Импорт-сайты в app (`@/utils`) не меняются.
2. **`format`-модуль остаётся в пакете**, цикл типов разбивается структурно: пакет сам определяет `ExportCalculationForm`/`Recipe`/`ExportStateType` (только типы пакета), в базовый `FertilizerInfo` пакета добавляется опциональный `pump_number?: number`. Типы app (`CalculatorState`, `CalculatorFormValues`, расширенный `FertilizerInfo`) не трогаются — структурная типизация TS сохраняет совместимость во всех местах (ExportState/ImportState/actions/saga/reducer — проверено).
3. **test-utils**: пакет = generic-механика; app сохраняет **те же модульные пути** `src/test-utils/render.tsx` (привязывает сторовый singleton `store` + `defaultTheme`) и `src/test-utils/form.tsx` (re-export). ~30 тестовых файлов не меняются вообще.

## Команды (корень — прокси, «всё по-старому»)

| Корень | Выполняет |
| --- | --- |
| `pnpm install` | как было (workspace, один lockfile, store `./.pnpm-cache/v11`) |
| `pnpm start` | `apps/web` vite dev (:3000) |
| `pnpm build` | `apps/web` → `apps/web/build/` |
| `pnpm test` | тесты `packages/calculator` + `apps/web` (vitest, последовательно) |
| `pnpm lint` | `biome check apps packages` |
| `pnpm type` | `tsc -p` по каждому из apps/web, packages/calculator, packages/test-utils |
| `pnpm full-check` | test + lint + type + build (как было, на корневых прокси) |
| `pnpm analyze` | build + source-map-explorer `apps/web/build/assets/*.js` |
| `node server.js` | static `apps/web/build/` на :9005 (файл остаётся в корне) |
| `pnpm test:smoke` / `test:e2e` | playwright как был (tests/ в корне, webServer `pnpm start`) |

## Вне scope / остаётся как есть

- `tests/` (playwright e2e/smoke), `tools/`, `docs/` (jupyter), `server.js`, `.env`, `.npmrc`, husky, `AGENTS.md`-обновление в финальном этапе.
- Легаси-файлы `config-overrides.js`, `yarn.lock` — не трогаем (в сборку не входят).
- CI: **единственная** правка — `FOLDER: build` → `FOLDER: apps/web/build` (набор артефактов не меняется).

## Открытые вопросы (решения по умолчанию — см. research, подтверждение пользователю)

1. Тонкие биндинги test-utils в app (ноль правок тестов) vs полный перенос с изменением call-site'ов. **По умолчанию: биндинги.**
2. `utils`: перенос 7 функций + re-export vs дублирование в пакете. **По умолчанию: перенос + re-export.**
3. Версия приложения в `apps/web/package.json` (версионирование через `npm version` на корне перестаёт бампить версию — зафиксировать процесс в AGENTS.md). **По умолчанию: да.**
4. `server.js` остаётся в корне (мечет на `apps/web/build/`). **По умолчанию: да.**
