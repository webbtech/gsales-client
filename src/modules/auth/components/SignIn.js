/* eslint-disable
  import/no-extraneous-dependencies,
  no-underscore-dangle,
  no-param-reassign
*/

import React from 'react'

import { Auth } from 'aws-amplify'
// import { I18n, JS, ConsoleLogger as Logger } from '@aws-amplify/core'
import { JS, ConsoleLogger as Logger } from '@aws-amplify/core'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import AuthPiece from './AuthPiece'

import { auth } from '../Amplify-UI/data-test-attributes'

const logger = new Logger('SignIn')

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
  linkButton: {
    margin: 'auto',
    marginBottom: theme.spacing(1),
    width: theme.spacing(20),
    padding: 0,
    color: theme.palette.secondary.main,
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

class SignIn extends AuthPiece {
  constructor(props) {
    super(props)

    this.checkContact = this.checkContact.bind(this)
    this.signIn = this.signIn.bind(this)

    this._validAuthStates = ['signIn', 'signedOut', 'signedUp']
    this.state = {}
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

  async signIn(event) {
    // avoid submitting the form
    if (event) {
      event.preventDefault()
    }

    // console.log('this.inputs:', this.inputs)
    const { username, password } = this.inputs
    // const username = this.getUsernameFromInput() || ''
    // const password = this.inputs.password

    if (!Auth || typeof Auth.signIn !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported')
    }
    this.setState({ loading: true })
    try {
      const user = await Auth.signIn(username, password)
      logger.debug(user)
      if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
        logger.debug(`confirm user with ${user.challengeName}`)
        this.changeState('confirmSignIn', user)
      } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        logger.debug('require new password', user.challengeParam)
        this.changeState('requireNewPassword', user)
      } else if (user.challengeName === 'MFA_SETUP') {
        logger.debug('TOTP setup', user.challengeParam)
        this.changeState('TOTPSetup', user)
      } else if (user.challengeName === 'CUSTOM_CHALLENGE'
        && user.challengeParam
        && user.challengeParam.trigger === 'true'
      ) {
        logger.debug('custom challenge', user.challengeParam)
        this.changeState('customConfirmSignIn', user)
      } else {
        this.checkContact(user)
      }
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        logger.debug('the user is not confirmed')
        this.changeState('confirmSignUp', { username })
      } else if (err.code === 'PasswordResetRequiredException') {
        logger.debug('the user requires a new password')
        this.changeState('forgotPassword', { username })
      } else {
        this.error(err)
      }
    } finally {
      this.setState({ loading: false })
    }
  }

  showComponent() {
    const { classes } = this.props
    const { loading } = this.state

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
              Sign In To Your Account
            </Typography>
          </AppBar>
          <form className={classes.form}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                autoFocus
                autoComplete="username"
                id="username"
                key="username"
                name="username"
                onChange={this.handleInputChange}
              />
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                key="password"
                autoComplete="current-password"
                name="password"
                onChange={this.handleInputChange}
                type="password"
              />
            </FormControl>

            <Button
              className={classes.submitButton}
              color="primary"
              disabled={loading}
              onClick={this.signIn}
              variant="contained"
            >
              {loading ? ('Stand by...') : ('Sign In')}
            </Button>

            <Button
              className={classes.smallButton}
              data-test={auth.signIn.forgotPasswordLink}
              onClick={() => this.changeState('forgotPassword')}
              size="small"
            >
              Forgot Password
            </Button>
          </form>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(SignIn)
