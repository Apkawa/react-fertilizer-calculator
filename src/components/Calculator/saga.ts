import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects'
import {actionTypes, FormAction, getFormValues, stopSubmit} from "redux-form";
import {CALCULATE_START, REDUX_FORM_NAME} from "./constants";
import {calculateError, calculateStart, calculateSuccess, storeCalculateForm} from "./actions";
import {calculate_v3} from "@/calculator";
import {CalculatorFormValues} from "./types";
import {normalizeFertilizer} from "@/calculator/fertilizer";

export function* storeCalculateFormSaga() {
  const formValues: CalculatorFormValues = yield select(getFormValues(REDUX_FORM_NAME))
  yield put(storeCalculateForm(formValues))
  yield put(calculateStart())
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
  } = formValues

  // Тут замораживается UI из за вычислений. нужно либо оптимизировать либо использовать WebWorker
  const result = calculate_v3(
    formValues.recipe,
    formValues.fertilizers.map(f => normalizeFertilizer(f)),
    {
      ignore,
      accuracy,
      solution_volume,
      solution_concentration,
    }
  )
  yield put(calculateSuccess(result))
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
    fork(calculatorSagaWatcher),
    fork(calculatorFormChangeWatcher),
  ]);
}
