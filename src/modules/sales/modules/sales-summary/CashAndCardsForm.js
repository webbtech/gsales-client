import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core'

import SaveIcon from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'

import { cashAndCardFields, splitFields as splitCashAndCardFields } from '../../constants'
import { fmtNumber } from '../../../../utils/fmt'
import { saveShiftSummary } from '../../actions'
import { selectCashAndCards } from '../../selectors'

const useStyles = makeStyles(theme => ({
  actionButton: {
    width: '100%',
  },
  buttonRow: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  numberInput: {
    textAlign: 'right',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  table: {
    width: '100%',
  },
  textField: {
    width: 100,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  totalsCell: {
    fontWeight: '600',
  },
}))

const cashAndCardsFields = cashAndCardFields()

const InputField = (props) => {
  const {
    field,
    navigateFunc,
    refs,
    setStateValues,
    stateValues,
  } = props
  const classes = useStyles()

  function handleBlur(e) {
    let { value } = e.currentTarget
    let calc = ''
    value = value.replace(/[^0-9\\+\-\\.]/g, '')
    if ((/-|\+/).test(value)) {
      calc = value
      value = eval(value) // eslint-disable-line no-eval
    }

    const ret = {
      value: parseFloat(value) || 0.00,
      calc,
    }
    setStateValues({ ...stateValues, [field]: ret })
    e.currentTarget.value = fmtNumber(value)
  }

  function handleFocus(e) {
    const val = stateValues[field].value === 0 ? '' : stateValues[field].value
    if (stateValues[field]) {
      e.currentTarget.value = stateValues[field].calc
        ? stateValues[field].calc
        : val
    }
    e.currentTarget.select()
  }

  let defaultValue
  if (stateValues[field]) {
    defaultValue = stateValues[field].value
  }

  return (
    <TextField
      autoComplete="off"
      defaultValue={fmtNumber(defaultValue)}
      className={classes.textField}
      id={field}
      inputProps={{
        className: classes.numberInput,
      }}
      inputRef={(ref) => { refs.current[field] = ref }}
      margin="dense"
      onBlur={handleBlur}
      onKeyDown={e => navigateFunc(e, field)}
      onFocus={handleFocus}
    />
  )
}
InputField.propTypes = {
  field: PropTypes.string.isRequired,
  navigateFunc: PropTypes.func.isRequired,
  refs: PropTypes.instanceOf(Object).isRequired,
  setStateValues: PropTypes.func.isRequired,
  stateValues: PropTypes.instanceOf(Object).isRequired,
}

const InputRow = (props) => {
  const {
    label,
    field,
    navigateFunc,
    refs,
    setStateValues,
    stateValues,
  } = props
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell align="right">
        <InputField
          field={field}
          navigateFunc={navigateFunc}
          refs={refs}
          setStateValues={setStateValues}
          stateValues={stateValues}
        />
      </TableCell>
    </TableRow>
  )
}
InputRow.propTypes = {
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  navigateFunc: PropTypes.func.isRequired,
  refs: PropTypes.instanceOf(Object).isRequired,
  setStateValues: PropTypes.func.isRequired,
  stateValues: PropTypes.instanceOf(Object).isRequired,
}

export default function CashAndCardsForm() {
  const classes = useStyles()
  const [cashValues, setCashValues] = useState({})
  const sales = useSelector(state => state.sales)
  const cashCards = useSelector(selectCashAndCards)
  const refsArray = useRef({})
  const submitButtonEl = useRef(null)
  const dispatch = useDispatch()

  const { shift } = sales.shift.sales.result

  function handleNavigate(event, field) {
    const refsLength = Object.keys(refsArray.current).length
    let nextField
    const fieldIndex = cashAndCardsFields.indexOf(field)

    if (event.keyCode === 38) { // up arrow
      if (fieldIndex === 0) return
      nextField = cashAndCardsFields[fieldIndex - 1]
    } else if (event.keyCode === 40) { // down arrow
      nextField = cashAndCardsFields[fieldIndex + 1]
    }
    const nextFieldIndex = cashAndCardsFields.indexOf(nextField)
    if (nextFieldIndex === refsLength) {
      submitButtonEl.current.focus()
      return
    }
    if (nextField) {
      refsArray.current[nextField].focus()
    }
  }

  const haveVals = !!Object.keys(cashValues).length

  useEffect(() => {
    setCashValues(cashCards)
  }, [cashCards])

  function handleSubmit() {
    const params = {
      items: cashValues,
      recordNum: shift.recordNum,
      shiftID: shift.id,
      stationID: shift.stationID,
    }
    dispatch(saveShiftSummary(params))
  }

  const [fieldSet1, fieldSet2] = splitCashAndCardFields() // TODO: this could be memoized
  const creditCardTotal = Object.values(shift.creditCard).reduce((a, b) => a + b, 0.00)
  const cashTotal = Object.values(shift.cash).reduce((a, b) => a + b, 0.00)
  const cashSubtotal = creditCardTotal + shift.cash.dieselDiscount + shift.cash.debit
  const cashCCTotal = creditCardTotal + cashTotal

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Cash & Cards
      </Typography>

      {haveVals && (
        <Table className={classes.table} size="small">
          <TableBody>

            {fieldSet1.map(f => (
              <InputRow
                key={f.field}
                field={f.field}
                label={f.label}
                navigateFunc={handleNavigate}
                refs={refsArray}
                setStateValues={setCashValues}
                stateValues={cashValues}
              />
            ))}

            <TableRow>
              <TableCell className={classes.totalsCell}>Subtotal</TableCell>
              <TableCell align="right" className={classes.totalsCell}>{fmtNumber(cashSubtotal)}</TableCell>
            </TableRow>

            {fieldSet2.map(f => (
              <InputRow
                key={f.field}
                field={f.field}
                label={f.label}
                navigateFunc={handleNavigate}
                refs={refsArray}
                setStateValues={setCashValues}
                stateValues={cashValues}
              />
            ))}

            <TableRow>
              <TableCell className={classes.totalsCell}>Total</TableCell>
              <TableCell align="right" className={classes.totalsCell}>{fmtNumber(cashCCTotal)}</TableCell>
            </TableRow>

          </TableBody>
        </Table>
      )}

      <Grid container spacing={2} className={classes.buttonRow}>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <Button
            className={classes.actionButton}
            color="primary"
            onClick={handleSubmit}
            ref={submitButtonEl}
            type="submit"
            variant="contained"
          >
            Save Cash & Cards
            <SaveIcon className={classes.rightIcon} />
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
