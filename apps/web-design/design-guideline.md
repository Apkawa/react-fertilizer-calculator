# Design Guideline — Hydroponics Fertilizer Calculator (Layout Demo)

**Status:** formal design contract for the static layout under `apps/web-design/`.
**Applies to:** `index.html`, `style.css`, `color-*.css`; future native implementation of the same UI.
**UI language:** Russian (all visible strings, labels, aria-labels). This document is written in English by convention for design documentation.

---

## 1. Purpose and scope

The demo is a pixel-faithful visual copy of the current calculator screen of the PWA (`apps/web`). It is a **layout-only artifact**: static markup, minimal JavaScript (theme/scheme switching, drawer, modal open/close, checkbox accordions — no business logic), demo data frozen (§7).

It encodes the design decisions approved during iterations v1–v11 and serves as the specification for rebuilding this UI inside the real app (`@fertilizer/ui`).

Out of scope: page routing, real calculation, fertilizer editing modal, drag-and-drop implementation (§3.5 grip is a visual affordance only).

---

## 2. Layout system

### 2.1 Breakpoint model (two independent axes)

| Zone | Sidebar | Calculator columns | Notes |
|---|---|---|---|
| `< 800px` | hidden, hamburger + drawer | single column, mobile order | content renders before the fertilizer list |
| `800–1249px` | hidden, hamburger + drawer | two columns (desktop layout retained) | sidebar visibility is **not** tied to the layout breakpoint |
| `≥ 1250px` | fixed, visible, 300px | two columns | content shifted `padding-left: 300px` |

- Sidebar threshold: **1250px** (`@media (min-width: 1250px)` / `max-width: 1249px`).
- Calculator two-column threshold: **800px** (`min-[800px]:grid-cols-2`).
- **Never** use Tailwind `md:`; only arbitrary variants (`min-[800px]:`, `max-[800px]:`, `max-[1249px]:`) and plain CSS media queries. Breakpoints must stay consistent between markup and CSS.

### 2.2 Content geometry

- Content column: `max-width: 936px`, centered.
- At `≥ 1250px` the fixed sidebar (300px, `background: var(--card)`, right border, soft shadow) overlaps the left edge; content uses `padding-left: 300px`.
- Mobile stack order (HTML order right-first, Tailwind `order` classes swap it): Result/Recipe area first (`order-1 min-[800px]:order-2`), fertilizer list second (`order-2 min-[800px]:order-1`).

### 2.3 Drawer (sidebar below 1250px)

- Toggle: hamburger button (2.5rem square, standard button visual), `aria-controls="sidebar"`.
- Open state: `html.drawer-open`; overlay `position: fixed; inset: 0; background: color-mix(--bg 60%)`; body scroll locked; sidebar becomes `role="dialog" aria-modal="true" aria-label="Меню"` **only while open** (restores `aria-label="Боковое меню"` on close).
- Esc closes modal first, then drawer.

---

## 3. Component standards

### 3.1 Buttons — one canonical visual

All buttons share one base: `.icon-btn` (icon-only, 2.5rem × 2.5rem) and `.btn` (text, or icon+text). Identical border, radius, background, height, hover across the entire page (sidebar header, recipe header, fertilizers header, card actions, modals, `Рассчитать`).

- Height `2.5rem`; radius `0.5rem`; border `1px color-mix(--primary 35%)`; background `color-mix(--primary 12%)`; icon color `var(--primary)`; hover tint 22%.
- Icon+text buttons: `inline-flex items-center gap 0.5rem`, SVG 24×24 (e.g. `Сохранить комплекс` = save glyph + text, `Отправить на миксер` = broom glyph + text).
- No filled "primary" buttons; emphasis comes from the tint, not solid color.
- Row actions: **grip → checkbox → name → weight → edit → delete** (delete far-right; edit immediately left of delete). Delete is a fully standard icon-button with trash-bin glyph; hover only: danger tint background + `var(--danger)` icon.
- Scheme files may override geometry (radius, bevel, border style) per scheme (§4.3); the *identity* of all buttons within one scheme must remain identical.

### 3.2 Chips

Two chip types; both are squarish tinted cells, 2 lines: **label bold `var(--text)` (0.75rem) above value regular `var(--text)`**.

- **Balance chips** (ΔΣI, EC, %NH4, K:N, K:Ca, K:Mg): borderless, background `color-mix(--muted 6%)`; rows `flex flex-nowrap` — **always one line**, never wrap; compact at <800px (font ~0.7rem).
- **Element chips** (fertilizer composition): tinted background + border from `--el-tint`; denser than balance chips (smaller padding/min-width); rows `flex flex-wrap` (composition may wrap to multiple lines on purpose); values carry **no `%` suffix** (labels like `%NH4` are label text, not suffixes).

### 3.3 Element cells (Result)

- Grid: always **1 row × 8 cells** (macro and micro), both desktop and mobile; mobile compaction via `@media (max-width: 799px)` (smaller padding/fonts, no horizontal overflow at 390px).
- Three lines per cell: **name** (bold 700, ~0.75rem), **value** (regular 400, ~0.875rem), **delta** (~0.75rem).
- Delta has **no `Δ` symbol**: signed value only — `0` neutral `var(--muted)`, positive `+N` green (`--ok`), negative `−N` red (`--deficit`).
- Element classes (`NO3, NH4, P, K, Ca, Mg, S, Cl`, micro set) color **background/border only** (`--el-tint`, 12%/30% color-mix); text is always `var(--text)` in both themes.
- Micro elements share the neutral gray tint: `--el-micro == --el-s`.

### 3.4 Inputs

`.input`: full width, `box-sizing: border-box`, 1px `var(--border)`, radius 0.5rem, `var(--card)` background, focus outline `2px var(--primary)` inset.
Prefixed fields: `.input-prefixed` + absolute `.input-prefix` — the `1:` prefix belongs **inside** the concentration/ratio field, never attached to neighboring inputs.
Field rows in options cards: label left (`flex-1 min-w-0`), input right (fixed ~`w-24/w-28`, right-aligned text); grid gaps ≥ `gap-3`; inputs never touch each other.
Demo numeric values use the Russian decimal comma (`1,8`, `194,7`) with `type="text" inputmode="decimal"`.

### 3.5 Fertilizer manager rows

The fertilizer selector is **merged into a manager-style list**; no dropdown, no editing modal.

- Section header: title `Удобрения` + icon-button cluster right of the title: **add (+) → import → export → reset**.
- Row anatomy: grip handle (6-dot SVG, `cursor: grab`, `aria-label="Переместить"`; DnD not implemented) → checkbox (`aria-label="Выбрать «…»"`) → name → weight (`N г`, selected only) → edit → delete, all on one 2.5rem line.
- Unselected rows: `.is-inactive` — opacity 0.6, name muted, chips neutral gray tint; checkbox toggles the class.
- Composition chips include full macro **and** micro content (up to 11 chips, wrapping allowed to evaluate fit).

### 3.6 Options cards

Options are split into separate cards, each a card in the right column:

1. **Рассчитать + Раствор** (volume/concentration `1:[1000]`, inline `Или … мл на …` alternative).
2. **Долив раствора** — checkbox acts as an **accordion**: unchecked ⇒ fields hidden (toggle the `hidden` class, not the attribute — utilities override it). Field rows: label left / input right: Новый объем, Текущий объем, Текущий EC, EC профиля, Концентрация солей профиля (all Russian labels).
3. **Разбавление концентрата** — checkbox accordion; `Объем, л`; `Концентрация` = label + `1:` prefix + input; inline row `Или [10] мл на [1000] мл.рабочего раствора`.
4. **Расширенные** — `<details>` card (ignore checkboxes + accuracy radio group).

### 3.7 Modals

Generic pattern: `.modal-overlay` (`is-open` toggles flex), `.modal-panel` `min(560px, 100% - 2rem)`, `var(--card)`, border, radius 0.75rem, deep shadow. Overlay click and Esc close. Triggered from `Сохранить комплекс` / `Отправить на миксер` / recipe tune/save buttons.

---

## 4. Theming and color schemes

### 4.1 Two orthogonal axes

- **Theme:** `html[data-theme]` = `light | dark | system`; localStorage key `theme`; click cycle light → dark → system; the head script applies the attribute DOM-free (documentElement only); `matchMedia('(prefers-color-scheme: dark)')` drives `system`, with a change listener. Toggle button `aria-pressed` reflects the applied dark state.
- **Scheme:** `html[data-scheme]` = `default | win95 | retro | nature | science`; localStorage key `scheme`; `<select id="scheme-select">` immediately right of the theme button; applied by the head script before paint. Theme × scheme are fully orthogonal (every scheme has light and dark variants).

### 4.2 CSS architecture

- `style.css`: **scheme-independent structure only** — layout, grid, typography sizes, positions, modal/drawer mechanics, media queries. Component rules read `var(--*)` tokens.
- `color-<name>.css` (5 files, all linked): the entire color identity of a scheme — token values for light and dark variants plus scheme-specific component overrides (button geometry, bevels, borders, shadows).
- Specificity contract: scheme light blocks `html[data-scheme]` (0-1-1) and scheme dark blocks `html[data-scheme][data-theme="dark"]` (0-2-1) beat `:root` (0-1-0) and the `prefers-color-scheme` fallback (0-2-0). The fallback lives in `color-default.css` only.

### 4.3 Schemes

| Scheme | Character | Light surfaces | Dark surfaces | Primary | Geometry |
|---|---|---|---|---|---|
| default | modern neutral | `#f5f6f8` / `#fff` | `#14161a` / `#1e2127` | `#5c6ac4` | radius 0.5rem, soft shadows |
| win95 | OS-era gray bevel | `#c0c0c0` / `#d4d0c8` | `#26262e` / `#3a3a42` | `#000080` (dark: `#7fa3d9`) | radius 0, inset bevel buttons, sunken inputs |
| retro | 90s web | `#e8e4d8` / `#f2ecdd` | `#1a2630` / `#24333f` | maroon `#8b4513` (dark: `#b3722f`) | 2px borders, filled maroon buttons, yellow active accents, radius 0.25rem |
| nature | warm paper / forest | `#eef3e6` / `#f6faf0` | `#16221a` / `#202e25` | green `#3e7a3e` (dark: `#6ea36d`) | radius 0.75rem, green-tinted soft shadows |
| science | cool lab | `#eef4f8` / `#fff` | `#0f1a24` / `#16232f` | teal `#2f7f9e` (dark: `#4f9fbe`) | crisp 1px borders, cyan glow shadows |

### 4.4 Token contract

Every scheme defines, for both variants:

```
--bg --card --text --muted --border --primary --danger --ok --deficit --excess
--el-no3 --el-nh4 --el-p --el-k --el-ca --el-mg --el-s --el-cl --el-micro
```

Rules:

- Element tokens are **tints**, consumed via `color-mix(... 12% / 30%)` for backgrounds/borders; they never color text.
- `--el-micro` must equal `--el-s` (neutral gray micro) in every scheme.
- Status semantics (Result deltas): `--ok` positive, `--deficit` negative, neutral `--muted` zero. Dark variants must keep contrast.
- No color literals outside `color-*.css`.

---

## 5. Typography

- Family: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Card titles: ~1.125rem semibold. Section sub-labels (`Для 1 л раствора`, table headers): 0.75rem uppercase muted, letter-spacing 0.03em.
- Element/chip labels: bold 700; values: regular 400; same `var(--text)` everywhere.
- Body/control text: 0.875rem; sidebar submenu 0.8125rem; mobile compact tiers reduce chip/cell fonts (~0.625–0.7rem) without wrapping.

---

## 6. Iconography

Inline SVG only, 24×24, stroke glyphs, `stroke-width: 2` (uniform across the page; no filled bold glyphs except the grip and the system-theme half-circle fill): plus, import/export (tray), restart, save (diskette), broom, tune, trash-bin, pencil, sun, moon, **system = circle with left half filled**, hamburger, chevron. Grip = 6 filled dots (18px), not a button-styled control. Icons mirror `packages/icons` where the app has equivalents.

---

## 7. Data and semantics conventions

- Δ convention: **Δ = recipe − result**; display as signed number without the `Δ` glyph (balance chip labels keep `ΔΣI`).
- Demo data is fixed: recipe Перец Минвата Базовый, doses 224/14/39/264/200/36/56/0; selected fertilizers 8.2 / 69.7 / 17.5 / 99.3 г; totals 194.7 г; EC 1.83; macro deltas K −49, Ca +35, Mg +36; micro mg/l values without units; inactive demo rows: Акварин Хвойный (full macro+micro composition), Аквамикс Л, Fe 6% ЭДДГА (real names/values from `constants/fertilizers.ts`).
- All UI strings Russian; deliberate deviations from the app are documented in `spec.md` §6.

---

## 8. Accessibility

- Native controls (checkbox, radio, select, details) — no invented widgets.
- Every icon-only button has a Russian `aria-label`; theme toggle `aria-pressed` reflects applied dark state.
- Drawer dialog semantics (§2.3) — role/aria-modal only while open.
- Focus: visible inset outline on inputs; interactive targets ≥ 40px (2.5rem).
- No horizontal overflow at 390px or any scheme×theme combination.

---

## 9. Implementation constraints

- Tailwind Play CDN with inline config: `corePlugins: { preflight: false }`, `darkMode: ['selector', '[data-theme="dark"]']`, colors mapped to `var(--*)` tokens via `theme.extend.colors`.
- Head script must stay DOM-free (documentElement attributes only); behavior wiring lives in the body-end script.
- JavaScript budget: theme cycle, scheme select, drawer, modals, two accordion checkboxes, fertilizer checkbox toggle — nothing else.
- Scratch artifacts go to `.tmp/`, caches to `.cache/`.

---

## 10. Do / Don't

**Do:** keep one button standard; keep breakpoint zones (800 / 1250) consistent everywhere; derive all colors from tokens; keep element tints to backgrounds; verify light × dark × scheme matrix for regressions.

**Don't:** use `md:` variants; color element text with element colors; wrap balance chip rows; attach prefix text to wrong inputs; add colored primary fills; introduce edit modal or DnD logic into this demo; put literals outside `color-*.css`.
