import {
  all,
  put,
  call,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'

import { callApi } from '../../../../saga/api'
import { Schemas } from '../../../../services/api'
import * as stationActions from './actions'
import * as alertActions from '../../../alert/actions'

export function* stationList() {
  // const { config, station } = stationActions
  const { stationsEntity } = stationActions
  // yield call(callApi, config, 'config/1', Schemas.CONFIG)
  yield call(callApi, stationsEntity, 'stations?list=true', Schemas.STATION_ARRAY)
}

export function* station(args) {
  const { stationEntity } = stationActions

  yield call(callApi, stationEntity, `station/${args.stationID}`, Schemas.STATION)
}

export function* stationPersist({ params: { stationID, values } }) {
  const { persistStationEntity } = stationActions
  const apiParams = {
    method: 'PUT',
    body: { ...values },
  }

  const res = yield call(callApi, persistStationEntity, `station/${stationID}`, Schemas.STATION, apiParams)
  yield put({ type: stationActions.STATION.SUCCESS, response: res })
  yield put(alertActions.alertSend({ message: 'Station details successfully updated', type: 'success', dismissAfter: 2000 }))
}

export function* watchStationList() {
  yield takeEvery(stationActions.STATIONS.REQUEST, stationList)
}

export function* watchStationFetch() {
  yield takeEvery(stationActions.STATION.REQUEST, station)
}

export function* watchStationPersist() {
  yield takeLatest(stationActions.STATION_PERSIST.REQUEST, stationPersist)
}

export default function* rootSaga() {
  yield all([
    watchStationList(),
    watchStationFetch(),
    watchStationPersist(),
  ])
}
