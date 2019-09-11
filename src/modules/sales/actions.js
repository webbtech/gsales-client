import {
  action,
  createRequestTypes,
} from '../../utils/actions'

// ===================================== Action Definitions ================================== //

export const ADJUST_CASH = createRequestTypes('ADJUST_CASH')
export const ADJUST_FUEL_SALE = createRequestTypes('ADJUST_FUEL_SALE')
export const ADJUST_NON_FUEL_SALE = createRequestTypes('ADJUST_NON_FUEL_SALE')
export const ADJUST_OTHER_FUEL = createRequestTypes('ADJUST_OTHER_FUEL')
export const CONFIG = createRequestTypes('CONFIG')
export const DAYSALES = createRequestTypes('DAYSALES')
export const FUEL_SALE = createRequestTypes('FUEL_SALE')
export const FUEL_SALE_SAVE = createRequestTypes('FUEL_SALE_SAVE')
export const NON_FUEL_SALE = createRequestTypes('NON_FUEL_SALE')
export const NON_FUEL_SALE_SAVE = createRequestTypes('NON_FUEL_SALES_SAVE')
export const PATCH_SIMPLE = createRequestTypes('PATCH_SIMPLE')
export const RESET_DISPENSER = createRequestTypes('RESET_DISPENSER')
export const SET_ADJUST_RECORD_ID = createRequestTypes('SET_ADJUST_RECORD_ID')
export const SHIFT_ACTION = createRequestTypes('SHIFT_ACTION')
export const SHIFT_ITEM = createRequestTypes('SHIFT_ITEM')
export const SHIFT_PATCH = createRequestTypes('SHIFT_PATCH')
export const SHIFT_SALES = createRequestTypes('SHIFT_SALES')
export const SHIFT_SUMMARY = createRequestTypes('SHIFT_SUMMARY')
export const STATIONS = createRequestTypes('STATIONS')

export const PROPANE_SALE = 'PROPANE_SALE'
export const CLEAR_ALL_SALES = 'CLEAR_ALL_SALES'


// ===================================== Entities ============================================= //

export const daySalesEntity = {
  request: daySales => action(DAYSALES.REQUEST, { daySales }),
  success: response => action(DAYSALES.SUCCESS, { response }),
  failure: error => action(DAYSALES.FAILURE, { error }),
}

export const shiftEntity = {
  request: shift => action(SHIFT_SALES.REQUEST, { shift }),
  success: response => action(SHIFT_SALES.SUCCESS, { response }),
  failure: error => action(SHIFT_SALES.FAILURE, { error }),
}

export const shiftPatchEntity = {
  request: request => action(SHIFT_PATCH.REQUEST, { request }),
  success: response => action(SHIFT_PATCH.SUCCESS, { response }),
  failure: error => action(SHIFT_PATCH.FAILURE, { error }),
}

// ===================================== Actions ============================================== //

export const loadShift = params => action(SHIFT_SALES.REQUEST, { params })
export const loadShiftSales = (stationID, params = {}) => action(
  DAYSALES.REQUEST,
  { stationID, params }
)

export const clearSalesShift = () => action(CLEAR_ALL_SALES)
export const updateShift = params => action(SHIFT_PATCH.REQUEST, { params })
