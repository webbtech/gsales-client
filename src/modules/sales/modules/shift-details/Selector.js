import React, {
  useContext,
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'

import AddIcon from '@material-ui/icons/Add'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@material-ui/icons/Delete'

import {
  Button,
  Dialog,
  Fab,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core'

import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { makeStyles } from '@material-ui/core/styles'

import NewShiftForm from './NewShiftForm'
import ShiftDeleteDialog from './ShiftDeleteDialog'
import { clearSalesShift, deleteShift, loadShiftSales } from '../../actions'
import { fetchStationList } from '../../../admin/modules/station/actions'
import { initialState, ParamContext } from '../../components/ParamContext'

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
  leftIcon: {
    marginRight: theme.spacing(1),
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

const Selector = ({ history }) => {
  const classes = useStyles()
  const [openForm, setOpenForm] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const station = useSelector(state => state.station)
  const sales = useSelector(state => state.sales)
  const dispatch = useDispatch()
  const { shiftParams, setShiftParams } = useContext(ParamContext)

  function handleStationSelect(e) {
    const { value } = e.target
    const params = {
      lastDay: true,
      populate: true,
    }
    dispatch(loadShiftSales(value, params))
    setShiftParams({ ...initialState, stationID: value })
  }

  function handleDateSelect(dte) {
    const fmtDate = dte.format('YYYY-MM-DD')

    // ensure lastDay and shiftNo are reset, once data loads it will be reset
    const lastDay = !!(moment(dte).isSame(shiftParams.maxDate, 'day'))
    setShiftParams({ recordDate: fmtDate, lastDay, shiftNo: null })
    const { stationID } = shiftParams
    const params = {
      date: fmtDate,
      populate: true,
    }
    dispatch(loadShiftSales(stationID, params))
    const url = `/sales/shift-details/${stationID}/${fmtDate}`
    history.push(url)
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

  function handleClearSalesShift() {
    setShiftParams(null)
    dispatch(clearSalesShift())
    history.push('/sales/shift-details')
  }

  function handleOpenForm() {
    setOpenForm(true)
  }

  function handleCloseForm() {
    setOpenForm(false)
  }

  function handleOpenDelete() {
    setOpenDelete(true)
  }

  function handleCloseDelete() {
    setOpenDelete(false)
  }

  function handleDeleteShift() {
    const { recordDate, stationID } = shiftParams
    // First clear shiftNo from url
    setShiftParams({ shiftNo: null })
    const url = `/sales/shift-details/${stationID}/${recordDate}`
    history.push(url)

    const params = {
      action: 'delete',
      stationID,
    }
    dispatch(deleteShift(params))
    setOpenDelete(false)
  }

  let stationChildren
  const items = Object.values(station.items)
  if (items.length && !stationChildren) {
    stationChildren = items.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)
  }

  useEffect(() => {
    if (!stationChildren) {
      dispatch(fetchStationList())
    }
  }, [dispatch, stationChildren])

  const displayPrev = !!(sales.dayInfo.recordDate)
  const displayNext = !!(sales.dayInfo.recordDate < shiftParams.maxDate)
  const isLastDay = shiftParams.lastDay

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
            value={shiftParams.stationID}
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
          color="secondary"
          // disabled={!isLastDay}
          onClick={handleClearSalesShift}
          type="button"
          variant="contained"
        >
          <ClearIcon className={classes.leftIcon} />
          Clear Current Day
        </Button>

        <Button
          className={classes.button}
          color="primary"
          disabled={!displayCreateNextShift}
          onClick={handleOpenForm}
          type="button"
          variant="contained"
        >
          <AddIcon className={classes.leftIcon} />
          Create Next Shift
        </Button>

        <Button
          className={classes.button}
          color="primary"
          disabled={!isLastDay}
          onClick={handleOpenDelete}
          type="button"
          variant="contained"
        >
          <DeleteIcon className={classes.leftIcon} />
          Delete Last Shift
        </Button>
      </div>
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="lg"
      >
        <NewShiftForm onCloseHandler={handleCloseForm} />
      </Dialog>

      <ShiftDeleteDialog
        handler={handleDeleteShift}
        onClose={handleCloseDelete}
        open={openDelete}
      />
    </Paper>
  )
}
Selector.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(Selector)
