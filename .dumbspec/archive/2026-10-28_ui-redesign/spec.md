# 2026-10-28_ui-redesign: редизайн верстки проекта по web-design

**Created:** 2026-10-28T21:08:47+03:00

## Scope

**В scope:**
1. Унифицированная система «тема × цветовая схема» в `packages/ui`:
   - тема: светлая/тёмная/системная — `html[data-theme] = light|dark` (применённый результат), persist `light|dark|system`;
   - схема: `html[data-scheme] = default|win95|retro|nature|science`;
   - API схем: схема = отдельный CSS-файл, объявляющий **токены** (light+dark), реестр схем + хук + CSS-экспорты из пакета; компоненты consumeют только токены, новые схемы добавляются без правки компонентов.
2. Редизайн верстки всех 12 компонентов `packages/ui` по макету/гайдлайну (кнопка-база, card, input, чипы, модалка, sidebar, dropdown, heading и т.д.).
3. Редизайн верстки компонентов приложения (`apps/web`) по тому же гайдлайну, с приоритетом **layout данных проекта** над макетом.
4. Типографика страниц справки (Help): заголовки, абзацы, таблицы, код — по гайдлайну.
5. Остальные страницы (ChemFormula, DensityCalculator, NotFound) — по аналогии с гайдлайном.
6. Схема-дропдаун и кнопка темы в header приложения (нативный select + toggle с иконкой системной темы — новая иконка «monitor» в `packages/icons`).

**Out of scope:**
- Логика/верстка GRUD-дропдауна выбора удобрений (merged selector из макета) — НЕ делаем; текущий Dropdown-выбор остаётся, только перестилерастся токенами.
- Отдельная страница GRUD — пока не делать.
- Содержимое модалок — реиспользуем существующие компоненты/модалки (`Modal` подцепится через редизайн `packages/ui`).
- Новая верстка инпута-спиннера с двумя кнопками — не делаем сейчас (NumberInput только перестилируется по базе кнопки; допил отдельно потом).
- Десятичная запятая в инпутах (`type=text inputmode=decimal` вместо current dot) — поведением не занимаемся сейчас (см. Open questions).
- Мёртвый код не трогаем: `pages/App`, `FertilizerSelect/AddItemElementForm/AddItemFertilizerEditForm`, `Diary`, `__tests__/example.ts`.

## Approach

- **Макет = ориентир внешнего вида, не новый layout.** Числа/составы рядов берутся из данных приложения (пример: в макете Result отсутствует чип `K:Mg` и ΔΣI — залипший литерал; в приложении ряд = 6 чипов из `getNPKDetailInfo`, значения считает ядро).
- **Токен-API тем/схем (главный механизм):**
  - `packages/ui/src/theme.css` переписывается на единый словарь токенов по именам макета: core `--bg --card --text --muted --border --primary --danger --ok --deficit --excess`, палитра элементов `--el-no3 --el-nh4 --el-p --el-k --el-ca --el-mg --el-s --el-cl --el-micro`, слой-тон `.el-*` → `--el-tint` (тон никогда не красит текст), shape-токены (`--radius`, `--border-width`, `--shadow-small/large`, hover-проценты кнопки) — чтобы схемы меняли форму/тени правкой токенов, а не классов.
  - Каждая схема = `packages/ui/src/scheme-<name>.css` (объявляет токены light `html[data-scheme=x]` и dark `html[data-scheme=x][data-theme=dark]`; default остаётся `:root` + media-fallback `prefers-color-scheme`). Цветовые литералы живут только в scheme-файлах (guideline §4.4/§10).
  - Специфичность по механизму макета: light default `:root`; dark default `:root[data-theme=dark]`; media-fallback только у default; светлая схема 0-1-1 побеждает `:root`; тёмная схема 0-2-1 побеждает fallback.
  - JS-API из пакета: `SCHEMES` реестр (`{id, label}`), хук `useColorScheme` (data-scheme + localStorage `ui:color-scheme`), subpath-экспорты CSS (`./theme.css`, `./scheme-win95.css` и т.д.); приложение импортирует все scheme-файлы в `app.css`.
  - Для редких структурных quirks схем (win95 inset-bevel, retro залитые кнопки) — стабильные хуки на компонентах: атрибут `data-ui="button|input|card|..."`; схема может targeting через `html[data-scheme=x] [data-ui=...]` и/или shape-токены. Это «API для схем», компоненты править не нужно при добавлении схемы.
  - `useColorMode` апгрейд: `ColorMode = light|dark|system` (persist `ui:color-mode`, миграция old `default`→`light` и legacy `theme-ui:mode`), слушает `matchMedia`, ставит применённый `light|dark`.
- **Компоненты `packages/ui`:** CSS-модули остаются (фактическое состояние пакета); верстка по канонам макета: одна база кнопки `.btn/.icon-btn` (height 2.5rem, radius токен, border/primary tint, hover 22%, SVG 24×24, заливных primary нет), card, input (0.875rem), чипы (balance — borderless muted 6%, element — tint+border, значения без `%`), heading h2 1.125rem/600, label 0.75rem muted, sidebar drawer. Компоненты правят только через токены + `data-ui`.
- **Приложение:** каркас по гайдлайну — контент 936px, 2 колонки ≥800px (на мобильном order swap: удобрения вниз), sidebar drawer <1250px (вместо docked >1650), header: theme toggle + scheme select; чипы элементов перестают хардкодить hex (consumeют `--el-*`/`--el-tint`); ряды «label слева / инпут справа» по §3.4; fertilizer rows по §3.1 (порядок grip→check→name→weight→edit→delete где данные позволяют; чекбоксов в текущем состоянии нет — не заводим).
- **Help:** типографика markdown'а в `pages/Help/style.module.css` по гайдлайну (§5): h-иерархия, p 0.875/1.5, таблицы uppercase th muted, code mono.
- TDD: сначала падающие/обновлённые тесты контракта (tests в `packages/ui` + `apps/web`), затем реализация; текстовые маркеры и aria-имена существующих тестов сохраняем.

## Constraints

- Стек: React + TS strict; `packages/ui` = CSS-модули внутри `@layer components` + tailwind v4 утилиты; tailwind подключается в `apps/web/src/styles/app.css` (`@import tailwindcss` + `@import "@fertilizer/ui/theme.css"` + `@source packages/ui/src`); для схем аналогичные `@import`s scheme-файлов.
- `packages/ui` тесты: 13 jsdom (в full-check) + 12 chromium browser (manual) + aria snapshots; storybook 10.5 (нет theme globals — добавим globals тема×схема для визуальной проверки).
- `packages/icons`: 14 SVG 24×24 stroke 2 currentColor + PNG snapshots (обновлять базлайны только для своих иконок через `ICON_PNG_FILTER`).
- Коммиты gated husky `pnpm full-check` (test+lint+type+build); playwright suites локальные.
- Сохраняемые контракты тестов: текстовые маркеры («Результат расчета», «ΔΣ I»), aria-имена, `type=submit` Calculate, маршруты `/#/`, `/#/fertilizers`, `App.test.tsx` на `data-theme` (контракт обновится на light|dark + system).
- Тема/схема переключаются до отрисовки (head-скрипт в макете; в приложении — синхронно до mount в index.tsx).
- Схема не меняет типографику/layout/spacing/motion (только цвета + border/radius/shadow/hover).

## Open questions

none (закрыты 2026-10-28, см. Changes)

## Changes

- 2026-10-28T21:08:47+03:00 -- v1, initial spec (draft + research R1–R3)
- 2026-10-28T21:44:38+03:00 -- пользователь закрыл open questions: запятая не делаем (поведение вне scope); NumberInput только перестилерастся (2-кнопочная верстка отложена); токены переименовываются на макетные `--bg/--card/…` + `--el-*`, неиспользуемые old-токены удаляются с rewiring потребителей; sidebar по гайдлайну: drawer <1250 вместо docked >1650
