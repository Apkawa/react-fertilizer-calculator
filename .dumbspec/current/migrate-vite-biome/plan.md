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
- [x] Rewrite `package.json` scripts (start/build/test/lint/full-check/analyze), drop CRA-era envs (`NODE_OPTIONS=--openssl-legacy-provider`, `cross-env`, `BROWSER`)
- [x] Add new devDeps (vite, @vitejs/plugin-react, vite-plugin-pwa + workbox-build/workbox-window, vite-plugin-static-copy); remove dead ones (react-scripts, react-app-rewired(+workbox), raw-loader, copy-webpack-plugin, workbox-sw, @types/workbox-sw)
- [x] Create `vite.config.ts`: `base: './'`, `outDir: 'build'`, alias `@/`, `define` (same `getBuildInfo()` git constants), `@vitejs/plugin-react` (classic JSX runtime), `vite-plugin-static-copy` (`src/docs` images → `docs/`, API v4: `src`/`dest`/`rename.stripBase`), `vite-plugin-pwa` (generateSW, auto registration), `server.port: 3000`
- [x] Migrate 10 `!!raw-loader!` imports in `src/pages/Help/pages.ts` to `?raw`; add `*.md?raw` module decl to `types/globals.d.ts`
- [x] Delete `src/serviceWorker.ts`; drop its import + `register()` call from `src/index.tsx`
- [ ] Delete `config-overrides.js` — **отложено до Stage 4** (решение пользователя: не удалять пока, свериться со старой логикой; сверка выполнена в этой сессии: build-артефакты идентичны по смыслу, см. ниже)
- [x] Verify: `pnpm build` produces `build/` with: index.html (SW registration injected: `registerSW.js` + `sw.js` + `manifest.webmanifest`), JS/CSS bundles with relative base (`./assets/*`), `docs/**` images, manifest.json, `sw.js` + workbox files
- [x] Verify dev: `pnpm start` (vite) serves :3000 (занят был старым CRA-процессом → проверил на :3001), app renders (playwright: калькулятор, рецепт, ионный баланс)
- [x] Verify runtime parity in browser (playwright against `vite preview`):
  - ✅ Home/Calculator renders, Redux store works (рецепт, ΔΣ I, EC)
  - ✅ Build constants injected (`0.2.1`, branch `refactor` in bundle)
  - ✅ `module` shim for redux-form (`module.hot` CJS check) — добавлен в `index.html`
  - ⚠️ CSV import/export: `csv-parse`/`csv-stringify` используют node-`Buffer` → **stub'ы** в `src/utils/csv.ts` (решение пользователя: «пока отключим csv*, в функции сделать заглушки»). Включить обратно: полифилл глобального `Buffer` в браузере + вернуть импорты.
  - ⚠️ Help-страницы: `react-markdown/with-html` → `html-to-react` → `htmlparser2` `Parser extends stream.Writable` → **ломается** (`Object prototype may only be... undefined`; Vite не полифиллит `stream`, webpack 4 полифиллил). **Отложено пользователем**: «пока отложим справку, может быть при обновлении пофиксится». Пути: апгрейд `html-to-react`/`react-markdown` / alias `stream` → `readable-stream` (2.3.7 уже в дереве).
  - Pre-existing tsc errors (не мешают vite build — он не type-check'ит): `App.test.tsx` (TS7016 types), `example.ts` (TS1208 isolatedModules), `json.test.ts` (TS2741 mixerOptions), `pages/App/index.tsx` (TS2307 `*.svg` — нет декларации `.svg`-модулей).

**Criterion:** `vite build` output in `build/` is deploy-equivalent to CRA output (relative base, docs images, PWA files); dev server works; PWA registration present in index.html. — **done**, с двумя отложенными known-issues (CSV stub'ы, Help).
**Commit:** `build: migrate from CRA to vite (config, pwa, ?raw)`

## Stage 2 — vitest migration
- [x] Add devDeps: vitest 4.1.11, jsdom 30.0.1, @testing-library/jest-dom 7.0.1; remove ts-jest, @types/jest (+ @types/testing-library__*)
- [x] Configure vitest: `vitest.config.ts` = `mergeConfig(vite.config, {test})` — jsdom env, `globals: true`, `setupFiles: src/setupTests.ts` (rewritten with `@testing-library/jest-dom/vitest`); base config (alias `@/`, classic JSX, `define`) inherited
- [x] Red → Green: `pnpm test` now runs **all 16 test files** (was 1/17 under jest/pnpm): **15 passed, 1 skipped** (pre-existing `describe.skip` in calculate_v1 — DEPRECATED), **70 tests passed, 5 skipped** (all skips are pre-existing intentional `test.skip`/`describe.skip` in sources)
- [x] Fix `molecularParser.test.ts`: `const Parser = require('./molecularParser')` (CJS require — dead under vitest ESM) → `import * as Parser`
- [x] Replace stale `src/__tests__/App.test.tsx` boilerplate ("learn react" — tested the CRA leftover page `pages/App`, which is **not routed** in Root) with a real smoke test: render `Root` + real redux store in jsdom; asserts app chrome (`Fork me on GitHub`), lazy-loaded Calculator mounted (`ΔΣ I`, `Результат расчета`), and build constants in the footer; 30 s timeout (lazy load)
- [x] Bump `@testing-library/react` 9.5.0 → **12.1.5**: 9.x pins `@testing-library/dom@^6` (no `waitFor`/async utils) and its dist is unreadable by TS 3.7; 12.x is the line that explicitly peers `react <18` and ships dom 8
- [x] Keep `example.ts` as sanity test; no leftover jest config (CRA-era jest was config-less: `package.json` had no jest block)

**Criterion:** `pnpm test` (vitest) runs all suites green — including the 16 previously broken calculator suites. — **done**: 15 passed | 1 skipped (pre-existing), 70 passed | 5 skipped.
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
