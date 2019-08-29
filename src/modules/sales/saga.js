import {
  all,
  put,
  call,
  take,
  takeLatest,
} from 'redux-saga/effects'

import { callApi } from '../../saga/api'
import { Schemas } from '../../services/api'
import * as salesActions from './actions'
import * as alertActions from '../alert/actions'
import { fetchJournals } from '../journal/actions'

// ============================== Fetch Day ============================== //

export function* fetchDay(stationID, params) {
  let endpoint = 'sales'
  if (Object.prototype.hasOwnProperty.call(params, 'lastDay')) {
    endpoint += '/lastDay'
  }
  endpoint += `?stationID=${stationID}`
  if (Object.prototype.hasOwnProperty.call(params, 'date')) {
    endpoint += `&date=${params.date}`
  }
  if (Object.prototype.hasOwnProperty.call(params, 'populate')) {
    endpoint += '&populate=true'
  }
  const { daySalesEntity } = salesActions
  yield call(callApi, daySalesEntity, endpoint, Schemas.DAYSALES_ARRAY)
}

function* watchFetchDay() {
  while (true) {
    const { stationID, params = {} } = yield take(salesActions.DAYSALES.REQUEST)
    yield fetchDay(stationID, params)
  }
}

// ============================== Fetch Shift Sales ============================== //

export function* fetchShiftSales({ shiftID, stationID, recordNum }) {
  const endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  const { shiftEntity } = salesActions
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)

  // Fetch journal entries at this time
  yield put(fetchJournals({ recordNum, stationID }))
}

function* watchShiftSales() {
  while (true) {
    const { params } = yield take(salesActions.SHIFT_SALES.REQUEST)
    yield fetchShiftSales(params)
  }
}

// ============================== Shift Patch ============================== //

export function* shiftPatch({
  params: {
    action,
    actionArgs,
    recordNum,
    shiftID,
    stationID,
  },
}) {
  if (!action) {
    const msg = 'Missing action parameter in shiftPatch'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in shiftPatch'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { shiftPatchEntity } = salesActions
  let endpoint
  let apiParams

  switch (action) {
    case 'patchShift': {
      endpoint = `sale/${shiftID}`
      apiParams = {
        method: 'PATCH',
        body: actionArgs,
      }
      const res = yield call(callApi, shiftPatchEntity, endpoint, Schemas.SHIFT, apiParams)

      if (res.result === shiftID) { // actually, if we're getting a 'res', the call was successful
        endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
        const { shiftEntity } = salesActions
        yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
      }
      break
    }

    case 'close':
      endpoint = `sale/${shiftID}`
      apiParams = {
        method: 'PATCH',
        body: actionArgs,
      }
      yield call(callApi, shiftPatch, endpoint, Schemas.SHIFT, apiParams)
      break

    default:
      break
  }
}

function* watchShiftPatch() {
  yield takeLatest(salesActions.SHIFT_PATCH.REQUEST, shiftPatch)
}

export default function* rootSaga() {
  yield all([
    watchFetchDay(),
    watchShiftSales(),
    watchShiftPatch(),
  ])
}
