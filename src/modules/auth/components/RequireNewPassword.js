/* eslint-disable
  import/no-extraneous-dependencies,
  no-underscore-dangle,
  no-param-reassign,
  no-continue
*/

import React from 'react'

import { Auth } from 'aws-amplify'
import { JS, ConsoleLogger as Logger } from '@aws-amplify/core'

// import AppBar from '@material-ui/core/AppBar'
// import Button from '@material-ui/core/Button'
// import FormControl from '@material-ui/core/FormControl'
// import Input from '@material-ui/core/Input'
// import InputLabel from '@material-ui/core/InputLabel'
// import Paper from '@material-ui/core/Paper'
// import Typography from '@material-ui/core/Typography'
// import { withStyles } from '@material-ui/core/styles'

import AuthPiece from './AuthPiece'
// import { auth } from '../Amplify-UI/data-test-attributes'

const logger = new Logger('RequireNewPassword')

/* function convertToPlaceholder(str) {
  return str.split('_')
    .map(part => part.charAt(0).toUpperCase() + part.substr(1).toLowerCase())
    .join(' ')
} */

function objectWithProperties(obj, keys) {
  const target = {}
  for (const key in obj) { // eslint-disable-line no-restricted-syntax
    if (keys.indexOf(key) === -1) {
      continue
    }
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue
    }
    target[key] = obj[key]
  }
  return target
}

export default class RequireNewPassword extends AuthPiece {
  constructor(props) {
    super(props)

    this._validAuthStates = ['requireNewPassword']
    this.change = this.change.bind(this)
    this.checkContact = this.checkContact.bind(this)
  }

  checkContact(user) {
    if (!Auth || typeof Auth.verifiedContact !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported')
    }
    Auth.verifiedContact(user)
      .then((data) => {
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user)
        } else {
          user = Object.assign(user, data)
          this.changeState('verifyContact', user)
        }
      })
  }

  change() {
    const user = this.props.authData
    const { password } = this.inputs
    const { requiredAttributes } = user.challengeParam
    const attrs = objectWithProperties(this.inputs, requiredAttributes)

    if (!Auth || typeof Auth.completeNewPassword !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported')
    }
    Auth.completeNewPassword(user, password, attrs)
      .then((user) => { // eslint-disable-line no-shadow
        logger.debug('complete new password', user)
        if (user.challengeName === 'SMS_MFA') {
          this.changeState('confirmSignIn', user)
        } else if (user.challengeName === 'MFA_SETUP') {
          logger.debug('TOTP setup', user.challengeParam)
          this.changeState('TOTPSetup', user)
        } else {
          this.checkContact(user)
        }
      })
      .catch(err => this.error(err))
  }

  showComponent() {
    const { hide } = this.props
    if (hide && hide.includes(RequireNewPassword)) return null

    // const user = this.props.authData
    // const { requiredAttributes } = user.challengeParam

    return (
      <div>Require New Password</div>
    )
  }
}
