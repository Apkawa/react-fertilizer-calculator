# AGENTS.md

## Project Overview

**fertilizer-calculator** is a web PWA for calculating nutrient solutions (hydroponics/agriculture) and determining fertilizer dosages based on an NPK/micronutrient recipe.

- React 16 + TypeScript 7 (strict) on **Vite** (@vitejs/plugin-react, JSX classic runtime) + vite-plugin-pwa.
- State management: **Redux + redux-form + redux-saga**, persisted to `localStorage` (`reduxState`).
- UI: **theme-ui / rebass** + styled-components. Routing: react-router (HashRouter) + `@loadable/component` (lazy-loaded pages).
- Calculations live in the pure library `src/calculator` (algorithm from [siv237/HPG](https://github.com/siv237/HPG)) and have no UI dependencies.
- Deploys to GitHub Pages (workflow: master → site root, other branches → subfolder).

## Commands

```bash
pnpm install            # install dependencies
pnpm start              # dev server (vite, http://localhost:3000)
pnpm test               # vitest run (jsdom, setupFiles src/setupTests.ts)
pnpm test:smoke         # playwright: route smoke tests (tests/smoke/)
pnpm test:e2e           # playwright: e2e scenarios (tests/e2e/)
pnpm lint               # biome check src
pnpm type               # TypeScript check
pnpm build              # production build (vite build → build/)
pnpm full-check         # test + lint + build (pre-commit / preversion)
pnpm analyze            # bundle analysis (source-map-explorer)
node server.js          # serve build/ static files on :9005
```

- The husky pre-commit hook runs `pnpm full-check`; commits only pass after the full cycle succeeds.
- The playwright suites (`test:smoke` / `test:e2e`) are NOT part of `full-check` or CI: they spin up the dev server (`webServer` in `playwright.config.ts`) and run in a real chromium, so they are run locally / manually when UI behavior matters. Co-located `*.test.tsx` files (render-smoke of components in jsdom) ARE part of `pnpm test`.
- Versioning: `npm version patch|minor` (preversion = full-check).

## Structure

```
src/
  calculator/           # calculation core — pure logic, tests colocated
    index.ts            # calculate_v1..v4 (current: v4)
    fertilizer.ts       # fertilizer normalization (oxide factors, etc.)
    dilution.ts         # concentrations (Concentration: number | {volume,ec|ppm})
    profile.ts          # element profiles/balances
    chem.ts             # chemical formulas, molar masses
    itertools.ts        # combination/product (combinatorics)
    molecular-parser/   # molecular formula parsing (ported from node-molecular-parser)
    density-calculator/ # solution density via spline interpolation
    __tests__/          # reference calculation tests
  components/Calculator/# calculator UI: Form, FertilizerManager, Mixer, ImportExport, Diary, Options, Result
    actions.ts / reducers.ts / saga.ts  # local redux slice
  pages/                # pages (lazy-loaded): Calculator, Help, ChemFormula, DensityCalculator, Example, NotFound
  redux/                # root store: calculator + redux-form; localStorage persistence
  docs/                 # reference .md files — imported with ?raw, displayed in Help
  hooks/, utils/, themes/
vite.config.ts          # build: @/ alias, define constants, image copying, vite-plugin-pwa
vitest.config.ts        # tests: jsdom + shared config from vite.config.ts
docs/                   # jupyter models of the calculations (model_v3, EDTA_Fe, dillution)
tools/mdb_convert.ts    # conversion utility
```

- Alias `@/` → `src/` (vite `resolve.alias` + tsconfig.paths.json).
- Markdown `.md` files are imported with the `?raw` query (native Vite mechanism, `src/pages/Help/pages.ts`).
- Build-time constants (`__VERSION__`, `__COMMIT_HASH__`, `__COMMIT_DATE__`, `__COMMIT_REF_NAME__`) are injected via `define` in `vite.config.ts` from `git` — git is required for builds.

## Calculation Core (src/calculator)

Algorithm versions; current is **`calculate_v4`**:
- **v4** — splits fertilizers into macro/micro, computes micro separately, then macro taking `prevElements` into account.
- **v3** — enumerates fertilizer combinations (`combination`), early exit when `score >= 100`.
- **v2** — greedy selection by the most-deficient element (HPG algorithm).
- **v1** — DEPRECATED (weight-grid method).

Key entities (`calculator/types.d.ts`): `Fertilizer`, `FertilizerInfo`, `NeedElements`, `Elements`, `CalculateResult`, `CalculateOptions` (`accuracy`, `ignore`, `solution_volume`, `solution_concentration`, `prevElements`).

Oxide factors: NPK are expressed as oxide percentages (N, P2O5, K2O, CaO…) — see `src/docs/technique.md`.

Calculation tests in `src/calculator/__tests__/` are reference tests; do not break them. When formulas/priorities change (`ElementPriority`, `MICRO_ELEMENT_NAMES`), update the tests accordingly.

## Rules and Conventions

- TypeScript strict; linter is **Biome** (`biome.json`, `pnpm lint`). Committing without a passing lint/test/build is not allowed (enforced by husky).
- New calculation logic goes into `src/calculator` as pure functions with colocated tests; do not move it into components.
- The calculator Redux slice lives in `components/Calculator/*` (actions/reducers/saga); the `CalculatorState` type is defined there as well.
- UI is built on theme-ui/rebass; themes are in `src/themes`. Do not introduce new UI libraries without necessity.
- New pages: create `src/pages/<Name>/` and register it in `src/pages/index.ts` (loadable) and `Root.tsx` (Route).
- Reference texts: `src/docs/**/*.md`, displayed on the Help page.
- Jupyter models belong in `docs/` (python), not in `src`.
- The language of in-project comments is Russian; preserve that style.

## Environment Constraints

- Node ≥ 24 (`engines` in package.json; the CI workflow uses 24.x), **pnpm** (version pinned in `packageManager`).
- Builds require `git` access (reading HEAD — `getBuildInfo()` in `vite.config.ts`).
- PWA: **vite-plugin-pwa** (generateSW, `registerType: auto`) — configured in `vite.config.ts`.

## pnpm in the Sandbox

- Caches are kept inside the project directory, not globally 
- for pnpm the env var `pnpm_config_store_dir=./.pnpm-cache/v11` is set.

`pnpm_config_store_dir=./.pnpm-cache/v11 pnpm install`

## playwright-cli in the Sandbox (browser for UI verification)

DSH mechanics: each `bash` invocation runs in a fresh sandbox (its own /tmp; processes and /tmp from the previous invocation are gone). Persistent: the project directory, `.pnpm-cache`, `.cache/ms-playwright` (bind-mounted at `~/.cache/ms-playwright` — **shared with the user**) and the host network (localhost is reachable).

Env vars for **all** playwright-cli commands (without them, EROFS: the daemon writes logs/sockets to `~/.cache` and `/tmp`, which are not writable/invocation-surviving):

```bash
export XDG_CACHE_HOME=$PWD/.cache                    # daemon registry → .cache/ms-playwright/daemon (shared, visible to the user in list/show)
export PLAYWRIGHT_BROWSERS_PATH=$PWD/.cache/ms-playwright
export PWTEST_SOCKETS_DIR=$PWD/.cache/pw-sockets     # daemon sockets (default /tmp — does not survive invocation)
```

The persistent browser runs as a **background job** (run_in_background) and outlives individual bash invocations:

```bash
cd <project> && export …three env vars above… && playwright-cli -s=ui open http://localhost:3000/ && sleep 3600
```

- Drive it from regular invocations: `playwright-cli -s=ui snapshot/click/eval/goto …` (same env). Stopping: `job_kill` (job) or `playwright-cli -s=ui close`.
- **Stale-session hang**: leftover `.session/.err` of a dead daemon in `.cache/ms-playwright/daemon/<workspace-hash>/` → `open` with the same name hangs (resume attempt). Before a new `open`: `rm .cache/ms-playwright/daemon/<hash>/<name>.*`. `kill-all` does not help — the processes live in a dead sandbox.
- The agent's sessions are visible to the user in their terminal (`playwright-cli list/show`) — the registry is shared via the bind-mount.
- Does not work: a lone `PLAYWRIGHT_BROWSERS_PATH` (the daemon path is derived from `XDG_CACHE_HOME`; browser binaries live under it), a fake `HOME=./.pw-home` (sessions invisible to the user).
