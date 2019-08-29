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

import { setFuelCosts, setFuelSummaries } from '../../utils'
import { fmtNumber } from '../../../../utils/fmt'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 200,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function FuelSummary() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  let shiftData
  if (R.hasPath(['shift', 'sales', 'result', 'shift'], sales)) {
    shiftData = sales.shift.sales.result.shift
  }
  if (!shiftData) return null

  const { fuelDefinitions } = sales.shift.sales.entities

  const fuelCosts = setFuelCosts(fuelDefinitions, shiftData.fuelCosts)
  const fuelSummaries = setFuelSummaries(fuelCosts, shiftData.salesSummary.fuel)

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Fuel Summary
      </Typography>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Grade</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Net Dollar</TableCell>
            <TableCell>Net Litre</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fuelSummaries.map(fs => (
            <TableRow key={fs.id}>
              <TableCell>{fs.id}</TableCell>
              <TableCell>{fs.label}</TableCell>
              <TableCell align="right">{fmtNumber(fs.cost)}</TableCell>
              <TableCell align="right">{fmtNumber(fs.dollar)}</TableCell>
              <TableCell align="right">{fmtNumber(fs.litre, 3)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
