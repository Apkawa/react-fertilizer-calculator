# fix-vite-help-csv: implementation plan (vite-era Help + CSV fix)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Reproduce failures (type/build pass; browser runtime error in Help chunk; csv.ts is a throwing stub)
- [x] Identify constraints: React 16 pins react-markdown ≤ v8; new csv v7/v6 are browser-safe
- [x] Write research.md, spec.md, plan.md

**Criterion:** draft/research/spec/plan exist and the plan is committed (scope frozen).
**Commit:** `docs(dumbspec): add fix-vite-help-csv research, spec, plan`

## Stage 1 — Help: react-markdown 4 → 8 with raw HTML
- [ ] Red: add markdown rendering test(s) (target API: `children`, raw-HTML table with `style` spans, `transformImageUri` map) — fails on current v4 stub-of-behaviour
- [ ] Green: `pnpm add react-markdown@^8.0.7 rehype-raw@^6.1.1 rehype-sanitize@^5.0.1 hast-util-sanitize@^5.0.2`
- [ ] Rewrite `Help.tsx` to v8 API; custom sanitize schema (default + `style`)
- [ ] `pnpm type` + `pnpm lint` green
- [ ] Build + browser smoke (served build): `#/help/how_to_use` and `#/help/safety/chem_table` render; chem_table shows colored spans + `<br>`; console has no errors

**Criterion:** Help pages render in a real browser on the production build, no console errors, new test green.
**Commit:** `fix(help): react-markdown 4→8 (vite-compatible) + raw HTML via rehype-raw`

## Stage 2 — CSV: browser-safe csv-parse/csv-stringify, drop stub
- [ ] Red: add `src/utils/__tests__/csv.test.ts` (parse with `columns`, header-row skip like ImportFertilizers; stringify with `columns`+`header`; round-trip) — fails on current throwing stub
- [ ] Green: `csv-parse@^7.0.2`, `csv-stringify@^6.8.3`; rewrite `csv.ts` imports to `*/browser/esm/sync`
- [ ] Remove unused `csv@5.3.2` dependency
- [ ] `pnpm test` + `pnpm type` + `pnpm lint` green

**Criterion:** new csv tests green; ImportExport components untouched; type/lint/test green.
**Commit:** `fix(csv): browser-safe csv-parse 7 / csv-stringify 6, remove Buffer stub + unused csv@5`

## Stage 3 — End-to-end verification
- [ ] `pnpm full-check` (test + lint + type + build) green
- [ ] Browser E2E on production build: Help pages (incl. chem_table colors, chelates images); CSV import (upload sample fertilizers CSV) + export (download content check)
- [ ] Confirm no legacy CJS/Buffer remnants in Help/CSV chunks (grep bundle)
- [ ] Move task dir `.dumbspec/current/fix-vite-help-csv` → `.dumbspec/archive/` (all stages done)

**Criterion:** full-check green + browser e2e passes (both features work in prod build).
**Commit:** `docs(dumbspec): archive fix-vite-help-csv` (or `chore:` if any code was touched in stage 3)
