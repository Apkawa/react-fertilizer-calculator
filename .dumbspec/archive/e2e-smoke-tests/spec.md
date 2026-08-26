# Спек: e2e и smoke-тесты (e2e-smoke-tests)

## Цель

Три уровня «лёгких» тестов; глубокого покрытия не требуется:

1. **E2E-тесты** на Playwright — `tests/e2e/`.
2. **Smoke-тесты** на Playwright — `tests/smoke/`.
3. **Смок-тесты компонентов** (vitest/jsdom) рядом с компонентами — «компонент не сломался».

## Стек

- `@playwright/test` — dev-зависимость; один `playwright.config.ts` в корне: `testDir: "./tests"`, проект chromium, `baseURL: http://localhost:3000`, `webServer` = `pnpm start` (Vite dev :3000).
- Smoke-тесты компонентов — на существующем vitest (jsdom, `globals`, setup `src/setupTests.ts`), рядом с компонентами: `*.smoke.test.tsx`.
- Общий обёртка-хелпер для jsdom-рендеров: `src/test-utils/` (Provider(store) > ThemeProvider(defaultTheme) > MemoryRouter).

## E2E (`tests/e2e/`) — сценарии уровня smoke

1. **Калькулятор**: открыть `/#/` → видны сайдбар и «Результат расчета» → нажать **Calculate** → в списке результата появился id одного из дефолтных удобрений (напр. «Нитрат калия (KNO3)»). Без console-ошибок/pageerror.
2. **Навигация**: со страницы «/» кликнуть пункты меню «Удобрения», «Парсер формул», «Плотность», первую страницу справки → маркер нужной страницы виден, ошибок нет.
3. **Персистентность**: посчитать → `reload` → результат сохранился (localStorage `reduxState`).

## Smoke (`tests/smoke/`) — по маршрутам

Каждый маршрут по URL (без кликов): `/`, `/#/fertilizers`, `/#/formula/NaCl`, `/#/density/NaCl`, `/#/example`, `/#/help/how_to_use`, неизвестный маршрут (NotFound). Ассерты: маркер страницы виден, `console.error === 0`, `pageerror === 0`.

## Смок-тесты компонентов (рядом с компонентами)

Состав (только верхнеуровневые; глубинные лиственные/модальные части не трогаем — компоненты скоро переделываются):

- Страницы: `pages/{Calculator, Help, ChemFormula, DensityCalculator, Example, NotFound}`.
- Калькулятор: `components/Calculator` (index), `Options`, `Result`, `FertilizerSelect` (Container), `FertilizerManager` (List).
- UI: `ui/TabMenu`, `ui/Modal`, `ui/Dropdown`, `ui/Sidebar`, `ui/IconButton`, `ui/RebassWidgets/Number`, `ui/ReduxForm/{Input, Checkbox, Radio}`, `ui/csv/ImportCSV`, `ui/ForkMeOnGitHub`.
- Прочее: `components/ColorModeToggle`, `components/LazyPromise`.

Контракт каждого теста: компонент рендерится в обвязке приложения (store + тема + роутер) без исключений; один лёгкий ассерт на наличие ожидаемого маркера. Поведение не проверяется.

## Конфиги, скрипты, границы

- `vitest.config.ts`: `exclude` += `tests/**` (Playwright-файлы не подхватываются vitest).
- Скрипты: `test:e2e` = `playwright test tests/e2e`; `test:smoke` = `playwright test tests/smoke`. `test`/`full-check` не меняем.
- `pnpm type` / `pnpm lint` покрывают только `src` (tsconfig include + `biome check src`) → `tests/` за рамками; компонентные смоки внутри `src/` проходят строгий tsc и biome.
- CI (`full-check`) автоматически подхватит компонентные смоки; Playwright в CI не включаем (браузеров в джобе нет) — запускается локально/вручную.

## Не в скопу

- Полное покрытие поведений компонентов/страниц (тесты smoke-характера).
- CI-джоба для Playwright (не просили; можно отдельным таском).
- Изменения в компонентах под тесты (если компонент не рендерится standalone — это баг, но правки UI вне таска; при необходимости отметим в итоге).
