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
- [x] Create `packages/ui` (`@fertilizer/ui`): package.json (source package: `main`/`exports` → `./src/*.ts` + `./theme.css`, deps `@vanilla-extract/css`, react via catalog), tsconfig (mirror `packages/icons`), `src/index.ts`; `apps/web` depends on it (`workspace:*`)
- [x] Root `package.json`: `pnpm test` + `tsc -p packages/ui` in `type`
- [x] `apps/web` devDeps: `@vanilla-extract/vite-plugin`, `tailwindcss`, `@tailwindcss/vite`; wire plugins in `vite.config.ts` (vite 8: `tailwindcss(), react({jsxRuntime:"classic"}), vanillaExtractPlugin(), …`)
- [x] Theme: `packages/ui/src/theme.css` — polaris palette → CSS variables (`:root` + dark via `html[data-theme="dark"]`), exported subpath; app entry CSS (`apps/web/src/styles/app.css`); imported in `index.tsx`
- [x] `useColorMode` hook in `packages/ui` (localStorage, migrates legacy theme-ui key once) + 5 green tests; `packages/ui` vitest wired with the vanilla-extract plugin
- [x] Preflight check: A/B on the help page in a real browser — with full `@import "tailwindcss"` (preflight on) `h1` collapsed to 16px/400/margin 0 (theme-ui global styles lost to preflight); without preflight the baseline returns (32px/700/21px). → kept selective imports: `tailwindcss/theme.css` + `tailwindcss/utilities.css` (NO preflight) until Stage 5/7 — decision + re-enable note live in the `app.css` comment

**Criterion:** `pnpm full-check` green; build output contains tailwind + vanilla-extract CSS; `useColorMode` test green.
**Commit:** `feat(ui): stage 1 — packages/ui skeleton, vanilla-extract + tailwind env, theme.css, useColorMode (no-preflight tailwind until Stage 5/7)`

## Stage 2 — Atoms in `packages/ui` (+ Form controls)
- [x] Port tests: `RebassWidgets/Number.test` + `Form/{Input,Checkbox,Radio}` render-smoke → `packages/ui` (red: no components yet)
- [x] Implement presentational atoms: `Input`, `NumberInput` (spinner CSS from RebassWidgets), `Button`, `Card`, text primitives, `Label`, `Checkbox`, `Radio` — vanilla-extract classes (layer below tailwind utilities)
- [x] Rewire `ui/Form/{Input,Checkbox,Radio}` on the new atoms — `useFormField`/FormProvider wiring unchanged
- [x] App: point imports at `@fertilizer/ui`; drop `@rebass/forms`/`rebass` imports in migrated files

**Criterion:** `pnpm full-check` green; migrated files import `@fertilizer/ui` only; no `@rebass/forms` in them.
**Commit:** `feat(ui): stage 2 — VE atoms (Input/NumberInput/Button/Card/Label/Checkbox/Radio/Heading/Text) in packages/ui + Form controls rewired (rebass forms out)`

Note: `ui/Form/{Input,Checkbox,Radio}` now import `@fertilizer/ui` only (+ react + store glue). `RebassWidgets/` deleted. `RecipeTuneForm` NumberInput → `@fertilizer/ui` (its `rebass` Box/Button/Flex + plain `@rebass/forms` Input remain — Calculator, Stage 5). Verified in prod build: inputs styled (padding 8 / border `--color-text` / radius 0), layout props (width/maxWidth/flex/marginRight) mapped, `@layer components` below tailwind utilities.

## Stage 3 — Composite ui components → `packages/ui`
- [x] Port tests: `Dropdown.test`, `Modal.test`, `Sidebar.test`, `TabMenu.test` → `packages/ui` (red)
- [x] `Dropdown` (+Item/List/context): emotion `IconDown` → classes, `sx` → utilities, `disabled` variant (was `styled`+`css`)
- [x] `Modal`/`ModalContainer`: drop `@emotion/styled` (overlay → class; dynamic `top` → inline style), keep `react-helmet` body-overflow + `createPortal`
- [x] `Sidebar`/`SidebarContainer`: same pattern; `docked` → class variants
- [x] `TabMenu`: keep react-router-tabs + `style.css`; `Flex` → primitives (relocated to `components/navigation/`)
- [x] `ForkMeOnGitHub`: styled-components → vanilla-extract (`forkMeClass` span + `forkMeLinkClass` `a`, media query)
- [x] Remove moved code from `apps/web/src/components/ui` (keep `Form/` glue + `styled.ts` until Stage 5 + `types.d.ts` until Stage 7)

**VE `@layer` specifics (discovered this stage):** simple pseudos = direct keys (`.hover`); nested pseudos = `selectors` object (`&:hover::before`); media = `@media` map; `selectors` **cannot** use combinators (`> a` rejected at runtime) → child elements (ForkMe `<a>`) get their own class on the element. Dropdown items became real `<button type="button">` (a11y rules); Sidebar overlay keeps `onClick` with a `biome-ignore` (a backdrop can't be a `<button>` that wraps the card).

**Criterion:** `apps/web/src/components/ui` contains only `Form/` (+`styled.ts` until Stage 5, `types.d.ts` until Stage 7); `pnpm full-check` green.
**Commit:** `feat(ui): move Dropdown/Modal/Sidebar/TabMenu/ForkMe to packages/ui (vanilla-extract + tailwind)`

## Stage 4 — App shell: Root, pages, ColorModeToggle, test-utils
- [x] `Root.tsx`: Box/Flex/Text → `packages/ui`/utilities; **keep `ThemeProvider`** (Calculator/rebass still consume theme)
- [x] `pages`: Example, Help, ChemFormula, DensityCalculator, App shell — rebass/@rebass/forms/`sx` → primitives/utilities
- [x] `ColorModeToggle`: new `useColorMode` (no theme-ui)
- [x] `test-utils/render.tsx`: keep `ThemeProvider` for now (still needed by Calculator smoke tests)
- [x] Deps: none removable yet (theme-ui/rebass still used by Calculator)

**Chevron-фикс (найдено в Stage 4, браузер):** Tailwind v4 auto-детект видит только `apps/web` — утилиты из `className` в `packages/ui/src` не генерировались (`right-0`/`top-0` отсутствовали → chevron Dropdown падал под инпут). Лечение: `@source "../../../../packages/ui/src"` в `apps/web/src/styles/app.css` (после всех `@import`), обёртка chevron `absolute right-0 top-0`, `dropdownChevronClass` + flex-центрирование. Biome 2.5 не парсит `@source` без `css.parser.tailwindDirectives: true` в `biome.json`.
**DropdownItem:** `<button>` → `<div role="option">` + `role="listbox"` на списке (в пункте Example есть кнопка X — `<button>` в `<button>` невалидно; a11y-правила Biome проходят на option-диве).

**Criterion:** `pnpm full-check` green; no rebass imports outside `components/Calculator/**` + `components/ui/Form/**` + `components/ui/styled.ts`.
**Commit:** `feat(web): migrate app shell (Root, pages, ColorModeToggle) to packages/ui + tailwind`

## Stage 5 — Calculator migration (biggest)
- [x] Факты (2026-08-29): rebass в Calculator = 26 файлов: `Box`/`Flex` — 119 мест (layout-пропсы: `flexDirection`/`justifyContent`/`alignItems`/`flexWrap`/`flex`/`width`/`maxWidth` + шкала m/p), `Text`/`Heading` — ~15 мест (с `fontSize`/`flex`/`textAlign`/`minWidth`/`sx`), `Button`/`Card` — 20 мест; `sx` — 16 мест (включая `mobileStyles` в `index.tsx`); `styled-components` — только `StyledList` (`Result.tsx`); `ui/types.d.ts` — пустой файл
- [x] `Box`/`Flex` → plain `<div>` c tailwind-классами (без новой API: `flex`/`flex-col`/`items-*`/`justify-*`/`flex-wrap`, `flex-1`, `w-full`/`w-auto`/`max-w-*`, `m-*`/`p-*`, arbitrary values)
- [x] `from "rebass"` → `from "@fertilizer/ui"` (только `Button`/`Card`/`Heading`/`Text`/`Label`)
- [x] `Text`/`Heading` коллсайты → className (тема polaris, индексная шкала: `space [0,4,8,16,32,64,128]` px, `fontSizes [12,14,16,20,24,32,48,64,96]` px): `fontSize={2}` → `text-base` (16px), `fontSize="2rem"` → `text-[2rem]`, `flex` → `flex-1`, `textAlign` → `text-center`, `minWidth="3em"` → `min-w-[3em]`, `sx whiteSpace` → `whitespace-nowrap`; m/p-числа: 1→`-1`, 2→`-2`, 3→`-4`, 4→`-8`
- [x] `Button`/`Card` коллсайты → className: `width="100%"` → `w-full`, `width="auto"` → `w-auto`, `my={2}`/`marginBottom={2}` → `my-2`/`mb-2` (без расширения API `packages/ui`)
- [x] `sx` (16 мест) → className/tailwind; `mobileStyles` в `index.tsx` → `max-[800px]:`; удалить `apps/web/src/components/ui/styled.ts` + пустой `types.d.ts`
- [x] `Result.tsx`: `StyledList` (styled-components) → класс
- [x] Form wiring (`FormProvider`/`useFormField`, `test-utils/form.tsx`, `@/store`) untouched

Note (выполнение, оркестрация): 5 agents по группам файлов (shell+importexport, options, fertilizermanager, fertilizerselect, mixer+result), последовательно; каждый — `pnpm type` + `pnpm -C apps/web test` + `pnpm lint` + grep-контроль. Доп-факты: `@rebass/forms` `Input` (AddEditNPKString, RecipeTuneForm) → `StyledInput` из `ui/Form`; `Label` (AddEdit/Solution/Dilution/ToppingUp) → `Label` из `@fertilizer/ui`; `htmlFor` не типится в `@types/react` 16.9 → лейблы обернули инпуты (конвенция `ui/Form`, старые for/id были dangling). `bg={name}` (токен темы) → local-мапа `ELEMENT_BG` + inline-style (SelectedListItem). Один пропуск agent'а (`FertilizerManager/AddItemElementForm.tsx`) допущен на верификации в main-сессии.

**Criterion:** zero `rebass`/`@rebass`/`styled-components`/`@emotion`/`theme-ui` imports in `apps/web/src/components/**` (Root/themes/test-utils — Stage 7; `packages/icons` — Stage 6); smoke-тесты Calculator зелёные; `pnpm full-check` green.
**Commit:** `feat(web): stage 5 — Calculator on tailwind + packages/ui (rebass/theme-ui/styled-components out of apps/web)`

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
