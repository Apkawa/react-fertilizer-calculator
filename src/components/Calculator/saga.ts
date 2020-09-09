import {all, fork, put, select, takeLatest} from 'redux-saga/effects'
import {actionTypes, getFormValues, stopSubmit} from "redux-form";
import {CALCULATE_START, REDUX_FORM_NAME} from "./constants";
import {calculateError, calculateStart, calculateSuccess} from "./actions";
import {calculate} from "../../calculator";
import {CalculatorFormValues} from "./types";
import {normalizeFertilizer} from "../../calculator/fertilizer";

export function* calculateStartSaga() {
  const formValues: CalculatorFormValues = yield select(getFormValues(REDUX_FORM_NAME))
  if (!formValues.fertilizers.length) {
    yield put(stopSubmit(REDUX_FORM_NAME, {
      fertilizers: {_error: "Need fertilizers!"}
    }))
    yield put(calculateError())
    return
  }
  const {ignore_Ca, ignore_Mg, accuracy} = formValues

  const result = calculate(
    formValues.recipe,
    formValues.fertilizers.map(f => normalizeFertilizer(f)),
    {
      ignore_Ca,
      ignore_Mg,
      accuracy,
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
    function* () {
      yield put(calculateStart())
    });
}

export default function* calculatorRootSaga() {
  yield all([fork(calculatorSagaWatcher), fork(calculatorFormChangeWatcher)]);
}
