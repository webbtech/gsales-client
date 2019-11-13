import React from 'react'
import { useSelector } from 'react-redux'

import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Paper,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import FormatNumber from '../../../shared/FormatNumber'
import SectionTitle from '../../../shared/SectionTitle'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  totalsCell: {
    fontWeight: '600',
  },
})

export default function NonFuelAdjustView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  const shift = sales.dayInfo.activeShift
  if (!shift) return null

  const haveAdjust = !!shift.nonFuelAdjustVals.length

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Non-fuel Attendant Adjustment Summary" />

      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Comments</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {haveAdjust && shift.nonFuelAdjustVals.map(av => (
            <TableRow key={`${av.productID}${av.amount}`}>
              <TableCell>{av.productName}</TableCell>
              <TableCell>{av.comments}</TableCell>
              <TableCell align="right">
                <FormatNumber value={av.amount} />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className={classes.totalsCell}>Total</TableCell>
            <TableCell />
            <TableCell align="right" className={classes.totalsCell}>
              <FormatNumber value={shift.nonFuelAdjustOS} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}
