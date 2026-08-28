# AGENTS.md

## Project Overview

**fertilizer-calculator** is a web PWA for calculating nutrient solutions (hydroponics/agriculture) and determining fertilizer dosages based on an NPK/micronutrient recipe.

- **pnpm workspace**: `apps/*` + `packages/*` (see `pnpm-workspace.yaml`), one lockfile, single Node/pnpm at the root.
- **`apps/web`** (`@fertilizer/web`) — the React PWA: everything that used to be the repo root's `src/`.
- React 16 + TypeScript 7 (strict) on **Vite** (@vitejs/plugin-react, JSX classic runtime) + vite-plugin-pwa.
- State management: **Redux + redux-form + redux-saga**, persisted to `localStorage` (`reduxState`).
- UI: **theme-ui / rebass** + styled-components. Routing: react-router (HashRouter) + `@loadable/component` (lazy-loaded pages).
- Calculations live in the pure source package **`packages/calculator`** (`@fertilizer/calculator`, algorithm from [siv237/HPG](https://github.com/siv237/HPG)) with no UI dependencies — it is consumed as TypeScript source (no build step) and bundled by the app's Vite.
- Deploys to GitHub Pages (workflow: master → site root, other branches → subfolder).

## Commands

All commands run from the repo root (proxy scripts in the root `package.json`):

```bash
pnpm install              # install dependencies (workspace)
pnpm start                # dev server (vite, http://localhost:3000)
pnpm test                 # vitest: packages/calculator (node), packages/icons (jsdom) then apps/web (jsdom, setupFiles src/setupTests.ts)
pnpm test:smoke           # playwright: route smoke tests (tests/smoke/)
pnpm test:e2e             # playwright: e2e scenarios (tests/e2e/)
pnpm lint                 # biome check apps packages
pnpm type                 # tsc -p packages/calculator && tsc -p packages/icons && tsc -p apps/web
pnpm build                # production build (vite build → apps/web/build/)
pnpm full-check           # test + lint + type + build (pre-commit / preversion)
pnpm analyze              # bundle analysis (source-map-explorer)
node apps/web/server.js   # serve apps/web/build/ static files on :9005
```

- The husky pre-commit hook runs `pnpm full-check`; commits only pass after the full cycle succeeds.
- The playwright suites (`test:smoke` / `test:e2e`) are NOT part of `full-check` or CI: they spin up the dev server (`webServer` in `playwright.config.ts` — `pnpm start` at the root) and run in a real chromium, so they are run locally / manually when UI behavior matters. Co-located `*.test.tsx` files (render-smoke of components in jsdom) ARE part of `pnpm test`.
- `packages/icons` PNG-превью иконок (`src/__tests__/icons-png.test.tsx`): каждая иконка из `registry.ts` рендерится в SVG и конвертируется системным `rsvg-convert` в PNG (96×96), сравнение с базлайном в `src/__tests__/snapshots/icons/`. Без `rsvg-convert` блок пропускается. Обновить базлайны: `UPDATE_ICON_PNGS=1 pnpm -C packages/icons test`; только свои иконки: `ICON_PNG_FILTER=plus,close`.
- Versioning: `pnpm -C apps/web version patch|minor` (preversion = full-check). The app version lives in `apps/web/package.json` — `vite.config.ts` reads it for `__VERSION__`; the root has no version.

## Structure

```
pnpm-workspace.yaml       # packages: ['apps/*', 'packages/*']
apps/web/                 # @fertilizer/web — the React PWA (all deps of the app)
  src/
    components/Calculator/# calculator UI: Form, FertilizerManager, Mixer, ImportExport, Diary, Options, Result
      actions.ts / reducers.ts / saga.ts  # local redux slice
    pages/                # pages (lazy-loaded): Calculator, Help, ChemFormula, DensityCalculator, Example, NotFound
    redux/                # root store: calculator + redux-form; localStorage persistence
    docs/                 # reference .md files — imported with ?raw, displayed in Help
    hooks/, utils/, themes/
    test-utils/           # test helpers (render/form) — app bindings
  vite.config.ts          # build: @/ alias, define constants, image copying, vite-plugin-pwa
  vitest.config.ts        # tests: jsdom + shared config from vite.config.ts
  server.js               # static server for build/ on :9005 (express)
packages/
  icons/                  # @fertilizer/icons — app icon set (SVG components chosen by name: Icon/IconButton), source package
    src/
      icons/              # 14 hand-drawn 24×24 SVG icons
      Icon.tsx            # icon by name (svg wrapped in a div/Box)
      IconButton.tsx      # button with icon by name
      registry.ts         # name → icon component map
  calculator/             # @fertilizer/calculator — calculation core, pure logic
    src/
      index.ts            # calculate_v1..v4 (current: v4)
      fertilizer.ts       # fertilizer normalization (oxide factors, etc.)
      dilution.ts         # concentrations (Concentration: number | {volume,ec|ppm})
      profile.ts          # element profiles/balances
      chem.ts             # chemical formulas, molar masses
      itertools.ts        # combination/product (combinatorics)
      molecular-parser/   # molecular formula parsing (ported from node-molecular-parser)
      density-calculator/ # solution density via spline interpolation
      utils.ts            # shared helpers (round/sum/tryParseFloat/…) — re-exported by the app's @/utils
      format/             # import/export formats (JSON/HPG)
      __tests__/          # reference calculation tests
tests/                    # playwright e2e/smoke (root level)
docs/                     # jupyter models of the calculations (model_v3, EDTA_Fe, dillution)
tools/mdb_convert.ts      # conversion utility
```

- `packages/calculator` and `packages/icons` are **source packages**: `main`/`exports` point at `./src/*.ts` directly — no build step; the app depends on them as `workspace:*`. Vite bundles the TS source, `tsc` resolves it via `moduleResolution: bundler`. `@fertilizer/icons` is the app's icon set: `Icon`/`IconButton` render icons by name from `registry.ts` (14 own SVGs); the app's tsconfig includes each package's `src/**/*.d.ts` (ambient declarations for untyped deps) because the app pulls the packages' `.ts` files into its program.
- Alias `@/` → `apps/web/src/` (vite `resolve.alias` + tsconfig.paths.json). The app imports the package via `@fertilizer/calculator[/subpath]`.
- Markdown `.md` files are imported with the `?raw` query (native Vite mechanism, `apps/web/src/pages/Help/pages.ts`).
- Build-time constants (`__VERSION__`, `__COMMIT_HASH__`, `__COMMIT_DATE__`, `__COMMIT_REF_NAME__`) are injected via `define` in `apps/web/vite.config.ts` from `git` — git is required for builds.

## Calculation Core (packages/calculator)

Algorithm versions; current is **`calculate_v4`**:
- **v4** — splits fertilizers into macro/micro, computes micro separately, then macro taking `prevElements` into account.
- **v3** — enumerates fertilizer combinations (`combination`), early exit when `score >= 100`.
- **v2** — greedy selection by the most-deficient element (HPG algorithm).
- **v1** — DEPRECATED (weight-grid method).

Key entities (`packages/calculator/src/types.ts`): `Fertilizer`, `FertilizerInfo`, `NeedElements`, `Elements`, `CalculateResult`, `CalculateOptions` (`accuracy`, `ignore`, `solution_volume`, `solution_concentration`, `prevElements`).

Oxide factors: NPK are expressed as oxide percentages (N, P2O5, K2O, CaO…) — see `apps/web/src/docs/technique.md`.

Calculation tests in `packages/calculator/src/__tests__/` are reference tests; do not break them. When formulas/priorities change (`ElementPriority`, `MICRO_ELEMENT_NAMES`), update the tests accordingly.

## Rules and Conventions

- TypeScript strict; linter is **Biome** (`biome.json`, `pnpm lint`). Committing without a passing lint/test/type/build is not allowed (enforced by husky).
- New calculation logic goes into `packages/calculator` as pure functions with colocated tests; do not move it into the app's components.
- The calculator Redux slice lives in `apps/web/src/components/Calculator/*` (actions/reducers/saga); the `CalculatorState` type is defined there as well.
- UI is built on theme-ui/rebass; themes are in `apps/web/src/themes`. Do not introduce new UI libraries without necessity.
- New pages: create `apps/web/src/pages/<Name>/` and register it in `apps/web/src/pages/index.ts` (loadable) and `Root.tsx` (Route).
- Reference texts: `apps/web/src/docs/**/*.md`, displayed on the Help page.
- Jupyter models belong in `docs/` (python, repo root), not in the app or package sources.
- The language of in-project comments is Russian; preserve that style.

## Environment Constraints

- Node ≥ 24 (`engines` in package.json; the CI workflow uses 24.x), **pnpm** (version pinned in `packageManager` at the root).
- Builds require `git` access (reading HEAD — `getBuildInfo()` in `apps/web/vite.config.ts`).
- PWA: **vite-plugin-pwa** (generateSW, `registerType: auto`) — configured in `apps/web/vite.config.ts`.
- CI (`.github/workflows/blank.yml`): `pnpm install --frozen-lockfile` + `pnpm full-check`, deploys `apps/web/build` to GitHub Pages.

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

## Subagents

- Before using the `subagent` / `subagent_fork` tools, load the skill **`subagents-local`** (`.agents/skills/subagents-local/SKILL.md`).
- The local LLM allows only one concurrent agent — hand large tasks to subagents **sequentially**: one active subagent at a time; wait for its run to settle (sync result / settlement notice) before starting the next; never launch several subagents in the same message.
- As soon as a task is dispatched to a subagent, immediately stop all other work and wait for its result; do not interleave any other activity with its run — continue only after the subagent has reported back (sync result or settlement notice).
