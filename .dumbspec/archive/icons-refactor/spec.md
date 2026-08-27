# Spec: icons-refactor

Рефакторинг иконок: переход от импорта иконочных компонентов (`component={Trash}` из `@styled-icons`/`@emotion-icons`) к собственной библиотеке SVG-иконок в пакете `packages/icons`, выбираемых по имени (`name="trash"`).

## Цель

Избавить приложение от внешних библиотек иконок и заменить их собственным набором SVG-иконок, которые мы поддерживаем в репозитории, без визуальной и DOM-регрессии.

## Scope

1. **Новый пакет `packages/icons`** (`@fertilizer/icons`) — source-пакет без шага сборки по модели `packages/calculator` (`main`/`exports` → `src/*.ts`, Vite бандлит TS напрямую, тс-проверка через `moduleResolution: bundler`).
   - Зависимости: `react` (16), `rebass` (Box/Button), `theme-ui` (`useTheme`); dev: `typescript`, `vitest`, `@types/react`, `@testing-library/react`, `jsdom`.
   - Содержит: 14 собственных SVG-иконок, реестр `name → icon`, компоненты `Icon` и `IconButton` (перенесённые из `apps/web/src/components/ui`), свой смок-тест.
2. **Перенос компонентов** из `apps/web/src/components/ui` в пакет:
   - `Icon.tsx`, `IconButton.tsx`, `IconButton.test.tsx` (тест переписывается под новый API и локальный render-хелпер пакета).
   - Прочих «забытых» иконочных компонентов в `ui/` не найдено; иконки напрямую использует также `Dropdown.tsx` (styled-обёртка `ChevronDownSquare`) — мигрируется на новый `Icon`.
3. **Смена API**: `component={Trash}` → `name="trash"`.
   - `Icon`: `{ name: IconName, size? = "1.5em", color?, disabled?, ... }` (обёртка `<Box>` сохранена — e2e-селектор `div:has(> svg)`).
   - `IconButton`: `{ name, children?, onClick?, title?, size?, disabled?, ... }` (обёртка rebass `<Button>` сохранена).
   - `IconName` — автогенерируемый union из реестра (автодополнение `name` в IDE).
4. **Собственные SVG-иконки — только 14 реально используемых**, 24×24, `fill="currentColor"`, придуманы по смыслу (не копия существующих наборов):
   `plus`, `trash`, `edit`, `import`, `export`, `save`, `restart`, `broom`, `tune`, `menu`, `close`, `sun`, `moon`, `chevron-down`.
   - Маппинг старых иконок → новые имена: Moon→`moon`, Sun→`sun`, Cross→`close`, Plus→`plus`, Restart→`restart`, Edit→`edit`, Trash→`trash`, Import→`import`, Export→`export`, Save→`save` (объединяет fa-regular и boxicons-regular), Broom→`broom`, Tune→`tune`, Menu→`menu`, ChevronDownSquare→`chevron-down`.
5. **Миграция потребителей** (`apps/web/src`): 18 файлов + тест — `ColorModeToggle`, `Modal`, `Sidebar`, `Dropdown`, `FertilizerManager/{List,Item}`, `FertilizerSelect/{AddItem,SelectedListItem}`, `ImportExport/{Import,Export}Fertilizers|Recipes|State`, `Result`, `Mixer`, `Calculator/index`, `Options/Recipe`, `IconButton.test`.
6. **Выкидывание зависимостей** из `apps/web/package.json` (только иконочные, решено с пользователем):
   - `@styled-icons/*` (7 пакетов), `styled-icons`, `@emotion-icons/*` (2), `emotion-icons`, `emotion-theming` (использовался только Icon/IconButton).
   - **Остаются**: `@emotion/styled` (обёртки ModalContainer/SidebarContainer/Dropdown — не иконочные), `styled-components`, `rebass`, `theme-ui`.
7. **Инфраструктура**:
   - Корневой `package.json`: `test` и `type` получают ноги `packages/icons`.
   - `AGENTS.md` — добавить `packages/icons/` в структуру.

## Не цели

- Не трогаем theme-ui/rebass/styled-components/`@emotion/styled` как стек.
- Не копируем SVG сторонних наборов; новые пути иконок не покрывают старых пикселями.
- Не меняем e2e/smoke-селекторы (DOM-контракт `Icon` сохранён: div → прямой svg-ребёнок).

## Ключевые ограничения (из исследования)

- e2e-селекторы (`tests/e2e/shared.ts:18`, `tests/e2e/navigation.test.ts:17`) зависят от DOM: `Icon` рендерит `<div>` с прямым `<svg>`.
- Цвета иконок: `theme.colors?.text` (Icon) / `theme.colors?.background` (IconButton) — новый код читает тему через **theme-ui `useTheme`** (Provider уже есть в `Root.tsx` и `test-utils/render.tsx`), без `emotion-theming`.
- `Save` в текущем коде — два разных пакета (fa-regular в Result/Mixer, boxicons-regular в Recipe); новый API объединяет в одно имя.
- Пакет потребляется как TS-source: его `.ts` входит в программу tsc приложения (механизм calculator-пакета), devDeps пакета должны давать типы (react 16 → `@types/react`).

## Подход

1. Пакет: скелет (package.json/tsconfig/vitest.config) → **red-тесты** в пакете (Icon/IconButton рендерят svg по `name`, реестр покрывает 14 имён) → реализация (иконки, реестр, компоненты, render-хелпер) → рефактор.
2. Миграция приложения: все потребители на `name=`, Dropdown на `Icon`, `IconButton.test.tsx` → в пакет; старые файлы удаляются.
3. Чистка: убрать иконочные зависимости из `apps/web/package.json`, `pnpm install` (lockfile), `pnpm full-check`.

## Критерии приёмки

- В `apps/web/src` нет импортов `@styled-icons`/`@emotion-icons`; в `apps/web/package.json` нет `@styled-icons*`, `styled-icons`, `@emotion-icons*`, `emotion-icons`, `emotion-theming`.
- `Icon`/`IconButton` живут в `packages/icons`, в приложении иконки выбираются только через `name="..."`.
- 14 SVG нарисованы в репозитории; в зависимостях приложения и пакета нет сторонних icon-пакетов.
- `pnpm full-check` (test + lint + type + build) проходит; `tests/e2e`-селекторы не сломаны (структура DOM `Icon` сохранена).
