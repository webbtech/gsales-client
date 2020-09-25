import React from 'react'

import { Switch, Route } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import TitleBar from './TitleBar'
import ReportMenu from './Menu'
import Dashboard from './Dashboard'

import Attendant from '../report/attendant/Index'
import FuelSales from '../report/fuel-sales/Index'
import Monthly from '../report/monthly/Index'
import OilProductSales from '../report/oil-product-sales/Index'
import ProductSales from '../report/product-sales/Index'
import Shift from '../report/shift/Index'

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
    marginTop: theme.spacing(2.5),
  },
  root: {
    width: '100%',
  },
  paper: {
    padding: theme.spacing(1),
    minHeight: 500,
  },
}))

export default function Index() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <TitleBar />
      <ReportMenu />
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <Switch>
            <Route exact path="/reports" component={Dashboard} />
            <Route path="/reports/attendant-activity" component={Attendant} />
            <Route path="/reports/fuel-sales" component={FuelSales} />
            <Route path="/reports/monthly-sales" component={Monthly} />
            <Route path="/reports/oil-product-sales" component={OilProductSales} />
            <Route path="/reports/product-sales" component={ProductSales} />
            <Route path="/reports/shift" component={Shift} />
          </Switch>
        </Paper>
      </div>
    </div>
  )
}
