# icons-refactor: implementation plan (своя библиотека иконок packages/icons)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] Исследование: зависимости, потребители, архитектура, пакетная модель, тема, e2e-селекторы (research.md)
- [x] Уточнение draft/spec (гейт: без правок; scope `@emotion` = только иконочные)
- [x] spec.md (финальный) и plan.md

**Criterion:** draft/research/spec/plan существуют; пользователь подтвердил план.
**Commit:** `chore(dumbspec): icons-refactor research, spec, plan`

## Stage 1 — Пакет packages/icons: скелет + red-тесты + реализация
- [ ] Скелет пакета: `package.json` (`@fertilizer/icons`, source-пакет: `main`/`exports` → `src/*.ts`; deps react/rebass/theme-ui; devDeps typescript/vitest/@types/react/@testing-library/react/jsdom), `tsconfig.json` (jsx react, strict), `vitest.config.ts` (jsdom, globals)
- [ ] RED: тесты в пакете `src/__tests__/IconButton.test.tsx` + `registry.test.ts` (Icon/IconButton рендерят svg по `name`; реестр = 14 имён) — падают (нет реализации)
- [ ] GREEN: 14 собственных SVG (`src/icons/*`, 24×24, `fill="currentColor"`, по смыслу), `src/registry.ts` (`IconName` = union, мапа name→иконка), `src/Icon.tsx` (Box-обёртка, `size` 1.5em, цвет = theme.colors.text через theme-ui `useTheme`), `src/IconButton.tsx` (Button, children, marginRight=2, цвет = theme.colors.background), `src/index.ts`, локальный render-хелпер (ThemeProvider + минимальная тема)
- [ ] REFACTOR: комментарии по-русски, типы, чистота
- [ ] Корневой `package.json`: `test` = `pnpm -C packages/calculator test && pnpm -C packages/icons test && pnpm -C apps/web test`; `type` = `tsc -p packages/calculator && tsc -p packages/icons && tsc -p apps/web`
- [ ] `pnpm install` (ссылка workspace), `pnpm -C packages/icons test` + `tsc -p packages/icons` зелёные

**Criterion:** `pnpm -C packages/icons test` и `tsc -p packages/icons` проходят; тесты дока (Icon по name, 14 иконок в реестре).
**Commit:** `feat(icons): new @fertilizer/icons source package (Icon/IconButton by name + 14 SVGs)`

## Stage 2 — Миграция приложения на name=
- [ ] RED: тесты приложения без старых импортов (см. шаги ниже); red через tsc/тесты после удаления старых файлов
- [ ] Миграция потребителей (18 файлов): `ColorModeToggle` (moon/sun), `Modal` (close), `Sidebar` (menu/close), `Dropdown` (chevron-down в styled-обёртке без цвета), `FertilizerManager/{List,Item}` (plus/restart, edit/trash), `FertilizerSelect/{AddItem,SelectedListItem}` (plus, close), `ImportExport/*` (import/export), `Result`/`Mixer` (save), `Calculator/index` (restart), `Options/Recipe` (save/broom/tune)
- [ ] `ui/IconButton.test.tsx` — удалить (тест теперь в пакете); `ui/Icon.tsx`, `ui/IconButton.tsx` — удалить
- [ ] REFACTOR: алиасы импортов, комментарии, линт
- [ ] `pnpm test` (все 3 пакета) + `pnpm lint` + `pnpm type` зелёные; grep `@styled-icons|@emotion-icons|emotion-theming` в `apps/web/src` = пусто

**Criterion:** приложение использует только `name=` из `@fertilizer/icons`; старых файлов нет; full-набор test/lint/type проходит.
**Commit:** `refactor(web): use @fertilizer/icons by name, drop legacy Icon/IconButton`

## Stage 3 — Выкидывание иконочных зависимостей
- [ ] `apps/web/package.json`: убрать `@styled-icons/*` (7), `styled-icons`, `@emotion-icons/boxicons-solid`, `@emotion-icons/emotion-icon`, `emotion-icons`, `emotion-theming`
- [ ] `pnpm install` (обновить pnpm-lock.yaml)
- [ ] `pnpm full-check` (test + lint + type + build) зелёный
- [ ] (опционально, руками) `pnpm test:e2e`/`test:smoke` — селекторы `div:has(> svg)` живы; если без браузера в песочнице — зафиксировать в итоге
- [ ] `AGENTS.md`: добавить `packages/icons/` в структуру

**Criterion:** в `apps/web/package.json` нет иконочных пакетов; `pnpm full-check` зелёный; grep по пакетам чистый.
**Commit:** `chore(web): drop icon dependencies (@styled-icons, @emotion-icons, emotion-theming)`
