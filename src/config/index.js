/* eslint-disable  import/prefer-default-export */

import { getEnv } from '../utils/utils'

// const localhostIP = '192.168.86.24'
// console.log('env in config:', getEnv())
// console.log('window.location:', window.location)
// console.log('process.env:', process.env)
const localhostIP = '127.0.0.1'
const RemoteAppPort = '3100'

const conf = {
  development: {
    BASE_URL: `http://${localhostIP}:3101/`,
    // BASE_URL: 'https://ylhsjc593d.execute-api.ca-central-1.amazonaws.com/Prod/',
    CSV_DOWNLOAD_URL: `http://${localhostIP}:3101/`,
    FUELSALES_DWNLD_URL: `http://${localhostIP}:3011/fuel-sale/xlsx`,
    // DOMAIN_ID: 'local.gales.sales',
    REPORT_URL: `http://${localhostIP}:3102/`,
    VALIDATE_URL: `http://${localhostIP}:3003/validate`,
  },
  production: {
    BASE_URL: 'https://ylhsjc593d.execute-api.ca-central-1.amazonaws.com/Prod/',
    CSV_DOWNLOAD_URL: '/api-csv-dwnld/',
    FUELSALES_DWNLD_URL: '/api-fuelsales-rpt/fuel-sale/xlsx',
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
