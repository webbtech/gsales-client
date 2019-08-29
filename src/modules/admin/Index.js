import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import TitleBar from './TitleBar'
import SideMenu from './SideMenu'

import Config from './modules/config/components/Config'
import Employee from './modules/employee/components/Employee'
import Product from './modules/product/components/Index'
import Stations from './modules/station/components/Index'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 65px)',
  },
  main: {
    padding: theme.spacing(2.5),
  },
}))

export default function Index() {
  const classes = useStyles()

  return (
    <React.Fragment>
      <TitleBar />
      <Grid container className={classes.root} spacing={0}>
        <Grid item>
          <SideMenu />
        </Grid>

        <Grid item className={classes.main}>
          <Switch>
            <Redirect exact from="/admin" to="/admin/stations" />
            <Route path="/admin/stations" component={Stations} />
            <Route exact path="/admin/config" component={Config} />
            <Route exact path="/admin/employees" component={Employee} />
            <Route exact path="/admin/products" component={Product} />
          </Switch>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
