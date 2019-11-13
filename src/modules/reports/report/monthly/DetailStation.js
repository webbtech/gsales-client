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
import FormatNumber from '../../../shared/FormatNumber'
import Loader from '../../../shared/Loader'
import { clearMonthlyReport, fetchMonthlyStation } from '../../actions'
import { getCashFieldLabel } from '../../utils'

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
  },
  headingLabel: {
    fontWeight: '550',
  },
  paper: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
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
  totalRow: {
    backgroundColor: theme.palette.grey[100],
  },
}))

const HeadingRow = ({ label }) => {
  const classes = useStyles()
  return (
    <TableRow>
      <TableCell className={classes.headingLabel}>{label}</TableCell>
      <TableCell colSpan={2} />
    </TableRow>
  )
}
HeadingRow.propTypes = {
  label: PropTypes.string.isRequired,
}

const ValueRow = ({ label, value }) => (
  <TableRow>
    <TableCell />
    <TableCell>{label}</TableCell>
    <TableCell align="right">
      <FormatNumber value={value} />
    </TableCell>
  </TableRow>
)
ValueRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

const SumRow = ({ label, value }) => {
  const classes = useStyles()
  return (
    <TableRow className={classes.totalRow}>
      <TableCell colSpan={2} className={classes.totalCell}>{label}</TableCell>
      <TableCell align="right" className={classes.totalCell}>
        <FormatNumber value={value} />
      </TableCell>
    </TableRow>
  )
}
SumRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

const Report = ({ report }) => {
  const classes = useStyles()
  if (!report) return null

  const { result } = report.result

  return (
    <div className={classes.reportContainer}>
      <Paper square className={classes.paper}>
        <Typography variant="h6" className={classes.reportTitle}>Sales</Typography>

        <Table size="small">
          <TableBody>
            <SumRow label="Fuel Sales" value={result.salesFuelDollar} />

            <HeadingRow label="NonFuel Sales" />

            <ValueRow label="Bobs" value={result.otherNonFuelBobs} />
            <ValueRow label="Bobs Gift Certificates" value={result.otherNonFuelBobsGiftCerts} />
            <ValueRow label="Gift Certificates" value={result.otherNonFuelGiftCerts} />
            <ValueRow label="Products" value={result.salesProduct} />

            <SumRow label="Total NonFuel" value={result.salesNonFuel} />
            <SumRow label="Total Sales" value={result.salesTotalSales} />
          </TableBody>
        </Table>
      </Paper>

      <Paper square className={classes.paper}>
        <Typography variant="h6" className={classes.reportTitle}>Cash & Cards</Typography>

        <Table size="small">
          <TableBody>
            <HeadingRow label="Cash" />

            <ValueRow label={getCashFieldLabel('cashBills')} value={result.cashBills} />
            <ValueRow label={getCashFieldLabel('cashDebit')} value={result.cashDebit} />
            <ValueRow label={getCashFieldLabel('cashDieselDiscount')} value={result.cashDieselDiscount} />
            <ValueRow label={getCashFieldLabel('cashDriveOffNSF')} value={result.cashDriveOffNSF} />
            <ValueRow label={getCashFieldLabel('cashGiftCertRedeem')} value={result.cashGiftCertRedeem} />
            <ValueRow label={getCashFieldLabel('cashOther')} value={result.cashOther} />
            <ValueRow label={getCashFieldLabel('cashLotteryPayout')} value={result.cashLotteryPayout} />
            <ValueRow label={getCashFieldLabel('cashPayout')} value={result.cashPayout} />

            <SumRow label="Total Cash" value={result.salesCash} />

            <HeadingRow label="Credit Cards" />

            <ValueRow label={getCashFieldLabel('creditCardAmex')} value={result.creditCardAmex} />
            <ValueRow label={getCashFieldLabel('creditCardDiscover')} value={result.creditCardDiscover} />
            <ValueRow label={getCashFieldLabel('creditCardGales')} value={result.creditCardGales} />
            <ValueRow label={getCashFieldLabel('creditCardMc')} value={result.creditCardMc} />
            <ValueRow label={getCashFieldLabel('creditCardVisa')} value={result.creditCardVisa} />

            <SumRow label="Total Credit Cards" value={result.salesCreditCard} />
            <SumRow label="Total Deposit" value={result.salesCashAndCards} />
            <SumRow label="Overshort" value={result.overshort} />

          </TableBody>
        </Table>
      </Paper>

      <Paper square className={classes.paper}>
        <Typography variant="h6" className={classes.reportTitle}>Products</Typography>

        <Table size="small">
          <TableBody>
            <HeadingRow label="Category" />

            {result.productCats.map(pd => (
              <TableRow key={pd.category}>
                <TableCell>{pd.category}</TableCell>
                <TableCell>{pd.qty}</TableCell>
                <TableCell align="right">
                  <FormatNumber value={pd.sales} />
                </TableCell>
              </TableRow>
            ))}

            <HeadingRow label="Report1" />

            {result.report1.map(rep => (
              <TableRow key={rep.id}>
                <TableCell>{rep.name}</TableCell>
                <TableCell>{rep.qty}</TableCell>
                <TableCell />
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

export default function Station(props) {
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
      stationID: params.stationID,
    }
    if (open) {
      dispatch(fetchMonthlyStation(ps))
    }
    return () => {
      dispatch(clearMonthlyReport())
    }
  }, [dispatch, open, params.date, params.stationID])

  let stationName = ''
  if (report.report) {
    stationName = report.report.result.meta.stationName // eslint-disable-line
  }
  const title = `Station Detail Report for: ${stationName}`

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      // PaperProps={{ style: { maxWidth: 900 } }}
    >
      <DialogAppBar
        closeHandler={handleClose}
        title={title}
      />

      {report.isFetching && <Loader />}
      {report.report && <Report report={report.report} />}
    </Dialog>
  )
}
Station.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  params: PropTypes.instanceOf(Object).isRequired,
}
