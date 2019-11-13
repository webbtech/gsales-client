import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import List from './List'
import DetailsForm from './DetailsForm'
import Dispensers from './Dispensers'
import ProductList from './ProductList'
import ProductListEdit from './ProductListEdit'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 'calc(100vh - 65px)',
  },
  main: {
    padding: theme.spacing(0.5),
  },
}))

const Index = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container className={classes.main}>
        <Switch>
          <Route exact path="/admin/stations" component={List} />
          <Route exact path="/admin/stations/details/:stationID" component={DetailsForm} />
          <Route exact path="/admin/stations/dispensers/:stationID" component={Dispensers} />
          <Route exact path="/admin/stations/product-list/:stationID" component={ProductList} />
          <Route exact path="/admin/stations/product-list-edit/:stationID" component={ProductListEdit} />
        </Switch>
      </Grid>
    </div>
  )
}

export default Index
