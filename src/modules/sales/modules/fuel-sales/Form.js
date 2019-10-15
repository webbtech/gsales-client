import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Button,
  Grid,
  IconButton,
  FormControl,
  FormHelperText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core'

import RestoreIcon from '@material-ui/icons/SettingsBackupRestore'
import SaveIcon from '@material-ui/icons/SaveAlt'
import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import clsx from 'clsx'

import { fmtNumber } from '../../../../utils/fmt'
import FormatNumber from '../../../shared/FormatNumber'
import { saveFuelSales } from '../../actions'

const R = require('ramda')

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
  errorTxt: {
    color: 'red',
  },
  iconButton: {
    padding: 4,
  },
  iconCell: {
    width: theme.spacing(4),
  },
  iconSpaceLeft: {
    marginLeft: theme.spacing(0.5),
  },
  inputCell: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: 0,
  },
  narrowCell: {
    minWidth: 20,
    paddingLeft: 0,
    paddingRight: 0,
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
  textField: {
    width: 110,
    margin: 0,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

const InputField = (props) => {
  const {
    cell,
    fieldCounter,
    fieldType,
    fsID,
    fuelCosts,
    navigateFunc,
    refs,
    row,
    setStateValues,
    stateValues,
  } = props

  const classes = useStyles()
  const fs = R.clone(stateValues[fsID])

  function getError() {
    switch (fieldType) {
      case 'fuelDollar':
        return fs.dollars.close ? !(/^\d*\.?\d{0,2}$/.test(fs.dollars.close)) : false

      case 'fuelLitre':
        return fs.litres.close ? !(/^\d*\.?\d{0,3}$/.test(fs.litres.close)) : false

      default:
        return false
    }
  }

  function calcValues(e) {
    const { value } = e.currentTarget
    if (!value || getError()) return

    const fuelCost = fuelCosts[`fuel${fs.gradeID}`]
    const ret = R.clone(fs)

    switch (fieldType) {
      case 'fuelDollar':
        ret.dollars.close = fmtNumber(value)
        ret.dollars.net = ret.dollars.close - ret.dollars.open
        if (ret.litres.net) {
          ret.dollars.theoretical = ret.litres.net * fuelCost / 100
          ret.dollars.diff = ret.dollars.theoretical - ret.dollars.net
        }
        break

      case 'fuelLitre':
        ret.litres.close = fmtNumber(value, 3)
        ret.litres.net = ret.litres.close - ret.litres.open
        ret.dollars.theoretical = ret.litres.net * fuelCost / 100
        ret.dollars.diff = ret.dollars.theoretical - ret.dollars.net
        break

      default:
        break
    }
    setStateValues({ ...stateValues, [fsID]: ret })
  }

  function setValue(e) {
    const { value } = e.currentTarget

    switch (fieldType) {
      case 'fuelDollar':
        fs.dollars.close = value
        break

      case 'fuelLitre':
        fs.litres.close = value
        break

      default:
        break
    }
    setStateValues({ ...stateValues, [fsID]: fs })
  }

  function getValue() {
    switch (fieldType) {
      case 'fuelDollar':
        return fs.dollars.close ? fs.dollars.close : ''

      case 'fuelLitre':
        return fs.litres.close ? fs.litres.close : ''

      default:
        return ''
    }
  }

  const err = getError()
  return (
    <FormControl className={classes.formControl}>
      <TextField
        autoComplete="off"
        className={classes.textField}
        error={err}
        id={`${fieldCounter}`}
        inputProps={{
          className: classes.numberInput,
          value: getValue(),
        }}
        inputRef={(ref) => { refs.current[fieldCounter] = ref }}
        onBlur={calcValues}
        onChange={setValue}
        onKeyDown={e => navigateFunc(e, { row, cell })}
        margin="dense"
      />
      <FormHelperText id="component-helper-text" className={classes.errorTxt}>
        {err ? 'Invalid number' : ''}
      </FormHelperText>
    </FormControl>
  )
}
InputField.propTypes = {
  cell: PropTypes.number.isRequired,
  fieldCounter: PropTypes.number.isRequired,
  fieldType: PropTypes.string.isRequired,
  fsID: PropTypes.string.isRequired,
  fuelCosts: PropTypes.instanceOf(Object).isRequired,
  navigateFunc: PropTypes.func.isRequired,
  refs: PropTypes.instanceOf(Object).isRequired,
  row: PropTypes.number.isRequired,
  setStateValues: PropTypes.func.isRequired,
  stateValues: PropTypes.instanceOf(Object).isRequired,
}

// see following for info on dynamic refs
// https://rafaelquintanilha.com/the-complete-guide-to-react-refs/
// https://react-refs-cheatsheet.netlify.com/#dynamic-refs-hooks
export default function Form() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const refsArray = useRef([])
  const submitButtonEl = useRef(null)
  const [fuelValues, setFuelValues] = useState({})
  const dispatch = useDispatch()

  const { fuelDefinitions } = sales.shift.sales.entities
  const { fuelCosts } = sales.shift.sales.result.shift

  useEffect(() => {
    setFuelValues(sales.shift.sales.entities.fuelSale)
  }, [sales])

  function handleNavigate(event, ref) {
    let nextField

    if (event.keyCode === 38) { // up arrow key
      if (ref.cell === 1) { // move to next cell
        if (ref.row === 1) { return }
        nextField = ((ref.row - 1) * 10) + ref.cell + 1
      } else if (ref.cell === 2) { // move next row
        nextField = (ref.row * 10) + 1
      }
      refsArray.current[nextField].focus()
    } else if (event.keyCode === 40) { // down arrow key
      if (ref.cell === 1) { // move to next cell
        nextField = (ref.row * 10) + ref.cell + 1
      } else if (ref.cell === 2) { // move next row
        nextField = ((ref.row + 1) * 10) + 1
      }
      // Short circuit to submit button
      if (nextField > refsArray.current.length) {
        submitButtonEl.current.focus()
        return
      }
      refsArray.current[nextField].focus()
    }
  }

  function handleSubmit() {
    const { shift } = sales.shift.sales.result
    const params = {
      recordNum: shift.recordNum,
      shiftID: shift.id,
      stationID: shift.stationID,
      fuelSales: fuelValues,
    }
    dispatch(saveFuelSales(params))
  }

  let c = 0
  const dispenserRows = Object.values(fuelValues).map((fs) => {
    c += 1
    const fCtr = c * 10 + 1
    const lCtr = c * 10 + 2

    return (
      <TableRow key={fs.id}>
        <TableCell align="center" className={clsx(classes.dataCell, classes.narrowCell)}>
          {fs.dispenserID.number}
        </TableCell>
        <TableCell className={clsx(classes.dataCell, classes.narrowCell)}>
          {fuelDefinitions[fs.dispenserID.gradeID].label}
        </TableCell>
        <TableCell align="right" className={classes.dataCell}>{fmtNumber(fs.dollars.open)}</TableCell>
        <TableCell align="right" className={classes.inputCell}>
          <InputField
            cell={1}
            fieldCounter={fCtr}
            fieldType="fuelDollar"
            fsID={fs.id}
            fuelCosts={fuelCosts}
            navigateFunc={handleNavigate}
            refs={refsArray}
            row={c}
            setStateValues={setFuelValues}
            stateValues={fuelValues}
          />
        </TableCell>

        <TableCell align="right" className={classes.dataCell}>
          <FormatNumber value={fs.dollars.net} />
        </TableCell>

        <TableCell align="right" className={classes.dataCell}>
          <FormatNumber value={fs.litres.open} decimal={3} />
        </TableCell>

        <TableCell align="right" className={classes.inputCell}>
          <InputField
            cell={2}
            fieldCounter={lCtr}
            fieldType="fuelLitre"
            fsID={fs.id}
            fuelCosts={fuelCosts}
            navigateFunc={handleNavigate}
            refs={refsArray}
            row={c}
            setStateValues={setFuelValues}
            stateValues={fuelValues}
          />
        </TableCell>

        <TableCell align="right" className={classes.dataCell}>
          <FormatNumber value={fs.litres.net} decimal={3} />
        </TableCell>

        <TableCell align="right" className={classes.dataCell}>
          <FormatNumber value={fs.dollars.theoretical} />
        </TableCell>

        <TableCell align="right" className={classes.dataCell}>
          <FormatNumber value={fs.dollars.diff} decimal={4} />
        </TableCell>

        <TableCell align="center" size="small">
          <IconButton className={classes.iconButton} aria-label="edit">
            <Tooltip title="Adjust" placement="left">
              <UpdateIcon />
            </Tooltip>
          </IconButton>
          <IconButton className={clsx(classes.iconButton, classes.iconSpaceLeft)} aria-label="edit">
            <Tooltip title="Reset" placement="left">
              <RestoreIcon />
            </Tooltip>
          </IconButton>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Sales
      </Typography>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} size="small">Nozzle</TableCell>
            <TableCell align="center" size="small">Open $</TableCell>
            <TableCell align="center" size="small">Close $</TableCell>
            <TableCell align="center" size="small">Net $</TableCell>
            <TableCell align="center" size="small">Open L</TableCell>
            <TableCell align="center" size="small">Close L</TableCell>
            <TableCell align="center" size="small">Net L</TableCell>
            <TableCell align="center" size="small">Theoretical</TableCell>
            <TableCell align="center" size="small">Difference</TableCell>
            <TableCell align="center" size="small">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{dispenserRows}</TableBody>
      </Table>
      <Grid container spacing={2} className={classes.buttonRow}>
        <Grid item xs={8} />
        <Grid item xs={4}>
          <Button
            className={classes.actionButton}
            color="primary"
            onClick={handleSubmit}
            ref={submitButtonEl}
            type="submit"
            variant="contained"
          >
            Save Fuel Sales
            <SaveIcon className={classes.rightIcon} />
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
