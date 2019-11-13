import React, { useContext, useState } from 'react'

import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import AddIcon from '@material-ui/icons/Add'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@material-ui/icons/Delete'

import {
  Button,
  Grid,
  Fab,
  Paper,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import DateSelect from '../../../shared/DateSelect'
import NewShiftDialog from './NewShiftDialog'
import SectionTitle from '../../../shared/SectionTitle'
import ShiftDeleteDialog from './ShiftDeleteDialog'
import StationSelector from '../../../shared/StationSelector'
import { clearSalesShift, deleteShift, loadShiftSales } from '../../actions'
import { initialState, ParamContext } from '../../components/ParamContext'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  button: {
    width: '100%',
  },
  leftFab: {
    marginLeft: theme.spacing(5),
  },
  form: {
    padding: theme.spacing(2),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    width: 300,
    minHeight: 300,
  },
}))

export default function Selector() {
  const classes = useStyles()
  const [openNewShift, setOpenNewShift] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const sales = useSelector(state => state.sales)
  const dispatch = useDispatch()
  const { shiftParams, setShiftParams } = useContext(ParamContext)
  const history = useHistory()

  const handleStationSelect = (value) => {
    const params = {
      lastDay: true,
      populate: true,
    }
    dispatch(loadShiftSales(value, params))
    setShiftParams({ ...initialState, stationID: value })
  }

  const handleDateSelect = (dte) => {
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

  const handleChangeDay = (val) => {
    const dte = moment(sales.dayInfo.recordDate)
    let d
    if (val === 'prev') {
      d = dte.subtract(1, 'days')
    } else if (val === 'next') {
      d = dte.add(1, 'days')
    }
    handleDateSelect(d)
  }

  const handleClearSalesShift = () => {
    setShiftParams(null)
    dispatch(clearSalesShift())
    history.push('/sales/shift-details')
  }

  const handleOpenNewShiftDialog = () => {
    setOpenNewShift(true)
  }

  const handleCloseNewShiftDialog = () => {
    setOpenNewShift(false)
  }

  const handleOpenDelete = () => {
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const handleDeleteShift = () => {
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

  const displayClearDay = !shiftParams.stationID
  const displayPrev = !sales.dayInfo.recordDate
  const displayNext = !(sales.dayInfo.recordDate < shiftParams.maxDate)
  const isLastDay = shiftParams.lastDay

  let haveOpenShift = false
  if (R.hasPath(['shifts', 'entities', 'shifts'], sales)
    && Object.values(sales.shifts.entities.shifts).find(s => s.shift.flag === false)) {
    haveOpenShift = true
  }

  const displayCreateNextShift = isLastDay && !haveOpenShift
  const dateHelperText = isLastDay ? 'Last completed date' : null

  return (
    <Paper square className={classes.root}>
      <SectionTitle title="Shift Selector" />

      <div className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <StationSelector
              setValueHandler={handleStationSelect}
              value={shiftParams.stationID}
            />
          </Grid>

          <Grid item xs={12}>
            <DateSelect
              field="startDate"
              helperText={dateHelperText}
              label="Date"
              selectHandler={handleDateSelect}
              value={sales.dayInfo.recordDate || null}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Fab
                  className={classes.leftFab}
                  color="secondary"
                  disabled={displayPrev}
                  onClick={() => handleChangeDay('prev')}
                  size="small"
                  variant="extended"
                >
                  <ArrowBackIosIcon />
                  Prev
                </Fab>
              </Grid>

              <Grid item xs={6}>
                <Fab
                  color="secondary"
                  disabled={displayNext}
                  onClick={() => handleChangeDay('next')}
                  size="small"
                  variant="extended"
                >
                  Next
                  <ArrowForwardIosIcon />
                </Fab>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.button}
              color="secondary"
              disabled={displayClearDay}
              onClick={handleClearSalesShift}
              type="button"
              variant="contained"
            >
              Clear Current Day
              <ClearIcon className={classes.rightIcon} />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.button}
              color="primary"
              disabled={!displayCreateNextShift}
              onClick={handleOpenNewShiftDialog}
              type="button"
              variant="contained"
            >
              Create Next Shift
              <AddIcon className={classes.rightIcon} />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.button}
              color="primary"
              disabled={!isLastDay}
              onClick={handleOpenDelete}
              type="button"
              variant="contained"
            >
              Delete Last Shift
              <DeleteIcon className={classes.rightIcon} />
            </Button>
          </Grid>
        </Grid>
      </div>

      <NewShiftDialog
        open={openNewShift}
        onClose={handleCloseNewShiftDialog}
      />

      <ShiftDeleteDialog
        handler={handleDeleteShift}
        onClose={handleCloseDelete}
        open={openDelete}
      />
    </Paper>
  )
}
