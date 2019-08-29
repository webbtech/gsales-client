import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'

import AddIcon from '@material-ui/icons/Add'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Fab from '@material-ui/core/Fab'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import MomentUtils from '@date-io/moment'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core/styles'

import { fetchStationList } from '../../../admin/modules/station/actions'
import { loadShiftSales } from '../../actions'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  arrowRow: {
    width: '100%',
    margin: 'auto',
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  fab: {
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
  },
  form: {
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  formControl: {
    marginBottom: theme.spacing(4),
  },
  root: {
    width: 300,
    minHeight: 300,
  },
  select: {
    marginTop: theme.spacing(2),
    width: 260,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

const Selector = () => {
  const classes = useStyles()
  const station = useSelector(state => state.station)
  const sales = useSelector(state => state.sales)
  const [selectedStation, handleStationChange] = useState('')
  const dispatch = useDispatch()

  function handleStationSelect(e) {
    const { value } = e.target
    handleStationChange(value)

    const params = {
      lastDay: true,
      populate: true,
    }
    dispatch(loadShiftSales(value, params))
  }

  function handleDateSelect(date) {
    const params = {
      date: date.format('YYYY-MM-DD'),
      populate: true,
    }
    dispatch(loadShiftSales(sales.dayInfo.station.id, params))
  }

  function handleChangeDay(val) {
    const dte = moment(sales.dayInfo.recordDate)
    let d
    if (val === 'prev') {
      d = dte.subtract(1, 'days')
    } else if (val === 'next') {
      d = dte.add(1, 'days')
    }
    handleDateSelect(d)
  }

  useEffect(() => {
    dispatch(fetchStationList())
  }, [dispatch])

  let stationChildren
  if (station.isFetching === false) {
    stationChildren = Object.values(station.items)
      .map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)
  }

  const displayPrev = !!(selectedStation && sales.dayInfo.recordDate)
  const displayNext = !!(selectedStation && sales.dayInfo.recordDate < sales.dayInfo.maxDate)
  const isLastDay = !!(selectedStation && moment(sales.dayInfo.recordDate).isSame(sales.dayInfo.maxDate, 'day'))

  let haveOpenShift = false
  if (R.hasPath(['shifts', 'entities', 'shifts'], sales) && Object.values(sales.shifts.entities.shifts).find(s => s.shift.flag === false)) {
    haveOpenShift = true
  }

  const displayCreateNextShift = isLastDay && !haveOpenShift

  return (
    <Paper square className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        Shift Selector
      </Typography>
      <div className={classes.form}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="station-helper">Station</InputLabel>
          <Select
            className={classes.select}
            displayEmpty
            input={<Input name="name" id="station-helper" />}
            name="station"
            onChange={handleStationSelect}
            value={selectedStation}
          >
            {stationChildren}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              autoOk
              className={classes.select}
              format="YYYY-MM-DD"
              maxDate={sales.dayInfo.maxDate}
              onChange={handleDateSelect}
              value={sales.dayInfo.recordDate || null}
            />
          </MuiPickersUtilsProvider>
          <FormHelperText>
            {isLastDay ? (<span>Last completed date</span>) : (<span> </span>)}
          </FormHelperText>
        </FormControl>

        <div className={classes.arrowRow}>
          <Fab
            className={classes.fab}
            color="secondary"
            disabled={!displayPrev}
            onClick={() => handleChangeDay('prev')}
            size="small"
            variant="extended"
          >
            <ArrowBackIosIcon />
            Prev
          </Fab>
          <Fab
            className={classes.fab}
            color="secondary"
            disabled={!displayNext}
            onClick={() => handleChangeDay('next')}
            size="small"
            variant="extended"
          >
            Next
            <ArrowForwardIosIcon />
          </Fab>
        </div>

        <Button
          className={classes.button}
          color="primary"
          disabled={!displayCreateNextShift}
          type="button"
          variant="contained"
        >
          <AddIcon className={classes.leftIcon} />
          Create Next Shift
        </Button>

        <Button
          className={classes.button}
          color="secondary"
          disabled={!isLastDay}
          type="button"
          variant="contained"
        >
          <DeleteIcon className={classes.leftIcon} />
          Delete Last Shift
        </Button>
      </div>
    </Paper>
  )
}

export default Selector
