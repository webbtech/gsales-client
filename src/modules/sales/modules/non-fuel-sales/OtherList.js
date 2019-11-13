import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core'

import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import SectionTitle from '../../../shared/SectionTitle'
import ShiftAdjustDialog from '../sales-summary/ShiftAdjustDialog'
import { getMiscFieldLabel } from '../../utils'
import FormatNumber from '../../../shared/FormatNumber'

const R = require('ramda')

const useStyles = makeStyles(theme => ({
  iconButton: {
    padding: 4,
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
}))

const DialogButton = ({ openHandler }) => {
  const classes = useStyles()

  return (
    <IconButton
      className={classes.iconButton}
      onClick={() => openHandler()}
    >
      <Tooltip title="Adjust Misc Item" placement="left">
        <UpdateIcon />
      </Tooltip>
    </IconButton>
  )
}
DialogButton.propTypes = {
  openHandler: PropTypes.func.isRequired,
}

function NonFuelView({ shift }) {
  const classes = useStyles()
  const [openAdjust, setOpenAdjust] = useState(false)

  const handleOpenAdjust = () => {
    setOpenAdjust(true)
  }

  const handleCloseAdjust = () => {
    setOpenAdjust(false)
  }

  return (
    <React.Fragment>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>Gift Certificates</TableCell>
            <TableCell align="right">
              <FormatNumber value={shift.otherNonFuel.giftCerts} />
            </TableCell>
            <TableCell align="center" padding="none">
              <DialogButton openHandler={handleOpenAdjust} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <ShiftAdjustDialog
        field="otherNonFuel.giftCerts"
        onClose={handleCloseAdjust}
        open={openAdjust}
        shift={shift}
        type="misc"
      />
    </React.Fragment>
  )
}
NonFuelView.propTypes = {
  shift: PropTypes.instanceOf(Object).isRequired,
}

function BobsNonFuelView({ shift }) {
  const classes = useStyles()
  const [openAdjust, setOpenAdjust] = useState(false)
  const [field, setField] = useState(null)

  const handleOpenAdjust = (f) => {
    setField(f)
    setOpenAdjust(true)
  }

  const handleCloseAdjust = () => {
    setOpenAdjust(false)
  }

  return (
    <React.Fragment>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>{getMiscFieldLabel('otherNonFuelBobs.bobsGiftCerts')}</TableCell>
            <TableCell align="right">
              <FormatNumber value={shift.otherNonFuelBobs.bobsGiftCerts} />
            </TableCell>
            <TableCell align="center" padding="none">
              <DialogButton openHandler={() => handleOpenAdjust('otherNonFuelBobs.bobsGiftCerts')} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>{getMiscFieldLabel('otherNonFuel.bobs')}</TableCell>
            <TableCell align="right">
              <FormatNumber value={shift.otherNonFuel.bobs} />
            </TableCell>
            <TableCell align="center" padding="none">
              <DialogButton openHandler={() => handleOpenAdjust('otherNonFuel.bobs')} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>{getMiscFieldLabel('salesSummary.bobsFuelAdj')}</TableCell>
            <TableCell align="right">
              <FormatNumber value={shift.salesSummary.bobsFuelAdj} />
            </TableCell>
            <TableCell align="center" padding="none">
              <DialogButton openHandler={() => handleOpenAdjust('salesSummary.bobsFuelAdj')} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <ShiftAdjustDialog
        field={field}
        onClose={handleCloseAdjust}
        open={openAdjust}
        shift={shift}
        type="misc"
      />
    </React.Fragment>
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
      <SectionTitle title={title} />

      {isBobs ? (
        <BobsNonFuelView shift={shift} />
      ) : (
        <NonFuelView shift={shift} />
      )}
    </Paper>
  )
}
