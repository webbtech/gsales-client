/* eslint-disable no-param-reassign, arrow-parens, default-case, consistent-return */
import produce from 'immer'
import moment from 'moment'

import * as ActionTypes from './actions'

const initialState = {
  dayInfo: {},
  error: false,
  isFetching: false,
  shifts: {},
  shift: {},
}

const daySaleRequest = (action, state) => produce(state, draft => {
  switch (action.type) {
    case ActionTypes.DAYSALES.REQUEST:
      draft.isFetching = true
      draft.lastDay = action.params.lastDay || false
      draft.shift = {}
      break

    case ActionTypes.DAYSALES.SUCCESS: {
      const lastShiftIdx = action.response.result[action.response.result.length - 1]
      const lastShift = action.response.entities.shifts[lastShiftIdx]
      const recordDate = moment(lastShift.recordDate).utcOffset(-moment().utcOffset()).format('YYYY-MM-DD')

      draft.dayInfo.recordDate = recordDate
      draft.dayInfo.station = lastShift.stationID
      draft.dayInfo.activeShift = null
      draft.dayInfo.lastDay = state.lastDay
      if (state.lastDay === true) {
        draft.dayInfo.maxDate = recordDate
      }
      draft.isFetching = false
      draft.shifts = action.response
      break
    }

    case ActionTypes.DAYSALES.FAILURE:
      draft.isFetching = false
      draft.error = action.error
      break
  }
})

const daySales = (state = initialState, action) => produce(state, draft => {
  switch (action.type) {
    case ActionTypes.SHIFT_SALES.REQUEST:
    case ActionTypes.SHIFT_SALES.FAILURE:
      return

    case ActionTypes.SHIFT_SALES.SUCCESS:
      draft.dayInfo.activeShift = action.response.result.shift
      draft.shift.isFetching = false
      draft.shift.sales = action.response
      return

    case ActionTypes.SHIFT_PATCH.REQUEST:
      // TODO: test and optimize
      if (action.params.action === 'close') {
        // state.shifts.entities.shifts[action.params.shiftID].shift.flag = true
        // return { ...state, activeShift: null }
        draft.shifts.entities.shifts[action.params.shiftID].shift.flag = true
        // draft.activeShift = null
      }
      return

    case ActionTypes.SHIFT_PATCH.FAILURE:
      return

    case ActionTypes.SHIFT_PATCH.SUCCESS:
      draft.shift.sales.entities.shift = action.response.entities.shift
      return

    case ActionTypes.DAYSALES.REQUEST:
    case ActionTypes.DAYSALES.SUCCESS:
    case ActionTypes.DAYSALES.FAILURE:
      return daySaleRequest(action, state)

    case ActionTypes.CLEAR_ALL_SALES:
      return initialState
  }
})

export default daySales
