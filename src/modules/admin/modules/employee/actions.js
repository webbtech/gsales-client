import {
  action,
  createRequestTypes,
} from '../../../../utils/actions'

export const ACTIVE_EMPLOYEES = createRequestTypes('ACTIVE_EMPLOYEES')
export const EMPLOYEE = createRequestTypes('EMPLOYEE')
export const EMPLOYEES = createRequestTypes('EMPLOYEES')
export const EMPLOYEE_PERSIST = createRequestTypes('EMPLOYEE_PERSIST')
export const CLEAR_SEARCH = 'CLEAR_SEARCH'

export const employeesEntity = {
  request: employees => action(EMPLOYEES.REQUEST, { employees }),
  success: response => action(EMPLOYEES.SUCCESS, { response }),
  failure: error => action(EMPLOYEES.FAILURE, { error }),
}

export const activeEmployeesEntity = {
  request: employees => action(ACTIVE_EMPLOYEES.REQUEST, { employees }),
  success: response => action(ACTIVE_EMPLOYEES.SUCCESS, { response }),
  failure: error => action(ACTIVE_EMPLOYEES.FAILURE, { error }),
}

export const persistEmployeeEntity = {
  request: employee => action(EMPLOYEE_PERSIST.REQUEST, { employee }),
  success: response => action(EMPLOYEE_PERSIST.SUCCESS, { response }),
  failure: error => action(EMPLOYEE_PERSIST.FAILURE, { error }),
}

export const fetchActiveEmployees = () => action(ACTIVE_EMPLOYEES.REQUEST)
export const searchEmployees = params => action(EMPLOYEES.REQUEST, { params })
export const setCurrentEmployee = employeeID => action(EMPLOYEE.REQUEST, { employeeID })
export const persistEmployee = params => action(EMPLOYEE_PERSIST.REQUEST, { params })
export const clearSearch = () => action(CLEAR_SEARCH, {})
