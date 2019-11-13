import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Grid,
  FormControl,
  FormHelperText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import SectionTitle from '../../../shared/SectionTitle'
import SaveButton from '../../../shared/SaveButton'
import { fmtNumber } from '../../../../utils/fmt'
import { saveNonFuelMisc } from '../../actions'
import { selectNonFuelMisc } from '../../selectors'

const useStyles = makeStyles(theme => ({
  buttonRow: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  dataCell: {
    minWidth: 130,
    paddingTop: 0,
  },
  helperTxt: {
    textAlign: 'center',
  },
  inputCell: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: 0,
  },
  numberInput: {
    textAlign: 'right',
    marginRight: theme.spacing(1),
  },
  root: {
    width: '100%',
  },
}))

const InputField = (props) => {
  const {
    field,
    stateValues,
    setStateValues,
  } = props
  const classes = useStyles()

  function handleBlur(e) {
    let { value } = e.currentTarget
    let calc = ''
    value = value.replace(/[^0-9\\+\-\\.]/g, '')
    if ((/-|\+/).test(value)) { // if value has + or - characters, we have calculation
      calc = value
      value = eval(value) // eslint-disable-line no-eval
    }

    const ret = {
      value: parseFloat(value),
      calc,
    }
    setStateValues({ ...stateValues, [field]: ret })
    e.currentTarget.value = fmtNumber(value)
  }

  function handleFocus(e) {
    if (stateValues[field]) {
      e.currentTarget.value = stateValues[field].calc
        ? stateValues[field].calc
        : stateValues[field].value
    }
    e.currentTarget.select()
  }

  let defaultValue
  if (stateValues[field]) {
    defaultValue = stateValues[field].value
  }

  return (
    <FormControl className={classes.formControl}>
      <TextField
        autoComplete="off"
        defaultValue={fmtNumber(defaultValue)}
        className={classes.textField}
        inputProps={{
          className: classes.numberInput,
        }}
        margin="dense"
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      <FormHelperText id="component-helper-text" className={classes.helperTxt}>
        {stateValues[field] && stateValues[field].calc}
      </FormHelperText>
    </FormControl>
  )
}
InputField.propTypes = {
  field: PropTypes.string.isRequired,
  stateValues: PropTypes.instanceOf(Object).isRequired,
  setStateValues: PropTypes.func.isRequired,
}

function NonFuelForm(props) {
  const {
    stateValues,
    setStateValues,
  } = props
  const classes = useStyles()

  return (
    <Table className={classes.table} size="small">
      <TableBody>
        <TableRow>
          <TableCell>Gift Certificates</TableCell>
          <TableCell align="right" className={classes.inputCell}>
            <InputField
              field="otherNonFuel.giftCerts"
              stateValues={stateValues}
              setStateValues={setStateValues}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
NonFuelForm.propTypes = {
  stateValues: PropTypes.instanceOf(Object).isRequired,
  setStateValues: PropTypes.func.isRequired,
}

function BobsNonFuelForm(props) {
  const {
    stateValues,
    setStateValues,
  } = props
  const classes = useStyles()

  return (
    <Table className={classes.table} size="small">
      <TableBody>
        <TableRow>
          <TableCell>Gift Certificates</TableCell>
          <TableCell align="right" className={classes.inputCell}>
            <InputField
              field="otherNonFuelBobs.bobsGiftCerts"
              stateValues={stateValues}
              setStateValues={setStateValues}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Non-Fuel</TableCell>
          <TableCell align="right" className={classes.inputCell}>
            <InputField
              field="otherNonFuel.bobs"
              stateValues={stateValues}
              setStateValues={setStateValues}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Fuel Misc. Adjustment</TableCell>
          <TableCell align="right" className={classes.inputCell}>
            <InputField
              field="salesSummary.bobsFuelAdj"
              stateValues={stateValues}
              setStateValues={setStateValues}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
BobsNonFuelForm.propTypes = {
  stateValues: PropTypes.instanceOf(Object).isRequired,
  setStateValues: PropTypes.func.isRequired,
}

export default function OtherForm() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const [miscValues, setMiscValues] = useState({})
  const dispatch = useDispatch()
  const misc = useSelector(selectNonFuelMisc)

  const { isBobs } = sales.dayInfo.station
  const { shift } = sales.shift.sales.result
  const title = isBobs ? 'Bob\'s Misc Items' : 'Misc Items'

  // Setting haveVals before rendering the InputFields, ensures that
  // the defaultValue will display properly
  const haveVals = !!Object.keys(miscValues).length

  useEffect(() => {
    setMiscValues(misc)
  }, [misc])

  function handleSubmit() {
    const params = {
      items: miscValues,
      recordNum: shift.recordNum,
      shiftID: shift.id,
      stationID: shift.stationID,
    }
    dispatch(saveNonFuelMisc(params))
  }

  return (
    <Paper className={classes.root} square>
      <SectionTitle title={title} />

      {isBobs && haveVals ? (
        <BobsNonFuelForm stateValues={miscValues} setStateValues={setMiscValues} />
      ) : haveVals && (
        <NonFuelForm stateValues={miscValues} setStateValues={setMiscValues} />
      )}

      <Grid container spacing={2} className={classes.buttonRow} justify="flex-end">
        <Grid item xs={6}>
          <SaveButton
            submitHandler={handleSubmit}
            label={`Save ${title}`}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
