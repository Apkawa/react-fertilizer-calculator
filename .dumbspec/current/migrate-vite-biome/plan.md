# migrate-vite-biome: implementation plan (Vite + vitest + Biome migration)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Capture raw input into `draft.md` (scope confirmed with user: full Vite + PWA via vite-plugin-pwa, vitest, Biome replaces eslint+prettier, full autonomy)
- [x] Research current toolchain (CRA 3.4 + react-app-rewired, config-overrides.js, deploy workflow, tests, lint, build)
- [x] Baseline: build ✅, lint ✅ (0 warnings), test ❌ (16/17 suites broken under jest/pnpm)
- [x] Registry-check migration tool versions (vite 8.2, plugin-react 6.1, vite-plugin-pwa 1.3, vitest 4.1, biome 2.5)
- [x] Write spec.md (user language: Russian); resolve open questions in review
- [x] Write plan.md

**Criterion:** spec.md + plan.md exist, all open questions resolved, scope frozen.
**Commit:** `docs(dumbspec): add migrate-vite-biome spec and plan`

## Stage 1 — Vite foundation (config, deps, PWA, ?raw)
- [ ] Rewrite `package.json` scripts (start/build/test/lint/full-check/analyze), drop CRA-era envs (`NODE_OPTIONS=--openssl-legacy-provider`, `cross-env`, `BROWSER`)
- [ ] Add new devDeps (vite, @vitejs/plugin-react, vite-plugin-pwa + workbox-build/workbox-window, vite-plugin-static-copy); remove dead ones (react-scripts, react-app-rewired(+workbox), raw-loader, copy-webpack-plugin, workbox-sw, @types/workbox-sw)
- [ ] Create `vite.config.ts`: `base: './'`, `outDir: 'build'`, alias `@/`, `define` (same `getBuildInfo()` git constants), `@vitejs/plugin-react` (classic JSX runtime), `vite-plugin-static-copy` (`src/docs` images → `docs/`), `vite-plugin-pwa` (generateSW, auto registration), `server.port: 3000`
- [ ] Migrate 10 `!!raw-loader!` imports in `src/pages/Help/pages.ts` to `?raw`; add `*.md?raw` module decl to `types/globals.d.ts`
- [ ] Delete `src/serviceWorker.ts`; drop its import + `register()` call from `src/index.tsx`
- [ ] Delete `config-overrides.js`
- [ ] Verify: `pnpm build` produces `build/` with: index.html (SW registration injected), JS/CSS bundles with relative base, `docs/**` images, manifest.json, `sw.js` + workbox files
- [ ] Verify dev: `pnpm start` serves :3000, app renders (smoke check)

**Criterion:** `vite build` output in `build/` is deploy-equivalent to CRA output (relative base, docs images, PWA files); dev server works; PWA registration present in index.html.
**Commit:** `build: migrate from CRA to vite (config, pwa, ?raw)`

## Stage 2 — vitest migration
- [ ] Add devDeps: vitest 4.x, jsdom 30.x, @testing-library/jest-dom 7.x; remove ts-jest, @types/jest
- [ ] Configure vitest (config section or `vitest.config.ts`): jsdom environment, `setupFiles` → `setupTests.ts` (rewritten with `@testing-library/jest-dom/vitest`)
- [ ] Red: run `pnpm test` → confirm suites load and run (expect previously-broken 16 to now execute)
- [ ] Green: make all 17 suites pass (fix js-combinatorics ESM handling if needed — vitest reads ESM natively, expect no transform config)
- [ ] Replace stale `src/__tests__/App.test.tsx` boilerplate with a real smoke render of `<App/>` (or remove it); keep `example.ts` as sanity test
- [ ] Refactor: remove any leftover jest-specific config

**Criterion:** `pnpm test` (vitest) runs all suites green — including the 16 previously broken calculator suites.
**Commit:** `test: migrate jest to vitest, repair broken suites`

## Stage 3 — Biome migration (lint + format)
- [ ] Add `@biomejs/biome` 2.5.x; remove eslint dep + `eslintConfig` block from package.json
- [ ] Create `biome.json` (v2): formatter settings + recommended lint rulesets (+ closest equivalents to `react-app` config); `organizeImports` assist
- [ ] Rewrite `lint` script: `biome check src`
- [ ] One-shot `biome format --write` over `src/` (large diff, logic unchanged) → format commit
- [ ] Fix lint errors until `biome check src` exits clean (same bar as old `--max-warnings=0`)

**Criterion:** `pnpm lint` (= `biome check src`) exits clean over the whole `src/`; code formatted by biome.
**Commit:** `chore(lint): replace eslint/prettier with biome`

## Stage 4 — Cleanup, docs, final gate
- [ ] Remove legacy files: `yarn.lock` (legacy artifact), any remaining CRA leftovers
- [ ] Update `analyze` script glob (`build/assets/*.js`)
- [ ] Update `AGENTS.md` (Команды / Структура / Ограничения sections)
- [ ] Full gate from clean state: `pnpm install --frozen-lockfile && pnpm full-check` all green
- [ ] Verify `build/` artifacts once more (deploy parity: index.html, docs/**, sw.js, manifest.json, relative base)
- [ ] Move task dir `current/` → `archive/` when all checkboxes `[x]` (post-execution, per .dumbspec lifecycle)

**Criterion:** `pnpm full-check` green end-to-end; old toolchain gone; AGENTS.md accurate; build output deploy-ready.
**Commit:** `chore: cleanup legacy toolchain and update docs`
