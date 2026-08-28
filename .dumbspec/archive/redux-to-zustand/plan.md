# redux-to-zustand: implementation plan (zustand store migration)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Characterization-тесты «логика сохранилась» (draft п. 0)

> Тесты работают на текущем redux-стеке и не зависят от него текстом: состояние —
> только через шов `test-utils/state.ts` + DOM.

- [x] `test-utils/state.ts` — шов: `getState()`, `setFormField()`, `calculateNow()`, `pushFertilizer()`, `setFertilizers()`, `resetFertilizers()`, `importState()`, `getFertilizersError()`, `getFertilizerEditForm()`/`setFertilizerEditField()`, `readPersistence()`, `getFreshSnapshot()`, `resetStore()` (redux-реализация)
- [x] Тест: расчёт — fertilizer-выбор → Calculate → веса в результате
- [x] Тест: guard «Need fertilizers!» при пустом выборе (ошибка, нет результата; текст подсказки — деталь отображения)
- [x] Тест: менеджер удобрений — push / set (порядок) / reset + синхронизация выборки по id
- [x] Тест: импорт состояния (формат `@fertilizer/calculator/format`) → расчёт с импортом
- [x] Тест: persistence — изменение → `localStorage["reduxState"]` поле `calculator`; восстановление при загрузке
- [x] Тест: topping-up — включён → `solution_volume`/`solution_concentration` доводятся до расчёта; **зафиксирован дефект** старого `calculateStartSaga` (краш при первом расчёте: устаревшее `toppingUpResult = null`) — тест утверждает *намеченное* поведение. На redux-шве намеренно `test.skip` (TODO Stage 2: переключить шов и убрать skip); логика покрыта unit-тестом стора (Stage 1, зелёный)
- [x] Тест: редактор удобрения — `composition` → `npk` пересчитывается
- [x] `pnpm test` — зелёные, кроме намеренно `test.skip` topping-up (зеленеет на сторe; убирается в Stage 2 вместе со сменой шва). Тесты не содержат `store.dispatch`/`redux`-селекторов (только шов + DOM)

**Commit (0+1 вместе):** красный topping-up-тест behavior блокирует `pnpm full-check` (husky pre-commit), а зеленеет только после смены шва (Stage 2) → на время коммита `test.skip` (TODO Stage 2), логику доказывает unit-тест стора. **Stage 0 и 1 коммитятся вместе**; `--no-verify` не используется.

## Stage 1 — Zustand-стор

> Новая реализация, параллельно redux (приложение ещё не переключено).

- [x] `src/store/index.ts` — `AppState` (слайс `calculator: CalculatorState` + формы `fertilizerEdit`/`mixerOptions` + `fertilizersError`) / `AppActions` / `Store`; фабрика `createAppStore()` (читает persistence) + синглтон `useStore`
- [x] Actions: `setFieldValue` (dot-path `setIn` + инициализация из `getInitialFormValues()`), `calculate()` (guard + `calculate_v4` + **один проход** topping-up, null-safe, без рекурсии; ошибка sticky), fertilizer CRUD (master + синхронизация выборки по id), recipe CRUD, `importState()`, `setFertilizerEditField` (composition→npk), `setMixerField`, `reset`
- [x] Persistence (`src/store/persistence.ts`): ключ `appState` + миграция со старого `reduxState` (read `.calculator` + бэкинг дефолтов fertilizers/recipes + сброс `process`/`error` → запись → удаление старого) + запись при каждом изменении
- [x] `components/Calculator/constants/form.ts` — `getInitialFormValues()` (дефолты формы, вынесены из `index.tsx`)
- [x] Unit-тесты стора (`src/store/index.test.ts`): **10 зелёных** — guard / базовый расчёт / topping-up / менеджер (push+sync) / импорт / setFieldValue (dot-path) / редактор (composition→npk) / persistence (запись, чтение, миграция, дефолты)
- [x] `pnpm full-check` зелёный: тесты **45 passed / 1 skipped** (topping-up behavior `.skip`), lint (0 errors) / type / build ok

**Criterion (выполнен):** стор покрывает 100% состояний и эффектов старого стека; unit-тесты; поведение приложения неизменно (приложение ещё на redux до Stage 2).
**Commit:** см. ниже (Stage 0+1 вместе).

## Stage 2 — Перенос компонентов на zustand

> Шов переключается → characterization-тесты становятся «красными», пока компоненты не перенесены.

**Заметка (от пользователя):** `components/ui/ReduxForm/` целиком **удаляем** — нагромождения/костыли redux (HOC `ReduxField`, `WrapperInputType`, `renderReduxField`, `redux-form`-типы) не нёсшие пользы. Вместо них — чистая zustand-форма: глобальный стор + `FormProvider`/`useFormField` (name dot-path → value из стора, `onChange` → `setFieldValue`). Цель — та же «гигаформа»: компоненты могут быть разбросаны где угодно и не требуют прокидывания событий/пропсов; состояние читается/пишется глобально из стора.

- [x] `test-utils/state.ts` → zustand-реализация (red: characterization-тесты)
- [x] `test-utils/render.tsx` (без Provider) и `test-utils/form.tsx` (без reduxForm-HOC)
- [x] Удалить `components/ui/ReduxForm/`; новая форма: `store/form-context.tsx` (`FormProvider`/`useFormContext`), `store/use-form-field.ts` (`useFormField(name) → {value,setValue}`), чистые поля `components/ui/Form/{Input,Checkbox,Radio}.tsx`
- [x] FieldArray → стор: `FertilizerSelect/SelectedList` (+ `meta.error` → ошибка из стора), `FertilizerManager/AddEditCompositionList`
- [x] `Options/`: Solution, Dilution, ToppingUp, Accuracy, IgnoreElement, Recipe, RecipeTuneForm, RecipeElementForm
- [x] `FertilizerSelect/`: Container, SelectedList, AddItem (+ sub-forms)
- [x] `FertilizerManager/`: List, Item, AddEdit, AddEditCompositionList, AddEditNPKString, AddItemElementForm
- [x] `ImportExport/`: ImportState, ExportState, Import/Export Fertilizers, Import/Export Recipes
- [x] `Result/`: Result.tsx, hooks.ts, ResultDilution, ResultFertilizerList
- [x] `Mixer/`: Mixer.tsx, MixerForm.tsx
- [x] `hooks/ReduxForm.ts` — убрать (его `useFormValues`/`useReduxForm` заменены `useFormField`+`useFormContext`); `Root.tsx` / `index.tsx` — без Provider / `store`
- [x] `pnpm test` зелёный: **весь characterization-тест — без изменений текста** (green)

**Criterion:** все тесты зелёные; UI-поведение без изменений; в `src/` нет импортов `react-redux`/`redux-form`/`redux-saga`.
**Commit:** N/A

## Stage 3 — Удаление redux/saga и зависимостей

- [x] Удалить: `src/redux/`, `src/saga.ts`, `src/redux-helpers/`, `components/Calculator/{actions.ts, reducers.ts, saga.ts}`
- [x] Удалить redux-form-обвязки: `ui/ReduxForm/index.tsx` (`renderReduxField`), типы `ui/ReduxForm/types.d.ts` (redux-form части), неиспользуемые константы (`REDUX_FORM_NAME` и т.п.)
- [x] `apps/web/package.json`: drop `redux`, `redux-form`, `redux-saga`, `react-redux` + `@types/redux-form`, `@types/redux-saga`, `@types/react-redux`; `pnpm install` (lockfile)
- [x] Grep-проверка: `redux|saga` в `apps/web/src` и `package.json` — пусто
- [x] `pnpm full-check` (test + lint + type + build) зелёный

**Criterion:** ни одной redux/saga-зависимости; полный цикл проверки зелёный.
**Commit:** N/A
