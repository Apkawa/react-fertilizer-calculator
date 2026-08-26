# Спецификация: исправить ошибки типизации и линтера

## Цель

`pnpm lint` и `pnpm type` проходят без ошибок (exit 0), при этом `pnpm test` и `pnpm build` остаются зелёными (pre-commit = `pnpm full-check`). Поведение приложения не меняется: правки — типизация, объявления модулей, `key` в JSX, сравнения `===`, мелкие уточнения типов.

## Текущее состояние (измерено, см. research.md)

- **`pnpm type`** (`tsc --build`, TS 3.7.2): ~410 **парсинг**-ошибок. Корень: код использует `import type` / inline `type`-импорты (TS 3.8+/4.5+), а TypeScript заморожен на 3.7.2.
- **`pnpm lint`** (Biome 2.5): **38 errors / 176 warnings / 31 infos**. Ошибки не блокируются, пока не исправлены: 17 useJsxKeyInIterable, 5 useExhaustiveDependencies, 3 noLabelWithoutControl, 3 noDoubleEquals, 3 noImplicitAnyLet, 2 noArrayIndexKey, 2 noExportsInTest, 1 useButtonType, 1 noSvgWithoutTitle.

## Решение

### Типы: апгрейд TypeScript 3.7.2 → latest (7.0.2) + модернизация tsconfig

- Фиксация на 3.7 — артефакт CRA-эры; код, переписанный при миграции на Vite/Biome, написан под современный TS (inline `type`-импорты повсюду). Откатывать синтаксис кода «вниз» на 3.7-совместимый — против направление проекта; апгрейд компилятора — единая точка изменения.
- TS 7 удалил: `baseUrl`, `target: es5`, `downlevelIteration`, `moduleResolution: node10`. Новые значения: `target: es2020`, `module: esnext`, `moduleResolution: bundler`; `paths` (без baseUrl) относительно tsconfig.
- Тесты используют globals (`vitest` `globals: true`) → `types: ["vitest/globals"]` в tsconfig.
- `require(...)` в `density-calculator/interpolation.ts` и `themes/index.ts` → ESM `import` (родной для Vite) + объявления неопределённых модулей `cubic-spline`, `@theme-ui/presets` в `types/globals.d.ts`.
- `*.css` / `*.svg` (side-effect и value-импорты): объявления модулей в `types/globals.d.ts` (как и решено было отложить в задаче migrate-vite-biome).

### Типы: семантические ошибки (~20, список в research.md)

- `NPKOxides` → `Record<string, string>` (constants) — снимает TS7053 в 4 местах.
- `import type React` → `import React` (IconButton, Number) — classic JSX runtime требует React как значение.
- Recipe.tsx: `useFormValues<{ recipe?: NeedElements; ... }>`; Help.tsx: `useParams<{ slug?: string }>()`.
- saga.ts:68: аннотация `function* calculateStartSaga(): Generator`.
- Dropdown.tsx:61: каст `item as NonNullable<T> | null`.
- json.test.ts: добавить `mixerOptions` в fixture (TS2741).

### Линтер: 38 ошибок, правки без смены поведения

- `useJsxKeyInIterable` / `noArrayIndexKey`: добавить `key` в `.map()`-рендер (стабильные id / содержимое, не индексы массива).
- `useExhaustiveDependencies`: добавить зависимость, если безопасно; `biome-ignore` с комментарием, если намеренно (контекст redux-form).
- `noLabelWithoutControl`: label оборачивает/привязывает контрол ( htmlFor).
- `noDoubleEquals` → `===` (3 места, семаантика идентична при сравнении `typeof`/чисел).
- `noImplicitAnyLet`: явные аннотации `let`.
- `noExportsInTest`: убрать `export` из `EXAMPLE_FILE` / `EXAMPLE_STATE` (никем не импортируются — проверено grep).
- `useButtonType`: `type="button"`.
- `noSvgWithoutTitle` на `src/pages/App/logo.svg` — статичный ассет: исключить в `files.ignore` в biome.json.

**Не в скоуп:** 176 warnings + 31 infos (`biome check` не роняет по ним) — задокументировано, не чинится; обновление старых `@types/*` (не требуется — `skipLibCheck`).

## Критерии приёмки

1. `pnpm type` → exit 0.
2. `pnpm lint` → exit 0 (0 errors).
3. `pnpm test` и `pnpm build` → exit 0 (поведение не изменилось).
4. AGENTS.md: обновить «TypeScript 3.7» → актуальную версию.
