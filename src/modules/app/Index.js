import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'typeface-roboto'
import Amplify, { Auth } from 'aws-amplify'
import { Authenticator } from 'aws-amplify-react'

import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'

import Alerts from '../alert/components/Alerts'
import mainTheme from '../../themes/main'
import Menu from './Menu'
import Admin from '../admin/Index'
import Reports from '../reports/components/Index'
import Sales from '../sales/components/Index'

import ForgotPassword from '../auth/components/ForgotPassword'
import RequireNewPassword from '../auth/components/RequireNewPassword'
import SignIn from '../auth/components/SignIn'

import awsExports from '../auth/awsExports'

Amplify.configure(awsExports)

function Index({ authState }) {
  // console.log('authState:', authState)
  if (authState !== 'signedIn') return null
  return (
    <React.Fragment>
      <Alerts />
      <Router>
        <Switch>
          <Route exact path="/" component={Menu} />
          <Route path="/admin" component={Admin} />
          <Route path="/reports" component={Reports} />
          <Route path="/sales" component={Sales} />
        </Switch>
      </Router>
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
      // console.log('user:', user)
      if (cancel) return
      if (user) {
        // console.log('user', user.signInUserSession.accessToken.jwtToken) // eslint-disable-line
        const storage = window.localStorage
        storage.setItem('userToken', user.signInUserSession.accessToken.jwtToken)
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

/* export default class AppWithAuth extends React.Component {
  state = {
    user: '', // eslint-disable-line
  }

  async componentWillMount() {
    const user = await Auth.currentAuthenticatedUser()
    if (user) {
      // this.setState({user})
      // console.log('fetching user from Auth', user) // eslint-disable-line
      const storage = window.localStorage
      // console.log('user in componentDidMount: ', user.signInUserSession.accessToken.jwtToken)
      storage.setItem('userToken', user.signInUserSession.accessToken.jwtToken)
    }
  }

  handleAuthStateChange(state) { // eslint-disable-line
    // console.log('state in handleAuthStateChange: ', state) // eslint-disable-line
    // if (state === 'signedIn') {
    // Do something when the user has signed-in
    // }
  }

  render() {
    // console.log('user in render: ', this.state)

    return (
      <div>
        <Authenticator
          // hideDefault
          onStateChange={this.handleAuthStateChange}
        >
          <Index />
        </Authenticator>
      </div>
    )
  }
} */
