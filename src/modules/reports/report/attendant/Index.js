import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import AttendantSelector from '../../../shared/AttendantSelector'
import CancelButton from '../../../shared/CancelButton'
import FormatNumber from '../../../shared/FormatNumber'
import Loader from '../../../shared/Loader'
import MaxRecordLength from '../../shared/MaxRecordLength'
import MonthSelector from '../../shared/MonthSelector'
import SearchButton from '../../shared/SearchButton'
import Title from '../../shared/Title'
import YearSelector from '../../shared/YearSelector'
import { NlToBr } from '../../../../utils/utils'
import { REPORT_ATTENDANT } from '../../constants'
import { ToasterContext } from '../../../shared/ToasterContext'
import { clearReport, fetchAttendant } from '../../actions'
import { fmtNumber } from '../../../../utils/fmt'


const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
  },
  instruct: {
    color: theme.palette.text.hint,
    fontStyle: 'italic',
    marginTop: theme.spacing(1),
  },
  osCell: {
    maxWidth: 260,
    fontSize: '95%',
  },
  reportContainer: {
    marginTop: theme.spacing(2),
    maxWidth: 1200,
  },
  reportTitle: {
    padding: theme.spacing(2),
  },
  root: {
    padding: theme.spacing(2),
  },
}))

function Report({ report }) {
  const classes = useStyles()

  const {
    id,
    meta: {
      startDate,
      endDate,
      maxLength,
      maxLengthExceeded,
    },
    records,
  } = report.result
  if (id !== REPORT_ATTENDANT) return null

  const strtDate = moment.utc(startDate).format('MMM DD, YYYY')
  const edDate = moment.utc(endDate).format('MMM DD, YYYY')

  return (
    <Paper square className={classes.reportContainer}>
      <Typography variant="body1" className={classes.reportTitle}>
        {`Report Period: ${strtDate} thru ${edDate}`}
      </Typography>
      <MaxRecordLength maxLength={maxLength} maxLengthExceeded={maxLengthExceeded} />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Record No.</TableCell>
            <TableCell>Station</TableCell>
            <TableCell align="center">Fuel</TableCell>
            <TableCell align="center">NonFuel</TableCell>
            <TableCell align="center">Sales</TableCell>
            <TableCell align="center">Overshort</TableCell>
            <TableCell>Overshort Comments</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.map(r => (
            <TableRow key={r.id} hover>
              <TableCell>{r.recordNum}</TableCell>
              <TableCell>{r.stationID.name}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesSummary.fuelDollar)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesSummary.totalNonFuel)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesSummary.totalSales)}</TableCell>
              <TableCell align="right"><FormatNumber value={r.overshort.amount} /></TableCell>
              <TableCell className={classes.osCell}>{NlToBr(r.overshort.descrip)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
Report.propTypes = {
  report: PropTypes.instanceOf(Object).isRequired,
}

const defaultFormValues = {
  employeeID: '',
  endMonth: '',
  endYear: '',
  startMonth: '',
  startYear: '',
}

export default function Index() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const report = useSelector(state => state.report)
  const { setToaster } = useContext(ToasterContext)
  const [formValues, setFormValues] = useState(defaultFormValues)

  const handleChangeField = (value, field) => {
    setFormValues({ ...formValues, [field]: value })
  }

  const handleSetEmployee = (employeeID) => {
    if (report.report) {
      dispatch(clearReport())
    }
    setFormValues({ ...formValues, employeeID })
  }

  const handleSubmit = () => {
    const params = {
      employeeID: formValues.employeeID,
      dates: {
        endMonth: formValues.endMonth,
        endYear: formValues.endYear,
        startMonth: formValues.startMonth,
        startYear: formValues.startYear,
      },
    }

    // ensure we have an attendant
    if (!params.employeeID) {
      setToaster({ message: 'An Attendant is required' })
      return
    }
    // ensure start year is later than end year
    if (params.endYear && (params.startYear > params.endYear)) {
      setToaster({ message: 'When using the "End Year" field, the value must be greater than the "Start Year" field' })
      return
    }
    dispatch(fetchAttendant(params))
  }

  const handleClearFields = () => {
    setFormValues(defaultFormValues)
  }

  const submitOK = !!(formValues.startYear && formValues.employeeID)

  useEffect(() => (
    () => {
      dispatch(clearReport())
    }
  ), [dispatch])

  return (
    <div className={classes.root}>
      <Title>Attendant Report</Title>

      <Grid container spacing={3}>
        <Grid item xs={2}>
          <AttendantSelector employeeHandler={handleSetEmployee} />
        </Grid>

        <Grid item xs={1}>
          <YearSelector
            label="Start Year"
            setValueHandler={value => handleChangeField(value, 'startYear')}
            value={formValues.startYear}
          />
        </Grid>

        <Grid item xs={2}>
          <MonthSelector
            label="Start Month"
            setValueHandler={value => handleChangeField(value, 'startMonth')}
            value={formValues.startMonth}
          />
        </Grid>

        <Grid item xs={1}>
          <YearSelector
            label="End Year"
            setValueHandler={value => handleChangeField(value, 'endYear')}
            value={formValues.endYear}
          />
        </Grid>

        <Grid item xs={2}>
          <MonthSelector
            label="End Month"
            setValueHandler={value => handleChangeField(value, 'endMonth')}
            value={formValues.endMonth}
          />
        </Grid>

        <Grid item xs={2}>
          <SearchButton
            disabled={!submitOK}
            submitHandler={handleSubmit}
          />
        </Grid>

        <Grid item xs={2}>
          <CancelButton cancelHandler={handleClearFields} />
        </Grid>
      </Grid>

      <div className={classes.instruct}>
        NOTE: Start Year is the only required date field.
      </div>

      {report.isFetching && <Loader />}
      {report.report && <Report report={report.report} />}
    </div>
  )
}
