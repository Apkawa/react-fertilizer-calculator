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
- [x] Add `"types": ["vitest/globals"]` to tsconfig.json (kills ~191 test-global errors)
- [x] Replace `require("cubic-spline")` / `require("@theme-ui/presets")` with ESM imports
- [x] Add module declarations (`*.css`, `*.svg`, `cubic-spline`, `@theme-ui/presets`) to `types/globals.d.ts`
- [x] Verify: `pnpm type` shows only remaining semantic errors (no config/parse/global errors)

**Criterion:** tsc reports no TS2593/TS2304 (test globals), no TS2591 (require), no TS2882/TS2307 (assets), no config errors.
**Commit:** `build: typescript 7.0.2, tsconfig modernization, module declarations`

## Stage 2 — Semantic type fixes (~20 errors, 14 files)
- [x] `NPKOxides` → `Record<string, string>` (constants.ts) — fixes TS7053 ×4
- [x] `import type React` → `import React` in IconButton.tsx, RebassWidgets/Number.tsx (TS1361 ×6)
- [x] Recipe.tsx: parametrize `useFormValues` (TS2339 ×2)
- [x] Help.tsx: `useParams<{ slug?: string }>()` (TS2339)
- [x] saga.ts: `calculateStartSaga` generator return annotation (TS7057)
- [x] Dropdown.tsx:61 cast (TS2345)
- [x] json.test.ts fixture: add `mixerOptions` (TS2741)
- [x] Verify: `pnpm type` exit 0; `pnpm test` still green

**Criterion:** `pnpm type` → 0 errors.
**Commit:** `fix: resolve all tsc semantic errors`

## Stage 3 — Lint fixes (38 error-level diagnostics)
- [x] jsx keys: 17 `useJsxKeyInIterable` + 1 `useJsxKeyInIterable` in Recipe.tsx (`MACRO_ELEMENT_NAMES.map`) + 2 `noArrayIndexKey`
- [x] `useExhaustiveDependencies` ×5: deps lists normalized (empty `[]` for mount-only effects, real deps `[buttonRef, size]`)
- [x] `noLabelWithoutControl` ×3: FM/FS labels bind the control via `htmlFor`/`id`; AddEditNPKString — empty spacer label, `htmlFor`/`id` on the input + justified `biome-ignore` (id lives in a custom wrapper component, invisible to biome)
- [x] `noDoubleEquals` ×3 → `===` / `!==`
- [x] `noImplicitAnyLet` ×3: annotate `let` (molecularParser: `finishingNestedSubgroup` is a boolean flag — fixed in the Stage 4 pass, see journal)
- [x] `noExportsInTest` ×2: drop `export` from EXAMPLE_FILE / EXAMPLE_STATE
- [x] `useButtonType` ×1: `type="button"`
- [x] `organizeImports` ×2: merge the two react imports in IconButton.tsx / Number.tsx after the TS1361 fix
- [x] logo.svg: instead of ignoring the file (Biome 2.x has no `files.ignore` and JSONC comments are not allowed in biome.json), added a `<title>` to the svg itself — `noSvgWithoutTitle` fixed at the source
- [x] Verify: `pnpm lint` exit 0 (0 errors); `pnpm test` still green

**Criterion:** `biome check src` → "Checked … files", 0 errors, exit 0.
**Commit:** `fix: resolve all biome error-level lint issues`

## Stage 4 — Full check + docs
- [x] `pnpm type` green after the boolean fix in molecularParser.ts (fresh `tsc --build` after dropping the stale tsbuildinfo)
- [x] `pnpm build` green: `@theme-ui/presets` exports `polaris` by name (no default) — named import in `src/themes/index.ts`
- [x] `pnpm full-check` (test + lint + build) exit 0
- [x] Update AGENTS.md: "TypeScript 3.7 (strict)" → "TypeScript 7 (strict)"
- [x] Move `.dumbspec/current/fix-lint-types` → `.dumbspec/archive/fix-lint-types`
- [x] Untrack `tsconfig.tsbuildinfo` (incremental-build artefact; added to `.gitignore`)
- [x] pre-commit hook repaired in `.git` (husky v4 `pnpx --no-install husky-run` is incompatible with pnpm 11 `dlx`); hook now runs `pnpm full-check` directly — final commit passes without `--no-verify`

**Criterion:** `pnpm full-check` exit 0 end-to-end; task archived with all checkboxes `[x]`.
**Commit:** `chore: full-check green, archive fix-lint-types task`

---

## Journal (deviations from the original plan)

1. **`files.ignore` does not exist in Biome 2.x** (known keys: `maxSize`, `ignoreUnknown`, `includes`, `experimentalScannerIgnores`), and biome.json is strict JSON — a JSONC comment inside broke the config and biome silently fell back to defaults (tab indent → spurious format errors). Resolution: fixed `noSvgWithoutTitle` by adding `<title>` to `src/pages/App/logo.svg` instead.
2. **`noArrayIndexKey`** also flags composite keys using the index (`i + ":" + String(s)`). Resolution: content keys `key={String(s)}` in DropdownList (values are unique by usage).
3. **`noLabelWithoutControl`**: biome cannot see through custom wrapper components (`Input` from redux-form/rebass), so a label wrapping the component is not recognized. Resolution: explicit `htmlFor`/`id` association.
4. **molecularParser.ts** (post-Stage-2): the `SubgroupType | undefined` annotation for `finishingNestedSubgroup` was wrong — the variable is a boolean flag (`true`/`false`). The error was masked by the committed `tsconfig.tsbuildinfo` (incremental build trusted stale state); after dropping the buildinfo, a fresh `tsc --build` reported TS2322 ×3. Fixed: `let finishingNestedSubgroup = false;`.
5. **`@theme-ui/presets`** (build): the ESM build has only named exports — `import presets from` failed with `MISSING_EXPORT` in `pnpm build`. Fixed: `import { polaris } from "@theme-ui/presets";`.
6. **Husky v4 pre-commit** wrapper runs `pnpx --no-install husky-run <hook>`; pnpm 11 removed `--no-install` from `dlx` → every commit failed with `Unknown option: 'install'` even with green checks. Fixed `.git/hooks/pre-commit` to run `pnpm full-check` directly (same command as `husky.hooks.pre-commit` in package.json), keeping the `HUSKY_SKIP_HOOKS` bypass.
