export const ALERT_SEND = 'ALERT_SEND'
export const ALERT_DISMISS = 'ALERT_DISMISS'
export const ALERT_CLEAR = 'ALERT_CLEAR'

/**
 * Publish an alert,
 * if dismissAfter was set, the notification will be auto dismissed after the given period.
 * if id wasn't specified, a time based id will be generated.
 */
export function alertSend(alert) {
  if (!alert.id) {
    alert.id = new Date().getTime() // eslint-disable-line no-param-reassign
    // console.log('setting id on alert:', alert.id)
  }
  return (dispatch) => {
    dispatch({ type: ALERT_SEND, payload: alert })

    if (alert.dismissAfter) {
      setTimeout(() => { dispatch({ type: ALERT_DISMISS, payload: alert.id }) }, alert.dismissAfter)
    }
  }
}

/**
 * Dismiss an alert by the given id.
 */
export function alertDismiss(id) {
  // console.log('id in alertDismiss:', id)
  return { type: ALERT_DISMISS, payload: id }
}

/**
 * Clear all alerts
 */
export function alertClear() {
  return { type: ALERT_CLEAR }
}
