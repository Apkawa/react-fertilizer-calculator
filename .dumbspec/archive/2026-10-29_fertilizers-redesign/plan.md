# 2026-10-29_fertilizers-redesign: implementation plan (fertilizer manager merged into calculator)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

Decisions (customer, 2026-10-29): checkbox = membership in `calculationForm.fertilizers` (no auto-recalc); remove `/#/fertilizers` route + sidebar tab; delete removes library + selection copy; edit updates chips via pushFertilizer id-sync, result recalculates only on «Рассчитать»; header plus opens AddEdit (adds to library, not auto-selected).

---

## Stage 0 — Research + spec + plan
- [x] draft.md recorded (raw request + reference image)
- [x] research R1 (apps/web-design layout canon), R2 (GRUD = merged selector/manager), R3 (store/manager wiring, tests that pin behavior)
- [x] spec.md v1 + customer decisions (checkbox semantics, route removal, delete sync, live-update scope)
- [x] plan.md written

**Criterion:** draft/research/spec/plan exist in `.dumbspec/current/2026-10-29_fertilizers-redesign/`, spec has Created + Changes with decision entry.
**Commit:** `923b007 docs(dumbspec): fertilizer manager merge — draft, research, spec v1, plan`

## Stage 1 — Store: selection membership semantics
- [x] Red: store tests in `apps/web/src/store/index.test.ts` — new action `toggleFertilizer(f, checked)`: checked → copy added/updated into `calculationForm.fertilizers` (materialize form if null); unchecked → copy removed by id; no recalc triggered.
- [x] Red: `removeFertilizer` also filters `calculationForm.fertilizers` by id; `setFertilizers(newList)` (drag reorder) reorders selection to follow library order, keeping copies for checked ids; `resetFertilizers` filters selection to ids of the reset library.
- [x] Green: implement actions in `apps/web/src/store/index.ts` (reuse `updateOrPush`/`update` from utils; keep existing pushFertilizer id-sync test green).
- [x] Refactor: keep dot-path materialization consistent with `setFieldValue`; run `pnpm test` store suite green.

**Criterion:** store suite passes with membership/reorder/delete-sync tests; existing calculator-behavior id-sync test still green.
**Commit:** `19d2609 feat(store): fertilizer selection membership — toggleFertilizer, selection sync on remove/reorder/reset`

## Stage 2 — UI: manager-style «Удобрения» card inside calculator
- [x] Gather consumers of `FertilizerSelect/*` exports (esp. `Element` from SelectedListItem, weight lookup) — relocate shared pieces to `apps/web/src/components/Calculator/fertilizerRow.ts` before deleting the directory.
- [x] Red: render-smoke updates — `Calculator.test.tsx` / `FertilizerManager.test.tsx`: left column card «Удобрения» with header a11y names «Добавить удобрение» / «Импорт удобрений» / «Экспорт удобрений» / «Сбросить удобрения»; row order Переместить → Выбрать «<name>» → name → weight (only checked, from `result.fertilizers` by id) → «Редактировать» → «Удалить удобрение»; unchecked rows `.is-inactive` (muted, no weight, chips neutral); dropdown «Добавить удобрение» combobox gone.
- [x] Green: refactor `FertilizerManager/List.tsx` into the calculator card (sortable over library via `setFertilizers`, header icon-button cluster, rows `Item.tsx` + Checkbox `toggleFertilizer`, weight join, AddEdit modal for edit/add reused unchanged); wire `components/Calculator/index.tsx` left column to it; fertilizers Import/Export card in right column removed (Recipes/Settings card stays).
- [x] Delete `apps/web/src/components/Calculator/FertilizerSelect/` (incl. dead `AddItemFertilizerEditForm.tsx`) and dead refs.
- [x] Refactor: DRY row vocabulary via `fertilizerRow.ts`; `pnpm test` app suite green, `pnpm lint && pnpm type` clean.

**Criterion:** calculator screen renders manager-style fertilizers card in left column; checkbox toggles membership (checked rows gray-off when unchecked); edit/add modal = AddEdit; app tests + lint + type green.
**Commit:** `34d7a1b feat(web): merge fertilizer selector into manager-style «Удобрения» card`

## Stage 3 — Remove /#/fertilizers route and sidebar tab
- [x] Remove nested route `/fertilizers` in `apps/web/src/pages/Calculator/index.tsx`; remove «Удобрения» tab in `apps/web/src/components/navigation/TabMenu.tsx`.
- [x] Update tests: `tests/smoke/routes.test.ts` (drop /#/fertilizers case; NH4NO3 marker on /#/), `tests/e2e/a11y.test.ts` (modal-add case via header «Добавить удобрение» on /#/), `tests/e2e/navigation.test.ts` (drop «Удобрения» link), `tests/e2e/calculator.test.ts` (add via plus button + checkbox membership instead of dropdown).
- [x] Fix any stale references (imports of FertilizerManager page barrel, docs/Help mentions of the page if any).

**Criterion:** `/#/fertilizers` dead, no sidebar tab; smoke + e2e suites pass against merged UI.
**Commit:** `0969ab6 feat(web): drop standalone fertilizers screen` (e2e a11y contrast failures = pre-existing baseline)

## Stage 4 — Layout canon vs mockup (apps/web-design)
- [x] Order/positioning per canon: fertilizers card left ≥800px (`order-2 min-[800px]:order-1`), bottom <800px; touch targets ≥40px; header plus immediately after title.
- [x] CSS: grip/checkbox/inactive styles (`opacity .6`, muted name, neutral chip tint via tokens) in app CSS modules (`@layer components`, no color literals, `data-ui` hooks on card roots); weight line aligned with buttons.
- [x] Browser verify (playwright-cli, dev server): ≥800px + <800px layouts, light+dark, schemes default/win95; compare against apps/web-design/index.html mockup; screenshots into `./.tmp/`.

Journal: wide/narrow light+dark match the mockup layout (card order, row anatomy grip→checkbox→name, weights "8.2 г"/"69.7 г"/"17.5 г" identical). win95 scheme verified by token parity app↔mockup (--bg #c0c0c0, --card #d4d0c8, --text, --muted, --primary #000080, --border 1px, radius 0) — CLI screenshots taken right after goto captured pre-hydration paint (pixel hashes unreliable), inline-style probe proved the scheme paints. Customer follow-ups folded into this stage: grip resized to canon 1.5rem×2.5rem (18px icon); checkbox = ui base 1rem box + 2.5rem hit-label wrapper (matches «Игнорировать» controls).

Round B follow-ups: fertilizer import/export/reset moved out of the «Удобрения»
card header into the «Импорт/Экспорт» card as an «Удобрения» row under «Рецепты»
(deviation from mockup canon, which keeps them in the card header); header now
plus + eye toggle; grip→checkbox→name tightened via margin-box trick (label 2.5rem,
margin-right -1.5rem → measured gaps 8px/8px, 40px hit); plus glyph replaced with
mockup stroke-2 path; eye/eye-off icons added (registry 18, PNG baselines); eye-off
mode hides unchecked rows with display:none (rows stay in DOM, sortable indices stay
aligned with store order) — filter is not in apps/web-design, state is local useState,
not persisted. Browser verify re-done after dev-server restart: the earlier :3001
server served a stale module graph (stale index.tsx transform despite HMR events);
fresh server on :3000 rendered everything — screenshots ./.tmp/fert5-default.png,
fert5-checked.png, fert5-eyeoff.png (wide light, eye-off shows only checked rows).

**Criterion:** rendered calculator screen matches the mockup layout at both breakpoints and both color modes; screenshots saved to ./.tmp/ for review.
**Commit:** `25c90ad fix(web,icons): fertilizer card Round B — relocated import/export/reset, tight grip/checkbox spacing, eye filter, stroke-2 plus + eye icons`

## Stage 5 — Full verification
- [x] `pnpm full-check` (test + lint + type + build) green (husky pre-commit on `25c90ad`).
- [x] `pnpm test:smoke` 5/5 green; `pnpm test:e2e` 6 passed + 3 failures = the documented
  pre-existing a11y contrast baseline (calculator route, fertilizer-add modal, narrow
  sidebar) — unchanged by this task, accepted.
- [x] Manual flow check (browser, fresh dev server :3000): plus-add → new row unchecked +
  inactive; check → Calculate → weight «74.5 г» on checked row; edit modal → chips update
  immediately (NO3 20), selection kept, no auto-recalc; delete → row gone, selection
  cleaned (1 checked row left); drag via handle «Переместить» reorders rows (CLI trusted
  drag; synthetic pointer/mouse events do not drive sortablejs); export fertilizers →
  CSV download; import → values merged into current library by name (legacy semantics,
  order preserved); reset → default library + selection cleared.

Journal: Round C manual verification passed end to end. Dev-server note: an old vite
instance kept a stale module graph (served old index.tsx despite HMR events); after
restart everything rendered — screenshots ./.tmp/fert5-*.png. App button label is
legacy «Calculate» (mockup says «Рассчитать») — pre-existing, not changed.

**Criterion:** full-check + smoke + e2e green; manual flow matches spec decisions.
**Commit:** `296dcb1 docs(dumbspec): fertilizer redesign stage 5 verified — smoke/e2e baseline, manual flow, deviation notes`
