# fix-design — research

Investigating 7 UI regressions after the Tailwind v4 migration (branch `v18-ui`, refactor commits `2ebe40e` … `cd27bd9`): theme-ui/rebass/styled-components removed, vanilla-extract classes in layer `components` + Tailwind v4 utilities, preflight enabled at stage 7 (`cd27bd9`).

Key refactor commits:
- `2ebe40e` stage 1 — packages/ui skeleton, VE + tailwind env, theme.css, useColorMode (no-preflight tailwind until stage 5/7)
- `bc9284e` stage 2 — VE atoms in packages/ui + Form controls rewired
- `ff03312` app shell (Root, pages, ColorModeToggle) migrated
- `9eca08a` stage 5 — Calculator on tailwind (Box/Flex → pure tailwind divs, Text/Heading/Button/Card → className, sx → tailwind)
- `276d431` Dropdown/Modal/Sidebar/TabMenu/ForkMe moved to packages/ui
- `cd27bd9` stage 7 — theme-ui/rebass/styled-components fully removed, **preflight enabled**, useColorMode in Root

## Repo/UI architecture notes

- CSS entry: `apps/web/src/styles/app.css` → `@import "tailwindcss"` (v4 full, preflight ON) + `@import "@fertilizer/ui/theme.css"` + `@source "../../../../packages/ui/src"` (makes Tailwind see classNames inside packages/ui). Imported from `apps/web/src/index.tsx`.
- Vite plugins (`apps/web/vite.config.ts`): `tailwindcss()` (@tailwindcss/vite) first, then `vanillaExtractPlugin()`, then react/pwa. Tailwind v4 emits cascade layers `theme, base, components, utilities` (declared by the `tailwindcss` import; `base` holds preflight).
- `packages/ui/src/styles.css.ts`: vanilla-extract `style()` calls all wrapped in `@layer components` via `globalLayer("components")` → layer order: base (preflight) < components < utilities. So utilities can override atoms, and atoms override preflight.
- Theme: `packages/ui/src/theme.css` defines vars on `:root`, dark override on `:root[data-theme="dark"]`. `use-color-mode.ts` (`useColorMode`) sets `data-theme` on `document.documentElement` (html), so `:root[data-theme="dark"]` = `html[data-theme="dark"]` — same thing. localStorage key `ui:color-mode` (migrates legacy `theme-ui:mode`). Hook is called in `apps/web/src/Root.tsx` (stage 7).
- `Root.tsx` also renders `TabMenu` (apps/web/src/components/navigation/TabMenu) + `ForkMeOnGitHub`; page wrapper is `<div style={{ width: 936 }}>` centered.
- ⚠️ **GLOBAL LAYER-ORDER BUG (built CSS, `apps/web/build/assets/index-*.css`)**: the vanilla-extract `@layer components{...}` block is emitted at the very START of the bundle (offset 57), BEFORE tailwind's `@layer properties/theme/base/utilities` blocks and with NO surviving `@layer theme, base, components, utilities;` declaration. CSS layer precedence = last-declared wins, so effective order is `components < properties < theme < base < utilities`. **Result: tailwind `base` (preflight) OVERRIDES the `components` atom styles.** Preflight in base contains `*,:after,:before{box-sizing:border-box;border:0 solid;margin:0;padding:0}` and `button,input,select,optgroup,textarea{...;color:inherit;background-color:#0000;border-radius:0}` and `ol,ul,menu{list-style:none}`. Because base>components, these preflight resets beat `inputClass`/`buttonClass`/`cardClass` etc. This single bug strips borders/padding/background from every atom and is the root cause of issues 1 & 2 (and much of the general look-degradation, plus a contributor to 5, 6, 7).
  - Why it happens: `index.tsx` imports `./Root` (which pulls `@fertilizer/ui` → `styles.css.ts` VE classes) BEFORE `./styles/app.css`. So the VE `@layer components` block is emitted first in the chunk, fixing its position at the bottom. The bare `@layer theme, base, components, utilities;` (top of `tailwindcss` index.css) does not reach the final minify in a position that can re-order blocks (verified: Lightning CSS minify only sorts blocks to match a leading declaration; a declaration after already-materialized blocks does NOT re-sort them, it just appends the not-yet-seen layers).
  - Verified toolchain facts: vite 8 + `@tailwindcss/vite` + `@vanilla-extract/vite-plugin`; tailwindcss 4.3.3; lightningcss 1.33.0 (used by tailwind). `esbuild` minify preserves a leading `@layer a,b,c;` statement; Lightning CSS `transform({minify:true})` DROPS a leading declaration but SORTS all layer blocks to match it (so a leading declaration at final-minify time is the reliable fix), while a trailing declaration is kept as a bare `@layer theme,base;` tail and does NOT re-sort existing blocks.
- Atoms: `button.tsx` (buttonClass), `input.tsx` (inputClass), `number-input.tsx`, `card.tsx` (cardClass), `text.tsx` (Text = plain div; Heading = headingClass, default `as="h2"`), `dropdown.tsx`, `modal.tsx`, `sidebar.tsx`, `checkbox/radio/label`, `cx.ts` (class combiner: falsy values dropped).
- `apps/web/src/components/ui/Form` — app-level form helpers (Input/StyledInput/decimal/number normalizers) wrapping `@fertilizer/ui` atoms; `FormProvider` + `useFormField` for dot-path fields (zustand-backed).
- Icons: `packages/icons` — `Icon`/`IconButton` by name; `IconButton` uses `packages/ui` Button.
- Build: source packages, no build step; vitest/vite share the vite.config plugins (CSS compiled under vitest too).
- Stage-7 note (from app.css comment): preflight was disabled during migration (legacy theme globals conflicted) and re-enabled in stage 7 (`cd27bd9`).

## Issue 1 — Buttons no longer look like buttons

- Atoms: `packages/ui/src/button.tsx` → `buttonClass` in `styles.css.ts`: inline-block, padding 8/16, `color: var(--color-background)`, `backgroundColor: var(--color-primary)`, border 0, radius 4, cursor pointer. In layer `components`.
- (tbd: why it renders flat — suspect preflight interaction or layering; verifying via build CSS)

## Issue 3 — Profile setup: top row of inputs in one column

- Rendered by: `apps/web/src/components/Calculator/Options/RecipeTuneForm.tsx` (modal titled "Настройка профиля", opened from `Recipe.tsx`). Top row = `<div>` (line ~115) containing `MACRO_ELEMENT_NAMES.map(...)` `RecipeInput`s + EC `RecipeInput`; each `RecipeInput` is itself a `div.flex max-w-24 flex-col` (block-level).
- **Root cause (confirmed via git):** in stage 5 (`9eca08a`) the container was rebass `<Flex>` (a flex row) and got converted to a plain `<div>` without `className="flex"`:
  ```
  -      <Flex>
  +      <div>
            {MACRO_ELEMENT_NAMES.map(...)}
  -      </Flex>
  +      </div>
  ```
  Unlike the sibling rows (balance row, micro row, buttons row), which did get `flex` classes, this macro row did not — so the block-level `RecipeInput` divs stack vertically. (The row around the `<table>` at ~line 150 is the same kind of change but visually benign.)
- Fix options:
  1. (recommended) In `RecipeTuneForm.tsx` give the macro-row `<div>` `className="flex"` (or `flex flex-wrap` if rows should wrap) — one-line fix in apps/web.
  2. Alternatively wrap in a utility div at call site — same effect, no benefit.

## Issue 4 — Hidden file `input` escapes and covers the sidebar-toggle (menu) button

- Components: `apps/web/src/components/Calculator/ImportExport/ImportFertilizers.tsx`, `ImportRecipes.tsx`, `ImportState.tsx` — all three render the same pattern:
  ```tsx
  <IconButton ref={buttonRef} name="import">
    <input type="file" accept="text/csv, .csv" onChange={...}
      style={{ top: 0, left: 0, position: "absolute", opacity: 0, ...size }} />
  </IconButton>
  ```
  where `size = { width, height }` is measured in a `useEffect` from `buttonRef.current?.offsetWidth / offsetHeight` (initial `{width: 0, height: 0}`, so React starts as `width:0px;height:0px`, then re-renders at the button's real size).
- The input has NO width/height CSS class, no z-index, no pointer-events, no cursor — only `top:0; left:0; position:absolute; opacity:0` + the JS-measured inline width/height. No `hidden`/`display:none` — it is a live hit-target.
- Render sites: `ImportFertilizers` in `apps/web/src/components/Calculator/FertilizerManager/List.tsx` (line 62, inside the "Импорт/Экспорт" `Card`); `ImportRecipes` + `ImportState` in `apps/web/src/components/Calculator/index.tsx` (lines 51, 59, same card pattern).
- `IconButton` = `packages/icons/src/IconButton.tsx` → wraps `packages/ui` `Button` → `<button className={cx(buttonClass, ...)}>`. `buttonClass` (`packages/ui/src/styles.css.ts`): inline-block, padding 8/16, `color: var(--color-background)`, `backgroundColor: var(--color-primary)`, border 0, radius 4, cursor pointer — **no `position` property**. New `IconButton` props: name/size/color/padding/alignSelf/marginRight/backgroundColor + HTML attrs; **no `sx` prop** (legacy one had it, via rebass Button).
- **Root cause (confirmed via git, stage 5 `9eca08a`):** legacy markup was `<IconButton sx={{ position: "relative" }} ref={buttonRef} name="import">` — the `position: relative` made the BUTTON the containing block of the absolutely-positioned file input, so the input sat exactly over its own button. The migration dropped `sx` (new IconButton has no such prop) and no replacement positioning was added:
  ```
  -      <IconButton
  -        sx={{ position: "relative" }}
  -        ref={buttonRef}
  -        name="import"
  -      >
  +      <IconButton ref={buttonRef} name="import">
  ```
- Containing-block consequence: with no `position` on the button and **no positioned ancestor anywhere up the tree** (Card = plain div, page wrapper divs in `Calculator/index.tsx` and `Root.tsx` are plain flex divs), the `position:absolute; top:0; left:0` input resolves against the **initial containing block (the viewport)** → it parks at the top-left corner of the window, sized ≈ the import button (≈ 56×40 px), and sits above everything there (later in paint order / child stacking).
- What lives at the viewport top-left: the sidebar toggle. `Root.tsx` line 16-19: `<div className="flex justify-between"><div className="p-1"><TabMenu …/></div>…` → `apps/web/src/components/navigation/TabMenu.tsx` renders `<Sidebar>` with NO `button` prop → default toggle in `packages/ui/src/sidebar.tsx` line 124: `{button ? button(renderCbProps) : <Icon size={42} name="menu" onClick={actions.open} />}` — a 42 px menu icon (`packages/icons/src/Icon.tsx`: div > svg), the first painted element of the page.
- Observed effect: the escaped 0-opacity input overlays the menu icon and steals its clicks (opens the file dialog instead of the sidebar); the button beneath gets no hover/active feedback — hence the "shadowed/tinted" look. Note: on screens where the sidebar auto-docks (window > 1650 px, `sidebar.tsx` line 99) the overlay is docked but the toggle icon still renders, so the cover still applies.
- Also relevant: `sidebar.tsx` toggle is a bare `Icon` (a `<div onClick>`), not a `Button` — no buttonClass styling; `ForkMeOnGitHub` span (positioned absolute, top-right, z 100) is a sibling, not an ancestor — no interference.

## Issue 5 — Dropdown "съежился" (trigger row + list items lost their box)

- Component: `packages/ui/src/dropdown.tsx` (`Dropdown`, `DropdownItem`, `DropdownList`). Markup (post-migration, moved verbatim-ish in `276d431` from `apps/web/src/components/ui/Dropdown/`):
  ```tsx
  <div className="flex flex-col" style={widthStyle} ref={containerRef}>   // widthStyle = width prop only
    <div className="relative">
      <input type="text" className={inputClass} … />
      <div className="absolute right-0 top-0">
        <Icon name="chevron-down" className={dropdownChevronClass} onClick={…} />
      </div>
    </div>
    <div className="relative">
      <div className="absolute flex flex-col w-full">
        {opened && <DropdownList items={…} />}   // <div role="listbox" className={dropdownListClass} style={{maxHeight: h*5}}>
      </div>
    </div>
  </div>
  ```
- Classes (all in layer `components`, `packages/ui/src/styles.css.ts`):
  - `inputClass` — display block, width 100%, **padding 8**, border `1px solid var(--color-text)`, transparent bg, color var(--color-text), radius 0, webkit spinners hidden.
  - `dropdownChevronClass` — color var(--color-text), **height 3rem**, opacity .5/.7 hover, flex centered.
  - `dropdownListClass` — bg var(--color-background), shadow-small, padding 0, overflow-y auto, z-index 3.
  - `dropdownItemClass` — position relative, z 1, **padding 8**, flex, border 0, bg transparent, appearance none, text-left, font inherit, cursor pointer, `::before` highlight (bg var(--color-highlight), opacity 0 → .1 hover).
- Width logic: NO width class anywhere in the component. Root is a block-level `display:flex` div → stretches to parent; `width` prop (optional number) → inline `style={{width}}`. No usage site passes `width`. Input is `width:100%`; list wrapper is utility `w-full`. So horizontal width is inherited from the call site — that part is intact.
- Usage sites (apps/web): `Options/Recipe.tsx` line 84 (wrapper `div.mx-2.flex-1`), `FertilizerSelect/AddItem.tsx` line 32 (wrapper `div.flex-1.pr-2`), `pages/DensityCalculator/index.tsx` line 78 (parent `div[style width:300]`), `pages/Example/index.tsx` line 18 (plain div, page-width).
- What the GLOBAL LAYER-ORDER BUG does to it (verified in built `apps/web/build/assets/index-fH57vXZr.css`: `@layer components` at offset 57, `@layer base` preflight at 4691 → base wins):
  - `inputClass` padding 8 + `border: 1px solid var(--color-text)` are overridden by preflight `*{margin:0;padding:0;border:0 solid}` and `input{background-color:#0000;color:inherit}` → the trigger `<input>` renders as a bare text line: **no border, no padding**.
  - Trigger row height used to be driven by the input's box (legacy rebass `Input`/IconDown 3rem row); now row height = single text line (~1em), while the chevron (`height: 3rem`) is `position:absolute` (out of flow) → the widget collapses vertically: observed "съежился".
  - `dropdownItemClass` padding 8 also stripped by the same preflight universal rule → open list items have no vertical/horizontal padding (cramped list, `hr` separators touch text).
  - `dropdownListClass` bg/shadow/z-index survive (preflight doesn't set those on divs); `w-full`/`flex` utilities survive (utilities layer is topmost).
- Legacy comparison (`git show 276d431^:apps/web/src/components/ui/Dropdown/Dropdown.tsx`): rebass `<Flex flexDirection="column" width={width}>` root (same full-width behavior), rebass `<Input>` — theme-ui `Input` = `Box as="input" variant="input"` with `display:block; width:100%; p:2 (16px padding); border:1px solid; borderRadius:4; bg:transparent; color:inherit` (verified in `node_modules/.pnpm/@theme-ui+components@0.3.1…/dist/index.js`) → a real ~3rem-tall bordered box; styled `IconDown` with `height: 3rem` — so the trigger row was a 3rem-tall bordered box. Migration kept the 3rem chevron class but the input lost its box (and the layer-order bug strips even the VE `padding:8`/border), so the row height anchor disappeared.
- Constraint: the chevron wrapper `<div className="absolute right-0 top-0">` has no width/height of its own — sized by the Icon div (3rem tall, width = svg 1.5em).

## Issue 6 — Help link tree lost its tree shape (no indentation/markers)

- "Tree of links" exists in two places; both are plain nested `<ul><li>` trees with **zero custom tree CSS** — the shape comes entirely from browser-default `ul` styling (padding-inline-start 40 px + 1 em block margins + disc markers):
  1. **Help pages (markdown docs):** `apps/web/src/pages/Help/Help.tsx` → `ReactMarkdown` (remark-gfm + rehype-raw + rehype-sanitize) renders `src/docs/**/*.md` (imported `?raw`, page list in `apps/web/src/pages/Help/pages.ts`). Docs contain nested link lists, e.g. `apps/web/src/docs/references.md` lines 35-62: 1st-level `* [..](url)`, 2nd-level indented `  * [..](url)`, 3rd-level `    * [..](url)` (also `technique.md:257+`, `profile/README.md:319+`, `solution/README.md:95`, `grow.md:6-7`). react-markdown maps these to nested `<ul><li><a>` — no app CSS targets them.
  2. **Sidebar "Справка" submenu:** `apps/web/src/components/navigation/TabMenu.tsx` → `HelpPagesSubMenu` → `RenderHelpPages` (lines 36-51): recursive `<ul><li>` where each `<li>` holds a react-router-tabs `NavTab` (renders `<a class="nav-tab">`, see below) + recursive children `<ul>`. Rendered inside `<RoutedTabs tabClassName="tab-link">` → `div.react-router-tabs` wrapper; nested `NavTab`s keep their default class `nav-tab` (the `tabClassName` remap only applies to direct children of RoutedTabs).
- Only CSS touching these trees:
  - `apps/web/src/components/navigation/style.css` (imported by TabMenu.tsx): `.nav-tab { font-family:Roboto; background-color:#fff; display:inline-block; padding:10px 25px; color:#555; border-bottom:1px solid #ddd; text-decoration:none }`, `.nav-tab:hover { background-color: oldlace }`, `.nav-tab.active { background-color:#fff; color:#333; border:1px solid #ddd; border-top:2px solid orange; … }`, and `.react-router-tabs ul { list-style-type:none }`, `.react-router-tabs ul > li a { width:100% }`. No rule sets ul padding/margin/indent or list markers anywhere else.
  - Same content ships in `apps/web/node_modules/react-router-tabs/styles/react-router-tabs.css` (package copy, color `#bbb` variant), but the app does not import that file — only `style.css` is imported (via TabMenu.tsx).
  - In the built CSS these `.nav-tab`/`.react-router-tabs` rules end up inside the same `@layer components{…}` block as the vanilla-extract atoms (`apps/web/build/assets/index-fH57vXZr.css`, right after the `._1uo1289*` rules).
- Pre- migration look (no Tailwind before stage 1 — `2ebe40e` commit msg: "no-preflight tailwind until Stage 5/7", preflight ON only in stage 7 `cd27bd9`): browser defaults gave every nested `ul` `padding-inline-start:40px; margin:1em 0; list-style-type:disc` → visible indent per depth + bullet markers (sidebar tree: markers suppressed by the `.react-router-tabs ul` rule, indent kept; markdown tree: markers + indent). Links were default blue/underlined `<a>` (markdown) / `.nav-tab` styled links (sidebar).
- Post-preflight state (built `@layer base` block, verified in `index-fH57vXZr.css`): `*{margin:0;padding:0;border:0 solid}` kills the 40 px indent and 1em margins; `ol,ul,menu{list-style:none}` kills disc markers; `a{color:inherit;text-decoration:inherit}` strips the blue/underline from markdown links. Result: both trees render as flat, unindented, marker-less link rows — "no longer looks like a tree".
- Note on the layer bug: here the regression is caused by preflight's *presence* (stage 7), not strictly by the reversed layer order — no `components`-layer rule styles these `ul`s at all, so preflight wins whether or not `base`/`components` order is fixed. The layer bug matters for any fix that re-adds tree styling in a `components`-layer rule (it would still lose to preflight until the order is fixed).
- Constraint: `.nav-tab` links are `display:inline-block; padding:10px 25px` + `.react-router-tabs ul > li a { width:100% }` — the sidebar links currently span the full list width; any tree restyle must keep `a` hit-area behavior (NavTab click navigation).

## Issue 7 — Dark theme: palette, wiring, and the non-switching pieces

- Theme file: `packages/ui/src/theme.css` (imported by `apps/web/src/styles/app.css` via `@import "@fertilizer/ui/theme.css"`).
  - Light `:root` (full polaris palette): `--color-text:#454f5b; --color-background:#fff; --color-primary:#5c6ac4; --color-secondary:#006fbb; --color-highlight:#47c1bf; --color-muted:#e6e6e6; --color-gray:#dfe3e8; --color-danger:#f44; --color-accent:#f49342; --color-darken:#00044c;` + element colors `--color-no3:#05ad11; --color-nh4:#fff; --color-p:#dbc403; --color-k:#e07206; --color-ca:#d1c7c7; --color-mg:#ab0ae0; --color-s:#fff;` + `--font-body/--font-heading/--font-mono`, `--line-height-body/heading`, `--font-weight-body/heading`, `--shadow-small/--shadow-large`.
  - Dark `:root[data-theme="dark"]` — **only 5 overrides**: `--color-text:#9d9d9d; --color-background:#000639; --color-primary:#9c6ade; --color-secondary:#b4e1fa; --color-highlight:#b7ecec;` Everything else (muted, gray, danger, accent, darken, element colors, fonts, shadows) is shared with light. (Legacy polaris preset `modes.dark` had exactly these 5 plus `muted:#e6e6e6` — same value as light, so nothing effectively lost. Verified against `node_modules/.pnpm/@theme-ui+preset-polaris@0.3.0/.../dist/index.js`.)
- `data-theme` wiring: `packages/ui/src/use-color-mode.ts` (`useColorMode`) → `document.documentElement.setAttribute("data-theme", mode)` → `html[data-theme="dark"]`; localStorage `ui:color-mode` (migrates legacy `theme-ui:mode`); hook called in `apps/web/src/Root.tsx` line 12; toggle = `apps/web/src/components/ColorModeToggle.tsx` (moon/sun `Icon`, 42 px) inside `TabMenu`.
- **Page canvas: nothing styles `body`/`html`/`#root`** — no source CSS and no built CSS rule sets a background or text color on them (verified in `apps/web/build/assets/index-fH57vXZr.css`: no `body`/`#root` rules). Page background is browser-default white in BOTH themes; page text color is initial black in both themes.
- Variable consumers (map): only `packages/ui/src/styles.css.ts` atoms — `inputClass` (color/border = `--color-text`), `buttonClass` (bg `--color-primary`, color = `--color-background`), `cardClass` (bg `--color-background`), `headingClass` (color `--color-text`), `spinnerButtonClass` (color `--color-text`), `dropdownChevronClass`/`dropdownItemClass`/`dropdownListClass` (text + `--color-highlight` + bg `--color-background`). App code consumes NO theme vars (grep: zero `var(--color-*)` in `apps/web/src`). `--color-no3…--color-s`, `--color-muted/gray/danger/accent/darken`, fonts, line-heights, weights, `--shadow-large` are defined but consumed only by the atoms above (element vars: zero consumers).
- Hardcoded (theme-blind) colors in shipped code:
  - `packages/ui/src/styles.css.ts`: `modalCardClass { backgroundColor:"#fff" }`, `sidebarCardClass { backgroundColor:"#fff" }`, `modalOverlayClass` and `sidebarOverlayUndockedClass` `rgba(255,255,255,0.5)`, `forkMeLinkClass` `#000/#fff/#c11` (decorative ribbon).
  - `apps/web/src/components/navigation/style.css`: `.nav-tab` `#fff` bg / `#555` text / `#ddd` border / `oldlace` hover / `#333`+`orange` active (plus Roboto font import).
  - `apps/web/src/components/Calculator/FertilizerSelect/SelectedListItem.tsx`: `text-black` utility class + hardcoded `ELEMENT_BG` hexes (NO3 `#05AD11`, NH4 `#FFF`, P `#DBC403`, K `#E07206`, Ca `#D1C7C7`, Mg `#AB0AE0`, S `#FFF`) on element chips (also rendered by `Result.tsx` via the same `Element`).
  - `apps/web/src/components/Calculator/Options/RecipeTuneForm.tsx` (`RecipeInput`): inline `backgroundColor: isImportant ? "#b3f7b8" : undefined`, `color: isBlocking ? "red" : undefined`, `borderColor: "black"` on `NumberInput`.
  - `apps/web/src/components/Calculator/Options/Recipe.tsx`: recipe swatch `backgroundColor: item.color || "gray"`.
  - `apps/web/src/pages/App/App.css`: CRA-template leftovers `.App-header { background-color:#282c34; color:white }` — `pages/App` is registered in `pages/index.ts` but routed by no `Route` in `Root.tsx` (dead page; CSS still bundled via `pages/App/index.tsx` import).
  - `apps/web/index.html`: `<meta name="theme-color" content="#000000">`.
- Contrast facts (observed, dark mode): card bg = `#000639` (dark navy). Plain text = bare `Text` div (`packages/ui/src/text.tsx`: `<div>` with no color) → inherits black from body → **black text on `#000639` card ≈ 1.1:1 — effectively invisible**; that is every non-Heading text inside cards (labels, rows, table cells, list text), because `cardClass` sets background but no color. Headings inside cards = `headingClass` `--color-text` `#9d9d9d` on `#000639` — readable; outside cards (white page bg) `#9d9d9d` on white — faint. Inputs: color+border `#9d9d9d` on card — ok, but with the layer-order bug their padding/border are stripped (see Issue 2/5). Buttons: `#000639` text on `#9c6ade` — ok. Sidebar/modal cards: hardcoded `#fff` → stay white in dark mode (`.nav-tab` `#555` on `#fff` still readable; modal content inherits black on `#fff` readable) — i.e. dark mode is a patchwork: white cards on white page around dark-navy calculator cards with black text on them.
- Legacy reference: pre-migration dark mode ran through theme-ui (`ThemeProvider` + polaris preset, `apps/web/src/themes/index.ts`: `...polaris` + `colors.modes.dark.text:"#9d9d9d"` + element NO3…S colors + `styles.button:{color:"background"}`); theme-ui components (Card/Text/Heading/Button) resolved `text`/`background`/`primary` tokens from the theme under `data-theme`, so the same 5-var dark palette was applied by the component layer. Legacy app had no `<Global/>` either (no body bg) — the dark page background was white there too; what changed is that the plain `Text`/body text no longer resolves to `--color-text`, and card text color is not set at all.
