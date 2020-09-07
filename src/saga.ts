import {all} from 'redux-saga/effects'
import calculatorRootSaga from "./components/Calculator/saga";

type AnySagaGenerator = Generator<any, any, any>;

const sagas: (() => AnySagaGenerator)[] = [
  calculatorRootSaga
]

export default function* rootSaga() {
  yield all(sagas.map(s => s()))
}
