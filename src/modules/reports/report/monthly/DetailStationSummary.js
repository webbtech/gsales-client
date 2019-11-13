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
import { clearMonthlyReport, fetchMonthlyStationSummary } from '../../actions'
import { fmtNumber } from '../../../../utils/fmt'

const useStyles = makeStyles(theme => ({
  reportContainer: {
    padding: theme.spacing(2),
  },
}))

const Report = ({ report }) => {
  const classes = useStyles()
  if (!report) return null
  const records = report.result.result

  return (
    <div className={classes.reportContainer}>
      <Paper square>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Station</TableCell>
              <TableCell align="right">Bobs</TableCell>
              <TableCell align="right">Payout</TableCell>
              <TableCell align="center">Oil</TableCell>
              <TableCell align="center">Propane</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.values(records).map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.stationName}</TableCell>
                <TableCell align="right">{r.otherNonFuelBobs > 0 && fmtNumber(r.otherNonFuelBobs)}</TableCell>
                <TableCell align="right">{r.cashPayout > 0 && fmtNumber(r.cashPayout)}</TableCell>
                <TableCell align="center">{r.oil > 0 && r.oil}</TableCell>
                <TableCell align="center">{r.propane && <span>{`${r.propane.litres} (#17 L)`}</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}
Report.propTypes = {
  report: PropTypes.instanceOf(Object).isRequired,
}

export default function StationSummary(props) {
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
      dispatch(fetchMonthlyStationSummary(ps))
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
        title="Station Summary Report"
      />

      {report.isFetching && <Loader />}
      {report.report && <Report report={report.report} />}
    </Dialog>
  )
}
StationSummary.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  params: PropTypes.instanceOf(Object).isRequired,
}
