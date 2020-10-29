import {all, fork} from 'redux-saga/effects'
import calculatorRootSaga from "./components/Calculator/saga";
import fertilizerManagerRootSaga from './components/Calculator/FertilizerManager/saga';

type AnySagaGenerator = Generator<any, any, any>;

const sagas: (() => AnySagaGenerator)[] = [
  calculatorRootSaga,
  fertilizerManagerRootSaga,
]

export default function* rootSaga() {
  yield all(sagas.map(s => fork(s)))
}
