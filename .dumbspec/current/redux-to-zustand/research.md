# Research — redux-to-zustand

Live journal of findings; appended as the investigation proceeds.

## Inventory (initial scan)

- Root store: `apps/web/src/redux/{index.ts, rootReducers.ts, types.d.ts}`.
- Local calculator slice: `apps/web/src/components/Calculator/{actions.ts, reducers.ts, saga.ts, types.d.ts}`.
- There is a `src/redux-helpers/` directory and a `components/ui/ReduxForm/` wrapper — both to inspect (redux-form integration surface).
- Calculator UI subtrees: `Calculator/{Diary, FertilizerManager, FertilizerSelect, ImportExport, Mixer, Options, Result, constants}`.
- Pages: `pages/{App, Calculator, ChemFormula, DensityCalculator, Example, Help, NotFound}` — `pages/App` likely hosts the store wiring (Provider).

## Draft update

User added point **0)**: before any migration — add component tests that verify the logic is preserved, written so they can be easily switched from redux to zustand (i.e. tests must not hard-wire to redux internals). Existing component tests are only render smokes — behavioral coverage is missing.

## Store (apps/web/src/redux/)

- `redux/index.ts`: `createStore(rootReducers, persistedState)`; middleware = saga only; `window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` support.
- **Persistence**: `localStorage["reduxState"]` holds the ENTIRE store state (both `calculator` and `form` redux-form slices), written on every state change (`store.subscribe`), no selectors.
- Load path: `JSON.parse(localStorage["reduxState"])` + backfill: `calculator.fertilizers` / `calculator.recipes` get defaults if missing (`defaultFertilizers`, `DEFAULT_RECIPES`).
- `rootReducers`: `combineReducers({calculator, form})` — the only two slices.

## State shape

`CalculatorState` (components/Calculator/types.d.ts):
- `calculationForm: CalculatorFormValues | null` — a **mirror** of the main redux-form values (maintained by saga, not by the form itself).
- `result: CalculateResult | null`, `toppingUpResult: CalculateToppingUpResult | null`, `process: boolean`, `error: boolean`
- `fertilizers: FertilizerInfo[]` (master list, persisted)
- `recipes: Recipe[]` (persisted)

`CalculatorFormValues`: `accuracy`, `solution_volume`, `solution_concentration` (Concentration {k,v_1,v_2}), `recipe: NeedElements`, `fertilizers: FertilizerInfo[]` (selection), `dilution_enabled/dilution_volume/dilution_concentration`, `topping_up_enabled/topping_up`, `ignore.{Ca,Mg,S,Cl}`, `mixerOptions`.

## redux-form surface (3 forms)

| Form | Owner | Fields |
| --- | --- | --- |
| `calculatorOptions` (REDUX_FORM_NAME) | `Calculator/index.tsx` (reduxForm + connect) | `accuracy` (Radio), `solution_volume`, `solution_concentration.{k,v_1,v_2}`, `recipe` (elements), `fertilizers` (FieldArray + `validate=required("Выберите удобрения")`), `dilution_enabled`, `dilution_volume`, `dilution_concentration.*`, `topping_up_enabled`, `topping_up.{newSolution,currentSolution}.*`, `ignore.{Ca,Mg,S,Cl}` |
| `fertilizer-edit` (FERTILIZER_EDIT_FORM_NAME) | `FertilizerManager/AddEdit.tsx` | `id`, `npk.{el}`, `composition_enable`, `composition` (FieldArray: formula/percent), `solution_density_enable`, `solution_density`, `solution_concentration`, `pump_number` |
| `mixerOptions` | `Mixer/MixerForm.tsx` | `url` |

- `connect` in `Calculator/index.tsx` injects `initialValues` from `state.calculator.calculationForm` (so the form re-initializes from the persisted store slice; `enableReinitialize: true`).
- Field wrappers: `ui/ReduxForm/{Input,Checkbox,Radio}.tsx` = rebass controls wrapped in redux-form `Field` (`name` + `normalize` + `component`). `FieldArray` used in `FertilizerSelect/Container.tsx` (`fertilizers`), `FertilizerManager/AddEdit.tsx` (`composition`); `fields.push/remove` + `meta.error` (`SelectedList.tsx` shows "Выберите удобрения").
- `hooks/ReduxForm.ts`: `useFormValues(formName)` = `useSelector(getFormValues(name))` + `change` dispatcher.
- Normalizers: `decimal` (parseFloat), `number` (parseInt) — applied via redux-form `normalize`.
- `stopSubmit(REDUX_FORM_NAME, {fertilizers:{_error}})` in the calculate saga → sets the field error shown by `SelectedList`.

## Sagas (all synchronous logic — no async calls)

- `src/saga.ts`: forks `calculatorRootSaga` + `fertilizerManagerRootSaga`.
- `components/Calculator/saga.ts`:
  - `storeCalculateFormSaga` — on every CHANGE/BLUR/ARRAY_PUSH/ARRAY_REMOVE of the main form: mirror form values → `state.calculator.calculationForm` (action STORE_CALCULATE_FORM).
  - `calculateStartSaga` — CALCULATE_START: guard `fertilizers.length` (else stopSubmit error "Need fertilizers!" + CALCULATE_ERROR), synchronous `calculate_v4(...)`, topping-up branch (`calculateToppingUp`, may `change` `solution_volume`/`solution_concentration` in the form and re-dispatch CALCULATE_START), CALCULATE_SUCCESS.
  - `fertilizerPushSaga` — FERTILIZERS_PUSH: sync the pushed/updated fertilizer id into `calculationForm.fertilizers` (update by `id`, else push).
  - `loadStateSagaWatcher` — LOAD_STATE_START → LOAD_STATE_SUCCESS (import state commit).
- `FertilizerManager/saga.ts`: on fertilizer-edit form CHANGE/BLUR/ARRAY_*: if `composition_enable`, recompute `npk = normalizeFertilizer({...}.composition)` and `change("npk", npk)`.

**Conclusion**: nothing is truly async; sagas are event watchers + derived-state updates → map 1:1 to zustand actions/subscriptions.

## Consumers (files touching redux/react-redux/redux-form)

- Entry/wiring: `index.tsx` (passes store), `Root.tsx` (Provider), `redux/{index,rootReducers,types.d.ts}`, `saga.ts`, `redux-helpers/{helpers,sagaSelectors,types}`.
- `hooks/ReduxForm.ts`; `test-utils/{render,form}.tsx` (render helper uses redux Provider; `createFormWrapper` builds a `reduxForm` HOC for smoke tests).
- `components/Calculator/`: `index.tsx`, `actions.ts`, `reducers.ts`, `saga.ts`, `types.d.ts`.
- `Options/`: Solution, Dilution, ToppingUp, Accuracy (Radio), IgnoreElement (Checkbox), Recipe, RecipeTuneForm, RecipeElementForm.
- `FertilizerSelect/`: Container, SelectedList, AddItem (+ element sub-forms).
- `FertilizerManager/`: index, List, Item, AddEdit, AddEditCompositionList, AddEditNPKString, AddItemElementForm, constants, saga.
- `ImportExport/`: ExportState (reads `state.calculator`), ImportState (`loadStateStart`), ExportFertilizers, ImportFertilizers, ExportRecipes, ImportRecipes (dispatch set/push actions).
- `Result/`: Result.tsx (reads form `solution_volume`, fertilizer-edit form values, `fertilizerPush` for "Сохранить комплекс"), hooks.ts, ResultDilution, ResultFertilizerList.
- `Mixer/`: Mixer.tsx (reads `state.calculator` + `mixerOptions` form), MixerForm.tsx.
- `ui/ReduxForm/`: index, Input, Checkbox, Radio, normalizers, validators, types.

## Dependencies to remove (apps/web/package.json)

runtime: `redux`, `redux-form`, `redux-saga`, `react-redux`;
dev: `@types/redux-form`, `@types/redux-saga`, `@types/react-redux`.

## Tests

- vitest (jsdom): `__tests__/App.test.tsx` renders real `Root` with the redux store; component smokes (`Calculator.test.tsx`, `FertilizerSelect.test.tsx`, `Options.test.tsx`, `Result.test.tsx`, `FertilizerManager.test.tsx`, `ui/ReduxForm/*.test.tsx`) — render smokes only, driven through `renderApp` (redux Provider) and `createFormWrapper(formName)` (reduxForm HOC). No behavioral coverage of calculate/persist/import flows.
- playwright e2e (manual, not in full-check): `tests/e2e/calculator.test.ts` ("Need fertilizers!" absent after adding fertilizers), `persistence.test.ts` (result survives `page.reload()` — the localStorage `reduxState` gate), `navigation.test.ts`.

## Notes

- `utils/index.ts` (`update`, `updateOrPush`) is redux-free (re-exported helpers + plain fns) — reusable as-is in the zustand store.
- `FertilizerManager` is a nested route under `pages/Calculator` (`/fertilizers`), same global store — both pages share one state tree.
- Topping-up recalc in the saga is recursive (re-dispatch CALCULATE_START after form changes) — must be reproduced exactly (volume/concentration drift loop).
- e2e `shared.ts` comments reference the saga behavior directly ("Need fertilizers!" guard) — e2e expectations are part of the acceptance surface.
