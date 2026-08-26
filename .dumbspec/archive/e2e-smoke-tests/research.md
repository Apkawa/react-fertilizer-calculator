# Research: e2e-smoke-tests

## Project toolchain (package.json, configs)

- Scripts: `test` = `vitest run`; `lint` = `biome check src`; `type` = `tsc --build`; `build` = `vite build`; `full-check` = `test && lint && type && build`; husky pre-commit runs `pnpm full-check`.
- **No Playwright dependency yet.** React 16.13, `@testing-library/react` 12.1.5 (React 16-compatible), `vitest` ^4.1.11, `vite` ^8.2.2, `typescript` 7.0.2, node >= 24, pnpm 11.22.
- `vitest.config.ts`: merges `vite.config.ts` (alias `@/` → src, define constants), `environment: jsdom`, `globals: true`, `setupFiles: src/setupTests.ts` (loads `@testing-library/jest-dom/vitest`).
- `tsconfig.json`: `include: ./src/**/*` only, `types: ["vitest/globals"]`, `jsx: react`, strict, noEmit. => files in `tests/` are NOT type-checked by `pnpm type`; files next to components (inside `src/`) ARE type-checked and linted.
- `biome.json`: vcs `useIgnoreFile`; lint script targets `src` only → `tests/` files are not linted.
- `vite.config.ts`: dev server port 3000; `base: "./"`; PWA `VitePWA({ registerType: "auto" })` (generateSW — active in build, inactive in dev by default); `getBuildInfo()` runs `git` at config load.
- `.gitignore`: has `.playwright-cli/` (artifacts of playwright-cli UI checks), `.cache/`, `.pnpm-cache/`.

## Existing test precedents

- `src/__tests__/App.test.tsx` — jsdom smoke test: `render(<Root store={store} />)` from `src/redux/index`, `waitFor` lazy chunk mount (loadable), 30 s timeout. Checks footer text and Calculator mount markers.
- `src/__tests__/markdown.test.tsx` — react-markdown contract test (jsdom).
- `src/calculator/__tests__/*` — pure reference tests, no UI.

## App structure

- `Root.tsx`: Provider(redux) > ThemeProvider(theme-ui defaultTheme) > HashRouter > TabMenu + ForkMeOnGitHub + Switch(routes). Routes: `/formula/:formula?/:percent?` (ChemFormula), `/density/...` (DensityCalculator), `/example` (Example), `/help/:slug*` (Help), `/` (Calculator page), `*` (NotFound). Footer shows `__VERSION__-ref hash [date]`.
- `pages/index.ts`: loadable lazy pages (App, NotFound, Help, Calculator, ChemFormula, DensityCalculator, Example).
- `pages/Calculator/index.tsx`: nested HashRouter; `/` → `components/Calculator` (default export, redux-form `REDUX_FORM_NAME` + connect), `/fertilizers` → `FertilizerManager`.
- Component tree (src/components): Calculator/{FertilizerManager, FertilizerSelect, ImportExport, Mixer, Options, Result, constants}, ui/{Dropdown, Modal, RebassWidgets, ReduxForm, Sidebar, TabMenu, csv, ...}. ~50 tsx files total.

## Routing for e2e

- HashRouter: real URLs are `http://localhost:3000/#/`, `/#/example`, `/#/help/<slug>`, `/#/formula/...`, `/#/density/...`; FertilizerManager is `/#/fertilizers` (nested router).

## Open / to verify

- `src/redux/index.ts` exports (store) — needed for component smoke tests.
- Theme: `src/themes` defaultTheme for ThemeProvider wrapper in jsdom renders.
- Browser availability for Playwright in sandbox (`.cache/ms-playwright` bind-mounted at `~/.cache/ms-playwright`).
- How to render leaf components (need: redux store + ThemeProvider + redux-form; router context where used).
- Vitest must NOT pick up `tests/**/*.test.ts` (Playwright) → need `exclude` in vitest config OR different file naming.

## More findings

- `src/redux/index.ts`: exports singleton `store` (createStore + sagaMiddleware, rootSaga running). Subscribes to every state change → `localStorage["reduxState"]`. Pre-seeds `fertilizers`/`recipes` from defaults when persisted state lacks them. Component smoke tests can reuse this singleton (as `src/__tests__/App.test.tsx` does).
- Theme: `src/themes/index.ts` exports `defaultTheme` (theme-ui polaris preset + custom colors).
- Calculator submit button: `src/components/Calculator/Options/Options.tsx` — `<Button type="submit">Calculate</Button>` (submit dispatches `calculateStart()`).
- Default fertilizers (`src/components/Calculator/constants/fertilizers.ts`): ids like "Нитрат калия (KNO3)", "Нитрат аммония (NH4NO3)", "Сульфат магния (MgSO4*7H2O)"… — stable text markers for e2e (ResultFertilizerList renders `<li>…г … {f.id}</li>`).
- Result section heading: "Результат расчета" (present on mount, values update after calculate).
- `src/pages/NotFound/index.tsx`: `<h1>Not found</h1>`.
- `FertilizerSelect` default export = `Container`; `FertilizerManager` default export = `List` (uses `ReactSortable` — sortablejs in jsdom, plus Modal/AddEdit redux-form).
- Help pages slugs: `how_to_use`, `newbie-guide`, `profile` (+ child `profile/example`), … `HELP_PAGES` in `src/pages/Help/pages.ts`.
- UI tabs (TabMenu/Sidebar): "Калькулятор" `/`, "Удобрения" `/fertilizers`, "Парсер формул" `/formula/`, "Плотность" `/density/`, "Справка" sub-menu.
- CI (`.github/workflows/blank.yml`): push to master/dev → `pnpm install --frozen-lockfile` + `pnpm full-check` + GH Pages deploy. => anything in `pnpm test` (vitest) runs in CI automatically; Playwright does not (browser not in that job).
- Browser binaries already cached in `~/.cache/ms-playwright`: chromium-1169/1234, firefox-1482/1538, webkit-2158/2336 (+ headless shells). `@playwright/test` is NOT installed in the project yet.
- `tests/` dir exists with empty `e2e/` and `smoke/` subdirs (untracked, git can't track empty dirs).

## Decisions (validated in execution)

- **Runner for e2e + smoke:** `@playwright/test` (devDep), one `playwright.config.ts` at repo root, `testDir: "./tests"`, project: chromium only, `baseURL: http://localhost:3000`, `webServer: pnpm start` (vite dev, :3000) with `reuseExistingServer: true` for local dev.
- **Vitest exclusion:** add `exclude: [...defaults, "tests/**"]` to `vitest.config.ts` so `vitest run` never picks up Playwright `*.test.ts` files from `tests/`.
- **Component smoke tests:** vitest + jsdom (existing infra), co-located `*.smoke.test.tsx` next to components, shared render helper in `src/test-utils/` wrapping: `Provider(store)` > `ThemeProvider(defaultTheme)` > `MemoryRouter`. Set = top-level components + pages (leaves like AddItemElementForm/Mixer modal internals skipped — components get reworked soon).
- **Scripts:** `test:e2e` = `playwright test tests/e2e`, `test:smoke` = `playwright test tests/smoke`. `full-check` unchanged (Playwright not in pre-commit/CI: browsers unavailable there; component smokes ride in `pnpm test` and thus in CI).
- **Naming:** vitest files `*.smoke.test.tsx` (colocated); playwright files `*.test.ts` under `tests/e2e/` + `tests/smoke/`.
- **E2E scenarios (smoke-level, not exhaustive):**
  1. calculator: load `/#/` → sidebar + "Результат расчета" visible → click `Calculate` → wait for result list to contain a default fertilizer id (e.g. "Нитрат калия (KNO3)") → no console errors/page errors.
  2. navigation: open `/#/`, click sidebar links "Удобрения", "Парсер формул", "Плотность", first help page → each target marker visible, no console errors.
  3. persistence: calculate → `page.reload()` → result still present (localStorage `reduxState` round-trip).
- **Smoke scenarios (per-route, URL-driven):** `/`, `/#/fertilizers`, `/#/formula/NaCl`, `/#/density/NaCl`, `/#/example`, `/#/help/how_to_use`, unknown `/#/definitely-not-a-page` → page-specific marker + zero console.error + zero pageerror.
- **Component smoke set (co-located):**
  - pages: Calculator, Help, ChemFormula, DensityCalculator, Example, NotFound
  - components/Calculator: Calculator (index), Options, Result, FertilizerSelect (Container), FertilizerManager (List)
  - components/ui: TabMenu, Modal, Dropdown, Sidebar, IconButton, RebassWidgets/Number, ReduxForm/{Input,Checkbox,Radio}, csv/ImportCSV, ForkMeOnGitHub
  - components: ColorModeToggle, LazyPromise
  Each test: render in app wrapper, assert `document` not empty / one light marker; no deep behaviour.
- **Type/lint boundaries:** `tests/` is outside tsconfig include and biome `src` scope — Playwright files are transpiled by Playwright only; colocated smokes in `src/` ARE type-checked + linted (kept strict-clean).
