/* eslint-disable
  import/no-extraneous-dependencies,
  no-underscore-dangle,
  no-param-reassign
*/

import React from 'react'

import { Auth } from 'aws-amplify'
import { ConsoleLogger as Logger } from '@aws-amplify/core'

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

const logger = new Logger('ForgotPassword')

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
  linkButton: {
    margin: 'auto',
    marginBottom: theme.spacing(1),
    width: theme.spacing(20),
    padding: 0,
    color: theme.palette.secondary.main,
  },
  returnButton: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginTop: 0,
    width: theme.spacing(20),
    padding: 0,
  },
  submitButton: {
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
})

class ForgotPassword extends AuthPiece {
  constructor(props) {
    super(props)

    this.send = this.send.bind(this)
    this.submit = this.submit.bind(this)

    this._validAuthStates = ['forgotPassword']
    this.state = { delivery: null }
  }

  send() {
    const { authData = {} } = this.props
    // const username = this.getUsernameFromInput() || authData.username
    const { username } = this.inputs || authData
    if (!Auth || typeof Auth.forgotPassword !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported')
    }
    Auth.forgotPassword(username)
      .then((data) => {
        logger.debug(data)
        this.setState({ delivery: data.CodeDeliveryDetails })
      })
      .catch(err => this.error(err))
  }

  submit() {
    const { authData = {} } = this.props
    const { code, password } = this.inputs
    const { username } = this.inputs || authData

    if (!Auth || typeof Auth.forgotPasswordSubmit !== 'function') {
      throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported')
    }
    Auth.forgotPasswordSubmit(username, code, password)
      .then((data) => {
        logger.debug(data)
        this.changeState('signIn')
        this.setState({ delivery: null })
      })
      .catch(err => this.error(err))
  }

  sendView() {
    const { classes } = this.props
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="username">Username</InputLabel>
        <Input
          autoComplete="username"
          autoFocus
          id="username"
          name="username"
          onChange={this.handleInputChange}
        />
      </FormControl>
    )
  }

  submitView() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="code">Code</InputLabel>
          <Input
            autoFocus
            id="code"
            name="code"
            onChange={this.handleInputChange}
            // value={token}
          />
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={this.handleInputChange}
            type="password"
            // value={password}
          />
        </FormControl>
      </React.Fragment>
    )
  }

  showComponent() {
    const {
      classes,
      hide,
      authData = {},
    } = this.props
    if (hide && hide.includes(ForgotPassword)) return null

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
              Forgot Password
            </Typography>
          </AppBar>
          <form className={classes.form}>
            {this.state.delivery || authData.username ? this.submitView() : this.sendView()}
            {this.state.delivery || authData.username
              ? (
                <Button
                  className={classes.submitButton}
                  color="primary"
                  data-test={auth.forgotPassword.submitButton}
                  onClick={this.submit}
                  variant="contained"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  className={classes.submitButton}
                  color="primary"
                  data-test={auth.forgotPassword.sendCodeButton}
                  onClick={this.send}
                  variant="contained"
                >
                  Send Code
                </Button>
              )
            }
            {this.state.delivery || authData.username
              ? (
                <Button
                  className={classes.smallButton}
                  data-test={auth.forgotPassword.resendCodeLink}
                  onClick={this.send}
                  size="small"
                >
                  Resend Code
                </Button>
              ) : (
                <Button
                  className={classes.smallButton}
                  data-test={auth.forgotPassword.backToSignInLink}
                  onClick={() => this.changeState('signIn')}
                  size="small"
                >
                  Back to Sign In
                </Button>
              )
          }
          </form>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(ForgotPassword)
