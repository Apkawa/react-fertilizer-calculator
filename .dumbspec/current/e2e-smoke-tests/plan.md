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
- [ ] `pnpm add -D @playwright/test`; verify chromium available (cache or `playwright install chromium`)
- [ ] `playwright.config.ts` (root): testDir `./tests`, chromium project, baseURL :3000, webServer `pnpm start` (timeout 120s, reuseExistingServer)
- [ ] `vitest.config.ts`: exclude `tests/**` from vitest
- [ ] package.json scripts: `test:e2e`, `test:smoke`
- [ ] RED: `tests/smoke/routes.test.ts` — per-route markers + zero console.error/pageerror
- [ ] GREEN: run `pnpm test:smoke` → all pass
- [ ] Sanity: `pnpm test` (vitest) does NOT pick up `tests/`

**Criterion:** `pnpm test:smoke` green against `pnpm start`; vitest suite unchanged.
**Commit:** 

## Stage 2 — E2E tests (`tests/e2e/`)
- [ ] RED: `tests/e2e/calculator.test.ts` — load `/#/`, click `Calculate`, assert result list shows a default fertilizer id
- [ ] RED: `tests/e2e/navigation.test.ts` — sidebar links → each page marker
- [ ] RED: `tests/e2e/persistence.test.ts` — calculate → reload → result preserved (localStorage)
- [ ] GREEN: `pnpm test:e2e` all pass; console-error guards in every file

**Criterion:** `pnpm test:e2e` green; three scenario files under `tests/e2e/`.
**Commit:** 

## Stage 3 — Component smoke tests (co-located)
- [ ] `src/test-utils/render.tsx` — app wrapper (Provider(store) > ThemeProvider(defaultTheme) > MemoryRouter) + `renderApp`
- [ ] RED→GREEN pages: `src/pages/{Calculator,Help,ChemFormula,DensityCalculator,Example,NotFound}/*.smoke.test.tsx`
- [ ] RED→GREEN calculator: `src/components/Calculator/{Calculator,Options,Result,FertilizerSelect,FertilizerManager}.smoke.test.tsx`
- [ ] RED→GREEN ui: TabMenu, Modal, Dropdown, Sidebar, IconButton, Number, ReduxForm×3, ImportCSV, ForkMeOnGitHub
- [ ] RED→GREEN misc: ColorModeToggle, LazyPromise
- [ ] `pnpm test` green (all smokes), `pnpm type` green, `pnpm lint` green

**Criterion:** every component in the spec set has a co-located `*.smoke.test.tsx` that renders without exceptions; vitest/type/lint all green.
**Commit:** 

## Stage 4 — Docs + final check
- [ ] AGENTS.md Commands: add `pnpm test:e2e` / `pnpm test:smoke` notes
- [ ] `pnpm full-check` green end-to-end
- [ ] `pnpm test:e2e` + `pnpm test:smoke` final green run
- [ ] Mark plan stages `[x]`, commit

**Criterion:** full-check + both playwright suites green on a clean run.
**Commit:** 
