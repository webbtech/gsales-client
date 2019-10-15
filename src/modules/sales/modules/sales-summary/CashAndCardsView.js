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

import { splitFields as splitCashAndCardFields } from '../../constants'

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

function CashCardRow({ label, value }) {
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
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

export default function CashAndCardsView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  const shift = sales.dayInfo.activeShift
  if (!shift) return null
  const { salesSummary } = shift
  const creditCardTotal = Object.values(shift.creditCard).reduce((a, b) => a + b, 0.00)
  const cashSubtotal = creditCardTotal + shift.cash.dieselDiscount + shift.cash.debit
  const [fieldSet1, fieldSet2] = splitCashAndCardFields()

  const setValue = (fObj, shiftData) => {
    const parts = fObj.field.split('.')
    return shiftData[parts[0]][parts[1]]
  }

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Cash & Cards
      </Typography>
      <Table className={classes.table} size="small">
        <TableBody>

          {fieldSet1.map(f => (
            <CashCardRow label={f.label} value={setValue(f, shift)} />
          ))}

          <TableRow>
            <TableCell className={classes.totalsCell}>Subtotal</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(cashSubtotal)}</TableCell>
            <TableCell align="center" className={classes.iconCell} />
          </TableRow>

          {fieldSet2.map(f => (
            <CashCardRow label={f.label} value={setValue(f, shift)} />
          ))}

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
