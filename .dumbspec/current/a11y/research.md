# a11y — research (context collection)

Task: add accessibility tests to the e2e suite (Playwright + `@axe-core/playwright`, tags `wcag2a`/`wcag2aa`, fail on violations) AND add `aria-label` + other a11y attributes across the whole app, so navigation via playwright-cli becomes much easier.

Status: complete — all findings from the workspace are recorded below (context collection only; no solution designed, no source modified).

---

## 1. Pages / routes

- Pages are registered in `apps/web/src/pages/index.ts` via `@loadable/component` lazy loading:
  - `App` (lazy)
  - `NotFound` (eager, imported directly)
  - `Help` (lazy)
  - `Calculator` (lazy)
  - `ChemFormula` (lazy)
  - `DensityCalculator` (lazy)
  - `Example` (lazy)

- Top-level routing in `apps/web/src/Root.tsx` (HashRouter, react-router-dom):
  - Layout: `TabMenu` (app component, `apps/web/src/components/navigation/TabMenu.tsx`) + `ForkMeOnGitHub` (from `@fertilizer/ui`), version footer span.
  - `Switch` routes:
    - `/formula/:formula?/:percent?` → `ChemFormula`
    - `/density/:formula?/:concentration?/:density?/` → `DensityCalculator`
    - `/example` → `Example`
    - `/help/:slug*` → `Help`
    - `/` → `Calculator`
    - `*` → `NotFound`
  - Note: `pages.Calculator` renders its OWN inner `<Router>`/`<Switch>` with sub-routes `/` (Calculator) and `/fertilizers` (FertilizerManager) — nested router inside a page is an existing quirk (Root.tsx already uses HashRouter at the top).

### Page component trees (top-level names only)

- **App** (`pages/App/index.tsx`) — legacy boilerplate (React logo + "Edit src/App.tsx" text). Registered in `pages/index.ts` but NOT routed in Root.tsx (appears unused by routes). Has `img alt="logo"`.
- **Calculator** (`pages/Calculator/index.tsx`) — own `Router`/`Switch`: `/` → `Calculator` component (`components/Calculator/index.tsx`), `/fertilizers` → `FertilizerManager`.
- **ChemFormula** (`pages/ChemFormula/index.tsx`) — `Heading` ("Парсер формул"), two `Input`s (formula text + percent number), then `<table>`s (atomic mass table, NPK oxide table, NPK table). No labels on the inputs.
- **DensityCalculator** (`pages/DensityCalculator/index.tsx`) — `Heading` ("Калькулятор плотности"), `Label`+`Dropdown` (Salt/Соль), `Label`+`Input` (Концентрация, g/l), `Label`+`Input` (Плотность, g/ml). Uses `<Label>` wrapper from `@fertilizer/ui`.
- **Example** (`pages/Example/index.tsx`) — `Dropdown<ItemType>` + `<p>` paragraphs. Demo-ish page (lorem text).
- **Help** (`pages/Help/Help.tsx`) — renders markdown (`ReactMarkdown` + rehype-raw/sanitize) of `src/docs/**/*.md` pages per `slug` param; `LazyPromise` wrapper.
- **NotFound** (`pages/NotFound/index.tsx`) — single `<h1>Not found</h1>`.

### Navigation (TopLevel)

- `TabMenu` (`components/navigation/TabMenu.tsx`) wraps `Sidebar` from `@fertilizer/ui`, contains `RoutedTabs` (react-router-tabs) with `NavTab` links: "Калькулятор" (/), "Удобрения" (/fertilizers), "Парсер формул" (/formula/), "Плотность" (/density/), "Справка" (Help submenu), plus `ColorModeToggle`.
- `ColorModeToggle` (`components/ColorModeToggle.tsx`) — an `Icon` (a `<div>`) with `onClick` toggling dark/light mode. No role/label — a clickable div.

---

## 2. Interactive UI components (a11y-relevant)

### `packages/icons`

- **`Icon`** (`src/Icon.tsx`) — `forwardRef` rendering a `<div {...extraProps}>` wrapping a single SVG. Spreads all HTML `div` props (so `className`, `onClick`, `aria-*`, `style` all pass through). The SVG itself (in `src/icons/*.tsx`, all 14) is hardcoded with `aria-hidden="true" focusable="false"`. **No role, no aria-label by default** — the wrapper `<div>` is a generic div; making it interactive (e.g. `onClick` in `ColorModeToggle`, dropdown chevron, sidebar open/close) is done by consumers attaching handlers. `name: IconName` picks the icon; `size`, `color` are its own props.
- **`IconButton`** (`src/IconButton.tsx`) — `forwardRef` wrapping `@fertilizer/ui` `Button` (a native `<button type="button">`). Renders `<IconComponent …/>` + `children`. `children` (visible text) is the label source. **No aria-label of its own** — accessible name must come from `children` text or be added by the caller. `name` picks the icon. Many usages have NO children text (icon-only) → currently no accessible name.
- Icon registry: `src/registry.ts` maps name → component; 14 icons: `plus, close, edit, trash, import, export, restart, save, tune, menu, broom, chevronDown (name "chevron-down"), sun, moon`.

### `packages/ui` (all `main`/`exports` → `./src/index.ts`, source package, no build)

- **`Button`** (`button.tsx`) — native `<button>` + `buttonClass`. Passes through all button HTML props (incl. `type`, `aria-*`, `title`). Accessible name from children text. No default label.
- **`Input`** (`input.tsx`) — native `<input>` + `inputClass`. Passes through input props. **No label, no aria-label, no `id`/`htmlFor` by default.**
- **`NumberInput`** (`number-input.tsx`) — wrapper `<div>` with up/down spinner `<button>`s + a native `<input>`. **Already has `aria-label="увеличить"` (up) and `aria-label="уменьшить"` (down)** on the spinner buttons. The `<input>` gets `lang="en-US"`, no label/aria-label. This is the ONLY existing use of `aria-label` in packages/ui.
- **`Modal`** (`modal.tsx`) — renders via `ReactDOM.createPortal` into `#modal-root` (created on demand, appended to `document.body`). Renders `<div class=modalOverlayClass>` → `<div class=modalCardClass>` with `<h2>` title + a close control. **No `role="dialog"`, no `aria-modal`, no `aria-label`/`aria-labelledby`, no `aria-describedby`, no focus trap, no focus restore.** The close control is an `Icon` (a `<div>`) with `onClick={close}` — **a clickable div, not a button**. Uses `react-helmet` to set `body { overflow: hidden }` while open. Open/close state is `closed` (boolean) via `useState` + `useEffect` sync from `opened` prop.
- **`Dropdown`** (`dropdown.tsx`) — custom combobox. The trigger is a native `<input type="text">` (value shows selected item). **No `aria-label`, no `role="combobox"`, no `aria-expanded`, no `aria-controls`/`aria-activedescendant`.** The chevron is an `Icon` (`<div>` with `onClick` toggle) — clickable div. The open list is `<div role="listbox">` containing per-item `<div role="option" tabIndex={disabled?-1:0}>` (keyboard Enter/Space handled via `onKeyDown`). `DropdownItem` is a `<div role="option">`. Note the comment: options may contain interactive content (e.g. a remove `<button>`) because `<button>`-in-`<button>` is invalid. Outside `mousedown` closes the list.
- **`Sidebar`** (`sidebar.tsx`) — portal into `#sidebar-root` (created on demand). Open/close state like Modal. Overlay is a `<div tabIndex={-1} onClick={close} onKeyDown={…}>` (biome-ignore `noStaticElementInteractions` — deliberately a clickable surface, not a control). Docked vs undocked by window width (`useWindowSize`; docked when `props.docked` or width>1650; initial docked when width>1024). Header row: if undocked, an `Icon name="close"` (clickable div) + `<h2>` title. **No `role="dialog"`/`aria-modal`/`aria-label`, no focus management.**
- **`Label`** (`label.tsx`) — native `<label>` + `labelClass`. Pattern: control passed as **children** (implicit association). Has `biome-ignore lint/a11y/noLabelWithoutControl`. No `htmlFor` (implicit).
- **`Checkbox`** / **`Radio`** — native `<input type="checkbox"|"radio">`, pass-through. **No label/aria-label.**
- **`Card`** (`card.tsx`) — `<div>` + `cardClass`. No role.
- **`Text`** / **`Heading`** (`text.tsx`) — `Text` = `<div>`; `Heading` = `<h2>` by default (`as` prop: h1–h6). No a11y attributes.
- **`ForkMeOnGitHub`** (`fork-me.tsx`) — `<span>` wrapping an `<a target="_blank" rel="noopener noreferrer" href=github>` with visible text "Fork me on GitHub". Accessible name = link text. No `aria-label`.
- **`tab-menu.tsx` — DOES NOT EXIST in `packages/ui`.** There is no tab-menu file anywhere in the repo (glob `**/tab-menu.tsx` → none). The "tab menu" is the app-level `components/navigation/TabMenu.tsx` (see §1) built on `react-router-tabs` `RoutedTabs`/`NavTab`.

### App-level form controls (`apps/web/src/components/ui/Form/`)

- **`Input`** (`Input.tsx`) — wraps `@fertilizer/ui` `Input`. `label` prop is used **only as a `placeholder`** (`placeholder={props.placeholder || label}`); the input itself gets no `aria-label`/`id`. `lang="en-US"`. Value from zustand via `useFormField(name)`.
- **`Checkbox`** (`Checkbox.tsx`) — `<Label>` wrapping `<UiCheckbox>` + `label` text (implicit label via children). `label` required prop.
- **`Radio`** (`Radio.tsx`) — similar pattern.
- These are driven by `FormProvider` (`store/form-context.tsx`) + `useFormField` dot-path fields (global zustand), no prop-drilling.

---

## 3. Existing a11y usage (summary, representative samples + rough totals)

Counts below are over source (non-test) `.ts`/`.tsx` in `apps/web/src`, `packages/ui/src`, `packages/icons/src`.

Totals by pattern: `aria-` ≈ 16, `role=` ≈ 3 (2 real + 1 in comment), `tabIndex` = 2, `htmlFor` = 3 real (+1 in a comment), `<label` = 4, `alt=` = 1, `aria-label` = 2.

**What already exists (the whole inventory):**

1. **All 14 SVG icons** (`packages/icons/src/icons/*.tsx`, e.g. `plus.tsx:6`, `close.tsx:6`) hardcode `aria-hidden="true" focusable="false"` on the `<svg>`. This is the bulk of the `aria-` count (14). The decorative SVG is hidden; accessible meaning is expected to come from a wrapping control.
2. **`NumberInput` spinner buttons** (`packages/ui/src/number-input.tsx:111,135`) — `aria-label="увеличить"` / `aria-label="уменьшить"`. The only `aria-label` in `packages/ui`, and the only place in the whole source tree.
3. **`Dropdown` list roles** (`packages/ui/src/dropdown.tsx:89,67`) — `role="listbox"` on the list container, `role="option"` + `tabIndex={disabled?-1:0}` on each item. Keyboard Enter/Space handled in `onKeyDown`.
4. **`Sidebar` overlay** (`packages/ui/src/sidebar.tsx:77`) — `tabIndex={-1}` on the click-to-close overlay div (biome-ignored `noStaticElementInteractions`).
5. **`Label` component** (`packages/ui/src/label.tsx:10`) — native `<label>` (implicit association, control as children; biome-ignored `noLabelWithoutControl`).
6. **Explicit `<label htmlFor>` in app element forms** (the ONLY `htmlFor`/`<label>` in `apps/web`):
   - `components/Calculator/FertilizerSelect/AddItemElementForm.tsx:30` — `<label htmlFor={"element-"+name}>` + `StyledInput id={"element-"+name}` (NPK element number inputs, `type="number"`).
   - `components/Calculator/FertilizerManager/AddItemElementForm.tsx:20` — `<label htmlFor={"npk-"+name}>` + `Input id={"npk-"+name}`.
   - `components/Calculator/FertilizerManager/AddEditNPKString.tsx:35` — an empty `<label htmlFor="npk-string"></label>` (biome-ignored, spacer only) + `StyledInput id="npk-string"`.
7. **`<img alt>`** — single occurrence: `apps/web/src/pages/App/index.tsx:9` (`alt="logo"`, legacy boilerplate page).

**What is absent (no occurrences anywhere in source):**
- No `role="dialog"`, `role="alertdialog"`, `role="combobox"`, `role="menu"`, `role="application"`, or any role beyond `listbox`/`option`.
- No `aria-modal`, `aria-expanded`, `aria-pressed`, `aria-current`, `aria-selected`, `aria-checked`, `aria-describedby`, `aria-labelledby`, `aria-activedescendant`, `aria-controls`, `aria-busy`, `aria-live`.
- No `aria-label` on any `IconButton`/`Icon`-based button, `Modal`, `Dropdown` trigger, `Input`, `Checkbox`, `Radio` (except the two `NumberInput` spinner buttons).
- No `title=`-based a11y either, though a few `title=` (tooltip) attributes exist (e.g. `ExportState.tsx:31`, `SelectedListItem.tsx:89`) — these are visual tooltips, not ARIA.
- The only `alt=` is the unused `App` page logo.

Net: a11y attributes are essentially absent from all interactive controls except the two `NumberInput` spinner buttons, the `Dropdown` list roles, and the three `<label htmlFor>` element forms.

---

## 4. Test infrastructure (Playwright)

### `playwright.config.ts` (repo root)

- `testDir: "./tests"` — a single dir; the smoke vs e2e split is by **subdirectory** (`tests/smoke/` vs `tests/e2e/`), not by separate configs.
- `workers: 1`, `fullyParallel: false`, `retries: 1`, `reporter: ["list"]`, `timeout: 30_000`, `expect.timeout: 10_000`.
- `use`: `baseURL: "http://localhost:3000"`, `trace: "retain-on-failure"`, `screenshot: "only-on-failure"`.
- `projects`: single `chromium` project (`...devices["Desktop Chrome"]`). No other browsers.
- `webServer`: `command: "pnpm start"`, `url: "http://localhost:3000"`, `reuseExistingServer: true`, `timeout: 120_000` — spins up the Vite dev server (root `pnpm start` → `apps/web` vite on :3000) automatically; reuses a running one.

### Layout & naming conventions

- `tests/helpers.ts` (shared, not a test) — exports `trackConsoleErrors(page)` (collects `console.error` + `pageerror`, filters known dev warnings, returns `() => string[]`) and `isKnownDevWarning`.
- `tests/e2e/shared.ts` — scenario helpers: `FERTILIZERS` (3 seed ids), `addFertilizers(page, ids)` (opens the first `input[type="text"]` dropdown by clicking its parent's `svg`, clicks each item's row `button`), `resultItem(page, id)` (`li` filtered by text).
- `tests/e2e/` files: `calculator.test.ts`, `navigation.test.ts`, `persistence.test.ts` (each a single `test(...)`; naming `<scenario>: <description>`).
- `tests/smoke/routes.test.ts` — table-driven loop over `routes: RouteCase[]` ({name,url,marker}), one `test(`smoke: ${route.name}`)` per route; marker is a unique text regex per page.
- **Navigation style in existing tests:**
  - Route URLs use **HashRouter** form: `page.goto("/#/")`, `"/#/fertilizers"`, `"/#/formula/NaCl"`, `"/#/density/NaCl/"`, `"/#/example"`, `"/#/help/how_to_use"`.
  - Locators are a mix: `page.getByRole("button", { name: "Calculate" })`, `page.getByRole("link", { name: tab })`, `page.getByText(...)` (with `.first()` to disambiguate duplicates), and fragile DOM locators for icon controls: `page.locator("div:has(> svg)").first()` (hamburger), `input.locator("xpath=..").locator("svg").click()` (dropdown chevron), `item.locator("xpath=ancestor::div[1]//button").click()`.
  - The fragile `div:has(> svg)` / `svg` clicks are exactly the icon-buttons the task wants to make addressable via aria-label.
- **Existing modal/overlay coverage:** `navigation.test.ts` exercises the **Sidebar** overlay (opens via hamburger `div:has(> svg)`, clicks `getByRole("link", …)`, re-opens before each step because clicking a link bubbles to the overlay and closes it). It comments that the open sidebar renders via portal into `#sidebar-root`. **No existing e2e/smoke test opens a `Modal`** (Recipe-tune modal, Result "Сохранить комплекс" modal, Mixer modal, FertilizerManager add/edit modals) — those open states are currently untested by Playwright. This matters because the spec requires axe scans with modals/dropdowns open.

### Run commands (root `package.json` scripts)

- `pnpm test:e2e` → `playwright test tests/e2e`
- `pnpm test:smoke` → `playwright test tests/smoke`
- These are **NOT part of `pnpm full-check`** (`test + lint + type + build`) and **NOT in CI** — per AGENTS.md they run locally/manually against the dev server. CI (`.github/workflows/blank.yml`) runs `pnpm install --frozen-lockfile` + `pnpm full-check` only.
- Co-located `*.test.tsx` (render-smoke in jsdom, e.g. `pages/*/` tests, `packages/ui/src/*.test.tsx`, `components/…/*.test.tsx`) ARE part of `pnpm test` (vitest), separate from Playwright.
---

## 5. Dependencies

### Present (confirmed in manifests + lockfile)

- **`@playwright/test`** — present. Root `package.json` `devDependencies`: `^1.62.1`; **resolved `1.62.1`** in `pnpm-lock.yaml`. Also duplicated in `apps/web/package.json` `devDependencies` (`^1.62.1`). The root copy is the one `playwright.config.ts` and `tests/` resolve (root has the config + `tests/` dir).
- **React** — `catalog: ^16.13.1` (`pnpm-workspace.yaml` catalog; `@types/react` `^16.9.0`). React 16 classic runtime.
- **TypeScript** — `7.0.2` (root + each package).
- **`@fertilizer/ui` / `@fertilizer/icons` / `@fertilizer/calculator`** — `workspace:*` source packages (`main`/`exports` → `./src/*.ts`; **no build step**; Vite bundles the TS source).
- **`@fertilizer/web`** (`apps/web`) — React PWA on Vite (`@vitejs/plugin-react`, classic JSX) + `vite-plugin-pwa` + `@vanilla-extract/vite-plugin` + tailwindcss v4 (`@tailwindcss/vite`).

### NOT present (must be added for the task)

- **`@axe-core/playwright`** — **absent** from root `package.json`, `apps/web/package.json`, and `pnpm-lock.yaml` (0 occurrences), and no `node_modules/@axe-core`. Adding it is required for `AxeBuilder`.
  - Natural home: **root `package.json` devDependencies**, next to `@playwright/test` — that is where `playwright.config.ts` and the `tests/` tree live and where `@playwright/test` is a root devDep. A test file at `tests/e2e/a11y.test.ts` doing `import { AxeBuilder } from "@axe-core/playwright"` resolves from the root `node_modules`. (It would also work added to `apps/web`, but the canonical location matching the existing `@playwright/test` root devDep is the root.)
  - Requires running `pnpm install` (workspace; `pnpm_config_store_dir=./.pnpm-cache/v11 pnpm install` per AGENTS.md) so it lands in the single lockfile; `@axe-core/playwright` transitively brings `axe-core`. No build step involved — Playwright compiles test TS via its own esbuild at run time.

### `pnpm test` (vitest) already covers

`packages/calculator` (node), `packages/icons` (jsdom), `packages/ui` (jsdom), `apps/web` (jsdom, `setupFiles: src/setupTests.ts`). These are separate from the Playwright suites.

---

## 6. Relevant constraints / fixed facts (as found in project files)

- **React 16** (catalog `^16.13.1`), classic JSX runtime (`biome.json` `jsxRuntime: "reactClassic"`; `@vitejs/plugin-react`).
- **TypeScript 7** strict (`typescript: 7.0.2`; per AGENTS.md strict). `pnpm type` runs `tsc -p packages/calculator && tsc -p packages/icons && tsc -p packages/ui && tsc -p apps/web`.
  - **No root `tsconfig.json`** → `playwright.config.ts` and `tests/` are **not** type-checked by `pnpm type`; Playwright transpiles its own test files at run time.
- **Biome lint** (`biome.json`): preset `recommended` + `linter.rules.a11y.recommended: true`, `a11y.useButtonType: "error"`, `a11y.useAltText: "error"`. `pnpm lint` = `biome check apps packages --diagnostic-level=error` → **only `apps/` and `packages/` are linted; `tests/` and root `playwright.config.ts` are out of lint scope.** Existing `biome-ignore lint/a11y/…` comments mark deliberate exceptions (dropdown role/option comment, sidebar overlay interaction, Label without control, AddEditNPKString empty label). Adding `aria-label` to icon buttons in `apps/web`/`packages/ui` will be linted by Biome.
- **pnpm workspace**: `packages: ['apps/*', 'packages/*']`; single lockfile; React pinned in `catalog`; `packageManager: pnpm@11.22.0`; Node ≥ 24.
- **Source packages** `packages/ui`, `packages/icons` (and `calculator`) have **no build** — edits to `packages/ui/src/*.tsx` are picked up directly by the app's Vite and by each package's `tsc`/`vitest`; no separate build/redeploy step.
- **Dev server**: `pnpm start` (root) → `apps/web` Vite on **http://localhost:3000**; Playwright `webServer` auto-starts/reuses it (`reuseExistingServer: true`).
- **Playwright suites NOT in `full-check`/CI** — local/manual only (AGENTS.md; CI workflow runs `install --frozen-lockfile` + `full-check`). Husky pre-commit runs `pnpm full-check` (test+lint+type+build), **not** the Playwright suites.
- Comment language in project files is **Russian**; preserve that style for new comments.

---

## 7. Anything else materially relevant

- **How modals/overlays mount (critical for axe-on-open-state tests):**
  - `Modal` → `ReactDOM.createPortal` into `#modal-root` (created lazily, appended to `document.body`). `Sidebar` → portal into `#sidebar-root`. Both use `react-helmet` to inject `body { overflow: hidden }` while open. Open/close is a boolean (`closed` state synced from an `opened` prop via `useEffect`); the `button`/`container` props are **render callbacks** `({ modal }) => ReactNode` where `modal.open()`/`modal.close()` drive state.
  - To open a modal in a test you click its trigger (the `button` callback's rendered control) — there is no imperative open API exposed to the DOM. E.g. Recipe-tune modal trigger is `IconButton name="tune"`; Result "Сохранить комплекс" is `IconButton name="save" backgroundColor="primary"` (children text "Сохранить комплекс"); Mixer "Отправить на миксер" similar; FertilizerManager add = `IconButton name="plus"`, edit = `IconButton name="edit"`, remove = `IconButton name="trash"` (icon-only, no text → **no accessible name today**).
  - **No focus management exists anywhere**: no `autoFocus`, no focus trap, no focus restore, no `aria-modal`, no `aria-activedescendant`, no `inert`. The only `.focus()` in `packages/ui` is `NumberInput` re-focusing its input when a spinner button is clicked. (Implication: axe will also flag things like focus not being trapped / dialog labeling — those violations exist in the *current* code and the a11y work is expected to address them.)
- **Clickable non-button controls (axe `role`/`name`/`click-events`-type violations today):**
  - `Icon` is a `<div>`; used with `onClick` in: `ColorModeToggle` (moon/sun), `Dropdown` chevron, `Sidebar` menu (open) + close icons, `Modal` close icon. None have `role`/`tabIndex`/`aria-label`.
  - `Dropdown` trigger is a native `<input type="text">` (editable text showing the value) — not a real combobox; no `role`/`aria-expanded`.
- **e2e already relies on accessible names** (`getByRole("button", {name:"Calculate"})`, `getByRole("link", {name})`) — so adding `aria-label` to icon buttons both fixes axe and makes those/`playwright-cli` locators stable. The currently fragile DOM locators (`div:has(> svg)`, `xpath=.. svg`, `ancestor::div[1]//button`) in `navigation.test.ts`/`shared.ts` are the concrete "hard to navigate" pain the task cites.
- **`Calculate` button** accessible name comes from its text child "Calculate" (a `<Button type="submit">` inside `components/Calculator/index.tsx` `<form onSubmit>`). Submit is intercepted (`e.preventDefault()`) and calls `useStore.getState().calculate()`.
- **State**: zustand store (`apps/web/src/store/`), persisted to `localStorage` key `appState` (legacy `reduxState` auto-migrated) — the `persistence.test.ts` reload scenario depends on this.
- **`react-helmet`** is used (React 16 compat) for the body-scroll-lock style; note helmet + React 16 classic.
- **`react-sortablejs`** (`FertilizerManager/List.tsx`) renders a `<ReactSortable>` list of fertilizer `Item`s — sortable drag handles add non-semantic DOM around each item (affects DOM structure a test sees, and potential `aria` on draggable elements).
- **Version footer** in `Root.tsx` renders `__VERSION__-…` build constants (injected via Vite `define` from git) — irrelevant to a11y but part of the always-present shell.

---

## Summary (what this research covers)

1. **Pages/routes (§1):** 7 pages registered via `@loadable/component` in `apps/web/src/pages/index.ts` + HashRouter routes in `Root.tsx`; per-page top-level component trees; `Calculator` page has its own nested `<Router>` (`/` + `/fertilizers`); `App` page is legacy/unused-by-routes.
2. **Interactive components (§2):** `Icon` (a `<div>` wrapper, `aria-hidden` SVG, no label), `IconButton` (native `<button>`, label only via `children` text; icon-only usages have no name) — all 14 icon names; `packages/ui` `Button`/`Input`/`NumberInput`/`Modal`/`Dropdown`/`Sidebar`/`Label`/`Checkbox`/`Radio`/`Card`/`Text`/`ForkMeOnGitHub` with current role/aria state and where labels come from; **`tab-menu.tsx` does not exist** (the tab menu is the app-level `TabMenu.tsx`). App-level form `Input`/`Checkbox`/`Radio` (`label` prop → `placeholder` only for `Input`).
3. **Existing a11y (§3):** full inventory — only the two `NumberInput` spinner `aria-label`s, `Dropdown` `role="listbox"/"option"`, `Sidebar` overlay `tabIndex=-1`, `Label` component, 3 `<label htmlFor>` element forms, and 14 `aria-hidden` SVGs; everything else (dialog/combobox roles, `aria-modal`/`expanded`/`pressed`, icon-button `aria-label`) is **absent**.
4. **Test infra (§4):** single `playwright.config.ts` (testDir `./tests`, smoke vs e2e by subdir), `webServer` = `pnpm start` on :3000 (`reuseExistingServer`), one chromium project, `baseURL http://localhost:3000`; `tests/helpers.ts` (`trackConsoleErrors`), `tests/e2e/shared.ts` helpers, naming conventions, HashRouter URL style, existing locators (role-based + fragile `div:has(> svg)`/xpath DOM); only `navigation.test.ts` touches an overlay (Sidebar) — **no test opens a `Modal`**; run via `pnpm test:e2e` / `pnpm test:smoke`, NOT in `full-check`/CI.
5. **Dependencies (§5):** `@playwright/test` present (`1.62.1`, root + apps/web); **`@axe-core/playwright` absent** (add to root devDeps next to `@playwright/test`, then `pnpm install`); React 16 catalog, TS 7, source packages no-build.
6. **Constraints (§6):** React 16 classic, TS 7 strict, Biome (a11y recommended + `useButtonType`/`useAltText` errors; lints only `apps/`+`packages/`, not `tests/`/root config), pnpm workspace source packages, dev server :3000, e2e/smoke local-only (not CI/full-check), Russian comments.
7. **Other (§7):** how modals/sidebars mount (portals to `#modal-root`/`#sidebar-root`, `react-helmet` body scroll-lock, render-callback triggers — must click trigger to open), **no focus management anywhere**, clickable non-button `Icon` divs (ColorModeToggle, dropdown chevron, sidebar/menu/close, modal close), existing e2e already relies on accessible names (`getByRole`), fragile DOM locators the task wants fixed, `Calculate` button name source, zustand persistence, `react-sortablejs` list, version footer.
