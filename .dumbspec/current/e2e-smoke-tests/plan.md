# e2e-smoke-tests: implementation plan (playwright e2e/smoke + component smokes)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Investigate toolchain (package.json, vitest/vite/biome/tsconfig, CI)
- [x] Map app structure (routes, components, store, theme, markers)
- [x] Decide runners/configs/test sets (see research.md "Decisions")
- [x] Write draft/spec/research, refine spec, write plan

**Criterion:** all four task files exist under `.dumbspec/current/e2e-smoke-tests/` and describe the agreed scope.
**Commit:** `docs(tests): e2e-smoke-tests spec, research and plan`

## Stage 1 — Playwright scaffold + smoke tests (`tests/smoke/`)
- [x] `pnpm add -D @playwright/test`; verify chromium available (cache or `playwright install chromium`)
- [x] `playwright.config.ts` (root): testDir `./tests`, chromium project, baseURL :3000, webServer `pnpm start` (timeout 120s, reuseExistingServer)
- [x] `vitest.config.ts`: exclude `tests/**` from vitest
- [x] package.json scripts: `test:e2e`, `test:smoke`
- [x] RED: `tests/smoke/routes.test.ts` — per-route markers + zero console.error/pageerror
- [x] GREEN: run `pnpm test:smoke` → all pass
- [x] Sanity: `pnpm test` (vitest) does NOT pick up `tests/`

**Criterion:** `pnpm test:smoke` green against `pnpm start`; vitest suite unchanged.
**Commit:** `test: add playwright config and route smoke tests`

## Stage 2 — E2E tests (`tests/e2e/`)
- [x] RED: `tests/e2e/calculator.test.ts` — load `/#/`, click `Calculate`, assert result list shows a default fertilizer id
- [x] RED: `tests/e2e/navigation.test.ts` — sidebar links → each page marker
- [x] RED: `tests/e2e/persistence.test.ts` — calculate → reload → result preserved (localStorage)
- [x] GREEN: `pnpm test:e2e` all pass; console-error guards in every file

**Criterion:** `pnpm test:e2e` green; three scenario files under `tests/e2e/`.
**Commit:** `test(e2e): add playwright e2e scenarios (calculator, navigation, persistence)`

Research notes (Stage 2):
- Console guard filters known React 16 dev warnings (dev-only noise, documented in `tests/helpers.ts`): redux-form legacy lifecycles (`UNSAFE_`), DropdownList `key={String(item)}` duplicate keys, unkeyed Fragment in `RenderHelpPages`. These are real (minor) app defects — candidates for the upcoming refactor.
- Sidebar at width < 1650px is a closed overlay (hamburger), not docked; clicking any link bubbles to the overlay and closes the sidebar — nav test reopens it before each step.
- `pages/NotFound` is unreachable: `Route path="/"` in `Root.tsx` matches any path before the catch-all. Smoke asserts the shell stays alive on unknown URLs instead.

## Stage 3 — Component smoke tests (co-located)
- [x] `src/test-utils/render.tsx` — app wrapper (Provider(store) > ThemeProvider(defaultTheme) > MemoryRouter) + `renderApp`
- [x] `src/test-utils/form.tsx` — `createFormWrapper` (component decorated with `reduxForm()` + inner `<Form>`), see notes below
- [x] RED→GREEN pages: `src/pages/{Calculator,Help,ChemFormula,DensityCalculator,Example,NotFound}/*.smoke.test.tsx`
- [x] RED→GREEN calculator: `src/components/Calculator/{Calculator,Options,Result,FertilizerSelect,FertilizerManager}.smoke.test.tsx`
- [x] RED→GREEN ui: TabMenu, Modal, Dropdown, Sidebar, IconButton, Number, ReduxForm×3, ImportCSV, ForkMeOnGitHub
- [x] RED→GREEN misc: ColorModeToggle, LazyPromise
- [x] `pnpm test` green (all smokes), `pnpm type` green, `pnpm lint` green

**Criterion:** every component in the spec set has a co-located `*.smoke.test.tsx` that renders without exceptions; vitest/type/lint all green.
**Commit:** `test(components): add co-located component smoke tests`

Research notes (Stage 3):
- redux-form v8 `Form` (and Field/FieldArray) read `_reduxForm` from `ReduxFormContext`, which is provided only by a component decorated with `reduxForm()`; and the form is registered in the store (`initialize`) in `componentWillMount` **only when `initialValues` is given**. Both facts are why the wrapper (`src/test-utils/form.tsx`) is a `reduxForm({ form, initialValues: {} })`-decorated component — the same structure the real app uses (`CalculatorContainer`).
- `Result` destructures `getFormValues(REDUX_FORM_NAME)` on first render, so its smoke must use the real form name `calculatorOptions`.
- `TabMenu` in jsdom (1024px) renders only the hamburger: the sidebar docks only at width > 1650px, so the nav links are inside the closed overlay.
- `Modal`/`Sidebar` render into portals (`#modal-root` / `#sidebar-root`) — assertions go to `document.body`.
- Store is a module singleton; vitest isolates modules per test file, so each smoke file gets a clean store and jsdom (fresh `localStorage`).

## Stage 4 — Docs + final check
- [ ] AGENTS.md Commands: add `pnpm test:e2e` / `pnpm test:smoke` notes
- [ ] `pnpm full-check` green end-to-end
- [ ] `pnpm test:e2e` + `pnpm test:smoke` final green run
- [ ] Mark plan stages `[x]`, commit

**Criterion:** full-check + both playwright suites green on a clean run.
**Commit:** 
