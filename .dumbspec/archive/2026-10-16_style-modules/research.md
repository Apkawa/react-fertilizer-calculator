# Research: 2026-10-16_style-modules

Context collection only. All paths relative to repo root.

## 1. CSS inventory (15 source files + 1 storybook tooling file)

All files are imported as side-effect (`import "./style.css"`), except `theme.css` and `app.css` which use CSS `@import`.

### packages/ui (11 files)

| File | Selectors | @layer | Imported by |
|---|---|---|---|
| `src/Button/style.css` | `.ui-button` | `@layer components` | `Button/index.tsx` |
| `src/Card/style.css` | `.ui-card` | `@layer components` | `Card/index.tsx` |
| `src/Dropdown/style.css` | `.ui-dropdown-chevron`, `.ui-dropdown-item`, `.ui-dropdown-item--disabled`, `.ui-dropdown-list` (+ :hover, ::before) | `@layer components` | `Dropdown/index.tsx` |
| `src/ForkMeOnGitHub/style.css` | `.ui-fork-me`, `.ui-fork-me-link` (+ :hover, ::before, ::after) | `@layer components` | `ForkMeOnGitHub/index.tsx` |
| `src/Input/style.css` | `.ui-input`, spin-button pseudos | `@layer components` | `Input/index.tsx` |
| `src/Label/style.css` | `.ui-label` | `@layer components` | `Label/index.tsx` |
| `src/Modal/style.css` | `.ui-modal-overlay`, `.ui-modal-card` (+ media) | `@layer components` | `Modal/index.tsx` |
| `src/NumberInput/style.css` | `.ui-number-input-wrapper`, `.ui-spinner-button` | `@layer components` | `NumberInput/index.tsx` |
| `src/Sidebar/style.css` | `.ui-sidebar-overlay`, `.ui-sidebar-overlay-undocked`, `.ui-sidebar-card` | `@layer components` | `Sidebar/index.tsx` |
| `src/Text/style.css` | `.ui-heading` | `@layer components` | `Text/index.tsx` |
| `src/theme.css` | `:root`, `:root[data-theme="dark"]`, `body` | none | `apps/web/src/styles/app.css` via package export `./theme.css`; `.storybook/style.css` |

`Checkbox` and `Radio` have NO style.css — plain native `<input>` + consumer className.

### apps/web (4 files)

| File | Selectors | @layer | Imported by |
|---|---|---|---|
| `src/styles/app.css` | 0 rules: `@import "tailwindcss"`, `@import "@fertilizer/ui/theme.css"`, `@source "../../../../packages/ui/src"` | (tailwind defines layers) | `src/index.tsx` side-effect, BEFORE `Root` (layer-order comment) |
| `src/components/navigation/style.css` | `.nav-tab`, `:hover`, `html[data-theme="dark"] .nav-tab:hover`, `.nav-tab.active`, `.react-router-tabs ul`, `ul > li a` + `@import` Google Fonts Roboto | none | `navigation/TabMenu.tsx` |
| `src/pages/App/App.css` | `.App`, `.App-logo`, `.App-header`, `.App-link`, `@keyframes` | none | `pages/App/index.tsx` |
| `src/pages/Help/style.css` | `.help-content ul/ol/a` | none | `pages/Help/Help.tsx` |

### packages/icons

No CSS files. `IconButton.tsx` composes `Button` + Tailwind utilities only.

## 2. Cross-component coupling (key migration hazard)

- 18 distinct `ui-*` classes, all defined inside `packages/ui`.
- **Dropdown** → consumes `ui-input` (hardcoded on trigger `<input>`, `Dropdown/index.tsx:201`).
- **NumberInput** → consumes `ui-input` (inner `<input>`).
- **Modal** → consumes `ui-heading` (on `<h2>`).
- **Sidebar** → consumes `ui-heading` (on `<h2>`).
- Modal, Sidebar, Dropdown embed **Tailwind utilities** in markup; they resolve because `app.css` has `@source "../../../../packages/ui/src"`.
- Modal & Sidebar render via `ReactDOM.createPortal` to `#modal-root` / `#sidebar-root` and inject `<style>body{overflow:hidden}</style>` via react-helmet (global side channel; module CSS still applies to portal elements because class attrs carry hashed names).

## 3. Cross-package `ui-*` usage in apps/web / other packages

**Zero.** `ui-*` occurs only inside `packages/ui/src`. `apps/web` references app-local globals: `.App*` (pages/App), `.nav-tab`/`.react-router-tabs` (navigation), `.help-content` (Help).

## 4. Theme / global / Tailwind wiring

- `apps/web/src/index.tsx:9` imports `./styles/app.css` BEFORE `Root` — required so Tailwind v4 layer order (`theme, base, components, utilities`) lands first and preflight (base) doesn't override `@layer components` atoms.
- `theme.css`: `:root` variables, `:root[data-theme="dark"]`, `body` (deliberately unlayered, above preflight). Data-theme set on `<html>` by `use-color-mode.ts`.
- Tailwind v4 via `@import "tailwindcss"` + `@tailwindcss/vite` plugin (`apps/web/vite.config.ts`). `@layer components` is used by UI css, not by Tailwind itself.
- Storybook: `packages/ui/.storybook/style.css` imports tailwind + theme itself.

## 5. Test / story / e2e coupling

- **No test asserts on CSS class names.** jsdom tests select by tag/text; browser tests use ARIA snapshots; stories have no classNames.
- Single `data-testid` in repo is in a test harness (`use-color-mode.test.tsx`), not on shipped components.
- `apps/web/.../SelectedListItem.test.tsx` asserts tailwind class `text-black` (app-local, unaffected).
- Playwright e2e/smoke: role/text/aria locators only; one id locator `#sidebar-root > div` (`tests/e2e/a11y.test.ts:116`) — portal root id, not a class.
- **Migration is safe w.r.t. tests.**

## 6. `cx` merging

`packages/ui/src/cx.ts` — flat join, strings. Pattern: `cx("ui-button", className)` (static first, consumer appends only). `Modal`/`Sidebar`/`ForkMeOnGitHub` hardcode classes (no `cx`). `Text` ignores className. `IconButton`: `cx(legacy, className)`.

## 7. Existing modules / :global

- **No `.module.css` files, no `:global` usage anywhere.**
- `packages/ui/src/global.d.ts` declares `module "*.css"` (`export default css`) for tsc; Vitest stubs CSS; Vite bundles.

## Consequences for the migration (facts-based)

1. Zero external `ui-*` consumers → all 18 classes can become module-scoped; no public-API breakage.
2. Cross-component deps resolved by importing the needed module where consumed (Vite supports importing one `.module.css` from another component's tsx): `Dropdown`/`NumberInput` → `Input/style.module.css`; `Modal`/`Sidebar` → `Text/style.module.css`.
3. Removing `@layer components` from module files eliminates the fragile import-order dependency in `index.tsx` (unlayered module CSS always beats Tailwind preflight in the `base` layer).
4. Remaining global CSS after migration: `theme.css` (variables/theme), `app.css` (tailwind import + `@source`), Tailwind itself — legitimate globals.
5. `global.d.ts` must gain `declare module "*.module.css"`.
6. `html[data-theme="dark"] .nav-tab:hover` in navigation css → `:global(html)[data-theme="dark"] ...` inside the module.
7. Google Fonts `@import` in navigation css must stay first line (or move to `app.css`).
