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

// ============================== Search Employee ============================================== //

function* employeeSearch({ params: { active, search } }) {
  const { employeesEntity } = employeeActions
  const defaultField = 'nameLast'

  const endpoint = `employees?search=${search}&field=${defaultField}&active=${active}`
  yield call(callApi, employeesEntity, endpoint, Schemas.EMPLOYEE_ARRAY)
}

function* watchEmployeeSearch() {
  yield takeLatest(employeeActions.EMPLOYEE_SEARCH.REQUEST, employeeSearch)
}

// ============================== Save Employee ================================================ //

function* employeePersist({ params: { employeeID, values } }) {
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

function* watchEmployeePersist() {
  yield takeLatest(employeeActions.EMPLOYEE_PERSIST.REQUEST, employeePersist)
}

// ============================== Fetch Employees ============================================== //

function* fetchEmployees({ active }) {
  const { employeesEntity } = employeeActions
  const endpoint = `employee-list?active=${active}`
  yield call(callApi, employeesEntity, endpoint, Schemas.EMPLOYEE_ARRAY)
}

function* watchFetchEmployees() {
  yield takeLatest(employeeActions.EMPLOYEE_LIST.REQUEST, fetchEmployees)
}

export default function* rootSaga() {
  yield all([
    watchFetchEmployees(),
    watchEmployeeSearch(),
    watchEmployeePersist(),
  ])
}
