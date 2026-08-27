# Research: fix-vite-help-csv

## 1. Help (src/pages/Help)

### Confirmed failure (runtime, reproducible)

- `pnpm type` (tsc --build) PASSES. `pnpm build` PASSES (Help chunk builds, ~201 kB).
- Browser smoke test (served `build/` via `node server.js` on :9005, chromium):
  navigating to `#/help/how_to_use` → page blank, console:

  ```
  TypeError: Object prototype may only be an Object or null: undefined
    at setPrototypeOf
    at e (build/assets/Help-CRUS-ct1.js:31:13042)
    ...rendered by React (react-B31X8Y7i.js)
  ```

- The code at that offset is a CJS `inherits()` polyfill + an html-parser-style
  `Parser` class — i.e. a CJS module from the `react-markdown@4` dependency tree
  (`react-markdown@4.3.1` deps: `unified@6`, `remark-parse@5`, `html-to-react`,
  `mdast-add-list-metadata`, ...). Its prototype chain is `undefined` under
  Vite's CJS→ESM interop. Root cause: **react-markdown@4 is a legacy CJS
  toolchain (2019) incompatible with Vite's ESM-first bundling.**

### Current Help implementation (src/pages/Help/)

- `pages.ts`: page registry; each page = `import("../../docs/<path>.md?raw").then(m => m.default)`
  (Vite-native `?raw` → string). Works (build emits per-md chunks).
- `Help.tsx`: uses v4-only API:
  - `import ReactMarkdown from "react-markdown/with-html"` (subpath exists in v4 only)
  - props `source`, `escapeHtml={false}`, `transformImageUri` (maps `./docs/<slug>/<img>`)
  - `transformImageUri` matters: docs reference local images (e.g. chelates/*.jpg),
    which `viteStaticCopy` copies to `build/docs/**`.

### Docs content (why HTML rendering must be preserved)

- Raw HTML in `src/docs`: `safety/chem_table.md` (per-row `<span style="color:...">`,
  `<br>` in table cells), `light.md`, `profile/README.md`. Old behavior rendered
  this HTML (with-html + escapeHtml=false). Losing it = visual regression on
  the safety table (colored hazard labels).

### react-markdown version constraints (registry, 2026-08-26)

- Installed: 4.3.1, peer `react: ^15 || ^16` (app is on React 16 — that's why it's pinned old).
- v5/v6/v7: `children` prop API, ESM, peer `react >=16`.
- **v8.0.7 (latest v8): peer `react >=16` ✓, pure ESM, no `with-html` subpath.**
- v9.0.0+ (up to latest 10.1.0): peer `react >=18` — NOT usable without a React upgrade.
- API changes v4 → v8:
  - `source` → `children`
  - `escapeHtml` → removed; raw HTML is NOT rendered by default (sanitized away).
    To render raw HTML: `rehypePlugins: [rehype-raw]` (+ rehype-sanitize w/ schema for `style`).
  - `transformImageUri` still present in v8 (deprecated in v9+/renamed `urlTransform`).
- Recommended new deps: `react-markdown@^8.0.7`, `rehype-raw@^6` (unified 10,
  matches rm v8 internals), `rehype-sanitize` + `hast-util-sanitize` (custom schema
  to allow `style` attribute on `<span>`; docs are static first-party content, so a
  permissive but bounded schema is acceptable).

## 2. CSV (src/utils/csv.ts)

### Current state

- Since the CRA→Vite migration commit `8295b92`, `csv.ts` is a STUB that throws
  "CSV: ... временно отключён" for both parse and export (comment: old libs use
  node `Buffer`, which webpack embedded but Vite does not).
- Original (pre-stub) code (git):
  `import parse from "csv-parse/lib/sync"; import stringify from "csv-stringify/lib/sync"`
  (v4.12.0 / v5.5.1 — CJS, Buffer-based).
- Consumers (4 components, ImportExport/):
  - `ImportFertilizers` / `ImportRecipes`: `csvParse(csv, { columns: COLUMNS })`
    (columns = explicit header array; caller skips a non-numeric first row as header).
  - `ExportFertilizers` / `ExportRecipes`: `csvExport(rows, { columns: [...], header: true })`,
    output fed to `saveData` (Blob download).
- The meta-package `csv@5.3.2` is a dev-time leftover — no imports of it found in src.

### Browser-capable replacements (registry check)

- `csv-parse@7.0.2` (latest): ships ESM + CJS, no Buffer required (Blob in browser),
  own TS types. Exports include `./sync` and `./browser/esm/sync` (ESM, browser-safe).
- `csv-stringify@6.8.3` (latest): same story; `./browser/esm/sync` ESM entry + types.
- API compat with current call sites: v7 `parse(input, {columns: string[]})` returns
  object rows (same as v4 array-columns mode); v6 `stringify(rows, {columns, header})`
  unchanged. Sync APIs still named `parse` / `stringify`.

## 3. Build / tooling facts

- TS 7.0.2 (`tsc --build`), strict; both new CSV pkgs ship types — fine under TS7.
- vite.config.ts: alias `@/`, `define` constants, `viteStaticCopy` for `src/docs/**/*.{jpg,png,jpeg}` → `build/docs/**`, PWA generateSW. Nothing needs to change there.
- Tests: vitest + jsdom, config merged from vite.config (so `?raw` imports work in tests).
  No existing tests for csv utils or markdown rendering — new tests to be added (TDD).
- `pnpm test` currently green (smoke App test + calculator tests); full-check = test+lint+type+build, husky pre-commit runs it.

## 4. Risks / open questions

- R1: react-markdown v8 sanitize schema — default `hast-util-sanitize` schema drops
  `style` attributes → chem_table colors would silently vanish. Mitigation: pass a
  custom schema (spread `defaultSchema` + `style` attr for span/td etc.), verify in test.
- R2: react-markdown v8 + React 16 runtime: peers allow it (`>=16`), but v8 is newer
  than v7; if runtime issues appear, fallback is v7.x (same API differences). Low risk.
- R3: csv-parse v7 `columns: string[]` semantics identical to v4 (verified in v6/v7
  docs: array of column names, header row skipped/absent). Behavior of
  `ImportFertilizers` header-row skip unchanged.
- R4: PWA precache list — new chunks fine (generateSW globs all).
- Removed risk considered and rejected: polyfill `Buffer` + keep old v4/v5 csv libs
  (works, but keeps legacy CJS deps; updating is cleaner and was the user's hint).
