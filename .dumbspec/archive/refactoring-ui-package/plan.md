# refactoring-ui-package: implementation plan (packages/ui refactor)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Draft captured (user-authored `draft.md`, verbatim)
- [x] Initial spec written from the draft (no research)
- [x] Research (ralph, single sequential loop) → `research.md` (inventory, styling, tests, versions, docs, risks)
- [x] Spec refined; open questions resolved (vitest-browser-react ↔ React 16 → documented testing-library bridge; plain-CSS per component; browser tests = local/manual; ARIA snapshots over pixel VRT)
- [x] Plan written

**Criterion:** `draft.md` + `research.md` + `spec.md` + `plan.md` exist, consistent, and committed (scope frozen).
**Commit:** `docs(spec): refactoring-ui-package — research, spec, plan`

## Stage 1 — Per-component folders + plain CSS (vanilla-extract out)
- [x] Split `src/styles.css.ts` into per-component `style.css` (native `@layer components`, `ui-`-prefixed class names, 1:1 mapping of the 18 class consts)
- [x] Move the 12 components into `src/<Component>/index.tsx` (Button, Card, Checkbox, Dropdown, ForkMeOnGitHub, Input, Label, Modal, NumberInput, Radio, Sidebar, Text); each with its `style.css` and `import "./style.css"`
- [x] Move unit tests to `src/<Component>/test.tsx` (split `primitives.test.tsx` per component; `use-color-mode.test.tsx` stays flat)
- [x] Barrel `src/index.ts` keeps the exact public API; flat files (`cx.ts`, `number-utils.ts`, hooks, `theme.css`) stay at `src/`
- [x] Remove `@vanilla-extract/css` + `@vanilla-extract/vite-plugin` (packages/ui deps, apps/web vite plugin + dep, lockfile)
- [x] `global.d.ts` with `declare module "*.css"` for tsc
- [x] `pnpm test` (jsdom) + `pnpm type` + `pnpm lint` + `pnpm build` green

**Criterion:** tree matches the spec layout; public API of `@fertilizer/ui` unchanged; `pnpm full-check` green; apps/web renders with the same DOM (jsdom app tests unchanged and green).
**Commit:** `refactor(ui): per-component folders with plain-CSS styles`

## Stage 2 — vitest browser mode + regression tests (chromium)
- [x] Red: write `browser.test.tsx` for all 12 components first (behavior: render/click/focus/typing; + `toMatchAriaSnapshot()` of the base state) — failing while no browser project exists
- [x] Add devDeps to packages/ui: `@vitest/browser-playwright@4.1.11` (exact peer of vitest 4.1.11), `@playwright/test@^1.62.1` (install with `pnpm_config_store_dir=./.pnpm-cache/v11 pnpm install`)
- [x] `vitest.config.ts`: `@vitejs/plugin-react` (classic runtime) + `test.projects` = `node` (jsdom, unit tests) + `browser` (chromium headless, `provider: playwright()`, instances chromium, viewport 1280×720, include `src/**/browser.test.tsx`)
- [x] Scripts: `test` → `vitest run --project node`, `test:browser` → `vitest run --project browser`, `test:watch` → `vitest`
- [x] Green: `pnpm -C packages/ui test:browser` passes in chromium; ARIA `.snap` baselines created and kept
- [x] `pnpm test` (root) still green — only the `node` project runs (full-check/CI unaffected)

**Criterion:** `pnpm -C packages/ui test:browser` green for all 12 components in real chromium; root `pnpm test` green with node project only; committed `.snap` baselines.
**Commit:** `test(ui): browser-mode regression tests (vitest/browser + playwright)`

## Stage 3 — Storybook for all packages/ui components
- [x] Add devDeps: `storybook@10.5.10`, `@storybook/react-vite@10.5.10` (+ `onlyBuiltDependencies` entries if new build scripts appear)
- [x] `packages/ui/.storybook/`: `main.ts` (`framework: '@storybook/react-vite'`, stories `../src/**/*.stories.tsx`, classic JSX, theme.css in preview) + `preview.ts`
- [x] `<Component>.stories.tsx` for all 12 components (base state + main variants: open states, props)
- [x] Scripts: `storybook` → `storybook dev -p 6006`, `build-storybook` → `storybook build`
- [x] `pnpm -C packages/ui build-storybook` exits 0; `tsc -p packages/ui` still green (stories type-check)
- [x] Dev-server smoke (playwright-cli): storybook page renders, stories of all 12 components present

**Criterion:** `build-storybook` succeeds; Storybook dev server shows a story for every component in `packages/ui`; app `full-check` still green.
**Commit:** `feat(ui): storybook for packages/ui components`

## Stage 4 — Docs + verification + archive
- [x] `AGENTS.md`: packages/ui structure (component folders, plain CSS), test commands (`test:browser` local/manual like e2e, `storybook`/`build-storybook`), vanilla-extract removal noted (incl. Storybook `--no-open` on headless WSL2, and the stale `tab-menu.tsx` line — it lives in apps/web, not packages/ui)
- [x] Cleanup: delete the redundant per-folder `packages/ui/src/<Component>/style.css.d.ts` (superseded by `src/global.d.ts`; consumer tsconfigs — `packages/icons`, `apps/web` — include `ui/src/**/*.d.ts` so the ambient declaration reaches their programs, same pattern as `packages/calculator/src/**/*.d.ts` in apps/web); fix the stale "vanilla-extract" comment in `apps/web/src/index.tsx`
- [x] Final `pnpm full-check` green
- [x] Local verification: `pnpm -C packages/ui test:browser` green; `build-storybook` green; `pnpm test:e2e` green (role locators — class names irrelevant)
- [x] Archive task: `git mv .dumbspec/current/refactoring-ui-package .dumbspec/archive/refactoring-ui-package` (plan fully `[x]`)

**Criterion:** everything green; AGENTS.md consistent with the new layout; task directory moved to `archive/`.
**Commit:** `chore(spec): archive refactoring-ui-package`
