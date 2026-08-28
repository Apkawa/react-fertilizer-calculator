# Spec — redux-to-zustand

> Refined: draft.md + research.md + user decisions (persistence, zod, test seam).

## Цель

Заменить в `apps/web` стек **Redux + redux-saga + redux-form** на **Zustand** (+ опционально **zod**). Поведение PWA не меняется: расчёт, persistence (`localStorage["reduxState"]`), импорт/экспорт, менеджер удобрений, формы редактирования.

## Стадии (порядок от draft)

### 0. Тесты «логика сохранилась» — до миграции (новый п. 0 draft)

Поведенческие vitest-тесты (jsdom), которые **проверяют логику, а не рендер**, и не зависят от конкретного стейт-стека:

- Тесты читают/сидят состояние через единый шов в `test-utils` (например `test-utils/state.ts`): `getState()`, `pushFertilizer()`, `setFertilizers()`, `reset()`. Сегодня шов реализован через redux (`store.dispatch/getState`), после миграции — через zustand-стор. **Текст тестов не меняется** при смене стека — меняется только реализация шва.
- Покрываются сценарии (через DOM, как в e2e, + через шов для сидинга):
  - расчёт: fertilizer-выбор → Calculate → веса в результате;
  - guard «Need fertilizers!» при пустом выборе;
  - менеджер удобрений: push / set (порядок) / reset отражается в списке;
  - импорт состояния (формат `@fertilizer/calculator/format`) → расчёт с импортированным;
  - persistence: изменение состояния → записано в `localStorage["reduxState"]` (формат: поле `calculator`), при загрузке стор восстанавливается;
  - topping-up: включён → результат пересчитывает `solution_volume`;
  - редактор удобрения: состав → `npk` пересчитывается.
- Критерий стадии: тесты зелёные на текущем redux-стеке.

### 1. Zustand-стор

Новый модуль (замена `src/redux/`, `src/saga.ts`, слайса `components/Calculator/{actions,reducers,saga}`):

- Стор содержит всё, что сегодня держат redux-slice `calculator` + 3 формы redux-form:
  - `calculator`: `calculationForm` (значения основной формы), `result`, `toppingUpResult`, `process`, `error`, `fertilizers` (master), `recipes`;
  - локальные формы: `fertilizerEdit` (AddEdit), `mixerOptions`.
- `calculationForm` становится **первичным источником** значений основной формы (сегодня это saga-зеркало — зеркало убирается: поле читает/пишет прямо в стор).
- Actions вместо sagas (всё сегодня синхронно, асинхронных `call` нет):
  - `setFieldValue(path, value)` — запись поля с normalize;
  - `calculate()` — guard + `calculate_v4` + topping-up рекурсия (повторный вызов при дрейфе volume/concentration) + ошибка «Need fertilizers!»;
  - `pushFertilizer / removeFertilizer / setFertilizers / resetFertilizers` (синхронно трогает и master, и `calculationForm.fertilizers` — как сегодняшняя `fertilizerPushSaga`);
  - `pushRecipe / removeRecipe / resetRecipes`;
  - `importState(payload)` (замена LOAD_STATE_*);
  - setters для форм fertilizerEdit (включая пересчёт `npk` из `composition`) и mixerOptions.
- Persistence (**решение: новый ключ + миграция при первом запуске**):
  - Новый ключ `localStorage["appState"]` (имя можно уточнить) хранит весь zustand-state; пишется при каждом изменении.
  - **Миграция**: при первом запуске (новое ключа нет, старое есть) читаем старый `reduxState`, берём поле `calculator` (со стандартным бэкингом дефолтных fertilizers/recipes), записываем в новый ключ и **удаляем** старый (`reduxState`) — один раз, идемпотентно.
  - Поля `process`/`error` при загрузке сбрасываются (это рантайм, не контракт).
- `src/saga.ts`, `src/redux/*`, `src/redux-helpers/*`, локальный слайс с actions/reducers/saga удаляются (этап 3, после переноса компонентов).
- Критерий: стор покрывает 100% состояний и эффектов сегодняшних sagas/reducers; unit-тесты стора (vitest, node-окружение) + полный `pnpm test`.

### 2. Перенос компонентов

- **`components/ui/ReduxForm/` удаляется целиком** (HOC `ReduxField`, `WrapperInputType`, `renderReduxField`, redux-form-типы — нагромождения/костыли). Вместо них чистая zustand-форма: `store/form-context.tsx` (`FormProvider`/`useFormContext` — аналог `ReduxFormContext`, знает «какая форма»), `store/use-form-field.ts` (`useFormField(name) → {value,setValue}` — name dot-path → value из стора, `onChange` → `setFieldValue`, `normalize` на записи). Чистые поля `components/ui/Form/{Input,Checkbox,Radio}.tsx`.
- Сохраняем идею «гигаформы»: компоненты могут быть разбросаны где угодно и не требуют прокидывания событий/пропсов — состояние читается/пишется глобально из стора.
- `FieldArray`-компоненты (SelectedList, AddEditCompositionList) получают значения/`push`/`remove` из стора; `meta.error` (`SelectedList`) → ошибка из стора (guard расчёта).
- `connect`/`useSelector`/`useDispatch` → `useStore`-селекторы; `hooks/ReduxForm.ts` убирается (`useFormValues`/`useReduxForm` заменены `useFormField`+`useFormContext`).
- `test-utils/render.tsx` (убрать Provider), `test-utils/form.tsx` (убрать reduxForm-HOC; wrapper = обёртка в стор), шов `test-utils/state.ts` → zustand.
- Тесты стадии 0 проходят **без изменений текста** (меняется только шов).
- Критерий: `pnpm test` (все vitest, включая тесты стадии 0) зелёный; поведение DOM без изменений.

### 3. Удаление redux/saga

- Из `apps/web/package.json`: `redux`, `redux-form`, `redux-saga`, `react-redux` + `@types/redux-form`, `@types/redux-saga`, `@types/react-redux`.
- Удалить: `src/redux/`, `src/saga.ts`, `src/redux-helpers/`, `components/Calculator/{actions.ts, reducers.ts, saga.ts}` (логика уже в сторе), redux-form обёртки в `ui/ReduxForm` (`renderReduxField`, redux-form типы).
- `Root.tsx` — без Provider; `index.tsx` — без `store`.
- Критерий: `pnpm full-check` (test + lint + type + build) зелёный; grep по `apps/web` не находит `redux|saga` в src и package.json.

## Решения (research + пользователь)

- **zod — не нужен** (согласовано): сегодняшняя валидация = 1 `required` на FieldArray + ручной guard в saga; guard'ы руками в сторе.
- **Persistence** (согласовано): **новый ключ + миграция при первом запуске** (см. выше). E2E `persistence.test.ts` (result survives reload) остаётся главным гейтом — после миграции поведение «result survives reload» не меняется.
- **Шов тестов** (согласовано): единый модуль `test-utils/state.ts` — точка доступа к стеку в characterization-тестах; при миграции меняется только его реализация.
- **Топпинг-ап**: рекурсия пересчёта из saga воспроизводится в action стора (пока drift — `calculate()` ре-вызывается после записи новых volume/concentration).
- **Redux DevTools**: `window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` вместе со стором redux исчезает.

## Не цели

- Новая вёрстка/UX, новые страницы, изменения `packages/calculator`, `packages/icons`.
- Вебворкер для `calculate_v4` (сегодня расчёт блокирует UI — так и остаётся; saga-комментарий подтверждает, что это осознанно).
- e2e/smoke playwright: не трогать (ручной гейт); используется как приёмка.

## Открытые вопросы

Нет — все решены (см. «Решения»).
