import {
  action,
  createRequestTypes,
} from '../../../../utils/actions'

export const CONFIG = createRequestTypes('CONFIG')
export const CONFIG_PERSIST = createRequestTypes('CONFIG_PERSIST')

export const configEntity = {
  request: request => action(CONFIG.REQUEST, { request }),
  success: response => action(CONFIG.SUCCESS, { response }),
  failure: error => action(CONFIG.FAILURE, { error }),
}

export const persistConfigEntity = {
  request: request => action(CONFIG_PERSIST.REQUEST, { request }),
  success: response => action(CONFIG_PERSIST.SUCCESS, { response }),
  failure: error => action(CONFIG_PERSIST.FAILURE, { error }),
}

export const fetchConfig = params => action(CONFIG.REQUEST, { params })
export const persistConfig = params => action(CONFIG_PERSIST.REQUEST, { params })
