import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import {
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import DialogAppBar from '../../../shared/DialogAppBar'
import Loader from '../../../shared/Loader'
import { fmtNumber } from '../../../../utils/fmt'
import { clearMonthlyReport, fetchMonthlyFuel } from '../../actions'
import FormatNumber from '../../../shared/FormatNumber'

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
  },
  reportContainer: {
    padding: theme.spacing(2),
  },
  totalCell: {
    fontWeight: '600',
  },
}))

const Report = ({ report }) => {
  const classes = useStyles()
  if (!report) return null

  const { meta: { grades }, result } = report.result
  const totals = {
    litresNet: 0.00,
    dollarsNetNoHST: 0.00,
    dollarsNetHST: 0.00,
    dollarsNet: 0.00,
    dollarsDiff: 0.00,
  }

  Object.values(result).forEach((r) => {
    totals.litresNet += r.litresNet
    totals.dollarsNetNoHST += r.dollarsNetNoHST
    totals.dollarsNetHST += r.dollarsNetHST
    totals.dollarsNet += r.dollarsNet
    totals.dollarsDiff += r.dollarsDiff
  })

  return (
    <div className={classes.reportContainer}>
      <Paper square>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Grades</TableCell>
              <TableCell align="right">Litres Total</TableCell>
              <TableCell align="right">Sales</TableCell>
              <TableCell align="right">Sales HST</TableCell>
              <TableCell align="right">Sales Total</TableCell>
              <TableCell align="right">Overshort</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.values(result).map(f => (
              <TableRow key={f.id}>
                <TableCell>{grades[f.id]}</TableCell>
                <TableCell align="right">{fmtNumber(f.litresNet, 3)}</TableCell>
                <TableCell align="right">{fmtNumber(f.dollarsNetNoHST)}</TableCell>
                <TableCell align="right">{fmtNumber(f.dollarsNetHST)}</TableCell>
                <TableCell align="right">{fmtNumber(f.dollarsNet)}</TableCell>
                <TableCell align="right"><FormatNumber value={f.dollarsDiff} /></TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell className={classes.totalCell}>Totals</TableCell>
              <TableCell align="right" className={classes.totalCell}>{fmtNumber(totals.litresNet)}</TableCell>
              <TableCell align="right" className={classes.totalCell}>{fmtNumber(totals.dollarsNetNoHST)}</TableCell>
              <TableCell align="right" className={classes.totalCell}>{fmtNumber(totals.dollarsNetHST)}</TableCell>
              <TableCell align="right" className={classes.totalCell}>{fmtNumber(totals.dollarsNet)}</TableCell>
              <TableCell align="right" className={classes.totalCell}>{fmtNumber(totals.dollarsDiff)}</TableCell>
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

export default function Fuel(props) {
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
      dispatch(fetchMonthlyFuel(ps))
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
      PaperProps={{ style: { maxWidth: 900 } }}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="Fuel Sales Detail Report"
      />

      {report.isFetching && <Loader />}
      {report.report && <Report report={report.report} />}
    </Dialog>
  )
}
Fuel.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  params: PropTypes.instanceOf(Object).isRequired,
}
