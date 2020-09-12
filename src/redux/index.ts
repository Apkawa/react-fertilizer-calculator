import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from "../saga";

import {rootReducers} from "./rootReducers";
import {defaultFertilizers} from "@/components/Calculator/constants/fertilizers";
import {DEFAULT_RECIPES} from "@/components/Calculator/constants/recipes";


const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware()

function loadPersistedState() {
  let state: any = {}
  if (localStorage.getItem('reduxState')) {
    state = JSON.parse(localStorage.getItem('reduxState') as string)
    if (state?.calculator && !state.calculator.fertilizers) {
      state.calculator.fertilizers = defaultFertilizers
    }
    if (state?.calculator && !state.calculator.recipes) {
      state.calculator.recipes = DEFAULT_RECIPES
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
