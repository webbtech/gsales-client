import React from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import Selector from './Selector'
import ShiftList from './ShiftList'
import FuelSummary from './FuelSummary'
import FuelCosts from './FuelCosts'

const R = require('ramda')

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    flexGrow: 1,
  },
}))

export default function Index() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  let shiftData
  let haveShift = false
  let isShiftOpen = false
  if (R.hasPath(['shift', 'sales', 'result', 'shift'], sales)) {
    shiftData = sales.shift.sales.result.shift
    haveShift = true
    isShiftOpen = !shiftData.shift.flag
  }
  const haveShifts = Object.keys(sales.shifts).length > 0
  let dayID = ''
  if (R.hasPath(['dayInfo', 'station'], sales)) {
    const dateStamp = new Date(sales.dayInfo.recordDate).getTime().toString()
    dayID = `${sales.dayInfo.station.id}-${dateStamp}`
  }

  return (
    <Grid container className={classes.root} spacing={4}>
      <Grid item>
        <Selector />
      </Grid>

      {haveShifts && (
        <Grid item>
          <ShiftList dayID={dayID} />
        </Grid>
      )}

      {haveShift && (
        <Grid item>
          {isShiftOpen ? (
            <FuelCosts />
          ) : (
            <FuelSummary />
          )}
        </Grid>
      )}
    </Grid>
  )
}
