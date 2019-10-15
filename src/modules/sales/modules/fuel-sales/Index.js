import React from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import Form from './Form'
import List from './List'
import Summary from './Summary'

const R = require('ramda')

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    flexGrow: 1,
  },
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
      <Grid item>
        <Summary />
      </Grid>
      {isEditMode ? (
        <Grid item xs={12}>
          <Form />
        </Grid>
      ) : (
        <Grid item xs={11}>
          <List />
        </Grid>
      )}
    </Grid>
  )
}
