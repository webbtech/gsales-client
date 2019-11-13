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
import { clearMonthlyReport, fetchMonthlyNonFuel } from '../../actions'

const useStyles = makeStyles(theme => ({
  reportContainer: {
    padding: theme.spacing(2),
  },
}))

const Report = ({ report }) => {
  const classes = useStyles()
  if (!report) return null

  const { result: { nonFuel, otherNonFuel } } = report.result
  delete otherNonFuel.id

  return (
    <div className={classes.reportContainer}>
      <Paper square>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Sales</TableCell>
              <TableCell align="right">Quantity</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.values(nonFuel).map(nf => (
              <TableRow key={nf.id}>
                <TableCell>{nf.id}</TableCell>
                <TableCell align="right">{fmtNumber(nf.sales)}</TableCell>
                <TableCell align="right">{nf.qty}</TableCell>
              </TableRow>
            )) }
            <TableRow>
              <TableCell>Bobs</TableCell>
              <TableCell align="right">{fmtNumber(otherNonFuel.bobs)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gift Certificates</TableCell>
              <TableCell align="right">{fmtNumber(otherNonFuel.giftCerts)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Supplier Payouts</TableCell>
              <TableCell align="right">{fmtNumber(otherNonFuel.payout)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lottery Payouts</TableCell>
              <TableCell align="right">{fmtNumber(otherNonFuel.lotteryPayout)}</TableCell>
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

export default function NonFuel(props) {
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
      dispatch(fetchMonthlyNonFuel(ps))
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
      PaperProps={{ style: { maxWidth: 500 } }}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title="NonFuel Sales Detail Report"
      />

      {report.isFetching && <Loader />}
      {report.report && <Report report={report.report} />}
    </Dialog>
  )
}
NonFuel.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  params: PropTypes.instanceOf(Object).isRequired,
}
