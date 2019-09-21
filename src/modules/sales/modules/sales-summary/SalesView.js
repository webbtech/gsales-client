import React from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  totalsCell: {
    fontWeight: '600',
  },
}))

export default function SalesView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  // console.log('sales:', sales)

  // Should be safe to assume we have a shift selected
  const shift = sales.dayInfo.activeShift
  const { salesSummary } = shift
  // const shiftNo = Number(match.params.shift)
  // console.log('shift:', shiftNo)
  // const shift = Object.values(sales.shifts.entities.shifts).find(sh => sh.shift.number === shiftNo)
  // console.log('shift:', Object.values(sales.shifts.entities.shifts))
  // console.log('shift:', sales.dayInfo.activeShift)
  // console.log('salesSummary:', salesSummary)

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
      Sales
      </Typography>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>Fuel</TableCell>
            <TableCell align="right">{fmtNumber(salesSummary.fuelDollar)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Non-Fuel</TableCell>
            <TableCell align="right">{fmtNumber(salesSummary.totalNonFuel)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.totalsCell}>Total</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.totalSales)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.totalsCell}>Total Fuel (L)</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.fuelLitre, 3)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}
