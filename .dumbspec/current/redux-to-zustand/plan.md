# redux-to-zustand: implementation plan (zustand store migration)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Characterization-тесты «логика сохранилась» (draft п. 0)

> Тесты работают на текущем redux-стеке и не зависят от него текстом: состояние —
> только через шов `test-utils/state.ts` + DOM.

- [ ] `test-utils/state.ts` — шов: `getState()`, `pushFertilizer()`, `setFertilizers()`, `resetStore()` (redux-реализация через `store.dispatch/getState`)
- [ ] Тест: расчёт — fertilizer-выбор → Calculate → веса в результате
- [ ] Тест: guard «Need fertilizers!» при пустом выборе (текст появляется/исчезает)
- [ ] Тест: менеджер удобрений — push / set (порядок) / reset
- [ ] Тест: импорт состояния (формат `@fertilizer/calculator/format`) → расчёт с импортом
- [ ] Тест: persistence — изменение → `localStorage["reduxState"]` поле `calculator`; восстановление при загрузке
- [ ] Тест: topping-up — включён + drift → `solution_volume` пересчитывается
- [ ] Тест: редактор удобрения — `composition` → `npk` пересчитывается
- [ ] `pnpm test` зелёный; тесты не содержат `store.dispatch`/`redux`-селекторов (только шов + DOM)

**Criterion:** characterization-тесты зелёные на текущем стеке; шов — единственная точка доступа к стеку.
**Commit:** N/A

## Stage 1 — Zustand-стор

> Новая реализация, параллельно redux (приложение ещё не переключено).

- [ ] `src/store/` — типы состояния (CalculatorState + формы `fertilizerEdit`, `mixerOptions`)
- [ ] Actions: `setFieldValue(path, value)` (normalize), `calculate()` (guard + `calculate_v4` + topping-up рекурсия + ошибка), fertilizer CRUD (master + `calculationForm.fertilizers`), recipe CRUD, `importState()`, setters `fertilizerEdit` (composition→npk) / `mixerOptions`
- [ ] Persistence: ключ `appState` + миграция со старого `reduxState` (read `.calculator` + бэкинг дефолтов → запись → удаление старого) + сброс `process/error` при загрузке
- [ ] Unit-тесты стора (vitest): паритет с reducer/saga-логикой, `calculate()`, миграция persistence
- [ ] `pnpm test` зелёный (characterization — ещё на redux-шве)

**Criterion:** стор покрывает 100% состояний и эффектов старого стека; unit-тесты; поведение приложения неизменно.
**Commit:** N/A

## Stage 2 — Перенос компонентов на zustand

> Шов переключается → characterization-тесты становятся «красными», пока компоненты не перенесены.

- [ ] `test-utils/state.ts` → zustand-реализация (red: characterization-тесты)
- [ ] `test-utils/render.tsx` (без Provider) и `test-utils/form.tsx` (без reduxForm-HOC)
- [ ] `ui/ReduxForm/{Input,Checkbox,Radio}` — контролируемые компоненты (name dot-path → value из стора, onChange → `setFieldValue`)
- [ ] FieldArray → стор: `FertilizerSelect/SelectedList` (+ `meta.error` → ошибка из стора), `FertilizerManager/AddEditCompositionList`
- [ ] `Options/`: Solution, Dilution, ToppingUp, Accuracy, IgnoreElement, Recipe, RecipeTuneForm, RecipeElementForm
- [ ] `FertilizerSelect/`: Container, SelectedList, AddItem (+ sub-forms)
- [ ] `FertilizerManager/`: List, Item, AddEdit, AddEditCompositionList, AddEditNPKString, AddItemElementForm
- [ ] `ImportExport/`: ImportState, ExportState, Import/Export Fertilizers, Import/Export Recipes
- [ ] `Result/`: Result.tsx, hooks.ts, ResultDilution, ResultFertilizerList
- [ ] `Mixer/`: Mixer.tsx, MixerForm.tsx
- [ ] `hooks/ReduxForm.ts` → стор
- [ ] `Root.tsx` / `index.tsx` — без Provider / `store`
- [ ] `pnpm test` зелёный: **весь characterization-тест — без изменений текста** (green)

**Criterion:** все тесты зелёные; UI-поведение без изменений; в `src/` нет импортов `react-redux`/`redux-form`/`redux-saga`.
**Commit:** N/A

## Stage 3 — Удаление redux/saga и зависимостей

- [ ] Удалить: `src/redux/`, `src/saga.ts`, `src/redux-helpers/`, `components/Calculator/{actions.ts, reducers.ts, saga.ts}`
- [ ] Удалить redux-form-обвязки: `ui/ReduxForm/index.tsx` (`renderReduxField`), типы `ui/ReduxForm/types.d.ts` (redux-form части), неиспользуемые константы (`REDUX_FORM_NAME` и т.п.)
- [ ] `apps/web/package.json`: drop `redux`, `redux-form`, `redux-saga`, `react-redux` + `@types/redux-form`, `@types/redux-saga`, `@types/react-redux`; `pnpm install` (lockfile)
- [ ] Grep-проверка: `redux|saga` в `apps/web/src` и `package.json` — пусто
- [ ] `pnpm full-check` (test + lint + type + build) зелёный

**Criterion:** ни одной redux/saga-зависимости; полный цикл проверки зелёный.
**Commit:** N/A
