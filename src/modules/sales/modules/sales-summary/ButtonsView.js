import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import LockIcon from '@material-ui/icons/Lock'
import SearchIcon from '@material-ui/icons/Search'

import { makeStyles } from '@material-ui/core/styles'

import ShiftCloseDialog from './ShiftCloseDialog'
import ShiftReportDialog from './ShiftReportDialog'
import { patchShift } from '../../actions'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

export default function ButtonsView() {
  const classes = useStyles()
  const [openDelete, setOpenDialog] = useState(false)
  const [openReport, setOpenReport] = useState(false)
  const sales = useSelector(state => state.sales)
  const dispatch = useDispatch()

  if (!R.hasPath(['shift', 'sales', 'result'], sales)) return null
  const { shift } = sales.shift.sales.result
  const enableCloseShift = shift.shift.flag === false

  function handleOpenDialog() {
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    setOpenDialog(false)
  }

  function handleCloseShift() {
    const params = {
      action: 'closeShift',
      shiftID: shift.id,
      stationID: shift.stationID,
      recordNum: shift.recordNum,
      actionArgs: {
        method: 'closeShift',
      },
    }
    dispatch(patchShift(params))
    setOpenDialog(false)
  }

  const handleOpenReportDialog = () => {
    setOpenReport(true)
  }

  const handleCloseReportDialog = () => {
    setOpenReport(false)
  }

  return (
    <div className={classes.root}>
      <Button
        className={classes.actionButton}
        onClick={handleOpenReportDialog}
        variant="contained"
      >
        Shift History
        <SearchIcon className={classes.rightIcon} />
      </Button>

      <Button
        // disabled={pristine || submitting}
        className={classes.actionButton}
        color="secondary"
        type="submit"
        variant="contained"
      >
        Shift Report
        <CloudDownloadIcon className={classes.rightIcon} />
      </Button>

      <Button
        // disabled={pristine || submitting}
        className={classes.actionButton}
        color="secondary"
        // type="submit"
        variant="contained"
      >
        Day Report
        <CloudDownloadIcon className={classes.rightIcon} />
      </Button>

      <Button
        className={classes.actionButton}
        color="primary"
        disabled={!enableCloseShift}
        onClick={handleOpenDialog}
        variant="contained"
      >
        Close Shift
        <LockIcon className={classes.rightIcon} />
      </Button>

      <ShiftCloseDialog
        handler={handleCloseShift}
        onClose={handleCloseDialog}
        open={openDelete}
      />
      <ShiftReportDialog
        onClose={handleCloseReportDialog}
        open={openReport}
        shift={shift}
      />
    </div>
  )
}
