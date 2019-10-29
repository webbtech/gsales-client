import React from 'react'
import { useSelector } from 'react-redux'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { setFuelCosts, setFuelSummaries, setFuelSummaryTotals } from '../../utils'
import { fmtNumber } from '../../../../utils/fmt'
import FormatNumber from '../../../shared/FormatNumber'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
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

  let shiftData
  if (R.hasPath(['shift', 'sales', 'result', 'shift'], sales)) {
    shiftData = sales.shift.sales.result.shift
  }
  if (!shiftData) return null
  if (!R.hasPath(['salesSummary', 'fuel'], shiftData)) return null

  // this assumes that if we have salesSummary.otherFuelLitre,
  // we would also have salesSummary.otherFuelDollar
  const haveOtherPropane = R.hasPath(['salesSummary', 'otherFuelLitre'], shiftData)

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
            <TableCell />
            {fuelSummaries.map(fs => (
              <TableCell
                align="center"
                key={fs.id}
              >
                {fs.label}
              </TableCell>
            ))}
            <TableCell align="center">Total</TableCell>
            {haveOtherPropane && <TableCell align="center">Other Propane</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>Dollar</TableCell>
            {fuelSummaries.map(fs => (
              <TableCell
                align="right"
                key={fs.id}
              >
                <FormatNumber value={fs.dollar} />
              </TableCell>
            ))}

            <TableCell align="right">
              <FormatNumber value={fuelSummaryTotals.dollar} />
            </TableCell>

            {haveOtherPropane && (
              <TableCell align="right">
                <FormatNumber value={shiftData.salesSummary.otherFuelDollar} />
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell>Litre</TableCell>
            {fuelSummaries.map(fs => (
              <TableCell
                align="right"
                key={fs.id}
              >
                {fmtNumber(fs.litre, 3)}
              </TableCell>
            ))}

            <TableCell align="right" size="small">
              {fmtNumber(fuelSummaryTotals.litre)}
            </TableCell>

            {haveOtherPropane && (
              <TableCell align="right">
                <FormatNumber value={shiftData.salesSummary.otherFuelLitre} decimal={3} />
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}
