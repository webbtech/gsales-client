import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import {
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'

import AttendantSelector from '../../../shared/AttendantSelector'
import CancelButton from '../../../shared/CancelButton'
import DialogAppBar from '../../../shared/DialogAppBar'
import { ParamContext } from '../../components/ParamContext'
import { createShift } from '../../actions'

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  content: {
    margin: theme.spacing(3),
    width: 320,
  },
  formControl: {},
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}))

export default function NewShiftDialog({ onClose, open }) {
  const classes = useStyles()
  const [employeeID, setEmployeeID] = useState('')
  const sales = useSelector(state => state.sales)
  const dispatch = useDispatch()
  const { shiftParams, setShiftParams } = useContext(ParamContext)
  const history = useHistory()

  const [state, setState] = useState({
    employee: '',
    day: '',
  })

  const handleClose = () => {
    onClose()
    setEmployeeID('')
  }

  const handleStateChange = name => (event, { newValue }) => {
    if (name === 'day') {
      setState({
        ...state,
        [name]: event.target.value,
      })
      return
    }
    setState({
      ...state,
      [name]: newValue,
    })
  }

  const handleSetEmployee = (ID) => {
    setEmployeeID(ID)
  }

  const handleSubmit = () => {
    const { recordDate, stationID } = shiftParams
    // First clear shiftNo from url
    setShiftParams({ shiftNo: null })
    const url = `/sales/shift-details/${stationID}/${recordDate}`
    history.push(url)

    const params = {
      action: 'create',
      date: state.day,
      employeeID,
      stationID,
    }
    dispatch(createShift(params))
    onClose()
  }

  if (!sales.dayInfo.recordDate) return null

  const curDate = moment(sales.dayInfo.recordDate)
  const nextDate = moment(sales.dayInfo.recordDate).add(1, 'days')

  const dayVals = [
    {
      value: curDate.format('YYYY-MM-DD'),
      label: `Current ${curDate.format('YYYY-MM-DD')}`,
    },
    {
      value: nextDate.format('YYYY-MM-DD'),
      label: `Next ${nextDate.format('YYYY-MM-DD')}`,
    },
  ]

  return (
    <Dialog
      onClose={handleClose}
      open={open}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="Create New Shift"
      />

      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <FormLabel component="legend">Select Next Shift Day</FormLabel>
              <RadioGroup name="day" value={state.day} onChange={handleStateChange('day')}>
                {dayVals.map(dv => (
                  <FormControlLabel
                    control={<Radio />}
                    key={dv.value}
                    label={dv.label}
                    value={dv.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <AttendantSelector employeeHandler={handleSetEmployee} />
          </Grid>

          <Grid item xs={7}>
            <Button
              color="primary"
              className={classes.button}
              onClick={handleSubmit}
              variant="contained"
            >
              Create Shift
              <AddIcon className={classes.rightIcon} />
            </Button>
          </Grid>

          <Grid item xs={5}>
            <CancelButton
              cancelHandler={handleClose}
              label="Cancel"
            />
          </Grid>
        </Grid>
      </div>
    </Dialog>
  )
}
NewShiftDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}
