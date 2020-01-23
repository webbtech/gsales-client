/* eslint-disable  import/prefer-default-export */

import { getEnv } from '../utils/utils'

const localhostIP = '127.0.0.1'
const localAppPort = '3101'

const conf = {
  development: {
    BASE_URL: `http://${localhostIP}:${localAppPort}/`,
  },
  production: {
    BASE_URL: 'https://ylhsjc593d.execute-api.ca-central-1.amazonaws.com/Prod/',
  },
}

export const config = conf[getEnv()]
