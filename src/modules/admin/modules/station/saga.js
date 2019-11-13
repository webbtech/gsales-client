import {
  all,
  put,
  call,
  takeLatest,
} from 'redux-saga/effects'

import { callApi } from '../../../../saga/api'
import { Schemas } from '../../../../services/api'
import * as stationActions from './actions'
import * as alertActions from '../../../alert/actions'

// ============================== Fetch Stations =============================================== //
function* stationList() {
  const { stationsEntity } = stationActions
  yield call(callApi, stationsEntity, 'stations?list=true', Schemas.STATION_ARRAY)
}

function* watchStationList() {
  yield takeLatest(stationActions.STATIONS.REQUEST, stationList)
}

// ============================== Fetch Station ================================================ //

function* station(args) {
  const { stationEntity } = stationActions
  yield call(callApi, stationEntity, `station/${args.stationID}`, Schemas.STATION)
}

function* watchStationFetch() {
  yield takeLatest(stationActions.STATION.REQUEST, station)
}

// ============================== Fetch Station Dispensers ===================================== //

function* fetchStationDispensers({ stationID }) {
  const { stationDispensersEntity } = stationActions
  const endpoint = `dispensers?station=${stationID}`
  yield call(callApi, stationDispensersEntity, endpoint, Schemas.DISPENSERS)
}

function* watchFetchStationDispensers() {
  yield takeLatest(stationActions.STATION_DISPENSERS.REQUEST, fetchStationDispensers)
}

// ============================== Save Station ================================================= //

function* stationPersist({ params: { stationID, values } }) {
  const { persistStationEntity } = stationActions
  const apiParams = {
    method: 'PUT',
    body: { ...values },
  }

  const res = yield call(callApi, persistStationEntity, `station/${stationID}`, Schemas.STATION, apiParams)
  yield put({ type: stationActions.STATION.SUCCESS, response: res })
  yield put(alertActions.alertSend({ message: 'Station details successfully updated', type: 'success', dismissAfter: 2000 }))
}

function* watchStationPersist() {
  yield takeLatest(stationActions.STATION_PERSIST.REQUEST, stationPersist)
}

export default function* rootSaga() {
  yield all([
    watchFetchStationDispensers(),
    watchStationList(),
    watchStationFetch(),
    watchStationPersist(),
  ])
}
