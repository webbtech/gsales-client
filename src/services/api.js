import { schema, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'

import { config as cfg } from '../config'


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


// const salesReportSchema = new schema.Entity('record')
// const fuelSales = new schema.Entity('fuelSales')
// const nonFuelSales = new schema.Entity('nonFuelSales')
// const reportData = new schema.Entity('reportData')
const newShift = {
  configSchema,
  shiftSchema,
  stationSchema,
}
const reports = {
  reportSchema,
  // keys: arrayOf(reportData),
}
const salesReport = {
  // keys: arrayOf(salesReportschema),
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
  SALES_REPORTS: salesReport,
  REPORT_DETAIL: reportSchema,
  SHIFT: shiftSchema,
  SHIFT_SALES: shiftSalesSchema,
  STATION: stationSchema,
  STATION_ARRAY: new schema.Array(stationsSchema),
}

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
export default function api(endpoint, requestSchema, params = {}) {
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
    console.error('Missing valid method') // eslint-disable-line
    return 'ERROR' // TODO: need to handle this better
  }
  ps.method = method

  // get token from local storage
  const token = localStorage.getItem('userToken')
  if (!token) {
    console.error('Missing token in services.api') // eslint-disable-line
    return 'ERROR' // TODO: need to handle this better
  }

  // TODO: perhaps we need to join to existing default headers
  // that way we can just add and authorization header to default
  if (headers) {
    ps.headers = headers
  } else {
    ps.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
      // Authorization: `Bearer ${token}`,
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
      // console.log('fetch result:', camelizedJson)
      // const nextPageUrl = getNextPageUrl(response)
      // console.log('json: ', camelizedJson)

      if (method === 'DELETE') {
        return Object.assign({}, response, response)
      }
      return Object.assign({}, normalize(camelizedJson, requestSchema))
    })
    .then(
      response => ({ response }),
      (error) => {
        console.log('error in fetch: ', error) // eslint-disable-line no-console
        return ({ error })
        // If not authorized, redirect to login
        // todo: should add path to redirect here
        /* if (error.statusCode === 401) {
          browserHistory.push('/auth/')
        } else {
          return ({ error })
        } */
      }
    )
}
