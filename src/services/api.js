import { schema, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import * as Sentry from '@sentry/browser'

import { config as cfg } from '../config'
import getToken from '../utils/token'

const configSchema = new schema.Entity('config')
const daySalesSchema = new schema.Entity('shifts', {
  idAttribute: 'id',
})
const dispensersSchema = new schema.Entity('items', {
  idAttribute: 'id',
})
const employeeSchema = new schema.Entity('employee')
const employeesSchema = new schema.Entity('items', {
  idAttribute: 'id',
})
const fuelDefinitionsSchema = new schema.Entity('fuelDefinitions')
const fuelSaleSchema = new schema.Entity('fuelSale')
const nonFuelSaleSchema = new schema.Entity('nonFuelSale')
const productSchema = new schema.Entity('product')
const productsSchema = new schema.Entity('items', {
  idAttribute: 'id',
})
const recordsSchema = new schema.Entity('records')
const reportSchema = new schema.Entity('report')
const shiftSchema = new schema.Entity('shift', {
  idAttribute: 'id',
})
const shiftSalesSchema = {
  shiftSchema,
  fuelSales: new schema.Array(fuelSaleSchema),
  nonFuelSales: new schema.Array(nonFuelSaleSchema),
  fuelDefinitions: new schema.Array(fuelDefinitionsSchema),
}
const stationSchema = new schema.Entity('station')
const stationsSchema = new schema.Entity('items', {
  idAttribute: 'name',
})

const newShift = {
  configSchema,
  shiftSchema,
  stationSchema,
}
const reports = {
  reportSchema,
}

/**
 * Error Response
 *
 * Logs errors and returns object with error response
 * @param {string} errString
 */
function errorResponse(errString) {
  console.error(errString) // eslint-disable-line
  Sentry.captureMessage(errString)
  return {
    response: null,
    error: new Error(`Error: ${errString}`),
  }
}

export const Schemas = {
  CONFIG: configSchema,
  DAYSALES: daySalesSchema,
  DAYSALES_ARRAY: new schema.Array(daySalesSchema),
  DEFAULTS: new schema.Array(recordsSchema),
  DISPENSERS: new schema.Array(dispensersSchema),
  EMPLOYEE: employeeSchema,
  EMPLOYEE_ARRAY: new schema.Array(employeesSchema),
  FUEL_SALE: fuelSaleSchema,
  NEW_SHIFT: newShift,
  PRODUCT: productSchema,
  PRODUCT_ARRAY: new schema.Array(productsSchema),
  REPORTS: reports,
  REPORT_DETAIL: reportSchema,
  SHIFT: shiftSchema,
  SHIFT_SALES: shiftSalesSchema,
  STATION: stationSchema,
  STATION_ARRAY: new schema.Array(stationsSchema),
}

/**
 * API Fetcher
 *
 * Fetches an API response and normalizes the result JSON according to schema.
 * This makes every API response have the same shape, regardless of how nested it was.
 *
 * @param {string} endpoint
 * @param {object} requestSchema
 * @param {object} params
 */
export default async function api(endpoint, requestSchema, params = {}) {
  const ps = {}

  const fullUrl = (endpoint.indexOf(cfg.BASE_URL) === -1) ? cfg.BASE_URL + endpoint : endpoint
  const { headers, body } = params
  let { method } = params
  if (typeof method === 'undefined') {
    method = 'GET'
  }
  const t = /^(DELETE|GET|POST|PUT|PATCH|DELETE)$/i.test(method)
  method = method.toUpperCase()
  if (!t) {
    return errorResponse('Missing valid method')
  }
  ps.method = method

  // const token = await getToken()
  let token
  try {
    token = await getToken()
  } catch (err) {
    return errorResponse(err)
  }
  // return false
  if (!token) {
    return errorResponse('Missing token in services.api')
  }
  // return

  // TODO: perhaps we need to join to existing default headers
  // that way we can just add and authorization header to default
  if (headers) {
    ps.headers = headers
  } else {
    ps.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    }
  }

  if (body && Object.keys(body).length) {
    ps.body = JSON.stringify(body)
  }

  return fetch(fullUrl, ps)
    .then(response => response.json()
      .then(json => ({ json, response })))
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      const camelizedJson = camelizeKeys(json)

      if (method === 'DELETE') {
        return Object.assign({}, response, response)
      }
      return Object.assign({}, normalize(camelizedJson, requestSchema))
    })
    .then(
      response => ({ response }),
      (error) => {
        Sentry.captureMessage(`${error} - ${fullUrl}`)
        console.log('error in fetch: ', error) // eslint-disable-line no-console
        return ({ error })
      }
    )
}
