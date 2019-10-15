import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core'

import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  iconCell: {
    width: theme.spacing(4),
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}))

function NonFuelView({ shift }) {
  const classes = useStyles()

  return (
    <Table className={classes.table} size="small">
      <TableBody>
        <TableRow>
          <TableCell size="small">Gift Certificates</TableCell>
          <TableCell align="right" size="small">{fmtNumber(shift.otherNonFuel.giftCerts)}</TableCell>
          <TableCell align="center" size="small" className={classes.iconCell}><UpdateIcon /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
NonFuelView.propTypes = {
  shift: PropTypes.instanceOf(Object).isRequired,
}

function BobsNonFuelView({ shift }) {
  const classes = useStyles()

  return (
    <Table className={classes.table} size="small">
      <TableBody>
        <TableRow>
          <TableCell size="small">Gift Certificates</TableCell>
          <TableCell align="right" size="small">{fmtNumber(shift.otherNonFuelBobs.bobsGiftCerts)}</TableCell>
          <TableCell align="center" size="small" className={classes.iconCell}><UpdateIcon /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell size="small">Non-Fuel</TableCell>
          <TableCell align="right" size="small">{fmtNumber(shift.otherNonFuel.bobs)}</TableCell>
          <TableCell align="center" size="small" className={classes.iconCell}><UpdateIcon /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell size="small">Fuel Misc. Adj.</TableCell>
          <TableCell align="right" size="small">{fmtNumber(shift.salesSummary.bobsFuelAdj)}</TableCell>
          <TableCell align="center" size="small" className={classes.iconCell}><UpdateIcon /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
BobsNonFuelView.propTypes = {
  shift: PropTypes.instanceOf(Object).isRequired,
}

export default function OtherList() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  if (!R.hasPath(['dayInfo', 'station'], sales) || !R.hasPath(['shift', 'sales', 'result'], sales)) return null

  const { isBobs } = sales.dayInfo.station
  const { shift } = sales.shift.sales.result
  const title = isBobs ? 'Bob\'s Misc Items' : 'Misc Items'

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {isBobs ? (
        <BobsNonFuelView shift={shift} />
      ) : (
        <NonFuelView shift={shift} />
      )}
    </Paper>
  )
}
