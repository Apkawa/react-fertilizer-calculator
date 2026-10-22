# Research: 2026-10-18_style-priority

Task: component CSS-module classes (e.g. `_input_11chk_4`) override tailwind v4 utilities (`w-24`) after the style refactor to `*.module.css`. Need to understand the style pipeline (dev + production) to pick the right fix.

(Findings appended below.)

## Q1. Tailwind import and configuration

**`apps/web/src/styles/app.css`** — the only tailwind entry (full file):

```css
@import "tailwindcss";
@import "@fertilizer/ui/theme.css";
@source "../../../../packages/ui/src";
```

- No `@theme`, no `@layer` declarations in app.css.
- `@source` explicitly adds `packages/ui/src` to content detection because the app-root auto-detection doesn't see the packages (comment: "утилиты tailwind, используемые внутри пакетов...").
- `theme.css` (`packages/ui/src/theme.css`) is plain CSS custom properties (`:root`, `:root[data-theme=dark]`), no layers.
- Vite config `apps/web/vite.config.ts`: plugins are `tailwindcss()` from `@tailwindcss/vite` (v4, handles all CSS incl. plain CSS from packages), `react()`, `viteStaticCopy`, `VitePWA`. No custom `css` config, no `cssCodeSplit` overrides, `build.outDir: "build"`, `base: "./"`.
- Versions: `tailwindcss` `^4.3.3`, `@tailwindcss/vite` `^4.3.3` (`apps/web/package.json`).

## Q2. How component styles enter the bundle

All 11 component styles in `packages/ui/src` are **`style.module.css`** (imported as named CSS modules, e.g. `import css from "./style.module.css"` in every `*/index.tsx`); Dropdown/NumberInput/Modal/Sidebar also cross-import other components' modules (e.g. `import inputCss from "../Input/style.module.css"`). **No file uses `@layer`** — verified with grep across all css in `packages/ui/src` and `apps/web/src`: the only `@layer` occurrences in the built output are the tailwind-generated ones.

App-side CSS is also all modules: `apps/web/src/components/navigation/style.module.css` (starts with `@import url("https://fonts.googleapis.com/...")`), `apps/web/src/pages/App/App.module.css`, `apps/web/src/pages/Help/style.module.css`.

Representative excerpt, `packages/ui/src/Input/style.module.css`:

```css
.input {
  display: block;
  width: 100%;
  padding: 8px;
  ...
  border: 1px solid var(--color-text);
  border-radius: 0;
}
```

Components merge the module class with consumer `className` via `cx` (e.g. `Input/index.tsx:9` → `cx(css.input, className)`), so the module class and tailwind utilities end up on the **same element**.

Git: migration is the latest commit `ba6da55 "refactor(ui): migrate component styles to CSS modules"`; the `@layer components` + plain `style.css` state is gone (old state per AGENTS.md).

## Q3. CSS order in DEV

Import chain: `apps/web/src/index.tsx` line 9 `import "./styles/app.css"` **before** `import Root from "./Root"` (line 11). Root → `@fertilizer/ui` barrel → component modules, each of which imports its `style.module.css`.

In Vite dev, the plain `app.css` import resolves to a processed stylesheet injected as a `<style>` at evaluation time of `index.tsx`; each CSS module import is injected as its own `<style>` when that module evaluates — i.e. **after** `index.tsx` starts executing, during the Root import-graph evaluation. So dev order in the document is: **tailwind (app.css) first, component module CSS after**. (Consistent with the user's observation; also noted in the comment at `index.tsx:5-8`.)

## Q4. CSS order in PRODUCTION (verified with a real `pnpm build`)

Build produced `apps/web/build/assets/`: `index-*.css` (12.8 kB, linked from `index.html`), plus code-split chunks `Help-*.css` and `App-*.css` (loaded with their lazy page JS). **All ui-package CSS lands in the single `index-*.css`** — same chunk as tailwind. Order inside `index-*.css` (verified in the built file):

1. `@import "https://fonts.googleapis.com/..."`
2. `@layer properties { ... }`
3. `@layer theme { :root { --spacing, --text-*, ... } }`
4. `@layer base { ... preflight ... }`
5. `@layer components;` — **empty**
6. `@layer utilities { .absolute ... .w-24 { width: calc(var(--spacing) * 24) } ... .flex-1 { flex: 1 } ... }`
7. `:root { --color-text: ... }` — theme.css, **unlayered**
8. All CSS-module classes, **unlayered**: `._input_11chk_4 { width:100%; ... display:block }`, `._card_1xw2g_2`, `._heading_1g77n_2`, `._navTab_1a962_2`, etc.

So in production the module classes come **after** the utilities layer too — and since they are unlayered while utilities are in `@layer utilities`, the module class wins **regardless of source order**. The override is **not dev-only**: identical result in the production build.

## Q5. Intentional overrides / conflicts in the codebase

Utility classes passed straight onto ui components (rely on **utility** applying on top of the module class):

- `apps/web/src/pages/ChemFormula/index.tsx:76,84` — `<Input className="flex-1">` and `<Input className="w-24">` (the exact reported breakage: `.input { display:block; width:100% }` beats `flex-1`/`w-24`, so both inputs render `width:100%`/block and the row layout breaks).
- `apps/web/src/components/Calculator/FertilizerManager/Item.tsx:33`, `FertilizerSelect/SelectedListItem.tsx:46,74,88`, `Calculator/index.tsx` — `<Text className="flex-1">`, `<Text className="min-w-[3em] ...">` (`.heading` sets `margin/font-*` only, no `display`/`width` → no current conflict, but fragile).
- `AddEdit.tsx:119,135,154` — `<Label className="flex flex-col">` (`.label` already `display:flex; align-items:center` → `flex-col` utility would be needed to win for column layout).
- `AddEdit.tsx:30`, `SelectedListItem.tsx:71` — `<Card className="w-auto ...">` (`.card` sets no width → utility-only, no conflict).

Inside `packages/ui` itself the only tailwind utility is `Dropdown/index.tsx:95` `cx(css.list, "flex flex-col")` — `.list` has no `display` → no conflict today.

Also relevant: `apps/web/src/components/ui/Form/Input.tsx` passes legacy layout (`width`, `flex`, `marginRight`) as **inline styles** via `layoutStyle()`, so app form fields do NOT hit the css conflict; only raw `@fertilizer/ui` `<Input>`/`<Text>`/`<Label>` with tailwind `className` do (ChemFormula page).

## Q6. Tailwind v4 layer structure (confirmed from built CSS)

`@import "tailwindcss"` expands to layer order **`properties, theme, base, components, utilities`** (v4.3: a new leading `properties` layer for `@property` declarations). Unlayered CSS beats **all** layers, no matter its position in the file. Current state: **no project file uses `@layer`** — the old `@layer components` wrapper from the plain-`style.css` era is gone; the built `@layer components` block is empty. Modal and Sidebar additionally inject runtime unlayered `<style>` tags (e.g. `Modal/index.tsx:52` `body { overflow: hidden }`).

## Key facts constraining fixes

1. Module CSS is **unlayered**; tailwind utilities are in `@layer utilities` → module class **always** wins over any utility, in dev AND production, independent of load order.
2. Load order (tailwind first, modules after) is identical in dev and production; the "dev-server-only" hypothesis is **refuted** by the production build.
3. `@layer components` exists in the output but is empty — tailwind v4's `components` layer is available for component CSS that must lose to utilities.
4. `@source` for `packages/ui/src` already exists, so utilities used in the package are generated.
5. The only actual current breakage sites are raw `@fertilizer/ui` components receiving tailwind `className` (ChemFormula `Input flex-1`/`w-24` is the concrete one); app-side form inputs use inline styles and are unaffected.

## Open issues

- None blocking: all questions resolved from files + a real production build.
- Minor: whether the `flex` prop of app `Form/Input` ever needs to compete with `.input { display:block }` — inline styles win, so no.
- The `Roboto` `@import url(...)` inside `navigation/style.module.css` survives into the top of the production CSS (browsers hoist @import; order wrt other stylesheets is a browser detail) — cosmetic, not a priority issue.
