import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import FormatNumber from '../../../shared/FormatNumber'
import { fmtNumber } from '../../../../utils/fmt'

const useStyles = makeStyles(theme => ({
  iconButton: {
    padding: 0,
  },
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

function CashCardRow({ field, label, value }) {
  const classes = useStyles()

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell align="right"><FormatNumber value={value} /></TableCell>
      <TableCell align="center" className={classes.iconCell}>
        <IconButton className={classes.iconButton} aria-label="edit">
          <Tooltip title={`Adjust ${label}`} placement="right">
            <UpdateIcon />
          </Tooltip>
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
CashCardRow.propTypes = {
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

export default function CashAndCardsView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  const shift = sales.dayInfo.activeShift
  if (!shift) return null
  // console.log('shift:', shift)
  const { salesSummary } = shift
  const creditCardTotal = Object.values(shift.creditCard).reduce((a, b) => a + b, 0.00)
  console.log('creditCardTotal:', creditCardTotal)
  const cashSubtotal = creditCardTotal + shift.cash.dieselDiscount + shift.cash.debit
  // console.log('salesSummary:', salesSummary)

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Cash & Cards
      </Typography>
      <Table className={classes.table} size="small">
        <TableBody>

          <CashCardRow field="creditCard.visa" label="Visa" value={shift.creditCard.visa} />
          <CashCardRow field="creditCard.mc" label="Mastercard" value={shift.creditCard.mc} />
          <CashCardRow field="creditCard.gales" label="Gales Card" value={shift.creditCard.gales} />
          <CashCardRow field="creditCard.amex" label="Amex" value={shift.creditCard.amex} />
          <CashCardRow field="creditCard.discover" label="Discover" value={shift.creditCard.discover} />
          <CashCardRow field="cash.debit" label="Debit" value={shift.cash.debit} />
          <CashCardRow field="cash.dieselDiscount" label="Diesel Discount" value={shift.cash.dieselDiscount} />

          <TableRow>
            <TableCell className={classes.totalsCell}>Subtotal</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(cashSubtotal)}</TableCell>
            <TableCell align="center" className={classes.iconCell} />
          </TableRow>

          <CashCardRow field="cash.lotteryPayout" label="Lottery Payout" value={shift.cash.lotteryPayout} />
          <CashCardRow field="cash.payout" label="Gales Loyalty Payout" value={shift.cash.payout} />
          <CashCardRow field="cash.payout" label="Supplier Payout" value={shift.cash.payout} />
          <CashCardRow field="cash.bills" label="Cash" value={shift.cash.bills} />
          <CashCardRow field="cash.giftCertRedeem" label="Gift Cert Redeem" value={shift.cash.giftCertRedeem} />
          <CashCardRow field="cash.osAdjusted" label="OS Adjusted" value={shift.cash.osAdjusted} />
          <CashCardRow field="cash.driveOffNSF" label="Drive offs / NSF" value={shift.cash.driveOffNSF} />
          <CashCardRow field="cash.writeOff" label="Write offs" value={shift.cash.writeOff} />
          <CashCardRow field="cash.other" label="Other" value={shift.cash.other} />

          <TableRow>
            <TableCell className={classes.totalsCell}>Total</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.cashCCTotal)}</TableCell>
            <TableCell align="center" className={classes.iconCell} />
          </TableRow>

        </TableBody>
      </Table>
    </Paper>
  )
}
