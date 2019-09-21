import React from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'

const useStyles = makeStyles(theme => ({
  iconCell: {
    width: theme.spacing(4),
  },
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

export default function CashAndCardsView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  const shift = sales.dayInfo.activeShift
  console.log('shift:', shift)
  const { salesSummary } = shift
  console.log('salesSummary:', salesSummary)

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Cash & Cards
      </Typography>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>Visa</TableCell>
            <TableCell align="right">{fmtNumber(shift.creditCard.visa)}</TableCell>
            <TableCell align="center" className={classes.iconCell}><UpdateIcon /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Mastercard</TableCell>
            <TableCell align="right">{fmtNumber(shift.creditCard.mc)}</TableCell>
            <TableCell align="center" className={classes.iconCell}><UpdateIcon /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.totalsCell}>Subtotal</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.cashCCTotal)}</TableCell>
            <TableCell align="center" className={classes.iconCell} />
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}
