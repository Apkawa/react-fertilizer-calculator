# Research: refactoring-ui-package

Task: refactor `packages/ui` — per-component folders (styles + tests inside), vitest browser-mode
regression tests (`vitest/browser` + `@vitest/browser-playwright` + `vitest-browser-react`),
Storybook for all components. Facts only — no design.

## Inventory

**Package** `packages/ui/package.json` — `@fertilizer/ui` v0.0.0, `private: true`, source package (no build step).

- `main`: `./src/index.ts`
- `exports`: `"."` → `./src/index.ts`, `"./theme.css"` → `./src/theme.css` (the only two subpaths)
- `dependencies`: `@fertilizer/icons` `workspace:*`, `@vanilla-extract/css` `^1.21.2` (resolved 1.21.2), `react-helmet` `^6.1.0` (resolved 6.1.0)
- `peerDependencies`: `react` `catalog:` (catalog = `^16.13.1`)
- `devDependencies`: `react` `catalog:`, `react-dom` `^16.13.1`, `@testing-library/react` `12.1.5`, `jsdom` `^30.0.1`, `vitest` `^4.1.11`, `@vanilla-extract/vite-plugin` `^5.2.6`, `typescript` `7.0.2`, `@types/node` `^12.0.0`, `@types/react` `^16.9.0`, `@types/react-dom` `^16.9.8`, `@types/react-helmet` `^6.1.0`
- `scripts`: `"test": "vitest run"` (single script)

**Files under `packages/ui/src`** (flat, no folders — 29 files, ~1600 LOC):

- Public API barrel: `index.ts` (exports Button, Card, Checkbox, cx, Dropdown, ForkMeOnGitHub, Input, Label, Modal, NumberInput, Radio, Sidebar, Heading/Text, useColorMode/ColorMode, useWindowSize)
- Components (one `.tsx` each): `button.tsx`, `card.tsx`, `checkbox.tsx`, `dropdown.tsx` (217 LOC), `fork-me.tsx`, `input.tsx`, `label.tsx`, `modal.tsx` (150 LOC), `number-input.tsx` (145 LOC), `radio.tsx`, `sidebar.tsx` (158 LOC), `text.tsx`
- Non-component: `cx.ts` (class join), `number-utils.ts` (round/countDecimals), `use-color-mode.ts` (hook), `use-window-size.ts` (hook), `styles.css.ts` (all classes), `theme.css`
- (Note: AGENTS.md mentions `tab-menu.tsx` here — it does **not** exist in the current tree; `TabMenu` lives in `apps/web/src/components/navigation/TabMenu.tsx`.)

**Config files inside `packages/ui`:** `vitest.config.ts` (see Tests), `tsconfig.json` (`strict`, `jsx: "react"` classic, `moduleResolution: "bundler"`, `types: ["vitest/globals", "node"]`, `include: ["./src/**/*"]`). No `vite.config.ts`, no `.storybook/`, no other test infra.

**How `apps/web` imports `@fertilizer/ui`:**

- Top-level `import { Button, Card, ... } from "@fertilizer/ui"` in ~28 files (all Calculator components, `pages/ChemFormula`, `pages/DensityCalculator`, `components/ui/Form/{Radio,Input,Checkbox}.tsx`, `components/navigation/TabMenu.tsx`, `components/ColorModeToggle.tsx`, `Root.tsx`, `test-utils/render.tsx` comment)
- Exactly one subpath usage: **CSS** `@import "@fertilizer/ui/theme.css";` in `apps/web/src/styles/app.css` (relies on the `exports` entry)
- No TypeScript/JS subpath imports (`@fertilizer/ui/...` never appears in `apps/web/src`)
- `apps/web/package.json` depends on `"@fertilizer/ui": "workspace:*"`

## Styling

- **vanilla-extract** single file `src/styles.css.ts` (361 lines, `@vanilla-extract/css` `style()` objects): `globalLayer("components")` + 18 exported class consts: `inputClass`, `labelClass`, `buttonClass`, `cardClass`, `headingClass`, `numberInputWrapperClass`, `spinnerButtonClass`, `dropdownChevronClass`, `dropdownItemClass`, `dropdownItemDisabledClass`, `dropdownListClass`, `modalOverlayClass`, `modalCardClass`, `sidebarOverlayClass`, `sidebarOverlayUndockedClass`, `sidebarCardClass`, `forkMeClass`, `forkMeLinkClass`. Every rule is wrapped in `"@layer": { components: { ... } }` so tailwind **utilities** layer overrides atom classes (comment in file + app config).
- **Theme**: `src/theme.css` — `:root { --color-* / --font-* / --line-height-* / --shadow-* }` (polaris replacement) and `:root[data-theme="dark"]` overrides; `body` background/color. Consumed only through the `./theme.css` export (app CSS `@import`); not imported by any TS file.
- **Class name production**: components `import { buttonClass } from "./styles.css"` and apply via `cx(...)` (`cx.ts`); `className` prop is appended after the atom class (e.g. `cx(buttonClass, className)`).
- **Dark theme**: `use-color-mode.ts` → `applyMode()` sets `document.documentElement.setAttribute("data-theme", mode)` (`"default"` | `"dark"`); localStorage key `"ui:color-mode"`, legacy key `"theme-ui:mode"` migrated one-shot. App entry (`apps/web/src/index.tsx`) must import `./styles/app.css` **before** `./Root` so tailwind v4 `@layer theme, base, components, utilities` order is correct (comment in file); app's `vite.config.ts` plugin order is `tailwindcss()` → `react({ jsxRuntime: "classic" })` → `vanillaExtractPlugin()` (order matters, per comment).
- **Portsals**: `modal.tsx` and `sidebar.tsx` create a container via `document.body.appendChild(el)` and render `ReactDOM.createPortal(...)` into it (tests query `document.body`). Unique ids for React 16 (no `useId`) come from **module-level counters** in `dropdown.tsx` / `modal.tsx`.
- `packages/ui` itself has no tailwind; tailwindcss v4 lives in `apps/web` (`@tailwindcss/vite` + `tailwindcss` 4.3.3).

## Tests (current)

- Runner: `packages/ui/vitest.config.ts` — `defineConfig` from `vitest/config`, `plugins: [vanillaExtractPlugin()]`, `test: { globals: true, environment: "jsdom", exclude: ["**/node_modules/**", "**/dist/**"] }`. No browser mode, no projects.
- `pnpm test` at root = `pnpm -C packages/calculator test && pnpm -C packages/icons test && pnpm -C packages/ui test && pnpm -C apps/web test` (each package runs `vitest run`). `full-check` = test + lint + type + build; husky pre-commit runs it.
- Colocated jsdom tests (10 files, `@testing-library/react` 12.1.5, classic React import per file):
  - `checkbox.test.tsx` — renders unchecked checkbox; `onChange` fires with click
  - `input.test.tsx` — renders with value; `onChange` fires on typed change
  - `radio.test.tsx` — renders radio; checked reflects prop; `onChange` fires
  - `number-input.test.tsx` — smoke render with value; spinner up-button increments by `step` (controlled wrapper, clicks `^` button)
  - `primitives.test.tsx` — Label wraps children; Button renders text; Card renders; Text renders div; Heading defaults `h2` + `as` prop
  - `dropdown.test.tsx` (62 lines) — smoke render; chevron is a named `<button>` (opens list, name flips open/closed); combobox semantics: accessible name from `label`, `aria-expanded`, `aria-controls` → listbox id; listbox has direct `role="option"` children; options not focusable / not selectable by body click
  - `modal.test.tsx` (79 lines) — open modal renders (portaled to body); close button `<button aria-label="Закрыть">`; `role=dialog`, `aria-modal=true`, `aria-labelledby` → `<h2>` title, `tabindex=-1`; focus moves into dialog on open and back to trigger on close (clicks wrapped in `act` — React 16 passive effects)
  - `sidebar.test.tsx` — open sidebar renders (portaled); burger button name «Меню»; close button name «Закрыть»
  - `use-color-mode.test.tsx` — default mode; restore from new key; legacy-key migration; new key wins over legacy; toggle updates mode + `data-theme` attr + localStorage
  - `fork-me.test.tsx` — link with github.com/Apkawa/... href renders
- All assertions are behavior/DOM-level in jsdom; no CSS assertions (comment in `apps/web` render util: theme not applied in jsdom, no effect).

## Versions & constraints

Resolved from `package.json` files + `pnpm-lock.yaml` (single lockfile, pnpm workspace `apps/*` + `packages/*`, catalog `react`/`react-dom` `^16.13.1`):

| Package | Declared | Resolved (lock) |
| --- | --- | --- |
| vitest | `^4.1.11` (packages/ui, apps/web) | **4.1.11** |
| vite | `^8.2.2` (apps/web) | **8.2.2** |
| @vitejs/plugin-react | `^6.1.0` (apps/web) | **6.1.0** |
| react / react-dom | `catalog:` / `^16.13.1` | **16.13.1** |
| @playwright/test | `^1.62.1` (root, apps/web) | **1.62.1** (playwright-core 1.62.1) |
| playwright (browser dep) | — | 1.62.1 (transitive of @playwright/test) |
| tailwindcss / @tailwindcss/vite | `^4.3.3` | **4.3.3** |
| @vanilla-extract/css | `^1.21.2` | **1.21.2** |
| @vanilla-extract/vite-plugin | `^5.2.6` | **5.2.6** |
| @testing-library/react | `12.1.5` | **12.1.5** (locked with react 16.13.1) |
| @testing-library/jest-dom | `7.0.1` (apps/web) | 7.0.1 |
| jsdom | `^30.0.1` | **30.0.1** |
| typescript | `7.0.2` (root + all) | **7.0.2** (TS 7, native compiler) |
| storybook / @storybook/* | — | **not installed anywhere** (absent from lockfile) |
| @vitest/browser-playwright / vitest-browser-react | — | **not installed** (absent from lockfile) |

Registry facts (checked via `pnpm view`):

- vitest 4.1.11 ships `@vitest/browser-playwright@4.1.11` as peer-declared companion; its peers: `vitest: "4.1.11"` (**exact**), `playwright: "*"`.
- `vitest-browser-react@2.2.0` (latest) peers: `react: "^18.0.0 || ^19.0.0"`, `react-dom: "^18.0.0 || ^19.0.0"`, `@types/react: "^18.0.0 || ^19.0.0"`, `@types/react-dom: "^18.0.0 || ^19.0.0"`, `vitest: "^4.0.0"` → **does not match the repo's React 16.13.1 / @types/react 16**.
- `@storybook/react-vite@10.5.10` peers: `vite: "^5 || ^6 || ^7 || ^8"`, `react: "^16.8 || ^17 || ^18 || ^19"`, `react-dom` same, `storybook: "^10.5.10"`, `typescript: ">= 4.9.x"` → **compatible** with vite 8.2.2, react 16.13.1, TS 7.0.2.

Other constraints:

- Root `engines`: node `>=24`, pnpm `>=11.22.0`; `packageManager: pnpm@11.22.0`. `apps/web` repeats `engines` node>=24.
- Root scripts: `test` (per-package chain above), `type` = `tsc -p packages/calculator && tsc -p packages/icons && tsc -p packages/ui && tsc -p apps/web` (so `tsc -p packages/ui` must keep passing after the folder refactor), `lint` = `biome check apps packages --diagnostic-level=error`, `full-check` = test+lint+type+build; husky pre-commit = full-check.
- `playwright.config.ts` (root, e2e/smoke only): `testDir: ./tests`, `workers: 1`, `retries: 1`, one project `chromium` (`devices["Desktop Chrome"]`), `trace: "retain-on-failure"`, `screenshot: "only-on-failure"`, `webServer: { command: "pnpm start", url: http://localhost:3000, reuseExistingServer: true, timeout: 120s }`. These suites are **not** part of `full-check`/CI.
- Playwright browser binaries: `playwright-core@1.62.1/browsers.json` expects **chromium:1234**, chromium-headless-shell:1234, firefox:1538, webkit:2336. On disk: `~/.cache/ms-playwright/` (bind-mounted, shared with user) contains `chromium-1234`, `chromium_headless_shell-1234`, `chromium-1169`, `chromium_headless_shell-1169`, `firefox-1538`, `firefox-1482`, `webkit-2336`, `webkit-2158`, `ffmpeg-1011`, `daemon` — i.e. **the chromium revision required by playwright 1.62.1 is already installed**. Project-local `.cache/ms-playwright/` holds the playwright-cli daemon registry (`b`, `daemon`) and is where `PLAYWRIGHT_BROWSERS_PATH=$PWD/.cache/ms-playwright` points per AGENTS.md.
- AGENTS.md sandbox env vars for playwright-cli: `XDG_CACHE_HOME=$PWD/.cache`, `PLAYWRIGHT_BROWSERS_PATH=$PWD/.cache/ms-playwright`, `PWTEST_SOCKETS_DIR=$PWD/.cache/pw-sockets`; pnpm installs need `pnpm_config_store_dir=./.pnpm-cache/v11`.
- `pnpm-workspace.yaml`: `allowBuilds`/`onlyBuiltDependencies` whitelist `esbuild`, `husky`, `core-js(-pure)` (pnpm ≥10 blocks other build scripts — a new dep with postinstall would need an explicit entry).
- `apps/web/vitest.config.ts` merges `vite.config.ts` (alias `@/`, classic JSX, `define` build constants, tailwind+vanilla-extract plugins) and adds `globals`, jsdom, `setupFiles: ["./src/setupTests.ts"]`, excludes `tests/**`.

## Docs: vitest+browser

From `.dumbspec/current/refactoring-ui-package/docs/vite-browser/` (Vitest 4.x docs; ARIA snapshots marked experimental `Version 4.1.4`, trace-view `Version 5.0.0`):

- **Browser mode activation**: `test.browser.enabled: true` + `provider: playwright()` from `@vitest/browser-playwright`; **at least one instance** is required: `instances: [{ browser: 'chromium' }]`. Playwright provider supports `firefox`, `webkit`, `chromium`. `preview` provider = dev only (simulated events, no CDP); CI needs playwright/webdriverio.
- **jsdom + browser coexistence** (from `index.md` `{#projects-config}`): use `test.projects` — one project with `environment: 'node'`/jsdom + `include` for unit tests, one project with `name: 'browser'` + `browser: { enabled: true, provider: playwright(), instances: [{ browser: 'chromium' }] }` + its own `include`. Filtering via `--project <name>`.
- **`browser.instances` vs projects** (`multiple-setups.md`): instances run on one shared Vite server (better dep pre-bundle caching); give instances a custom `name` when repeating a browser; `--project` still filters.
- **Headless**: `browser.headless: true` (no auto UI); needed for reliable CI. `vitest init browser` scaffolds deps+config; manual install = `pnpm add -D vitest @vitest/browser-playwright`.
- **React usage pattern** (`index.md` react code-group):
  ```tsx
  import { render } from 'vitest-browser-react'
  test('...', async () => {
    const screen = render(<Fetch url="/greeting" />)
    await screen.getByText('Load Greeting').click()
    const heading = screen.getByRole('heading')
    await expect.element(heading).toHaveTextContent('hello there')
    await expect.element(screen.getByRole('button')).toBeDisabled()
  })
  ```
  i.e. `render()` from `vitest-browser-react` returns a `screen` locator object; interactions via `page` / screen locators (`.click()`, `.fill()` from `vitest/browser`); assertions via `await expect.element(locator).toBeInTheDocument()/toHaveTextContent()/toBeDisabled()/toHaveFocus()/toHaveAttribute(...)`; `userEvent` from `vitest/browser` (not `@testing-library/user-event` — simulation discouraged); `expect.element` auto-retries.
  **Testing-library bridge** (for frameworks without official render): `const { baseElement } = render(...); const screen = page.elementLocator(baseElement)` — documented in `component-testing.md`.
- **Visual regression** (`visual-regression-testing.md`): `await expect(page.getByRole('button')).toMatchScreenshot()`; first run creates baseline in `__screenshots__/` (name = `test-name-<browser>-<platform>.png`, commit baselines); update via `vitest --update`; recommended separation: `projects` with `**/*.vrt.test.[tj]s?(x)` pattern, `headless: true`, fixed `viewport: { width: 1280, height: 720 }`; built-in comparator `pixelmatch` (`threshold`, `allowedMismatchedPixelRatio` configurable in `test.browser.expect.toMatchScreenshot`); Playwright provider auto-disables animations in `screenshotOptions`; stability detection via repeated screenshots; screenshot sensitive to fonts/GPU/OS → controlled env recommended; `screenshotOptions.mask` for dynamic content.
- **Playwright traces** (`playwright-traces.md`): Playwright provider only; `browser.trace: 'on'` (or `on-first-retry`/`on-all-retries`/`retain-on-failure`; object form `{ mode, tracesDir }`); trace files in `__traces__/` named `<project>-<test>-<repeat>-<retry>.trace.zip`; view with `npx playwright show-trace <file>` or trace.playwright.dev; `page.mark()`/`locator.mark()` add named markers; `vi.defineHelper` points trace entries to call sites.
- **ARIA snapshots** (`aria-snapshots.md`): `await expect.element(el).toMatchAriaSnapshot()` (`.snap` file) or `toMatchAriaInlineSnapshot('...')`; YAML-like accessibility-tree format; regex patterns + `/children: equal|deep-equal` directives; browser mode re-queries until a11y tree stabilizes (two identical polls); same `--update` workflow; `utils.aria` for tree inspection.
- **Trace View** (`trace-view.md`): experimental 5.0.0; `browser.traceView: true` (or `{ enabled, inlineImages, recordCanvas }`); records rrweb DOM snapshots for assertions + interactions (`click`, `fill`, `type`, …); replay in browser UI / Vitest UI / HTML reporter; works with **all** providers; independent of `browser.trace`.
- **Limitations** (`index.md`): no `vi.spyOn` on module exports (sealed ESM namespaces) → use `vi.mock('mod', { spy: true })`; thread-blocking dialogs (`alert`/`confirm`) auto-mocked; browser UI port 63315 to avoid dev-server conflicts; framework plugin must be in config (`@vitejs/plugin-react` for React).
- **Why browser mode** (`why.md`): real-browser fidelity over jsdom; not a drop-in replacement for e2e runners; slower initialization (provider + browser startup).

## Docs: Storybook

- `.dumbspec/.../docs/storybook-react-vite.md`: header says **"Version 10.5 — React / TypeScript"** (also 9.x/8.x variants exist). Install: `pnpm create storybook@latest` (interactive: config preset, example stories, telemetry). Manual install: `pnpm add --save-dev @storybook/react-vite`, then `.storybook/main.ts` → `framework: '@storybook/react-vite'` (CSF 3: `const config: StorybookConfig = { framework: '@storybook/react-vite' }; export default config`; or CSF Next: `defineMain({ framework: '@storybook/react-vite' })`). Framework options via `framework: { name, options }`; `builder` option = Vite builder options. Run: `pnpm run storybook`; build: `pnpm run build-storybook` → `outputDir` (default `storybook-static`).
- `.tmp/storybook/docs` (Storybook repo checkout, **version 10.5.10** per CHANGELOG top entry):
  - `get-started/frameworks/react-vite.mdx` requirements: **React ≥ 16.8**, **Vite ≥ 5**.
  - `get-started/install.mdx` project requirements: Node.js 20+, pnpm 9+, TypeScript 4.9+, Vite 5+, **Vitest 3+**, Webpack 5+; Storybook app browsers Chrome 131+/Edge 134+/Firefox 136+/Safari 18.3+; install = deps + scripts + default config + boilerplate stories + telemetry (opt-out available); `--features docs test a11y` for extra features.
  - Other skimmed: `essentials/` (controls/actions/themes/viewport/measure-and-outline/backgrounds), `writing-stories/` (args, decorators, play-function, typescript, naming), `configure/` (styling-and-css, story-rendering, story-layout, `builders/vite`), `writing-tests/` incl. `integrations/vitest-addon/` (Storybook vitest addon exists), `writing-docs/`.
  - `.tmp/storybook/AGENTS.md` (repo-maintainer guidance, not user-facing docs) notes their own convention (play-function stories over `*.test.tsx` for React components) — applies to the Storybook repo, not to this project.
- No Storybook code exists anywhere in the fertilizer repo (no `.storybook/`, no storybook deps in any `package.json`/lockfile).

## Risks

Facts collected; no solutions proposed.

1. **React 16 vs `vitest-browser-react`**: latest `vitest-browser-react@2.2.0` declares `react ^18 || ^19`, `react-dom ^18 || ^19`, `@types/react ^18 || ^19`, `@types/react-dom ^18 || ^19` as peers; repo is react/react-dom **16.13.1** + `@types/react` 16.9/`@types/react-dom` 16.9. pnpm will flag a peer conflict, and the package's React 18+ rendering path has no React 16 equivalent (`react-dom/client` does not exist in 16). The repo's own docs (`component-testing.md`) document a testing-library bridge (`page.elementLocator(baseElement)`) for exactly this situation.
2. **`@vitest/browser-playwright@4.1.11` pins `vitest: "4.1.11"` exactly** (peer); any vitest minor upgrade breaks the pair unless the browser package version moves in lockstep (vitest ships same-versioned browser packages: 4.1.11 ↔ 4.1.11).
3. **`@vitest/browser-playwright` peer `playwright: "*"`** — will resolve to the repo's `playwright` 1.62.1 (transitive of `@playwright/test`); if a different playwright version lands in the tree, the chromium revision expectation changes and a browser download may be needed (1.62.1 → chromium-1234, already present in `~/.cache/ms-playwright`).
4. **Browser binary availability**: chromium-1234 **is** installed in the shared `~/.cache/ms-playwright` (bind-mounted); but the sandbox convention sets `PLAYWRIGHT_BROWSERS_PATH=$PWD/.cache/ms-playwright` (project-local, currently only daemon registry, no browser dirs) for playwright-cli — vitest browser mode launched in a plain sandboxed shell would default to `~/.cache/ms-playwright`, which does contain the binaries. Whether the same env vars/paths apply to vitest's playwright usage is unverified.
5. **Existing config must coexist**: `packages/ui/vitest.config.ts` currently runs everything in jsdom; adding browser mode changes how `pnpm test` behaves in that package (root `pnpm test` runs `vitest run` per package — with `projects` defined, a plain `vitest run` runs **all** projects unless filtered; the docs' pattern uses `--project` scripts). `full-check` (husky pre-commit + CI) will therefore start launching real browsers unless the suite/scripts are partitioned deliberately.
6. **Style layering in tests**: browser tests in `packages/ui` would run with `vanillaExtractPlugin()` only (no tailwindcss, no `theme.css` unless imported) — the current jsdom setup deliberately skips the theme; whether regression screenshots/rendering match the app's layered CSS (tailwind preflight/base + components layer + theme vars) depends on what the vitest config imports; the app enforces plugin order tailwind→react→vanilla-extract for `@layer` correctness, so a browser-test config that omits tailwind may render differently from the app.
7. **`exports` map is minimal** (`"."` and `"./theme.css"` only): the app consumes only the barrel; per-component folders + moving tests/styles must keep `index.ts` (or an equivalent barrel) at `./src/index.ts` for `main`/`exports` and for `tsc -p packages/ui` (`include: src/**`).
8. **No Storybook in the workspace**: adding `storybook@10.5.10` + `@storybook/react-vite` + framework deps is a large new dependency tree on pnpm with `onlyBuiltDependencies` whitelisting (build scripts of new deps are blocked unless listed); docs require Node 20+/Vite 5+/TS 4.9+ — repo satisfies (node ≥24, vite 8.2.2, TS 7.0.2), and `@storybook/react-vite@10.5.10` peers accept react 16.8+ (unlike vitest-browser-react).
9. **TS 7 native compiler**: root `type` runs `tsc -p packages/ui` over `src/**`; new file layout + new test/story files must stay type-clean under `strict` with `types: ["vitest/globals", "node"]` (no DOM testing-library types beyond what's declared).
10. **e2e separation fact**: root Playwright suites (`test:e2e`/`test:smoke`) are explicitly outside `full-check`/CI and spin the dev server; vitest browser mode is separate infra (own Vite server, port 63315) — two distinct browser launch paths will coexist in this repo.
11. **Docs version skew**: task docs are vitest 4.1.x-era (ARIA snapshots experimental 4.1.4; trace-view tagged 5.0.0) — `browser.traceView` may be newer than the pinned vitest 4.1.11 feature surface; ARIA snapshots require ≥4.1.4 (satisfied by 4.1.11).
12. **Sandbox install constraint**: `pnpm install` here requires `pnpm_config_store_dir=./.pnpm-cache/v11`; any verification that adds deps writes into the shared `.pnpm-cache`.
