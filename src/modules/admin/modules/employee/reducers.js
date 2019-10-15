import * as ActionTypes from './actions'

const initialState = {
  isFetching: false,
  error: false,
  items: null,
  item: {},
}

export default function employees(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.EMPLOYEES.REQUEST:
    case ActionTypes.ACTIVE_EMPLOYEES.REQUEST:
      return { ...state, isFetching: true }

    case ActionTypes.EMPLOYEES.SUCCESS:
    case ActionTypes.ACTIVE_EMPLOYEES.SUCCESS:
      return { ...state, isFetching: false, items: action.response.entities.items }

    case ActionTypes.EMPLOYEES.FAILURE:
    case ActionTypes.ACTIVE_EMPLOYEES.FAILURE:
      return { ...state, isFetching: false, error: action.error }

    case ActionTypes.EMPLOYEE.REQUEST:
      let item = {} // eslint-disable-line no-case-declarations
      if (action.employeeID) {
        item = { employeeID: action.employeeID }
      }
      return { ...state, item }

    case ActionTypes.CLEAR_SEARCH:
      return initialState

    default:
      return state
  }
}
