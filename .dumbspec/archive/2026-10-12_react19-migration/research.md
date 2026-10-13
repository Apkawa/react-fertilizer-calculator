# Research: 2026-10-12_react19-migration

## Repo root constraints (package.json)
- engines: node >=24, pnpm >=11.22.0
- packageManager: pnpm@11.22.0
- husky 4.3.0 pre-commit → `pnpm full-check` (test + lint + type + build)
- Root has NO .npmrc (checked: absent in root listing)
- pnpm-workspace.yaml: apps/* + packages/*

## Declared versions (package.json files)
### pnpm catalog (pnpm-workspace.yaml)
- react: ^16.13.1
- react-dom: ^16.13.1
- (apps/web and packages/ui+icons use "catalog:" for react/react-dom)

### apps/web (@fertilizer/web 0.2.1) deps
- react/react-dom: catalog: (16.x)
- @loadable/component ^5.13.1
- react-helmet ^6.1.0
- react-markdown ^8.0.7
- react-router-dom ^5.2.0
- react-router-tabs ^1.3.2
- react-sortablejs ^6.0.0
- zustand ^4.5.7
- devDeps: @testing-library/react 12.1.5 (pinned), @testing-library/jest-dom 7.0.1 (pinned),
  @testing-library/user-event ^7.1.2, @types/react ^16.9.0, @types/react-dom ^16.9.0,
  @types/react-router-dom ^5.1.5, @types/react-router-tabs ^1.3.1, @types/react-helmet ^6.1.0,
  @vitejs/plugin-react ^6.1.0, vite ^8.2.2, vite-plugin-pwa ^1.3.0, vitest ^4.1.11,
  jsdom ^30.0.1, tailwindcss ^4.3.3, @tailwindcss/vite ^4.3.3, workbox-build ^7.4.1, workbox-window ^7.4.1

### packages/ui (@fertilizer/ui)
- peerDependencies: react: catalog: (16.x)
- dependencies: @fertilizer/icons workspace:*, react-helmet ^6.1.0
- devDeps: storybook 10.5.10, @storybook/react 10.5.10, @storybook/react-vite 10.5.10,
  @testing-library/react 12.1.5 (pinned), @types/react ^16.9.0, @types/react-dom ^16.9.8,
  react-dom ^16.13.1, @vitejs/plugin-react ^6.1.0, vite 8.2.2 (pinned), vitest ^4.1.11,
  @vitest/browser-playwright 4.1.11, jsdom ^30.0.1, tailwindcss ^4.3.3

### packages/icons (@fertilizer/icons)
- peerDependencies: react: catalog:
- devDeps: react catalog:, react-dom ^16.13.1, @testing-library/react 12.1.5, @types/react ^16.9.0,
  @types/react-dom ^16.9.8, vitest ^4.1.11

### packages/calculator
- No react dependency at all (pure TS).

## Resolved versions (pnpm-lock.yaml)
- react 16.13.1, react-dom 16.13.1
- @loadable/component 5.13.1
- react-helmet 6.1.0, react-markdown 8.0.7
- react-router 5.2.0, react-router-dom 5.2.0, react-router-tabs 1.3.2
- react-sortablejs 6.0.0 (sortablejs 1.12.0)
- zustand 4.5.7
- @testing-library/react 12.1.5; @testing-library/jest-dom 7.0.1 (+6.9.1 transitive)
- @testing-library/user-event 7.2.1 (declared ^7.1.2) + 14.6.6 (transitive)
- @types/react 16.9.49, @types/react-dom 16.9.8, @types/react-helmet 6.1.0,
  @types/react-router-dom 5.1.5, @types/react-router-tabs 1.3.1
- @vitejs/plugin-react 6.1.0
- vite 8.2.2, vite-plugin-pwa 1.3.0, workbox-build 7.4.1, workbox-window 7.4.1
- vitest 4.1.11; @vitest/{browser,browser-playwright,mocker,runner,snapshot} 4.1.11;
  @vitest/{expect,pretty-format,spy,utils} at BOTH 3.2.4 and 4.1.11
- storybook 10.5.10; @storybook/{react,react-vite,builder-vite,csf-plugin,react-dom-shim} 10.5.10;
  @storybook/global 5.0.0; @storybook/icons 2.1.0
- tailwindcss 4.3.3, jsdom 30.0.1

## Peer ranges for react (from pnpm-lock.yaml `peerDependencies`)
| Package | Peer react range | 17 | 18 | 19 |
|---|---|---|---|---|
| @loadable/component@5.13.1 | >=16.3.0 | ok | ok | ok |
| @storybook/icons@2.1.0 | ^16.8 \|\| ^17 \|\| ^18 \|\| ^19 | ok | ok | ok |
| @storybook/react@10.5.10 | ^16.8\|\|^17\|\|^18\|\|^19 (react+react-dom) | ok | ok | ok |
| @storybook/react-vite@10.5.10 | same | ok | ok | ok |
| @storybook/react-dom-shim@10.5.10 | same | ok | ok | ok |
| @testing-library/react@12.1.5 | <18.0.0 (react+react-dom) | ok | BLOCK | BLOCK |
| mini-create-react-context@0.4.0 (transitive of react-router v5) | ^0.14\|\|^15\|\|^16 | BLOCK | BLOCK | BLOCK |
| react-dom@16.13.1 | ^16.13.1 | (self) | | |
| react-helmet@6.1.0 | >=16.3.0 | ok | ok | ok |
| react-markdown@8.0.7 | >=16 | ok | ok | ok |
| react-router@5.2.0 | >=15 | ok | ok | ok |
| react-router-dom@5.2.0 | >=15 | ok | ok | ok |
| react-router-tabs@1.3.2 | >=15 | ok | ok | ok |
| react-side-effect@2.1.0 (transitive of react-helmet) | ^16.3.0 | BLOCK | BLOCK | BLOCK |
| react-sortablejs@6.0.0 | ^16.9.0 (react+react-dom) | BLOCK | BLOCK | BLOCK |
| use-sync-external-store@1.6.0 (transitive of zustand) | ^16.8\|\|^17\|\|^18\|\|^19 | ok | ok | ok |
| zustand@4.5.7 | >=16.8 | ok | ok | ok |

Note: @testing-library/jest-dom@7.0.1 peers: @testing-library/dom >=10 <11, vitest >=0.32 (no react peer).
No other packages in the lockfile declare a react peer dependency.

## Mount entry point
- Entry: apps/web/src/index.tsx (referenced from apps/web/index.html `<div id="root">` + module script)
- Uses LEGACY `ReactDOM.render(<React.StrictMode><Root/></React.StrictMode>, document.getElementById("root"))`
  → ReactDOM.render is REMOVED in React 19 (deprecated in 18); MUST switch to createRoot.
- StrictMode IS used (legacy API).
- index.html contains a stale comment about redux-form `module.hot` shim (script tag sets self.module = {} if undefined).

## vite.config.ts (apps/web)
- @vitejs/plugin-react configured with EXPLICIT `jsxRuntime: "classic"` (line 62) — matches tsconfig jsx: "react".
- VitePWA({ registerType: "auto" }) only (line 78-80). No custom workbox options; workbox-build 7.4.1 + workbox-window 7.4.1 are direct devDeps.
- base: "./" (GitHub Pages subfolder), outDir: "build", alias "@" → src, define __VERSION__ etc. from git.
- Plugins order: tailwindcss() (v4 vite plugin), react, viteStaticCopy (docs images), VitePWA.

## .npmrc / packageManager / engines
- Root .npmrc exists but contains ONLY a commented-out `#shamefully-hoist=true` — no active constraints.
- No .nvmrc.
- Root package.json: engines node >=24, pnpm >=11.22.0; packageManager pnpm@11.22.0.
- apps/web package.json: same engines.
- No react pinning in .npmrc/overrides (pnpm-workspace.yaml `overrides` section is commented out).

## Storybook (packages/ui/.storybook)
- main.ts: framework "@storybook/react-vite", stories "../src/**/*.stories.tsx". No frameworkOptions, no react version pin.
- preview.ts: only imports ./style.css (theme side-effect), empty parameters.
- No react pin in .storybook; the ONLY react pin for Storybook is packages/ui devDeps (react catalog: = 16.x, react-dom ^16.13.1).

## Test setup
- apps/web/src/setupTests.ts: only `import "@testing-library/jest-dom/vitest";`
- apps/web/vitest.config.ts: globals: true, environment: "jsdom", setupFiles ./src/setupTests.ts, extends vite.config (classic JSX).
- packages/ui/vitest.config.ts: projects node (jsdom, include src/**/*.test.tsx + src/**/test.tsx) + browser (chromium via @vitest/browser-playwright); react({ jsxRuntime: "classic" }).
- packages/icons/vitest.config.ts: jsdom, globals.
- RTL APIs used across tests: render, screen, fireEvent, within, waitFor, act.
  - `act` imported ONLY from "@testing-library/react" (packages/ui/src/Modal/test.tsx).
  - NO import of `react-dom/test-utils` anywhere (no legacy `act` from react-dom).
- Test render wrappers:
  - apps/web/src/test-utils/render.tsx: renderApp → render(<MemoryRouter>{ui}</MemoryRouter>)
  - packages/icons/src/test-utils/render.tsx: renderIcons → plain render
- @testing-library/user-event ^7.1.2 declared (resolves 7.2.1) in apps/web; 14.6.6 present transitively.

## Breaking-pattern search (apps/*, packages/*, excluding node_modules)
- findDOMNode: NONE
- legacy context API (getChildContext/childContextTypes): NONE
- ReactDOM.unmountComponentAtNode: NONE
- useEffectEvent / new React 19 hooks: NONE
- class components (`extends React.Component` / `extends Component` / PureComponent): NONE (0 count)
- direct `React.Component`/`React.PureComponent` references: NONE
- string refs: NONE (only false positive: href="https://reactjs.org" in apps/web/src/pages/App/index.tsx)
- forwardRef: 3 files
  - packages/icons/src/Icon.tsx (line 17)
  - packages/icons/src/IconButton.tsx (line 48)
  - packages/ui/src/Button/index.tsx (line 8)
- ReactDOM API usage overall: only `ReactDOM.render` (apps/web/src/index.tsx:13, legacy)
  and `ReactDOM.createPortal` (packages/ui/src/Modal/index.tsx:47, packages/ui/src/Sidebar/index.tsx:56) —
  createPortal is fine on 17/18/19.

## Routing / loadable
- apps/web/src/Root.tsx: HashRouter + Switch + Route (react-router-dom v5 API; Switch deprecated in v6+).
- @loadable/component used in: apps/web/src/pages/index.ts, apps/web/src/pages/Calculator/index.tsx.

## Latest React on npm (checked 2026-10-12)
- dist-tag latest: 19.3.0 (React 19.3 blog: 2026-09-09; View Transitions + Fragment Refs stable)
- single react in lockfile: 16.13.1 (no duplicates)

## @testing-library/user-event
- Declared ^7.1.2 (resolves 7.2.1) in apps/web devDeps but NOT imported anywhere in source
  (browser tests use `userEvent` from "vitest/browser" — vitest CDP, not RTL).

## Baseline (React 16.13.1)
- Timestamp: 2026-10-12 18:52–18:53 UTC (branch `2026-10-12_react19-migration`)
- Installed react: `16.13.1` (confirmed via `node -e "console.log(require('react/package.json').version)"` from `apps/web`)
- Command: `pnpm full-check` (= `pnpm test && pnpm lint && pnpm type && pnpm build`), run from repo root
- Outcome: **baseline green** (exit code 0)
- Key output excerpts:
  - `pnpm test` — all four vitest projects passed:
    - packages/calculator: `Test Files 14 passed | 1 skipped (15)`, `Tests 69 passed | 5 skipped (74)`
    - packages/icons: `Test Files 3 passed (3)`, `Tests 23 passed | 1 skipped (24)`
    - packages/ui (node project): `Test Files 13 passed (13)`, `Tests 36 passed (36)`
    - apps/web (jsdom): `Test Files 22 passed (22)`, `Tests 49 passed (49)`
  - `pnpm lint` (biome check apps packages): `Checked 257 files in 81ms. No fixes applied.`
  - `pnpm type` (`tsc -p packages/calculator && tsc -p packages/icons && tsc -p packages/ui && tsc -p apps/web`): clean, no errors
  - `pnpm build` (vite 8.2.2): `✓ 453 modules transformed. ... ✓ built in 420ms`, PWA generateSW: `precache 30 entries (841.77 KiB)`, files generated
  - Non-fatal warnings present (not failures): Vite `configLoader: 'native'` unsupported-features warning (ESM syntax in .ts configs) and a React 16 "Can't perform a React state update on an unmounted component" warning in `src/pages/Help/Help.test.tsx` stderr.
- Total wall time: ~26 s

## Migration report (final)

**Result:** React **16.13.1 → 19.2.8** in 3 stages, every gate green (`pnpm full-check` per stage).
**Branch:** `2026-10-12_react19-migration`. No dependency blocked the migration (the user-requested blocker report: nothing to report — all peer mismatches were warnings only and were verified at runtime).

### Per-stage changes

| Stage | Commit | Changes |
|---|---|---|
| React 17 | `e0e69f1` | catalog `react`/`react-dom` → `^17.0.2` (pnpm-workspace.yaml); `react-dom` devDeps in packages/ui + packages/icons → `^17.0.2`; `@types/react`/`@types/react-dom` → 17.x (web/ui/icons). `@testing-library/react` left at 12.1.5 — RTL 14.x peer is `^18` (discovered during execution; incompatible with 17), bump deferred to the React 18 stage. |
| React 18 | `33c0448` | `apps/web/src/index.tsx`: `ReactDOM.render` → `createRoot` (react-dom/client). catalog → `^18.3.1`; `@types/*` → 18.x; RTL → `^16.0.0` (resolves 16.3.3). Fixes: `@types/react-helmet` → 6.1.11 (adds `children` to HelmetProps — React 18 types removed `children` from IntrinsicAttributes); new `apps/web/src/react18-children.d.ts` (module augmentations: `children` on `HashRouterProps` + `ReactSortableProps` — legacy class-component types that render children at runtime); `LazyPromise.tsx` (a `ComponentType` in a children slot — a real type hole under strict ReactNode); `test-utils/render.tsx` (typed `MemoryRouter` wrapper — `@types/react-router` not resolvable from apps/web, so augmentation would create a phantom module). |
| React 19 | `14ac087` | catalog → `~19.2.0` (installs **19.2.8**); `@types/*` → `~19.2.0` (19.2.18); ui/icons `react-dom` → `~19.2.0`. Fixes: `packages/ui/src/Modal/index.tsx` — `RefObject<HTMLDivElement>` → `RefObject<HTMLDivElement \| null>` (React 19 types: `useRef(T \| null)` returns a non-mutable RefObject); new `apps/web/src/react19-global-jsx.d.ts` — global `JSX` namespace shim (React 19 types moved it to `React.JSX`; react-markdown@8 ships raw `.ts` type files referencing global `JSX.IntrinsicElements`, which `skipLibCheck` does not skip). `react18-children.d.ts` works unchanged under 19. `forwardRef` (3 files) kept as-is — ref-as-prop migration is optional in 19. |

### Stage 5 — e2e regressions found & fixed

Baseline comparison on master (React 16.13.1): all 3 e2e failures were **regressions**, not pre-existing (e2e 10/10 green on 16).

1. **Duplicate-key warnings (calculator + persistence tests)** — `65ca1b3`. Root cause: `packages/ui/src/Dropdown/index.tsx` `DropdownList` used `key={String(s)}` — for object items every key stringified to `"[object Object]"`. Latent bug, masked on React 16 because the dev warning carried a `Warning: ` prefix and was deduped once per session, and `tests/helpers.ts` explicitly whitelisted it. React 19 dropped the prefix and dedupes nothing → 50 counted console errors. Fix: `key={i}` (index; the dropdown lists are static).
2. **Sidebar navigation dead (navigation test)** — `0794b4d`. Root cause: react-router v5 `Router` subscribes to `history` **in its constructor** (`this.unlisten = props.history.listen(…)`). React 18/19 `StrictMode` (dev) simulates a class-component unmount — `componentWillUnmount` runs `unlisten()` — and re-runs mount **without re-running the constructor**, so the listener was gone forever: `history.push` updated the URL but the tree never re-rendered. Dev-only (production builds were fine). Fix: removed `<React.StrictMode>` from `apps/web/src/index.tsx` (standard KISS workaround for react-router v5 + React 18/19; trade-off: lose StrictMode dev double-invoke checks). `tests/helpers.ts` known-warning filter made prefix-agnostic (matches on content, works under 16 and 19).

### Verification summary (final state, React 19.2.8)

- `pnpm full-check` — green (test: calculator 69 / icons 23 / ui 36 / web 49; lint 259 files; tsc ×4; vite build + PWA 30 precache entries)
- `pnpm test:smoke` — 6/6 (all routes boot, zero console errors)
- `pnpm test:e2e` — 10 passed / 1 skipped (the pre-existing `test.skip` on the dropdown a11y test)
- Drag&drop (react-sortablejs, peer `^16.9.0`) — manual browser check on `/#/fertilizers`: first two items swap correctly, **0 console errors** → confirmed non-blocking
- Independent acceptance agent runs after each migration stage: all PASS

### Known risks / follow-ups (out of scope, documented)

- **StrictMode is disabled in dev** — trade-off for staying on react-router v5. Long-term fix: upgrade to react-router v6 (effect-based, StrictMode-safe), then re-enable.
- **react-markdown@8** ships raw `.ts` types → the `react19-global-jsx.d.ts` shim is required. Upgrade to v9+ (proper `.d.ts`) and remove the shim.
- **Legacy lines with peer ranges not declaring 19** (pnpm warns only; all runtime-verified here): `react-helmet@6` (+ `react-side-effect@2.1`, `mini-create-react-context@0.4`), `react-sortablejs@6`, `react-router-dom@5`. Candidates for future upgrades.
- **Residual known dev warnings** (filtered in `tests/helpers.ts` as known noise): keyless fragments in `HelpPagesSubMenu`/`RenderHelpPages`; index keys in `DropdownList` are safe only while the lists stay static (no sort/reorder while open).
- **React 19.3.0** is the npm latest; this task targeted **19.2.x** per the explicit user request (`~19.2.0`). A bump to `~19.3.0` needs re-verification.
- **Classic JSX runtime** — React 19 dev prints an "outdated JSX transform" warning; migrating to the automatic runtime is a separate task (both runtimes are supported in 19).
- Playwright suites (`test:smoke`/`test:e2e`) are not part of CI/`full-check`; verified locally against the dev server.
