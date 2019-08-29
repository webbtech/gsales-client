import * as ActionTypes from './actions'

const initialState = {
  isFetching: false,
  error: false,
  items: [],
  item: {},
}

export default function stations(state = initialState, action) {
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

      // case defs.STATION_REQUEST:
      // return Object.assign({}, state, { isFetching: true })

    /* case defs.STATION_SET_VIEW:
      return Object.assign({}, state, {
        isFetching: false,
        view: action.view,
        id: action.id,
      })
    case defs.STATION_LIST_SUCCESS:
      return {
        isFetching: false,
        items: action.response.entities.items,
        receivedAt: Date.now(),
        error: false,
        view: action.view,
      }
    case defs.STATION_SUCCESS:
      return {
        isFetching: false,
        item: Object.assign({}, state.item, action.response.entities.items[action.response.result]),
        receivedAt: Date.now(),
        error: false,
        id: action.response.result,
      }
    case defs.STATION_FAILURE:
      return {
        isFetching: false,
        items: [],
        receivedAt: Date.now(),
        error: action.error,
      } */
    default:
      return state
  }
}
