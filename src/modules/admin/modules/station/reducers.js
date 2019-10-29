/* eslint-disable  no-param-reassign, arrow-parens, default-case */
import produce from 'immer'

import * as ActionTypes from './actions'

const initialState = {
  isFetching: false,
  error: false,
  items: [],
  item: {},
}

// TODO: complete conversion to immer
export const station = (state = initialState, action) => produce(state, draft => {
  switch (action.type) {
    case ActionTypes.STATIONS.REQUEST:
      return { ...state, isFetching: true }

    case ActionTypes.STATIONS.SUCCESS:
      return { ...state, isFetching: false, items: action.response.entities.items }

    case ActionTypes.STATIONS.FAILURE:
      return { ...state, isFetching: false, error: action.error }

    case ActionTypes.STATION.REQUEST:
      return { ...state, isFetching: true }

    case ActionTypes.STATION.SUCCESS:
      return {
        ...state,
        isFetching: false,
        item: action.response.entities.station[action.response.result],
      }

    case ActionTypes.STATION.FAILURE:
      return { ...state, isFetching: false, error: action.error }

    case ActionTypes.STATION_PERSIST.REQUEST:
      return { ...state, isFetching: true }

    case ActionTypes.STATION_PERSIST.FAILURE:
      return { ...state, isFetching: false, error: action.error }

    case ActionTypes.STATION_PERSIST.SUCCESS:
      return { ...state, isFetching: false, response: action.response }

    default:
      return state
  }
})

export const dispensers = (
  state = { isFetching: false, error: false, items: {} },
  action,
) => produce(state, draft => {
  switch (action.type) {
    case ActionTypes.STATION_DISPENSERS.REQUEST:
      draft.isFetching = true
      break

    case ActionTypes.STATION_DISPENSERS.SUCCESS:
      draft.isFetching = false
      draft.items = action.response.entities.items
      break

    case ActionTypes.STATION_DISPENSERS.FAILURE:
      draft.isFetching = false
      draft.error = action.error
      break
  }
})
