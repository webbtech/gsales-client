import * as ActionTypes from './actions'

const initialState = {
  isFetching: false,
  values: {},
}

export default function config(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.CONFIG.REQUEST:
      return { ...state, isFetching: true }

    case ActionTypes.CONFIG.SUCCESS:
      return { ...state, isFetching: false, values: action.response.entities.config[1] }

    case ActionTypes.CONFIG.FAILURE:
      return { ...state, isFetching: false }

    default:
      return state
  }
}
