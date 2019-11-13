import {
  all,
  call,
  put,
  take,
} from 'redux-saga/effects'

import { callApi } from '../../saga/api'
import { Schemas } from '../../services/api'
import * as alertActions from '../alert/actions'
import * as reportActions from './actions'
import {
  REPORT_ATTENDANT,
  REPORT_MONTHLY_SALES,
  REPORT_OIL_PRODUCT_SALES,
  REPORT_PRODUCT_SALES,
  REPORT_PRODUCT_SALES_ADJUSTMENTS,
  REPORT_SHIFTS,
  REPORT_SHIFT_HISTORY,
} from './constants'

// ============================== Attendant Report ============================================= //

function* fetchAttendant({
  employeeID,
  dates,
}) {
  if (!employeeID) {
    const msg = 'Missing employeeID parameter in fetchAttendant'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!dates) {
    const msg = 'Missing dates parameter in fetchAttendant'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { attendantEntity } = reportActions
  const apiParams = {
    method: 'GET',
    reportID: REPORT_ATTENDANT,
  }

  let endpoint = `report/attendant?employeeID=${employeeID}&reportID=${REPORT_ATTENDANT}`
  Object.keys(dates).forEach((key) => {
    if (dates[key] !== '') {
      endpoint += `&${key}=${dates[key]}`
    }
  })
  yield call(callApi, attendantEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchAttendant() {
  while (true) {
    const { params } = yield take(reportActions.ATTENDANT.REQUEST)
    yield fetchAttendant(params)
  }
}

// ============================== Monthly Sales Report ========================================= //

function* fetchMonthlySales({ date }) {
  const { monthlyEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/monthly-sales?date=${date}&reportID=${REPORT_MONTHLY_SALES}`
  yield call(callApi, monthlyEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchMonthlySales() {
  while (true) {
    const { params } = yield take(reportActions.MONTHLY_SALES.REQUEST)
    yield fetchMonthlySales(params)
  }
}

// ============================== Monthly Cash Report ========================================== //

function* fetchMonthlyCash({ date }) {
  const { monthlyCashEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/monthly-cash?date=${date}`
  yield call(callApi, monthlyCashEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchMonthlyCash() {
  while (true) {
    const { params } = yield take(reportActions.MONTHLY_CASH.REQUEST)
    yield fetchMonthlyCash(params)
  }
}

// ============================== Monthly NonFuel Report ======================================= //

function* fetchMonthlyNonFuel({ date }) {
  const { monthlyNonFuelEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/monthly-non-fuel?date=${date}`
  yield call(callApi, monthlyNonFuelEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchMonthlyNonFuel() {
  while (true) {
    const { params } = yield take(reportActions.MONTHLY_NON_FUEL.REQUEST)
    yield fetchMonthlyNonFuel(params)
  }
}

// ============================== Monthly Fuel Report ========================================== //

function* fetchMonthlyFuel({ date }) {
  const { monthlyFuelEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/monthly-fuel?date=${date}`
  yield call(callApi, monthlyFuelEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchMonthlyFuel() {
  while (true) {
    const { params } = yield take(reportActions.MONTHLY_FUEL.REQUEST)
    yield fetchMonthlyFuel(params)
  }
}

// ============================== Monthly Station Report ======================================= //

function* fetchMonthlyStation({ date, stationID }) {
  const { monthlyStationEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/monthly-station?date=${date}&stationID=${stationID}`
  yield call(callApi, monthlyStationEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchMonthlyStation() {
  while (true) {
    const { params } = yield take(reportActions.MONTHLY_STATION.REQUEST)
    yield fetchMonthlyStation(params)
  }
}

// ============================== Monthly Station Summary Report =============================== //

function* fetchMonthlyStationSummary({ date }) {
  const { monthlyStationSummaryEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/monthly-station-summary?date=${date}`
  yield call(callApi, monthlyStationSummaryEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchStationSummary() {
  while (true) {
    const { params } = yield take(reportActions.MONTHLY_STATION_SUMMARY.REQUEST)
    yield fetchMonthlyStationSummary(params)
  }
}

// ============================== Oil Product Sales Report ===================================== //

function* fetchOilProductSales({ date, stationID }) {
  if (!date) {
    const msg = 'Missing date parameter in fetchOilProductSales'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in fetchOilProductSales'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { oilProductSalesEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/oil-product-sales?date=${date}&reportID=${REPORT_OIL_PRODUCT_SALES}&stationID=${stationID}`
  yield call(callApi, oilProductSalesEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchOilProductSales() {
  while (true) {
    const { params } = yield take(reportActions.OIL_PRODUCT_SALES.REQUEST)
    yield fetchOilProductSales(params)
  }
}

// ============================== Product Sales Report ========================================= //

function* fetchProductSales({ date, stationID }) {
  if (!date) {
    const msg = 'Missing date parameter in fetchProductSales'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in fetchProductSales'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { productSalesEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/product-sales?date=${date}&reportID=${REPORT_PRODUCT_SALES}&stationID=${stationID}`
  yield call(callApi, productSalesEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchProductSales() {
  while (true) {
    const { params } = yield take(reportActions.PRODUCT_SALES.REQUEST)
    yield fetchProductSales(params)
  }
}

// ============================== Product Sales Adjustments Report ============================= //

function* fetchProductSalesAdjustments({ date, stationID }) {
  if (!date) {
    const msg = 'Missing date parameter in fetchProductSalesAdjustments'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in fetchProductSalesAdjustments'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { productSalesAdjustmentsEntity } = reportActions
  const apiParams = {
    method: 'GET',
  }
  const endpoint = `report/product-sales-adjust?date=${date}&reportID=${REPORT_PRODUCT_SALES_ADJUSTMENTS}&stationID=${stationID}`
  yield call(callApi, productSalesAdjustmentsEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchProductSalesAdjustments() {
  while (true) {
    const { params } = yield take(reportActions.PRODUCT_SALES_ADJUSTMENTS.REQUEST)
    yield fetchProductSalesAdjustments(params)
  }
}

// ============================== Shifts Report ================================================ //

function* fetchShifts(
  {
    startDate,
    endDate,
    stationID,
  },
) {
  let endpoint = `report/shifts?reportID=${REPORT_SHIFTS}&startDate=${startDate}`
  if (endDate) {
    endpoint += `&endDate=${endDate}`
  }
  if (stationID) {
    endpoint += `&stationID=${stationID}`
  }

  const apiParams = {
    method: 'GET',
  }
  const { shiftsEntity } = reportActions

  yield call(callApi, shiftsEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchShifts() {
  while (true) {
    const { params } = yield take(reportActions.SHIFTS.REQUEST)
    yield fetchShifts(params)
  }
}

// ============================== Shift History Report ========================================= //

function* fetchShiftHistory(
  {
    startDate,
    endDate,
    stationID,
  },
) {
  let endpoint = `report/shift-history?reportID=${REPORT_SHIFT_HISTORY}&startDate=${startDate}`
  if (endDate) {
    endpoint += `&endDate=${endDate}`
  }
  if (stationID) {
    endpoint += `&stationID=${stationID}`
  }

  const apiParams = {
    method: 'GET',
  }
  const { shiftHistoryEntity } = reportActions

  yield call(callApi, shiftHistoryEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchShiftHistory() {
  while (true) {
    const { params } = yield take(reportActions.SHIFT_HISTORY.REQUEST)
    yield fetchShiftHistory(params)
  }
}

// ============================== Shift Report ================================================= //

function* fetchShift({ shiftID }) {
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in fetchShift'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const endpoint = `report/shift/${shiftID}`
  const apiParams = {
    method: 'GET',
  }
  const { shiftEntity } = reportActions

  yield call(callApi, shiftEntity, endpoint, Schemas.REPORTS, apiParams)
}

function* watchFetchShift() {
  while (true) {
    const { params } = yield take(reportActions.SHIFT.REQUEST)
    yield fetchShift(params)
  }
}

export default function* rootSaga() {
  yield all([
    watchFetchAttendant(),
    watchFetchMonthlyCash(),
    watchFetchMonthlyFuel(),
    watchFetchMonthlyNonFuel(),
    watchFetchMonthlySales(),
    watchFetchMonthlyStation(),
    watchFetchOilProductSales(),
    watchFetchProductSales(),
    watchFetchProductSalesAdjustments(),
    watchFetchShift(),
    watchFetchShiftHistory(),
    watchFetchShifts(),
    watchFetchStationSummary(),
  ])
}
