import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from "../saga";

import {defaultFertilizers} from "../components/Calculator/reducers";

import {rootReducers} from "./rootReducers";


const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware()

function loadPersistedState() {
  let state: any = {}
  if (localStorage.getItem('reduxState')) {
    state = JSON.parse(localStorage.getItem('reduxState') as string)
    if (state?.calculator && !state.calculator.fertilizers) {
      state.calculator.fertilizers = defaultFertilizers
    }
  }
  return state
}

const persistedState = loadPersistedState()

const middlewares = [sagaMiddleware]

const enhancers = composeEnhancers(
    applyMiddleware(...middlewares),
  )

// TODO typing
export const store = createStore(
  rootReducers,
  persistedState,
  enhancers
)

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

sagaMiddleware.run(rootSaga)
