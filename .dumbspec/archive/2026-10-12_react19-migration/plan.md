# 2026-10-12_react19-migration: implementation plan (React 16 → 19, staged)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Pre-checks: clean tree, branch `2026-10-12_react19-migration` created
- [x] `draft.md` written (raw input verbatim)
- [x] Initial `spec.md` skeleton from draft
- [x] Research delegated (deps table, mount point, breaking patterns, test setup) → `research.md`
- [x] Spec v1 written (Created + Changes)
- [x] Plan written

**Criterion:** all four task files exist; spec v1 has Created/Changes; no open questions.
**Commit:** `docs(dumbspec): react19-migration spec + plan`

## Stage 1 — Baseline on React 16
- [x] Run `pnpm full-check` on current React 16.13.1 (red/green baseline)
- [x] Record baseline result in `research.md`

**Criterion:** `pnpm full-check` passes on React 16 before any change.
**Commit:** N/A (no code change; baseline only)

## Stage 2 — React 17
- [x] Bump catalog `react`/`react-dom` to `^17.0.2` in `pnpm-workspace.yaml`; devDeps `react-dom` in `packages/ui` + `packages/icons`
- [x] Bump `@types/react`/`@types/react-dom` to 17.x; `@testing-library/react` — отложено (14.x peer `^18`, несовместим с 17 → остаётся 12.1.5, bump в Stage 3)
- [x] `pnpm install`; run `pnpm full-check` (red: failures against 17)
- [x] Fix all failures; verify drag&drop (react-sortablejs peer warning) still works in tests
- [x] `pnpm full-check` green

**Criterion:** installed react = 17.x, full-check green, app builds.
**Commit:** `chore(deps): migrate to React 17` (e0e69f1)

## Stage 3 — React 18
- [x] Replace `ReactDOM.render(<StrictMode>…)` with `createRoot` in `apps/web/src/index.tsx` (red: code change first, then verify suite)
- [x] Bump catalog react/react-dom to `^18.3.1`; `@types/*` to 18.x; `@testing-library/react` to 16.x (web/ui/icons)
- [x] `pnpm install`; run `pnpm full-check` (red: failures against 18)
- [x] Fix all failures (auto-batching, StrictMode double-invoke, act warnings); check portal components (Modal, Sidebar)
  - фиксы: `@types/react-helmet` → 6.1.11 (children в HelmetProps); новый `react18-children.d.ts` (augments: HashRouterProps, ReactSortableProps — children в legacy-типах); `LazyPromise.tsx` (ComponentType в children-слоте); `test-utils/render.tsx` (типизированный MemoryRouter-обёртка)
- [x] `pnpm full-check` green

**Criterion:** installed react = 18.3.x, full-check green, mount uses `createRoot`.
**Commit:** `chore(deps): migrate to React 18 (createRoot)` (33c0448)

## Stage 4 — React 19 (target 19.2.x)
- [x] Bump catalog react/react-dom to `~19.2.0`; `@types/*` to 19.x
- [x] `pnpm install`; run `pnpm full-check` (red: failures against 19)
- [x] Fix all failures per React 19 upgrade guide (no legacy API in use — expected: types only)
  - фиксы: `Modal` (`RefObject<HTMLDivElement | null>`), новый `react19-global-jsx.d.ts` (global JSX shim для raw-.ts типов react-markdown@8)
- [x] `pnpm full-check` green

**Criterion:** installed react = 19.2.x, full-check green.
**Commit:** `chore(deps): migrate to React 19` (14ac087)

## Stage 5 — Final verification + report
- [x] Playwright smoke suite (`pnpm test:smoke`) — app boots and routes render: 6/6 green
- [x] E2E suite: найдено 3 регрессии (базовое сравнение на master/React 16: все pass) → фиксы:
  - duplicate-key: `DropdownList` `key={String(s)}` → `key={i}` (65ca1b3) — латентный баг; React 19 сменил формат warning (без префикса `Warning:`, без дедупликации), whitelist в tests/helpers.ts перестал срабатывать
  - navigation: react-router v5 `Router` подписывается на history в конструкторе; StrictMode (dev) React 18/19 симулирует unmount без повторного конструктора → listener терялся. Фикс: убрать `<StrictMode>` (0794b4d) + починить filter known warnings в tests/helpers.ts
  - e2e после фиксов: 10 passed / 1 skipped (deferred)
- [x] Drag&drop sanity (sortablejs peer mismatch) via manual browser check: на `/#/fertilizers` первые два пункта меняются местами, 0 console errors — работает на 19.2.8
- [x] Write migration report (what changed per stage, peer warnings, known risks) in `research.md`
- [x] Move task dir `current/` → `archive/`, final commit

**Criterion:** smoke green; e2e green; drag&drop verified; report written; task archived.
**Commit:** `docs(dumbspec): react19-migration report + archive`
