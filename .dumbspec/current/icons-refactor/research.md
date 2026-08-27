# Research: icons-refactor

## 1. Icon dependency surface (apps/web/package.json)

Direct dependencies in `apps/web/package.json` related to icons:

- `@emotion-icons/boxicons-solid` 2.10.0
- `@emotion-icons/emotion-icon` 2.0.3 (type `EmotionIcon` used by Icon/IconButton)
- `emotion-icons` 2.11.0
- `emotion-theming` 10.0.27 (`useTheme` used ONLY by Icon.tsx / IconButton.tsx)
- `@styled-icons/boxicons-regular|boxicons-solid|entypo|fa-regular|fa-solid|material-sharp|remix-line` 10.18.0
- `styled-icons` 10.19.0 (meta package, not imported anywhere in source)

The app uses BOTH `@emotion-icons/*` and `@styled-icons/*`.

**Keep (not icon-related, per user decision «только иконочные»):**
- `@emotion/styled` 10.0.27 — layout styling in `ModalContainer.tsx`, `SidebarContainer.tsx` (styled(Flex) overlays) and `Dropdown.tsx` (styling the icon — icon part shrinks after refactor).
- `styled-components`, `rebass`, `theme-ui`, `@theme-ui/presets` — the rest of the UI stack.

## 2. Consumers in apps/web/src (full list)

| File | Icon(s) | Library |
| --- | --- | --- |
| components/ColorModeToggle.tsx | Moon, Sun | @styled-icons boxicons-solid / fa-solid |
| components/ui/Modal/Modal.tsx | Cross (close) | @styled-icons entypo |
| components/ui/Sidebar/Sidebar.tsx | Menu, Cross | @styled-icons boxicons-regular / entypo |
| components/ui/Dropdown/Dropdown.tsx | ChevronDownSquare, `styled(ChevronDownSquare)` | @emotion-icons boxicons-solid + @emotion/styled (color: theme.colors.text; height 3rem; opacity 0.5 → 0.7 on hover) |
| components/ui/IconButton.test.tsx | Plus | @styled-icons boxicons-regular |
| components/Calculator/FertilizerManager/List.tsx | Plus, Restart | boxicons-regular / remix-line |
| components/Calculator/FertilizerManager/Item.tsx | Edit, Trash | fa-regular / fa-solid |
| components/Calculator/FertilizerSelect/AddItem.tsx | Plus | boxicons-regular |
| components/Calculator/FertilizerSelect/SelectedListItem.tsx | Cross | entypo |
| components/Calculator/ImportExport/ImportFertilizers.tsx, ImportRecipes.tsx, ImportState.tsx | Import | boxicons-regular |
| components/Calculator/ImportExport/ExportFertilizers.tsx, ExportRecipes.tsx, ExportState.tsx | Export | boxicons-regular |
| components/Calculator/Result/Result.tsx | Save | fa-regular |
| components/Calculator/Mixer/Mixer.tsx | Save | fa-regular |
| components/Calculator/index.tsx | Restart | remix-line |
| components/Calculator/Options/Recipe.tsx | Save (boxicons-regular!), Broom (fa-solid), Tune (material-sharp) | three different sets |

Unique icons (14): moon, sun, cross(close), plus, restart, edit, trash, import, export, save, broom, tune, menu, chevron-down.
Note: `Save` is imported from two different libraries (fa-regular, boxicons-regular) — the new `name` API unifies this.

## 3. Current component architecture

### `ui/Icon.tsx`
`forwardRef<HTMLDivElement>`; props `{ component: EmotionIcon, size? = "1.5em", disabled? }` + BoxProps; renders `<Box>{IconComponent color={theme.colors?.text} size={containerSize}}</Box>`; theme via `useTheme` from **emotion-theming**; if `size` absent, measures ref `offsetWidth`.

### `ui/IconButton.tsx`
Same pattern over rebass `<Button type="button">`; `children` supported (icon gets `marginRight: 2` when children present); color = `theme.colors?.background`.

### `ui/IconButton.test.tsx`
Smoke: renders `<IconButton component={Plus} title="Добавить"/>` via `renderApp` (`@/test-utils/render`), asserts button + svg.

## 4. Package model (from packages/calculator)

- Source package, **no build step**: `main`/`exports` point at `./src/*.ts` directly; `private: true`; consumed as `workspace:*`.
- Own `tsconfig.json` (calculator: lib esnext, strict, moduleResolution bundler, noEmit) + own `vitest.config.ts` (calculator: node env, globals).
- Root `package.json` scripts to extend:
  - `test`: `pnpm -C packages/calculator test && pnpm -C apps/web test` → add `pnpm -C packages/icons test`.
  - `type`: `tsc -p packages/calculator && tsc -p apps/web` → add `tsc -p packages/icons`.
- Vite: alias `"@"` only matches `@/...`, so `@fertilizer/icons` resolves via workspace symlink in node_modules — no vite changes needed.
- App tsconfig (`moduleResolution: bundler`) resolves the package `main` → `src/index.ts`; its `.ts` files join the app program (same mechanism as calculator).

## 5. Theme & test harness

- `Root.tsx` wraps the app in **theme-ui** `<ThemeProvider theme={defaultTheme}>`; `test-utils/render.tsx` does the same for app tests.
- `defaultTheme` = `polaris` preset: `colors.modes.dark.text = #9d9d9d`; `styles.button.color = "background"`.
- Icon colors come from `theme.colors?.text` (Icon) / `theme.colors?.background` (IconButton) via `useTheme` from `emotion-theming` — works under the theme-ui provider today (deduped instance).
- ⇒ New package components should read the theme via **theme-ui `useTheme`** (app keeps theme-ui); `emotion-theming` becomes removable.

## 6. e2e selectors depend on icon DOM (playwright, NOT in full-check)

- `tests/e2e/shared.ts:18`: `input.locator("xpath=..").locator("svg").click()`
- `tests/e2e/navigation.test.ts:17`: `page.locator("div:has(> svg)").first()` — "первый на странице div с единственным svg-ребёнком" = the hamburger `Icon` (a Box/div directly wrapping the svg).

⇒ `Icon` must keep rendering a **div (Box) whose direct child is the `<svg>`**; new svgs get `aria-hidden` + sized attributes, wrapper unchanged.

## 7. Design decisions (agreed / proposed from research)

- **Package** `packages/icons` = `@fertilizer/icons`, source package (no build).
  - deps: `react` (16), `rebass` (Box/Button), `theme-ui` (useTheme).
  - devDeps: `typescript`, `vitest`, `@types/react`, `@testing-library/react`, `jsdom`.
- **14 hand-drawn SVG icons**, 24×24, `fill="currentColor"`, designed by meaning (plus, trash, edit, import, export, save, restart, broom, tune, menu, close, sun, moon, chevron-down). No copying of existing icon sets.
- **`Icon`** props: `{ name: IconName, size? = "1.5em", color? = currentColor→theme text, disabled?, ... }`; Box wrapper preserved (e2e selectors).
- **`IconButton`** props: `{ name, children?, onClick?, title?, size?, disabled?, ... }`; Button wrapper preserved.
- **Dropdown**: `IconDown` becomes `styled(Icon)` keeping height/opacity (hover), icon colors itself via theme.
- **Tests**: `IconButton.test.tsx` moves into the package (own minimal render helper: theme-ui Provider + small theme); package tests run in jsdom.
- `AGENTS.md` structure section: add `packages/icons/` line.
