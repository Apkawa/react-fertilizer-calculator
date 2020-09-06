import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'

import * as serviceWorker from './serviceWorker';
import rootSaga from "./saga";

import Root from './Root'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  () => {
  },
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)


ReactDOM.render(
  <React.StrictMode>
    <Root store={store}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
