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
**Commit:** `1d2734f` `chore(dumbspec): icons-refactor research, spec, plan`

## Stage 1 — Пакет packages/icons: скелет + red-тесты + реализация
- [x] Скелет пакета: `package.json` (`@fertilizer/icons`, source-пакет: `main`/`exports` → `src/*.ts`; deps react/rebass/theme-ui; devDeps typescript/vitest/@types/react/@testing-library/react/jsdom), `tsconfig.json` (jsx react, strict), `vitest.config.ts` (jsdom, globals)
- [x] RED: тесты в пакете `src/__tests__/IconButton.test.tsx` + `registry.test.ts` (Icon/IconButton рендерят svg по `name`; реестр = 14 имён) — падают (нет реализации)
- [x] GREEN: 14 собственных SVG (`src/icons/*`, 24×24, `fill="currentColor"`, по смыслу), `src/registry.ts` (`IconName` = union, мапа name→иконка), `src/Icon.tsx` (Box-обёртка, `size` 1.5em), `src/IconButton.tsx` (Button, children, marginRight=2), `src/index.ts`, локальный render-хелпер (ThemeProvider + polaris)
  - Отклонение от плана: цвет иконки = `currentColor` (без обращения к теме) — `useThemeUI` удалён: у приложения и пакета разные экземпляры theme-ui, и в приложении `theme` был `null` (краш в jsdom); наследование currentColor совпадает с поведением старых иконок.
- [x] REFACTOR: комментарии по-русски, типы, чистота
- [x] Корневой `package.json`: `test` = `pnpm -C packages/calculator test && pnpm -C packages/icons test && pnpm -C apps/web test`; `type` = `tsc -p packages/calculator && tsc -p packages/icons && tsc -p apps/web`
- [x] `pnpm install` (ссылка workspace), `pnpm -C packages/icons test` + `tsc -p packages/icons` зелёные

**Criterion:** `pnpm -C packages/icons test` и `tsc -p packages/icons` проходят; тесты дока (Icon по name, 14 иконок в реестре).
**Commit:** `0ccc4f1` `feat(icons): new @fertilizer/icons source package (Icon/IconButton by name + 14 SVGs)`

## Stage 2 — Миграция приложения на name=
- [x] RED: тесты приложения без старых импортов (см. шаги ниже); red через tsc/тесты после удаления старых файлов
- [x] Миграция потребителей (18 файлов): `ColorModeToggle` (moon/sun), `Modal` (close), `Sidebar` (menu/close), `Dropdown` (chevron-down в styled-обёртке без цвета), `FertilizerManager/{List,Item}` (plus/restart, edit/trash), `FertilizerSelect/{AddItem,SelectedListItem}` (plus, close), `ImportExport/*` (import/export), `Result`/`Mixer` (save), `Calculator/index` (restart), `Options/Recipe` (save/broom/tune)
- [x] `ui/IconButton.test.tsx` — удалить (тест теперь в пакете); `ui/Icon.tsx`, `ui/IconButton.tsx` — удалить
- [x] REFACTOR: алиасы импортов, комментарии, линт (biome `--write` на изменённых файлах)
- [x] `pnpm test` (все 3 пакета) + `pnpm lint` + `pnpm type` зелёные; grep `@styled-icons|@emotion-icons|emotion-theming` в `apps/web/src` = пусто

**Criterion:** приложение использует только `name=` из `@fertilizer/icons`; старых файлов нет; full-набор test/lint/type проходит.
**Commit:** `f3c5105` `refactor(web): use @fertilizer/icons by name, drop legacy Icon/IconButton`

## Stage 3 — Выкидывание иконочных зависимостей
- [x] `apps/web/package.json`: убрать `@styled-icons/*` (6 + `styled-icons`), `@emotion-icons/boxicons-solid`, `@emotion-icons/emotion-icon`, `emotion-icons`, `emotion-theming`; `pnpm install` — lockfile очищен (−71 пакет)
- [x] `pnpm full-check` (test + lint + type + build) зелёный
- [x] `test:e2e`/`test:smoke` не запускались (опционально, браузер вручную): DOM-контракт `div > svg` сохранен по конструкции (Icon = Box + единственный svg-ребёнок)
- [x] `AGENTS.md`: добавить `packages/icons/` в структуру + строки test/type

**Criterion:** в `apps/web/package.json` нет иконочных пакетов; `pnpm full-check` зелёный; grep по пакетам чистый.
**Commit:** `8f0103e` `chore(web): drop icon dependencies (@styled-icons, @emotion-icons, emotion-theming)`
