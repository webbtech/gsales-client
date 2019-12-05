/* eslint-disable
  import/no-extraneous-dependencies,
  no-underscore-dangle,
  no-param-reassign,
  no-continue
*/

import React from 'react'

import { Auth } from 'aws-amplify'
import { JS, ConsoleLogger as Logger } from '@aws-amplify/core'

import {
  AppBar,
  Button,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Typography,
} from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

import AuthPiece from './AuthPiece'
import { auth } from '../Amplify-UI/data-test-attributes'

const logger = new Logger('RequireNewPassword')

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    width: theme.spacing(50),
    margin: 'auto',
    marginTop: theme.spacing(8),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing(2),
  },
  submitButton: {
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
})

function convertToPlaceholder(str) {
  return str.split('_')
    .map(part => part.charAt(0).toUpperCase() + part.substr(1).toLowerCase())
    .join(' ')
}

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

class RequireNewPassword extends AuthPiece {
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
    const { classes, hide } = this.props
    if (hide && hide.includes(RequireNewPassword)) return null

    const user = this.props.authData
    const { requiredAttributes } = user.challengeParam

    return (
      <div>
        <Paper className={classes.container}>
          <AppBar
            color="secondary"
            position="static"
          >
            <Typography
              color="inherit"
              className={classes.title}
              variant="h6"
            >
              Require New Password
            </Typography>
          </AppBar>

          <form className={classes.form}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="password">New Password</InputLabel>
              <Input
                autoFocus
                id="password"
                name="password"
                type="password"
                onChange={this.handleInputChange}
                data-test={auth.requireNewPassword.newPasswordInput}
              />
            </FormControl>

            {requiredAttributes.map(attribute => (
              <FormControl
                className={classes.formControl}
                key={attribute}
              >
                <InputLabel htmlFor="password">{convertToPlaceholder(attribute)}</InputLabel>
                <Input
                  
                  id={attribute}
                  name={attribute}
                  type="text"
                  onChange={this.handleInputChange}
                />
              </FormControl>
            ))}
            <Button
              className={classes.submitButton}
              color="primary"
              data-test={auth.requireNewPassword.backToSignInLink}
              onClick={this.change}
              variant="contained"
            >
              Submit
            </Button>
            <Button
              className={classes.smallButton}
              data-test={auth.forgotPassword.backToSignInLink}
              onClick={() => this.changeState('signIn')}
              size="small"
            >
              Back to Sign In
            </Button>
          </form>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(RequireNewPassword)
