import React, { useState } from 'react'

import {
  Link,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles } from '@material-ui/core/styles'

import TitleBar from './TitleBar'
import FuelSales from '../modules/fuel-sales/Index'
import NonFuelSales from '../modules/non-fuel-sales/Index'
import SalesSummary from '../modules/sales-summary/Index'
import ShiftDetails from '../modules/shift-details/Index'

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
    marginTop: theme.spacing(2.5),
  },
  root: {
    width: '100%',
  },
  tabButton: {
    fontSize: '110%',
  },
  tabContent: {
    padding: theme.spacing(2),
  },
}))

export default function Index() {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  function handleChange(event, newValue) {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <TitleBar />
      <div className={classes.container}>
        <Paper className={classes.paper} square>
          <AppBar position="static">
            <Tabs
              onChange={handleChange}
              value={value}
              variant="fullWidth"
            >
              <Tab label="Shift Details" className={classes.tabButton} component={Link} to="/sales/shift-details" />
              <Tab label="Fuel Sales" className={classes.tabButton} component={Link} to="/sales/fuel-sales" />
              <Tab label="Non-Fuel Sales" className={classes.tabButton} component={Link} to="/sales/non-fuel-sales" />
              <Tab label="Sales Summary" className={classes.tabButton} component={Link} to="/sales/sales-summary" />
            </Tabs>
          </AppBar>
          <div className={classes.tabContent}>
            <Switch>
              <Redirect exact from="/sales" to="/sales/shift-details" />
              <Route path="/sales/shift-details" component={ShiftDetails} />
              <Route path="/sales/fuel-sales" component={FuelSales} />
              <Route path="/sales/non-fuel-sales" component={NonFuelSales} />
              <Route path="/sales/sales-summary" component={SalesSummary} />
            </Switch>
          </div>
        </Paper>
      </div>
    </div>
  )
}
