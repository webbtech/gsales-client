import {
  all,
  // put,
  call,
  take,
  // takeLatest,
} from 'redux-saga/effects'

import { callApi } from '../../saga/api'
import { Schemas } from '../../services/api'
import * as reportActions from './actions'

// ============================== Shift Sales Action =========================================== //

function* fetchShiftSales(
  {
    startDate,
    endDate,
    stationID,
  },
) {
  let endpoint = `report/shift-history?startDate=${startDate}`
  if (endDate) {
    endpoint += `&endDate=${endDate}`
  }
  if (stationID) {
    endpoint += `&stationID=${stationID}`
  }

  const apiParams = {
    method: 'GET',
  }
  const { shiftHistoryEntity } = reportActions

  yield call(callApi, shiftHistoryEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchShiftSales() {
  while (true) {
    const { params } = yield take(reportActions.SHIFT_HISTORY.REQUEST)
    yield fetchShiftSales(params)
  }
}

export default function* rootSaga() {
  yield all([
    watchFetchShiftSales(),
  ])
}
