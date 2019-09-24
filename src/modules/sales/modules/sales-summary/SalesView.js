import React from 'react'
import { useSelector } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
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
  // console.log('salesSummary:', salesSummary)

  const editOK = shift.shift.flag
  const haveOtherFuel = !!shift.otherFuel
  // const haveBobFuelAdj = !!shift.salesSummary.bobsFuelAdj
  // const { isBobs } = sales.dayInfo.station

  // console.log('editOK:', editOK)
  // console.log('haveOtherFuel:', haveOtherFuel)
  // console.log('haveBobFuelAdj:', haveBobFuelAdj)
  // console.log('isBobs:', isBobs)

  // const shiftNo = Number(match.params.shift)
  // console.log('shift:', shiftNo)
  // console.log('shift:', Object.values(sales.shifts.entities.shifts))
  // console.log('shift:', sales.dayInfo.activeShift)
  // console.log('salesSummary:', salesSummary)

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
            <TableCell align="center" className={classes.iconCell} />
          </TableRow>
          {haveOtherFuel === true
            && (
            <TableRow>
              <TableCell>Other Fuel</TableCell>
              <TableCell align="right">{fmtNumber(shift.salesSummary.otherFuelDollar)}</TableCell>
              <TableCell align="center" className={classes.iconCell}>
                <IconButton className={classes.iconButton} aria-label="edit" disabled={!editOK}>
                  <Tooltip title="Adjust Other Fuel" placement="right">
                    <UpdateIcon />
                  </Tooltip>
                </IconButton>
              </TableCell>
            </TableRow>
            )
          }
          <TableRow>
            <TableCell>Non-Fuel</TableCell>
            <TableCell align="right">{fmtNumber(salesSummary.totalNonFuel)}</TableCell>
            <TableCell align="center" className={classes.iconCell} />
          </TableRow>
          <TableRow>
            <TableCell className={classes.totalsCell}>Total ($)</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.totalSales)}</TableCell>
            <TableCell align="center" className={classes.iconCell} />
          </TableRow>
          <TableRow>
            <TableCell className={classes.totalsCell}>Total Fuel (L)</TableCell>
            <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.fuelLitre, 3)}</TableCell>
            <TableCell align="center" className={classes.iconCell} />
          </TableRow>
          {haveOtherFuel === true
            && (
            <TableRow>
              <TableCell className={classes.totalsCell}>Total Other Fuel (L)</TableCell>
              <TableCell align="right" className={classes.totalsCell}>{fmtNumber(salesSummary.otherFuelLitre, 3)}</TableCell>
              <TableCell align="center" className={classes.iconCell} />
            </TableRow>
            )
          }
        </TableBody>
      </Table>
    </Paper>
  )
}
