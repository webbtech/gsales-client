/* eslint-disable  import/prefer-default-export */

import { getEnv } from '../utils/utils'

// const localhostIP = '192.168.86.24'
// console.log('env in config:', getEnv())
// console.log('window.location:', window.location)
// console.log('process.env:', process.env)
const localhostIP = '127.0.0.1'

const conf = {
  development: {
    // AUTH_RESET_URL: `http://${localhostIP}:3102/`,
    BASE_URL: `http://${localhostIP}:3101/`,
    CSV_DOWNLOAD_URL: `http://${localhostIP}:3101/`,
    FUELSALES_DWNLD_URL: `http://${localhostIP}:3011/fuel-sale/xlsx`,
    DOMAIN_ID: 'local.gales.sales',
    // LOGIN_URL: `http://${localhostIP}:3001/login`,
    REPORT_URL: `http://${localhostIP}:3102/`,
    VALIDATE_URL: `http://${localhostIP}:3003/validate`,
  },
  production: {
    AUTH_RESET_URL: '/api-reset/',
    BASE_URL: '/api/',
    CSV_DOWNLOAD_URL: '/api-csv-dwnld/',
    DOMAIN_ID: 'ca.gales.sales',
    FUELSALES_DWNLD_URL: '/api-fuelsales-rpt/fuel-sale/xlsx',
    LOGIN_URL: '/api-login/login',
    REPORT_URL: '/api-report/',
    VALIDATE_URL: '/validate',
  },
  stage: {
    AUTH_RESET_URL: '/api-reset/',
    BASE_URL: '/api/',
    CSV_DOWNLOAD_URL: '/api-csv-dwnld/',
    DOMAIN_ID: 'ca.gales.sales',
    LOGIN_URL: '/api-login/login',
    REPORT_URL: '/api-report/',
    VALIDATE_URL: '/validate',
  },
}

export const config = conf[getEnv()]

// export const LOCAL_IP_PORT = config.BASE_URL
