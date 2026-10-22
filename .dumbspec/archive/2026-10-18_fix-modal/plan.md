# 2026-10-18_fix-modal: implementation plan (modal centering + content-driven width)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Draft captured (`draft.md`), confirmed with user (viewport cap + internal scroll)
- [x] Research delegated to subagent; findings recorded (`research.md`)
- [x] Spec v1 written (`spec.md`), open questions resolved
- [x] Plan written (`plan.md`)

**Criterion:** all four task files exist; spec has v1 format (Created + Changes); plan is reviewable.
**Commit:** `chore(dumbspec): add spec and plan for modal centering/width fix`

## Stage 1 — Fix Modal component (centering + content-driven width)
- [x] Red: add browser test (`packages/ui/src/Modal/browser.test.tsx`) asserting geometry — (a) dialog horizontally centered in viewport, (b) card width equals content width (content narrower than 80% of viewport → card narrower than 80%); run `pnpm -C packages/ui test:browser` and confirm it FAILS against current CSS (failed: center X=520 vs 640, off by 120px)
- [x] Green: `style.module.css` — overlay: `position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; padding: 16px` (drop `position: absolute`/inline-top hack and the ≤500px media queries); card: drop `width: 80%` → `width: auto; max-width: 100%; max-height: 100%; overflow: auto`
- [x] Green: `index.tsx` — remove inline `style={{ top: window.pageYOffset }}` from the overlay
- [x] Verify: `pnpm -C packages/ui test:browser` (geometry green: 31/31) + `pnpm -C packages/ui test` (jsdom: 36/36) + `pnpm full-check` (exit 0: test/lint/type/build)
- [x] Refactor if needed (keep KISS; no new API) — not needed

**Criterion:** browser geometry test passes (centered + content-driven width); full-check green; all existing tests/stories unaffected.
**Commit:** `fix(ui): center modal overlay and size card by content`
