/* eslint-disable no-param-reassign, arrow-parens, default-case */
import produce from 'immer'
// import moment from 'moment'

import * as ActionTypes from './actions'

const initialState = {
  error: false,
  isFetching: false,
  report: null,
}

const report = (state = initialState, action) => produce(state, draft => {
  switch (action.type) {
    case ActionTypes.SHIFT_HISTORY.REQUEST:
      draft.isFetching = true
      return

    case ActionTypes.SHIFT_HISTORY.FAILURE:
      draft.isFetching = false
      return

    case ActionTypes.SHIFT_HISTORY.SUCCESS:
      draft.isFetching = false
      draft.report = action.response
      // return
  }
})

export default report
