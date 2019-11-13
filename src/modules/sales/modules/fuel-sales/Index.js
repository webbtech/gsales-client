import React from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'

import Form from './Form'
import List from './List'
import PropaneForm from './PropaneForm'
import Summary from './Summary'

const R = require('ramda')

export default function Index() {
  const sales = useSelector(state => state.sales)

  let isEditMode = false
  if (R.hasPath(['shift', 'sales', 'result', 'shift', 'shift', 'flag'], sales)) {
    isEditMode = !sales.shift.sales.result.shift.shift.flag
  }

  let havePropane = false
  if (R.hasPath(['shift', 'sales', 'result', 'shift'], sales)) {
    const { shift } = sales.shift.sales.result
    havePropane = !!shift.fuelCosts.fuel6
  }

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Summary />
      </Grid>
      {isEditMode ? (
        <Grid item xs={12}>
          <Form />
          {havePropane && <PropaneForm />}
        </Grid>
      ) : (
        <Grid item xs={11}>
          <List />
        </Grid>
      )}
    </Grid>
  )
}
