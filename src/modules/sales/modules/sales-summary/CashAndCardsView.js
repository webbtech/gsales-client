import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import SectionTitle from '../../../shared/SectionTitle'
import ShiftAdjustDialog from './ShiftAdjustDialog'
import FormatNumber from '../../../shared/FormatNumber'
import { fmtNumber } from '../../../../utils/fmt'

import { splitFields as splitCashAndCardFields } from '../../constants'

const useStyles = makeStyles({
  iconButton: {
    padding: 0,
  },
  root: {
    width: '100%',
  },
  totalsCell: {
    fontWeight: '600',
  },
})

function CashCardRow({ label, openHandler, value }) {
  const classes = useStyles()

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell align="right"><FormatNumber value={value} /></TableCell>
      <TableCell align="center" padding="none">
        <IconButton
          className={classes.iconButton}
          onClick={() => openHandler()}
        >
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
  openHandler: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
}

export default function CashAndCardsView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const [openAdjust, setOpenAdjust] = useState(false)
  const [field, setField] = useState(null)

  const handleOpenAdjust = (f) => {
    setField(f)
    setOpenAdjust(true)
  }

  const handleCloseAdjust = () => {
    setOpenAdjust(false)
  }

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
      <SectionTitle title="Cash & Cards" />

      <Table className={classes.table} size="small">
        <TableBody>
          {fieldSet1.map(f => (
            <CashCardRow
              key={f.field}
              label={f.label}
              openHandler={() => handleOpenAdjust(f.field)}
              value={setValue(f, shift)}
            />
          ))}

          <TableRow>
            <TableCell className={classes.totalsCell}>Subtotal</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(cashSubtotal)}</TableCell>
            <TableCell align="center" padding="none" />
          </TableRow>

          {fieldSet2.map(f => (
            <CashCardRow
              key={f.field}
              label={f.label}
              openHandler={() => handleOpenAdjust(f.field)}
              value={setValue(f, shift)}
            />
          ))}

          <TableRow>
            <TableCell className={classes.totalsCell}>Total</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.cashCCTotal)}</TableCell>
            <TableCell align="center" padding="none" />
          </TableRow>
        </TableBody>
      </Table>

      <ShiftAdjustDialog
        field={field}
        onClose={handleCloseAdjust}
        open={openAdjust}
        shift={shift}
        type="cashCards"
      />
    </Paper>
  )
}
