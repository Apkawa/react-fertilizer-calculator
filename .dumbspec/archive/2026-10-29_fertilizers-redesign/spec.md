# 2026-10-29_fertilizers-redesign: логика работы с удобрениями в калькуляторе

**Created:** 2026-10-29T13:12:56+03:00

## Scope

**В scope:**
- «GRUD» (merged selector/manager, макет v6 `90c23f4`) переезжает в сам калькулятор: левая колонка экрана калькулятора становится manager-списком «Удобрения» вместо Dropdown-селектора `FertilizerSelect`.
- Layout — канон `apps/web-design/` (index.html §3.1, design-guideline.md): карточка `#fertilizers` = header «Удобрения» + icon-buttons plus / import ↓ / export ↑ / reset; строки grip → checkbox → name → weight → edit (слева от del) → del(trash); под строкой chip-элементы; inactive-строки `.is-inactive` (opacity .6, muted name, нейтральные chips, weight не показывается).
- Чекбокс = участие удобрения в расчёте (решение заказчика ниже).
- Модалка редактирования = текущий `FertilizerManager/AddEdit` (id, npk/composition «Формула», «Раствор» concentration/density, pump_number) — переносится в калькулятор как есть; правка library-удобрения обновляет выборку по id (store `pushFertilizer` уже синхронизирует).
- Импорт/Экспорт/сброс удобрений — icon-buttons в header карточки (отдельная карточка «Импорт/Экспорт» для удобрений из правой колонки уходит).

**Out of scope:**
- Схема данных — без изменений (никаких новых полей в `FertilizerInfo`/`CalculatorFormValues`; выборка остаётся `calculationForm.fertilizers` = copies по id).
- Реальный DnD — уже есть (`ReactSortable` + `ROW_HANDLE_SELECTOR`), остаётся.
- Расчётная логика `packages/calculator` не меняется.

## Approach

- Левая колонка `components/Calculator/index.tsx` заменяется manager-style списком внутри калькулятора; `FertilizerSelect/AddItem` Dropdown удаляется; `FertilizerManager` List/Item/AddEdit переиспользуются — не пишется параллельная версия (DRY).
- Один список library-удобрений; чекбокс управляет членством в `calculationForm.fertilizers` (add/remove copy по id), weight строки = из `result.fertilizers` по id (только для checked).
- Модалка edit/add — тот же `AddEdit` + общий слот `fertilizerEdit` (как сейчас в manager и Result «Сохранить комплекс»).
- Точки таргета: `data-ui` hooks на корнях панелей; цвета только токенами; каскад @layer.

## Constraints

- Стек: React 19 + TS strict + Vite; UI = @fertilizer/ui (CSS-модули @layer, токены); store = zustand `@/store`, persistence `appState` (+legacy `reduxState` migration, guard только `normalizeCalculator`).
- Library = `calculator.fertilizers`, выборка = `calculationForm.fertilizers` (одинаковая форма FertilizerInfo[]); веса только в `result.fertilizers` (join по id); `pushFertilizer` синхронизирует выборку по id (:167-179); `removeFertilizer`/`setFertilizers`/`resetFertilizers` выборку НЕ синхронизируют (сейчас — меняется в Stage 1).
- Расчёт только по кнопке «Рассчитать» (`store.calculate()`); при toggle/edit перерасчёт не запускается.
- Пороги layout: сайдбар 1250, колонки калькулятора 800 (`order-2 min-[800px]:order-1`).
- Тесты пинят сейчас: `/#/fertilizers` жив + маркер «Нитрат аммония (NH4NO3)» (smoke routes, e2e a11y/navigation); «Добавить» уникален на /fertilizers; row order [Переместить,Изменить,Удалить] и [Переместить,Удалить]; id-sync pushFertilizer; npk recompute в fertilizerEdit — тесты обновляются в Stages 2–3 под новый layout.
- Макет НЕ верстает модалку редактирования (spec.md:93) — модалка берётся из текущего приложения; макет spec §3.6 расходится с index.html (mixer URL vs Раствор A/B; «Сохранить комплекс» поля) — приоритет index.html + guideline.
- TDD; коммит в конце каждого stage; RU-комментарии.

## Решения (закрыты с заказчиком, 2026-10-29)

1. **Чекбокс** = участие в расчёте: checked → copy удобрения в `calculationForm.fertilizers`; unchecked → copy вычеркивается, library-строка остаётся серой (`.is-inactive`), weight не показывается. Расчёт при toggle не запускается.
2. **`/#/fertilizers` и sidebar-таб «Удобрения»** — удаляются; логика целиком в калькуляторе. smoke/e2e тесты обновляются под новый layout.
3. **Delete строки** — удаляет из library И из выборки (copy по id).
4. **Live-update при редактировании** — чипы/название обновляются сразу через `pushFertilizer` id-sync; результат пересчитывается только по «Рассчитать» (без авто-перерасчёта).
5. **Header plus** — открывает `AddEdit` modal; plus добавляет в library (без авто-select); участие в расчёте — чекбокс.

## Changes

- 2026-10-29T13:12:56+03:00 -- v1, initial spec (draft + research R1–R3)
- 2026-10-29T14:00:42+03:00 -- решения заказчика: чекбокс = членство в selection (не visual-only); /#/fertilizers + таб удаляются; delete чистит selection; live-update = чипы без перерасчёта; plus = AddEdit modal (в library, без авто-select)
- 2026-10-29T17:44:22+03:00 -- Round B (visual feedback): import/export/reset удобрений переезжают в карточку «Импорт/Экспорт» (строка «Удобрения»); чекбокс придвинут к grip (8px); плюс из макета stroke-2; eye/eye-off toggle: открыт = все ряды, закрыт = только отмеченные
