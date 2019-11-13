import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import Loader from '../../../shared/Loader'
import { fmtNumber } from '../../../../utils/fmt'
import FormatNumber from '../../../shared/FormatNumber'
import DetailDialog from './DetailDialog'
import * as ReportTypes from '../../reportTypeConstants'
import { REPORT_MONTHLY_SALES } from '../../constants'

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary[600],
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary[50],
    },
  },
  reportContainer: {
    marginTop: theme.spacing(2),
  },
}))

export default function Report({ date }) {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogParams, setDialogParams] = useState({})
  const report = useSelector(state => state.report)

  if (report.isFetching) return <Loader />
  if (!report.report) return null

  const { id, records } = report.report.result
  if (!records) return null
  if (id !== REPORT_MONTHLY_SALES) return null

  const handleOpenDialog = (type, stationID = null) => {
    setDialogParams({
      ...dialogParams,
      date,
      stationID,
      type,
    })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <Paper className={classes.reportContainer}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              className={classes.link}
              onClick={() => { handleOpenDialog(ReportTypes.STATION_SUMMARY) }}
            >
              Station
            </TableCell>
            <TableCell
              align="right"
              className={classes.link}
              onClick={() => { handleOpenDialog(ReportTypes.FUEL) }}
            >
              Fuel Sales
            </TableCell>
            <TableCell align="right">Fuel HST</TableCell>
            <TableCell
              align="right"
              className={classes.link}
              onClick={() => { handleOpenDialog(ReportTypes.NON_FUEL) }}
            >
              NonFuel Sales
            </TableCell>
            <TableCell align="right">Total Sales</TableCell>
            <TableCell align="right">Cash</TableCell>
            <TableCell
              align="right"
              className={classes.link}
              onClick={() => { handleOpenDialog(ReportTypes.CASH) }}
            >
              Credit Cards
            </TableCell>
            <TableCell align="right">Total Deposit</TableCell>
            <TableCell align="right">Overshort</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(records).map(r => (
            <TableRow key={r.id}>
              <TableCell
                className={classes.link}
                onClick={() => { handleOpenDialog(ReportTypes.STATION, r.id) }}
              >
                {r.stationName}
              </TableCell>
              <TableCell align="right">{fmtNumber(r.salesFuelDollarNoHST)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesFuelDollarHST)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesNonFuel)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesTotalSales)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesCash)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesCreditCard)}</TableCell>
              <TableCell align="right">{fmtNumber(r.salesCashAndCards)}</TableCell>
              <TableCell align="right"><FormatNumber value={r.overshort} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DetailDialog
        onClose={handleCloseDialog}
        open={openDialog}
        params={dialogParams}
      />
    </Paper>
  )
}
Report.propTypes = {
  date: PropTypes.string.isRequired,
}
