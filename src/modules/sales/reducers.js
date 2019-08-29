import * as ActionTypes from './actions'

const R = require('ramda')

const initialState = {
  dayInfo: {},
  error: false,
  isFetching: false,
  shifts: {},
  shift: {},
  stations: {},
}

function shiftSales(action, state = { isFetching: false, error: false, sales: {} }) {
  switch (action.type) {
    case ActionTypes.SHIFT_SALES.REQUEST:
      return { ...state, isFetching: true }

    case ActionTypes.SHIFT_SALES.SUCCESS:
      return { ...state, sales: action.response }

    case ActionTypes.SHIFT_SALES.FAILURE:
      return { ...state, isFetching: false, error: action.error }

    default:
      return state
  }
}

function daySaleRequest(action, state = { isFetching: false, lastDay: false, dayInfo: {} }) {
  switch (action.type) {
    case ActionTypes.DAYSALES.REQUEST:
      return {
        ...state,
        isFetching: true,
        shift: {},
        lastDay: action.params.lastDay || false,
      }

    case ActionTypes.DAYSALES.SUCCESS: {
      const lastShift = action.response.entities.shifts[action.response.result[action.response.result.length - 1]] // eslint-disable-line max-len
      const lDte = new Date(lastShift.recordDate)
      // Correct to local time
      lastShift.recordDate = new Date(lDte.getTime() + (60000 * (lDte.getTimezoneOffset())))

      const dInfo = {
        recordDate: lastShift.recordDate,
        station: lastShift.stationID,
        activeShift: null,
      }
      if (state.lastDay === true) {
        dInfo.maxDate = new Date(lastShift.recordDate)
      }
      Object.assign(state.dayInfo, dInfo)

      return {
        ...state,
        isFetching: false,
        shifts: action.response,
      }
    }

    case ActionTypes.DAYSALES.FAILURE:
      return { ...state, isFetching: false, error: action.error }

    default:
      return state
  }
}

export default function daySales(state = initialState, action) {
  switch (action.type) {
    /* case ActionTypes.STATIONS.REQUEST:
      return { ...state, isFetching: true }
    case ActionTypes.STATIONS.FAILURE:
      return { ...state, isFetching: false }
    case ActionTypes.STATIONS.SUCCESS:
      // return {...state, isFetching: false }
      return { ...state, isFetching: false, stations: stationList(action) } */

    case ActionTypes.SHIFT_SALES.REQUEST:
    case ActionTypes.SHIFT_SALES.FAILURE:
      return state
    case ActionTypes.SHIFT_SALES.SUCCESS:
      return Object.assign({}, state, {
        shift: shiftSales(action),
        dayInfo: Object.assign(state.dayInfo, { activeShift: action.response.result.shift }),
      })

   /*  case ActionTypes.SHIFT_ACTION.REQUEST:
    case ActionTypes.SHIFT_ACTION.FAILURE:
    case ActionTypes.SHIFT_ACTION.SUCCESS:
      return { ...state, shift: shiftAction(action) } */

    case ActionTypes.SHIFT_PATCH.REQUEST:
      if (action.params.action === 'close') {
        state.shifts.entities.shifts[action.params.shiftID].shift.flag = true
        return { ...state, activeShift: null }
      }
      return state
    case ActionTypes.SHIFT_PATCH.FAILURE:
      return state
    case ActionTypes.SHIFT_PATCH.SUCCESS:
      const stateClone = R.clone(state) // eslint-disable-line no-case-declarations
      stateClone.shift.sales.entities.shift = action.response.entities.shift
      return { ...stateClone }

    /* case ActionTypes.FUEL_SALE.REQUEST:
    case ActionTypes.FUEL_SALE.FAILURE:
      return state
    case ActionTypes.FUEL_SALE.SUCCESS:
      state.shift.sales.entities.fuelSale[action.fuelSale.id] = action.fuelSale
      return { ...state } */

    /* case ActionTypes.FUEL_SALE_SAVE.REQUEST:
    case ActionTypes.FUEL_SALE_SAVE.FAILURE:
      return state
    case ActionTypes.FUEL_SALE_SAVE.SUCCESS:
      state.shift.sales.entities.shift = action.response.entities.shift
      return { ...state } */

    /* case ActionTypes.NON_FUEL_SALE.REQUEST:
    case ActionTypes.NON_FUEL_SALE.FAILURE:
      return state
    case ActionTypes.NON_FUEL_SALE.SUCCESS:
      state.shift.sales.entities.nonFuelSale[action.nonFuelSale.id] = action.nonFuelSale
      return { ...state } */

    /* case ActionTypes.NON_FUEL_SALE_SAVE.REQUEST:
    case ActionTypes.NON_FUEL_SALE_SAVE.FAILURE:
      return state
    case ActionTypes.NON_FUEL_SALE_SAVE.SUCCESS:
      state.shift.sales.entities.shift = action.response.entities.shift
      return { ...state } */

    /* case ActionTypes.SHIFT_ITEM.REQUEST:
      return shiftItemUpdate(action, state) */

    /* case ActionTypes.SHIFT_SUMMARY.REQUEST:
    case ActionTypes.SHIFT_SUMMARY.FAILURE:
      return state
    case ActionTypes.SHIFT_SUMMARY.SUCCESS:
      state.shift.sales.entities.shift = action.response.entities.shift
      return { ...state } */

    /* case ActionTypes.CONFIG.SUCCESS:
      return { ...state, config: action.response.entities.config[1] } */

    case ActionTypes.DAYSALES.REQUEST:
    case ActionTypes.DAYSALES.SUCCESS:
    case ActionTypes.DAYSALES.FAILURE:
      return daySaleRequest(action, state)

    /* case ActionTypes.SET_ADJUST_RECORD_ID.REQUEST:
      Object.assign(state.dayInfo, { adjustRecordId: action.id })
      return { ...state }
    case ActionTypes.SET_ADJUST_RECORD_ID.FAILURE:
      return state
    case ActionTypes.SET_ADJUST_RECORD_ID.SUCCESS:
      Object.assign(state.dayInfo, { adjustRecordId: false })
      return { ...state } */

    /* case ActionTypes.ADJUST_FUEL_SALE.REQUEST:
    case ActionTypes.ADJUST_FUEL_SALE.SUCCESS:
    case ActionTypes.ADJUST_FUEL_SALE.FAILURE:
      return state */

    /* case ActionTypes.PROPANE_SALE:
      setPropaneSale(action, state)
      return setPropaneSale(action, state) */

    /* case ActionTypes.ADJUST_CASH.SUCCESS:
      state.shift.sales.entities.shift = action.response.entities.shift
      return { ...state } */

    default:
      return state
  }
}