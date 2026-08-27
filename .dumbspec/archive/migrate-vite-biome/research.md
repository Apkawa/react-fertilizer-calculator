# Research — migrate-vite-biome

Findings from investigating the current CRA/react-app-rewired setup to plan migration to Vite + Biome.

## Task scope (confirmed with user)

- Full replacement of CRA + react-app-rewired with Vite (dev + build).
- PWA must keep working: migrate workbox config to `vite-plugin-pwa`.
- Tests: migrate jest → vitest.
- Biome replaces eslint AND prettier; port as many rules as possible.
- Full autonomy for the dumbspec process (draft → research → spec → plan in one pass).

## Current stack (package.json)

- React 16.13, react-router-dom 5, redux 4 + redux-form + redux-saga, theme-ui/rebass, styled-components 5.
- Bundler: `react-scripts` 3.4.3 (CRA, webpack 4) + `react-app-rewired` 2.1.6; overrides in `config-overrides.js`.
- Package manager: **pnpm 11.22.0** (`packageManager` field; scripts use `pnpm`). `yarn.lock` is a legacy artifact; `.npmrc` has `shamefully-hoist=true`.
- Node: `engines: >=24`; CI uses Node 24.x (`blank.yml`). So modern Node is fine (Vite 5/6, Vitest, Biome all OK).
- TS 3.7.2 (devDep), tsconfig extends `tsconfig.paths.json` (`@/*` → `./src/*`), strict.
- ESLint 6.8.0, config = `eslintConfig` in package.json: `extends: ["react-app"]`, parser `@typescript-eslint/parser`, rule `import/no-webpack-loader-syntax: off`. No standalone .eslintrc file.
- Husky 4 (hook in package.json `husky.hooks`), `preversion: pnpm full-check`; `full-check = test + lint + build`.
- `cross-env` used in build/start scripts (plus `NODE_OPTIONS=--openssl-legacy-provider` everywhere).
- `typesync` script (`pnpm types`) — legacy, syncs @types; can be dropped.

## Build specifics in config-overrides.js (what Vite must reproduce)

1. **Build-info constants** via `getBuildInfo()` → `git show --pretty='%h;%cI;%D' HEAD`:
   - `__VERSION__` (package.json version), `__COMMIT_HASH__`, `__COMMIT_DATE__`, `__COMMIT_REF_NAME__` (branch name parsed from `HEAD -> X` in %D), and `__PUBLIC_PATH__`.
   - Injected with `webpack.DefinePlugin`. Globals typed in `types/globals.d.ts` (root dir `types/`, not `src/types/`).
2. **`config.output.publicPath = './'`** and scripts run with `PUBLIC_URL=./` — relative asset base so the site works under a GitHub Pages subfolder (non-master branches deploy to `gh-pages/<branch>/`). Vite: `base: './'`.
3. **raw-loader for `.md`**: imports are `import("!!raw-loader!../../docs/*.md")` in `src/pages/Help/pages.ts` (10 files). Vite native: `import("...md?raw")`.
4. **CopyPlugin**: `docs/**/*.{jpg,png,jpeg}` from context `src/` → `src/docs` images copied into build root (used by docs referenced in markdown/images? need to check who references `docs/*.png` in build output — likely the markdown Help pages reference relative images).
5. **PWA**: `rewireWorkboxGenerate` (workbox-webpack-plugin GenerateSW) with default `defaultGenerateConfig`; the custom `swDest` (`build/pwa-sw.js`), `skipWaiting`, `runtimeCaching` block is **commented out** (FIXME: pnpm broke the build with swDest). So currently: stock GenerateSW output (`build/sw.js` + `workbox-*.js`?) with CRA defaults, while `src/serviceWorker.ts` + `index.tsx` still register `${PUBLIC_URL}/pwa-sw.js` — a filename that does NOT exist under the pnpm-FIXME state. **Service worker registration is effectively broken/stale today**; the PWA manifest (public/manifest.json) still ships. Migration decision: use `vite-plugin-pwa` generateSW mode, fix registration (drop the hand-written `serviceWorker.ts`, use plugin's injected registration or a small manual one with the plugin's sw filename `sw.js`).
6. Jest override: `transformIgnorePatterns` to allow `js-combinatorics` (ESM) under pnpm layout. (js-combinatorics is an ESM-only package — matters for Vitest: vitest/esbuild handle ESM natively, so this workaround likely goes away.)
7. `tsconfig.json` `"files": ["./types/globals.d.ts"]` + `include: src/**`.

## Deploy (GitHub Actions `blank.yml` → "website")

- Triggers on push to `master` + `dev`. Node 24.x, pnpm 11.22.0, `pnpm install --frozen-lockfile`, `pnpm full-check`.
- Deploys `build/` to `gh-pages`, `TARGET_FOLDER` = branch name for non-master (root for master) → hence `base: './'`.
- Deploy action JamesIves/github-pages-deploy-action@3.7.1 — folder is `build`; new Vite output dir (default `dist/`) should keep the name `build/` or update the action input. Keeping `outDir: 'build'` is least-change.

## Tests

- Pure-logic suites in `src/calculator/**` + `src/__tests__/App.test.tsx` (boilerplate, expects "learn react" text — likely stale) + `src/__tests__/example.ts` (trivial).
- `setupTests.ts` imports `@testing-library/jest-dom/extend-expect` (CRA-era API). Vitest needs `@testing-library/jest-dom/vitest`.
- No jest config in package.json (CRA defaults via react-app-rewired).

## Risks / open questions

- **`js-combinatorics` ESM**: check whether calculator imports it (`js-combinatorics` dep exists); Vite dev handles ESM natively; prod Rollup bundles it fine too.
- **`@loadable/component`** lazy pages: works under Vite (it just wraps dynamic imports); needs no plugin.
- **styled-components 5**: works under Vite (CSS-in-JS at runtime; no build plugin needed).
- **theme-ui 0.3 / rebass 4**: runtime libs, no build involvement.
- **React 16 + @vitejs/plugin-react**: fine (JSX transform is automatic/classic — plugin-react's esbuild/babel handles `React` classic mode; can set `jsxRuntime: 'classic'`? plugin-react default is automatic but works with classic too since React is imported). Verify in dev.
- **Biome vs TS 3.7 types**: Biome is standalone (own TS parser, does not use tsc) — independent of the repo's typescript version. But repo still needs TS for `tsc` typechecking; consider whether to bump TS to modern version as part of the migration or leave 3.7. Decision: keep TS pinned as-is unless forced (separate concern) — Vite never invokes tsc for builds. Vitest does not typecheck. `tsc --noEmit` is not currently in full-check (only via IDE/CI?) — check.
- **Node scripts with `NODE_OPTIONS=--openssl-legacy-provider`**: webpack 4 only need; Vite (esbuild/rollup) does not → drop from scripts after migration.
- **Husky 4 → keep as-is** (out of scope) — but full-check command changes (test/lint/build script names).
- **`raw-loader` types** in `types/globals.d.ts` (`declare module "!!raw-loader!*"`) must be replaced by `?raw` typing (`declare module "*.md?raw"` or vite/client types). Vite provides client types: `/// <reference types="vite/client" />` or `types: ["vite/client"]` covers `?raw` imports? Vite client types declare `*.md?raw` via `declare module '*.md?raw'`? Actually vite/client has generic `*?raw` module declarations. Verify.
- **public/ assets**: `manifest.json`, favicon, logos, robots.txt — plain static, fine for Vite `public/` copy.
- **`server.js`** (express static of build/) — keep as-is; just a local preview server (out of scope).
- **`docs/` (jupyter) vs `src/docs/`** — the CopyPlugin copies `src/docs/**` images into output root; markdown references relative image paths. Must keep equivalent copy for `src/docs` assets → check references in src/docs/*.md.

## Baseline run results (current code, before migration)

- **`pnpm build`** (CRA/react-app-rewired): ✅ succeeds; `build/` with `publicPath: ./`; chunk list printed. Build folder name stays `build`.
- **`pnpm lint`** (eslint react-app, `--max-warnings=0`): ✅ zero warnings/errors. Biome port must keep an equivalent bar (biome check must exit clean).
- **`pnpm test`** (react-app-rewired jest): ❌ **16 of 17 suites FAIL** with babel parse errors on TS type annotations (only `src/__tests__/example.ts` passes). The jest toolchain is broken under the current pnpm layout. Consequence: vitest migration is also a **repair** of the test base — acceptance = the previously-failing calculator suites must actually run and pass under vitest.
- `src/__tests__/App.test.tsx` is CRA boilerplate (expects text "learn react") — almost certainly stale; `example.ts` is a trivial sanity test. Both are part of the 17 suites; App.test likely also broken/meaningless — decide: replace with a real smoke render or drop (see spec).

## Code-scan specifics

- `process.env` used **only** in `src/serviceWorker.ts` (CRA boilerplate, being deleted). No `import.meta` anywhere in src.
- `react-helmet` used in 2 UI containers (`SidebarContainer`, `ModalContainer`) — runtime lib, no bundler involvement.
- Images inside `src/docs/**/*.md` resolve at runtime via `Help.tsx` `transformImageUri` → `./docs/${topSlug}/${uri}`; CopyPlugin ships `src/docs/**` (images) to `build/docs/**`. Vite equivalent: `vite-plugin-static-copy` with `cwd: src`, `glob: docs/**/*.{jpg,png,jpeg}` → outDir `docs/**`.
- `.md` imports: only in `src/pages/Help/pages.ts` (10 `import("!!raw-loader!...md")` → `import("...md?raw")`, keep `.then(m => m.default)` pattern; Vite `?raw` default export is the file string).
- `pnpm-workspace.yaml` (repo root): `onlyBuiltDependencies: [husky, core-js, core-js-pure]` (pnpm ≥ 10 build-script gate). New deps with postinstall scripts (e.g. `esbuild`) will need adding here or a pnpm warning; handled during install.
- Git: current branch `refactor`; `.dumbspec/current/` untracked; `build/` is gitignored.
- `engines: node >=24`; CI Node 24.x → Vite 8 (engines `^20.19 || >=22.12`), Vitest, Biome 2 all fine.

## Vite version notes (registry-checked 2026-08)

- Latest versions: **vite 8.2.2**, **@vitejs/plugin-react 6.1.0** (peer `vite ^8`, uses oxc JSX transform), **vite-plugin-pwa 1.3.0** (peers: `vite ^3–^8`, **`workbox-build ^7.4.1`**, **`workbox-window ^7.4.1`** — non-optional, must be explicit devDeps under pnpm), **vitest 4.1.11**, **@biomejs/biome 2.5.10**, **@testing-library/jest-dom 7.0.1**, **jsdom 30.0.1**, **vite-plugin-static-copy 4.1.1**.
- `@vitejs/plugin-react` 6.x has optional babel peers (`@rolldown/plugin-babel`, `babel-plugin-react-compiler`) — not needed.
- vite-plugin-pwa defaults: `strategies: 'generateSW'`, `registerType: 'auto'`, `injectRegister: 'auto'` (injects registration snippet into built index.html; SW file `sw.js` in outDir). CRA-era hand-written registration (`serviceWorker.ts`, registered `${PUBLIC_URL}/pwa-sw.js`) is removed; today's deployment has a filename mismatch (generated `sw.js` vs registered `pwa-sw.js`) → PWA registration is effectively stale; the new setup **fixes** it.
- Biome 2.x: config = `biome.json` (top-level `"version": "2"`); `biome check` = lint + format; formatter replaces prettier; recommended rulesets: `recommended` (+`correctness/suspicious/style/performance` included). Rule porting from `react-app`: Biome has no `react-hooks`/`import` plugins — closest equivalents: `correctness` (e.g. `noDoubleQuote`? n/a), `useExhaustiveDependencies` (hooks dep-check exists as `correctness/useExhaustiveDependencies`), `organizeImports` assist for import order. Gaps documented per-rule in spec.

## Vite version notes (to verify)

- Vite 5: Node >= 18, ESM build config. Vite 6/7 similar. React plugin `@vitejs/plugin-react` v4+.
- `vite-plugin-pwa` v0.20+/v1.0: generateSW by default, `injectRegister: 'auto'`, sw filename `sw.js`, precache; manifest support.
- Vitest v2/v3: `test.environment: 'jsdom'` for App test; pure tests can run in `node`.
- Biome v2: `biome.json`; replaces ESLint+Prettier; `biome check` = lint + format; TS support decent; known gaps: no `react-hooks` equivalent rules (has some), no import-order rule? (Biome has `organizeImports` assist). Rule mapping needed: `react-app` extends → `eslint:recommended` + `plugin:@typescript-eslint/recommended` + react rules + import rules. Biome recommended rulesets: `lint/recommended` + `style` etc.

## File-level change inventory (candidate)

- `package.json` — rewrite scripts/deps; drop react-scripts, react-app-rewired, react-app-rewire-workbox, raw-loader, copy-webpack-plugin, workbox-webpack-plugin(→ vite-plugin-pwa), ts-jest, typesync(?), source-map-explorer(analyze), eslint→biome, add vite, @vitejs/plugin-react, vite-plugin-pwa, vitest, jsdom(?), @biomejs/biome, @testing-library/jest-dom (modern), cross-env (? not needed), NODE_OPTIONS envs.
- New: `vite.config.ts` (aliases, base, outDir build, define constants from git, ?raw, copy src/docs images, PWA), `vitest.config.ts` (or in vite config), `biome.json`.
- Delete: `config-overrides.js`, `src/serviceWorker.ts` (or repurpose), `yarn.lock` (legacy), eslintConfig block, `raw-loader` imports.
- Edit: `src/pages/Help/pages.ts` (10 `!!raw-loader!` → `?raw`), `src/index.tsx` (drop serviceWorker import), `src/setupTests.ts` (jest-dom/vitest), `types/globals.d.ts` (add `?raw` module decl / vite/client ref), `tsconfig.json` (types add; jsx setting maybe keep `react` classic), `pnpm-lock.yaml` regen, `blank.yml` (fine as-is if script names keep), `AGENTS.md` (commands section), `.dumbspec` (this task).
