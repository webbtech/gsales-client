/* eslint-disable no-underscore-dangle, global-require */
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'
import rootSaga from '../saga/root'

const sagaMiddleware = createSagaMiddleware()


export default function configureStore(initialState = {}) {
  const enhancer = composeWithDevTools(
    applyMiddleware(
      thunk,
      sagaMiddleware,
      createLogger(),
    ),
  )

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  )
  sagaMiddleware.run(rootSaga)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
