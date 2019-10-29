import {
  all,
  put,
  call,
  take,
  takeLatest,
} from 'redux-saga/effects'

import { callApi } from '../../saga/api'
import { Schemas } from '../../services/api'
import * as salesActions from './actions'
import * as alertActions from '../alert/actions'
import { fetchJournals } from '../journal/actions'

// ============================== Fetch Day ==================================================== //

export function* fetchDay(stationID, params) {
  let endpoint = 'sales'
  if (Object.prototype.hasOwnProperty.call(params, 'lastDay')) {
    endpoint += '/lastDay'
  }
  endpoint += `?stationID=${stationID}`
  if (Object.prototype.hasOwnProperty.call(params, 'date')) {
    endpoint += `&date=${params.date}`
  }
  if (Object.prototype.hasOwnProperty.call(params, 'populate')) {
    endpoint += '&populate=true'
  }
  const { daySalesEntity } = salesActions
  yield call(callApi, daySalesEntity, endpoint, Schemas.DAYSALES_ARRAY)
}

function* watchFetchDay() {
  while (true) {
    const { stationID, params = {} } = yield take(salesActions.DAYSALES.REQUEST)
    yield fetchDay(stationID, params)
  }
}

// ============================== Fetch Shift Sales ============================================ //

export function* fetchShiftSales({ shiftID, stationID, recordNum }) {
  const endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  const { shiftEntity } = salesActions
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)

  // Fetch journal entries at this time
  yield put(fetchJournals({ recordNum, stationID }))
}

function* watchShiftSales() {
  while (true) {
    const { params } = yield take(salesActions.SHIFT_SALES.REQUEST)
    yield fetchShiftSales(params)
  }
}

// ============================== Shift Patch ================================================== //

export function* shiftPatch({
  params: {
    action,
    actionArgs,
    recordNum,
    shiftID,
    stationID,
  },
}) {
  if (!action) {
    const msg = 'Missing action parameter in shiftPatch'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in shiftPatch'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { shiftEntity, shiftPatchEntity } = salesActions
  let endpoint
  let apiParams

  switch (action) {
    case 'patchShift': {
      endpoint = `sale/${shiftID}`
      apiParams = {
        method: 'PATCH',
        body: actionArgs,
      }
      yield call(callApi, shiftPatchEntity, endpoint, Schemas.SHIFT, apiParams)

      endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
      yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
      yield put(alertActions.alertSend({ message: 'Shift successfully updated', type: 'success', dismissAfter: 2000 }))
      break
    }

    case 'closeShift':
      endpoint = `sale/${shiftID}`
      apiParams = {
        method: 'PATCH',
        body: actionArgs,
      }
      yield call(callApi, shiftPatchEntity, endpoint, Schemas.SHIFT, apiParams)

      // Now reload shift data
      endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
      yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
      yield put(alertActions.alertSend({ message: 'Shift successfully closed', type: 'success', dismissAfter: 2000 }))
      break

    default:
      break
  }
}

function* watchShiftPatch() {
  yield takeLatest(salesActions.SHIFT_PATCH.REQUEST, shiftPatch)
}

// ============================== Shift Action ================================================= //

export function* shiftAction({
  params: {
    action,
    date,
    employeeID,
    stationID,
  },
}) {
  if (!action) {
    const msg = 'Missing action parameter in shiftAction'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID param in shiftAction'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  if (action === 'create') {
    if (!employeeID) {
      const msg = 'Missing employeeID param in shiftAction'
      yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
      return
    }
    if (!date) {
      const msg = 'Missing date param in shiftAction'
      yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
      return
    }

    const endpoint = 'sale-shift'
    const { shiftActionEntity } = salesActions
    const apiParams = {
      method: 'POST',
      body: {
        date,
        employeeID,
        stationID,
      },
    }
    yield call(callApi, shiftActionEntity, endpoint, Schemas.NEW_SHIFT, apiParams)

    const dayParams = {
      lastDay: true,
      populate: true,
    }
    yield put(salesActions.loadShiftSales(stationID, dayParams))

    // Just grabbing the success of the last request above and extracting the info
    // to select the shift
    const res = yield take(salesActions.DAYSALES.SUCCESS)
    const shiftIdx = res.response.result[res.response.result.length - 1]
    const lastShift = res.response.entities.shifts[shiftIdx]
    const shiftParams = {
      shiftID: lastShift.id,
      stationID: lastShift.stationID.id,
      recordNum: lastShift.recordNum,
    }
    yield put(salesActions.loadShift(shiftParams))
  } else if (action === 'delete') {
    const endpoint = `sale-shift?stationID=${stationID}`
    const { shiftActionEntity } = salesActions
    const apiParams = {
      method: 'DELETE',
    }
    yield call(callApi, shiftActionEntity, endpoint, null, apiParams)

    const dayParams = {
      lastDay: true,
      populate: true,
    }
    yield put(salesActions.loadShiftSales(stationID, dayParams))
  }
}

function* watchShiftAction() {
  yield takeLatest(salesActions.SHIFT_ACTION.REQUEST, shiftAction)
}

// ============================== Save Fuel Sales Action ======================================= //

export function* persistFuelSales({
  params: {
    fuelSales,
    stationID,
    shiftID,
    recordNum,
  },
}) {
  if (!fuelSales) {
    const msg = 'Missing fuelSales parameter in persistFuelSales'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistFuelSales'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in persistFuelSales'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistFuelSales'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { persistFuelSalesEntity, shiftEntity } = salesActions
  const fsAr = Object.values(fuelSales)
  let endpoint = 'fuel-sales'
  const apiParams = {
    method: 'PUT',
    body: fsAr,
  }
  yield call(callApi, persistFuelSalesEntity, endpoint, Schemas.SHIFT, apiParams)

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
  yield put(alertActions.alertSend({ message: 'Fuel Sales successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchSaveFuelSales() {
  yield takeLatest(salesActions.FUEL_SALE_SAVE.REQUEST, persistFuelSales)
}

// ============================== Save Fuel Sales Adjustment Action ============================ //

export function* persistFuelSalesAdjustment({
  params: {
    dispenserID,
    recordNum,
    shiftID,
    stationID,
    values,
  },
}) {
  if (!dispenserID) {
    const msg = 'Missing dispenserID parameter in persistFuelSalesAdjustment'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistFuelSalesAdjustment'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in persistFuelSalesAdjustment'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistFuelSalesAdjustment'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!values) {
    const msg = 'Missing values parameter in persistFuelSalesAdjustment'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { persistFuelSaleAdjustmentEntity, shiftEntity } = salesActions
  let endpoint = 'fuel-sales-opening'
  const apiParams = {
    method: 'PUT',
    body: {
      stationID,
      recordNum,
      dispenserID,
      values,
    },
  }
  yield call(callApi, persistFuelSaleAdjustmentEntity, endpoint, Schemas.FUEL_SALE, apiParams)

  // Refetch journal entries
  yield put(fetchJournals({ recordNum, stationID }))

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
  yield put(alertActions.alertSend({ message: 'Fuel Sale adjustment successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchFuelSalesAdjustment() {
  yield takeLatest(salesActions.FUEL_SALE_ADJUST.REQUEST, persistFuelSalesAdjustment)
}

// ============================== Save Dispenser Reset Action ================================== //

export function* persistResetDispenser({
  params: {
    dispenserID,
    recordNum,
    shiftID,
    stationID,
    values,
  },
}) {
  if (!dispenserID) {
    const msg = 'Missing dispenserID parameter in persistResetDispenser'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistResetDispenser'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in persistResetDispenser'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistResetDispenser'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!values) {
    const msg = 'Missing values parameter in persistResetDispenser'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { persistDispenserResetEntity, shiftEntity } = salesActions
  let endpoint = 'fuel-sales-reset'
  const apiParams = {
    method: 'PUT',
    body: {
      stationID,
      recordNum,
      dispenserID,
      values,
    },
  }
  yield call(callApi, persistDispenserResetEntity, endpoint, Schemas.FUEL_SALE, apiParams)

  // Refetch journal entries
  yield put(fetchJournals({ recordNum, stationID }))

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
  yield put(alertActions.alertSend({ message: 'Dispenser reset successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchResetDispenser() {
  yield takeLatest(salesActions.RESET_DISPENSER.REQUEST, persistResetDispenser)
}

// ============================== Save NonFuel Misc Action ===================================== //

export function* persistNonFuelMisc({
  params: {
    items,
    recordNum,
    shiftID,
    stationID,
  },
}) {
  if (!items) {
    const msg = 'Missing items parameter in persistNonFuelMisc'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistNonFuelMisc'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in persistNonFuelMisc'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistNonFuelMisc'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { persistNonFuelMiscEntity, shiftEntity } = salesActions
  let endpoint = `non-fuel-sale-misc/${shiftID}`
  const apiParams = {
    method: 'PUT',
    body: {
      items,
    },
  }
  yield call(callApi, persistNonFuelMiscEntity, endpoint, Schemas.SHIFT, apiParams)

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)

  yield put(alertActions.alertSend({ message: 'Non-fuel items successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchSaveNonFuelMisc() {
  yield takeLatest(salesActions.NON_FUEL_MISC_SAVE.REQUEST, persistNonFuelMisc)
}

// ============================== Save NonFuel Products Action ================================= //

export function* persistNonFuelProducts({
  params: {
    products,
    recordNum,
    shiftID,
    stationID,
  },
}) {
  if (!products) {
    const msg = 'Missing products parameter in persistNonFuelProducts'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistNonFuelProducts'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in persistNonFuelProducts'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistNonFuelProducts'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  function cleanQty(qty) {
    const newObj = {}
    Object.keys(qty).forEach((k) => {
      newObj[k] = Number(qty[k])
    })
    return newObj
  }

  // Clean-up products array
  const ps = Object.values(products).map(p => ({ id: p.id, qty: cleanQty(p.qty), sales: p.sales }))

  const { persistNonFuelProductsEntity, shiftEntity } = salesActions
  let endpoint = `non-fuel-sale-products/${shiftID}`
  const apiParams = {
    method: 'PUT',
    body: {
      products: ps,
    },
  }
  yield call(callApi, persistNonFuelProductsEntity, endpoint, Schemas.SHIFT, apiParams)

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)

  yield put(alertActions.alertSend({ message: 'Products successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchSaveNonFuelProducts() {
  yield takeLatest(salesActions.NON_FUEL_PRODUCTS_SAVE.REQUEST, persistNonFuelProducts)
}

// ============================== Save NonFuel Product Adjustment Action ======================= //

export function* persistNonFuelProductAdjust({
  params: {
    description,
    nonFuelID,
    productID,
    recordNum,
    salesID,
    stationID,
    type,
    values,
  },
}) {
  if (!description) {
    const msg = 'Missing description parameter in persistNonFuelProductAdjust'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!nonFuelID) {
    const msg = 'Missing nonFuelID parameter in persistNonFuelProductAdjust'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!productID) {
    const msg = 'Missing productID parameter in persistNonFuelProductAdjust'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistNonFuelProductAdjust'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!salesID) {
    const msg = 'Missing salesID parameter in persistNonFuelProductAdjust'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistNonFuelProductAdjust'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!type) {
    const msg = 'Missing type parameter in persistNonFuelProductAdjust'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!values) {
    const msg = 'Missing values parameter in persistNonFuelProductAdjust'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { persistNonFuelProductAdjustEntity, shiftEntity } = salesActions
  let endpoint = `non-fuel-sale/${salesID}`
  const apiParams = {
    method: 'PATCH',
    body: {
      description,
      nonFuelSaleID: nonFuelID,
      productID,
      values,
    },
  }
  yield call(callApi, persistNonFuelProductAdjustEntity, endpoint, Schemas.SHIFT, apiParams)

  // Refetch journal entries
  yield put(fetchJournals({ recordNum, stationID }))

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${salesID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
  yield put(alertActions.alertSend({ message: 'Product adjustment successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchSaveNonFuelProductAdjust() {
  yield takeLatest(salesActions.NON_FUEL_PRODUCT_ADJUST.REQUEST, persistNonFuelProductAdjust)
}

// ============================== Save Shift Summary Action ==================================== //

function* persistShiftSummary({
  params: {
    items,
    recordNum,
    shiftID,
    stationID,
  },
}) {
  if (!items) {
    const msg = 'Missing items parameter in persistNonFuelProducts'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistNonFuelProducts'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in persistNonFuelProducts'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistNonFuelProducts'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { persistShiftSummaryEntity, shiftEntity } = salesActions
  let endpoint = `sale/${shiftID}`
  const apiParams = {
    method: 'PUT',
    body: {
      items,
    },
  }
  yield call(callApi, persistShiftSummaryEntity, endpoint, Schemas.SHIFT, apiParams)

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
  yield put(alertActions.alertSend({ message: 'Shift summary successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchSaveShiftSummary() {
  yield takeLatest(salesActions.SHIFT_SUMMARY.REQUEST, persistShiftSummary)
}

// ============================== Patch Shift Summary Action =================================== //

function* patchShiftSummary({
  params: {
    adjustment,
    recordNum,
    shift,
    stationID,
  },
}) {
  if (!adjustment) {
    const msg = 'Missing adjustment parameter in patchShiftSummary'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in patchShiftSummary'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shift) {
    const msg = 'Missing shift parameter in patchShiftSummary'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in patchShiftSummary'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const shiftID = shift.id
  const { patchShiftSummaryEntity, shiftEntity } = salesActions
  let endpoint = `sale-summary/${shiftID}`
  const apiParams = {
    method: 'PATCH',
    body: {
      adjustment,
      shift,
    },
  }
  yield call(callApi, patchShiftSummaryEntity, endpoint, Schemas.SHIFT, apiParams)

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
  yield put(alertActions.alertSend({ message: 'Shift summary successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchPatchShiftSummary() {
  yield takeLatest(salesActions.SHIFT_SUMMARY_PATCH.REQUEST, patchShiftSummary)
}

// ============================== Save Attendant Action ======================================== //

function* persistAttendant({
  params: {
    attendant,
    recordNum,
    shiftID,
    stationID,
  },
}) {
  if (!attendant) {
    const msg = 'Missing attendant parameter in persistAttendant'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistAttendant'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in persistAttendant'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistAttendant'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { persistAttendantEntity, shiftEntity } = salesActions
  let endpoint = `sale-attendant/${shiftID}`
  const apiParams = {
    method: 'PUT',
    body: {
      ...attendant,
    },
  }
  yield call(callApi, persistAttendantEntity, endpoint, Schemas.SHIFT, apiParams)

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)

  yield put(alertActions.alertSend({ message: 'Attendant details successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchSaveAttendant() {
  yield takeLatest(salesActions.ATTENDANT_SAVE.REQUEST, persistAttendant)
}

// ============================== Save OtherFuel Action ======================================= //

function* persistOtherFuel({
  params: {
    dollar,
    litre,
    recordNum,
    shiftID,
    stationID,
  },
}) {
  if (!dollar) {
    const msg = 'Missing dollar parameter in persistOtherFuel'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!litre) {
    const msg = 'Missing litre parameter in persistOtherFuel'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!stationID) {
    const msg = 'Missing stationID parameter in persistOtherFuel'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!shiftID) {
    const msg = 'Missing shiftID parameter in persistOtherFuel'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }
  if (!recordNum) {
    const msg = 'Missing recordNum parameter in persistOtherFuel'
    yield put(alertActions.alertSend({ message: msg, type: 'danger' }))
    return
  }

  const { persistOtherFuelEntity, shiftEntity } = salesActions
  let endpoint = `sale-otherfuel/${shiftID}`
  const apiParams = {
    method: 'PUT',
    body: {
      values: {
        fuel: 'propane',
        otherDollar: dollar,
        otherLitre: litre,
      },
    },
  }
  yield call(callApi, persistOtherFuelEntity, endpoint, Schemas.SHIFT, apiParams)

  // Now reload shift data
  endpoint = `sales/shiftSales?shiftID=${shiftID}&stationID=${stationID}&recordNum=${recordNum}`
  yield call(callApi, shiftEntity, endpoint, Schemas.SHIFT_SALES)
  yield put(alertActions.alertSend({ message: 'Propane sales successfully saved', type: 'success', dismissAfter: 2000 }))
}

function* watchSaveOtherFuel() {
  yield takeLatest(salesActions.OTHER_FUEL_SAVE.REQUEST, persistOtherFuel)
}

// ============================== Root Saga ==================================================== //

export default function* rootSaga() {
  yield all([
    watchFetchDay(),
    watchFuelSalesAdjustment(),
    watchPatchShiftSummary(),
    watchResetDispenser(),
    watchSaveAttendant(),
    watchSaveFuelSales(),
    watchSaveNonFuelMisc(),
    watchSaveNonFuelProductAdjust(),
    watchSaveNonFuelProducts(),
    watchSaveOtherFuel(),
    watchSaveShiftSummary(),
    watchShiftAction(),
    watchShiftPatch(),
    watchShiftSales(),
  ])
}
