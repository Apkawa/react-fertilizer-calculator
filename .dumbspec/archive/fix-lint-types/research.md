# Research — fix-lint-types

## Inputs

- User: fix typing + linter errors, autonomously. Task = make `pnpm lint` and `pnpm type` pass (scripts in package.json: `lint: biome check src`, `type: tsc --build`). Pre-commit runs `pnpm full-check` = test + lint + build.

## Current state (measured)

- `pnpm lint` (biome 2.5.10, `biome.json` preset=recommended): **38 errors / 176 warnings / 31 infos** over 149 files. Full output: `lint-out.txt` (this dir, `--max-diagnostics=1000`).
- `pnpm type` (`tsc --build`, typescript ~3.7.2, tsconfig strict, `extends` `tsconfig.paths.json` → `@/*` → `./src/*`): fails with **~410 parse errors only** (TS1005 ×370, TS1128 ×29, TS1109 ×6, TS1160 ×2, TS1135/1127/1110/1003 ×1 each). No semantic errors surface because parsing fails first. Full output: `type-out.txt`.

## Root cause #1 (type): TS 3.7 vs modern syntax

- Source uses **TS 3.8+ / TS 4.5+ syntax**: `import type { ... }` statements and inline type specifiers `import { X, type Y }`. Examples:
  - `src/components/ui/Icon.tsx:1,4` — `import type { EmotionIcon }`, `{ Box, type BoxProps }`.
  - `src/components/Calculator/saga.ts:1` — `{ actionTypes, change, type FormAction, getFormValues, stopSubmit }`.
- typescript is pinned `~3.7.2` (leftover from CRA era; sibling task `migrate-vite-biome` deliberately froze it: "Версии TypeScript — не трогаем").
- The migrated vite-era code was plainly written assuming modern TS, so the frozen pin is now the inconsistency.

## Lint error-level rules (the 38/39 errors, ×-severity)

- `lint/correctness/useJsxKeyInIterable` — ~17
- `lint/correctness/useExhaustiveDependencies` — 5 (FIXABLE, likely false-ish on redux-form patterns; needs per-case judgment)
- `lint/a11y/noLabelWithoutControl` — 3
- `lint/suspicious/noDoubleEquals` — 3 (FIXABLE `===`)
- `lint/suspicious/noImplicitAnyLet` — 3
- `lint/suspicious/noArrayIndexKey` — 2 (array index as key — judgment call)
- `lint/suspicious/noExportsInTest` — 2 (`src/calculator/format/hpg.test.ts:48` exports EXAMPLE_FILE; `src/calculator/format/json.test.ts:16` exports EXAMPLE_STATE)
- `lint/a11y/useButtonType` — 1
- `lint/a11y/noSvgWithoutTitle` — 1
- Warnings (176, do not block lint): `noUnusedImports` ×59, `noExplicitAny` ×49, `noBannedTypes` ×32, `useJsxKeyInIterable` warnings?, `noUnusedFunctionParameters` ×16, `useLiteralKeys` ×14, `useOptionalChain` ×9, `noUselessFragments` ×8, style rules, etc.

## Sibling task `migrate-vite-biome` (current/, finished commits 8295b92/47adb05/8593c4c)

- Its plan.md already listed pre-existing tsc errors that were deferred (TS7016 App.test, TS1208 example.ts isolatedModules, TS2741 json.test mixerOptions, TS2307 `*.svg` no module declaration in `pages/App/index.tsx`).
- Decision recorded there: TS version frozen at 3.7 "as separate concern". That is now the concern to resolve.

## Key open question (spike pending)

Does the code type-check cleanly under modern TS (5.x) with existing old `@types/*` pins (@types/react ^16.9, @types/node ^12, ...)? Spike: upgrade typescript, run `tsc --build`, count semantic errors.

## Environment notes

- Sandbox = workspace-write: cannot write to `~/.npm`, `~/.local/share/pnpm/store` (unproven), `/tmp` (denied). pnpm default store broken (`ERR_SQLITE_ERROR`); project policy store = `./.pnpm-cache/v11` (populated: files/index.db/links/projects). node_modules currently linked from global store `~/.local/share/pnpm/store/v11` → pnpm store-dir switch requires `pnpm install` first.
- `tsc` script is `tsc --build`; tsconfig `noEmit: true`, `skipLibCheck: true`, `strict: true`, target es5, jsx classic.

## Spike: TypeScript 7.0.2 (executed)

- Store switch: node_modules was linked from global store (read-only in sandbox). Fix: `rm -rf node_modules` + `pnpm_config_store_dir=./.pnpm-cache/v11 pnpm add -D typescript@latest` → installed **typescript 7.0.2** (native compiler era). Local store populated; install clean in 36s.
- TS 7 removed options → tsconfig modernized (already applied in spike): `baseUrl` removed (paths now relative to tsconfig), `target: es5` → `es2020`, `downlevelIteration` removed, `moduleResolution: node` → `bundler` (`module: esnext` kept). `moduleResolution` duplicate key in tsconfig.json dropped.
- Result: **217 errors**, all semantic (no parse errors):
  - **~191 in test files** — TS2593/TS2304 `test`/`describe`/`expect` unknown: vitest runs with `globals: true` (vitest.config.ts) but tsconfig never declared the globals types. Fix: `"types": ["vitest/globals"]` (verify; fallback `/// <reference types="vitest/globals" />` per file — no, tsconfig field is the way).
  - **TS2591 `require` ×2**: `src/calculator/density-calculator/interpolation.ts:9` (`require("cubic-spline")`), `src/themes/index.ts:3` (`require("@theme-ui/presets")`, `const presets: any`). @types/node@12 auto-inclusion does not surface `require` under TS7 bundler resolution. Decision: replace `require` with ESM `import` (Vite-native) + shorthand module declarations for the untyped deps.
  - **TS2882/TS2307 assets ×3**: `*.css` side-effect import (TabMenu.tsx:8, App/index.tsx:3), `./logo.svg` (App/index.tsx:2). Fix: `declare module "*.css";` + svg module decl in `types/globals.d.ts` (vite/client not referenced).
  - **TS1361 `import type React` used as value ×6**: `IconButton.tsx:3` and `RebassWidgets/Number.tsx:2` — classic JSX runtime needs `React` as value. Fix: `import React from "react"` (value import still provides the `React.HTMLProps` type).
  - **TS7053 ×4** — indexing `NPKOxides` (literal `{NO3,NH4,P,K,Ca,Mg}` in `calculator/constants.ts:145`) with `keyof Elements` keys in `fertilizer.ts:25`, `profile.ts:255`, `AddItemElementForm.tsx:17`, `SelectedListItem.tsx:22` (each behind `Object.hasOwn` guard; TS does not narrow this pattern). Fix: annotate `NPKOxides` as `Record<string, string>` in constants (one spot).
  - **TS2339 ×3** — `Recipe.tsx:52,81` `values.recipe` where `useFormValues()` defaults `FormValues = object` (hooks/ReduxForm.ts) → parametrize: `useFormValues<{ recipe?: NeedElements; [k: string]: unknown }>(useFormName())`. `Help.tsx:9` — `useParams()` returns `{}` → `useParams<{ slug?: string }>()`.
  - **TS7057 `saga.ts:68`** — `yield select(...)` in `calculateStartSaga` without generator return annotation → annotate `function* calculateStartSaga(): Generator`.
  - **TS2345 `Dropdown.tsx:61`** — `setItem(item)` with `ItemType<T>` into `useState<T | null>`-ish state → cast `item as NonNullable<T> | null` (minimal).
  - **TS2741 `json.test.ts:23`** — fixture missing `mixerOptions` (known pre-existing, sibling task) → add field to fixture.

## Lint inventory (39 error-level × diagnostics, `biome check src`, full in lint-out.txt)

- `useJsxKeyInIterable` ×17 (Accuracy, RecipeTuneForm×4, Result, ResultDilution, ChemFormula×5, AddEdit×2, DropdownList, FertilizerSelect/AddItemFertilizerEditForm) — add `key` in `.map` render sites.
- `useExhaustiveDependencies` ×5 (Dropdown.tsx:47, DropdownList.tsx:15, Icon.tsx:18, IconButton.tsx:28, Number.tsx:71) — FIXABLE; per-case: add missing dep where safe, `biome-ignore` comment where the dep is intentionally omitted (redux-form context objects).
- `noLabelWithoutControl` ×3 (AddEditNPKString:41, FM/AddItemElementForm:21, FS/AddItemElementForm:31) — label without htmlFor/control; wrap input in label or add htmlFor.
- `noDoubleEquals` ×3 (dilution.ts:90, format/hpg.ts:167, index.ts:208) — `==` → `===`.
- `noImplicitAnyLet` ×3 (index.ts:349 `let score;`, molecularParser.ts:17,148) — add annotations.
- `noArrayIndexKey` ×2 (AddEditCompositionList:25, DropdownList:31) — array index as key → stable id/content key.
- `noExportsInTest` ×2 (hpg.test.ts:48 `EXAMPLE_FILE`, json.test.ts:16 `EXAMPLE_STATE`) — grep: **not imported anywhere**; drop `export`.
- `useButtonType` ×1 (Recipe.tsx:103) — `<button>` without type → `type="button"`.
- `noSvgWithoutTitle` ×1 (`src/pages/App/logo.svg:1:1`) — Biome lints .svg as a11y target; it's a static asset → exclude in `biome.json` `files.ignore`.

## Notes

- 176 warnings + 31 infos do not fail `biome check` (only error-level does); out of scope (recorded, not fixed).
- Pre-commit = `pnpm full-check` = test + lint + build; after this task all three legs must stay green (tests unchanged behaviorally).
- `tsc --build` may emit `tsconfig.tsbuildinfo` — verify after first run, gitignore if so.
