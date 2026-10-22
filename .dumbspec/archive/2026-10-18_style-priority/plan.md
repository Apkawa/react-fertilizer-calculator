# 2026-10-18_style-priority: implementation plan (tailwind-утилиты побеждают классы CSS-модулей)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Зафиксировать draft.md (сырой запрос + скриншот DevTools)
- [x] Исследование: pipeline стилей (tailwind v4 entry, CSS-модули, порядок в dev и production, конфликты)
- [x] Spec v1 (решение: `@layer components` для всех `*.module.css`; «dev-only» опровергнуто)
- [x] Plan

**Criterion:** draft/research/spec/plan существуют; spec v1 без open questions; решение согласовано с фактами исследования (unlayered CSS > все слои; слой components пуст в билде).
**Commit:** `chore(dumbspec): add spec for css-module vs tailwind priority`

## Stage 1 — Обернуть все `*.module.css` в `@layer components`
- [x] Red: зафиксировать текущее поведение — в production css классы модулей unlayered (research Q4: реальная сборка; скриншот DevTools в draft: `_input_11chk_4 { width:100% }` побеждает `.w-24`)
- [x] Green (packages/ui): обернуть содержимое всех `style.module.css` (10 файлов; у Checkbox/Radio стилей нет) в `@layer components { ... }`
- [x] Green (apps/web): обернуть `components/navigation/style.module.css`, `pages/App/App.module.css`, `pages/Help/style.module.css` (`@import` Roboto оставлен вне слоя)
- [x] `pnpm lint` + `pnpm test` + `pnpm type` (lint: 259 файлов без замечаний; test: calculator 69, icons 23, ui 36, web 49 — все зелёные; tsc: 0 diagnostics)
- [x] `pnpm build` → `index-*.css`: все хеш-классы модулей внутри `@layer components` (`.w-24`/`.flex-1` в `@layer utilities`); `App-*.css`/`Help-*.css` — то же; unlayered `._*` — 0
- [x] Визуальная проверка dev (playwright, `#/formula`): input `w-24` = 96px, input `flex-1` = 836px (растянут) — PASS; скриншот `.tmp/chemformula-after.png`
- [x] Refactor: единый стиль обёртки во всех 13 файлах (проверено grep: каждый начинается с `@layer components {`, `@import` вне слоя, без trailing spaces; biome-формат прошёл)

**Criterion:** production css содержит `@layer components { … ._input_* … }`; в браузере (dev) ChemFormula-инпуты корректны; `pnpm full-check`-компоненты (test/lint/type/build) зелёные.
**Commit:** `fix(ui): wrap module styles in @layer components so tailwind utilities win`
