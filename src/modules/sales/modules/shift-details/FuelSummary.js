import React from 'react'
import { useSelector } from 'react-redux'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import SectionTitle from '../../../shared/SectionTitle'
import { setFuelCosts, setFuelSummaries } from '../../utils'
import { fmtNumber } from '../../../../utils/fmt'

const R = require('ramda')

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 200,
  },
})

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
      <SectionTitle title="Fuel Summary" />

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
