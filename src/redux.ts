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
export const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
  )
)

sagaMiddleware.run(rootSaga)
