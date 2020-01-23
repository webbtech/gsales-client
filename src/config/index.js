/* eslint-disable  import/prefer-default-export */

import { getEnv } from '../utils/utils'

const localhostIP = '127.0.0.1'
const localAppPort = '3101'

const conf = {
  development: {
    BASE_URL: `http://${localhostIP}:${localAppPort}/`,
  },
  production: {
    BASE_URL: 'https://api-prod.gsales.pfapi.io/',
  },
  stage: {
    BASE_URL: 'https://api-stage.gsales.pfapi.io/',
  },
}

export const config = conf[getEnv()]
