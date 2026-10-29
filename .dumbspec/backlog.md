# Бэклог — известные кандидаты в задачи

Накопленные замечания/баги, не вошедшие в текущие задачи. Каждый пункт —
будущий `draft.md` задачи в `current/`; при взятии в работу переносить в
задачу и удалять отсюда. Язык — русский (user-facing, читается человеком;
спеки задач пишутся из него).

## 1. Дебаг-`console.log` в import-хендлерах
- Где: `apps/web/src/components/Calculator/ImportExport/ImportRecipes.tsx`,
  `ImportState.tsx`, `ImportFertilizers.tsx` — `handleOnChange` печатает
  `e.target.value`, `e.target.files?.[0]`, `reader.result`.
- Проблема: шум в production-консоли (в т.ч. содержимое файла).
- Кандидат: убрать логи (или заменить на пользовательскую обработку ошибки).

## 2. SW precache отдаёт stale-бандл после `pnpm build`
- Симптом: при проверке собранного бандла на :9005 service worker кормит
  старый bundle; обход — unregister SW + reload (рецепт уже использовался
  несколько раз).
- Кандидат: версионированный precache / `skipWaiting`+`clientsClaim`, либо
  зафиксировать рецепт unregister в AGENTS.md как канон проверки сборки.

## 3. Browser-тесты `packages/ui` без tailwind
- Симптом: utility-классы tailwind (`mt-auto` и т.п.) в browser-проекте
  пакета не существуют — layout-контракт обязан жить в CSS-модуле
  (уже кусало дважды: pin-панели, footer-слот).
- Кандидат: грузить tailwind в browser index.html (тогда контракты можно
  тестировать целиком), либо зафиксировать как канон: «layout — только
  CSS-модуль».

## 4. TabMenu падает без обязательных пропсов
- Симптом: `ICON_BY_MODE[undefined]` → undefined component при рендере
  `<TabMenu/>` без `colorMode`/`schemeId` (ловится только тестом).
- Кандидат: guard/дефолты или явная типизация — решить по KISS.

## 5. Легасный dev-сервер :3000 — навигация виснет
- Симптом: curl 200, но playwright-навигация виснет на мертвом процессе
  (окружение, не продукт). Кандидат: при проверках использовать :9005
  (статик) или перезапускать `pnpm start`; рецепт в AGENTS.md.
