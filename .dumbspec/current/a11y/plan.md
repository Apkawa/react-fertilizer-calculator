# a11y: implementation plan (accessibility for e2e + app)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Draft captured (user-authored) + refinements on the gate (scope: whole app; a11y tests: separate cases inside e2e, incl. open overlays)
- [x] Research: context collection (pages, components, existing a11y inventory, test infra, deps, constraints)
- [x] Initial spec → refined spec from research
- [x] Plan written (this file)

**Criterion:** draft/research/spec/plan all present in `.dumbspec/current/a11y/`; open questions resolved in spec (focus-trap depth = minimal, no full trap; test placement = `tests/e2e/`).
**Commit:** `docs(spec): a11y — draft + research + spec`

## Stage 1 — a11y e2e tests (red baseline)
- [x] Add `@axe-core/playwright` to root `package.json` devDependencies (next to `@playwright/test`); `pnpm install` (single lockfile, no build step)
- [x] New `tests/e2e/a11y.test.ts`: axe scan (`AxeBuilder`, tags `wcag2a` + `wcag2aa`) per main route: `/`, `/fertilizers`, `/formula/NaCl`, `/density/NaCl/`, `/example`, `/help/how_to_use` (HashRouter URLs `/#/…`, `page.goto` then wait for app ready)
- [x] Open-overlay cases as separate `test(...)` blocks: open a Modal (click its icon trigger), open a Dropdown, open Sidebar (narrow viewport) — axe scan **in the open state**
- [x] Failure output: print rule id + impact + target for each violation (readable diff)
- [x] Verify **red**: run `pnpm test:e2e` — a11y cases fail on current code with the violation list (this is the TDD red baseline for the whole task)

**Criterion:** a11y test cases live in `tests/e2e/`, run against the dev server (`webServer`), and currently **fail** with a readable violations report.
**Commit:** `test(e2e): a11y — axe-core scans (routes + open overlays), red baseline`

Stage 1 notes: red baseline = 7/9 a11y cases failing (calculator 25, fertilizers 40, chem 2, example 1, open-modal 35, open-dropdown 6, open-sidebar 22 violations); density/help routes already clean; fragile icon locators isolated in local helpers for Stage 5 swap; dropdown opened via chevron `dispatchEvent("click")` (chevron is the only toggle; on /#/example the ForkMeOnGitHub ribbon intercepts real clicks — layout quirk noted).

## Stage 2 — Icon-only controls: accessible names + real buttons
- [x] Red: collocated `*.test.tsx` render-smokes asserting: icon-only `IconButton` usages expose an accessible name; Modal close / Sidebar close / Dropdown chevron / ColorModeToggle render as `<button>` with aria-label (jsdom, part of `pnpm test`)
- [x] Green: `aria-label` at every icon-only `IconButton` call site (Calculator form, FertilizerManager add/edit/trash, Result save, Mixer, Import/Export, etc.) — names in Russian, stable, unique per control
- [x] Green: clickable `Icon` divs → native `<button>`: `Modal` close (`packages/ui/src/modal.tsx`), `Sidebar` close, `Dropdown` chevron, `ColorModeToggle` (plus `aria-pressed`); Sidebar overlay stays a biome-ignored click surface (deliberate, not a control)
- [x] Green: a11y e2e `button-name`-class violations (and static-clickable-div findings) disappear
- [x] `pnpm full-check` green (test + lint + type + build)

**Criterion:** every icon-only control is a real `<button>` with a stable accessible name; `getByRole("button", { name })` works for all of them in playwright.
**Commit:** `fix(ui): icon-only controls become labeled buttons`

Stage 2 notes: names — close «Закрыть», hamburger «Меню», chevron «Открыть/Закрыть список», toggle «Переключить тему» (+`aria-pressed`), plus/«Добавить», edit/«Изменить», trash/«Удалить», «Импорт»/«Экспорт» ×3, «Сбросить …», «Сохранить рецепт», «Настройки рецепта». a11y e2e helpers moved to role-based locators; `button-name` = 0; remaining a11y red = label, color-contrast, nested-interactive, aria-input-field-name, aria-required-children (Stage 4 classes).

## Stage 3 — Modal: dialog semantics + focus
- [x] Red: extend `packages/ui/src/modal.test.tsx` — `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the `<h2>` title; focus lands inside the dialog on open; focus restored to the trigger on close
- [x] Green: implement in `packages/ui/src/modal.tsx` (title → `id` + `aria-labelledby`; initial focus on first focusable/dialog; focus restore on close). **No full focus trap** (out of scope per spec — KISS, axe auto-rules do not require it)
- [x] Green: a11y e2e open-modal scan passes the dialog-related rules

**Criterion:** open-modal axe scan clean for dialog rules; jsdom modal tests green; `pnpm full-check` green.
**Commit:** `fix(ui): modal dialog semantics and focus management`

Stage 3 notes: unique id via module counter + `useState` initializer (React 16, no useId); focus: first focusable inside, else dialog container `tabIndex=-1`; restore to `document.activeElement` captured on open; e2e open-modal now asserts `getByRole("dialog")` visible before the axe scan; open-modal case has zero dialog-rule violations (remaining: color-contrast, label (file input), nested-interactive — Stage 4 classes).

## Stage 4 — Dropdown combobox semantics + app form control names
- [x] Red: extend `packages/ui/src/dropdown.test.tsx` — trigger has `role="combobox"`-style semantics: `aria-expanded` (false/true), `aria-controls` to the open listbox, trigger `aria-label`
- [x] Green: `packages/ui/src/dropdown.tsx` — minimal combobox wiring axe auto-rules ask for (keep existing `listbox`/`option` roles)
- [x] Red: app `Form/Input` render-smoke — `label` prop also becomes `aria-label` (placeholder stays as-is)
- [x] Green: `apps/web/src/components/ui/Form/Input.tsx` — `aria-label` from `label`
- [x] Remaining route-scan violations: fix whatever the axe scan still reports (headings order, contrast, misc) as found — no pre-invented list
- [x] `pnpm full-check` green

**Criterion:** `pnpm test:e2e` a11y cases: **`violations === []`** on all routes AND in open-modal / open-sidebar states (open-dropdown — отложен, `test.skip`).
**Commit:** `fix(a11y): combobox semantics and form control names`

Stage 4 notes: ralph-прогон worker'а отменён пользователем — единственным источником красных combobox-нарушений была страница Example с «голым» Dropdown; страница выпилена (user) вместе со своими a11y-кейсами, open-dropdown case оставлен `test.skip`-заглушкой («потом допилим»). Сделано: combobox-семантика Dropdown (label-проп → имя триггера, aria-expanded, aria-controls, option — прямые дети listbox, пункты без tabindex — interactive-контролы внутри строк), Form/Input — aria-label из label-пропа + bug-фикс приоритета (явный aria-label коньюмера раньше затирали `aria-label={label}` после spread — поэтому 8 доз элементов в рецепте были без имени), aria-label у solution/recipe-element/chem-инпутов, file-инпуты вынесены из `<button>` (nested-interactive) + aria-label, контраст чипа Mg → белый текст. Gate: `pnpm test:e2e` 10 passed / 1 skipped (a11y: violations === [] на 5 маршрутах + open modal + open sidebar), `pnpm full-check` green.

## Stage 5 — e2e locator cleanup + final verification
- [ ] Replace fragile locators in existing e2e tests (`div:has(> svg)` hamburger, `xpath=..//svg` chevron, `ancestor::div[1]//button` row buttons, `tests/e2e/shared.ts`) with role-based `getByRole("button", { name })` / `getByRole("link", { name })`
- [ ] Full green: `pnpm full-check` (test + lint + type + build)
- [ ] Full green: `pnpm test:e2e` + `pnpm test:smoke` (incl. a11y cases)
- [ ] playwright-cli spot-check: open the app, navigate all tabs/controls by accessible names only — no DOM-lokei fallback needed (the acceptance criterion from the draft)
- [ ] Mark this plan `[x]` as work lands; record any deviations from this plan in the commit messages

**Criterion (task acceptance, from spec.md):** (1) a11y e2e `violations === []` on routes + open overlays; (2) `pnpm full-check` green; (3) playwright-cli navigation by names works without fragile DOM locators.
**Commit:** `test(e2e): role-based locators; a11y suite green`
