# AGENTS.md

## Обзор проекта

**fertilizer-calculator** — веб-PWA для расчёта питательных растворов (гидропоника/агро) и подбора дозировок удобрений по рецепту NPK/микроэлементов.

- React 16 + TypeScript 3.7 (strict) на базе **CRA 3.4** с **react-app-rewired**.
- Состояние: **Redux + redux-form + redux-saga**, персист в `localStorage` (`reduxState`).
- UI: **theme-ui / rebass** + styled-components. Роутинг: react-router (HashRouter) + `@loadable/component` (ленивые страницы).
- Расчёты — чистая библиотека `src/calculator` (алгоритм из [siv237/HPG](https://github.com/siv237/HPG)), без зависимостей от UI.
- Развёртывание на GitHub Pages (workflow: master → корень, остальные ветки → подпапка).

## Команды

```bash
yarn                    # установка зависимостей (corepack)
yarn start              # dev-сервер (http://localhost:3000), BROWSER=none
yarn test               # jest (react-app-rewired)
yarn test -- --watchAll=false --all
yarn lint               # eslint (js,ts,tsx в src, --max-warnings=0)
yarn build              # production-сборка (react-app-rewired build)
yarn full-check         # test + lint + build (pre-commit / preversion)
yarn analyze            # разбор бандла (source-map-explorer)
node server.js          # статика из build/ на :9005
```

- `NODE_OPTIONS=--openssl-legacy-provider` уже задан в скриптах и `.npmrc` — не убирать.
- pre-commit (husky) запускает `yarn full-check`; коммиты проходят только после полного цикла.
- Версионирование: `npm version patch|minor` (preversion = full-check).

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
  docs/                 # справочные .md — импортируются как raw-loader, показаны в Help
  hooks/, utils/, themes/
config-overrides.js     # кастомизация CRA: alias @/, raw-loader для .md, workbox PWA, DefinePlugin
docs/                   # jupyter-модели расчётов (model_v3, EDTA_Fe, dillution)
tools/mdb_convert.ts    # утилита конвертации
```

- Аlias `@/` → `src/` (webpack + tsconfig.paths.json).
- Маркдаун `.md` подключается через `raw-loader` (не babel-импорт).
- Константы сборки (`__VERSION__`, `__COMMIT_HASH__`, `__COMMIT_DATE__`, `__COMMIT_REF_NAME__`) инжектятся `config-overrides.js` из `git` — при сборке git обязателен.

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

- TypeScript strict, ESLint `react-app`. Коммит без прохода lint/test/build не допускается (husky).
- Новую логику расчётов писать в `src/calculator` как чистые функции + тесты рядом; не тащить в компоненты.
- Redux-слайс калькулятора — `components/Calculator/*` (actions/reducers/saga); тип `CalculatorState` там же.
- UI на theme-ui/rebass; темы в `src/themes`. Не вводить новые UI-библиотеки без необходимости.
- Новые страницы: `src/pages/<Name>/` + регистрация в `src/pages/index.ts` (loadable) и `Root.tsx` (Route).
- Справочные тексты: `src/docs/**/*.md`, показаны на странице Help.
- Jupyter-модели — `docs/` (python), не в `src`.
- Язык комментариев в проекте — русский; сохранять стиль.

## Ограничения окружения

- Node ≥ 12 (workflow использует 12.x), yarn.
- Сборка требует доступ к `git` (чтение HEAD) и openssl legacy provider.
- PWA: workbox (`skipWaiting: true`) — не ломать `swDest`/runtimeCaching в `config-overrides.js`.
