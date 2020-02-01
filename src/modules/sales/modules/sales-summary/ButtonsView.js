import React, { useEffect, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import LockIcon from '@material-ui/icons/Lock'
import SearchIcon from '@material-ui/icons/Search'

import { makeStyles } from '@material-ui/core/styles'

import ShiftCloseDialog from './ShiftCloseDialog'
import ShiftReportDialog from './ShiftReportDialog'
import { patchShift } from '../../actions'
import { ParamContext } from '../../components/ParamContext'
import useDataApi from '../../../shared/fetchPDFAPI'
import { ToasterContext } from '../../../shared/ToasterContext'

import {
  DWNLD_PDF_DAY,
  DWNLD_PDF_SHIFT,
} from '../../constants'

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
  const [reportType, setReportType] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()
  const sales = useSelector(state => state.sales)
  const { setShiftParams } = useContext(ParamContext)
  const [{ payload, isLoading, isError }, doFetch] = useDataApi()
  const { setToaster } = useContext(ToasterContext)

  useEffect(() => {
    if (isError) {
      setToaster({ message: 'An error occurred creating the requested report. Please report this error to the application administrator.', duration: 10000 })
    }
  }, [isError, setToaster])

  const url = payload && payload.data ? payload.data.url : null
  useEffect(() => {
    if (url) {
      window.location.href = url
      // we could also do: window.open(url)
    }
  }, [url])

  if (!R.hasPath(['shift', 'sales', 'result'], sales)) return null
  const { shift } = sales.shift.sales.result
  const enableCloseShift = shift.shift.flag === false
  const shiftOpen = !shift.shift.flag

  function handleOpenDialog() {
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    setOpenDialog(false)
  }

  const handleCloseShift = () => {
    const params = {
      action: 'closeShift',
      shiftID: shift.id,
      stationID: shift.stationID,
      recordNum: shift.recordNum,
      actionArgs: {
        method: 'closeShift',
      },
    }
    setOpenDialog(false)

    dispatch(patchShift(params))
    // FIXME: although the shiftNo is set, I believe out callbacks recognize the shift as something
    // unwanted and changes the shiftNo
    setShiftParams({ tabName: 'shift-details', shiftNo: null })
    const date = shift.recordNum.substring(0, 10)
    const url2 = `/sales/shift-details/${shift.stationID}/${date}`
    history.push(url2)
  }

  const handleOpenReportDialog = () => {
    setOpenReport(true)
  }

  const handleCloseReportDialog = () => {
    setOpenReport(false)
  }

  // FIXME: when token times out, we get error
  // use getToken function here
  const downloadReport = (type) => {
    setReportType(type)

    const { recordNum, stationID } = shift
    const dateStr = recordNum.substring(0, 10)
    const postObj = {
      stationID,
      type,
    }

    if (type === DWNLD_PDF_DAY) {
      postObj.date = dateStr
    } else if (type === DWNLD_PDF_SHIFT) {
      postObj.recordNumber = recordNum
    }
    doFetch(postObj)
  }

  const requestDayReport = reportType === DWNLD_PDF_DAY && isLoading
  const requestShiftReport = reportType === DWNLD_PDF_SHIFT && isLoading

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
        disabled={requestShiftReport || shiftOpen}
        className={classes.actionButton}
        color="secondary"
        onClick={() => downloadReport(DWNLD_PDF_SHIFT)}
        variant="contained"
      >
        {requestShiftReport ? ('Loading') : ('Shift Report')}
        <CloudDownloadIcon className={classes.rightIcon} />
      </Button>

      <Button
        disabled={requestDayReport || shiftOpen}
        className={classes.actionButton}
        color="secondary"
        onClick={() => downloadReport(DWNLD_PDF_DAY)}
        variant="contained"
      >
        {requestDayReport ? ('Loading') : ('Day Report')}
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
