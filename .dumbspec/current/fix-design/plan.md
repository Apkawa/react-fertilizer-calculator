# fix-design: implementation plan (post-migration UI regressions)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Finish research for issues 4, 5, 6, 7 (context collection only)
- [x] Refine spec from draft + research; resolve open questions (autonomously)
- [x] Write plan.md

**Criterion:** `draft.md`, `research.md` (all 7 issues), `spec.md` (no open questions), `plan.md` exist and agree.
**Commit:** `docs(spec): fix-design — research, spec, plan`

## Stage 1 — CSS layer-order fix (issues 1, 2, 5)
- [x] Red: build as-is, assert built CSS has the reversed layer order (components block before base/preflight, no leading declaration)
- [x] Green: fix bundle order so tailwind's `@layer theme, base, components, utilities;` declaration leads the final minified CSS (import order in `apps/web/src/index.tsx` — app.css before Root)
- [x] Rebuild; assert built CSS layer blocks are ordered `theme, base, components, utilities`
- [x] Visual (light): buttons look like buttons, inputs distinct from text, dropdown trigger row ~3rem box + list items padded

**Criterion:** built CSS `@layer` order theme<base<components<utilities; playwright: `buttonClass`/`inputClass` boxes restored (padding/border/bg), dropdown trigger row is a bordered ~3rem box, dropdown list items padded.
**Commit:** `fix(ui): restore CSS layer order — preflight below components atoms`

## Stage 2 — Recipe-tune macro row in a line (issue 3)
- [x] Restore `flex` on the macro row `<div>` in `RecipeTuneForm.tsx`
- [x] Visual: «Настройка профиля» modal — top row of inputs renders horizontally

**Criterion:** playwright: the macro-row inputs share one horizontal row in the opened modal (row width >> row height, inputs side by side).
**Commit:** `fix(calculator): recipe-tune macro row back to a flex row`

## Stage 3 — Hidden file input scoped to its button (issue 4)
- [ ] Make the import button the positioned containing block in the three `ImportExport` sites (`position: relative` on the button; verify how IconButton/Button forwards className)
- [ ] Visual: file-input bounding rect == button rect; menu-icon click opens the sidebar (not the file dialog)

**Criterion:** playwright: each `input[type=file]` rect is inside its import button's rect (top-left of viewport clear); clicking the menu icon opens the sidebar.
**Commit:** (pending)

## Stage 4 — Help link tree (issue 6)
- [ ] Markdown help tree: per-level indent + disc markers (app CSS, e.g. Help-page stylesheet)
- [ ] Sidebar «Справка» tree: per-level indent (markers stay off via `.react-router-tabs ul`); keep NavTab link hit-areas
- [ ] Visual: both trees render as indented trees

**Criterion:** playwright: nested `ul` in Help markdown has growing padding per depth + disc markers; sidebar Справка submenu shows per-level indentation; links still clickable.
**Commit:** (pending)

## Stage 5 — Dark theme readability (issue 7)
- [ ] `body`: background-color + color from theme vars (theme.css or app CSS)
- [ ] Move hardcoded white surfaces to theme vars: `modalCardClass`, `sidebarCardClass`, `.nav-tab` colors
- [ ] Visual (dark): no black-on-navy; page/card/modal/sidebar all readable; light mode unaffected

**Criterion:** playwright (dark): computed body bg `#000639` + text `#9d9d9d`; cards/modal/sidebar readable (no black text on dark navy); light mode unchanged.
**Commit:** (pending)

## Stage 6 — Final verification + archive
- [ ] `pnpm full-check` green
- [ ] Playwright visual audit light + dark: Calculator, Help, DensityCalculator, Example — all 7 issues hold
- [ ] Move task dir `current/fix-design/` → `archive/fix-design/`

**Criterion:** full-check green; audit confirms all 7 issues in both themes; task archived.
**Commit:** (pending)
