# 2026-10-28_ui-redesign: implementation plan (UI redesign per web-design mockup)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] draft.md from raw input
- [x] research R1 (apps/web-design mockup: theme×scheme mechanism, tokens, typography, fragments→classes, mockup data discrepancies)
- [x] research R2 (packages/ui: CSS modules, theme.css tokens, use-color-mode, tests/storybook, no scheme mechanism)
- [x] research R3 (apps/web: frame, calculator markup targets, Help typography gap, form-context, test contracts)
- [x] spec.md v1 + open questions closed by user (comma out of scope; spinner restyle only; token rename; drawer <1250)
- [x] plan.md + branch `2026-10-28_ui-redesign`

**Criterion:** task files exist on the task branch and committed.
**Commit:** 5f1799f `build: fix biome.json` (biome override for static mockup html; landed together with spec/research/plan; lint green)

---

## Stage 1 — packages/ui: unified theme×scheme token API
- [x] red: rewrite `use-color-mode.test.tsx` contract → ColorMode `light|dark|system`, applied attr `light|dark`, migrate stored `default`→`light`, legacy `theme-ui:mode`, matchMedia listener for system
- [x] red: new `use-color-scheme.test.tsx` → `data-scheme` attr, persist key `ui:color-scheme`, default `default`, pure `applyScheme` exported
- [x] theme.css rewrite: mockup token names `--bg --card --text --muted --border --primary --danger --ok --deficit --excess`; element palette `--el-no3 --el-nh4 --el-p --el-k --el-ca --el-mg --el-s --el-cl --el-micro`; `.el-*` classes set only `--el-tint`; shape tokens `--radius --border-width --shadow-small --shadow-large`; dark default `:root[data-theme="dark"]`; `@media (prefers-color-scheme: dark)` fallback only for default scheme; transitional alias block `--color-*: var(--new)` (removed in Stage 8) so app keeps working
- [x] scheme files `scheme-win95.css`, `scheme-retro.css`, `scheme-nature.css`, `scheme-science.css` ported from `apps/web-design/color-*.css` as TOKEN-ONLY overrides: light `html[data-scheme=x]` (beats `:root`), dark `html[data-scheme=x][data-theme="dark"]` (beats media fallback); shape tokens (`--radius`, `--border-width`, shadows) + button tokens (`--btn-tint-pct/--btn-hover-pct/--btn-border-pct/--btn-shadow`, defaults added to theme.css); structural component quirks (win95 bevel via `--btn-shadow`, retro fill via `--btn-tint-pct`) ride on tokens — component-level `[data-ui]` selectors only if Stage 2 finds a token gap
- [x] `schemes.ts` registry (`SCHEMES: {id,label}[]`, default first) + `use-color-scheme.ts` hook + exported pure appliers; barrel exports; package.json subpath exports for `./theme.css` and `./scheme-*.css`
- [x] minimal apps/web glue for new ColorMode contract (ColorModeToggle cycle, Root, App.test.tsx) so tsc/tests stay green; full visual toggle/select UI lands in Stage 5
- [x] green: `pnpm -C packages/ui test` + `pnpm test` + `pnpm type` pass

**Criterion:** `pnpm -C packages/ui test` green; `rg 'color literals (#|rgb|rgba|hsl)' packages/ui/src` hits only theme.css + scheme-*.css (+ documented ForkMeOnGitHub brand exception); 5 schemes × 3 modes resolvable by attribute specificity.
**Commit:** 71b44f1 `feat(ui): theme×scheme token API` (16 files; acceptance PASS incl. workspace test/type/lint; schemes not yet imported by app — Stage 5)

---

## Stage 2 — packages/ui: restyle existing components
- [x] red/updated: component tests assert stable `data-ui` hooks + keep existing markup/aria contracts (11 red hook tests; `use-window-size.test.tsx` added as green guard — legacy `setWindowSize(getWindowSize)` works via React updater semantics, fix is readability-only)
- [x] Button: canonical base (height 2.5rem, `--radius`, border `color-mix(--primary 35%)`, bg `--primary 12%`, hover 22%, icon `--primary`; no filled primary), `data-ui="button"` (+ win95/retro `[data-ui]` scheme exceptions; NumberInput done together — see next item)
- [x] Card: bg `--card`, border `--border`/`--border-width`, radius, shadow tokens, `data-ui="card"`; heading via Heading h2 1.125rem/600 (no separate title class — YAGNI; win95 bevel rides `--shadow-small` automatically)
- [x] Input: 0.875rem, border/radius tokens, focus inset outline, `data-ui="input"`; spinner-hiding + dot behavior kept; win95 inset-bevel white field exception added
- [x] Label/field-label: 0.75rem `--muted`/500, `data-ui="label"` (checkbox/radio row-label variant stays flex row; §3.6 row-label 0.875/600 handled with Checkbox/Radio batch)
- [x] Checkbox/Radio: touch ≥40px row (min-height 2.5rem), `accent-color: var(--primary)`, row-label 0.875/600 via `[data-ui="label"]:has(...)` — field-label canon untouched
- [x] Dropdown: list bg/border/shadow tokens, item hover tint, chevron muted; keep combobox/listbox a11y
- [x] Modal: overlay `color-mix(--muted …)`, panel bg card + border + shadow, width `min(560px, 100% - 2rem)`; content untouched (reused modals pick it up)
- [x] Sidebar: drawer canon (300px, overlay via token); fix `use-window-size.ts` readability (`getWindowSize()`); docked/drawer decision owned by app (Stage 5)
- [x] NumberInput: spinner buttons restyled per button canon; behavior unchanged (done in Button batch; wrapper `data-ui="number-input"`)
- [x] Text/Heading: heading size hierarchy (h1 1.5 / h2 1.125 / h3 1 / h4 0.875 / h5 0.8125 / h6 0.75rem, weight 600), body 0.875rem/1.5 `--text`, `data-ui="text"`; ForkMeOnGitHub untouched (brand exception)
- [x] Storybook: globals `theme` (light|dark toolbar) + `scheme` (SCHEMES ids, русские labels), decorator пишет `dataset.theme/scheme` на `<html>`; `.storybook/style.css` импортирует все 4 scheme-*.css
- [x] green: jsdom 66 tests, `storybook:build` (фактический скрипт — AGENTS.md `build-storybook` рассинхрон, правка в Stage 8), `test:browser` 31 green без обновления снапшотов, lint/type/app build green

**Criterion:** `pnpm -C packages/ui test` green, `build-storybook` succeeds, `test:browser` green locally; in Storybook all components look per mockup canon in each scheme×theme combo.
**Commit:** fee372b `feat(ui): restyle components to mockup canon` (41 files; acceptance PASS, ForkMeOnGitHub brand exception noted; apps/web consumers still on transitional aliases — Stage 5/8)

---

## Stage 3 — packages/ui: new chips atoms (Chip + ElementCell)
- [x] red: `Chip` test.tsx + browser.test.tsx (stories created in green phase to keep tsc green; balance variant borderless muted-6%, `flex-shrink:0`; element variant tint bg+border via `--el-tint`; compact tier <800px via `@media (max-width:799px)`; label 0.75/700, value 0.875/400)
- [x] red: `ElementCell` test.tsx + browser.test.tsx (name 0.75/700, value 0.875/400, delta 0.75 muted `+`→`--ok` / `−|−`→`--deficit` via `data-delta="plus|minus"`; neutral/`0` → no attr; no Δ in output; tint underlay only)
- [x] implement Chip (variants plain/element, `data-ui="chip"`) + ElementCell (`data-ui="element-cell"`) consuming `--el-tint`; barrel exports Chip/ChipProps/ChipVariant/ElementCell/ElementCellProps
- [x] green: jsdom 17 files/75 tests, browser 14/35 + 2 new aria snapshots (regression green), stories BalanceRow/ElementChipRow/ResultRow, storybook:build + lint/type/build green

**Criterion:** new atoms render in jsdom+chromium tests and Storybook across schemes; text colors always `--text`, tints underlay only.
**Commit:** f406756 `feat(ui): Chip + ElementCell atoms` (acceptance PASS 7/7; scheme hooks forward-looking)

---

## Stage 4 — packages/icons: new icons for redesign
- [x] red: registry tests expect new icon names (`monitor`, `grip`, count 14→16)
- [x] `monitor` (half-filled circle, system-theme glyph from mockup index.html), `grip` (6 filled dots drag handle); `chevron` NOT added — `chevron-down` already in registry and used by Dropdown (duplicate avoided, noted in test comment)
- [x] PNG baselines for new icons only (`ICON_PNG_FILTER=monitor,grip UPDATE_ICON_PNGS=1`; rsvg-convert present; 16 icons baselined, old PNGs untouched)

**Criterion:** `pnpm -C packages/icons test` green (incl. PNG snapshots), new icons in `registry.ts` render 24×24.
**Commit:** 9b0bdf1 `feat(icons): monitor + grip icons` (acceptance PASS 5/5)

---

## Stage 5 — apps/web: frame (boot, responsive layout, sidebar drawer, theme+scheme controls)
- [x] red: `App.test.tsx` contract — system via `vi.stubGlobal(matchMedia)` → `data-theme=dark`, `ui:color-scheme=win95` → `data-scheme=win95`, default scheme; ColorModeToggle/SchemeSelect/TabMenu tests red→green
- [x] `index.tsx`: pre-mount `applyTheme(persisted)`+`applyScheme(persisted)` before createRoot (no FOUC); app.css imports theme + 4 scheme css (bundle verified `[data-scheme=…]`)
- [x] Root: content `max-w-[936px] px-4 pb-6`, footer `text-sm text-[var(--muted)]` right; docked content `pl-[308px]`
- [x] navigation: docked ≥1250 (`DOCK_THRESHOLD`), drawer <1250 burger «Меню» + overlay/Esc (ui), `html.drawer-open` + body lock (app.css); boundary 1249/1250 browser-verified
- [x] ColorModeToggle: light→sun, dark→moon, system→monitor, aria-pressed dark-only; SchemeSelect native `<select>` (aria «Схема оформления», SCHEMES labels); header order toggle→select→fork per mockup
- [x] navigation module.css rewired to tokens (Roboto @import removed, orange removed, hover primary-12%, min-height 2.5rem); typography system stack
- [x] green: `pnpm test` 57 web + all green; `test:smoke` 6/6; e2e navigation docked@1280 green, a11y burger@390 viewport; browser-verify 390 no-overflow, drawer open/Esc, docked 1280, persist re-apply reload

**Criterion:** `pnpm test` green incl. updated App contract; `pnpm test:smoke` green locally; visual: sidebar drawer works <1250, fixed ≥1250; theme/scheme toggle persists and re-applies pre-mount on reload.
**Commit:** 817cdb5 `feat(web): frame per mockup canon` (acceptance PASS; non-blocking notes: dead `pages/App` boilerplate literals → delete Stage 8; Sidebar legacy dock thresholds dead; a11y color-contrast baseline still red — token tuning candidate Stage 8; select aria label wording «Схема оформления» vs mockup «Цветовая схема» — fixed in Stage 8 decision)

---

## Stage 6 — apps/web: calculator markup redesign (layout = app data, visuals = mockup)
- [x] Calculator/index: 2-col grid ≥800px, mobile order swap (fertilizers last/bottom), cards per Card canon
- [x] SelectedList/SelectedListItem: chips via Chip/ElementCell tokens (remove hardcoded ELEMENT_BG hex), row order grip→name→value→edit/delete where data allows; keep dropdown selector (no GRUD restyle), keep aria/text markers
- [x] Recipe: dose grid cols 4→8 (≥800), `field-label` el-* tint classes decorative only, balance row = Chip plain ×6 from data; tune modal untouched
- [x] Result: ElementCell rows 8 macro + 8 micro (always 1 row × 8 incl. mobile), balance row 6 Chip incl. `K:Mg` from `getNPKDetailInfo` (NOT mockup literals), fertilizer list/dilution per guideline
- [x] Options: Calculate button canon; label-left/input-right rows (w-24/w-28, text-right, gap≥3); Ignore/Accuracy checkbox+radio rows ≥40px targets
- [x] FertilizerManager Item: grip handle visual (DnD kept), row order id→chips→edit→delete (delete rightmost, danger hover); AddEdit modal content untouched
- [x] ui/Form inputs: sizes/borders per Input canon, behavior unchanged (dot decimals stay)
- [x] green: existing app tests stay green (markers «Результат расчета», «ΔΣ I», aria, submit); browser visual diff vs mockup at 390/800/1250 × theme×scheme spot checks

**Criterion:** `pnpm test` green without weakening contracts; balance row shows real computed values (6 chips incl. K:Mg); no horizontal overflow at 390px; element chips colored via tokens only.
**Commit:** 848c93b `feat(web): calculator markup per mockup canon` — acceptance ran by orchestrator directly (4 consecutive independent-acceptance subagent dispatches failed with `Error: subagent run failed`; deviation from subagent-acceptance convention noted here). Evidence: `pnpm test` 68 web tests green (new Recipe.test.tsx, Result/Options/FertilizerManager/SelectedListItem canon assertions — values asserted against `getNPKDetailInfo` data, not mockup literals); lint/type green; browser: 390 scrollWidth=innerWidth 0 overflow (default + долив-блок), fert card bottom-most at 390, 1280 two columns side-by-side (l342/l798), checkbox rows 40px, element-cell tint bg tint-12% tokens only, dark+win95 and light+nature screenshots (`./.tmp/stage6-*.png`); `test:smoke` 6/6. Fix during acceptance: Solution/Dilution/ToppingUp label rows `flex-wrap` + drop `shrink-0` (overflow culprit «1:» group at 390). Non-blocking notes → Stage 8: save-button tooltip «Ионный баланс» lost (Chip has no title), `StyledBalanceCell` now unused by Recipe (RecipeTuneForm consumer), select aria «Схема оформления» vs mockup «Цветовая схема».

---

## Stage 7 — apps/web: Help typography + other pages per guideline
- [x] Help/style.module.css: markdown hierarchy (h1-h3 sizes/weights per guideline §5), p spacing, lists kept, tables (th uppercase 0.75/600 muted, borders), code blocks mono + border/bg
- [x] ChemFormula/DensityCalculator/NotFound: Card wrappers, heading canon, tables per canon, label/input rows per guideline
- [x] green: markdown tests stay green; browser visual check of one help doc with table/code

**Criterion:** help pages render typed headings/paragraphs/tables/code (no UA-default h2 1.5rem), utility pages look per Card/table canon; `pnpm test` green.
**Commit:** d32201f `feat(web): help typography + utility pages per guideline §5` — implementation by subagent, acceptance by orchestrator (deviation from subagent-acceptance convention, as Stages 5–6). Evidence: Help `style.module.css` canon (§5: base 0.875/1.5, h1 1.5 → h6 0.75 weight 600, p .75em, th uppercase 0.75/600 muted + border tokens, table wrapper `display:block overflow-x:auto`, inline code mono bg `var(--card)` border radius, pre block w/ inner scroll, no literals); Help.tsx inline maxWidth:960 removed (Root frame); ChemFormula/DensityCalculator/NotFound wrapped in Card + Heading canon, label rows per guideline, own width:936 containers removed; Density dropdown got a11y `label="Соль"`. CRITICAL FIX found during acceptance: no layer-ORDER statement existed in any CSS file → first-registered-wins precedence put `components` (ui css bundled before tailwind sheet) BEFORE `base`, so preflight `h1..h6{font-size:inherit}` won and heading sizes were silently broken (h1 computed 14px). Fix: `@layer theme, base, components, utilities;` prepended to all 20 CSS files containing `@layer` (ui atoms/theme/schemes + app css); runtime-verified h1 24px/600, h2 18px/600, h3 16px/600, p 14px, th 12px uppercase/600 (also silently repaired Stage 6 card titles). Browser screenshots `./.tmp/stage7-*.png`: help 390 (no overflow, drawer ☰) / 1280 (docked sidebar, canon type incl. chem_table colored spans via sanitize), formula (h1 «Парсер формул», h2 sections, uppercase headers), density (h1 + 3 label rows), fertilizers. `#/nope` blank = documented legacy quirk (smoke routes.test.ts L27-29: Route path="/" prefix-matches before catch-all — NotFound unreachable; shell stays alive, smoke green) — route logic NOT changed (out of markup scope). Regression caught by acceptance: Stage 6 made result rows `<div>`, breaking `resultItem` li-locator — restored semantic `ul/li` rows (visual identical, preflight no markers) + new Result.test li assertion. `pnpm test` 69 web green, lint/type green, `test:smoke` 6/6, e2e calculator+persistence green; a11y suite failures = existing color-contrast baseline (`--muted`/`--el-*` token ratios) → Stage 8 token tuning note.

---

## Stage 8 — Cleanup + full verification
- [x] remove transitional `--color-*` alias block from theme.css; rewire any remaining consumers (navigation, Help links, IconButton, Dropdown hover) to new token names
- [x] governance check: color literals only in theme.css + scheme-*.css (+ ForkMeOnGitHub exception)
- [x] `pnpm full-check` green; `pnpm -C packages/ui test:browser` green; `pnpm test:smoke` + `pnpm test:e2e` green locally
- [x] update AGENTS.md UI description (CSS modules, theme×scheme tokens, schemes API)
- [x] final commit; move task dir to `.dumbspec/archive/`

**Criterion:** full-check + browser tests + smoke/e2e all green; `rg` governance clean; docs updated.
**Commit:** 06e9957 `feat(ui): Stage 8 cleanup — remove --color-* aliases, WCAG token tuning, governance` — implementation by subagent, acceptance by orchestrator (as Stages 5–7). Evidence: `--color-*` alias block removed, 0 references repo-wide; consumers rewired to semantic tokens (Help links `var(--primary)`, IconButton BG_TOKENS `--primary/--danger`, RecipeTuneForm highlight `color-mix(var(--ok))` + `var(--danger)`, dead `pages/App/` boilerplate deleted incl. `#282c34/#61dafb`). WCAG token tuning in theme.css (honest, a11y test NOT weakened): light `--muted #5b6775` (5.77:1 card / 5.33:1 bg), `--danger #cf3526`, `--ok #1f7a3a`, `--deficit #b03027` ≥4.5:1; dark `--primary #a378e0`; `--excess` kept yellow (underlay-only, never text). Sidebar internal width thresholds removed (`docked/opened` props from outside, DOCK_THRESHOLD=1250 lives in Root.tsx). Chips got `title` prop — «Ионный баланс» tooltip restored; SchemeSelect aria «Цветовая схема» per mockup; index.tsx stale «без @layer» comment fixed; AGENTS.md updated (React 19 catalog, `pnpm type` incl. packages/ui, 14 ui folders + style.module.css + mandatory layer statement, schemes API, `storybook:build`, governance canon, cache path). `pnpm full-check` green; `pnpm -C packages/ui test:browser` 35 green; `test:smoke` 6/6; `test:e2e` 10 passed + 1 legit skipped — a11y suite fully green now (was legacy contrast baseline). Governance `rg` clean (literals only theme.css/scheme-*/ForkMe exception). Browser sanity on static build: calc light/dark 1280/390 + help dark+win95 (scheme tokens apply post-alias-removal: body bg 38,38,46, canonical typography) — `./.tmp/stage8-*.png`. Task dir archived to `.dumbspec/archive/2026-10-28_ui-redesign/`.
