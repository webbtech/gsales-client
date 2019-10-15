import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Button,
  Grid,
  FormControl,
  FormHelperText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  TextField,
} from '@material-ui/core'

import SaveIcon from '@material-ui/icons/SaveAlt'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'
import { saveNonFuelMisc } from '../../actions'
import { selectNonFuelMisc } from '../../selectors'

const useStyles = makeStyles(theme => ({
  actionButton: {
    width: '100%',
  },
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
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    width: '100%',
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
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
    value = value.replace(/[^0-9\\+\\-\\.]/g, '')
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
          <TableCell size="small">Gift Certificates</TableCell>
          <TableCell align="right" className={classes.inputCell} size="small">
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
          <TableCell size="small">Gift Certificates</TableCell>
          <TableCell align="right" className={classes.inputCell} size="small">
            <InputField
              field="otherNonFuelBobs.bobsGiftCerts"
              stateValues={stateValues}
              setStateValues={setStateValues}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell size="small">Non-Fuel</TableCell>
          <TableCell align="right" className={classes.inputCell} size="small">
            <InputField
              field="otherNonFuel.bobs"
              stateValues={stateValues}
              setStateValues={setStateValues}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell size="small">Fuel Misc. Adj.</TableCell>
          <TableCell align="right" className={classes.inputCell} size="small">
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
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {isBobs && haveVals ? (
        <BobsNonFuelForm stateValues={miscValues} setStateValues={setMiscValues} />
      ) : haveVals && (
        <NonFuelForm stateValues={miscValues} setStateValues={setMiscValues} />
      )}
      <Grid container spacing={2} className={classes.buttonRow}>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <Button
            className={classes.actionButton}
            color="primary"
            onClick={handleSubmit}
            type="submit"
            variant="contained"
          >
            {`Save ${title}`}
            <SaveIcon className={classes.rightIcon} />
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
