import {
  action,
  createRequestTypes,
} from '../../../../utils/actions'

export const PRODUCT = createRequestTypes('PRODUCT')
export const PRODUCTS = createRequestTypes('PRODUCTS')
export const PRODUCT_PERSIST = createRequestTypes('PRODUCT_PERSIST')

export const productsEntity = {
  request: products => action(PRODUCTS.REQUEST, { products }),
  success: response => action(PRODUCTS.SUCCESS, { response }),
  failure: error => action(PRODUCTS.FAILURE, { error }),
}

export const persistProductEntity = {
  request: product => action(PRODUCT_PERSIST.REQUEST, { product }),
  success: response => action(PRODUCT_PERSIST.SUCCESS, { response }),
  failure: error => action(PRODUCT_PERSIST.FAILURE, { error }),
}

export const fetchProducts = () => action(PRODUCTS.REQUEST, {})
export const setCurrentProduct = productID => action(PRODUCT.REQUEST, { productID })
export const persistProduct = params => action(PRODUCT_PERSIST.REQUEST, { params })
