import { all, spawn } from 'redux-saga/effects'

import configSaga from '../modules/admin/modules/config/saga'
import employeeSaga from '../modules/admin/modules/employee/saga'
import productSaga from '../modules/admin/modules/product/saga'
import salesSaga from '../modules/sales/saga'
import journalSaga from '../modules/journal/saga'
import stationSaga from '../modules/admin/modules/station/saga'

export default function* rootSaga() {
  yield all([
    spawn(configSaga),
    spawn(employeeSaga),
    spawn(journalSaga),
    spawn(productSaga),
    spawn(salesSaga),
    spawn(stationSaga),
  ])
}

/* export default function* rootSaga() {
  yield spawn(stationSaga)
} */

/* export default function* rootSaga() {
  const sagas = [
    stationSaga,
  ]

  yield sagas.map(saga => spawn(function* root() {
    while (true) {
      try {
        yield call(saga)
      } catch (e) {
        console.log('error:', e)
      }
    }
  }))
} */
