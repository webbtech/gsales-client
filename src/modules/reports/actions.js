import {
  action,
  createRequestTypes,
} from '../../utils/actions'

export const CLEAR_REPORT = 'CLEAR_REPORT'
export const CLEAR_MONTHLY_REPORT = 'CLEAR_MONTHLY_REPORT'

export const ATTENDANT = createRequestTypes('ATTENDANT')
export const MONTHLY_CASH = createRequestTypes('MONTHLY_CASH')
export const MONTHLY_FUEL = createRequestTypes('MONTHLY_FUEL')
export const MONTHLY_NON_FUEL = createRequestTypes('MONTHLY_NON_FUEL')
export const MONTHLY_SALES = createRequestTypes('MONTHLY_SALES')
export const MONTHLY_STATION = createRequestTypes('MONTHLY_STATION')
export const MONTHLY_STATION_SUMMARY = createRequestTypes('MONTHLY_STATION_SUMMARY')
export const OIL_PRODUCT_SALES = createRequestTypes('OIL_PRODUCT_SALES')
export const PRODUCT_SALES = createRequestTypes('PRODUCT_SALES')
export const PRODUCT_SALES_ADJUSTMENTS = createRequestTypes('PRODUCT_SALES_ADJUSTMENTS')
export const SHIFT = createRequestTypes('SHIFT')
export const SHIFTS = createRequestTypes('SHIFTS')
export const SHIFT_HISTORY = createRequestTypes('SHIFT_HISTORY')

export const attendantEntity = {
  request: request => action(ATTENDANT.REQUEST, { request }),
  success: response => action(ATTENDANT.SUCCESS, { response }),
  failure: error => action(ATTENDANT.FAILURE, { error }),
}

export const monthlyEntity = {
  request: request => action(MONTHLY_SALES.REQUEST, { request }),
  success: response => action(MONTHLY_SALES.SUCCESS, { response }),
  failure: error => action(MONTHLY_SALES.FAILURE, { error }),
}

export const monthlyCashEntity = {
  request: request => action(MONTHLY_CASH.REQUEST, { request }),
  success: response => action(MONTHLY_CASH.SUCCESS, { response }),
  failure: error => action(MONTHLY_CASH.FAILURE, { error }),
}

export const monthlyFuelEntity = {
  request: request => action(MONTHLY_FUEL.REQUEST, { request }),
  success: response => action(MONTHLY_FUEL.SUCCESS, { response }),
  failure: error => action(MONTHLY_FUEL.FAILURE, { error }),
}

export const monthlyNonFuelEntity = {
  request: request => action(MONTHLY_NON_FUEL.REQUEST, { request }),
  success: response => action(MONTHLY_NON_FUEL.SUCCESS, { response }),
  failure: error => action(MONTHLY_NON_FUEL.FAILURE, { error }),
}

export const monthlyStationEntity = {
  request: request => action(MONTHLY_STATION.REQUEST, { request }),
  success: response => action(MONTHLY_STATION.SUCCESS, { response }),
  failure: error => action(MONTHLY_STATION.FAILURE, { error }),
}

export const monthlyStationSummaryEntity = {
  request: request => action(MONTHLY_STATION_SUMMARY.REQUEST, { request }),
  success: response => action(MONTHLY_STATION_SUMMARY.SUCCESS, { response }),
  failure: error => action(MONTHLY_STATION_SUMMARY.FAILURE, { error }),
}

export const oilProductSalesEntity = {
  request: request => action(OIL_PRODUCT_SALES.REQUEST, { request }),
  success: response => action(OIL_PRODUCT_SALES.SUCCESS, { response }),
  failure: error => action(OIL_PRODUCT_SALES.FAILURE, { error }),
}

export const productSalesEntity = {
  request: request => action(PRODUCT_SALES.REQUEST, { request }),
  success: response => action(PRODUCT_SALES.SUCCESS, { response }),
  failure: error => action(PRODUCT_SALES.FAILURE, { error }),
}

export const productSalesAdjustmentsEntity = {
  request: request => action(PRODUCT_SALES_ADJUSTMENTS.REQUEST, { request }),
  success: response => action(PRODUCT_SALES_ADJUSTMENTS.SUCCESS, { response }),
  failure: error => action(PRODUCT_SALES_ADJUSTMENTS.FAILURE, { error }),
}

export const shiftEntity = {
  request: request => action(SHIFT.REQUEST, { request }),
  success: response => action(SHIFT.SUCCESS, { response }),
  failure: error => action(SHIFT.FAILURE, { error }),
}

export const shiftsEntity = {
  request: request => action(SHIFTS.REQUEST, { request }),
  success: response => action(SHIFTS.SUCCESS, { response }),
  failure: error => action(SHIFTS.FAILURE, { error }),
}

export const shiftHistoryEntity = {
  request: request => action(SHIFT_HISTORY.REQUEST, { request }),
  success: response => action(SHIFT_HISTORY.SUCCESS, { response }),
  failure: error => action(SHIFT_HISTORY.FAILURE, { error }),
}

export const clearReport = () => action(CLEAR_REPORT)
export const clearMonthlyReport = () => action(CLEAR_MONTHLY_REPORT)
export const fetchAttendant = params => action(ATTENDANT.REQUEST, { params })
export const fetchMonthlyCash = params => action(MONTHLY_CASH.REQUEST, { params })
export const fetchMonthlyFuel = params => action(MONTHLY_FUEL.REQUEST, { params })
export const fetchMonthlyNonFuel = params => action(MONTHLY_NON_FUEL.REQUEST, { params })
export const fetchMonthlySales = params => action(MONTHLY_SALES.REQUEST, { params })
export const fetchMonthlyStation = params => action(MONTHLY_STATION.REQUEST, { params })
export const fetchOilProductSales = params => action(OIL_PRODUCT_SALES.REQUEST, { params })
export const fetchProductSales = params => action(PRODUCT_SALES.REQUEST, { params })
export const fetchProductSalesAdjustments = params => action(
  PRODUCT_SALES_ADJUSTMENTS.REQUEST,
  { params }
)
export const fetchShift = params => action(SHIFT.REQUEST, { params })
export const fetchShifts = params => action(SHIFTS.REQUEST, { params })
export const fetchShiftHistory = params => action(SHIFT_HISTORY.REQUEST, { params })
export const fetchMonthlyStationSummary = params => action(
  MONTHLY_STATION_SUMMARY.REQUEST,
  { params }
)
