import {all, fork, put, select, takeLatest} from 'redux-saga/effects'
import {getFormValues, stopSubmit} from "redux-form";
import {CALCULATE_START, REDUX_FORM_NAME} from "./constants";
import {calculateError, calculateSuccess} from "./actions";
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

export default function* calculatorRootSaga() {
  yield all([fork(calculatorSagaWatcher)]);
}
