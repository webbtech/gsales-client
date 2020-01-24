import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'typeface-roboto'
import Amplify, { Auth } from 'aws-amplify'
import { Authenticator } from 'aws-amplify-react'
import LogRocket from 'logrocket'
import { Helmet } from 'react-helmet'

import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'

import Admin from '../admin/Index'
import Alerts from '../alert/components/Alerts'
import ForgotPassword from '../auth/components/ForgotPassword'
import Menu from './Menu'
import Reports from '../reports/components/Index'
import RequireNewPassword from '../auth/components/RequireNewPassword'
import Sales from '../sales/components/Index'
import SignIn from '../auth/components/SignIn'
import Toaster from '../shared/Toaster'
import awsExports from '../auth/awsExports'
import mainTheme from '../../themes/main'
import { ParamProvider } from '../sales/components/ParamContext'
import { ToasterProvider } from '../shared/ToasterContext'
import { getTitle } from '../../utils/utils'

Amplify.configure(awsExports)

const SalesWithProvider = () => (
  <ParamProvider><Sales /></ParamProvider>
)

// console.log('theme:', mainTheme)

function Index({ authState }) {
  // console.log('authState:', authState)

  if (authState !== 'signedIn') return null
  return (
    <React.Fragment>
      <Helmet>
        <title>{getTitle()}</title>
      </Helmet>
      <ToasterProvider>
        <Alerts />
        <Router>
          <Switch>
            <Route exact path="/" component={Menu} />
            <Route path="/admin" component={Admin} />
            <Route path="/reports" component={Reports} />
            <Route path="/sales" component={SalesWithProvider} />
          </Switch>
        </Router>
        <Toaster />
      </ToasterProvider>
    </React.Fragment>
  )
}
Index.propTypes = {
  authState: PropTypes.string,
}
Index.defaultProps = {
  authState: null,
}

export default function AppWithAuth() {
  useEffect(() => {
    let cancel = false
    const getAuthUser = async () => {
      let user
      try {
        user = await Auth.currentAuthenticatedUser()
      } catch (e) {
        console.error(e) // eslint-disable-line
      }
      if (cancel) return
      if (user) {
        const username = user.signInUserSession.idToken.payload['cognito:username']
        const { name } = user.signInUserSession.idToken.payload
        const storage = window.localStorage
        storage.setItem('userToken', user.signInUserSession.accessToken.jwtToken)
        // FIXME: the logrocket id needs to go into .env
        LogRocket.identify('cee2gx/gsales-v2', {
          name,
          username,
        })
      }
    }
    getAuthUser()
    return () => {
      cancel = true
    }
  }, [])

  return (
    <div>
      <MuiThemeProvider theme={mainTheme}>
        <CssBaseline />
        <Authenticator
          hideDefault
        >
          <Index />
          <SignIn />
          <ForgotPassword />
          <RequireNewPassword />
        </Authenticator>
      </MuiThemeProvider>
    </div>
  )
}
