import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./saga";
import {reducer as formReducer} from 'redux-form'
import {reducer as calculateReducer} from "./components/Calculator/reducers";


const reducers = combineReducers({
  calculator: calculateReducer,
  form: formReducer
})

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware()

const persistedState = localStorage.getItem('reduxState')
  ? JSON.parse(localStorage.getItem('reduxState') as string)
  : {}

export const store = createStore(
  reducers,
  persistedState,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
  )
)

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

sagaMiddleware.run(rootSaga)
