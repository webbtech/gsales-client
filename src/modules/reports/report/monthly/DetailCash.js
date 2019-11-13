import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import DialogAppBar from '../../../shared/DialogAppBar'
import Loader from '../../../shared/Loader'
import FormatNumber from '../../../shared/FormatNumber'
import { clearMonthlyReport, fetchMonthlyCash } from '../../actions'
import { getCashFieldLabel } from '../../utils'

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
  },
  reportContainer: {
    padding: theme.spacing(2),
  },
  reportTitle: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  totalCell: {
    fontWeight: '600',
  },
}))

const Report = ({ report }) => {
  const classes = useStyles()
  if (!report) return null

  const { result: record } = report.result

  return (
    <div className={classes.reportContainer}>
      <Paper square>
        <Typography variant="h6" className={classes.reportTitle}>Cash</Typography>
        <Table size="small">
          <TableBody>
            {Object.keys(record).map((k) => {
              if (k.indexOf('cash') === 0) {
                return (
                  <TableRow key={k}>
                    <TableCell>{getCashFieldLabel(k)}</TableCell>
                    <TableCell align="right">
                      <FormatNumber value={record[k]} />
                    </TableCell>
                  </TableRow>
                )
              }
              return null
            })}
            <TableRow>
              <TableCell className={classes.totalCell}>Total Cash</TableCell>
              <TableCell align="right" className={classes.totalCell}>
                <FormatNumber value={record.salesCash} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <br />

      <Paper square>
        <Typography variant="h6" className={classes.reportTitle}>Credit Card</Typography>
        <Table size="small">
          <TableBody>
            {Object.keys(record).map((k) => {
              if (k.indexOf('credit') === 0) {
                return (
                  <TableRow key={k}>
                    <TableCell>{getCashFieldLabel(k)}</TableCell>
                    <TableCell align="right">
                      <FormatNumber value={record[k]} />
                    </TableCell>
                  </TableRow>
                )
              }
              return null
            })}
            <TableRow>
              <TableCell className={classes.totalCell}>Total Credit Cards</TableCell>
              <TableCell align="right" className={classes.totalCell}>
                <FormatNumber value={record.salesCreditCard} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}
Report.propTypes = {
  report: PropTypes.instanceOf(Object).isRequired,
}

export default function Cash(props) {
  const {
    onClose,
    open,
    params,
  } = props
  const dispatch = useDispatch()
  const report = useSelector(state => state.monthlyReport)

  const handleClose = () => {
    onClose()
  }

  useEffect(() => {
    const ps = {
      date: params.date,
    }
    if (open) {
      dispatch(fetchMonthlyCash(ps))
    }
    return () => {
      dispatch(clearMonthlyReport())
    }
  }, [dispatch, open, params.date])

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{ style: { maxWidth: 750 } }}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="Bank Cards & Cash Report"
      />

      {report.isFetching && <Loader />}
      {report.report && <Report report={report.report} />}
    </Dialog>
  )
}
Cash.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  params: PropTypes.instanceOf(Object).isRequired,
}
