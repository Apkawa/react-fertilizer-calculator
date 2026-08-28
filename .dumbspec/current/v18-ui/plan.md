# v18-ui: implementation plan (packages/ui on vanilla-extract + tailwind; React stays 16)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Research current state (installed versions, CSS-in-JS usage map, theme, tests)
- [x] Verify vanilla-extract (`@vanilla-extract/vite-plugin` 5.2, peer vite ^8) and tailwind v4 (`@tailwindcss/vite` 4.3, peer vite ^8) against repo Vite 8.2.2
- [x] Resolve open spec questions with the user (see spec "Решения")
- [x] Scope update (2026-08-28): drop the React 18 requirement (draft), align research/spec/plan with the zustand/React-16 baseline

**Criterion:** draft/spec/research/plan present and consistent; all open questions resolved; no code touched.
**Commit:** v1 `docs(spec): v18-ui — research, spec, plan (react 18 + packages/ui, vanilla-extract + tailwind)`; v2 `docs(spec): v18-ui — drop React 18 scope, align with zustand/React-16 baseline`

## Stage 1 — Build env: `packages/ui` skeleton + vanilla-extract + tailwind
- [ ] Create `packages/ui` (`@fertilizer/ui`): package.json (source package: `main`/`exports` → `./src/*.ts`, deps `@vanilla-extract/css`, react via catalog), tsconfig (mirror `packages/icons`), `src/index.ts`
- [ ] Root `package.json`: `pnpm test` + `tsc -p packages/ui` in `type`
- [ ] `apps/web` devDeps: `@vanilla-extract/css`, `@vanilla-extract/vite-plugin`, `tailwindcss`, `@tailwindcss/vite`; wire plugins in `vite.config.ts`
- [ ] Theme: `packages/ui/src/theme.css` — polaris palette → CSS variables (`:root` + dark variant via `data-` attribute), exported subpath; app entry CSS (`apps/web/src/styles/app.css`) with `@import "tailwindcss"` + theme; imported in `index.tsx`
- [ ] `useColorMode` hook in `packages/ui` (localStorage, migrates legacy theme-ui key once) + its test (red → green); `packages/ui` vitest wired with the vanilla-extract plugin
- [ ] Tailwind preflight on: run `pnpm build`, playwright smoke — if visible regression on still-rebass components, switch to selective `tailwindcss/*` imports (no preflight) until Stage 5 and note it

**Criterion:** `pnpm full-check` green; build output contains tailwind + vanilla-extract CSS; `useColorMode` test green.
**Commit:**

## Stage 2 — Atoms in `packages/ui` (+ Form controls)
- [ ] Port tests: `RebassWidgets/Number.test` + `Form/{Input,Checkbox,Radio}` render-smoke → `packages/ui` (red: no components yet)
- [ ] Implement presentational atoms: `Input`, `NumberInput` (spinner CSS from RebassWidgets), `Button`, `Card`, text primitives, `Label`, `Checkbox`, `Radio` — vanilla-extract classes (layer below tailwind utilities)
- [ ] Rewire `ui/Form/{Input,Checkbox,Radio}` on the new atoms — `useFormField`/FormProvider wiring unchanged
- [ ] App: point imports at `@fertilizer/ui`; drop `@rebass/forms`/`rebass` imports in migrated files

**Criterion:** `pnpm full-check` green; migrated files import `@fertilizer/ui` only; no `@rebass/forms` in them.
**Commit:**

## Stage 3 — Composite ui components → `packages/ui`
- [ ] Port tests: `Dropdown.test`, `Modal.test`, `Sidebar.test`, `TabMenu.test` → `packages/ui` (red)
- [ ] `Dropdown` (+Item/List/context): emotion `IconDown` → classes, `sx` → utilities, `disabled` variant (was `styled`+`css`)
- [ ] `Modal`/`ModalContainer`: drop `@emotion/styled` (overlay → class; dynamic `top` → inline style), keep `react-helmet` body-overflow + `createPortal`
- [ ] `Sidebar`/`SidebarContainer`: same pattern; `docked` → class variants
- [ ] `TabMenu`: keep react-router-tabs + `style.css`; `Flex` → primitives
- [ ] `ForkMeOnGitHub`: styled-components → vanilla-extract; `csv/ImportCSV` stub → move (or delete if unreferenced — verify refs first)
- [ ] Remove moved code from `apps/web/src/components/ui` (keep `Form/` glue + `styled.ts` until Stage 5 + `types.d.ts` until Stage 7)

**Criterion:** `apps/web/src/components/ui` contains only `Form/` (+`styled.ts` until Stage 5, `types.d.ts` until Stage 7); `pnpm full-check` green.
**Commit:**

## Stage 4 — App shell: Root, pages, ColorModeToggle, test-utils
- [ ] `Root.tsx`: Box/Flex/Text → `packages/ui`/utilities; **keep `ThemeProvider`** (Calculator/rebass still consume theme)
- [ ] `pages`: Example, Help, ChemFormula, DensityCalculator, App shell — rebass/@rebass/forms/`sx` → primitives/utilities
- [ ] `ColorModeToggle`: new `useColorMode` (no theme-ui)
- [ ] `test-utils/render.tsx`: keep `ThemeProvider` for now (still needed by Calculator smoke tests)
- [ ] Deps: none removable yet (theme-ui/rebass still used by Calculator)

**Criterion:** `pnpm full-check` green; no rebass imports outside `components/Calculator/**` + `components/ui/Form/**` + `components/ui/styled.ts`.
**Commit:**

## Stage 5 — Calculator migration (biggest)
- [ ] `components/Calculator/**`: rebass → `packages/ui` + tailwind; `sx` sites (incl. `mobileStyles` in `index.tsx` → responsive utilities, then delete `ui/styled.ts`)
- [ ] `Result.tsx`: `StyledList` (styled-components) → class; `StyledBalanceCell` (Options/Recipe) → class; `ResultDilution`/`ResultFertilizerList`/`Mixer`/`ImportExport`/`FertilizerSelect`/`FertilizerManager`/`Options` — same
- [ ] Form wiring (`FormProvider`/`useFormField`, `test-utils/form.tsx`, `@/store`) untouched

**Criterion:** zero `rebass`/`@rebass`/`styled-components`/`@emotion`/`theme-ui` imports in `apps/web/src/components/**` + `packages/**`; `pnpm full-check` green.
**Commit:**

## Stage 6 — `packages/icons` without rebass/theme-ui
- [ ] `Icon`/`IconButton`: rewrite on vanilla-extract (no rebass `Box`/`Button`); port/adjust icon tests incl. PNG-baseline test (`rsvg-convert`)
- [ ] `packages/icons`: package.json (drop `rebass`/`theme-ui`/`@theme-ui/presets`/`@types/rebass`/`@types/theme-ui`, add `@vanilla-extract/css`), vitest config with the vanilla-extract plugin, `test-utils/render.tsx` without `ThemeProvider`

**Criterion:** `pnpm -C packages/icons test` + full `pnpm full-check` green; no rebass/theme-ui in `packages/icons`.
**Commit:**

## Stage 7 — Final cleanup + docs
- [ ] Remove `ThemeProvider` from `Root.tsx` + `test-utils/render.tsx` (themes/ dir: polaris preset consumption → CSS vars)
- [ ] Remove deps: `rebass`, `@rebass/forms`, `@rebass/preset`, `theme-ui`, `@theme-ui/presets`, `styled-components`, `@emotion/styled`, `react-focus-lock`, `@types/rebass`, `@types/theme-ui`, `@types/rebass__forms`, `@types/styled-components`; `pnpm install` clean
- [ ] Delete legacy `yarn.lock` and `apps/web/src/react18-types-compat.d.ts`
- [ ] Docs: `AGENTS.md` (UI paragraph, structure tree with `packages/ui`, `type`/`test` scripts), root README if needed
- [ ] Final: `pnpm full-check` + playwright smoke/e2e (real browser) visual check

**Criterion:** `pnpm full-check` green; `grep -r "rebass\|theme-ui\|styled-components\|@emotion" apps packages` → no hits; smoke suite passes in browser.
**Commit:**
