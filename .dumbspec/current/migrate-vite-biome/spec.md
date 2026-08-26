# Спецификация: миграция сборки на Vite и линтера на Biome

## Цель

Полностью заменить CRA 3.4 + react-app-rewired (webpack 4) на **Vite** (dev + production build) и заменить **eslint + prettier** на **Biome**. Приложение (PWA-расчётник) остаётся тем же: те же страницы, те же маршруты, та же логика расчётов, тот же формат деплоя на GitHub Pages.

## Scope (согласовано с пользователем)

1. **Vite** — полная замена CRA (dev-сервер и production build).
2. **PWA сохраняется и чинится** — workbox-настройка переносится на `vite-plugin-pwa`.
3. **Тесты переезжают на vitest** (каноничное тестирование для Vite).
4. **Biome** заменяет и eslint, и prettier; правила переносятся максимально близко.
5. Процесс dumbspec выполняется автономно (без промежуточных гейтов).

## Выходит за рамки (явно НЕ делаем)

- Обновление TypeScript (остаётся 3.7) и обновлять `@types/*` — Vite/vitest/biome не зависят от tsc.
- Обновление husky (остаётся v4, хук `pre-commit` = `pnpm full-check`).
- Обновление React/theme-ui/redux — только замена бандлера.
- Логика workflow GitHub Pages (`blank.yml`) — не меняется (сохраняем имена скриптов и папку `build/`).
- `tools/mdb_convert.ts` (ts-node), jupyter `docs/`, `server.js` — как есть.

## Текущее состояние (база для миграции)

| Скрипт | Состояние |
| --- | --- |
| `pnpm build` (CRA) | ✅ работает, `build/`, publicPath `./` |
| `pnpm lint` (eslint react-app, `--max-warnings=0`) | ✅ чисто |
| `pnpm test` (jest) | ❌ **сломана: 16 из 17 наборов падают на babel-парсинге TS** (под pnpm). Проходит только `example.ts` |

Вывод: миграция на vitest — это одновременно **восстановление** тестовой базы.

## Что должен воспроизвести Vite (детали из `config-overrides.js`)

| CRA/webpack | Vite-эквивалент |
| --- | --- |
| `output.publicPath = './'` (+ `PUBLIC_URL=./`) | `base: './'` |
| `outDir` = `build/` (так деплоит workflow) | `build.outDir: 'build'` |
| DefinePlugin: `__VERSION__`, `__COMMIT_HASH__`, `__COMMIT_DATE__`, `__COMMIT_REF_NAME__` (git `show` HEAD), `__PUBLIC_PATH__` | `define` в `vite.config.ts` с той же функцией `getBuildInfo()` |
| `raw-loader` для `.md` (10 импортов в `src/pages/Help/pages.ts`) | нативный `?raw`: `import("...md?raw")` |
| CopyPlugin `src/docs/**/*.{jpg,png,jpeg}` → `build/docs/**` | `vite-plugin-static-copy` |
| alias `@/` → `src/` | `resolve.alias` |
| workbox GenerateSW (`rewireWorkboxGenerate`, настройки-по-умолчанию) | `vite-plugin-pwa` (generateSW, авто-регистрация) |
| dev :3000, `BROWSER=none` | `server.port: 3000` |

Дополнительно:
- `jsxRuntime: 'classic'` в `@vitejs/plugin-react` (tsconfig `jsx: react`, в каждом файле `import React`).
- `types/globals.d.ts`: добавить локальную декларацию `declare module "*.md?raw"` (не полагаться на `vite/client` — TS 3.7 не дружит с новыми d.ts).
- Удалить `src/serviceWorker.ts` и его импорт в `src/index.tsx` — регистрацию SW делает `vite-plugin-pwa` (`injectRegister: 'auto'`). **Побочный эффект:** текущая запись в `index.html` регистрирует `pwa-sw.js`, которого в сборке нет — PWA-регистрация сейчас фактически сломана; после миграции она заработает (исправление записано как изменение поведения).
- Убрать из скриптов `NODE_OPTIONS=--openssl-legacy-provider` и `cross-env` (нужны были только для webpack 4).

## Инструменты и версии (проверено в реестре, 2026-08)

Добавить (devDeps, диапазоны `^`):
- `vite` 8.2.x, `@vitejs/plugin-react` 6.x (peer `vite ^8`),
- `vite-plugin-pwa` 1.3.x (+ **обязательные** peer `workbox-build` ^7.4.1, `workbox-window` ^7.4.1),
- `vite-plugin-static-copy` 4.x,
- `vitest` 4.x, `jsdom` 30.x,
- `@testing-library/jest-dom` 7.x (вместо 4.x) — в `setupTests` импорт `@testing-library/jest-dom/vitest`,
- `@biomejs/biome` 2.5.x.

Удалить: `react-scripts`, `react-app-rewired`, `react-app-rewire-workbox`, `raw-loader`, `copy-webpack-plugin`, `workbox-sw`, `@types/workbox-sw`, `eslint`, `ts-jest`, `@types/jest`, `typesync`, `cross-env`. Оставить `source-map-explorer` (скрипт `analyze`), `express` (`server.js`).

## Скрипты после миграции (имена сохраняем — CI/хуки не трогаем)

```
start        = vite          # dev-сервер, порт 3000
build        = vite build    # outDir build/, base ./
test         = vitest run
lint         = biome check src
full-check   = pnpm test && pnpm lint && pnpm build   # как сейчас
analyze      = pnpm build && source-map-explorer 'build/assets/*.js'   # путь к бандлам Vite
types / yarn — убрать (legacy)
```

## Миграция на Biome

- `biome.json` (v2): форматтер (вместо prettier) + линтер.
- Правила: `recommended`-набор (+ `style` и т.п.) — максимально близкие эквиваленты старого `eslint react-app`:
  - `correctness/useExhaustiveDependencies`, `useHooksWithoutDependencies` ≈ правила react-hooks;
  - `organizeImports` (assist) ≈ порядок импортов;
  - нет 1:1-аналогов `import/*`-правил и части `@typescript-eslint/*` — **прогал задокументирован** (приёмлемо, пользователь выбрал «перенести как можно»).
- Разовый прогон `biome format --write` по `src/` (большой формат-коммит — принимается как шум истории).
- `pnpm lint` (a) после: кодбаза проходит `biome check src` **чисто** (ноль ошибок, формат стабилен) — тот же уровень, что старый `--max-warnings=0`.

## Миграция тестов на vitest

- `vitest.config.ts` (или секция в `vite.config.ts`): environment `jsdom` для UI-тестов, `node` для чистых расчётов (по умолчанию jsdom для всего простотой — решение на этапе выполнения, критерий не меняется).
- `setupFiles` → `setupTests.ts` с `@testing-library/jest-dom/vitest`.
- `js-combinatorics` (ESM) — vitest читает ESM нативно, обход `transformIgnorePatterns` больше не нужен.
- **Устаревшие тесты:** `src/__tests__/App.test.tsx` (boilerplate «learn react») заменить на реальный smoke-тест рендера `<App/>` (с store) либо удалить; `example.ts` оставить как sanity-тест. Решение фиксируется при выполнении: критерий — **все 17 наборов проходят**.

## Критерии готовности (Definition of Done)

1. `pnpm full-check` зелёная: **все** тестовые наборы (включая 16 ранее сломанных) проходят под vitest; `biome check src` чистый; `vite build` собирает `build/`.
2. В `build/` присутствуют: `index.html` (с вставленной SW-регистрацией), JS/CSS-бандлы (относительные пути — работает под подпапкой GH Pages), `docs/**` (картинки), `manifest.json`, `sw.js` + workbox-файлы.
3. `pnpm start` поднимает dev-сервер на :3000, приложение рендерится (smoke: главная страница, калькулятор, Help с markdown).
4. Старый toolchain удалён: `config-overrides.js`, `src/serviceWorker.ts`, `yarn.lock`, `eslintConfig` в package.json, `!!raw-loader!`-импорты.
5. `AGENTS.md` обновлён (разделы «Команды», «Структура», «Ограничения окружения»).
6. Коммиты — конвенциональные; история: отдельно формат (biome), отдельно логика.

## Ризики и честные оговорки

- **Всё — latest majors** (vite 8, vitest 4, biome 2.5, pwa 1.3). Если конкретный latest окажется проблемным — откат на предыдущий major внутри той же мажорной линии (решение на этапе выполнения, не меняет spec).
- **Biome не является 1:1 заменой eslint react-app** — часть правил не имеет аналогов (см. выше). Уровень строгости сохраняется через `recommended` + ручной прогон.
- **Формат-коммит** по `src/` — большой diff без изменения логики.
- **PWA**: SW-файл и схема кэширования перезаписаны (workbox 7 вместо workbox 4/5) — это изменение поведения (регистрация начинает работать).
- **TS 3.7** остаётся: IDE-тайпчек для новых конфигов (vite.config и т.д.) не гарантирован, на сборку не влияет (esbuild).
- Родные `?raw`-импорты в vitest: vitest сам трансформирует TS, `?raw` поддерживается нативно (vite-плагины не нужны для теста).

## Открытые вопросы — решены

1. Boilerplate-тест App → заменить на реальный smoke-тест (или удалить — финал на этапе выполнения).
2. SW scope под подпапкой GH Pages → регистрация относительная (`self.location`), ожидается работа в подпапках; проверить при деплое ветки.
3. Формат один раз по всей `src/` → да (отдельный коммит).
4. Версии TypeScript — не трогаем.
