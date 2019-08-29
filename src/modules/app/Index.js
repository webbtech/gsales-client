import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'typeface-roboto'

import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'

import Alerts from '../alert/components/Alerts'
import mainTheme from '../../themes/main'
import Menu from './Menu'
import Admin from '../admin/Index'
import Reports from '../reports/components/Index'
import Sales from '../sales/components/Index'

export default function Index() {
  return (
    <MuiThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Alerts />
      <Router>
        <Switch>
          <Route exact path="/" component={Menu} />
          <Route path="/admin" component={Admin} />
          <Route path="/reports" component={Reports} />
          <Route path="/sales" component={Sales} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  )
}
