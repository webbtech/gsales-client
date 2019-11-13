import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Dialog,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import moment from 'moment'

import CheckComplete from '../../../shared/CheckComplete'
import DialogAppBar from '../../../shared/DialogAppBar'
import FormatNumber from '../../../shared/FormatNumber'
import { NlToBr } from '../../../../utils/utils'
import { fetchShiftHistory } from '../../../reports/actions'
import { fmtNumber } from '../../../../utils/fmt'
import { splitFields as splitCashAndCardFields } from '../../constants'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
  },
  paperTitle: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  recordCell: {
    padding: 8,
    paddingLeft: 6,
  },
  title: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  totalsCell: {
    fontWeight: '600',
  },
}))

const RecordView = ({ record }) => {
  const classes = useStyles()
  if (!record) return null

  const haveOtherFuel = !!record.otherFuel
  const { salesSummary } = record
  const creditCardTotal = Object.values(record.creditCard).reduce((a, b) => a + b, 0.00)
  const cashSubtotal = creditCardTotal + record.cash.dieselDiscount + record.cash.debit

  const [fieldSet1, fieldSet2] = splitCashAndCardFields()

  return (
    <Grid container xs={9} spacing={2} alignContent="flex-start">
      <Grid item xs={12} style={{ marginBottom: -16 }}>
        <Typography variant="h6" className={classes.title}>
          {`Record: ${record.recordNum}`}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Paper square>
          <Typography variant="h6" className={classes.paperTitle}>
            Sales
          </Typography>

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Fuel</TableCell>
                <TableCell align="right">{fmtNumber(salesSummary.fuelDollar)}</TableCell>
              </TableRow>

              {haveOtherFuel === true && (
                <TableRow>
                  <TableCell>Other Fuel</TableCell>
                  <TableCell align="right">{fmtNumber(salesSummary.otherFuelDollar)}</TableCell>

                </TableRow>
              )}

              <TableRow>
                <TableCell>Non-Fuel</TableCell>
                <TableCell align="right">{fmtNumber(salesSummary.totalNonFuel)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.totalsCell}>Total ($)</TableCell>
                <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.totalSales)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.totalsCell}>Total Fuel (L)</TableCell>
                <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.fuelLitre, 3)}</TableCell>
              </TableRow>

              {haveOtherFuel === true && (
                <TableRow>
                  <TableCell className={classes.totalsCell}>Total Other Fuel (L)</TableCell>
                  <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.otherFuelLitre, 3)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <br />

        <Paper square>
          <Typography variant="h6" className={classes.paperTitle}>
            Cash & Cards
          </Typography>

          <Table size="small">
            <TableBody>
              {fieldSet1.map(f => (
                <TableRow key={f.field}>
                  <TableCell>{f.label}</TableCell>
                  <TableCell align="right">
                    <FormatNumber value={R.path(f.field.split('.'), record)} />
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell className={classes.totalsCell}>Subtotal</TableCell>
                <TableCell align="right" className={classes.totalsCell}>
                  {fmtNumber(cashSubtotal)}
                </TableCell>
              </TableRow>

              {fieldSet2.map(f => (
                <TableRow key={f.field}>
                  <TableCell>{f.label}</TableCell>
                  <TableCell align="right">
                    <FormatNumber value={R.path(f.field.split('.'), record)} />
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell className={classes.totalsCell}>Total</TableCell>
                <TableCell align="right" className={classes.totalsCell}>
                  {fmtNumber(salesSummary.cashCCTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Paper square>
          <Typography variant="h6" className={classes.paperTitle}>
            Attendant
          </Typography>

          <Table className={classes.table} size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  {`${record.attendant.iD.nameLast}, ${record.attendant.iD.nameFirst} `}
                  {'\u00A0'}
                </TableCell>
                <TableCell />
              </TableRow>

              <TableRow>
                <TableCell>Sheet Completed</TableCell>
                <TableCell align="center">
                  <CheckComplete value={record.attendant.sheetComplete} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Over-short Checked</TableCell>
                <TableCell align="center">
                  <CheckComplete value={record.attendant.overshortComplete} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Overshort Amount Submitted</TableCell>
                <TableCell align="right">
                  <FormatNumber value={record.attendant.overshortValue} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <br />

        <Paper square>
          <Typography variant="h6" className={classes.paperTitle}>
            Overshort Details
          </Typography>

          <Table className={classes.table} size="small">
            <TableBody>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell align="right">
                  <FormatNumber value={record.overshort.amount} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Comments</TableCell>
                <TableCell>{NlToBr(record.overshort.descrip)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  )
}
RecordView.propTypes = {
  record: PropTypes.instanceOf(Object).isRequired,
}

const ShiftReportDialog = (props) => {
  const {
    onClose,
    open,
    shift,
  } = props
  const classes = useStyles()
  const report = useSelector(state => state.report)
  const [shiftRecord, setShiftRecord] = useState(null)
  const dispatch = useDispatch()

  const handleClose = () => {
    onClose()
    setShiftRecord(null)
  }

  useEffect(() => {
    const today = moment.utc(shift.recordDate)
    const fetchParams = {
      endDate: moment.utc(shift.recordDate).format('YYYY-MM-DD'),
      startDate: today.subtract(28, 'days').format('YYYY-MM-DD'),
      stationID: shift.stationID,
    }
    if (open) {
      dispatch(fetchShiftHistory(fetchParams))
    }
  }, [dispatch, open, shift.recordDate, shift.stationID])

  if (report && report.isLoading) {
    return <div>Loading...</div>
  }

  let reportItems = []
  if (report.report && R.hasPath(['report', 'result', 'records'], report)) {
    reportItems = report.report.result.records
  }

  const handleDisplayShift = (id) => {
    const record = reportItems.find(r => r.id === id)
    if (record) {
      setShiftRecord(record)
    }
  }
  const shiftRecordID = shiftRecord ? shiftRecord.id : null

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{ style: { maxWidth: 1024 } }}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="Shift Report"
      />

      <div className={classes.container}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Paper square>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Record</TableCell>
                    <TableCell align="right">Overshort</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {reportItems.map(r => (
                    <TableRow
                      key={r.id}
                      hover
                      selected={r.id === shiftRecordID}
                      onClick={() => handleDisplayShift(r.id)}
                    >
                      <TableCell className={classes.recordCell}>{r.recordNum}</TableCell>
                      <TableCell align="right" className={classes.recordCell}>
                        <FormatNumber value={r.overshort.amount} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {!shiftRecordID ? (
            <Typography variant="h6" className={classes.title}>Select Record</Typography>
          ) : (
            <RecordView record={shiftRecord} />
          )}
        </Grid>
      </div>
    </Dialog>
  )
}
ShiftReportDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  shift: PropTypes.instanceOf(Object).isRequired,
}

export default ShiftReportDialog
