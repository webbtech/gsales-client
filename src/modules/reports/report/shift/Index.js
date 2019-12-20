import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  ButtonGroup,
  Grid,
  MenuItem,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'

import { useSelector, useDispatch } from 'react-redux'

import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import { makeStyles } from '@material-ui/core/styles'

import moment from 'moment'

import CancelButton from '../../../shared/CancelButton'
import DateSelect from '../../../shared/DateSelect'
import FormatNumber from '../../../shared/FormatNumber'
import Loader from '../../../shared/Loader'
import MaxRecordLength from '../../shared/MaxRecordLength'
import RecordDialog from './RecordDialog'
import SearchButton from '../../shared/SearchButton'
import StationSelector from '../../../shared/StationSelector'
import Title from '../../shared/Title'
import useDataApi from '../../shared/fetchXLSAPI'
import { ToasterContext } from '../../../shared/ToasterContext'
import { clearReport, fetchShifts } from '../../actions'
import { fetchStationList } from '../../../admin/modules/station/actions'
import { fmtNumber } from '../../../../utils/fmt'

import {
  DWNLD_XLS_BACK_CARDS,
  DWNLD_XLS_EMPLOYEE_OS,
  DWNLD_XLS_PAY_PERIOD,
  DWNLD_XLS_PRODUCT_NUMBERS,
  REPORT_SHIFTS,
} from '../../constants'

const useStyles = makeStyles(theme => ({
  instruct: {
    color: theme.palette.text.hint,
    fontStyle: 'italic',
    marginTop: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
    marginBottom: -theme.spacing(0.5),
  },
  link: {
    color: theme.palette.primary[600],
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary[50],
    },
  },
  reportPaper: {
    marginTop: theme.spacing(2),
    width: 1300,
  },
  root: {
    width: '100%',
    padding: theme.spacing(2),
  },
  rowSpacer: {
    height: theme.spacing(4),
  },
}))

const Report = ({ report }) => {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const [shiftID, setShiftID] = useState('')

  const {
    id: reportID,
    meta: {
      maxLength,
      maxLengthExceeded,
    },
    records,
  } = report.result
  if (reportID !== REPORT_SHIFTS) return null

  const handleOpenDialog = (id) => {
    setShiftID(id)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <Paper square className={classes.reportPaper}>
      <MaxRecordLength maxLength={maxLength} maxLengthExceeded={maxLengthExceeded} />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Record</TableCell>
            <TableCell>Station</TableCell>
            <TableCell>Attendant</TableCell>
            <TableCell align="right">Fuel</TableCell>
            <TableCell align="right">NonFuel</TableCell>
            <TableCell align="right">Total Sales</TableCell>
            <TableCell align="right">Total Deposit</TableCell>
            <TableCell align="right">Overshort</TableCell>
            <TableCell align="right">Gift Certs</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(records).map(r => (
            <TableRow key={r.id} hover>
              <TableCell
                className={classes.link}
                onClick={() => handleOpenDialog(r.id)}
              >
                {r.recordNum}
              </TableCell>
              <TableCell>{r.stationID.name}</TableCell>
              <TableCell>{`${r.attendant.iD.nameLast}, ${r.attendant.iD.nameFirst}`}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesSummary.fuelDollar)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesSummary.totalNonFuel)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesSummary.totalSales)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesSummary.cashCCTotal)}</TableCell>
              <TableCell align="right">
                <FormatNumber value={r.overshort.amount} />
              </TableCell>
              <TableCell align="right">{fmtNumber(r.otherNonFuel.giftCerts)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RecordDialog
        onClose={handleCloseDialog}
        open={openDialog}
        shiftID={shiftID}
      />
    </Paper>
  )
}
Report.propTypes = {
  report: PropTypes.instanceOf(Object).isRequired,
}

const defaultFormValues = {
  startDate: null,
  endDate: null,
  stationID: '',
}

export default function Index() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const station = useSelector(state => state.station)
  const report = useSelector(state => state.report)
  const [formValues, setFormValues] = useState(defaultFormValues)
  const [{ payload, isLoading, isError }, doFetch] = useDataApi()
  const { setToaster } = useContext(ToasterContext)

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

  useEffect(() => (
    () => {
      dispatch(clearReport())
    }
  ), [dispatch])

  const handleDateSelect = (dte, field) => {
    const fmtDate = dte.format('YYYY-MM-DD')
    setFormValues({ ...formValues, [field]: fmtDate })
  }

  const handleStationSelect = (stationID) => {
    setFormValues({ ...formValues, stationID })
  }

  const handleClearFields = () => {
    setFormValues(defaultFormValues)
  }

  const handleSubmit = () => {
    const params = {
      startDate: formValues.startDate,
    }
    if (formValues.endDate) {
      params.endDate = formValues.endDate
    }
    if (formValues.stationID) {
      params.stationID = formValues.stationID
    }
    dispatch(fetchShifts(params))
  }

  const downloadReport = (type) => {
    // console.log('formValues:', formValues)
    const dateFrom = moment(formValues.startDate).format('YYYY-MM-DD')
    const dateTo = moment(formValues.endDate).format('YYYY-MM-DD')
    const postObj = {
      dateFrom,
      dateTo,
      type,
    }
    doFetch(postObj)
  }

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

  const showDownload = !!(formValues.startDate && formValues.endDate)

  return (
    <div className={classes.root}>
      <Title>Shift</Title>

      <Grid container spacing={3}>
        <Grid item xs={2}>
          <DateSelect
            field="startDate"
            helperText="Enter Start Date"
            label="Start Date"
            selectHandler={date => handleDateSelect(date, 'startDate')}
            value={formValues.startDate}
          />
        </Grid>

        <Grid item xs={2}>
          <DateSelect
            field="endDate"
            helperText="Enter End Date (optional)"
            label="End Date"
            selectHandler={date => handleDateSelect(date, 'endDate')}
            value={formValues.endDate}
          />
        </Grid>

        <Grid item xs={2}>
          <StationSelector
            helperText="Enter Station (optional)"
            setValueHandler={handleStationSelect}
            value={formValues.stationID}
          />
        </Grid>

        <Grid item xs={2}>
          <SearchButton
            disabled={!formValues.startDate}
            submitHandler={handleSubmit}
          />
        </Grid>

        <Grid item xs={2}>
          <CancelButton cancelHandler={handleClearFields} label="Clear" />
        </Grid>
      </Grid>

      <div className={classes.rowSpacer} />
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="h6">
            {isLoading
              ? (<>Stand By...</>)
              : (
                <>
                  <CloudDownloadIcon className={classes.leftIcon} />
                  Downloads
                </>
              )
            }
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <ButtonGroup
            aria-label="small outlined button group"
            color="secondary"
            size="medium"
            variant="contained"
          >
            <Button
              disabled={!showDownload}
              onClick={() => downloadReport(DWNLD_XLS_PAY_PERIOD)}
            >
              Pay Period
            </Button>
            <Button
              disabled={!showDownload}
              onClick={() => downloadReport(DWNLD_XLS_BACK_CARDS)}
            >
              Bank Card
            </Button>
            <Button
              disabled={!showDownload}
              onClick={() => downloadReport(DWNLD_XLS_PRODUCT_NUMBERS)}
            >
              Product Count
            </Button>
            <Button
              disabled={!showDownload}
              onClick={() => downloadReport(DWNLD_XLS_EMPLOYEE_OS)}
            >
              Employee Overshort
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={2} />
            <Grid item xs={10}>
              <div className={classes.instruct}>
                Enter both start and end dates for Excel file download.
                <br />
                (Station is not considered in downloaded reports)
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {report.isFetching && <Loader />}
      {report.report && <Report report={report.report} />}
    </div>
  )
}
