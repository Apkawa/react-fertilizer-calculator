# 2026-10-16_style-modules: implementation plan (style modules)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

Class-naming convention (module-scoped, camelCase, no `ui-` prefix):
`ui-button`→`button`, `ui-card`→`card`, `ui-dropdown-chevron`→`chevron`, `ui-dropdown-item`→`item`, `ui-dropdown-item--disabled`→`itemDisabled`, `ui-dropdown-list`→`list`, `ui-fork-me`→`forkMe`, `ui-fork-me-link`→`forkMeLink`, `ui-input`→`input`, `ui-label`→`label`, `ui-modal-overlay`→`modalOverlay`, `ui-modal-card`→`modalCard`, `ui-number-input-wrapper`→`wrapper`, `ui-spinner-button`→`spinnerButton`, `ui-sidebar-overlay`→`sidebarOverlay`, `ui-sidebar-overlay-undocked`→`sidebarOverlayUndocked`, `ui-sidebar-card`→`sidebarCard`, `ui-heading`→`heading`, `nav-tab`→`navTab`, `react-router-tabs`→`routerTabs`, `App`→`app`, `App-logo`→`appLogo`, `App-header`→`appHeader`, `App-link`→`appLink`, `help-content`→`helpContent`.

---

## Stage 0 — Research + spec + plan
- [x] Draft captured
- [x] Research (CSS inventory, coupling, test safety)
- [x] Spec v1
- [x] Plan written

**Criterion:** `draft.md`, `research.md`, `spec.md`, `plan.md` exist in `.dumbspec/current/2026-10-16_style-modules/`
**Commit:** `docs(dumbspec): add style-modules spec and plan`

## Stage 1 — `packages/ui` → CSS modules
- [x] `Input` → `style.module.css` (`input`), index.tsx, remove `@layer`
- [x] `Text` → `style.module.css` (`heading`), index.tsx, remove `@layer`
- [x] `Button` → module (`button`), index.tsx
- [x] `Card` → module (`card`), index.tsx
- [x] `Label` → module (`label`), index.tsx
- [x] `Dropdown` → module (`chevron`, `item`, `itemDisabled`, `list`), import `../Input/style.module.css` for the trigger input
- [x] `NumberInput` → module (`wrapper`, `spinnerButton`), import `../Input/style.module.css`
- [x] `Modal` → module (`modalOverlay`, `modalCard`), import `../Text/style.module.css` for the heading
- [x] `Sidebar` → module (`sidebarOverlay`, `sidebarOverlayUndocked`, `sidebarCard`), import `../Text/style.module.css`
- [x] `ForkMeOnGitHub` → module (`forkMe`, `forkMeLink`), index.tsx
- [x] `global.d.ts`: declare CSS imports as `string & Record<string, string>` (module usage)
- [x] `apps/web/src/index.tsx`: update/adjust the import-order comment (module CSS is unlayered, always above Tailwind preflight)
- [x] Verify: `pnpm test && pnpm type && pnpm build` pass; no `ui-*` classes remain in `packages/ui`

**Criterion:** `packages/ui` has 10 `*.module.css`, zero `ui-*` class names, tests/type/build green
**Commit:** `refactor(ui): migrate component styles to CSS modules`

## Stage 2 — `apps/web` → CSS modules
- [x] `components/navigation/style.css` → `style.module.css` (`navTab`, `routerTabs`), `:global(html)[data-theme="dark"]` for the dark hover rule, keep `@import` first (note: `.navTab*` rules were dead code before migration — TabMenu passes `tab-link` — renamed, kept)
- [x] `pages/App/App.css` → `App.module.css` (`app`, `appLogo`, `appHeader`, `appLink`)
- [x] `pages/Help/style.css` → `style.module.css` (`helpContent`)
- [x] Verify: `pnpm test && pnpm type && pnpm build` pass

**Criterion:** `apps/web` component/page styles are modules; only `app.css` + `theme.css` + Tailwind remain global
**Commit:** `refactor(web): migrate app styles to CSS modules`

## Stage 3 — Final verification
- [x] `pnpm full-check` green
- [x] Audit: grep for global class definitions outside `app.css`/`theme.css`/`node_modules` — only Tailwind remains (plus 14 `*.module.css`, zero `ui-*` names, hashed module classes in the built bundle)
- [x] Update plan checkboxes

**Criterion:** `full-check` passes; global CSS surface = Tailwind + `theme.css` + `app.css` only
**Commit:** N/A
