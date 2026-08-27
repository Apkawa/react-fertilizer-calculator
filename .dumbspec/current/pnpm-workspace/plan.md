# pnpm-workspace: implementation plan (workspace split)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (failing test → implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Capture raw input → `draft.md`
- [x] Research (dependency graph, build/CI/test constraints) → `research.md`
- [x] Initial spec from draft → `spec.md`
- [x] Refined spec from draft + research → `spec.md`
- [x] Spec review with user (bindings for test-utils, utils split, version, server.js)
- [x] This plan

**Criterion:** draft/research/spec/plan exist in `.dumbspec/current/pnpm-workspace/`, spec open questions resolved by user.
**Commit:** `docs: spec pnpm workspace split (draft, research, spec, plan)`

## Stage 1 — Workspace skeleton: move the app to `apps/web` (monolith intact)
- [x] Baseline build: `pnpm build` on the untouched monolith, snapshot `build/` → `.cache/build-baseline/` (gitignored)
- [x] `pnpm-workspace.yaml`: add `packages: ['apps/*', 'packages/*']` (keep allowBuilds/onlyBuiltDependencies)
- [x] `apps/web/package.json`: name `@fertilizer/web`, version 0.2.1, private; **all** current root deps + devDeps (js-combinatorics/cubic-spline stay here until stage 2)
- [x] Root `package.json`: drop deps/version/browserslist (→ app); keep name, private, scripts (proxies), engines, packageManager, husky; root devDeps keep biome/playwright/typescript/source-map-explorer/husky/typesync/ts-node/express→(stays till stage 4)
- [x] `git mv`: `src` → `apps/web/src`; `vite.config.ts`, `vitest.config.ts`, `index.html`, `tsconfig.json`, `tsconfig.paths.json`, `types/`, `public/`, `server.js` → `apps/web/`
- [x] Root script proxies: `start`/`build` → `pnpm -C apps/web …`; `test` → `pnpm -C apps/web test`; `lint` → `biome check apps`; `type` → `tsc -p apps/web`; `full-check` = same composition; `analyze` → `… 'apps/web/build/assets/*.js'`
- [x] `pnpm install` (workspace resolution, lockfile importers restructured; `CI=true … --no-frozen-lockfile`, store via `pnpm_config_store_dir`)
- [x] Verify: `pnpm full-check` green at root; dev server :3000 via `pnpm start` → HTTP 200; `apps/web/server.js` (moved) serves its own `build/` on :9005
- [x] `.gitignore`: `/build` → `/apps/web/build` (done here, needed for clean tree)

**Criterion:** identical app, now living in `apps/web`; root commands work; full-check green; dev server boots. Byte-parity of build assets **relaxed by user** (chunks regrouped: vite/rollup names shared chunks differently in workspace layout — same module set, different hash names; sw.js precache follows).
**Commit:** `chore: scaffold pnpm workspace, move app to apps/web`

## Stage 2 — Extract `packages/calculator` (`@fertilizer/calculator`)
- [x] `packages/calculator/`: `git mv apps/web/src/calculator packages/calculator/src`; package.json (name, main/exports → `./src/index.ts` / `./*`→`./src/*.ts`, deps js-combinatorics + cubic-spline, devDeps vitest + typescript)
- [x] Rename `src/types.d.ts` → `src/types.ts`, `src/format/types.d.ts` → `src/format/types.ts`
- [x] Move 7 functions (`countDecimals, entries, keys, round, sum, values, tryParseFloat`) from app `src/utils/index.ts` into `packages/calculator/src/utils.ts`; app `src/utils/index.ts` re-exports them from `@fertilizer/calculator`, keeps local `toMap/update/updateOrPush/equal` + csv/downloads
- [x] Internal specifiers: `@/calculator/X` → relative (`fertilizer.ts`, `__tests__/calculate_v1.test.ts`); `../utils`/`../../utils` → `./utils`/`../utils` (package-local)
- [x] Break type cycle: package `src/types.ts` `FertilizerInfo` += `pump_number?: number`; `src/format/types.ts` defines structural `ExportCalculationForm`/`Recipe`/`ExportStateType` (package types only, no `@/components/...`); `format/hpg.ts` imports `FertilizerInfo` from `../types`
- [x] `declare module "cubic-spline"` moved into package (own d.ts); app `types/globals.d.ts` drops it
- [x] Package `tsconfig.json` (strict, bundler, noEmit, types vitest/globals) + `vitest.config.ts` (globals, node env)
- [x] App import rewrites: `@/calculator…` → `@fertilizer/calculator…` (~40 files, incl. the one relative import in `FertilizerSelect/AddItemFertilizerEditForm.tsx`); app `devDependency`/`dependency` `@fertilizer/calculator: workspace:*`
- [x] Root scripts: `test` → package tests **then** app tests; `type` → `tsc -p packages/calculator && tsc -p apps/web`; `lint` → `biome check apps packages`
- [x] `pnpm install` (new importer, workspace link)

**Criterion:** `pnpm full-check` green at root — calculator suite runs from the package (same 41-file/98-test totals as baseline, no test edits), app consumes the package, tsc clean in both projects.
**Commit:** `refactor(calculator): extract @fertilizer/calculator package`
- [x] Adjustments: `format/types.ts` `calculationForm` nullable (`ExportCalculationForm | null`); app `tsconfig.json` includes `../../packages/calculator/src/**/*.d.ts` (app pulls package `.ts` directly)
**Commit:** `a713ed7` — `refactor(calculator): extract @fertilizer/calculator package`

## Stage 3 — Extract `packages/test-utils` (`@fertilizer/test-utils`) — **пропущена** (решение пользователя: `test-utils` остаётся в `apps/web/src/test-utils`)
- [~] `packages/test-utils/`: `git mv apps/web/src/test-utils packages/test-utils/src`; package.json (peers: react, react-dom, react-redux, react-router-dom, redux, redux-form, theme-ui, @testing-library/react; devDeps typescript + @types/react, @types/react-dom, @types/react-redux, @types/react-router-dom, @types/redux-form, @types/theme-ui)
- [~] `src/render.tsx`: `createRenderApp(store, theme): (ui, initialEntries?) => RenderResult` (Provider + ThemeProvider + MemoryRouter) — generic, no app imports
- [~] `src/form.tsx`: `createFormWrapper(formName)` with local `ReduxFormType` alias (mirrors app's) — generic, no app imports
- [~] Package `tsconfig.json` (jsx classic, dom lib, noEmit, strict)
- [~] App thin bindings at **same paths**: `apps/web/src/test-utils/render.tsx` = `createRenderApp(store, defaultTheme)` (comment: store-синглтон/тема — привязка приложения), `form.tsx` = re-export; app devDep `@fertilizer/test-utils: workspace:*`
- [~] Root `type` adds `tsc -p packages/test-utils`

**Criterion:** zero edits in any `*.test.tsx`; `pnpm full-check` green at root (same test totals); `tsc -p packages/test-utils` clean.
**Commit:** `refactor(test-utils): extract @fertilizer/test-utils package`

## Stage 4 — Build parity + CI + housekeeping
- [ ] `pnpm build` (workspace) → diff `apps/web/build/` vs `.cache/build-baseline/`: same file set; byte-differences only where git build-metadata (`__COMMIT_HASH__`/`__COMMIT_DATE__`/ref, PWA precache hashes) is embedded — document the delta
- [ ] Remove stale root `build/` (gitignored)
- [ ] `server.js` → `apps/web/server.js` (serves its own `build/`, code unchanged); `express` devDep → `apps/web`; root script `serve` (or AGENTS.md note `node apps/web/server.js`)
- [ ] `.gitignore`: `/build` → `/apps/web/build`
- [ ] CI `.github/workflows/blank.yml`: `FOLDER: build` → `FOLDER: apps/web/build` (only CI change)
- [ ] Final `pnpm full-check` green at root

**Criterion:** build works and serves (byte parity relaxed by user — see Stage 1 note); same page/asset set; CI points at app build; all root commands work as before.
**Commit:** `chore: workspace build parity, CI deploy folder, server.js to apps/web`

## Stage 5 — Docs + freeze
- [ ] `AGENTS.md`: Structure (apps/web, packages/*), Commands (root proxies + `node apps/web/server.js`), workspace notes (source packages, version in apps/web, pnpm-workspace.yaml, per-package vitest/tsc)
- [ ] `README.md`: check/adjust commands section if it describes structure
- [ ] Update `.dumbspec/AGENTS.md`-per lifecycle: move `current/pnpm-workspace/` → `archive/pnpm-workspace/` **after** final commit
- [ ] Final cycle: `pnpm full-check` green

**Criterion:** docs match reality; task archived; full-check green.
**Commit:** `docs: AGENTS.md — pnpm workspace layout`
