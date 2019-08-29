import {
  all,
  put,
  call,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'

import { callApi } from '../../../../saga/api'
import { Schemas } from '../../../../services/api'
import * as configActions from './actions'
import * as alertActions from '../../../alert/actions'

export function* config() {
  const { configEntity } = configActions

  const endpoint = 'config/1'
  yield call(callApi, configEntity, endpoint, Schemas.CONFIG)
}

export function* configPersist({ params: { values } }) {
  const { configEntity, persistConfigEntity } = configActions

  const endpoint = 'config/1'
  const apiParams = {
    method: 'PUT',
    body: { ...values },
  }

  yield call(callApi, persistConfigEntity, endpoint, Schemas.CONFIG, apiParams)
  yield put(alertActions.alertSend({ message: 'Configuration successfully saved', type: 'success', dismissAfter: 2000 }))
  yield call(callApi, configEntity, endpoint, Schemas.CONFIG)
}

export function* watchConfig() {
  yield takeEvery(configActions.CONFIG.REQUEST, config)
}

export function* watchConfigPersist() {
  yield takeLatest(configActions.CONFIG_PERSIST.REQUEST, configPersist)
}

export default function* rootSaga() {
  yield all([
    watchConfig(),
    watchConfigPersist(),
  ])
}
