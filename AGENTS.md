# AGENTS.md

## Обзор проекта

**fertilizer-calculator** — веб-PWA для расчёта питательных растворов (гидропоника/агро) и подбора дозировок удобрений по рецепту NPK/микроэлементов.

- React 16 + TypeScript 7 (strict) на **Vite** (@vitejs/plugin-react, JSX classic runtime) + vite-plugin-pwa.
- Состояние: **Redux + redux-form + redux-saga**, персист в `localStorage` (`reduxState`).
- UI: **theme-ui / rebass** + styled-components. Роутинг: react-router (HashRouter) + `@loadable/component` (ленивые страницы).
- Расчёты — чистая библиотека `src/calculator` (алгоритм из [siv237/HPG](https://github.com/siv237/HPG)), без зависимостей от UI.
- Развёртывание на GitHub Pages (workflow: master → корень, остальные ветки → подпапка).

## Команды

```bash
pnpm install            # установка зависимостей
pnpm start              # dev-сервер (vite, http://localhost:3000)
pnpm test               # vitest run (jsdom, setupFiles src/setupTests.ts)
pnpm lint               # biome check src
pnpm type               # typescript check
pnpm build              # production-сборка (vite build → build/)
pnpm full-check         # test + lint + build (pre-commit / preversion)
pnpm analyze            # разбор бандла (source-map-explorer)
node server.js          # статика из build/ на :9005
```

- pre-commit (husky) запускает `pnpm full-check`; коммиты проходят только после полного цикла.
- Версионирование: `npm version patch|minor` (preversion = full-check).
- Кэши — в каталоге проекта, не глобально: для pnpm задаём env `pnpm_config_store_dir=./.pnpm-cache/v11`, для playwright-cli — `PLAYWRIGHT_BROWSERS_PATH=./.cache/ms-playwright/`.

## Структура

```
src/
  calculator/           # ядро расчётов — чистая логика, тесты рядом
    index.ts            # calculate_v1..v4 (текущий: v4)
    fertilizer.ts       # нормализация удобрения (оксид-факторы и т.д.)
    dilution.ts         # концентрации (Concentration: number | {volume,ec|ppm})
    profile.ts          # профили/баланс элементов
    chem.ts             # химические формулы, молярные массы
    itertools.ts        # combination/product (комбинаторика)
    molecular-parser/   # разбор молекулярных формул (портировано с node-molecular-parser)
    density-calculator/ # плотность раствора через сплайн-интерполяцию
    __tests__/          # эталонные тесты расчётов
  components/Calculator/# UI калькулятора: Form, FertilizerManager, Mixer, ImportExport, Diary, Options, Result
    actions.ts / reducers.ts / saga.ts  # локальный redux-слайс
  pages/                # страницы (ленивые): Calculator, Help, ChemFormula, DensityCalculator, Example, NotFound
  redux/                # корневой store: calculator + redux-form; персист localStorage
  docs/                 # справочные .md — импортируются с ?raw, показаны в Help
  hooks/, utils/, themes/
vite.config.ts          # сборка: alias @/, define-константы, копирование картинок, vite-plugin-pwa
vitest.config.ts        # тесты: jsdom + общие настройки из vite.config.ts
docs/                   # jupyter-модели расчётов (model_v3, EDTA_Fe, dillution)
tools/mdb_convert.ts    # утилита конвертации
```

- Alias `@/` → `src/` (vite `resolve.alias` + tsconfig.paths.json).
- Маркдаун `.md` импортируется с query `?raw` (нативная механика Vite, `src/pages/Help/pages.ts`).
- Константы сборки (`__VERSION__`, `__COMMIT_HASH__`, `__COMMIT_DATE__`, `__COMMIT_REF_NAME__`) инжектятся `define` в `vite.config.ts` из `git` — при сборке git обязателен.

## Ядро расчётов (src/calculator)

Версии алгоритма, текущая — **`calculate_v4`**:
- **v4** — разбивает удобрения на макро/микро, считает микро отдельно, затем макро с учётом `prevElements`.
- **v3** — перебор комбинаций удобрений (`combination`), ранний выход при `score >= 100`.
- **v2** — жадный подбор по элементу максимального дефицита (алгоритм HPG).
- **v1** — DEPRECATED (метод сетки весов).

Важные сущности (`calculator/types.d.ts`): `Fertilizer`, `FertilizerInfo`, `NeedElements`, `Elements`, `CalculateResult`, `CalculateOptions` (`accuracy`, `ignore`, `solution_volume`, `solution_concentration`, `prevElements`).

Оксид-факторы: NPK задаются в процентах оксидов (N, P2O5, K2O, CaO…) — см. `src/docs/technique.md`.

Тесты расчётов в `src/calculator/__tests__/` — эталонные, не нарушать. При изменении формул/приоритетов (`ElementPriority`, `MICRO_ELEMENT_NAMES`) обновлять тесты.

## Правила и соглашения

- TypeScript strict, линтер — **Biome** (`biome.json`, `pnpm lint`). Коммит без прохода lint/test/build не допускается (husky).
- Новую логику расчётов писать в `src/calculator` как чистые функции + тесты рядом; не тащить в компоненты.
- Redux-слайс калькулятора — `components/Calculator/*` (actions/reducers/saga); тип `CalculatorState` там же.
- UI на theme-ui/rebass; темы в `src/themes`. Не вводить новые UI-библиотеки без необходимости.
- Новые страницы: `src/pages/<Name>/` + регистрация в `src/pages/index.ts` (loadable) и `Root.tsx` (Route).
- Справочные тексты: `src/docs/**/*.md`, показаны на странице Help.
- Jupyter-модели — `docs/` (python), не в `src`.
- Язык комментариев в проекте — русский; сохранять стиль.

## Ограничения окружения

- Node ≥ 24 (`engines` в package.json, workflow использует 24.x), **pnpm** (версия из `packageManager`).
- Сборка требует доступ к `git` (чтение HEAD — `getBuildInfo()` в `vite.config.ts`).
- PWA: **vite-plugin-pwa** (generateSW, `registerType: auto`) — настраивается в `vite.config.ts`.
