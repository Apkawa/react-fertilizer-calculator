# 2026-10-18_style-priority: приоритет tailwind-утилит над классами CSS-модулей

**Created:** 2026-10-18T11:23:05+03:00

## Scope

В scope:
- Сделать так, чтобы tailwind-утилиты (`w-24`, `flex-1`, `flex-col` …), применённые вместе с классом компонента, имели приоритет над базовыми стилями компонента — в dev и production.
- Охватить все CSS-модули проекта: `packages/ui/src/**/style.module.css` (11 файлов) и app-модули (`apps/web/src/components/navigation/style.module.css`, `apps/web/src/pages/App/App.module.css`, `apps/web/src/pages/Help/style.module.css`) — единое правило.
- Проверить, что конкретные места поломки (`pages/ChemFormula` — `<Input className="flex-1">`, `<Input className="w-24">`; потенциальные `Label flex flex-col`, `Text flex-1`) начинают рендериться корректно.

Out of scope:
- Переписывание самих стилей компонентов и API `@fertilizer/ui`.
- Runtime-`<style>` тэги Modal/Sidebar (`body { overflow: hidden }`) — они касательно `body`, конфликтов с утилитами нет.
- Font `@import url(...)` в navigation-модуле (косметика, не приоритет).

## Approach

Корневая причина (из исследования): стили компонентов — **незаслоённый (unlayered) CSS**, а tailwind-утилиты лежат в `@layer utilities`. Незаслоённый CSS побеждает любой слой независимо от порядка в документе — поэтому «просто поменять порядок в сборке» не сработает ни в dev, ни в production (гипотеза «только дев-сервер» опровержена реальной production-сборкой).

Решение (вариант 2 из draft): **обернуть содержимое всех `*.module.css` в `@layer components`**:

```css
@layer components {
  .input { … }
}
```

- CSS-модули хешат имена классов внутри, имя слоя остаётся — механизм совместим.
- Tailwind v4 в выводе уже объявляет порядок `properties, theme, base, components, utilities`: компонентные классы попадают в `components`, утилиты — в `utilities` → при равной специфичности побеждает утилита, независимо от порядка файлов.
- Слой `components` в текущем билде пуст — естественное место для компонентного CSS.
- Свойства preflight (`base`) продолжают проигрывать компонентным классам (base < components по порядку слоёв) — поведение не меняется.
- App-модули (страницы/навигация) тоже в `components` → утилиты на страницах тоже побеждают, единое правило.
- Никаких изменений в `vite.config.ts` и порядке импортов не требуется.

Риски и проверки:
- В `packages/ui` кросс-импорты чужих модулей (Dropdown→Input и т.д.) — они просто получают те же хеш-классы в том же слое, конфликтов не добавляет.
- Нужно проверить, что нет мест, где компонентный класс **должен** переопределять утилиту (исследование: таких мест нет — все текущие конфликты требуют победы утилиты).
- Принять по: production-сборке (в `index-*.css` классы модулей внутри `@layer components`) и визуально на dev-сервере (страница ChemFormula).

## Constraints

- Tailwind v4.3.3 + `@tailwindcss/vite`; единственный entry — `apps/web/src/styles/app.css` (`@import "tailwindcss"`, `@import "@fertilizer/ui/theme.css"`, `@source "../../../../packages/ui/src"`).
- Все стили компонентов уже мигрированы в `style.module.css` (коммит `ba6da55`); `@layer` в исходниках проекта сейчас нигде нет.
- `packages/ui` — source-пакет без build-шага; vite бандлит CSS напрямую.
- TDD/KISS: UI-глюк — KISS; приёмка — production-билд + визуал dev-сервера + существующие тесты (`pnpm test`).

## Open questions

- none (исследование закрыло все вопросы из draft, включая «dev-only» — опровергнуто).

## Changes

- 2026-10-18T11:23:05+03:00 -- v1, initial spec (draft + research)
