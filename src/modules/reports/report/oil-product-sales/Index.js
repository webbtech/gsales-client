import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import moment from 'moment'


import CancelButton from '../../../shared/CancelButton'
import FormatNumber from '../../../shared/FormatNumber'
import Loader from '../../../shared/Loader'
import MonthSelector from '../../shared/MonthSelector'
import NoRecords from '../../shared/NoRecords'
import SearchButton from '../../shared/SearchButton'
import StationSelector from '../../../shared/StationSelector'
import Title from '../../shared/Title'
import YearSelector from '../../shared/YearSelector'
import { REPORT_OIL_PRODUCT_SALES } from '../../constants'
import { clearReport, fetchOilProductSales } from '../../actions'
import { fmtNumber } from '../../../../utils/fmt'

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  reportPaper: {
    marginTop: theme.spacing(3),
    width: 900,
  },
  root: {
    padding: theme.spacing(2),
    width: '100%',
  },
}))

const Report = ({ report }) => {
  const classes = useStyles()
  const { meta: { recordLength }, records, id } = report.result
  if (id !== REPORT_OIL_PRODUCT_SALES) return null
  if (!recordLength) return <NoRecords />

  return (
    <Paper square className={classes.reportPaper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Open</TableCell>
            <TableCell>Restock</TableCell>
            <TableCell>Sold</TableCell>
            <TableCell>Close</TableCell>
            <TableCell align="right">Sales</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {records.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.category}</TableCell>
              <TableCell>{r.openStock}</TableCell>
              <TableCell>{r.restock}</TableCell>
              <TableCell>{r.sold}</TableCell>
              <TableCell>{r.closeStock}</TableCell>
              <TableCell align="right">{fmtNumber(r.sales)}</TableCell>
              <TableCell><FormatNumber value={r.balance} decimal={0} /></TableCell>
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

export default function Index() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const report = useSelector(state => state.report)

  const dte = moment().subtract(1, 'months')
  const defaultFormValues = {
    month: dte.month(),
    stationID: '',
    year: dte.year(),
  }
  const [formValues, setFormValues] = useState(defaultFormValues)

  useEffect(() => (
    () => {
      dispatch(clearReport())
    }
  ), [dispatch])

  const handleSetMonth = (value) => {
    setFormValues({ ...formValues, month: value })
  }

  const handleSetStation = (value) => {
    setFormValues({ ...formValues, stationID: value })
  }

  const handleSetYear = (value) => {
    setFormValues({ ...formValues, year: value })
  }

  const handleClearFields = () => {
    setFormValues(defaultFormValues)
  }

  const handleSubmit = () => {
    const date = moment()
      .date(1)
      .month(formValues.month)
      .year(formValues.year)
      .format('YYYY-MM-DD')
    const params = {
      date,
      stationID: formValues.stationID,
    }
    dispatch(fetchOilProductSales(params))
  }

  // const submitOK = !Object.values(formValues).filter(f => !f).length
  const submitOK = !!formValues.stationID

  return (
    <div className={classes.root}>
      <Title>Oil Product Sales</Title>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <YearSelector
            label="Year"
            setValueHandler={handleSetYear}
            value={formValues.year}
          />
        </Grid>

        <Grid item xs={2}>
          <MonthSelector
            label="Month"
            setValueHandler={handleSetMonth}
            value={formValues.month}
          />
        </Grid>

        <Grid item xs={2}>
          <StationSelector
            setValueHandler={handleSetStation}
            value={formValues.stationID}
          />
        </Grid>

        <Grid item xs={2}>
          <SearchButton
            disabled={!submitOK}
            submitHandler={handleSubmit}
          />
        </Grid>

        <Grid item xs={2}>
          <CancelButton cancelHandler={handleClearFields} label="Reset" />
        </Grid>
      </Grid>

      {report.isFetching && <Loader />}
      {report.report && <Report report={report.report} />}
    </div>
  )
}
