import React from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from '@material-ui/core'

import FormatNumber from '../../../shared/FormatNumber'

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    width: '100%',
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  totalsCell: {
    fontWeight: '600',
  },
}))

export default function NonFuelAdjustView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  const shift = sales.dayInfo.activeShift
  if (!shift) return null

  const haveAdjust = !!shift.nonFuelAdjustVals.length

  console.log('shift:', shift.nonFuelAdjustVals)
  console.log('haveAdjust:', shift.nonFuelAdjustVals.length)

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Non-fuel Adjustment Summary
      </Typography>
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
