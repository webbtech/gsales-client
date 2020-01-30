/**
 * Module returns valid cognito token
 *
 * Found this at: https://stackoverflow.com/questions/53375350/how-handle-refresh-token-service-in-aws-amplify-js
 */
import { CognitoUserPool } from 'amazon-cognito-identity-js'

/**
 * Get current user session.
 *
 * @param {object} cognitoUser session
 */
function getSession(cognitoUser) {
  return new Promise((resolve) => {
    cognitoUser.getSession((err, session) => resolve(session))
  })
}

/**
 * Refresh user session
 *
 * @param {object} cognitoUser
 * @param {object} session
 */
function refreshSession(cognitoUser, session) {
  return new Promise((resolve) => {
    const refreshToken = session.getRefreshToken()
    cognitoUser.refreshSession(refreshToken, (refErr, refSession) => resolve(refSession))
  })
}

/**
 * Refresh token.
 *
 * Refreshes token if about to expire, or return current token.
 *
 * @returns {string} cognito token
 */
export default async function getToken() {
  const storage = window.localStorage
  const now = Math.floor(new Date() / 1000)
  const expireBuffer = 60 * 5
  const cutoffTime = now + expireBuffer

  const poolData = {
    UserPoolId: process.env.REACT_APP_COGNITO_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  }
  const userPool = new CognitoUserPool(poolData)
  const cognitoUser = userPool.getCurrentUser()

  const session = await getSession(cognitoUser)
  const expire = session.idToken.payload.exp
  // console.log('time to expire:', expire - now)
  // console.log('time to reset token:', expire - cutoffTime)
  if (cutoffTime < expire) return storage.getItem('userToken')

  const rSession = await refreshSession(cognitoUser, session)
  const userToken = rSession.accessToken.jwtToken
  storage.setItem('userToken', userToken)
  console.log('userToken refreshed') // eslint-disable-line no-console

  return userToken
}
