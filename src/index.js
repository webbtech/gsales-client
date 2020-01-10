import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/browser'

import App from './modules/app/Index'
import * as serviceWorker from './serviceWorker'

import configureStore from './store/configureStore'

const LogRocketID = process.env.REACT_APP_LOGROCKET_ID
const SentryURL = process.env.REACT_APP_SENTRY_URL
const store = configureStore()

if (process.env.NODE_ENV === 'production') {
  LogRocket.init(LogRocketID)
  Sentry.init({ dsn: SentryURL })
}

const renderApp = () => render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./modules/app/Index', renderApp)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

renderApp()
