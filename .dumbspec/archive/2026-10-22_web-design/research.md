# Research: fertilizer-calculator web PWA — functionality & UI scan

> Superficial scan (context only, no design decisions). Repo: pnpm workspace, React 16 + TS (strict) + Vite, zustand, HashRouter, @fertilizer/ui (plain CSS + tailwind v4), @fertilizer/icons, calculation core in packages/calculator (calculate_v4).

## 1. Pages and routes

Routes are declared in `apps/web/src/Root.tsx` (HashRouter + Switch), pages are lazy-loaded in `apps/web/src/pages/index.ts`. Content column is fixed at 936 px.

| Route | Page file | Purpose |
| --- | --- | --- |
| `/` | `pages/Calculator/index.tsx` | Main calculator page; wraps its own inner HashRouter with `Calculator` at `/` and `FertilizerManager` at `/fertilizers` (nested router inside the page — unusual). |
| `/fertilizers` | (inside Calculator page) | Fertilizer CRUD manager page (see §2). |
| `/formula/:formula?/:percent?` | `pages/ChemFormula/index.tsx` | "Парсер формул": parse a chemical formula (+ percent purity), shows atomic-mass table and NPK (oxide & pure) tables. URL-synced inputs. |
| `/density/:formula?/:concentration?/:density?/` | `pages/DensityCalculator/index.tsx` | "Калькулятор плотности": salt dropdown (DATA_KEYS) + concentration/density number inputs, cross-calculated via spline (density-calculator package). |
| `/help/:slug*` | `pages/Help/Help.tsx` + `pages.ts` | "Справка": renders raw `.md` from `src/docs/` (react-markdown + GFM + raw HTML sanitized) with a nested page tree (2 child pages). |
| `*` | `pages/NotFound/index.tsx` | Plain `<h1>Not found</h1>`. |
| `App` | `pages/App/index.tsx` | Leftover CRA boilerplate ("Edit src/App.tsx…") — registered in `pages/index.ts` but **not routed** anywhere in Root.tsx. |

Top chrome: `components/navigation/TabMenu.tsx` (ui `Sidebar` + react-router-tabs): tabs Калькулятор (`/`), Удобрения (`/fertilizers`), Парсер формул (`/formula/`), Плотность (`/density/`), Справка submenu (all help slugs), plus `ColorModeToggle` (sun/moon). `ForkMeOnGitHub` badge + build footer (`__VERSION__-ref hash [date]`) in Root.

## 2. Calculator screen structure

Main container `components/Calculator/index.tsx` (`CalculatorContainer`): `FormProvider` + one `<form>` (submit → `store.calculate()`). Two-column flex layout (columns side by side >800px; **reversed stack** ≤800px — mobile order: Result/Options/Recipe on top, FertilizerSelect bottom):

- **Left column — `FertilizerSelect`** (`Container.tsx` → `SelectedList`): "Add fertilizer" Dropdown (from stored `fertilizers`, with per-item `+` IconButton, already-selected items disabled) + list of selected `SelectedListItem` cards (name, element chips NO3/NH4/P/K/Ca/Mg/S with per-element background colors, calculated weight `…г (+… мл)` if a result exists, `close` IconButton to remove). Shows `fertilizersError` text when set (e.g. "Выберите удобрения").
- **Right column, top — `Recipe`** (Options/Recipe.tsx): recipe Dropdown (saved recipes with color dot, inline name editing, `-` remove button), `save` and `broom` (reset) IconButtons; a row of 8 macro element number inputs (NO3, NH4, P, K, Ca, Mg, S, Cl — g/L) via `RecipeElementForm`; a `tune` IconButton opening `RecipeTuneForm` modal (fine-tune by EC, ratios K:N/K:Ca/K:Mg/NH4:NO3, element matrix with important/blocking cells); read-only balance cells: ΔΣ I (ion balance), EC, %NH4, K:N, K:Ca, K:Mg.
- **Right column, middle — `Result`** (see §3).
- **Right column — `Options`**: `Calculate` submit Button (full width) + cards Solution / ToppingUp / Dilution / IgnoreElement+Accuracy.
- **Right column, bottom — Import/Export card** (inline in `CalculatorContainer`, not the `ImportExport` folder's own card): rows "Рецепты" (Import/Export CSV + `restart` reset) and "Настройки" (Import/Export state).

### Data model

`CalculatorState` (`components/Calculator/types.d.ts`): `calculationForm: CalculatorFormValues | null`, `result: CalculateResult | null`, `toppingUpResult`, `process: boolean`, `error: boolean`, `fertilizers: FertilizerInfo[]`, `recipes: Recipe[]` (`{name, color?, elements: NeedElements}`).

`CalculatorFormValues`: `accuracy` (g), `solution_volume` (l), `solution_concentration: Concentration` (k factor 1:x or v_1/v_2 ml), `recipe: NeedElements` (16 element keys: 8 macro `NO3,NH4,P,K,Ca,Mg,S,Cl` + 8 micro `Fe,Mn,B,Zn,Cu,Mo,Co,Si`), `fertilizers: FertilizerInfo[]` (selected subset), optional `dilution_enabled/dilution_volume/dilution_concentration`, optional `topping_up_enabled/topping_up` (`currentSolution.{volume,EC,profileEC,profileSaltsConcentration}` + `newSolution.volume`), `ignore: {Ca?,Mg?,S?,Cl?}`, `mixerOptions: {url?}`.

`Fertilizer`/`FertilizerInfo` (`packages/calculator/src/types.ts` + app extension): `id`, `npk` elements **or** `composition: {formula, percent}[]` (molecular), optional `solution_concentration` (g/L) + `solution_density` for liquids, app adds `pump_number` (mixer pump, 1–16).

State: single zustand store (`store/index.ts`) — slices `calculator`, `fertilizerEdit`, `mixerOptions`, `fertilizersError`; dot-path `setFieldValue`; `calculate()` guards empty selection → sets `error` + "Выберите удобрения"; runs optional topping-up pre-pass then `calculate_v4`. Defaults: 13 default fertilizers, 18 default recipes (Перец/Томат/Земляника/Огурец Минвата stages).

## 3. Form details

**Main recipe/solution form fields (Options cards):**
- `Solution` card: volume input (л, 0.1–100, step 0.05); concentration as `1:k` dilution factor (1–1000) **or** "v₁ мл на v₂ мл рабочего раствора" (ml/ml); all disabled while topping-up is on. No direct EC/PPM input — EC is derived/shown.
- `ToppingUp` card: checkbox "Долив раствора" → new volume (л), current volume (л), current EC (мСм/см), profile EC, profile salt concentration (г/л).
- `Dilution` card: checkbox "Разбавление концентрата" → dilution volume (л) + dilution concentration (1:k or v₁/v₂ мл).
- `IgnoreElement` card: checkboxes Ca / Mg / S / Cl.
- `Accuracy` card: radio 0.2 / 0.1 / 0.05 / 0.01 г.
- `Calculate` button (submit).

**Fertilizer manager (`/fertilizers`, `FertilizerManager/List.tsx`):** add via `+` IconButton → `AddEdit` modal form (name input; macro + micro element % inputs; NPK string auto-fill; "Формула" checkbox → composition formula/percent list rows (AddEditCompositionList); "Раствор" checkbox → solution concentration г/л + density г/л; mixer pump number). List is drag-sortable (react-sortablejs); each `Item` card shows name, `[жидкий … г/л]`, `pN` pump tag, element chips, `edit` modal + `trash` delete. Has its own Import/Export CSV card + `restart` reset. **No presets UI** — presets are the hardcoded `defaultFertilizers`/`DEFAULT_RECIPES` constants.

**Result block (`Result.tsx`):** rows of element chips — macro (value + delta) and micro (×1000, mg/L) with deltas; balance cells ΔΣ I, EC, %NH4, K:N, K:Ca, K:Mg; list "Для N л раствора" → grouped "Раствор 1/2" (macro/micro solutions) with per-fertilizer `…г (… мл, … г)` lines (`ResultFertilizerList`); total salt weight г, concentration г/л; optional `ResultDilution` block (per-group volumes, top-up volume, TDS ppm / EC); stats line "Обработано вариантов: N Время: X сек"; two IconButtons: "Сохранить комплекс" (modal pre-filled from `buildFertilizerFromSolution`) and "Отправить на миксер" (`MixerModal`: URL input → opens `http://<url>?p1=..&p2=..` in new tab with liquid weights). No numeric score is shown (algorithm score is internal only).

## 4. UI kit (`@fertilizer/ui`)

12 component folders in `packages/ui/src/`: **Button, Card, Checkbox, Dropdown, ForkMeOnGitHub, Input, Label, Modal, NumberInput, Radio, Sidebar, Text** (Text also exports `Heading`). Plus utilities: `cx`, `number-utils` (NumberInput helpers), `use-color-mode`, `use-window-size`. Each has story + jsdom test + browser (chromium) test. Plain CSS via CSS modules (`style.module.css`, `@layer components` in theme) + tailwind v4 utilities consumed in app code (e.g. `flex`, `max-[800px]:flex-col-reverse`).

Theming — `theme.css`: CSS vars on `:root` (text `#454f5b`, background `#fff`, primary `#5c6ac4`, secondary `#006fbb`, highlight `#47c1bf`, muted, gray, danger `#f44`, accent `#f49342`, darken; element colors no3/nh4/p/k/ca/mg/s; font/line-height/weight vars; shadows). Dark: `:root[data-theme="dark"]` overrides 5 colors (background `#000639`, primary `#9c6ade`, …). `useColorMode` sets `data-theme` on `<html>`, persists to `localStorage["ui:color-mode"]` (migrates legacy `theme-ui:mode`), modes `default`|`dark`. App-level form helpers live in `apps/web/src/components/ui/Form` (Input/Checkbox/Radio with normalizers `number`/`decimal`, wired to zustand via `useFormField` dot paths).

Icons — `packages/icons/src/icons/`: 14 hand-drawn 24×24 SVGs: broom, chevron-down, close, edit, export, import, menu, moon, plus, restart, save, sun, trash, tune. Rendered by `Icon`/`IconButton` (name → registry).

## 5. Offline / PWA

`vite.config.ts`: `VitePWA({ registerType: "auto" })` — default generateSW config, no explicit manifest, no custom workbox runtime caching (precache of build assets only). `base: "./"` for GitHub Pages subfolder deploys; build → `build/`; doc images (jpg/png) copied via vite-plugin-static-copy. No offline-specific UX beyond precached assets + localStorage.

Persistence: zustand store subscribed → `persistState` on **every** change → `localStorage["appState"]` (legacy `reduxState` auto-migrated, deleted on load). Persists `calculator` (form, result, fertilizers, recipes), `fertilizerEdit`, `mixerOptions`; runtime fields `process`/`error` dropped on load. Color mode in separate key.

## 6. Localization

UI strings are **Russian only** (e.g. "Расчет растворов", "Объем, л", "Добавить удобрение", "Сохранить рецепт", "Выберите удобрения", "Обработано вариантов…"). A few English bits: "Calculate", "Save", "Not found", "URL", "Name" label, "TDS". No i18n machinery, no language switcher.

## 7. Import/export

- **Fertilizers & recipes — CSV**: import via hidden file input over `import` IconButton (columns `id,<elements>`, via `csvParse`); export via `export` IconButton to `Удобрения.csv` / `Профили.csv` (`csvExport` + `saveData`). Controls: FertilizerManager card, and (recipes) in the calculator's Import/Export card.
- **Full state — JSON/HPG** (`packages/calculator/src/format`, `FORMATS` = JSONFormat `.json` + HPGFormat `.hpg`): import via `ImportState` (accepts `.json, .hpg`, dispatches by extension → `store.importState`); export via `ExportState` → `CalculatorSettings-<iso>.json` (meta version/ref/created + calculator slice).
- No import for state in HPG-specific UI beyond the shared file picker.

## 8. Diary / Options / ImportExport (keep/cut candidates)

- **Diary** (`components/Calculator/Diary/`): **orphan** — only `index.ts` (empty) + `types.d.ts` (`DiaryEntryType`); not rendered, not routed, not imported anywhere else. A vestige of a planned "diary of calculations".
- **Options**: the cluster of calculation-parameter cards under the Calculate button (Solution volume/concentration, ToppingUp, Dilution, Ignore elements, Accuracy).
- **ImportExport**: six small IconButton-based controls (CSV in/out for fertilizers & recipes, JSON/HPG in/out for full state) grouped into two cards (FertilizerManager page + calculator page).

## 9. Example/Help pages (`src/docs`, raw .md)

Note: there is **no "Example" page** — example content lives inside Help as `profile/example`. Help page tree (11 entries, Russian):

- `how_to_use` — "Как использовать" (solution calculation walkthrough).
- `newbie-guide` — "Гайд для новичка" (inventory, basics for beginners).
- `profile` — "Профиль элементов" (profile UI explanation, screenshot) → child `profile/example` — "Примеры профилей" (known nutrient recipes).
- `technique` — "Методика расчета" (algorithm; NPK as oxide percentages).
- `chelates` — "Изготовление хелатов" (chelate DIY, marked "in development").
- `safety` — "Техника безопасности" (PPE, handling) → child `safety/chem_table` — hazard table per substance.
- `light` — "Светокультура" (artificial lighting parameters).
- `builds` — "Виды установок" (hydroponic system types).
- `references` — "Ссылки и литература".

## Key numbers

- 6 page folders (App unused/unrouted) → 5 reachable routes (+ nested `/fertilizers`).
- Calculator form: ~8 recipe element inputs + 2 dilution-concentration sets (k or v₁/v₂) + 4 topping-up + 1 volume + 4 ignore + 4 accuracy radios ≈ 18+ controls.
- 12 UI components in @fertilizer/ui; 14 icons.
- 16 tracked elements (8 macro, 8 micro); 13 default fertilizers; 18 default recipes.
- 11 Help md pages; 2 import/export format classes (`.json`, `.hpg`) + CSV in/out.

## Screenshots

Captured with Playwright (persistent chromium) against the dev server (`pnpm start`, http://localhost:3000). Files live in `.tmp/screenshots/`. Viewports: desktop 1440×900, mobile 390×844.

| File | Description |
| ---- | ----------- |
| `a_desktop_empty.png` | Desktop (1440×900) — initial empty calculator: add-fertilizer dropdown, recipe dropdown, 8 element inputs, balance cells, empty Result block, big Calculate button, options. |
| `b_desktop_recipe_fertilizers.png` | Desktop — recipe "Перец Минвата Базовый" selected + 4 fertilizers added as cards (NH4NO3, KNO3, KH2PO4, Ca(NO3)2·4H2O); element inputs and balance cells filled, Result not yet computed. |
| `c_desktop_result.png` | Desktop — after clicking Calculate: Result block with element target/delta grid and per-fertilizer dosages (Раствор A: 8.2 г NH4NO3, 69.7 г KNO3, 99.3 г Ca nitrate; Раствор B: 17.5 г KH2PO4; 194.7 г/л total). |
| `d_desktop_result_dark.png` | Desktop — same computed result in dark mode (`data-theme="dark"`). |
| `e_desktop_fertilizers_page.png` | Desktop — "Удобрения" (fertilizer manager) page at `#/fertilizers`: add button + list of fertilizer cards with element badges and edit/delete icons. |
| `f_mobile_empty.png` | Mobile (390×844) — initial empty calculator: recipe, element inputs, empty Result block, Calculate button. |
| `g_mobile_result_top.png` | Mobile — top of calculator with the computed result visible (element grid + solution lists + Calculate button). |
| `g_mobile_result_bottom.png` | Mobile — scrolled down: Options block (concentration, dilution, ignore, accuracy, import/export) + start of the fertilizer cards. |

Interaction flow used to reach the "with result" state: open the "Добавить" (add fertilizer) dropdown and click **Добавить** on 4 fertilizers (NH4NO3, KNO3, KH2PO4, Ca(NO3)2·4H2O); the recipe dropdown auto-populated "Перец Минвата Базовый" with the element inputs and balance cells; then click the **Calculate** button. State auto-saves to localStorage (`appState`); the color theme is stored under `ui:color-mode` and applied via `html[data-theme]`.
