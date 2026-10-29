# 2026-10-22_web-design: implementation plan (new MVP layout)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Research scan of app functionality → research.md
- [x] Screenshots (desktop + mobile, light/dark) → .tmp/screenshots/
- [x] User-scenario & element-importance analysis → spec.md (User scenarios)
- [x] spec.md v1 (after research)
- [x] plan.md

**Criterion:** draft/spec/research/plan all exist; spec v1 has Created + Changes; no open questions.
**Commit:** `docs(web-design): dumbspec task 2026-10-22_web-design (research, spec, plan)`

## Stage 1 — Deliverable layout spec (apps/web-design/spec.md)
- [x] Write the customer→developer brief in `apps/web-design/spec.md`: page structure (header, 3 steps, result), block descriptions, states (empty/loaded/error), themes (3 modes), breakpoints, demo data, Tailwind/CDN constraints
- [x] Independent acceptance: a verification subagent checks that the brief covers every block of the planned layout and is self-sufficient for a developer (2 issues found → fixed: empty result state, Δ-sign convention)

**Criterion:** `apps/web-design/spec.md` exists, in Russian, self-sufficient, matches spec.md concept.
**Commit:** `docs(web-design): layout brief for the new calculator UI`

## Stage 2 — Static layout (apps/web-design/index.html + style.css)
- [x] Implement `apps/web-design/index.html` (Tailwind Play CDN, demo data from screenshots, RU strings, theme toggle JS: system/light/dark + localStorage + prefers-color-scheme)
- [x] Implement `apps/web-design/style.css` (CSS variables for element colors, component classes, fine-tuning)
- [x] Independent acceptance: browser verification (3 themes × 2 viewports) — 1 defect (head-script before DOM) → fixed → re-verified PASS; screenshots in `.tmp/layout/`

**Criterion:** page renders in 3 themes × 2 viewports; screenshots saved to `.tmp/layout/`; checklist passed.
**Commit:** `feat(web-design): static Tailwind layout of the new calculator UI (MVP)`

## Stage 3 — Layout copy (v2): current layout preserved, palette reused
- [x] Rewrite deliverable brief `apps/web-design/spec.md`: current layout 1:1 (sidebar tabs, 2-col calculator, Result chip grid, Options cards, Import/Export, tune/result modals, footer), ForkMeOnGitHub banner excluded, sidebar desktop-visible / mobile hamburger+drawer, palette reused from v1 `style.css`, demo data unchanged, pages not implemented (visual only)
- [x] Independent acceptance of the brief (self-sufficiency + matches spec.md v2) — 4 minor fixes applied: grid wording, 800px arbitrary variants, icon provenance, demo notes (Co 0)
- [x] Rewrite `apps/web-design/index.html` + `style.css` per the brief (Tailwind Play CDN, min-JS: theme/drawer/modal toggles)
- [x] Independent browser acceptance: desktop 1440×900 (sidebar visible), mobile 390×844 (hamburger+drawer, reversed stack), light/dark/system, screenshots to `.tmp/layout-v2/` — 2 bugs found (dead delta colors, invisible sun/moon swap) → fixed → re-verified PASS; a11y follow-ups (drawer role=dialog/aria-modal, aria-pressed, matchMedia listener) fixed too

**Criterion:** page renders in 3 themes × 2 viewports with sidebar/drawer behavior; screenshots in `.tmp/layout-v2/`; checklist passed.
**Commit:** `feat(web-design): static Tailwind layout of the current calculator UI (v2)`

## Stage 4 — Customer fix rounds v3–v10 (each round browser-verified)
- [x] v3: sidebar threshold 1250px, Δ colors, fertilizer-manager rows — `80f96d7`
- [x] v4: chip/cell typography (labels bold, values regular), balance chips one-line — `a8018ad`
- [x] v5: element tints on background/border only, micro = neutral gray — `47e67a0`
- [x] v6: unified button standard (.icon-btn canonical, icon+text save/broom) — `90c23f4`
- [x] v7: inputs ≤2 rows, prefix `1:` inside concentration field — `7006e14`
- [x] v8: distinct system-theme icon (half-circle), dark del-btn readable — `e118921`
- [x] v9: weight beside delete, grip handle, inactive rows via checkbox — `39b1f60`
- [x] v10: edit left of delete, signed deltas without «Δ» (0 muted, +green, −red), Долив/Разбавление/Расширенные as separate accordion cards — `01d23ec`

**Criterion:** each round browser-verified (screenshots `.tmp/layout-v3..v10/`), `apps/web-design/spec.md` kept in sync.

## Stage 5 — Color schemes (v11)
- [x] Dropdown «Цветовая схема» right of the theme toggle; 5 schemes (`default/win95/retro/nature/science`) as `color-<name>.css`, light+dark variants; theme × scheme orthogonal; localStorage `scheme`; `style.css` reduced to scheme-independent structure; spec.md §5 rewritten
- [x] Independent browser acceptance: all 10 scheme×theme states, persistence across reload, default colors unchanged; screenshots `.tmp/layout-v11/`

**Criterion:** palette/borders/shadows/buttons per scheme; no color literals outside color files.
**Commit:** `feat(web-design): v11 — color scheme system` (`89c93c3`)

## Stage 6 — Design guideline (formal, EN)
- [x] `apps/web-design/design-guideline.md`: layout zones, component standards, theme×scheme architecture, token contract, typography, iconography, data conventions, a11y, implementation constraints, do/don't

**Criterion:** document self-contained; reflects final state v11.
**Commit:** `docs(web-design): formal design guideline (EN)` (`20c2b28`)

---

**Task closed:** all stages `[x]`; task directory lives in `archive/2026-10-22_web-design/`.
