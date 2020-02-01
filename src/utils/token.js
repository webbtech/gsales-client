/**
 * Module returns valid cognito token
 *
 * Inspiration for this found here https://stackoverflow.com/questions/53375350/how-handle-refresh-token-service-in-aws-amplify-js
 * Docs for amazon-cognito-identity-js https://www.npmjs.com/package/amazon-cognito-identity-js
 */
import { CognitoUserPool } from 'amazon-cognito-identity-js'

import { LOCAL_TOKEN_KEY } from '../config/constants'

/**
 * Get current user session.
 *
 * @param {object} cognitoUser session
 */
function getSession(cognitoUser) {
  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err, session) => {
      if (err) reject(err)
      resolve(session)
    })
  })
}

/**
 * Refresh user session
 *
 * @param {object} cognitoUser
 * @param {object} session
 */
function refreshSession(cognitoUser, session) {
  return new Promise((resolve, reject) => {
    const refreshToken = session.getRefreshToken()
    cognitoUser.refreshSession(refreshToken, (err, refSession) => {
      if (err) reject(err)
      resolve(refSession)
    })
  })
}

/**
 * Parse local token.
 *
 * Token is stored in localStorage.
 *
 * @returns {object|bool} parsed token or false
 */
function parseLocalToken() {
  const localToken = window.localStorage.getItem(LOCAL_TOKEN_KEY)
  if (!localToken) return false
  return JSON.parse(atob(localToken.split('.')[1]))
}

/**
 * Refresh token.
 *
 * Refresh token if about to expire, or return current token.
 *
 * @returns {string} cognito token
 */
export default async function getToken() {
  const storage = window.localStorage

  const now = Math.floor(new Date() / 1000)
  const expireBuffer = 60 * 5
  const cutoffTime = now + expireBuffer

  const tokenObj = parseLocalToken()
  if (tokenObj && cutoffTime < tokenObj.exp) {
    console.log('returning local token') // eslint-disable-line no-console
  }
  if (tokenObj && cutoffTime < tokenObj.exp) return storage.getItem(LOCAL_TOKEN_KEY)

  const poolData = {
    UserPoolId: process.env.REACT_APP_COGNITO_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  }
  const userPool = new CognitoUserPool(poolData)
  const cognitoUser = userPool.getCurrentUser()

  const session = await getSession(cognitoUser)
  // const expire = session.idToken.payload.exp
  // console.log('time to expire:', expire - now)
  // console.log('time to reset token:', expire - cutoffTime)
  // if (tokenObj && cutoffTime < expire) return storage.getItem(LOCAL_TOKEN_KEY)

  const rSession = await refreshSession(cognitoUser, session)
  const userToken = rSession.accessToken.jwtToken
  storage.setItem('userToken', userToken)
  console.log('userToken refreshed') // eslint-disable-line no-console

  return userToken
}
