import {
  action,
  createRequestTypes,
} from '../../utils/actions'

export const SHIFT_HISTORY = createRequestTypes('SHIFT_HISTORY')

export const shiftHistoryEntity = {
  request: request => action(SHIFT_HISTORY.REQUEST, { request }),
  success: response => action(SHIFT_HISTORY.SUCCESS, { response }),
  failure: error => action(SHIFT_HISTORY.FAILURE, { error }),
}

export const fetchShiftHistory = params => action(SHIFT_HISTORY.REQUEST, { params })
