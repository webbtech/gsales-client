import * as journalActions from './actions'

const initialState = {
  isFetching: false,
  response: {},
}

export default function journal(state = initialState, action) {
  switch (action.type) {
    case journalActions.JOURNAL_ENTRY.REQUEST:
      return { ...state, isFetching: true }

    case journalActions.JOURNAL_ENTRY.FAILURE:
      return { ...state }

    case journalActions.JOURNAL_ENTRY.SUCCESS:
      return { ...state, isFetching: false, response: action.response }

    default:
      return state
  }
}
