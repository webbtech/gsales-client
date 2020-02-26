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
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import moment from 'moment'

import CancelButton from '../../../shared/CancelButton'
import Loader from '../../../shared/Loader'
import MonthSelector from '../../shared/MonthSelector'
import NoRecords from '../../shared/NoRecords'
import SearchButton from '../../shared/SearchButton'
import StationSelector from '../../../shared/StationSelector'
import Title from '../../shared/Title'
import YearSelector from '../../shared/YearSelector'
import { clearReport, fetchProductSales, fetchProductSalesAdjustments } from '../../actions'
import { fmtNumber } from '../../../../utils/fmt'
import { REPORT_PRODUCT_SALES, REPORT_PRODUCT_SALES_ADJUSTMENTS } from '../../constants'

const useStyles = makeStyles(theme => ({
  adjustPaper: {
    marginTop: theme.spacing(3),
    width: 500,
  },
  paperTitle: {
    padding: theme.spacing(1),
  },
  reportPaper: {
    marginTop: theme.spacing(3),
    width: 1024,
  },
  root: {
    padding: theme.spacing(2),
    width: '100%',
  },
}))

const Report = ({ report }) => {
  const classes = useStyles()
  const { meta: { recordLength }, records, id } = report.result
  if (id !== REPORT_PRODUCT_SALES) return null
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
          {Object.values(records).map(r => (
            <TableRow key={r.id} hover>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.category}</TableCell>
              <TableCell>{r.openStock}</TableCell>
              <TableCell>{r.restock}</TableCell>
              <TableCell>{r.sold}</TableCell>
              <TableCell>{r.closeStock}</TableCell>
              <TableCell align="right">{fmtNumber(r.sales)}</TableCell>
              <TableCell>{r.balance}</TableCell>
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

const Adjustments = ({ report }) => {
  const classes = useStyles()
  const { meta: { recordLength }, records, id } = report.result
  if (id !== REPORT_PRODUCT_SALES_ADJUSTMENTS) return null
  if (!recordLength) return null

  return (
    <Paper square className={classes.adjustPaper}>
      <Typography variant="h6" className={classes.paperTitle}>Adjustments</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Adjustments</TableCell>
            <TableCell>Sold Qty</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(records).map(r => (
            <TableRow key={r.id.id}>
              <TableCell>{r.id.name}</TableCell>
              <TableCell>{r.qty}</TableCell>
              <TableCell>{r.adjust}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
Adjustments.propTypes = {
  report: PropTypes.instanceOf(Object).isRequired,
}

export default function Index() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const report = useSelector(state => state.report)
  const report2 = useSelector(state => state.report2)

  const dte = moment().subtract(1, 'months')
  const [formValues, setFormValues] = useState({
    month: dte.month(),
    stationID: '',
    year: dte.year(),
  })

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
    setFormValues({})
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
    dispatch(fetchProductSales(params))
    dispatch(fetchProductSalesAdjustments(params))
  }

  // const submitOK = !Object.values(formValues).filter(f => !f).length
  const submitOK = !!formValues.stationID

  return (
    <div className={classes.root}>
      <Title>Product Sales</Title>
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

      {(report.isFetching || report2.isFetching) && <Loader />}
      {report.report && <Report report={report.report} />}
      {report2.report && <Adjustments report={report2.report} />}
    </div>
  )
}
