import * as ActionTypes from './actions'

const initialState = {
  isFetching: false,
  error: false,
  items: [],
  item: {},
}

export default function products(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.PRODUCTS.REQUEST:
      return { ...state, isFetching: true }

    case ActionTypes.PRODUCTS.SUCCESS:
      return { ...state, isFetching: false, items: action.response.entities.items }

    case ActionTypes.PRODUCTS.FAILURE:
      return { ...state, isFetching: false, error: action.error }

    case ActionTypes.PRODUCT.REQUEST:
      let item = {} // eslint-disable-line no-case-declarations
      if (action.productID) {
        item = { productID: action.productID }
      }
      return { ...state, item }

    default:
      return state
  }
}
