# fix-lint-types: implementation plan (type + lint fixes)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
Here the "red test" for every stage is the failing check itself (`pnpm type` / `pnpm lint`);
behavior is covered by the existing vitest suite which must stay green.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Measure `pnpm type` (TS 3.7 parse failures) and `pnpm lint` (38 errors) baselines; save outputs
- [x] Spike: bump TypeScript to 7.0.2, modernize tsconfig (removed options), measure semantic errors (217)
- [x] Classify errors: test globals vs. semantic; inventory all 39 error-level lint diagnostics
- [x] Write spec.md + plan.md

**Criterion:** research.md documents both failing checks, root cause, and every error category with file:line.
**Commit:** `docs(dumbspec): add fix-lint-types spec and plan`

## Stage 1 — Type infrastructure (TS 7 + tsconfig + module declarations)
- [ ] Add `"types": ["vitest/globals"]` to tsconfig.json (kills ~191 test-global errors)
- [ ] Replace `require("cubic-spline")` / `require("@theme-ui/presets")` with ESM imports
- [ ] Add module declarations (`*.css`, `*.svg`, `cubic-spline`, `@theme-ui/presets`) to `types/globals.d.ts`
- [ ] Verify: `pnpm type` shows only remaining semantic errors (no config/parse/global errors)

**Criterion:** tsc reports no TS2593/TS2304 (test globals), no TS2591 (require), no TS2882/TS2307 (assets), no config errors.
**Commit:** `build: typescript 7.0.2, tsconfig modernization, module declarations`

## Stage 2 — Semantic type fixes (~20 errors, 14 files)
- [ ] `NPKOxides` → `Record<string, string>` (constants.ts) — fixes TS7053 ×4
- [ ] `import type React` → `import React` in IconButton.tsx, RebassWidgets/Number.tsx (TS1361 ×6)
- [ ] Recipe.tsx: parametrize `useFormValues` (TS2339 ×2)
- [ ] Help.tsx: `useParams<{ slug?: string }>()` (TS2339)
- [ ] saga.ts: `calculateStartSaga` generator return annotation (TS7057)
- [ ] Dropdown.tsx:61 cast (TS2345)
- [ ] json.test.ts fixture: add `mixerOptions` (TS2741)
- [ ] Verify: `pnpm type` exit 0; `pnpm test` still green

**Criterion:** `pnpm type` → 0 errors.
**Commit:** `fix: resolve all tsc semantic errors`

## Stage 3 — Lint fixes (38 error-level diagnostics)
- [ ] jsx keys: 17 `useJsxKeyInIterable` + 2 `noArrayIndexKey` (stable ids/content keys, no array indexes)
- [ ] `useExhaustiveDependencies` ×5: add deps or `biome-ignore` with reason
- [ ] `noLabelWithoutControl` ×3: label wraps/binds its control
- [ ] `noDoubleEquals` ×3 → `===`
- [ ] `noImplicitAnyLet` ×3: annotate `let`
- [ ] `noExportsInTest` ×2: drop `export` from EXAMPLE_FILE / EXAMPLE_STATE
- [ ] `useButtonType` ×1: `type="button"`
- [ ] biome.json: ignore `src/pages/App/logo.svg` (static asset)
- [ ] Verify: `pnpm lint` exit 0 (0 errors); `pnpm test` still green

**Criterion:** `biome check src` → "Checked … files", 0 errors, exit 0.
**Commit:** `fix: resolve all biome error-level lint issues`

## Stage 4 — Full check + docs
- [ ] `pnpm full-check` (test + lint + build) exit 0
- [ ] Update AGENTS.md: "TypeScript 3.7 (strict)" → current version
- [ ] Move `.dumbspec/current/fix-lint-types` → `.dumbspec/archive/fix-lint-types`

**Criterion:** `pnpm full-check` exit 0 end-to-end; task archived with all checkboxes `[x]`.
**Commit:** `chore: full-check green, archive fix-lint-types task`
