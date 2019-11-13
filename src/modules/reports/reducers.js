/* eslint-disable no-param-reassign, arrow-parens, default-case, consistent-return */
import produce from 'immer'

import * as ActionTypes from './actions'

const R = require('ramda')

const initialState = {
  error: false,
  isFetching: false,
  report: null,
}

const monthlyState = R.clone(initialState)
const shiftState = R.clone(initialState)

const report = (state = initialState, action) => produce(state, draft => {
  switch (action.type) {
    case ActionTypes.ATTENDANT.REQUEST:
    case ActionTypes.MONTHLY_SALES.REQUEST:
    case ActionTypes.OIL_PRODUCT_SALES.REQUEST:
    case ActionTypes.PRODUCT_SALES.REQUEST:
    case ActionTypes.SHIFTS.REQUEST:
    case ActionTypes.SHIFT_HISTORY.REQUEST:
      draft.isFetching = true
      return

    case ActionTypes.ATTENDANT.FAILURE:
    case ActionTypes.MONTHLY_SALES.FAILURE:
    case ActionTypes.OIL_PRODUCT_SALES.FAILURE:
    case ActionTypes.PRODUCT_SALES.FAILURE:
    case ActionTypes.SHIFTS.FAILURE:
    case ActionTypes.SHIFT_HISTORY.FAILURE:
      draft.isFetching = false
      return

    case ActionTypes.ATTENDANT.SUCCESS:
    case ActionTypes.MONTHLY_SALES.SUCCESS:
    case ActionTypes.OIL_PRODUCT_SALES.SUCCESS:
    case ActionTypes.PRODUCT_SALES.SUCCESS:
    case ActionTypes.SHIFTS.SUCCESS:
    case ActionTypes.SHIFT_HISTORY.SUCCESS:
      draft.isFetching = false
      draft.report = action.response
      return

    case ActionTypes.CLEAR_REPORT:
      return initialState
  }
})

const monthlyReport = (state = monthlyState, action) => produce(state, draft => {
  switch (action.type) {
    case ActionTypes.MONTHLY_CASH.REQUEST:
    case ActionTypes.MONTHLY_FUEL.REQUEST:
    case ActionTypes.MONTHLY_NON_FUEL.REQUEST:
    case ActionTypes.MONTHLY_STATION.REQUEST:
    case ActionTypes.MONTHLY_STATION_SUMMARY.REQUEST:
      draft.isFetching = true
      return

    case ActionTypes.MONTHLY_CASH.FAILURE:
    case ActionTypes.MONTHLY_FUEL.FAILURE:
    case ActionTypes.MONTHLY_NON_FUEL.FAILURE:
    case ActionTypes.MONTHLY_STATION.FAILURE:
    case ActionTypes.MONTHLY_STATION_SUMMARY.FAILURE:
      draft.isFetching = false
      return

    case ActionTypes.MONTHLY_CASH.SUCCESS:
    case ActionTypes.MONTHLY_FUEL.SUCCESS:
    case ActionTypes.MONTHLY_NON_FUEL.SUCCESS:
    case ActionTypes.MONTHLY_STATION.SUCCESS:
    case ActionTypes.MONTHLY_STATION_SUMMARY.SUCCESS:
      draft.isFetching = false
      draft.report = action.response
      return

    case ActionTypes.CLEAR_MONTHLY_REPORT:
      return monthlyState
  }
})

const report2 = (state = shiftState, action) => produce(state, draft => {
  switch (action.type) {
    case ActionTypes.SHIFT.REQUEST:
    case ActionTypes.PRODUCT_SALES_ADJUSTMENTS.REQUEST:
      draft.isFetching = true
      return

    case ActionTypes.SHIFT.FAILURE:
    case ActionTypes.PRODUCT_SALES_ADJUSTMENTS.FAILURE:
      draft.isFetching = false
      return

    case ActionTypes.SHIFT.SUCCESS:
    case ActionTypes.PRODUCT_SALES_ADJUSTMENTS.SUCCESS:
      draft.isFetching = false
      draft.report = action.response
  }
})

export { monthlyReport, report, report2 }
