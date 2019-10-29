import { all, spawn } from 'redux-saga/effects'

import configSaga from '../modules/admin/modules/config/saga'
import employeeSaga from '../modules/admin/modules/employee/saga'
import journalSaga from '../modules/journal/saga'
import productSaga from '../modules/admin/modules/product/saga'
import reportSaga from '../modules/reports/saga'
import salesSaga from '../modules/sales/saga'
import stationSaga from '../modules/admin/modules/station/saga'

export default function* rootSaga() {
  yield all([
    spawn(configSaga),
    spawn(employeeSaga),
    spawn(journalSaga),
    spawn(productSaga),
    spawn(reportSaga),
    spawn(salesSaga),
    spawn(stationSaga),
  ])
}
