import React from 'react'
import { useSelector } from 'react-redux'

import EditIcon from '@material-ui/icons/Edit'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@material-ui/core'

import CheckComplete from '../../../shared/CheckComplete'
import FormatNumber from '../../../shared/FormatNumber'


const useStyles = makeStyles(theme => ({
  adjustButton: {
    width: '100%',
  },
  editIcon: {
    marginLeft: theme.spacing(1),
  },
  iconButton: {
    padding: 0,
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

export default function AttendantView() {
  const classes = useStyles()
  const sales = useSelector(state => state.sales)

  const shift = sales.dayInfo.activeShift
  if (!shift) return null

  return (
    <Paper className={classes.root} square>
      <Typography variant="h6" className={classes.title}>
        Attendant
      </Typography>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>
              {`${shift.attendant.iD.nameLast}, ${shift.attendant.iD.nameFirst} `}
              {'\u00A0'}
              <IconButton className={classes.iconButton} aria-label="edit">
                <Tooltip title="Edit Attendant" placement="right">
                  <EditIcon />
                </Tooltip>
              </IconButton>
            </TableCell>
            <TableCell />
          </TableRow>

          <TableRow>
            <TableCell>Sheet Completed</TableCell>
            <TableCell>
              <CheckComplete value={shift.attendant.sheetComplete} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Over-short Checked</TableCell>
            <TableCell>
              <CheckComplete value={shift.attendant.overshortComplete} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Overshort Amount Submitted</TableCell>
            <TableCell>
              <FormatNumber value={shift.attendant.overshortValue} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button
        className={classes.adjustButton}
        color="secondary"
        variant="outlined"
      >
        Adjustment Comments
        <EditIcon color="secondary" className={classes.editIcon} />
      </Button>
    </Paper>
  )
}
