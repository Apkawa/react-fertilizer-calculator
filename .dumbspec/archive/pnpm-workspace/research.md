# Research: pnpm-workspace

## Current state (monolith)

- Single root package `fertilizer-calculator` (private, version 0.2.1). Root: `src/`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json` + `tsconfig.paths.json`, `biome.json`, `index.html`, `public/`, `server.js`, `tests/` (playwright e2e+smoke), `tools/`, `docs/` (jupyter), `.env`.
- `pnpm-workspace.yaml` already exists but contains only `allowBuilds` / `onlyBuiltDependencies` (pnpm 10+ build-script allowlist). **No `packages` field yet** — must add `packages: ['apps/*', 'packages/*']` (pnpm 11.22.0 pinned in `packageManager`; node >=24).
- `.env` at root sets `pnpm_config_store_dir=./.pnpm-cache/v11` (project-local pnpm store) — must keep working after split.
- Baseline (green): `pnpm test` → **41 files passed / 1 skipped (42), 98 tests passed / 5 skipped (103)**, ~22s. The skipped file is `src/calculator/__tests__/calculate_v1.test.ts` (`describe.skip`). `pnpm full-check` = test + lint + type + build (husky pre-commit).
- CI (`.github/workflows/blank.yml`): `pnpm install --frozen-lockfile`, `pnpm full-check`, deploy `FOLDER: build` to `gh-pages` (root of site for master, subfolder for branches).
- Playwright at root: `testDir: ./tests`, webServer `pnpm start` on :3000 (dev server), chromium. Not part of full-check/CI.
- Build (vite 8, config at root): alias `@` → `src/`; `define` constants from git (`__VERSION__` = **root package.json version**, `__COMMIT_HASH__`/`__COMMIT_DATE__`/`__COMMIT_REF_NAME__`, `__PUBLIC_PATH__`); plugins: react classic runtime, viteStaticCopy `src/docs/**/*.{jpg,png,jpeg}` → `build/docs/**` (stripBase 1), VitePWA generateSW (injectRegister auto); `base: "./"`; `outDir: "build"`; server port 3000.
- `types/globals.d.ts` (root): build-const declarations, `*.md?raw` / `*.css` / `*.svg` module declarations, **`declare module "cubic-spline"`** and **`declare module "@theme-ui/presets"`**, `Object.hasOwnProperty` augmentation.
- `src/react-app-env.d.ts` = legacy `/// <reference types="react-scripts" />` (harmless, moves with app).
- `config-overrides.js`, `yarn.lock` — legacy CRA artifacts, referenced nowhere in build (only in archived dumbspec docs). Out of scope.
- `server.js` (root): express static on `__dirname/build/` port 9005.
- `tools/mdb_convert.ts`: standalone (child_process only, no src imports). `docs/` jupyter at root.

## Dependency graph (the crux)

**`src/calculator` is NOT self-contained:**
- Value imports of `src/utils` (from `../utils` / `../../utils`): `countDecimals, entries, keys, round, sum, values` (index.ts, helpers.ts, dilution.ts, profile.ts, ratio.ts, chem.ts), `tryParseFloat` (format/hpg.ts). App-only utils: `toMap, update, updateOrPush, equal` (+ submodules `csv.ts`, `downloads.ts`, `__tests__/csv.test.ts`).
- **Type-level cycle** with app: `src/calculator/format/types.d.ts` → `@/components/Calculator/types` (`CalculatorState`, used as `Pick<...>` in `ExportStateType`); `src/calculator/format/hpg.ts` → `../../components/Calculator/types` (`FertilizerInfo` — the app-extended type with `pump_number`). Meanwhile `components/Calculator/types.d.ts` imports `@/calculator/*` (`CalculateResult`, base `FertilizerInfo` as `_FertilizerInfo`, `NeedElements`, ...).
- npm deps of calculator: `js-combinatorics` (itertools.ts), `cubic-spline` (density-calculator). That's all.
- Internal specifiers: mixed `@/calculator/...` alias and relative (`../types` etc.); one test uses `@/calculator/types`. Deep imports used by app: `index`, `types`, `constants`, `dilution`, `helpers`, `fertilizer`, `profile`, `ratio`, `format` (index), `format/types`, `format/hpg`. Plus one relative escape in app: `FertilizerSelect/AddItemFertilizerEditForm.tsx` uses `../../../calculator/...`.
- `types.d.ts` files (package-level `types.d.ts`, `format/types.d.ts`) — pure type modules, no runtime code.

**`src/test-utils` is app-coupled:**
- `render.tsx`: imports `@/redux` (the store **singleton** — created with app rootReducers + rootSaga + localStorage persistence, itself importing app constants) and `@/themes` (`defaultTheme` = theme-ui polaris + custom colors; app `Theme` type is exactly `theme-ui`'s `Theme`).
- `form.tsx`: imports `@/components/ui/ReduxForm/types` (`ReduxFormType` type alias over react + redux-form).
- Used **only by `*.test.tsx`** (~30 app test files: `renderApp(ui[, initialEntries])`, `createFormWrapper(name)`). Never imported by production app code → **not part of any build output**.
- npm deps: react, react-redux, react-router-dom, theme-ui, redux-form, @testing-library/react.

**App side:** `@/utils` used by ~10 app files (incl. csv/downloads submodules + `__tests__/csv.test.ts`); `@/calculator` by ~40 files; `?raw` md imports only in app (pages/Help, `__tests__/markdown.test.tsx`); build consts used in `ExportState.tsx`, `Root.tsx`; entry `src/index.tsx` (ReactDOM.render + store + Root).

**react version:** lockfile pins `react@16.13.1` (single root lockfile → one resolution). pnpm workspace keeps ONE lockfile at root → workspace packages resolve the same versions → same module instances (real paths dedupe in store).

**Export/Import state flow (verified structural compatibility):** `ImportState.tsx` → `FORMATS_MAP[ext]().import(data): ExportStateType` → `dispatch(loadStateStart(p))` → saga `loadCalculatorStateSaga` → `loadStateSuccess(p.calculator…)` → reducer `Partial<CalculatorState>`. `ExportState.tsx` builds `state: ExportStateType` from store `CalculatorState` (meta.version = `__VERSION__`, ref = `__COMMIT_HASH__`). `actions.ts` types `loadStateStart(payload: ExportStateType)`.

**Tests:** calculator tests use **globals** (`describe`/`test`/`expect`, no imports) → package vitest needs `globals: true`; all pure logic (no DOM) → `environment: node` ok. App tests need jsdom + `setupFiles: src/setupTests.ts` (jest-dom) + globals (`example.ts`). Root vitest currently merges vite base config (alias/define/JSX) — package vitest won't need those.

## Design decisions (options considered)

1. **Source packages (no build step for packages).** `packages/*/package.json` exposes TS source: `main: "./src/index.ts"`, `exports: { ".": "./src/index.ts", "./*": "./src/*.ts" }`. App's vite bundles them as source (workspace symlink → real path outside node_modules → vite treats as source, esbuild+react-plugin transform; calculator is plain .ts, test-utils .tsx has explicit `import React` + classic runtime — matches app `react({ jsxRuntime: "classic" })`). tsc (`moduleResolution: bundler`) follows exports into .ts sources. This keeps "build result unchanged" trivially true and preserves dev HMR. Rejected: prebuilt packages (adds a build pipeline, dist/ artifacts, dual-package risk — unnecessary).
2. **`src/utils` split.** Move the 7 functions calculator consumes into `packages/calculator/src/utils.ts`; app `src/utils/index.ts` re-exports those 7 from `@fertilizer/calculator` and keeps local `toMap/update/updateOrPush/equal` + `csv.ts` + `downloads.ts` + `__tests__/`. All app import sites keep `@/utils` unchanged. Alternative rejected: duplicate the 7 functions in the package (drift risk).
3. **`format` module stays in the package; type cycle broken structurally.** Package `format/types.ts` defines structural types: `ExportCalculationForm` (mirror of app `CalculatorFormValues` shape using only package types), `Recipe`, `ExportStateType { meta; calculator: { calculationForm; result: CalculateResult | null; fertilizers: FertilizerInfo[]; recipes: Recipe[] } }`. Add optional `pump_number?: number` to package base `FertilizerInfo` (pure data field; hpg.ts sets it). App types stay unchanged; structural typing verified: `ExportState.tsx` literal, `loadStateStart`, saga→`loadStateSuccess(Partial<CalculatorState>)`, reducer — all assignable both ways (app `FertilizerInfo extends` base + only optional `pump_number`).
4. **test-utils = generic package + thin app binding (zero test-file churn).** Package exports `createRenderApp(store, theme): (ui, initialEntries?) => RenderResult` (providers: redux Provider + ThemeProvider + MemoryRouter) and `createFormWrapper(formName)` (local `ReduxFormType` alias mirroring app's; `redux-form` HOC). App keeps **same module paths** `src/test-utils/render.tsx` (binds `store` + `defaultTheme`) and `src/test-utils/form.tsx` (re-export). All ~30 test files keep `@/test-utils/render` / `@/test-utils/form` imports unchanged. Alternative rejected: change every test call site.
5. **test-utils react-family deps as `peerDependencies`** (react, react-dom, react-redux, react-router-dom, redux, redux-form, theme-ui, @testing-library/react), provided by app. Single workspace lockfile ⇒ one version ⇒ one real path ⇒ no duplicated React/testing-library instances.
6. **File renames inside package:** `types.d.ts` → `types.ts`, `format/types.d.ts` → `format/types.ts` (exports pattern `"./*": "./src/*.ts"` can't hit `.d.ts`; esbuild already elides type-only imports per file — identical behavior).
7. **Specifier rewrites (mechanical):** app `@/calculator…` → `@fertilizer/calculator…` (+ the one relative import); inside package `@/calculator/X` → relative `../X` / `../../X`; one test `@/calculator/types` → relative.
8. **Root scripts become proxies** so commands stay "по старому": `start`/`build`/`test`/`type`/`lint`/`full-check`/`analyze` at root (via `pnpm -C <dir> <script>` / filters), `biome check apps packages`, `type` = `tsc -p apps/web && tsc -p packages/calculator && tsc -p packages/test-utils`. Playwright `tests/` stay at root (webServer `pnpm start` still works). `server.js` stays at root, points to `apps/web/build/`.
9. **Version** moves to `apps/web/package.json` (`__VERSION__` reads it; `import packageJson from "./package.json"` in app's vite.config). Root loses `version`, keeps `private`, `engines`, `packageManager`, `husky`, `browserslist` → app. Versioning via `npm version` becomes a process note (see spec open questions).
10. **CI:** only change — deploy `FOLDER: build` → `apps/web/build` (artifact set unchanged). `.gitignore` `/build` → `/apps/web/build`.

## Risks / to verify during execution

- pnpm 11 accepts `packages` field in `pnpm-workspace.yaml` (expected yes since pnpm 10) — verify on first `pnpm install`.
- Vite 8 source-treatment of workspace-linked packages (expect: yes; verify in dev + build; `optimizeDeps` excludes linked pkgs by default).
- tsc `bundler` resolution honoring `exports` → `.ts` (expect: yes).
- Vitest 4 per-package configs; root `test` must run package tests **and** app tests (explicit sequential `pnpm -C` calls to avoid `-r` root-recursion edge).
- Biome multi-dir check with root `biome.json` + `vcs.useIgnoreFile` (root .gitignore).
- Lockfile churn: root lockfile re-resolves into workspace graph (same versions expected; `pnpm install --frozen-lockfile` in CI must pass with committed lockfile).
- Build-output identity: verify by diffing `build/` trees (expect byte-identical assets; PWA precache manifest regenerated from same file set).
- `types/globals.d.ts` split: `cubic-spline` declaration → calculator package (its own `src/` d.ts); `@theme-ui/presets` + md?raw/css/svg + build consts → app; `Object.hasOwnProperty` augmentation — verify package code doesn't need it (if tsc complains, duplicate declaration into package).
