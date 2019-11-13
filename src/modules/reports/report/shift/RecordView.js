import React from 'react'
import PropTypes from 'prop-types'

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import CheckComplete from '../../../shared/CheckComplete'
import FormatNumber from '../../../shared/FormatNumber'
import { NlToBr } from '../../../../utils/utils'
import { fmtNumber } from '../../../../utils/fmt'
import { splitFields as splitCashAndCardFields } from '../../../sales/constants'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
  paperTitle: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  totalsCell: {
    fontWeight: '600',
  },
}))

export default function RecordView({ record }) {
  const classes = useStyles()
  if (!record) return null

  const haveOtherFuel = !!record.otherFuel
  const { salesSummary } = record
  const creditCardTotal = Object.values(record.creditCard).reduce((a, b) => a + b, 0.00)
  const cashSubtotal = creditCardTotal + record.cash.dieselDiscount + record.cash.debit
  const [fieldSet1, fieldSet2] = splitCashAndCardFields()

  // TODO: consider refactor to allow re-use of this view in
  // sales/modules/sales-summary/ShiftReportDialog
  return (
    <div className={classes.container}>
      <Grid container spacing={2} alignContent="flex-start">
        <Grid item xs={12} style={{ marginBottom: -16 }}>
          <Typography variant="h6" className={classes.title}>
            <>{`Station: ${record.stationID.name} — Record: ${record.recordNum}`}</>
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
    </div>
  )
}
RecordView.propTypes = {
  record: PropTypes.instanceOf(Object).isRequired,
}
