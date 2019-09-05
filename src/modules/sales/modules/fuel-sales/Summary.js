import React from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { setFuelCosts, setFuelSummaries, setFuelSummaryTotals } from '../../utils'
import { fmtNumber } from '../../../../utils/fmt'

const R = require('ramda')

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    paddingBottom: theme.spacing(1),
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function Summary() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  // console.log('sales:', sales)
  let shiftData
  if (R.hasPath(['shift', 'sales', 'result', 'shift'], sales)) {
    shiftData = sales.shift.sales.result.shift
  }
  if (!shiftData) return null

  const { fuelDefinitions } = sales.shift.sales.entities

  const fuelCosts = setFuelCosts(fuelDefinitions, shiftData.fuelCosts)
  const fuelSummaries = setFuelSummaries(fuelCosts, shiftData.salesSummary.fuel)
  const fuelSummaryTotals = setFuelSummaryTotals(fuelSummaries)

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Summary
      </Typography>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell size="small" />
            {fuelSummaries.map(fs => (
              <TableCell
                align="center"
                key={fs.id}
                size="small"
              >
                {fs.label}
              </TableCell>
            ))}
            <TableCell align="center" size="small">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell size="small">Dollar</TableCell>
            {fuelSummaries.map(fs => (
              <TableCell
                align="right"
                key={fs.id}
                size="small"
              >
                {fmtNumber(fs.dollar)}
              </TableCell>
            ))}
            <TableCell align="right" size="small">
              {fmtNumber(fuelSummaryTotals.dollar)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small">Litre</TableCell>
            {fuelSummaries.map(fs => (
              <TableCell
                align="right"
                key={fs.id}
                size="small"
              >
                {fmtNumber(fs.litre, 3)}
              </TableCell>
            ))}
            <TableCell align="right" size="small">
              {fmtNumber(fuelSummaryTotals.litre)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}
