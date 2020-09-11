import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import SectionTitle from '../../../shared/SectionTitle'
import OtherFuelAdjustDialog from './OtherFuelAdjustDialog'
import { fmtNumber } from '../../../../utils/fmt'
import { getFieldLabel } from '../../utils'

const useStyles = makeStyles(theme => ({
  iconButton: {
    padding: 0,
  },
  iconCell: {
    width: theme.spacing(4),
  },
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  totalsCell: {
    fontWeight: '600',
  },
}))

export default function SalesView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)
  const [openDialog, setOpenDialog] = useState(false)

  const shift = sales.dayInfo.activeShift
  if (!shift) return null
  const { salesSummary } = shift
  if (!salesSummary) return null

  const editOK = shift.shift.flag
  const haveOtherFuel = !!shift.otherFuel
  const isBobs = shift.otherNonFuel.bobs > 0

  const displayEmptyCell = (isEdit, isOtherFuel) => {
    if (!isEdit || !isOtherFuel) return null
    return (
      <TableCell />
    )
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <Paper className={classes.root} square>
      <SectionTitle title="Sales" />

      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>Fuel</TableCell>
            <TableCell align="right">{fmtNumber(salesSummary.fuelDollar)}</TableCell>
            {displayEmptyCell(editOK, haveOtherFuel)}
          </TableRow>

          {haveOtherFuel === true && (
            <TableRow>
              <TableCell>Other Fuel</TableCell>
              <TableCell align="right">{fmtNumber(shift.salesSummary.otherFuelDollar)}</TableCell>
              {editOK === true && (
                <TableCell className={classes.iconCell} padding="none">
                  <IconButton
                    className={classes.iconButton}
                    disabled={!editOK}
                    onClick={handleOpenDialog}
                  >
                    <Tooltip title="Adjust Other Fuel" placement="right">
                      <UpdateIcon />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          )}

          <TableRow>
            <TableCell>Non-Fuel</TableCell>
            <TableCell align="right">{fmtNumber(salesSummary.totalNonFuel)}</TableCell>
            {displayEmptyCell(editOK, haveOtherFuel)}
          </TableRow>

          <TableRow>
            <TableCell>{getFieldLabel('salesSummary.fuelAdjust')}</TableCell>
            <TableCell align="right">{fmtNumber(salesSummary.fuelAdjust)}</TableCell>
          </TableRow>

          {isBobs && (
            <TableRow>
              <TableCell>Bobs Non-Fuel Adj.</TableCell>
              <TableCell align="right">{fmtNumber(shift.nonFuelAdjustOS)}</TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell className={classes.totalsCell}>Total ($)</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.totalSales)}</TableCell>
            {displayEmptyCell(editOK, haveOtherFuel)}
          </TableRow>

          <TableRow>
            <TableCell className={classes.totalsCell}>Total Fuel (L)</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.fuelLitre, 3)}</TableCell>
            {displayEmptyCell(editOK, haveOtherFuel)}
          </TableRow>

          {haveOtherFuel === true && (
            <TableRow>
              <TableCell className={classes.totalsCell}>Total Other Fuel (L)</TableCell>
              <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.otherFuelLitre, 3)}</TableCell>
              {displayEmptyCell(editOK, haveOtherFuel)}
            </TableRow>
          )}

        </TableBody>
      </Table>

      <OtherFuelAdjustDialog
        onClose={handleCloseDialog}
        open={openDialog}
        shift={shift}
      />
    </Paper>
  )
}
