import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import CashAndCardsForm from './CashAndCardsForm'
import CashAndCardsView from './CashAndCardsView'
import SalesView from './SalesView'
import AttendantView from './AttendantView'
import AttendantForm from './AttendantForm'
import OvershortDetailsView from './OvershortDetailsView'
import OvershortDetailsForm from './OvershortDetailsForm'
import NonFuelAdjustView from './NonFuelAdjustView'
import ButtonsView from './ButtonsView'

const R = require('ramda')

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    flexGrow: 1,
  },
  title: {},
}))

export default function Index() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  let isEditMode = false
  if (R.hasPath(['shift', 'sales', 'result', 'shift', 'shift', 'flag'], sales)) {
    isEditMode = !sales.shift.sales.result.shift.shift.flag
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      {isEditMode ? (
        <Fragment>
          <Grid item xs={5}>
            <SalesView />
            <CashAndCardsForm />
          </Grid>
          <Grid item xs={5}>
            <AttendantForm />
            <OvershortDetailsForm />
          </Grid>
          <Grid item xs={2}>
            <ButtonsView />
          </Grid>
        </Fragment>
      ) : (
        <Fragment>
          <Grid item xs={5}>
            <SalesView />
            <CashAndCardsView />
          </Grid>
          <Grid item xs={5}>
            <AttendantView />
            <OvershortDetailsView />
            <NonFuelAdjustView />
          </Grid>
          <Grid item xs={2}>
            <ButtonsView />
          </Grid>
        </Fragment>
      )}
    </Grid>
  )
}
