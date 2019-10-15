import {
  all,
  put,
  call,
  takeLatest,
} from 'redux-saga/effects'

import { callApi } from '../../../../saga/api'
import { Schemas } from '../../../../services/api'
import * as employeeActions from './actions'
import * as alertActions from '../../../alert/actions'

export function* employeeSearch({ params: { active, search } }) {
  const { employeesEntity } = employeeActions
  const defaultField = 'nameLast'

  const endpoint = `employees?search=${search}&field=${defaultField}&active=${active}`
  yield call(callApi, employeesEntity, endpoint, Schemas.EMPLOYEE_ARRAY)
}

export function* employeePersist({ params: { employeeID, values } }) {
  const { persistEmployeeEntity } = employeeActions

  const endpoint = employeeID ? `employee/${employeeID}` : 'employee'
  const apiParams = {
    method: employeeID ? 'PUT' : 'POST',
    body: { ...values },
  }

  yield call(callApi, persistEmployeeEntity, endpoint, Schemas.EMPLOYEE, apiParams)
  yield put(employeeActions.clearSearch())
  yield put(alertActions.alertSend({ message: 'Employee successfully saved', type: 'success', dismissAfter: 2000 }))
}

export function* watchEmployeeSearch() {
  yield takeLatest(employeeActions.EMPLOYEES.REQUEST, employeeSearch)
}

export function* watchEmployeePersist() {
  yield takeLatest(employeeActions.EMPLOYEE_PERSIST.REQUEST, employeePersist)
}

export function* fetchActiveEmployees() {
  const { activeEmployeesEntity } = employeeActions

  const endpoint = 'employee-list'
  yield call(callApi, activeEmployeesEntity, endpoint, Schemas.EMPLOYEE_ARRAY)
}

export function* watchFetchActiveEmployees() {
  yield takeLatest(employeeActions.ACTIVE_EMPLOYEES.REQUEST, fetchActiveEmployees)
}

export default function* rootSaga() {
  yield all([
    watchFetchActiveEmployees(),
    watchEmployeeSearch(),
    watchEmployeePersist(),
  ])
}
