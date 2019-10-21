import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import Adjustments from './Adjustments'
import OtherForm from './OtherForm'
import OtherList from './OtherList'
import ProductForm from './ProductForm'
import ProductList from './ProductList'

const R = require('ramda')

const useStyles = makeStyles(theme => ({ // eslint-disable-line
  root: {
    width: '100%',
  },
  title: {},
}))

export default function Index() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  if (!R.hasPath(['shift', 'sales', 'result', 'shift'], sales)) return null

  let isEditMode = false
  if (R.hasPath(['shift', 'sales', 'result', 'shift', 'shift', 'flag'], sales)) {
    isEditMode = !sales.shift.sales.result.shift.shift.flag
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      {isEditMode ? (
        <Fragment>
          <Grid item xs={7}>
            <ProductForm />
          </Grid>
          <Grid item xs={5}>
            <OtherForm />
          </Grid>
        </Fragment>
      ) : (
        <Fragment>
          <Grid item xs={7}>
            <ProductList />
          </Grid>
          <Grid item xs={5}>
            <OtherList />
            <Adjustments />
          </Grid>
        </Fragment>
      )}
    </Grid>
  )
}
