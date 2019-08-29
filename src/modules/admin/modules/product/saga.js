import {
  all,
  put,
  call,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'

import { callApi } from '../../../../saga/api'
import { Schemas } from '../../../../services/api'
import * as productActions from './actions'
import * as alertActions from '../../../alert/actions'

export function* productsList() {
  const { productsEntity } = productActions
  yield call(callApi, productsEntity, 'products', Schemas.PRODUCT_ARRAY)
}

export function* productPersist({ params: { productID, values } }) {
  const { productsEntity, persistProductEntity } = productActions

  const endpoint = productID ? `product/${productID}` : 'product'
  const apiParams = {
    method: productID ? 'PUT' : 'POST',
    body: { ...values },
  }

  yield call(callApi, persistProductEntity, endpoint, Schemas.PRODUCT, apiParams)
  yield call(callApi, productsEntity, 'products', Schemas.PRODUCT_ARRAY)
  yield put(alertActions.alertSend({ message: 'Product successfully saved', type: 'success', dismissAfter: 2000 }))
}

export function* watchProductList() {
  yield takeEvery(productActions.PRODUCTS.REQUEST, productsList)
}

export function* watchProductPersist() {
  yield takeLatest(productActions.PRODUCT_PERSIST.REQUEST, productPersist)
}

export default function* rootSaga() {
  yield all([
    watchProductList(),
    watchProductPersist(),
  ])
}
