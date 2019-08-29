export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

export const action = (type, payload = {}) => ({ type, ...payload })

export const createRequestTypes = (base) => {
  const res = {};
  [REQUEST, SUCCESS, FAILURE].forEach((type) => { res[type] = `${base}_${type}` })
  return res
}
