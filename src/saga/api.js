import { call, put } from 'redux-saga/effects'

import apiService from '../services/api'
import * as alertActions from '../modules/alert/actions'

// =================================== Selectors =============================================== //

export const getReport = state => state.report

// =================================== Subroutines ============================================= //

// reusable api Subroutine
// entity :  action
export function* callApi(entity, endpoint, schema, params) {
  const { response, error } = yield call(apiService, endpoint, schema, params)
  if (response) {
    yield put(entity.success(response))
    return response
  }
  yield put(entity.failure(error))
  let msg = ''
  if (error.error) {
    msg += `Error: ${error.error} - `
  }
  msg += error.message
  yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
  return { error }
}
