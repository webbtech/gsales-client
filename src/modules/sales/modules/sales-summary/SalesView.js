import React from 'react'
import { useSelector } from 'react-redux'

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../../../utils/fmt'

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
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  totalsCell: {
    fontWeight: '600',
  },
}))

export default function SalesView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  const shift = sales.dayInfo.activeShift
  if (!shift) return null
  const { salesSummary } = shift
  if (!salesSummary) return null

  const editOK = shift.shift.flag
  const haveOtherFuel = !!shift.otherFuel

  function displayEmptyCell(isEdit, isOtherFuel) {
    if (!isEdit || !isOtherFuel) return null
    return (
      <TableCell />
    )
  }

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
      Sales
      </Typography>

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
                <TableCell align="center" className={classes.iconCell}>
                  <IconButton className={classes.iconButton} aria-label="edit" disabled={!editOK}>
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
    </Paper>
  )
}
