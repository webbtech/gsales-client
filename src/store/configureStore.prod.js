/* eslint-disable no-underscore-dangle, global-require */
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'

import rootReducer from '../reducers'
import rootSaga from '../saga/root'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState = {}) {
  const enhancer = compose(
    applyMiddleware(
      sagaMiddleware,
      createLogger(),
    )
  )

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  )
  sagaMiddleware.run(rootSaga)

  return store
}
