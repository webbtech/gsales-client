import {
  action,
  createRequestTypes,
} from '../../utils/actions'

// ===================================== Action Definitions ================================== //

// export const ADJUST_OTHER_FUEL = createRequestTypes('ADJUST_OTHER_FUEL')
// export const CONFIG = createRequestTypes('CONFIG')
// export const FUEL_SALE = createRequestTypes('FUEL_SALE')
// export const NON_FUEL_SALE = createRequestTypes('NON_FUEL_SALE')
// export const NON_FUEL_SALE_SAVE = createRequestTypes('NON_FUEL_SALES_SAVE')
// export const PATCH_SIMPLE = createRequestTypes('PATCH_SIMPLE')
// export const SET_ADJUST_RECORD_ID = createRequestTypes('SET_ADJUST_RECORD_ID')
// export const SHIFT_ITEM = createRequestTypes('SHIFT_ITEM')
// export const STATIONS = createRequestTypes('STATIONS')

export const ATTENDANT_SAVE = createRequestTypes('ATTENDANT_SAVE')
export const CASH_CASH = createRequestTypes('CASH_CASH')
export const DAYSALES = createRequestTypes('DAYSALES')
export const FUEL_SALE_ADJUST = createRequestTypes('FUEL_SALE_ADJUST')
export const FUEL_SALE_SAVE = createRequestTypes('FUEL_SALE_SAVE')
export const NON_FUEL_MISC_SAVE = createRequestTypes('NON_FUEL_MISC_SAVE')
export const NON_FUEL_PRODUCT_ADJUST = createRequestTypes('NON_FUEL_PRODUCT_ADJUST')
export const NON_FUEL_PRODUCTS_SAVE = createRequestTypes('NON_FUEL_PRODUCTS_SAVE')
export const RESET_DISPENSER = createRequestTypes('RESET_DISPENSER')
export const SHIFT_ACTION = createRequestTypes('SHIFT_ACTION')
export const SHIFT_PATCH = createRequestTypes('SHIFT_PATCH')
export const SHIFT_SALES = createRequestTypes('SHIFT_SALES')
export const SHIFT_SUMMARY = createRequestTypes('SHIFT_SUMMARY')

// export const PROPANE_SALE = 'PROPANE_SALE'
export const CLEAR_ALL_SALES = 'CLEAR_ALL_SALES'


// ===================================== Entities ============================================= //

export const daySalesEntity = {
  request: daySales => action(DAYSALES.REQUEST, { daySales }),
  success: response => action(DAYSALES.SUCCESS, { response }),
  failure: error => action(DAYSALES.FAILURE, { error }),
}

export const persistAttendantEntity = {
  request: request => action(ATTENDANT_SAVE.REQUEST, { request }),
  success: response => action(ATTENDANT_SAVE.SUCCESS, { response }),
  failure: error => action(ATTENDANT_SAVE.FAILURE, { error }),
}

export const persistNonFuelProductAdjustEntity = {
  request: request => action(NON_FUEL_PRODUCT_ADJUST.REQUEST, { request }),
  success: response => action(NON_FUEL_PRODUCT_ADJUST.SUCCESS, { response }),
  failure: error => action(NON_FUEL_PRODUCT_ADJUST.FAILURE, { error }),
}

export const persistDispenserResetEntity = {
  request: request => action(RESET_DISPENSER.REQUEST, { request }),
  success: response => action(RESET_DISPENSER.SUCCESS, { response }),
  failure: error => action(RESET_DISPENSER.FAILURE, { error }),
}

export const persistFuelSalesEntity = {
  request: request => action(FUEL_SALE_SAVE.REQUEST, { request }),
  success: response => action(FUEL_SALE_SAVE.SUCCESS, { response }),
  failure: error => action(FUEL_SALE_SAVE.FAILURE, { error }),
}

export const persistFuelSaleAdjustmentEntity = {
  request: request => action(FUEL_SALE_ADJUST.REQUEST, { request }),
  success: response => action(FUEL_SALE_ADJUST.SUCCESS, { response }),
  failure: error => action(FUEL_SALE_ADJUST.FAILURE, { error }),
}

export const persistNonFuelMiscEntity = {
  request: request => action(NON_FUEL_MISC_SAVE.REQUEST, { request }),
  success: response => action(NON_FUEL_MISC_SAVE.SUCCESS, { response }),
  failure: error => action(NON_FUEL_MISC_SAVE.FAILURE, { error }),
}

export const persistNonFuelProductsEntity = {
  request: request => action(NON_FUEL_PRODUCTS_SAVE.REQUEST, { request }),
  success: response => action(NON_FUEL_PRODUCTS_SAVE.SUCCESS, { response }),
  failure: error => action(NON_FUEL_PRODUCTS_SAVE.FAILURE, { error }),
}

export const persistShiftSummaryEntity = {
  request: request => action(SHIFT_SUMMARY.REQUEST, { request }),
  success: response => action(SHIFT_SUMMARY.SUCCESS, { response }),
  failure: error => action(SHIFT_SUMMARY.FAILURE, { error }),
}

export const shiftActionEntity = {
  request: shiftAction => action(SHIFT_ACTION.REQUEST, { shiftAction }),
  success: response => action(SHIFT_ACTION.SUCCESS, { response }),
  failure: error => action(SHIFT_ACTION.FAILURE, { error }),
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

export const createShift = params => action(SHIFT_ACTION.REQUEST, { params })
export const clearSalesShift = () => action(CLEAR_ALL_SALES)
export const deleteShift = params => action(SHIFT_ACTION.REQUEST, { params })
export const patchShift = params => action(SHIFT_PATCH.REQUEST, { params })

export const adjustFuelSale = params => action(FUEL_SALE_ADJUST.REQUEST, { params })
export const resetDispenser = params => action(RESET_DISPENSER.REQUEST, { params })
export const saveFuelSales = params => action(FUEL_SALE_SAVE.REQUEST, { params })

export const adjustCash = params => action(CASH_CASH.REQUEST, { params })
export const saveNonFuelMisc = params => action(NON_FUEL_MISC_SAVE.REQUEST, { params })
export const saveNonFuelProducts = params => action(NON_FUEL_PRODUCTS_SAVE.REQUEST, { params })
export const adjustNonFuelProduct = params => action(NON_FUEL_PRODUCT_ADJUST.REQUEST, { params })

export const saveShiftSummary = params => action(SHIFT_SUMMARY.REQUEST, { params })
export const saveAttendant = params => action(ATTENDANT_SAVE.REQUEST, { params })
