import {all} from 'redux-saga/effects'

const sagas: Generator<CallableFunction>[] = [
  //
]

export default function* rootSaga() {
  yield all(sagas)
}
