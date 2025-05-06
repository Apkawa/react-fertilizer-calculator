import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects'
import {actionTypes, change, FormAction, getFormValues, stopSubmit} from "redux-form";
import {CALCULATE_START, FERTILIZERS_PUSH, LOAD_STATE_START, REDUX_FORM_NAME} from "./constants";
import {
  calculateError,
  calculateStart,
  calculateSuccess, fertilizerPush,
  loadStateStart,
  loadStateSuccess,
  storeCalculateForm,
  toppingUpSuccess
} from "./actions";
import {calculate_v4} from "@/calculator";
import {CalculatorFormValues} from "./types";
import {calculateToppingUp, getEmptyElements, getNPKDetailInfo} from "@/calculator/helpers";
import {update} from "@/utils";

export function* loadCalculatorStateSaga(action: ReturnType<typeof loadStateStart>) {
  // Здесь будет валидация и конвертация между несовместимыми версиями
  const state = action.payload

  yield put(loadStateSuccess({
    ...state.calculator
  }))
}


export function* storeCalculateFormSaga() {
  const formValues: CalculatorFormValues = yield select(getFormValues(REDUX_FORM_NAME))

  yield put(storeCalculateForm(formValues))
  // yield put(calculateStart())
}

export function* calculateStartSaga() {
  const formValues: CalculatorFormValues = yield select(
    state => state.calculator.calculationForm
  )

  if (!formValues.fertilizers.length) {
    yield put(stopSubmit(REDUX_FORM_NAME, {
      fertilizers: {_error: "Need fertilizers!"}
    }))
    yield put(calculateError())
    return
  }
  const {
    ignore,
    accuracy,
    solution_volume,
    solution_concentration,
    topping_up_enabled,
    topping_up,
  } = formValues


  // Тут замораживается UI из за вычислений. нужно либо оптимизировать либо использовать WebWorker
  const result = calculate_v4(
    formValues.recipe,
    formValues.fertilizers,
    {
      ignore: {...ignore},
      accuracy,
      solution_volume,
      solution_concentration,
    }
  )
  if (topping_up_enabled && topping_up) {
    const toppingUpResult = yield select(
      state => state.calculator.toppingUpResult
    )
    let tRes = calculateToppingUp({
      currentSolution: topping_up.currentSolution,
      newSolution: {
        ...topping_up.newSolution,
        EC: getNPKDetailInfo({...getEmptyElements(), ...formValues.recipe}).EC
      }
    });
    yield put(toppingUpSuccess(tRes))
    let doRecalculate = false
    if (tRes.volume !== solution_volume) {
      yield put(change(REDUX_FORM_NAME, 'solution_volume', tRes.volume))
      doRecalculate = true
    }
    if (tRes.concentration !== solution_concentration.k) {
      yield put(change(REDUX_FORM_NAME, 'solution_concentration', tRes.concentration))
      doRecalculate = true
    }
    if (tRes.volume !== toppingUpResult.volume || tRes.concentration !== toppingUpResult.concentration) {
      doRecalculate = true
    }
    if (doRecalculate) {
      yield put(calculateStart())
    }

  }
  yield put(calculateSuccess(result))
}

function* fertilizerPushSaga(action: ReturnType<typeof fertilizerPush>) {
  const formValues: CalculatorFormValues = yield select(
    state => state.calculator.calculationForm
  )
  const [newFertilizers, updated] = update(formValues?.fertilizers || [], action.payload, "id")
  if (updated) {
    yield put(storeCalculateForm({...formValues, fertilizers: newFertilizers}))
  }
}

export function* fertilizersPushWatcher() {
  yield takeLatest(FERTILIZERS_PUSH, fertilizerPushSaga)
}

export function* loadStateSagaWatcher() {
  yield takeLatest(LOAD_STATE_START, loadCalculatorStateSaga);
}

export function* calculatorSagaWatcher() {
  yield takeLatest(CALCULATE_START, calculateStartSaga);
}

export function* calculatorFormChangeWatcher() {

  yield takeLatest([
      actionTypes.CHANGE,
      actionTypes.BLUR,
      actionTypes.ARRAY_PUSH,
      actionTypes.ARRAY_REMOVE
    ],
    function* (action: FormAction) {
      if (action.meta.form === REDUX_FORM_NAME) {
        yield call(storeCalculateFormSaga)
      }
    });
}

export default function* calculatorRootSaga() {
  yield all([
    fork(fertilizersPushWatcher),
    fork(calculatorSagaWatcher),
    fork(calculatorFormChangeWatcher),
    fork(loadStateSagaWatcher)
  ]);
}
