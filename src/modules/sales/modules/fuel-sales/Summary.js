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

import FormatNumber from '../../../shared/FormatNumber'
import SectionTitle from '../../../shared/SectionTitle'
import { fmtNumber } from '../../../../utils/fmt'
import { setFuelCosts, setFuelSummaries, setFuelSummaryTotals } from '../../utils'

const R = require('ramda')

export default function Summary() {
  const sales = useSelector(state => state.sales)

  let shiftData
  if (R.hasPath(['shift', 'sales', 'result', 'shift'], sales)) {
    shiftData = sales.shift.sales.result.shift
  }
  if (!shiftData) return null
  if (!R.hasPath(['salesSummary', 'fuel'], shiftData)) return null

  const havePropane = !!shiftData.fuelCosts.fuel6

  const { fuelDefinitions } = sales.shift.sales.entities

  const fuelCosts = setFuelCosts(fuelDefinitions, shiftData.fuelCosts)
  const fuelSummaries = setFuelSummaries(fuelCosts, shiftData.salesSummary.fuel)
  const fuelSummaryTotals = setFuelSummaryTotals(fuelSummaries)

  return (
    <Paper square>
      <SectionTitle title="Summary" />

      <Table size="small">
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
            {havePropane && <TableCell align="center">Other Propane</TableCell>}
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

            {havePropane && (
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
              {fmtNumber(fuelSummaryTotals.litre, 3)}
            </TableCell>

            {havePropane && (
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
