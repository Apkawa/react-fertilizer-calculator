# Research — v18-ui

Findings from research into feasibility, constraints, and options. (Internal, English.)

## Current state (from repo)

### Toolchain / lock state
- pnpm workspace: `apps/*` + `packages/*`, single lockfile; node >=24, pnpm 11.22.0 (packageManager).
- TypeScript **7.0.2** (root + apps/web), Biome 2.5.10, **Vite 8.2.2**, vitest 4.1.11, jsdom 30.0.1, `@vitejs/plugin-react` (vite.config: `react({ jsxRuntime: "classic" })` — classic JSX runtime, `import React` everywhere).
- `apps/web/vite.config.ts`: alias `@` → src, define build consts, plugins: react (classic), viteStaticCopy (docs images), VitePWA (generateSW, registerType auto). No CSS plugin config today (plain CSS files, e.g. `components/ui/TabMenu/style.css` — plain css, no css-in-js in it).
- A legacy `yarn.lock` still exists at repo root (from pre-pnpm era); `styled-icons` (@styled-icons/*) appears **only** there — it is a transitive dep of theme-ui/rebass, no direct code import anywhere. So "styled-icons" = legacy lockfile noise that disappears with theme-ui/rebass (and the dead yarn.lock should be removed).

### Installed versions (apps/web)
| package | installed |
| --- | --- |
| react / react-dom | 16.13.1 |
| react-redux | 7.2.1 |
| react-router-dom | 5.2.0 |
| react-router-tabs | 1.3.2 |
| redux / redux-form / redux-saga | 4.0.5 / 8.3.6 / 1.1.3 |
| @loadable/component | 5.13.1 |
| styled-components | 5.2.0 |
| rebass / @rebass/forms / @rebass/preset | 4.0.7 / 4.0.6 / 4.0.5 |
| theme-ui / @theme-ui/presets | 0.3.1 / 0.3.0 |
| @emotion/styled | 10.0.27 (transitive of theme-ui) |
| react-helmet | 6.1.0 |
| react-markdown | 8.0.7 (ESM) |
| react-focus-lock | 2.5.0 |
| react-sortablejs / sortablejs | 6.0.0 / 1.12.0 |
| @testing-library/react / user-event / jest-dom | 12.1.5 / ^7.1.2 / 7.0.1 |
| @types/react, @types/react-dom | 16.9.x |

### Theme
- `apps/web/src/themes/index.ts`: `defaultTheme` = `polaris` preset from `@theme-ui/presets` + custom colors (NO3/NH4/P/K/Ca/Mg/S, modes.dark.text), `card` ({boxShadow:'small', p:2}), `styles.button` (color background), custom shadows. There is a stray `console.log(defaultTheme)` in it (dev leftover).
- Theme wired via theme-ui `ThemeProvider` in `Root.tsx`, `test-utils/render.tsx`, and `packages/icons/src/test-utils/render.tsx`.
- Color mode: `components/ColorModeToggle.tsx` uses theme-ui `useColorMode` (to verify: storage key, dark/light handling).

### CSS-in-JS usage map (apps/web/src + packages)
- **rebass** (Box, Flex, Text, Button, Card, Heading): ~45 files — Root.tsx, pages (Example, Help, DensityCalculator, ChemFormula), almost all `components/Calculator/**`, ui components (Modal, Sidebar, TabMenu, Dropdown, RebassWidgets).
- **@rebass/forms** (Input, Label, Checkbox, Radio): ui/ReduxForm/**, ui/Dropdown/Dropdown.tsx, ui/RebassWidgets/**, pages (DensityCalculator, ChemFormula), Calculator Options (Solution/Dilution/ToppingUp/RecipeTuneForm/AddEditNPKString).
- **theme-ui**: ThemeProvider (Root, test-utils), useColorMode (ColorModeToggle), types (themes/types.d.ts re-exports `Theme`).
- **styled-components** (direct `styled`/`css` imports — a small, bounded set):
  - `ui/ForkMeOnGitHub.tsx`
  - `ui/RebassWidgets/Number.tsx` (StyledInput, StyledSpinnerButton) + `ui/RebassWidgets/index.ts` (Input)
  - `ui/Dropdown/DropdownItem.tsx` (styled + `css` helper)
  - `components/Calculator/Result/Result.tsx`
- **packages/icons**: `Icon.tsx` wraps SVG in rebass `Box`, `IconButton.tsx` uses rebass `Button` — so icons depend on rebass/theme-ui today (test-utils use theme-ui ThemeProvider).

### ui components inventory (`apps/web/src/components/ui/`)
- `RebassWidgets/` — Number input (spinners), Input (styled rebass Input).
- `Dropdown/` — Dropdown (uses @rebass/forms Input + rebass Box/Flex), DropdownList (Box/Card/Flex), DropdownItem (styled-components), context, types.
- `ReduxForm/` — Checkbox, Radio, Input wrappers around @rebass/forms + redux-form integration (types, normalizers, validators). **Excluded from migration per draft** (redux-form removal is a separate task).
- `Modal/` — Modal + ModalContainer (Card/Flex).
- `Sidebar/` — Sidebar + SidebarContainer (Card/Flex).
- `TabMenu/` — tab menu (Flex) + already has a plain `style.css`.
- `csv/ImportCSV.tsx` — csv import widget (to inspect).
- `ForkMeOnGitHub.tsx` — styled-components.
- `styled.ts` — `mobileStyles()` helper returning an `sx` media-query object (rebass `SxStyleProp`).
- Each dir has colocated `*.test.tsx` smoke tests (render-smoke via `test-utils/render.tsx`).

### App structure
- Entry `index.tsx`: `ReactDOM.render(<StrictMode><Root/></StrictMode>)` — **ReactDOM.render is removed in React 19, deprecated in 18** → must switch to `createRoot`.
- `Root.tsx`: react-redux Provider → theme-ui ThemeProvider → HashRouter; routes: /formula, /density, /example, /help, / (Calculator), * (NotFound). Pages lazy via `@/pages` (loadable).
- `test-utils/render.tsx`: render helper wrapping Provider + ThemeProvider + MemoryRouter — used by all component smoke tests.

## Open feasibility questions (to research)
- [ ] react 18.x latest (18.2.0 vs 18.3.1) — target "18.2 (LTS)".
- [ ] which "related components" must move: @types/react(-dom), @testing-library/react (12→14), react-redux (7→8/9), react-router-dom (5.2→5.3.4), @loadable/component, react-helmet (used?), react-markdown, react-focus-lock, react-sortablejs, react-router-tabs — peer-dep matrix for React 18.
- [ ] redux-form 8.3.6 ↔ react-redux coupling: does it bundle/peer a different react-redux (context mismatch risk with app's react-redux 7→9)?
- [ ] vanilla-extract: latest version, Vite 8 compatibility of `@vanilla-extract/vite-plugin` (peer ranges), TS 7 in-repo impact (none expected — plugin compiles .css.ts itself).
- [ ] tailwindcss v4: `@tailwindcss/vite` peer vs Vite 8; CSS-first config; dark-variant strategy (class-based for color mode); theming via CSS vars.
- [ ] how to keep tests green per stage (jsdom + @testing-library/react 14; vitest 4 CSS handling for .css.ts imports in unit tests — vanilla-extract in test env?).
- [ ] packages/icons: keep separate package (rewrite Icon/IconButton in vanilla-extract, drop rebass) vs merge into packages/ui.
- [ ] react-helmet usage in code (dep present; usage not yet found).
- [ ] color mode persistence today (theme-ui localStorage key) → replacement strategy.

## Version matrix (from npm registry, live queries)

### React 18 line
- react/react-dom: latest 18.x = **18.3.1** (18.2.0 also exists; 18.3.1 = 18.2 + fixes, same LTS line). Latest overall is 19.2.8 — out of scope (user asked 18 LTS line).
- `index.tsx` uses `ReactDOM.render` → switch to `createRoot` (render is removed only in 19, but 18 wants createRoot).
- **@types/react 18.3.31**, **@types/react-dom 18.3.7**.
- **@testing-library/react**: use **14.3.1** (dist-tag release-14.x; peer react ^18, react-dom ^18). Latest overall 16.3.2 targets React 19. user-event → 14.x (14.6.6). @testing-library/jest-dom 7.0.1 stays (vitest import path already used).
- **react-redux**: 7.2.9 (latest 7.x; peer react ^16.8.3||^17||^18) or 8.1.3 (latest 8.x). **Constraint:** redux-form's peer limits react-redux to ^6||^7 (8.3.6) or ^6||^7||^8 (8.3.10). App uses only `Provider`, `useDispatch`, `useSelector`, `connect`, `DefaultRootState` — all stable across 7/8. **Decision candidate: keep 7.2.9** (types @types/react-redux 7.1.34 cover exactly v7; v8 has no current @types line) — lowest risk.
- **react-router-dom 5.3.4** (latest 5.x; peer react >=15) — works with React 18; API unchanged (HashRouter/Route/Switch/NavLink/useRouteMatch all still used).
- **@loadable/component 5.16.7** (peer react ^16.3||^17||^18||^19).
- **redux-form**: latest **8.3.10**, peer react **^16.4.2||^17||^18** (8.3.10 officially allows React 18), react-redux ^6||^7 (8.3.6) / ^6||^7||^8 (8.3.10), redux ^3.7||^4. Installed 8.3.6 → bump to 8.3.10 (patch-level; adds React 18 to peers). redux 4.0.5 stays (peer of both).
- react-helmet 6.1.0: peer react >=16.3.0 — install-clean on 18; runtime on React 18 widely used (Modal/Sidebar `<Helmet><style>` body-overflow trick). Keep; smoke-test.
- react-markdown 8.0.7: peer react >=16 — fine.
- react-focus-lock: installed 2.5.0 (peer ^16.8||^17 → pnpm peer warning on 18). It is actually a **transitive dep of theme-ui** (theme-ui Dialog focus locking) — no direct import in src/ (grep found none). Latest 2.x = 2.13.7. After theme-ui removal it disappears entirely; the direct dep in apps/web package.json is leftover → remove.
- react-sortablejs: installed 6.0.0 (peer react ^16.9.0 → warning). Used once: `ReactSortable` in Calculator/FertilizerManager/List. Latest 6.1.4. Bump to 6.1.4 (peer updated; runtime wrapper unchanged).
- react-router-tabs 1.3.2: peer react >=15, react-router-dom >=4.2.2 — fine on 18 + router 5.3.4.

### Styling stack
- **vanilla-extract**: core package is `@vanilla-extract/css` (latest **1.21.2**; the old `vanilla-extract` name is unpublished). Vite integration: **@vanilla-extract/vite-plugin 5.2.6**, peer **vite ^5||^6||^7||^8** → OK for repo's Vite 8.2.2 (there is even a dedicated `vite-8` dist-tag line; latest includes vite 8 peer). Plugin deps: @vanilla-extract/compiler ^0.7.2, @vanilla-extract/integration ^8.0.10 (managed by plugin).
- **tailwindcss**: latest **4.3.3** (v4 = CSS-first: `@import "tailwindcss"` + `@theme` in CSS, no config file by default), v3-lts = 3.4.19. **@tailwindcss/vite 4.3.3**, peer **vite ^5.2||^6||^7||^8** → OK for Vite 8.2.2.
- Both are Vite plugins → both coexist with existing plugins (react classic, static-copy, PWA); both automatically apply to vitest (vitest.config merges vite.config).
- In-repo TS is 7.0.2: vanilla-extract compiles `.css.ts` itself (its own compiler pass); app TS version irrelevant to that pass. `tsc` sees generated `.css.ts.d.ts`/`.css.ts.mjs`? — vanilla-extract emits `.css.ts.d.ts` next to source; with moduleResolution bundler + package exports this resolves (standard vanilla-extract + Vite setup).

### Test env implications
- vitest 4.1.11 + jsdom 30 stay. @testing-library/react 12.1.5 → 14.3.1 changes render internals (createRoot) — public API `render` same; `renderApp` helper stays.
- vanilla-extract `.css.ts` imports in component tests: plugin processes them under vitest (vite plugins run in vitest). Tailwind CSS in tests: vitest CSS handling stubs css imports by default — acceptable (visual smoke tests don't assert styles; e2e/smoke via playwright do).
- Playwright smoke/e2e suites run against dev server — unaffected by internal changes as long as UI behaves.

## Per-file CSS-in-JS technique map (apps/web/src/components/ui + Calculator + icons)

| File | Technique | Dynamic bits to preserve |
| --- | --- | --- |
| ui/ForkMeOnGitHub.tsx | styled-components (static block + media query) | none (pure static) |
| ui/RebassWidgets/Number.tsx | styled-components: StyledInput (webkit spinner CSS on rebass Input), StyledSpinnerButton (`width: ${p.width}px`) | width prop → CSS var / inline style |
| ui/RebassWidgets/index.ts | styled-components: Input = styled(RebassInput) spinner CSS | none |
| ui/Dropdown/Dropdown.tsx | **@emotion/styled**: IconDown (theme color `props.theme.colors.text`); @rebass/forms Input | theme color → token var |
| ui/Dropdown/DropdownItem.tsx | styled-components `styled(Box)` + `css` (disabled: pointer-events/opacity), `sx` pseudo `::before` hover | `disabled` prop → class variant |
| ui/Dropdown/DropdownList.tsx | rebass Box/Card/Flex + `sx={{zIndex:3}}` | none |
| ui/Modal/Modal.tsx | rebass Box/Flex/Heading + Icon | none |
| ui/Modal/ModalContainer.tsx | **@emotion/styled**(Flex) `top: ${() => window.pageYOffset}px` (fn-in-template — emotion-only), **react-helmet** `<style> body{overflow:hidden}</style>`, ReactDOM.createPortal, rebass Card | dynamic top → inline style; body lock → plain effect (no helmet) or keep helmet |
| ui/Sidebar/Sidebar.tsx | rebass Box/Flex/Heading + Icon + useWindowSize hook | none |
| ui/Sidebar/SidebarContainer.tsx | **@emotion/styled**(Flex) conditional `docked` (pageYOffset top, width, bg), react-helmet body overflow, createPortal, rebass Card | docked prop → 2 class variants; dynamic top → inline style |
| ui/TabMenu/TabMenu.tsx | rebass Flex + react-router-tabs (NavTab/RoutedTabs) + **plain style.css** (tab-link/active classes) | already CSS-file pattern |
| ui/ReduxForm/{Input,Checkbox,Radio}.tsx | @rebass/forms primitives + redux-form `Field` | keep redux-form wiring, swap primitives |
| ui/csv/ImportCSV.tsx | empty stub `<div/>` | trivial |
| ui/styled.ts | `mobileStyles()` → `sx` media object (used by Calculator/index.tsx) | → tailwind `md:`/media classes or utility |
| Calculator/Result/Result.tsx | styled-components `StyledList` (media width 75%) + rebass Card/Flex/Heading/Text/Button | static media → class |
| Calculator/Options/Recipe.tsx | exports `StyledBalanceCell` (to verify: rebass-based or styled) | check at implementation |
| packages/icons Icon.tsx / IconButton.tsx | rebass Box / Button (+ theme via context) | rewrite without rebass |
| Root.tsx / pages/* | rebass Box/Flex/Text/Button/Card/Heading + `sx` (28 `sx=` sites app-wide) | port to utilities |

- theme-ui pieces to replace: `ThemeProvider` (Root + 2 test utils), `useColorMode` (ColorModeToggle: modes "default"/"dark"), `Theme` type (themes/types.d.ts), `polaris` preset colors (themes/index.ts). theme-ui color-mode storage: legacy localStorage key (verify exact key in theme-ui dist during implementation; new impl should read old key once for migration or accept re-selecting mode).
- `sx` prop (rebass/theme-ui) usage: ~28 sites — each maps to tailwind arbitrary utilities or small local classes.
- `@emotion/styled` (theme-ui's emotion 10) and `styled-components` (5.2.0) are **different libraries both in use**; both removed after migration. `@emotion/styled` is a direct dep only because of these files (and theme-ui's internals).

## Constraint summary (hard facts)
1. redux-form stays (separate task) → it pins: react peer allows 18 only from 8.3.10; react-redux ≤8 (and ≤7 if we keep 8.3.6). Hence: **redux-form 8.3.10 + react-redux 7.2.9 + redux 4.0.5** is the consistent set on React 18.3.1.
2. react-router-tabs requires react-router-dom (any >=4.2.2) — keep HashRouter/route API (5.x).
3. Vite 8.2.2 in repo is supported by both @vanilla-extract/vite-plugin (peer ^8) and @tailwindcss/vite (peer ^8) — no plugin downgrades needed.
4. classic JSX runtime (`import React` everywhere, tsconfig jsx:"react") — keep; vanilla-extract/tailwind don't care.
5. Source-package pattern for packages/ui: `main`/`exports` → `./src/*.ts`, consumed by app Vite + app tsc (moduleResolution bundler); vitest in app picks up plugins from vite.config merge.
6. packages/icons currently depends on rebass+theme-ui (deps, not devDeps) — icons package must drop them (rewrite Icon/IconButton); until then rebass/theme-ui cannot be removed from the workspace.
7. Legacy `yarn.lock` at root is dead (project is pnpm) and is the only place `styled-icons` exists → delete file as part of cleanup (verify nothing references it: CI uses pnpm).

## Decisions (resolved at spec review)
- React pin: **stays 16.13.1** (REVISITED 2026-08-28 — the React 18 requirement was dropped from the draft; see "Scope change" below).
- packages/ui scope: **atoms + ui components** (primitives: Input, NumberInput, Button, Card, Text/Heading-like, Checkbox, Label, Radio + composites: Dropdown, Modal, Sidebar, TabMenu, ForkMeOnGitHub, ImportCSV).
- ui/ReduxForm: **rewritten NOW** onto native input/checkbox/radio + new styling; redux-form wiring (`Field`, `reduxForm`, sagas) untouched (separate removal task).
- packages/icons: **rewritten in place** (Icon/IconButton without rebass/theme-ui); package stays autonomous source package.
- react-helmet: **keep** (verify runtime in smoke tests; replace only if broken).
- Legacy `yarn.lock`: **removed** in this task (separate cleanup commit).

## Implementation notes (gathered)
- vanilla-extract output layering: put component styles into a cascade layer (e.g. `components`) below tailwind v4 `utilities`, so tailwind utilities can still override component classes. vanilla-extract supports `layer()` in its CSS API.
- tailwind v4 allows selective imports (`tailwindcss/theme.css`, `preflight.css`, `utilities.css`) — preflight (base reset) is the visual-change risk when mixed with still-rebass components; verify visually at the stage that enables it.
- Root `type` script is hardcoded (`tsc -p packages/calculator && tsc -p packages/icons && tsc -p apps/web`) — extend with `tsc -p packages/ui`.
- `packages/icons` vitest renders Icon/IconButton → once Icon uses `.css.ts`, icons package needs its own vitest config with the vanilla-extract plugin.
- theme-ui color-mode legacy localStorage key: exact key to be read from theme-ui dist during implementation; new `useColorMode` should read it once and write the new key (mode migration for existing users).
- `pages/App/` (App.css, logo.svg, index.tsx) — app shell page; check during Root/pages stage.
- `Calculator/index.tsx` uses `mobileStyles` from ui/styled.ts — the helper itself is rebass-typed; replace with tailwind responsive utilities.
- `StyledBalanceCell` (Calculator/Options/Recipe.tsx) — export used by Result; check technique at implementation (rebass-based or styled).

## Scope change (2026-08-28) — React 18 requirement dropped

User removed the React 18 migration requirement from `draft.md`. The app stays on **React 16.13.1** (pinned via `pnpm-workspace.yaml` `catalog: { react: ^16.13.1 }`, installed by both `apps/web` and `packages/icons` through `react: "catalog:"`), `@types/react`/`@types/react-dom` ^16.9.x, `ReactDOM.render` in `apps/web/src/index.tsx`. Consequences:

- The whole "React 18 line" version matrix above (react 18.3.1, @types 18.3.x, RTL 14.3.x, user-event 14.x, router 5.3.4, loadable 5.16.x, sortablejs 6.1.x, redux-form 8.3.10 + react-redux 7.2.9) is moot. **No dependency bumps** for this task.
- `@testing-library/react` stays **12.1.5** (works with React 16; RTL 14+ targets React 18 — out of scope). No `createRoot` migration; React 16 entry API unchanged.
- The redux-form peer constraint (old "Constraint summary #1") is moot, and in the background: the **redux-to-zustand task is completed** (commit `e6381f7`) — redux/redux-form/redux-saga are gone from the app. Form state = zustand store + `form-context` (`FormProvider` + `useFormField` dot-path fields, `@/store`). Only the legacy `reduxState` localStorage key survives (one-time migration in `store/persistence.ts`).
- `ui/ReduxForm/` (per the v1 spec/research) no longer exists: it is now `ui/Form/` — zustand-based `Input`/`Checkbox`/`Radio` (+`normalizers`) that wrap `RebassWidgets` primitives and read/write through `useFormField`. These are now **in scope** for migration (the old exclusion — "redux-form removal is a separate task" — is done). The controlled wrappers (name/normalize/useFormField) depend on the app store, so they stay in `apps/web/src` as glue over `packages/ui` presentational atoms.
- `apps/web/src/react18-types-compat.d.ts` (leftover from an earlier React-18 attempt; entire content commented out, header says "удалить в Stage 8") → delete in the cleanup stage.
- `react-helmet` 6.1.0, `react-router-dom` 5.2.0, `react-sortablejs` 6.0.0, `react-markdown` 8.0.7, `@loadable/component` 5.13.1: peers all fine on React 16 — unchanged.
- `packages/icons` still depends directly on `rebass` + `theme-ui` (`peerDependencies: react: catalog:`) — it must drop them (rewrite `Icon`/`IconButton` on vanilla-extract) before the workspace can remove rebass/theme-ui, as before.

### Revised hard constraints (supersede "Constraint summary")
1. React 16.13.1 is pinned by the pnpm catalog (`pnpm-workspace.yaml`) — **no react/react-dom bump**; `@types/react(-dom)` stay ^16.9.x; `@testing-library/react` stays 12.1.5.
2. Vite 8.2.2 in-repo is supported by both `@vanilla-extract/vite-plugin` (peer ^8) and `@tailwindcss/vite` (peer ^8) — no plugin downgrades.
3. `packages/icons` directly depends on rebass + theme-ui → the icons rewrite is a prerequisite for removing them from the workspace.
4. Classic JSX runtime (`import React` in every file, tsconfig `jsx: "react"`) is kept.
5. `pnpm full-check` (test + lint + type + build) must be green at every stage (TDD: red test → green implementation → refactor).
